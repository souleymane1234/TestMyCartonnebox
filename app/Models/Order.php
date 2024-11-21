<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * Les attributs assignables en masse.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'my_reference',
        'typeService',
        'numberClient',
        'user_id',
        'transaction_reference',
        'userAgent',
        'state',
        'used',
        'payment_url',
    ];

    protected $casts = [
        'userAgent' => 'array', // Laravel convertit automatiquement le JSON en tableau PHP
    ];

    /**
     * Relation avec le modèle User.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
