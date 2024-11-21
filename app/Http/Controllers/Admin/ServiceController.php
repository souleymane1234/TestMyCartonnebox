<?php

namespace App\Http\Controllers\Admin;

use Image;
use App\Models\Admin;
use App\Models\Offre;
use App\Models\Service;
use App\Models\Categorie;
use App\Models\Partenaire;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Ressource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Exceptions\PostTooLargeException;

class ServiceController extends Controller
{
    public function services()
    {
        $respo = Admin::select('role')->where('id', Auth::guard('admin')->user()->id)->value('role');
        $services = Service::with(['partenaires', 'categories'])->get();

        return view('admin.services.services')->with(compact('services', 'respo'));
    }

    public function addEditService(Request $request, $id = null)
    {



        if ($id == "") {
            $title = 'Ajouter service';
            // ajout de fonctionnalités
            $service = new Service();
            $servicedata = array();

            $getPartenaires = Partenaire::all();
            // $getPartenaires = json_decode(json_encode($getPartenaires), true);

            $getCategories = Categorie::all();
            // $getCategories = json_decode(json_encode($getCategories), true);

            $message = "Le service est ajouté avec succès !";
        } else {
            $title = "Modifier service";
            $servicedata = Service::where('id', $id)->first();
            $servicedata = json_decode(json_encode($servicedata), true);

            $getPartenaires = Partenaire::all();
            // $getPartenaires = json_decode(json_encode($getPartenaires), true);

            $getCategories = Categorie::all();
            // $getCategories = json_decode(json_encode($getCategories), true);


            $service = Service::find($id);
            $message = "Le service a été modifié avec succès !";
        }

        if ($request->isMethod('post')) {
            // dd($request->filenames);
            $data = $request->all();
            $rules = [
                'nom_service' => 'required',
                'categorie_id' => 'required',
                'partenaire_id' => 'required',
                'filenames.*' => 'max:4096',
                'icone' => 'required|max:2048',


            ];

            $customMessage = [
                'nom_service.required' => 'Le nom du service',
                'categorie_id.required' => 'Selectionnez une catégorie',
                'partenaire_id.required' => 'Selectionnez un partenaire',
                'icone.required' => 'Selectionnez le logo du service',
                'icone.max' => 'La taille max du logo doi être de 1Mo',
            ];
            $this->validate($request, $rules, $customMessage);

            $maxFileSize = 1024; // Taille maximale du fichier en octets

            if ($request->hasFile('file')) {
                $uploadedFile = $request->file('file');

                // Vérifiez la taille du fichier
                if ($uploadedFile->getSize() > $maxFileSize) {
                    throw new PostTooLargeException;
                }

                // Code pour traiter le fichier uploadé si la taille est valide
            }





            if ($request->hasFile('filenames')) {

                foreach ($request->file('filenames') as $file) {
                    $filename = $file->getClientOriginalName();
                    $file->move('image/service_images', $filename);
                    $insert[] = $filename;
                }
                $service->image = $insert;
            }


            if ($request->hasFile('icone')) {
                $image_tmp = $request->file('icone');
                if ($image_tmp->isValid()) {
                    $fileNameWithTheExtension = request('icone')->getClientOriginalName();

                    //obtenir le nom de l'image

                    $iconeName = pathinfo($fileNameWithTheExtension, PATHINFO_FILENAME);

                    // extension
                    $extension = request('icone')->getClientOriginalExtension();

                    // creation de nouveau nom
                    $newIconeName = $iconeName . '_' . time() . '.' . $extension;

                    $path = request('icone')->move('image/service_images', $newIconeName);
                    $service->icone = $newIconeName;
                }
            }
            // Création d'object
            $periode = $data['periode'];
            $tarif = $data['tarif'];
            $descriptionForfait = $data['descriptionForfait'];
            $array = [];
            for ($i = 0; $i < count($periode); $i++) {
                $object = [
                    "periode" => $periode[$i],
                    "tarif" => $tarif[$i],
                    "descriptionForfait" => $descriptionForfait[$i],
                ];

                array_push($array, $object);
            }


            $service->categorie_id = $data['categorie_id'];
            $service->partenaire_id = $data['partenaire_id'];
            $service->description = $data['description'];
            $service->nom_service = $data['nom_service'];
            $service->link = $data['link'];
            $service->code_ussd_souscription = $data['code_ussd_souscription'];
            $service->numero_sms_souscription = $data['numero_sms_souscription'];
            $service->code_ussd_dessouscription = $data['code_ussd_dessouscription'];
            $service->forfaits = $array;
            $service->service_url = Str::slug($request->input('nom_service'), "-");
            $service->save();

            $request->session()->flash('success_message', $message);
            return redirect('/services');
        }
        return view('admin.services.add_edit_service')->with(compact('title', 'servicedata', 'getPartenaires', 'getCategories'));
    }

