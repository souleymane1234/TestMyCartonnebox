<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToPartenairesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('partenaires', function (Blueprint $table) {
            $table->string('code_ussd_souscription')->nullable();
            $table->string('code_ussd_dessouscription')->nullable();
            $table->string('url_ussd_dessouscription')->nullable();
            $table->string('url_ussd_souscription')->nullable();
            $table->string('numero_sms_souscription')->nullable();
            $table->string('keyword')->nullable();
            $table->string('picture_cover')->nullable();
            $table->string('moovie_cover')->nullable();
            $table->json('forfaits_mobile_money')->nullable();
            $table->json('forfaits_ussd')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('partenaires', function (Blueprint $table) {
            //
        });
    }
}
