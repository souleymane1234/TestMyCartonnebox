<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbonnementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // clé étrangère vers table users
            $table->foreignId('service_id')->constrained()->onDelete('cascade'); // clé étrangère vers table services
            $table->integer('numberDayOfSubscription'); // nombre de jours de l'abonnement
            $table->boolean('state')->default(false); // état de l'abonnement (actif/inactif)
            $table->json('forfait'); // données du forfait en JSON
            $table->string('typePayments'); // type de paiement
            $table->timestamps(); // created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('abonnements');
    }
}
