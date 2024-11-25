<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    /**
     * Vérifie et met à jour le statut de tous les abonnements.
     */
    public function verifierEtMettreAJourTousLesAbonnements()
    {
        $abonnements = Abonnement::all();

        foreach ($abonnements as $abonnement) {
            $abonnement->verifierEtMettreAJourStatut();
        }

        return response()->json([
            'message' => 'Tous les abonnements ont été vérifiés et mis à jour.'
        ]);
    }
}