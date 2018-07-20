exports.checkStep = function(step){
		let consigne = '' , histoire='', story='Paul et Marie sont en visite avec leur fille Caroline chez leurs cousins Jean et Anne qui ont deux enfants, Alice et Michel. Jean est assis dans son fauteuil et regarde ses deux enfants.';
        switch (step) {
        case 'A' : consigne = 'Quelle question pourrais-je te poser à propos de ce dessin?';
                    break;

        case 'B' : consigne = 'Intégralement ou avec tes mots , peux-tu écrire la question que je viens de te lire';
                    histoire = story;
                    break;

        case 'C1' : consigne = 'Identifie et trouve le nom des personnages numérotés de 1 à 7 et explique la raison de tes choix';
                    histoire = story;
                    break;

        case 'D' : consigne = 'Intégralement ou avec tes mots , peux-tu écrire la question que je t\'ai lue tout à l\'heure?';
                    break;

        case 'E' : consigne = 'Intégralement ou avec tes mots , peux-tu écrire l\'histoire que je t\'ai lue tout à l\'heure?';
                    break;

        case 'C2' : consigne = 'Continue ton Point C. Identifie et trouve le nom des personnages numérotés de 1 à 7 et explique la raison de tes choix';
                    histoire = story;
                    break;

        case 'F' : consigne = 'Ecris ce que tu vois ou observe sur ce dessin';
                    histoire = story;
                    break;

        case 'G' : consigne = 'Ecris ce qui se passe sur dessin';
                    histoire = story;
                    break;

        default : return null;
    }
    return[histoire,consigne]
}