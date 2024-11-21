<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ressource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'link', 'status', 'description', 'number_views', 'price', 'service_id', 'code_sms','price_ussd', 'language'
    ];

    // Cast credential JSON to array
    protected $casts = [
        'images' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
