<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\Partenaire;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PartenaireController extends Controller
{
    public function partenaires()
    {
        $respo = Admin::select('role')->where('id', Auth::guard('admin')->user()->id)->value('role');
        $partenaires = Partenaire::all();
        return view('admin.partenaires.partenaires')->with(compact('partenaires', 'respo'));
    }

    public function addEditPartenaire(Request $request, $id = null)
    {
       
        if ($id == "") {
            $title = 'Ajouter partenaire';
            // ajout de fonctionnalités
            $partenaire = new Partenaire();
            $partenairedata = array();

            $message = "Le partenaire a ete ajouté avec succès !";
        } else {
            $title = "Modifier partenaire";
            $partenairedata = Partenaire::where('id', $id)->first();
            $partenairedata = json_decode(json_encode($partenairedata), true);

            $partenaire = Partenaire::find($id);
            $message = "Le partenaire à été Modifé avec succès !";
        }
     
        if ($request->isMethod('post')) {
            $data = $request->all();
            $rules = [
                'nom_partenaire' => 'required',
                'logo' => 'required',
                'picture_cover' => 'required',
            ];

            $customMessage = [
                'nom_partenaire.required' => 'Le nom de la categorie est requis',
                'logo.required' => 'Veuillez choisir un logo',
                'picture_cover.required' => 'Veuillez choisir une image de couverture',
            ];
            $this->validate($request, $rules, $customMessage);


            if ($request->hasfile('logo')) {
                $fileLogo = $request->file('logo');
                $extenstionLogo = $fileLogo->getClientOriginalExtension();
                $filenameLogo = time() . '_' . Str::random(10) . '.' . $extenstionLogo;
                $fileLogo->move('image/partenaire_images/', $filenameLogo);

                $partenaire->logo = $filenameLogo;
            }
            if ($request->hasfile('picture_cover')) {
                $file_picture_cover = $request->file('picture_cover');
                $extenstion_picture_cover = $file_picture_cover->getClientOriginalExtension();
                $filename_picture_cover = time() . '_' . Str::random(10) . '.' .  $extenstion_picture_cover;
                $file_picture_cover->move('image/partenaire_images/', $filename_picture_cover);

                $partenaire->picture_cover = $filename_picture_cover;
            }

            $partenaire->code_ussd_souscription = $data['code_ussd_souscription'];
            $partenaire->url_ussd_souscription = $data['url_ussd_souscription'];
            $partenaire->code_ussd_dessouscription = $data['code_ussd_dessouscription'];
            $partenaire->url_ussd_dessouscription = $data['url_ussd_dessouscription'];
            $partenaire->numero_sms_souscription = $data['numero_sms_souscription'];
            $partenaire->keyword = $data['keyword'];
            $partenaire->cout_subcription_sms = $data['cout_subcription_sms'];
            $partenaire->moovie_cover = $data['moovie_cover'];
            $partenaire->periode_subscription_ussd_sms = $data['periode_subscription_ussd_sms'];

            $periodeMobileMoney = $data['periodeMobileMoney'];
            $tarifMobileMoney = $data['tarifMobileMoney'];
            $arrayMobileMoney = [];
            for ($i = 0; $i < count($periodeMobileMoney); $i++) {
                $object = [
                    "periode" => $periodeMobileMoney[$i],
                    "tarif" => $tarifMobileMoney[$i],
                ];

                array_push($arrayMobileMoney, $object);
            }

            $periodeUssd = $data['periodeUssd'];
            $tarifUssd = $data['tarifUssd'];
            $arrayUssd = [];
            for ($i = 0; $i < count($periodeUssd); $i++) {
                $object = [
                    "periode" => $periodeUssd[$i],
                    "tarif" => $tarifUssd[$i],
                ];

                array_push($arrayUssd, $object);
            }
            $partenaire->forfaits_mobile_money = $arrayMobileMoney;
            $partenaire->forfaits_ussd = $arrayUssd;
            $partenaire->save();
            $request->session()->flash('success_message', $message);
            return redirect('/partenaires');
        }
        return view('admin.partenaires.add_edit_partenaire')->with(compact('title', 'partenairedata'));
    }

    public function desactivatepartenaire(Request $request, $id)
    {

        $partenaires = Partenaire::find($id);
        $partenaires->status = 1;
        $partenaires->save();

        $request->session()->flash('success_message', "Partenaire désactivé.");

        return back();
    }

    public function activatepartenaire(Request $request, $id)
    {
        $partenaires = Partenaire::find($id);
        $partenaires->status = 0;
        $partenaires->save();

        $request->session()->flash('success_message', "Partenaire activé.");

        return back();
    }
}
