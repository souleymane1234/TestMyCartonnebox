<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Watchmoovie extends Model
{
    use HasFactory;

    protected $table = 'watchmoovies';

    protected $fillable = [
        'user_id',
        'ressource_id',
        'state',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec la ressource
    public function ressource()
    {
        return $this->belongsTo(Ressource::class);
    }
}
