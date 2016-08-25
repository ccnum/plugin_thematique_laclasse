<?php

/***************************************************************************\
 *  SPIP, Systeme de publication pour l'internet                           *
 *                                                                         *
 *  Copyright (c) 2001-2010                                                *
 *  Arnaud Martin, Antoine Pitrou, Philippe Riviere, Emmanuel Saint-James  *
 *                                                                         *
 *  Ce programme est un logiciel libre distribue sous licence GNU/GPL.     *
 *  Pour plus de details voir le fichier COPYING.txt ou l'aide en ligne.   *
\***************************************************************************/

if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/actions');
include_spip('inc/editer');

// http://doc.spip.org/@inc_editer_article_dist
function formulaires_public_editer_article_charger_dist($id_article='new', $id_rubrique=0, $retour='', $lier_trad=0, $config_fonc='articles_edit_config', $row=array(), $hidden=''){
	$valeurs = formulaires_editer_objet_charger('article',$id_article,$id_rubrique,$lier_trad,$retour,$config_fonc,$row,$hidden);
	// il faut enlever l'id_rubrique car la saisie se fait sur id_parent
	// et id_rubrique peut etre passe dans l'url comme rubrique parent initiale
	// et sera perdue si elle est supposee saisie
	if (is_array($valeurs)) unset($valeurs['id_rubrique']);
	return $valeurs;
}

// Choix par defaut des options de presentation
// http://doc.spip.org/@articles_edit_config
function articles_edit_config($row)
{
	global $spip_ecran, $spip_lang, $spip_display;

	$config = $GLOBALS['meta'];
	$config['lignes'] = ($spip_ecran == "large")? 8 : 5;
	$config['langue'] = $spip_lang;

	$config['restreint'] = ($row['statut'] == 'publie');
	return $config;
}

function formulaires_public_editer_article_verifier_dist($id_article='new', $id_rubrique=0, $retour='', $lier_trad=0, $config_fonc='articles_edit_config', $row=array(), $hidden=''){

	$erreurs = formulaires_editer_objet_verifier('article',$id_article,array('titre'));
	return $erreurs;
}

// http://doc.spip.org/@inc_editer_article_dist
function formulaires_public_editer_article_traiter_dist($id_article='new', $id_rubrique=0, $retour='', $lier_trad=0, $config_fonc='articles_edit_config', $row=array(), $hidden=''){
	//Traitement principal	
		$res = formulaires_editer_objet_traiter('article',$id_article,$id_rubrique,$lier_trad,$retour,$config_fonc,$row,$hidden);
	
	//Ajout du champ id_consigne
		$id_consigne = _request('id_consigne');
		$id_article1 = $res['id_article'];
		
		if ((isset($id_consigne))&&(isset($id_article1)))
			sql_updateq("spip_articles",array("id_consigne" => $id_consigne,"statut" => "publie"),"id_article=$id_article1");

	//Mail
		if ($id_article=='')
			{
				//$res['redirect']="spip.php?page=sommaire_recharge&type_objet=reponse&id_article=$id_article&id_consigne=$id_consigne";
				$date = date('Y-m-d H:i:s');
				if ($notifications = charger_fonction('notifications', 'inc')) {
					$notifications('instituerarticle', $id_article1,
						array('statut' => 'publie', 'statut_ancien' => 'propose', 'date'=>$date)
					);
				}
			}

	//Redirection
	//	$res['redirect']="spip.php?page=article&id_article=$id_article1&id_consigne=$id_consigne";
	
	// $res['redirect']="spip.php?google=yahoo";
	
	// TODO
	
	return $res;
}

?>
