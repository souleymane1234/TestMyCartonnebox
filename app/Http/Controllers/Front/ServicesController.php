<?php

namespace App\Http\Controllers\Front;

use Log;
use App\Models\User;
use App\Models\Abonne;
use App\Models\Service;
use App\Models\Categorie;
use App\Models\Transaction;
use App\Models\Ressource;
use App\Models\Watchmoovie;
use App\Models\Abonnement;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Services\OrderService;

class ServicesController extends Controller
{
    protected $orderService;

    // Injecter OrderService via le constructeur
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function listing($url, Request $request)
    {

        $search = $request['search'];
        if ($search == "") {
            $categoryCount = Categorie::where(['url' => $url, 'status' => 0])->count();
            if ($categoryCount > 0) {
                $userIsAuthenticated = auth()->check();
                if ($userIsAuthenticated == null) {
                    $imagecompte = [];
                } else {
                    $imagecompte = auth()->user()->image;
                }
                $categoryDetails = Categorie::catDetails($url);
                $categoryServices = Service::whereIn('categorie_id', $categoryDetails['catIds'])->where('status', 0);
                $title = Service::join("categories", 'services.categorie_id', '=', 'categories.id')->whereIn('categorie_id', $categoryDetails['catIds'])->first();
                $categoryServices = $categoryServices->paginate(12);
                $categories = Service::whereIn('categorie_id', $categoryDetails['catIds'])->where('status', 0)->count();



                return view('web.listing')->with(compact('categoryDetails', 'categoryServices', 'title', 'userIsAuthenticated', 'categories', 'imagecompte'));
            } else {
                abort(404);
            }
        } else {
            $categoryCount = Categorie::where(['url' => $url, 'status' => 0])->count();
            if ($categoryCount > 0) {
                $userIsAuthenticated = auth()->check();
                if ($userIsAuthenticated == null) {
                    $imagecompte = [];
                } else {
                    $imagecompte = auth()->user()->image;
                }
                $categoryDetails = Categorie::catDetails($url);
                $categoryServices = Service::whereIn('categorie_id', $categoryDetails['catIds'])
                    ->where('status', 0)->where('nom_service', 'LIKE', "%$search%");
                $title = Service::join("categories", 'services.categorie_id', '=', 'categories.id')
                    ->whereIn('categorie_id', $categoryDetails['catIds'])->first();
                $categoryServices = $categoryServices->paginate(12);
                $categories = Service::whereIn('categorie_id', $categoryDetails['catIds'])->where('status', 0)->count();



                return view('web.listing')->with(compact('categoryDetails', 'categoryServices', 'title', 'userIsAuthenticated', 'categories', 'imagecompte'));
            } else {
                abort(404);
            }
        }
    }

    public function details($service_url)
    {

        $userIsAuthenticated = auth()->check();
        if ($userIsAuthenticated == null) {
            $imagecompte = [];
        } else {
            $imagecompte = auth()->user()->image;
        }
        $productDetails = Service::with('categories')->where('service_url', $service_url)->first();
        if ($productDetails == null) {
            abort(404);
        } else {
            $productDetails = Service::with('categories')->where('service_url', $service_url)->first();

            $services = Service::select('credential')->where('service_url', $service_url)->first();

            $service = json_decode($services);

            $bundles = $service->credential->bundle;

            $credential = $service->credential;

            $categorie_id = Service::with('categories')->where('service_url', $service_url)->value('categorie_id');

            $category = Categorie::select('url', 'nom_categorie')->where('id', $categorie_id)->first();

            $otherservices = Service::with('categories')
                ->where('categorie_id', $categorie_id)
                ->where('service_url', '!=', $service_url)
                ->where('status', 0)
                ->limit(4)
                ->get();

            $relatedProducts = Service::limit(4)->inRandomOrder()->where('service_url', '!=', $service_url)->where('status', 0)->get()->toArray();

            // dd($credential);

            return view('web.detail')->with(compact('productDetails', 'services', 'bundles', 'userIsAuthenticated', 'credential', 'otherservices', 'relatedProducts', 'category', 'imagecompte'));
        }
    }

