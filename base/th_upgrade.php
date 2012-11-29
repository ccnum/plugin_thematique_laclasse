<?php

// Inspiré de la procédure d'installation du plugin thematiques

include_spip('inc/meta');
include_spip('base/create');

function th_upgrade($nom_meta_base_version,$version_cible){
	$current_version = "0.0";
	
	// On traite le cas de la premiere version de th sans version_base
	if ((!isset($GLOBALS['meta'][$nom_meta_base_version])) && th_existe())
		$current_version = "2.0";
		
	if (isset($GLOBALS['meta'][$nom_meta_base_version]))
		$current_version = $GLOBALS['meta'][$nom_meta_base_version];

	if (($current_version=="2.0")||($current_version=="2.1")||($current_version=="2.2")||($current_version=="2.3"))
	{
		//Creation de nouvelles tables ou de nouveaux champs
			include_spip('base/th_install');
			maj_tables(array('spip_articles'));
			maj_tables(array('spip_syndic_articles'));
			maj_tables(array('spip_rubriques'));
			spip_log('ok maj','thematiques');
	}

	if ($current_version=="0.0") 
	{
		//Creation de nouvelles tables ou de nouveaux champs
			include_spip('base/th_install');
			maj_tables(array('spip_articles'));
			maj_tables(array('spip_syndic_articles'));
			maj_tables(array('spip_rubriques'));

		//Creation mots clefs
			//Groupe Contenus
				if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Contenus'"))
				{
					$id_groupe = sql_insertq('spip_groupes_mots', array(
					'titre'=>'Contenus',
					'unseul'=>'non',
					'tables_liees'=>'rubriques',
					'minirezo'=>'oui',
					'comite'=>'non',
					'forum'=>'non'
					));
				}
			
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='travail_en_cours' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'travail_en_cours','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='consignes' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'consignes','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='evenements' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'evenements','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blogs' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'blogs','id_groupe'=>$id_groupe));			
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='ressources' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'ressources','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='images_background' AND id_groupe=$id_groupe")) $id = sql_insertq('spip_mots', array('titre'=>'images_background','id_groupe'=>$id_groupe));				

			//Groupe Presentation_rubriques
				if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Presentation' AND tables_liees LIKE '%rubriques%'"))
				{
					$id_groupe = sql_insertq('spip_groupes_mots', array(
					'titre'=>'Presentation',
					'unseul'=>'non',
					'tables_liees'=>'rubriques',
					'minirezo'=>'oui',
					'comite'=>'non',
					'forum'=>'non'
					));
				}
			
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blog' AND id_groupe=$id_groupe")) $id_mot_defaut = sql_insertq('spip_mots', array('titre'=>'blog','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='pas_une' AND id_groupe=$id_groupe")) $id_mot_fin = sql_insertq('spip_mots', array('titre'=>'pas_une','id_groupe'=>$id_groupe));			
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe")) $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'laclasse.com','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='trombinoscope' AND id_groupe=$id_groupe")) $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'trombinoscope','id_groupe'=>$id_groupe));

			//Groupe Presentation_articles
				if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Presentation' AND tables_liees LIKE '%articles%'"))
				{
					$id_groupe = sql_insertq('spip_groupes_mots', array(
					'titre'=>'Presentation',
					'unseul'=>'non',
					'tables_liees'=>'articles',
					'minirezo'=>'oui',
					'comite'=>'non',
					'forum'=>'non'
					));
				}
			
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe")) $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'laclasse.com','id_groupe'=>$id_groupe));
				if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='sommaire_edito' AND id_groupe=$id_groupe")) $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'sommaire_edito','id_groupe'=>$id_groupe));


			//Groupe Sites
				if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='site'"))
				{
					$id_groupe = sql_insertq('spip_groupes_mots', array(
					'titre'=>'site',
					'unseul'=>'non',
					'tables_liees'=>'',
					'minirezo'=>'oui',
					'comite'=>'non',
					'forum'=>'non'
					));
				}

		//BDD
			sql_alter("TABLE spip_syndic CHANGE oubli oubli VARCHAR(3) DEFAULT 'oui'");
			sql_alter("TABLE spip_syndic CHANGE resume resume VARCHAR(3) DEFAULT 'non'");

		//Meta
			ecrire_meta('articles_mots','oui');
			ecrire_meta('activer_sites','oui');
			ecrire_meta('activer_syndic','oui');
			ecrire_meta('activer_statistiques','oui');
			ecrire_meta('articles_descriptif','oui');
			ecrire_meta('articles_soustitre','oui');
			ecrire_meta('articles_surtitre','oui');
			ecrire_meta('articles_modif','oui');
			//ecrire_meta('articles_surtitre','oui');
			ecrire_meta('documents_article','oui');
			ecrire_meta('documents_rubrique','oui');
			ecrire_meta('documents_article','oui');
			//ecrire_meta('accepter_inscriptions','oui');
			//ecrire_meta('creer_preview','oui');
			//ecrire_meta('gd_formats','gif,jpg,png');
			//ecrire_meta('gd_formats_read','gif,jpg,png');
			//ecrire_meta('image_process','gd2');
			//ecrire_meta('max_taille_vignettes','9000000');
	}

	
		ecrire_meta($nom_meta_base_version,$version_cible);
		ecrire_metas();
}

function th_vider_tables($nom_meta_base_version) {
	//Modifications de la structure de la base	

	//Mots clefs
		/*if ($id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='carte'"))
		{
			sql_delete("spip_mots", "id_groupe=$id_groupe");
			sql_delete("spip_groupes_mots", "id_groupe=$id_groupe");			
		}
		if ($id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='jeu_rubrique'"))
		{
			sql_delete("spip_mots", "id_groupe=$id_groupe");
			sql_delete("spip_groupes_mots", "id_groupe=$id_groupe");			
		}
		if ($id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='jeu_article'"))
		{
			sql_delete("spip_mots", "id_groupe=$id_groupe");
			sql_delete("spip_groupes_mots", "id_groupe=$id_groupe");			
		}
		*/

	effacer_meta($nom_meta_base_version);
	ecrire_metas();
}

function th_existe() {

}

?>
