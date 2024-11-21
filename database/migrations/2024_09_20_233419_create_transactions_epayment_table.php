<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsEpaymentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 8, 2); // Montant avec 8 chiffres et 2 décimales
            $table->string('my_reference')->unique(); // Référence unique
            $table->string('typeService'); // Type de service
            $table->string('numberClient'); // Numéro du client
            $table->unsignedBigInteger('user_id'); // Clé étrangère vers la table users
            $table->string('transaction_reference')->nullable(); // Référence de la transaction, nullable
            $table->string('state')->default('INITIALISE'); // État de la commande
            $table->json('userAgent');  // Colonne pour les informations de l'user agent (stockées en JSON)
            $table->timestamps(); // Colonnes created_at et updated_at

            // Ajout de la clé étrangère vers la table users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
