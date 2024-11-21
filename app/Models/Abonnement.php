<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
