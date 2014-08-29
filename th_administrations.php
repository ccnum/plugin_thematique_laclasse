<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/cextras');
include_spip('base/th_cextras');

function th_upgrade($nom_meta_base_version, $version_cible){

	$maj = array();

	$maj['create'] = array(
        array('maj_tables',array('spip_articles')),
        array('maj_tables',array('spip_syndic_articles')),
        array('maj_tables',array('spip_rubriques')),
        array('th_ajouter_mots_clef'),
		array('sql_alter',"TABLE spip_syndic CHANGE oubli oubli VARCHAR(3) DEFAULT 'oui'"),
		array('sql_alter',"TABLE spip_syndic CHANGE resume resume VARCHAR(3) DEFAULT 'non'"),
		array('ecrire_meta','articles_mots','oui'),
		array('ecrire_meta','activer_sites','oui'),
		array('ecrire_meta','activer_syndic','oui'),
		array('ecrire_meta','activer_statistiques','oui'),
		array('ecrire_meta','arteicles_descriptif','oui'),
		array('ecrire_meta','articles_soustitre','oui'),
		array('ecrire_meta','articles_surtitre','oui'),
		array('ecrire_meta','articles_modif','oui'),
		//array('ecrire_meta','articles_surtitre','oui');
		array('ecrire_meta','documents_article','oui'),
		array('ecrire_meta','documents_rubrique','oui'),
		array('ecrire_meta','documents_article','oui'),
		//array('ecrire_meta','accepter_inscriptions','oui');
		//array('ecrire_meta','creer_preview','oui');
		//array('ecrire_meta','gd_formats','gif,jpg,png');
		//array('ecrire_meta','gd_formats_read','gif,jpg,png');
		//array('ecrire_meta','image_process','gd2');
		//array('ecrire_meta','max_taille_vignettes','9000000');        
	);
    cextras_api_upgrade(th_declarer_champs_extras(), $maj['create']);

    $maj['2.3.3'] = array(
        array('th_configurer_site'),
    );

    cextras_api_upgrade(th_declarer_champs_extras(), $maj['2.3.4']);

    $maj['2.3.5'] = array(
        array('sql_update','spip_auteurs',array('ent_statut' => 'bio')),
        array('sql_update','spip_auteurs',array('ent' => 'pgp'))
    );

    include_spip('base/upgrade');
    maj_plugin($nom_meta_base_version, $version_cible, $maj);
}

function th_vider_tables($nom_meta_base_version) {
	effacer_meta($nom_meta_base_version);
}


function th_configurer_site() {

    $nom_site_spip = lire_config('nom_site');
    $site_ent_url = "";
    $site_ent_nom = "";

    switch ($nom_site_spip) {
        case "philo.laclasse.com" :
            $nom_site_spip = "philo";
            $site_ent_url = "http://museedesconfluences.blogs.laclasse.com";
            $site_ent_nom = ".laclasse.com";
            /*
            if login
                http://www.laclasse.com/pls/education/!page.laclasse?rubrique=428&choix=105&p_env_id=688
            */
        break;

        case "design.laclasse.com" :
            $nom_site_spip = "design";
            $site_ent_url = "Atelier design";
            $site_ent_nom = $url_site_spip;
            /*
                if login & pgp = cybercolleges42
                    $site_parent_url = http://www.cybercolleges42.fr
                    $site_parent_nom = ".cybercolleges42.fr"
                if login
                    $site_parent_nom = ".laclasse.com"
                    $site_parent_url = http://www.laclasse.com
            */

        break;
        default :
            $site_ent_url = lire_config('th/site_parent_url');
            $site_ent_nom = lire_config('th/site_ent_nom');
    }

    ecrire_config('th/site_ent_url',$site_ent_url);
    ecrire_config('th/site_ent_nom',$site_ent_nom);
    ecrire_config('nom_site',$nom_site_spip);
}


function th_ajouter_mots_clef() {
    spip_log('erererr');

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

    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='travail_en_cours' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'travail_en_cours','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='consignes' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'consignes','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='evenements' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'evenements','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blogs' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'blogs','id_groupe'=>$id_groupe));			
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='ressources' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'ressources','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='images_background' AND id_groupe=$id_groupe")) 
        $id = sql_insertq('spip_mots', array('titre'=>'images_background','id_groupe'=>$id_groupe));				

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

    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blog' AND id_groupe=$id_groupe")) 
        $id_mot_defaut = sql_insertq('spip_mots', array('titre'=>'blog','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='pas_une' AND id_groupe=$id_groupe")) 
        $id_mot_fin = sql_insertq('spip_mots', array('titre'=>'pas_une','id_groupe'=>$id_groupe));			
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe"))
        $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'laclasse.com','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='trombinoscope' AND id_groupe=$id_groupe"))
        $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'trombinoscope','id_groupe'=>$id_groupe));

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

    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe")) 
        $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'laclasse.com','id_groupe'=>$id_groupe));
    if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='sommaire_edito' AND id_groupe=$id_groupe")) 
        $id_veille_defaut = sql_insertq('spip_mots', array('titre'=>'sommaire_edito','id_groupe'=>$id_groupe));

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
}

?>
