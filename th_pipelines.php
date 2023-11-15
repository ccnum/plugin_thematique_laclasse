<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

//Pre_boucles
//Retourne les articles et articles syndiqués en lien avec l'année scolaire
function th_pre_boucle($boucle) {
	$affichage = _affichage;

	$annee = _annee_scolaire;
	$mois = '08';
	$jour = '01';

	$annee2 = intval(_annee_scolaire) + 1;
	$mois2 = '08';
	$jour2 = '01';

	$date_debut = $annee_scolaire . "." . $mois . "." . $jour;
	$date_fin = $annee_scolaire2 . "." . $mois2 . "." . $jour2;

	if (($boucle->type_requete == 'articles') || ($boucle->type_requete == 'syndic_articles')) {
		$date = $boucle->id_table . ".date";
		if ((!isset($boucle->modificateur['tout'])) && (!strstr($_SERVER['REQUEST_URI'], "/ecrire")) && (!$affichage == 'unepage'))
			$boucle->where[] = array(
				"'AND'",
				array("'>='", "'$date'", ("'\"$annee-$mois-$jour\"'")),
				array("'<='", "'$date'", ("'\"$annee2-$mois2-$jour2\"'"))
			);
	}
	return $boucle;
}

function th_jqueryui_plugins($scripts) {
	$scripts[] = "jquery.ui.core";
	$scripts[] = "jquery.ui.widget";
	$scripts[] = "jquery.ui.mouse";
	$scripts[] = "jquery.ui.position";
	$scripts[] = "jquery.ui.draggable";
	$scripts[] = "jquery.ui.droppable";
	$scripts[] = "jquery.ui.tooltip"; /* a TROUVER */
	$scripts[] = "jquery.ui.effect";
	$scripts[] = "jquery.ui.effect-bounce";

	return $scripts;
}
