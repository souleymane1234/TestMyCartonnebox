<?php

namespace App\Http\Controllers\Front;

use App\Models\User;
use App\Models\Offre;
use App\Models\Abonne;
use App\Models\Banner;
use App\Models\Chaine;
use App\Models\Partenaire;
use App\Models\Favori;
use App\Models\Service;
use App\Models\Categorie;
use App\Models\Transaction;
use App\Models\Ressource;
use App\Models\Watchmoovie;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class IndexController extends Controller
{
   public function pages(Request $request)
   {
      $request->session()->put('page', '/');

      $services = Categorie::with('service')
         ->orderby('position', 'asc')
         ->get()
         ->map(function ($query) {
            $query->setRelation('service', $query->service->take(4));
            return $query;
         });


      $slides = Banner::all();

      $userIsAuthenticated = auth()->check();

      if ($userIsAuthenticated == null) {
         $imagecompte = [];
      } else {
         $imagecompte = auth()->user()->image;
      }

      return view('web.welcome')->with(compact('services', 'userIsAuthenticated', 'imagecompte', 'slides'));
   }

   public function search(Request $request)
   {
      $q = $request->search;
      $result = Service::where('nom_service', 'LIKE', '%' . $q . '%')->get();
      return view('web.pages')->with(compact('result', 'q'));
   }

   public function getCategories()
   {
      try {
         $categories = Categorie::all();

         return response()->json([
            'success' => true,
            'data' => $categories
         ], Response::HTTP_OK);
      } catch (\Exception $exception) {
         Log::info('erreur :', ['data' => $exception]);
         return response()->json([
            'success' => false,
            'message' => 'Veuillez ressayez plus tard.',
         ], Response::HTTP_OK);
      }
   }

   public function getUniqueLanguagesForRessource()
{
    // Récupérer les langues uniques de la table Ressource
    $languages = Ressource::distinct()->pluck('language');

    return response()->json([
        'success' => true,
        'data' => $languages,
    ], Response::HTTP_OK);
}


   public function getServices(Request $request) {
        try {
            $user = null;
        $watchedRessources = [];
        $subscribedRessources = [];
        $combinedRessources = [];

        if ($request->hasHeader('Authorization')) {
            try {
                $user = JWTAuth::parseToken()->authenticate();

                // Si l'utilisateur est authentifié
                if ($user) {
                    // 1. Récupérer tous les ressource_id avec state = true pour cet utilisateur (Watchmoovie)
                    $watchedRessources = Watchmoovie::where('user_id', $user->id)
                        ->where('state', true)
                        ->pluck('ressource_id')
                        ->toArray();

                    // 2. Récupérer tous les service_id auxquels l'utilisateur est abonné avec state = true (Abonnement)
                    $subscribedServiceIds = Abonnement::where('user_id', $user->id)
                        ->where('state', true)
                        ->pluck('service_id')
                        ->toArray();

                    // 3. Récupérer tous les ressource_id où service_id est dans subscribedServiceIds (Ressource)
                    $subscribedRessources = Ressource::whereIn('service_id', $subscribedServiceIds)
                        ->pluck('id')
                        ->toArray();

                    // 4. Combiner watchedRessources et subscribedRessources en supprimant les doublons
                    $combinedRessources = array_values(array_unique(array_merge($watchedRessources, $subscribedRessources)));
                }
            } catch (\Exception $e) {
                Log::info('Token invalide ou expiré : ', ['error' => $e->getMessage()]);
            }
        }


            $columnsReturn = ['title', 'status', 'description', 'number_views', 'price', 'service_id', 'images', 'id', 'code_sms', 'price_ussd', 'language'];

            // Charger la relation 'service' avec 'partenaire'
            $query = Ressource::with(['service.partenaires'])
                ->select($columnsReturn)
                ->where('status', 0);

            // Filtrer par catégorie si spécifié
            if ($request->has('category')) {
                $query->whereHas('categorie', function($q) use ($request) {
                    $q->where('url', $request->category);
                });
            }

            // Filtrer par slug (id)
            if ($request->has('slug')) {
                $query->where('id', $request->slug);
            }

            // Appliquer le tri selon les critères définis
            if ($request->has('sort')) {
                if ($request->sort == 'random') {
                    $query->inRandomOrder();
                } elseif ($request->sort == 'newer') {
                    $query->orderBy('id', 'desc');
                } elseif ($request->sort == 'popular') {
                    $query->where('price', '>', 0)->orderBy('number_views', 'desc');
                } elseif ($request->sort == 'free') {
                    $query->where('price', 0);
                }
            }

            // Recherche par motif dans le titre
            if ($request->has('search')) {
                $pattern = $request->search;
                $characters = str_split($pattern);
                $pattern = '';

                foreach ($characters as $char) {
                    $pattern .= $char . '.*';
                }

                $pattern = rtrim($pattern, '.*');
                $query->whereRaw("title REGEXP ?", [$pattern]);
            }

            // Filtrer par languages s'il est spécifié et non vide
            if ($request->has('languages') && !empty($request->languages)) {
                $languages = explode(',', $request->languages);
                $query->whereIn('language', $languages);
            }

            // Appliquer la limite si elle est définie
            if ($request->has('limit')) {
                $limit = $request->limit;
                $services = $query->limit($limit)->get();
            } else {
                $services = $query->get();
            }

            // Masquer le champ 'link' des services
            // $services->each(function ($ressource) {
            //     $ressource->service->makeHidden('link');
            // });

            // Retourner les données au format JSON avec les services et leurs partenaires associés
            return response()->json([
                'success' => true,
                'data' => $services,
                'subscribeMoovies' => $combinedRessources,
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            Log::info('erreur :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayer plus tard.',
            ], Response::HTTP_OK);
        }
    }

    public function detailsPartenaire($partenaire_id, Request $request)
    {
        try {
            $user = null;
            $watchedRessources = [];
            $subscribedRessources = [];
            $combinedRessources = [];

            if ($request->hasHeader('Authorization')) {
                try {
                    $user = JWTAuth::parseToken()->authenticate();

                    // Si l'utilisateur est authentifié
                    if ($user) {
                        // 1. Récupérer tous les ressource_id avec state = true pour cet utilisateur (Watchmoovie)
                        $watchedRessources = Watchmoovie::where('user_id', $user->id)
                            ->where('state', true)
                            ->pluck('ressource_id')
                            ->toArray();

                        // 2. Récupérer tous les service_id auxquels l'utilisateur est abonné avec state = true (Abonnement)
                        $subscribedServiceIds = Abonnement::where('user_id', $user->id)
                            ->where('state', true)
                            ->pluck('service_id')
                            ->toArray();

                        // 3. Récupérer tous les ressource_id où service_id est dans subscribedServiceIds (Ressource)
                        $subscribedRessources = Ressource::whereIn('service_id', $subscribedServiceIds)
                            ->pluck('id')
                            ->toArray();


                        // 4. Combiner watchedRessources et subscribedRessources en supprimant les doublons
                        $combinedRessources = array_values(array_unique(array_merge($watchedRessources, $subscribedRessources)));
                    }
                } catch (\Exception $e) {
                    Log::info('Token invalide ou expiré : ', ['error' => $e->getMessage()]);
                }
            }
            // Remplacer les underscores par des espaces pour retrouver le nom du partenaire

            // Rechercher le partenaire correspondant
            $partenaire = Partenaire::where('id', intval($partenaire_id))->first();

            if (!$partenaire) {
                return response()->json([
                    'success' => false,
                    'message' => 'Partenaire non trouvé.',
                ], Response::HTTP_NOT_FOUND);
            }

            // Récupérer les services associés au partenaire
            $services = Service::where('partenaire_id', $partenaire->id)->pluck('id');

            // Récupérer les ressources associées aux services du partenaire
            $resources = Ressource::with(['service.partenaires'])
                ->whereIn('service_id', $services)
                ->orderBy('id', 'desc')  // Tri du plus récent au plus ancien
                ->get()
                ->makeHidden(['link']); // Masquer le champ 'link'

            // Retourner les détails du partenaire avec les ressources associées
            return response()->json([
                'success' => true,
                'data' => [
                    'partenaire' => $partenaire,  // Informations du partenaire
                    'resources' => $resources,   // Ressources associées
                    'subscribeMoovies' => $combinedRessources,
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            Log::info('erreur :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayer plus tard.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function incrementViewMoovie($ressource_id) {
        try {

            $ressource = Ressource::where('id', intval($ressource_id))->increment('number_views');
            return response()->json([
                            'success' => true,
                        ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayer plus tard.',
            ], Response::HTTP_OK);
        }
    }

    public function detailsProduction($service_id, Request $request)
    {
        try {
            $user = null;
            $watchedRessources = [];
            $subscribedRessources = [];
            $combinedRessources = [];

            if ($request->hasHeader('Authorization')) {
                try {
                    $user = JWTAuth::parseToken()->authenticate();

                    // Si l'utilisateur est authentifié
                    if ($user) {
                        // 1. Récupérer tous les ressource_id avec state = true pour cet utilisateur (Watchmoovie)
                        $watchedRessources = Watchmoovie::where('user_id', $user->id)
                            ->where('state', true)
                            ->pluck('ressource_id')
                            ->toArray();

                        // 2. Récupérer tous les service_id auxquels l'utilisateur est abonné avec state = true (Abonnement)
                        $subscribedServiceIds = Abonnement::where('user_id', $user->id)
                            ->where('state', true)
                            ->pluck('service_id')
                            ->toArray();

                        // 3. Récupérer tous les ressource_id où service_id est dans subscribedServiceIds (Ressource)
                        $subscribedRessources = Ressource::whereIn('service_id', $subscribedServiceIds)
                            ->pluck('id')
                            ->toArray();

                        // 4. Combiner watchedRessources et subscribedRessources en supprimant les doublons
                        $combinedRessources = array_values(array_unique(array_merge($watchedRessources, $subscribedRessources)));
                    }
                } catch (\Exception $e) {
                    Log::info('Token invalide ou expiré : ', ['error' => $e->getMessage()]);
                }
            }

            $columnsReturn = ['title', 'status', 'description', 'number_views', 'price', 'service_id', 'images', 'id', 'code_sms', 'price_ussd', 'language'];

            $query = Ressource::with(['service.partenaires'])
                ->select($columnsReturn)
                ->where('status', 0)
                ->where('service_id', intval($service_id));

            if ($request->has('sort')) {
                if ($request->sort == 'random') {
                    $query->inRandomOrder();
                } elseif ($request->sort == 'newer') {
                    $query->orderBy('id', 'desc');
                } elseif ($request->sort == 'popular') {
                    $query->where('price', '>', 0)->orderBy('number_views', 'desc');
                } elseif ($request->sort == 'free') {
                    $query->where('price', 0);
                }
            }
            $services['moovies'] = $query->get();
            $services['info'] = Service::where('id', intval($service_id))->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'services' => $services,
                    'subscribeMoovies' => $combinedRessources,
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $exception) {
            Log::info('erreur :', ['data' => $exception]);
            return response()->json([
                'success' => false,
                'message' => 'Veuillez ressayer plus tard.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }






    public function getBanners()
   {
      try {
         $banners = Banner::all();

         return response()->json([
            'success' => true,
            'data' => $banners
         ], Response::HTTP_OK);
      } catch (\Exception $exception) {
         Log::info('erreur :', ['data' => $exception]);
         return response()->json([
            'success' => false,
            'message' => 'Veuillez ressayez plus tard.',
         ], Response::HTTP_OK);
      }
   }

   public function details($service_url)
   {
    $name_service = str_replace("_", " ", $service_url);
    $columnsReturn = ['title', 'status', 'description', 'number_views', 'price', 'service_id', 'images', 'id', 'code_sms', 'price_ussd', 'language'];

    $productDetails = Ressource::with(['service.partenaires'])
                ->select($columnsReturn)
                ->where('status', 0)
                ->where('title', $name_service)->first();

      if ($productDetails == null) {

         return response()->json([
            'success' => false,
            'data' => 'Ce service n\'existe pas'
         ], Response::HTTP_OK);

      } else {
         $data['productDetails'] = $productDetails;


         $service_id = $productDetails->service_id;

         $data['otherservices'] = Ressource::with(['service.partenaires'])
                ->select($columnsReturn)->inRandomOrder()
            ->where('service_id', $service_id)
            ->where('title', '!=', $name_service)
            ->where('status', 0)
            ->limit(8)
            ->get();

         return response()->json([
            'success' => true,
            'data' => $data
         ], Response::HTTP_OK);
      }
   }



   public function detailsCategory($category_url)
   {
      $Data = Categorie::where('url', $category_url)->get();

      return response()->json([
         'success' => true,
         'data' => $Data
      ], Response::HTTP_OK);
   }

   public function getChannels()
   {
      $Data = Partenaire::all();

      return response()->json([
         'success' => true,
         'data' => $Data
      ], Response::HTTP_OK);
   }

   public function updateSubscription(Request $request)
   {
      $data = $request->all();

      foreach ($data as $subscriptionData) {

         // Extraire le contact en supprimant les 3 premiers caractères
         $contact = substr($subscriptionData['msisdn'], 3);

         // Rechercher le service correspondant
         $service = Service::where('service_name', $subscriptionData['service_name'])->first();

         // Rechercher l'utilisateur correspondant
         $user = User::where('contact', $contact)->first();

         // Vérifier si l'utilisateur existe
         if (!$user) {
            // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
            $user = User::create([
               'contact' => '225' . $contact,
               'status' => 0,
            ]);
         }

         // Mettre à jour ou créer la transaction
         Transaction::updateOrCreate(
            ['msisdn' => $subscriptionData['msisdn']],
            [
               'nom_service' => $service['nom_service'],
               'forfait' => $subscriptionData['forfait'],
               'amount' => $subscriptionData['amount'],
               'transaction_id' => $subscriptionData['transaction_id'],
               'service_name' => $subscriptionData['service_name'],
               'date_fin_abonnement' => $subscriptionData['date_fin_abonnement'],
               'user_id' => $user->id,
               'service_id' => $service->id,
               'partenaire_id' => $service->partenaire_id,
            ]
         );
      }
   }
}
