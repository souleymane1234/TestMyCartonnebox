<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Abonnement;

class VerifyAbonnements extends Command
{
    protected $signature = 'abonnements:verifier';
    protected $description = 'Vérifie et met à jour le statut des abonnements.';

    public function handle()
    {
        $abonnements = Abonnement::all();
        foreach ($abonnements as $abonnement) {
            $abonnement->verifierEtMettreAJourStatut();
        }
        $this->info('Tous les abonnements ont été vérifiés et mis à jour.');
    }
}

