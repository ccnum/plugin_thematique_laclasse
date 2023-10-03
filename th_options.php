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

	//Ces variables ne sont plus utilisées à vérifier
	//Tailles
	define('_taille_img',50);
	define('_hauteur',800);
	define('_largeur',1500);
	//Type d'affichage des popups : detail (iframe), ajax (modalbox sans iframe)
	define('_mode_popup','complet');
	//Fin vérification

	$annee_scolaire = 2023;
	define('_annee_cours',$annee_scolaire);

	//Qualifie les médias pour les tris	
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

	/*
		if ($_COOKIE[_cookie_affichage]=='classique')
		{
		$GLOBALS['dossier_squelettes'] = _DIR_PLUGIN_TH."sq-classique".":"._DIR_PLUGIN_TH;
		define('_affichage','classique');
		}
		//$GLOBALS['dossier_squelettes'] = _DIR_PLUGIN_TH."sq-unepage".":"._DIR_PLUGIN_TH.":"._DIR_PLUGIN_TH."sq-classique";
	*/

	define('_affichage','unepage');		


/************************************************************************************/
/*	REQUETES DANS LA FENETRE ACTIVE ANNEE_SCOLAIRE  : SURCHARGE DU PIPELINE PRE_BOUCLE */
/************************************************************************************/
	//Calcul de l'année scolaire en lien avec le dernier article en cours
		include_spip('base/abstract_sql');
		$date = sql_getfetsel("date", "spip_articles", "date !=  '0000-00-00 00:00:00'", "", "date DESC");
		if ($date != '')
		{
			$annee_scolaire = intval(substr($date,0,4));
			$mois_scolaire = intval(substr($date,5,2));
			if ($mois_scolaire < 9) $annee_scolaire--;
		}

	//Obligation de transmettre les paramètre par l'url pour tous les calculs xml
	if ((isset($_GET['id_article']))&&(!$_GET['mode']=='detail')) 
	$annee_scolaire=$annee_scolaire; /*calculer l'annee de l'article pour changement d'année en cours*/
	else if ((isset($_GET['annee_scolaire']))&&($_GET['annee_scolaire']!=0)&&($_GET['annee_scolaire']!=''))
	$annee_scolaire = $_GET['annee_scolaire'];
	else if ((isset($_COOKIE[_cookie_annee_scolaire]))&&($_COOKIE[_cookie_annee_scolaire]!=0)&&($_COOKIE[_cookie_annee_scolaire]!=''))
	$annee_scolaire = $_COOKIE[_cookie_annee_scolaire];

	define('_annee_scolaire',$annee_scolaire);
    // Les dates SPIP sont représentées ainsi AAAA-MM-JJ
	define('_date_debut',$annee_scolaire.'-08-01');
	define('_date_fin',($annee_scolaire+1).'-08-01');
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
	define('_FORUM_LONGUEUR_MAXI', 10000);

// Limiter la taille des images/docs uploadees
	//define('_LOGO_MAX_WIDTH',3000) ;
	//define('_LOGO_MAX_HEIGHT',3000) ;
	//define('_IMG_MAX_WIDTH',3000) ;
	//define('_IMG_MAX_HEIGHT',3000) ;
	//define('_IMG_MAX_SIZE',2024);
	define('_DOC_MAX_SIZE', 3000);

// Désactiver les warnings PHP
	error_reporting(error_reporting() & (-1 ^ E_DEPRECATED));
 	// error_reporting(0);

// AutoBR
	//define('_AUTOBR', '');

	/**
	 * Autorisation de modifier un auteur
	 *
	 * Attention tout depend de ce qu'on veut modifier. Il faut être au moins
	 * rédacteur, mais on ne peut pas promouvoir (changer le statut) un auteur
	 * avec des droits supérieurs au sien.
	 *
	 * @param  string $faire Action demandée
	 * @param  string $type Type d'objet sur lequel appliquer l'action
	 * @param  int $id Identifiant de l'objet
	 * @param  array $qui Description de l'auteur demandant l'autorisation
	 * @param  array $opt Options de cette autorisation
	 * @return bool          true s'il a le droit, false sinon
	 **/
	function autoriser_auteur_modifier($faire, $type, $id, $qui, $opt) {



		// Un redacteur peut modifier ses propres donnees mais ni son login/email
		// ni son statut (qui sont le cas echeant passes comme option)
		if ($qui['statut'] == '1comite'  or $qui['statut'] == '6forum') {
			if (isset($opt['webmestre']) and $opt['webmestre']) {
				return false;
			} elseif ((isset($opt['statut']) and $opt['statut'])
				or (isset($opt['restreintes']) and $opt['restreintes'])
				or $opt['email']
			) {
				return false;
			} elseif ($id == $qui['id_auteur']) {
				return true;
			} else {
				return false;
			}
		}

		// Un admin restreint peut modifier/creer un auteur non-admin mais il
		// n'a le droit ni de le promouvoir admin, ni de changer les rubriques
		if ($qui['restreint']) {
			if (isset($opt['webmestre']) and $opt['webmestre']) {
				return false;
			} elseif ((isset($opt['statut']) and ($opt['statut'] == '0minirezo'))
				or (isset($opt['restreintes']) and $opt['restreintes'])
			) {
				return false;
			} else {
				if ($id == $qui['id_auteur']) {
					if (isset($opt['statut']) and $opt['statut']) {
						return false;
					} else {
						return true;
					}
				} else {
					if ($id_auteur = intval($id)) {
						$t = sql_fetsel("statut", "spip_auteurs", "id_auteur=$id_auteur");
						if ($t and $t['statut'] != '0minirezo') {
							return true;
						} else {
							return false;
						}
					} // id = 0 => creation
					else {
						return true;
					}
				}
			}
		}

		// Un admin complet fait ce qu'il veut
		// sauf se degrader
		if ($id == $qui['id_auteur'] && (isset($opt['statut']) and $opt['statut'])) {
			return false;
		}
		// et toucher au statut webmestre si il ne l'est pas lui meme
		// ou si les webmestres sont fixes par constante (securite)
		elseif (isset($opt['webmestre']) and $opt['webmestre'] and (defined('_ID_WEBMESTRES') or !autoriser('webmestre'))) {
			return false;
		} // et modifier un webmestre si il ne l'est pas lui meme
		elseif (intval($id) and autoriser('webmestre', '', 0, $id) and !autoriser('webmestre')) {
			return false;
		} else {
			return true;
		}
	}