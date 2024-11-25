<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Abonnement extends Model
{
    use HasFactory;

    protected $table = 'abonnements';

    protected $fillable = [
        'user_id',
        'service_id',
        'numberDayOfSubscription',
        'state',
        'typePayments',
        'created_at',
    ];

    // Cast de la colonne JSON en array
    protected $casts = [
        'forfait' => 'array', // Laravel convertit automatiquement le JSON en tableau PHP
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le service
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
        public function verifierEtMettreAJourStatut()
    {
        // Convertir la date d'abonnement en objet Carbon
        $dateAbonnement = Carbon::parse($this->created_at);

        // Ajouter le nombre de jours pour calculer la date d'expiration
        $dateExpiration = $dateAbonnement->addDays($this->numberDayOfSubscription);

        // Comparer la date actuelle avec la date d'expiration
        if (now()->greaterThanOrEqualTo($dateExpiration)) {
            $this->state = 0; // Expiré
        } else {
            $this->state = 1; // Actif
        }

        // Sauvegarder le statut mis à jour
        $this->save();
    }
}
