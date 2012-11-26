<?php
/*
 * Plugin Thématiques
 * Licence GPL
 * Auteur Patrick Vincent
 */

/************************************************************************************/
/*	VARIABLES GLOBALES									*/
/************************************************************************************/
	define('_cookie_affichage','laclasse_affichage');
	define('_cookie_rubrique','laclasse_rubrique_admin');
	define('_cookie_annee_scolaire','laclasse_annee_scolaire');

	//Tailles
	define('_taille_img',50);
	define('_hauteur',550);
	define('_largeur',900);
	//Type d'affichage des popups : detail (iframe), ajax (modalbox sans iframe)
	define('_mode_popup','detail');
	
	$annee_scolaire = 2012;
	
	$GLOBALS['ext_audio']='mp3|ogg|wav';
	$GLOBALS['ext_video']='avi|mpg|flv|mp4|mov';
	$GLOBALS['ext_photo']='jpg|png|gif';

	//include_spip('base/abstract_sql');	
	//if ($id = sql_getfetsel("id_form", "spip_forms", "titre='form_webnapperon'")) define('_id_form_webnapperon',$id);	
	//if ($id = sql_getfetsel("id_form", "spip_forms", "titre='form_carte'")) define('_id_form_carte',$id);	
	//if ($id = sql_getfetsel("id_form", "spip_forms", "titre='form_client_mail'")) define('_id_form_client_mail',$id);		
	//if ($id = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='carte'")) define('_id_groupe_mot_badge',$id);

/************************************************************************************/
/*	DOSSIER_SQUELETTE FONCTION DU COOKIE														*/
/************************************************************************************/

	if ($_COOKIE[_cookie_affichage]=='classique')
		{
		$GLOBALS['dossier_squelettes'] = _DIR_PLUGIN_TH."sq-classique".":"._DIR_PLUGIN_TH;
		define('_affichage','classique');
		}
		else {
		//$GLOBALS['dossier_squelettes'] = _DIR_PLUGIN_TH."sq-unepage".":"._DIR_PLUGIN_TH.":"._DIR_PLUGIN_TH."sq-classique";
		$GLOBALS['dossier_squelettes'] = _DIR_PLUGIN_TH."sq-unepage".":"._DIR_PLUGIN_TH;		
		define('_affichage','unepage');		
		}


/************************************************************************************/
/*	REQUETES DANS LA FENETRE ACTIVE ANNEE_SCOLAIRE  : SURCHARGE DU PIPELINE PRE_BOUCLE */
/************************************************************************************/
	//Obligation de transmettre les paramètre par l'url pour tous les calculs xml
	if ((isset($_GET['id_article']))&&(!$_GET['mode']=='detail')) 
	$annee_scolaire=$annee_scolaire; /*calculer l'annee de l'article pour changement d'année en cours*/
	else if ((isset($_GET['annee_scolaire']))&&($_GET['annee_scolaire']!=0)&&($_GET['annee_scolaire']!=''))
	$annee_scolaire = $_GET['annee_scolaire'];
	else if ((isset($_COOKIE[_cookie_annee_scolaire]))&&($_COOKIE[_cookie_annee_scolaire]!=0)&&($_COOKIE[_cookie_annee_scolaire]!=''))
	$annee_scolaire = $_COOKIE[_cookie_annee_scolaire];

	define('_annee_scolaire',$annee_scolaire);
	define('_date_debut',$annee_scolaire.'.09.01');
	define('_date_fin',($annee_scolaire+1).'.09.01');
	//spip_log($annee_scolaire);

/************************************************************************************/
/*	OPTIONS SPIP																*/
/************************************************************************************/

//Retire jQuery d'insert head pour insertion personnalisée et bug ajax callback
	//$GLOBALS['spip_pipeline']['insert_head'] = str_replace('|f_jQuery', '', $GLOBALS['spip_pipeline']['insert_head']);

//Désactiver les boutons administrateur
	$flag_preserver = true;

// Personnalisation des items de pagination (a changer si besoin)
	$pagination_item_avant = '';
	$pagination_item_apres = '';
	$pagination_separateur = '&nbsp;|&nbsp;';

// Forcer la langue selon le choix du visiteur
	$GLOBALS['forcer_lang']=true;

// Masquer les numeros de titre
	$GLOBALS['table_des_traitements']['TITRE'][] = 'typo(supprimer_numero(%s))';
	$table_des_traitements['NOM'][]= 'supprimer_numero(typo(%s))';

// Ne pas transformer toutes les urls en lien !
	//define('_EXTRAIRE_LIENS',',^$,');

// Limiter la longueur des messages de forum
	define('_FORUM_LONGUEUR_MAXI', 1500);

// Limiter la taille des images uploadees
	define('_LOGO_MAX_WIDTH',2000) ;
	define('_LOGO_MAX_HEIGHT',2000) ;
	define('_IMG_MAX_WIDTH',2200) ;
	define('_IMG_MAX_HEIGHT',2000) ;
	define('_IMG_MAX_SIZE',2024);
	// define('_DOC_MAX_SIZE', 0);

?>
