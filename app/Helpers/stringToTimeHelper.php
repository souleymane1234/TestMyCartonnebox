<?php

if (!function_exists('convertToDays')) {
    function convertToDays($duration)
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