    public function addOffres(Request $request, $id)
    {
        if ($request->isMethod('post')) {
            $data = $request->all();

            $ressource = new Ressource();
            $ressource->service_id = (int)$data['service_id'];
            $ressource->title = $data['title'];
            $ressource->language = $data['language'];
            $ressource->price = (int)$data['price'];
            $ressource->link = $data['link'];
            $ressource->description = $data['description'];
            if ($request->hasFile('filenames')) {

                foreach ($request->file('filenames') as $file) {
                    $filename = $file->getClientOriginalName();
                    $file->move('image/service_images', $filename);
                    $insert[] = $filename;
                }
                $ressource->images = $insert;
            }
            $ressource->save();
            $success_message = 'L\'attribut du produit a été ajouté avec sucess';
            // Session::flash('success_message', $success_message);
            return redirect()->back();
        }

        $servicedata = Service::with(['ressources', 'partenaires', 'categories'])->find($id);
        $servicedata = json_decode(json_encode($servicedata), true);


        $title = "Ajout d'offre ";

        return view('admin.services.add_offre')->with(compact('servicedata', 'title'));
    }

    public function editOffres($id)
    {
        // if ($request->isMethod('post')) {
        //     $data = $request->all();
        //     //            dd($data);

        //     foreach ($data['attrId'] as $key => $attr) {
        //         if (!empty($attr)) {
        //             Offre::where(['id' => $data['attrId'][$key]])
        //                 ->update(['periode' => $data['periode'][$key], 'tarifs' => $data['tarif'][$key], 'avantages' => $data['avantage'][$key]]);
        //         }
        //     }

            // $success_message = 'L\'attribut du produit a été modifié avec sucess';
            // Session::flash('success_message', $success_message);
        //     return redirect()->back();
        // }
    }

    public function desactivateoffre(Request $request, $id)
    {

        $services = Offre::find($id);
        $services->status = 1;
        $services->save();

        $request->session()->flash('success', "L'offre' a été désactivé avec succès !");

        return back();
    }

    public function desactivateservice(Request $request, $id)
    {

        $services = Service::find($id);
        $services->status = 1;
        $services->save();

        $request->session()->flash('success', "Le service a été désactivé avec succès !");

        return back();
    }

    public function activateservice(Request $request, $id)
    {
        $services = Service::find($id);
        $services->status = 0;
        $services->save();

        $request->session()->flash('success', "Le service a été réactiver avec succès !");

        return back();
    }



    public function editImages($id)
    {
        $images = Service::select('id', 'image')->find($id);

        $title = "Modifier images";

        return view('admin.services.edit_image')->with(compact('images', 'title'));
    }

    public function updateImages(Request $request)
    {
        $rules = [
            'filenames.*' => 'required|max:4096',
        ];

        $customMessage = [
            'filenames.required' => 'Fichier requis',
        ];
        $this->validate($request, $rules, $customMessage);

        $id = $request->id;


        $oldImages = Service::where('id', $id)->pluck('image')->toArray();

        $files = $request->file('filenames');

        if ($files == null) {
            $images = $oldImages[0];
        } else {
            $result = array_diff_key($oldImages[0], $files);

            foreach ($request->file('filenames') as $file) {
                $filename = $file->getClientOriginalName();
                $file->move('image/service_images', $filename);
                // $insert[] = $filename;
            }



            $filenames = [];
            // Traitez chaque fichier
            foreach ($files as $index => $file) {


                // Obtenez le nom du fichier
                $filename = $file->getClientOriginalName();

                $filenames[$index] = $filename;
            }

            $nouveauTableau = $result + $filenames;

            ksort($nouveauTableau);

            Service::where('id', $request->id)
                ->update([
                    'image' => $nouveauTableau,
                ]);
        }

        // return view('admin.services.services');
        $message = "Les images du service ont été Modifée avec succès !";
        $request->session()->flash('success_message', $message);
        return redirect('/services');
    }
}
