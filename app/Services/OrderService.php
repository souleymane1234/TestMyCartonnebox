<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OrderService
{
    /**
     * Envoie une requête POST à l'API pour acheter un service.
     *
     * @param string $numberClient
     * @param string $typeService
     * @param int $amount
     * @param string $reference
     * @param string|null $otp
     * @return array
     */
    public function buyService(string $numberClient, string $typeService, int $amount, string $reference, ?string $otp = null)
    {
        // Définir les en-têtes requis
        $headers = [
            'x-app-access' => '0792c5b43e2bc5fe13a4a579f05e4dd9',
            'x-app-token'  => '2407b38fca123c7d131275ba2bcb7d1362cc6e6a771bd4a143855e4b0eb0a8c9',
        ];

        // Définir le corps de la requête
        $body = [
            'numberClient' => $numberClient,
            'typeService' => $typeService,
            'amount' => $amount,
            'reference' => $reference,
        ];

        // Ajouter otp si il est fourni
        if (!is_null($otp)) {
            $body['otp'] = $otp;
        }

        // Envoyer la requête POST
        $response = Http::withHeaders($headers)->post('https://api.centralapis.com/api/v1/finance/deposit', $body);

        // Retourner la réponse sous forme de tableau
        return $response->json();
    }

    function convertToDays(string $duration)
    {
        // Remettre tout en minuscule pour simplifier le traitement
        $duration = strtolower($duration);

        // Définir les correspondances entre les unités de temps et le nombre de jours
        $units = [
            'jr' => 1,
            'jrs' => 1,
            'jours' => 1,
            'semaine' => 7,
            'semaines' => 7,
            'mois' => 30,  // Estimation d'un mois à 30 jours
            'an' => 365,
            'ans' => 365,
        ];

        // Utiliser une regex pour extraire le nombre et l'unité
        if (preg_match('/(\d+)\s*(\w+)/', $duration, $matches)) {
            $number = (int)$matches[1];
            $unit = $matches[2];

            // Vérifier si l'unité est dans le tableau $units
            if (array_key_exists($unit, $units)) {
                // Calculer le nombre de jours
                return $number * $units[$unit];
            }
        }

        // Retourner 0 par défaut si aucune correspondance n'est trouvée
        return 0;
    }
}
