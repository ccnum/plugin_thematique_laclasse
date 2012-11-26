<?php

function formulaires_editer_gis_charger_dist($id_objet, $recherche='', $retour='', $objet='article')
{
	$valeurs = array(
		'lat'=> '',
		'lonx'=> '',
		'zoom'=> '',
		'recherche'=> $recherche,
		'editable'=>true
	);
	
	//On cherche les coordonnées dans spip_gis
	$row = sql_fetsel("lat,lonx,zoom", "spip_gis", "id_$objet=$id_objet");
	if ($row) {
		$valeurs['lat'] = $row['lat'];
		$valeurs['lonx'] = $row['lonx'];
		$valeurs['zoom'] = $row['zoom'];
	}else{
		// faire une jointure
		if ($objet=='article')
		{	
			$id_rubrique = sql_getfetsel("id_rubrique", "spip_articles", "id_article=$id_objet");
			$row = sql_fetsel("lat,lonx,zoom", "spip_gis", "id_rubrique=$id_rubrique");
			$valeurs['lat'] = $row['lat'];
			$valeurs['lonx'] = $row['lonx']+5;
			$valeurs['zoom'] = $row['zoom'];			
		}
		else
		{
			$api_carte = lire_config('gis/api_carte');
			$valeurs['lat'] = lire_config($api_carte.'/latitude');
			$valeurs['lonx'] = lire_config($api_carte.'/longitude');
			$valeurs['zoom'] = lire_config($api_carte.'/zoom');
		}
	}
	return $valeurs;
}


function formulaires_editer_gis_verifier_dist($id_objet, $recherche='', $retour='', $objet='article')
{
	$erreurs = array();
	return $erreurs;
}


function formulaires_editer_gis_traiter_dist($id_objet, $recherche='', $retour='', $objet='article')
{
	$res = array('editable'=>' ');
	
	// recuperation des donnees
	$lat = _request('lat');
	$lonx = _request('lonx');
	$zoom = _request('zoom');
	
	include_spip('base/abstract_sql');
	
	// mise a jour ou creation ?
	if ($id_gis = sql_getfetsel("id_gis", "spip_gis", "id_$objet=$id_objet")) {
		sql_updateq("spip_gis",
					array("id_$objet" => $id_objet , "lat" => $lat, "lonx" => $lonx, "zoom" => $zoom),
					"id_gis=$id_gis");
		$res['message_ok'] = _T('gis:coord_maj');
	}else{
		sql_insertq("spip_gis",  array("id_$objet" => $id_objet , "lat" => $lat, "lonx" => $lonx, "zoom" => $zoom));
		$res['message_ok'] = _T('gis:coord_enregistre');
	}
	if ($retour){
		include_spip('inc/headers');
		$res['redirect'] = $retour;
	}
	
	return $res;
}

?>