    public function watchMoovie($moovie_name) {
        try {
            // Authentifier l'utilisateur à partir du token JWT, si disponible
            $user = null;
            if (JWTAuth::getToken()) {
                $user = JWTAuth::parseToken()->authenticate();
            }

            Log::info('user :', ['user' => $user]);

            $columnsReturn = ['title', 'status', 'description', 'number_views', 'price', 'service_id', 'images', 'id', 'code_sms', 'price_ussd', 'link'];

            // Charger la relation 'service' avec 'partenaire'
            $query = Ressource::with(['service.partenaires'])
                ->select($columnsReturn)
                ->where('status', 0);

            $moovie_name_format = str_replace("_", " ", $moovie_name);
            $characters = str_split($moovie_name_format);
            $pattern = '';

            foreach ($characters as $char) {
                $pattern .= $char . '.*';
            }

            $pattern = rtrim($pattern, '.*');
            $query->whereRaw("title REGEXP ?", [$pattern]);
            $moovie = $query->first();

            if ($moovie) {
                if ($user) {
                    // Vérifier si l'utilisateur a déjà accès à la vidéo
                    $watchMoovie = Watchmoovie::where('user_id', $user->id)
                        ->where('ressource_id', $moovie->id)
                        ->where('state', true)
                        ->first();

                    if ($watchMoovie || $moovie->price == 0) {
                        return $this->generateSuccessResponse($moovie, $columnsReturn);
                    } else {
                        // Vérifier l'abonnement si la vidéo est payante
                        $abonnement = Abonnement::where('user_id', $user->id)
                            ->where('service_id', $moovie->service_id)
                            ->where('state', true)
                            ->first();

                        if ($abonnement) {
                            return $this->generateSuccessResponse($moovie, $columnsReturn);
                        }

                        return response()->json([
                            'success' => false,
                            'message' => "Vous n'êtes pas autorisé pour cette vidéo",
                        ], Response::HTTP_OK);
                    }
                } else {
                    // Utilisateur non connecté, accès autorisé seulement si la vidéo est gratuite
                    if ($moovie->price == 0) {
                        return $this->generateSuccessResponse($moovie, $columnsReturn);
                    }

                    return response()->json([
                        'success' => false,
                        'message' => 'Veuillez vous connecter pour accéder à cette vidéo payante',
                    ], Response::HTTP_OK);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun contenu trouvé, veuillez vérifier le lien',
                ], Response::HTTP_OK);
            }
        } catch (\Exception $exception) {
            Log::info('erreur :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayer plus tard.',
            ], Response::HTTP_OK);
        }
    }

    /**
     * Générer une réponse pour les vidéos disponibles
     */
    private function generateSuccessResponse($moovie, $columnsReturn) {
        $data['moovie'] = $moovie;
        $data['similar'] = Ressource::with(['service.partenaires'])
            ->select($columnsReturn)
            ->where('status', 0)
            ->where('service_id', $moovie->service_id)
            ->inRandomOrder()
            ->get()
            ->makeHidden(['link']);

        return response()->json([
            'success' => true,
            'data' => $data,
        ], Response::HTTP_OK);
    }


    public function bundle()
    {
        return view('web.bundle');
    }

    function convertToDays($duration)
    {
        // Remettre tout en minuscule pour simplifier le traitement
        $duration = strtolower($duration);

        // Définir les correspondances entre les unités de temps et le nombre de jours
        $units = [
            'jr' => 1,
            'jrs' => 1,
            'jours' => 1,
            'semaine' => 7,
            'semaines' => 7,
            'mois' => 30,  // Estimation d'un mois à 30 jours
            'an' => 365,
            'ans' => 365,
        ];

        // Utiliser une regex pour extraire le nombre et l'unité
        if (preg_match('/(\d+)\s*(\w+)/', $duration, $matches)) {
            $number = (int)$matches[1];
            $unit = $matches[2];

            // Vérifier si l'unité est dans le tableau $units
            if (array_key_exists($unit, $units)) {
                // Calculer le nombre de jours
                return $number * $units[$unit];
            }
        }

        // Retourner 0 par défaut si aucune correspondance n'est trouvée
        return 0;
    }

    // Appeler le service dans une méthode de contrôleur
    public function createOrder(Request $request)
    {
        // Règles de validation
        $rules = [
            'numberClient' => 'required|digits:10',
            'typeService' => 'required',
            'amount' => 'required|integer',
        ];

        // Messages personnalisés
        $customMessage = [
            'numberClient.required' => 'Entrez le numéro de téléphone',
            'numberClient.digits' => 'Entrez un numéro de 10 chiffres',
            'typeService.required' => 'Veuillez sélectionner le moyen de paiement',
            'amount.required' => 'Le montant à débiter est obligatoire',
            'amount.integer' => 'Le montant doit être un nombre entier',
        ];

        // Validation de la requête
        $this->validate($request, $rules, $customMessage);

        try {
            // Authentifier l'utilisateur à partir du token JWT
            $user = JWTAuth::parseToken()->authenticate();

            // Générer une référence unique pour la commande
            $reference = Str::random(16); // Génère une chaîne de caractères aléatoire de 16 caractères

            // Récupérer les paramètres de la requête
            $numberClient = $request->input('numberClient');
            $typeService = $request->input('typeService');
            $amount = $request->input('amount');
            $otp = $request->input('otp'); // Peut être nul

            // Créer une nouvelle commande dans la table "orders"
            $order = Order::create([
                'amount' => $amount,
                'my_reference' => $reference,
                'typeService' => $typeService,
                'numberClient' => $numberClient,
                'user_id' => $user->id, // ID de l'utilisateur authentifié
                'state' => 'INITIALISE', // Statut par défaut
                'userAgent' => $request->header('User-Agent') // Récupérer l'User Agent du client
            ]);

            // Appeler la méthode "buyService" du service OrderService
            $response = $this->orderService->buyService($numberClient, $typeService, $amount, $reference, $otp);

            // Loguer la réponse de l'API pour traçabilité
            Log::error('CENTRAL API :', ['response' => $response]);

            // Vérifier si la réponse de l'API est valide
            if ($response['etat'] && isset($response['result'])) {

                $order->update([
                    'state' => $response['result']['state'], // État de la transaction
                    'transaction_reference' => $response['result']['transaction_reference'], // Référence de la transaction du service mobile money
                    'payment_url' => $response['result']['payment_url'] ?? null, // URL de paiement (peut être nul)
                ]);
                return response()->json([
                    'success' => $response['etat'],  // État retourné par l'API
                    'data' => $order, // Commande mise à jour
                ]);
            } else {
                $order->delete();

                return response()->json([
                        'success' => $response['etat'],  // État retourné par l'API
                        'message' => $response['error'][0] ?? 'Une erreur inconnue est survenue', // Premier élément du tableau 'error' ou message par défaut
                    ], 400);

            }
        } catch (\Throwable $th) {
            // Gérer les exceptions et retourner une erreur
            return response()->json([
                'error' => 'Une erreur est survenue lors de la création de la commande.',
                'details' => $th->getMessage()
            ], 500);
        }
    }

    public function detailsOrder($my_reference)
   {
    $user = JWTAuth::parseToken()->authenticate();

    $order = Order::where('my_reference', $my_reference)
                ->where('user_id', $user->id)->first();

      if ($order == null) {

         return response()->json([
            'success' => false,
            'message' => 'Cette commande n\'existe pas'
         ], Response::HTTP_OK);

      } else {

         return response()->json([
            'success' => true,
            'data' => $order
         ], Response::HTTP_OK);
      }
   }


   public function callbackOrder(Request $request)
   {

    $data = $request->all();
    $result = $data['result'];

    $order = Order::where('my_reference', $result['partner_reference'])->where('numberClient', $result['recipient_phone_number'])->first();

      if ($order == null) {

         return response()->json([
            'success' => false,
         ], Response::HTTP_OK);

      } else {
            $order->update(['transaction_reference' => $result['transaction_reference'], 'state' => $result['state'], 'amount' => $result['amount_send_net'], ]);
         return response()->json([
            'success' => true,
         ], Response::HTTP_OK);
      }
   }




        public function demandeService(Request $request)
    {
        $rules = [
            'contact' => 'required|digits:10',
            'service_id' => 'required',
            // 'nom_service' => 'required',
            'forfait' => 'required',
            // 'image' => 'required',
            'amount' => 'required',
            'mode_paiement' => 'required',
        ];

        $customMessage = [
            'contact.required' => 'Entrez le numéro de téléphone',
            'service_id.required' => 'Entrez le service',
            // 'nom_service.required' => 'Entrez le partenaire',
            'forfait.required' => 'Le forfait n\'est pas defini',
            // 'image.required' => 'L\'image n\'est pas defini',
            'amount.required' => 'Le montant n\'est pas defini',
            'mode_paiement.required' => 'Le type de paiment est requis',
        ];
        $this->validate($request, $rules, $customMessage);

        try {



            if ($request->mode_paiement != "AIR_TIME") {
                return response()->json([
                    'success' => false,
                    'message' => 'Le mode de paiement est invalide.',
                ], Response::HTTP_OK);
            }

            // vérifier cenuméro existe dans la bdd
            $numberExist = DB::table('users')->where('contact', $request->contact)->count();
            if ($numberExist == 0) {
                $verification_code = random_int(1000, 9999);

                // Ajouter le numéro dans la bdd
                $user = new User();
                $user->code = $verification_code;
                $user->contact = $request->contact;
                $user->referent = Str::random(6);
                $user->save();

                $day = date('d');
                $month = date('m');
                $year = date('Y');
                $a = "MP";
                $heure = date("h:i:sa");

                $ref = $a . '-' . intval($month) . intval($day) . $year . $heure;

                $order_url =  Crypt::encrypt($ref);


                $partenaire_id = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('partenaire_id');

                $service_name = Service::select('credential')->where('id', $request->service_id)->first();

                $service = json_decode($service_name);

                $servicename = $service->credential->service_name;

                // Récupération du nom du service et l'image

                $nomService = Service::select('nom_service')->where('id', $request->service_id)->value('nom_service');

                $imageService = Service::where('id', $request->service_id)->value('image');

                Log::info('Demande :', ['data' => $nomService]);
                // Log::info('Demande :', ['data' => $imageService]);


                $contact = $request->contact;

                $mobile = '225' . $contact;

                // Obtenir le xuser et le xtoken
                $xuser = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('x_user');

                $xtoken = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('x_token');

                // Obtenir l'url
                $serviceurl = Service::select('credential')->where('id', $request->service_id)->first();

                $apiURL = $serviceurl->credential['url_demande_abonnement'];

                if ($apiURL == null) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ce service est indisponible.',
                    ], Response::HTTP_OK);
                }

                // Headers
                $headers = [
                    'xuser:' . $xuser,
                    'xtoken:' . $xtoken,
                    'content-type: application/json'
                ];

                // POST Data
                $postInput = [
                    'forfait' => $request->forfait,
                    'amount' => $request->amount,
                    'msisdn' => $mobile,
                    'order_id' => $ref,
                    'service_name' => $servicename
                ];



                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $apiURL);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postInput));
                $result = curl_exec($ch);
                if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200) {
                    Log::info('Demande :', ['data' => $result]);

                    $info = json_decode($result);

                    $status = $info->statusCode;

                    if ($status == "2032") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Le solde de l\'abonné est insuffisant.',
                        ], Response::HTTP_OK);
                    } else if ($status == "2084") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Vous êtes déjà inscrit ou abonné au service demandé.',
                        ], Response::HTTP_OK);
                    } else if ($status == "2061") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Veuillez ressayer plus tard.',
                        ], Response::HTTP_OK);
                    }

                    // Ajouter la transaction dans la bdd
                    $order = new Transaction();
                    $order->order_id = $ref;
                    $order->user_id = $user->id;
                    $order->service_id = $request->service_id;
                    $order->partenaire_id = $partenaire_id;
                    $order->nom_service = $nomService;
                    $order->forfait = $request->forfait;
                    $order->amount = $request->amount;
                    $order->msisdn = $mobile;
                    $order->service_name = $servicename;
                    $order->order_url = $order_url;
                    $order->image = $imageService;
                    $order->canal = "web";
                    $order->mode_paiement = $request->mode_paiement;
                    $order->save();

                    $lastID = $order->id;

                    $transaction = json_decode($result);


                    $transaction_id = $transaction->transaction_id;


                    // Mise à jour de la transaction
                    Transaction::where('id', $lastID)->update(['transactionid' => $transaction_id, 'xuser' => $xuser, 'xtoken' => $xtoken]);

                    return response()->json([
                        'success' => true,
                        'message' => 'La souscription a été bien effectuée.',
                    ], Response::HTTP_OK);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Service non disponible',
                    ], Response::HTTP_OK);
                }
                curl_close($ch);
            } else {
                $day = date('d');
                $month = date('m');
                $year = date('Y');
                $a = "MP";
                $heure = date("h:i:sa");

                $ref = $a . '-' . intval($month) . intval($day) . $year . $heure;

                $order_url =  Crypt::encrypt($ref);


                $partenaire_id = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('partenaire_id');

                $service_name = Service::select('credential')->where('id', $request->service_id)->first();


                $service = json_decode($service_name);

                $servicename = $service->credential->service_name;

                // Récupération du nom du service et l'image

                $nomService = Service::where('id', $request->service_id)->value('nom_service');

                $imageService = Service::where('id', $request->service_id)->value('image');



                $contact = $request->contact;

                $mobile = '225' . $contact;

                // Obtenir le xuser et le xtoken
                $xuser = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('x_user');

                $xtoken = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                    ->where('services.id', $request->service_id)
                    ->value('x_token');

                // Obtenir l'url
                $serviceurl = Service::select('credential')->where('id', $request->service_id)->first();

                $apiURL = $serviceurl->credential['url_demande_abonnement'];

                if ($apiURL == null) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ce service est indisponible.',
                    ], Response::HTTP_OK);
                }

                //verifier si l'utilisateur à dejà un abonnement à ce service

                // $auth = Transaction::where('service_id', $request->service_id)->where('user_id', Auth::user()->id)->count();
                // Headers
                $headers = [
                    'xuser:' . $xuser,
                    'xtoken:' . $xtoken,
                    'content-type: application/json'
                ];

                // POST Data
                $postInput = [
                    'forfait' => $request->forfait,
                    'amount' => $request->amount,
                    'msisdn' => $mobile,
                    'order_id' => $ref,
                    'service_name' => $servicename
                ];



                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $apiURL);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postInput));
                $result = curl_exec($ch);
                if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200) {
                    Log::info('Demande :', ['data' => $result]);

                    $info = json_decode($result);

                    $status = $info->statusCode;

                    if ($status == "2032") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Le solde de l\'abonné est insuffisant.',
                        ], Response::HTTP_OK);
                    } else if ($status == "2084") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Vous êtes déjà inscrit ou abonné au service demandé.',
                        ], Response::HTTP_OK);
                    } else if ($status == "2061") {

                        return response()->json([
                            'success' => false,
                            'message' => 'Veuillez ressayer plus tard.',
                        ], Response::HTTP_OK);
                    }

                    $id = User::where('contact', $request->contact)->value('id');

                    // Ajouter la transaction dans la bdd
                    $order = new Transaction();
                    $order->order_id = $ref;
                    $order->user_id = $id;
                    $order->service_id = $request->service_id;
                    $order->partenaire_id = $partenaire_id;
                    $order->nom_service = $nomService;
                    $order->forfait = $request->forfait;
                    $order->amount = $request->amount;
                    $order->msisdn = $mobile;
                    $order->service_name = $servicename;
                    $order->order_url = $order_url;
                    $order->image = $imageService;
                    $order->canal = "web";
                    $order->mode_paiement = $request->mode_paiement;
                    $order->save();

                    $lastID = $order->id;

                    $transaction = json_decode($result);

                    $transaction_id = $transaction->transaction_id;


                    // Mise à jour de la transaction
                    Transaction::where('id', $lastID)->update(['transactionid' => $transaction_id, 'xuser' => $xuser, 'xtoken' => $xtoken]);

                    return response()->json([
                        'success' => true,
                        'message' => 'Veuillez consulter votre messagerie.',
                        'data' => $info,
                    ], Response::HTTP_OK);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ce service est indisponible.',
                    ], Response::HTTP_OK);
                }
                curl_close($ch);
            }
        } catch (\Exception $exception) {
            Log::info('error :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayez plus tard.',
            ], Response::HTTP_OK);
        }
    }

    public function subscribe(Request $request)
    {
        $user =  JWTAuth::parseToken()->authenticate();
        $client = User::where('id', '=', $user->id)->first();

        try {

            $rules = [
            'mode_paiement' => 'required',
        ];

        $customMessage = [
            'mode_paiement.required' => 'Le type de paiment est requis',
        ];
        $this->validate($request, $rules, $customMessage);
                if ($request->has('ressource_id')) {
                    $ressource = Ressource::where('id', intval($request->ressource_id))
                      ->where('status', 0)
                      ->first();

                    if(!$ressource) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Vidéo de souscription non trouvé',
                        ], Response::HTTP_NOT_FOUND);
                    }
                    if($ressource->price == 0) {
                        $watchMoovie = new Watchmoovie();
                        $watchMoovie->user_id = $client->id;
                        $watchMoovie->ressource_id = $ressource->id;
                        $watchMoovie->save();

                        // Charger la ressource associée à Watchmoovie
                        $watchMoovie->load('ressource');

                        return response()->json([
                            'success' => true,
                            'message' => 'Vous pouvez regardez cette vidéo pendant 24h',
                            'data' => $watchMoovie->ressource,
                        ], Response::HTTP_OK);
                    } else {
                        if ($request->mode_paiement == "E_PAYMENT") {
                            $my_reference = $request->my_reference;
                            $order = Order::where('my_reference', $my_reference)->where('user_id', $user->id)->where('used', false)->where('state', 'DONE')->first();
                            if($order != null && $order->amount >= $ressource->price) {
                                $order->update([
                                    'used' => true,
                                ]);
                                $watchMoovie = new Watchmoovie();
                                $watchMoovie->user_id = $client->id;
                                $watchMoovie->ressource_id = $ressource->id;
                                $watchMoovie->save();

                                $watchMoovie->load('ressource');

                                return response()->json([
                                    'success' => true,
                                    'message' => 'Vous pouvez regardez cette vidéo pendant 24h',
                                    'data' => $watchMoovie->ressource,
                                ], Response::HTTP_OK);
                            } else {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'Cet abonnement n\'existe pas'
                                ], Response::HTTP_OK);
                            }
                        }
                    }

                }
                elseif ($request->has('service_id')) {
                    $service = Service::where('id', intval($request->service_id))
                      ->where('status', 0)
                      ->first();
                    if ($request->mode_paiement == "E_PAYMENT") {
                            $my_reference = $request->my_reference;
                            $forfait = $request->forfait;
                            $order = Order::where('my_reference', $my_reference)->where('user_id', $user->id)->where('used', false)->where('state', 'DONE')->first();
                            if($order != null && $order->amount >= $forfait['tarif']) {
                                $order->update([
                                    'used' => true,
                                ]);
                                $abonnement = new Abonnement();
                                $abonnement->user_id = $client->id;
                                $abonnement->service_id = $service->id;
                                $abonnement->typePayments = $request->mode_paiement;
                                $abonnement->state = true;
                                $abonnement->numberDayOfSubscription = $this->convertToDays($forfait['periode']);
                                $abonnement->forfait = $forfait;
                                $abonnement->save();

                                $abonnement->load('service');

                                return response()->json([
                                    'success' => true,
                                    'message' => 'Vous pouvez regardez cette vidéo pendant 24h',
                                    'data' => $abonnement->service,
                                ], Response::HTTP_OK);
                            } else {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'Cet abonnement n\'existe pas'
                                ], Response::HTTP_OK);
                            }
                        }
                }

                elseif ($request->has('partenaire_id')) {
// Vérification de l'existence du partenaire
            $partenaire = Partenaire::where('id', intval($request->partenaire_id))->first();

            if (!$partenaire) {
                return response()->json([
                    'success' => false,
                    'message' => 'Partenaire non trouvé',
                ], Response::HTTP_NOT_FOUND);
            }

            if ($request->mode_paiement == "E_PAYMENT") {
                $my_reference = $request->my_reference;
                $order = Order::where('my_reference', $my_reference)
                    ->where('user_id', $user->id)
                    ->where('used', false)
                    ->where('state', 'DONE')
                    ->first();

                if ($order) {
                    $order->update(['used' => true]);

                    // Récupérer tous les services du partenaire
                    $services = $partenaire->services;

                    foreach ($services as $service) {
                        $abonnement = new Abonnement();
                        $abonnement->user_id = $client->id;
                        $abonnement->service_id = $service->id;
                        $abonnement->typePayments = $request->mode_paiement;
                        $abonnement->state = true;
                        $abonnement->numberDayOfSubscription = $this->convertToDays($request->forfait['periode']);
                        $abonnement->forfait = $request->forfait;
                        $abonnement->save();
                    }

                    return response()->json([
                        'success' => true,
                        'message' => 'Vous avez été abonné à tous les services du partenaire',
                        'data' => $services,
                    ], Response::HTTP_OK);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cet abonnement n\'existe pas',
                    ], Response::HTTP_OK);
                }
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Aucune data',
        ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            Log::info('error :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayez plus tard.',
            ], Response::HTTP_OK);
        }
    }

    public function demandeWithOtp(Request $request)
    {
        $rules = [
            'code_otp' => 'required',
            'transaction_id' => 'required',
        ];

        $customMessage = [
            'code_otp.required' => 'Entrez le numéro de téléphone',
            'transaction_id.required' => 'Entrez le numéro de la transaction',
        ];
        $this->validate($request, $rules, $customMessage);

        try {
            // Récupérer le service_name
            $serviceName = Transaction::select('nom_service')->where('transactionid', $request->transaction_id)->value('nom_service');

            $xuser = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                ->where('services.nom_service', $serviceName)
                ->value('x_user');


            $xtoken = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
                ->where('services.nom_service', $serviceName)
                ->value('x_token');

            // Obtenir l'url
            $serviceurl = Service::select('credential')->where('nom_service', $serviceName)->first();

            $apiURL = $serviceurl->credential['url_confirmation_abonnement'];

            // Headers
            $headers = [
                'xuser:' . $xuser,
                'xtoken:' . $xtoken,
                'content-type: application/json'
            ];

            // POST Data
            $postInput = [
                'transaction_id' => $request->transaction_id,
                'code_otp' => $request->code_otp,
            ];



            $info = Transaction::where('transactionid', $request->transaction_id)->first();

            Log::info('info :', ['data' => $info]);

            $contact = $info['msisdn'];
            $forfait = $info['forfait'];
            $nom_service = $info['nom_service'];
            $service_name = $info['service_name'];
            $user_id = $info['user_id'];
            $service_id = $info['service_id'];
            $partenaire_id = $info['partenaire_id'];
            $amount = $info['amount'];
            $image = $info['image'];

            Log::info($info);



            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $apiURL);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postInput));
            $result = curl_exec($ch);
            if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200) {
                $data = json_decode($result);

                Log::info('erreur :', ['data' => $result]);
                if ($data->statusCode === "0") {

                    $date_fin_abonnement = $data->date_fin_abonnement;

                    // Mise à jour de la transaction
                    Transaction::where('transactionid', $request->transaction_id)->update(['date_fin_abonnement' => $date_fin_abonnement, 'status' => "successful", 'etat' => 1]);

                    $verif = Abonne::where('msisdn', $contact)->where('nom_service', $nom_service)->count();
                    if ($verif == 0) {
                        // Enregistré l'abonné
                        $abonne = new Abonne();
                        $abonne->nom_service = $nom_service;
                        $abonne->service_name = $service_name;
                        $abonne->msisdn = $contact;
                        $abonne->forfait = $forfait;
                        $abonne->amount = $amount;
                        // $order->image = $image;
                        $abonne->transactionid = $request->transaction_id;
                        $abonne->user_id = $user_id;
                        $abonne->service_id = $service_id;
                        $abonne->partenaire_id = $partenaire_id;
                        $abonne->date_abonnement = date("Y-m-d");
                        $abonne->date_fin_abonnement = $date_fin_abonnement;
                        $abonne->save();

                        $msisdn = substr($contact, 3);
                        $user = User::where('id', $user_id)->get();

                        $contact = User::where('contact', $msisdn)->first();

                        $token = Auth::login($contact);

                        return response()->json([
                            'success' => true,
                            'message' => 'Souscription effectué avec succès.',
                            'user' => $user,
                            'authorization' => [
                                'token' => $token,
                                'type' => 'bearer',
                            ]
                        ], Response::HTTP_OK);
                    } else {

                        Abonne::where('msisdn', $contact)->where('nom_service', $nom_service)->update(['forfait' => $forfait, 'amount' => $amount, 'transactionid' => $request->transaction_id, 'date_desabonnement' => null]);

                        $msisdn = substr($contact, 3);
                        $user = User::where('id', $user_id)->get();

                        $contact = User::where('contact', $msisdn)->first();

                        $token = Auth::login($contact);

                        return response()->json([
                            'success' => true,
                            'message' => 'Souscription effectué avec succès.',
                            'user' => $user,
                            'authorization' => [
                                'token' => $token,
                                'type' => 'bearer',
                            ]
                        ], Response::HTTP_OK);
                    }
                } else if ($data->statusCode == "2032") {
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre crédit est insuffisant pour souscrire à cette offre.',
                    ], Response::HTTP_OK);
                } else if ($data->statusCode == "2061") {

                    return response()->json([
                        'success' => false,
                        'message' => 'Requête invalide.',
                    ], Response::HTTP_OK);
                } else if ($data->statusCode == "2084") {

                    return response()->json([
                        'success' => false,
                        'message' => 'Vous êtes déjà inscrit ou abonné au service demandé.',
                    ], Response::HTTP_OK);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Service indisponible veuillez ressayez plus tard.',
                    ], Response::HTTP_OK);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce service est indisponible.',
                ], Response::HTTP_OK);
            }
            curl_close($ch);
        } catch (\Exception $exception) {
            Log::info('erreur :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Service indisponible veuillez ressayez plus tard.',
            ], Response::HTTP_OK);
        }
    }

    public function desAbonnement(Request $request)
    {
        $rules = [
            'transaction_id' => 'required',

        ];

        $customMessage = [

            'transaction_id.required' => 'Entrez le numéro de la transaction',
        ];
        $this->validate($request, $rules, $customMessage);
        // try {

        $serviceName = Transaction::select('nom_service')->where('transactionid', $request->transaction_id)->value('nom_service');


        // Obtenir l'url
        $serviceurl = Service::select('credential')->where('nom_service', $serviceName)->first();

        $apiURL = $serviceurl->credential['url_desabonnement'];


        $xuser = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
            ->where('services.nom_service', $serviceName)
            ->value('x_user');


        $xtoken = Service::join("partenaires", 'services.partenaire_id', '=', 'partenaires.id')
            ->where('services.nom_service', $serviceName)
            ->value('x_token');

        // Headers
        $headers = [
            'xuser:' . $xuser,
            'xtoken:' . $xtoken,
            'content-type: application/json'
        ];

        // POST Data
        $postInput = [
            'transaction_id' => $request->transaction_id,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiURL);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postInput));
        $result = curl_exec($ch);
        curl_close($ch);
        Log::info('Desabonnement :', ['data' => $result]);

        $date =  date("Y-m-d");

        //  Mise à jour de la transaction
        Transaction::where('transactionid', $request->transaction_id)->update(['date_desabonnement' => $date, 'etat' => 'Desabonnement']);

        // Mise à jour de la table abonné

        Abonne::where('transactionid', $request->transaction_id)->update(['date_desabonnement' => date("Y-m-d")]);

        return response()->json([
            'success' => true,
            'message' => 'Vous êtes désabonnés de ce service.',
        ], Response::HTTP_OK);
        // } catch (\Exception $exception) {

        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Erreur.',
        //     ], Response::HTTP_OK);
        // }
    }
}
