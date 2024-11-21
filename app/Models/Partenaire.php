<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_partenaire',
        'logo',
        'code_ussd_souscription',
        'code_ussd_dessouscription',
        'url_ussd_dessouscription',
        'url_ussd_souscription',
        'numero_sms_souscription',
        'keyword',
        'picture_cover',
        'moovie_cover',
        'periode_subscription_ussd_sms',
        'cout_subcription_sms',
    ];

    // Cast credential JSON to array
    protected $casts = [
        'forfaits_mobile_money' => 'array',
        'forfaits_ussd' => 'array',
    ];


      // Cast credential JSON to array
    //   protected $casts = [
    //     'credential' => 'array',
    // ];
    public function service() {
        return $this->hasMany(Service::class);
    }

}
