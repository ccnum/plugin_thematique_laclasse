<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/cextras');
include_spip('base/th_cextras');

function th_upgrade($nom_meta_base_version, $version_cible) {

	$maj = array();

	$maj['create'] = array(
		array('maj_tables', array('spip_articles')),
		array('maj_tables', array('spip_syndic_articles')),
		array('maj_tables', array('spip_rubriques')),
		array('th_ajouter_mots_clef'),
		array('sql_alter', "TABLE spip_syndic CHANGE oubli oubli VARCHAR(3) DEFAULT 'oui'"),
		array('sql_alter', "TABLE spip_syndic CHANGE resume resume VARCHAR(3) DEFAULT 'non'"),
		array('ecrire_meta', 'articles_mots', 'oui'),
		array('ecrire_meta', 'activer_sites', 'oui'),
		array('ecrire_meta', 'activer_syndic', 'oui'),
		array('ecrire_meta', 'activer_statistiques', 'oui'),
		array('ecrire_meta', 'articles_descriptif', 'oui'),
		array('ecrire_meta', 'articles_soustitre', 'oui'),
		array('ecrire_meta', 'articles_surtitre', 'oui'),
		array('ecrire_meta', 'articles_modif', 'oui'),
		array('ecrire_meta', 'documents_article', 'oui'),
		array('ecrire_meta', 'documents_rubrique', 'oui'),
		array('ecrire_meta', 'documents_article', 'oui'),
		array('th_configurer_meta'),
		array('th_configurer_rubriques'),
	);
	cextras_api_upgrade(th_declarer_champs_extras(), $maj['create']);

	$maj['2.3.3'] = array(
		array('th_configurer_site'),
	);

	cextras_api_upgrade(th_declarer_champs_extras(), $maj['2.3.4']);

	$maj['2.3.5'] = array(
		array('sql_update', 'spip_auteurs', array('ent_statut' => 'bio')),
		array('sql_update', 'spip_auteurs', array('ent' => 'pgp'))
	);

	$maj['2.3.6'] = array(
		array('th_ajouter_mots_clef'),
	);

	$maj['2.3.13'] = array(
		array('th_configurer_meta'),
	);

	$maj['2.4.0'] = array(
		array('th_configurer_rubriques'),
	);

	cextras_api_upgrade(th_declarer_champs_extras(), $maj['3.0.3']);
	$maj['3.0.3'] = array(
		array('th_ajouter_mots_clef'),
		array('maj_tables', array('spip_rubriques')),
	);

	$maj['3.0.4'] = array(
		array('th_configurer_meta'),
	);

	include_spip('base/upgrade');
	maj_plugin($nom_meta_base_version, $version_cible, $maj);
}

function th_vider_tables($nom_meta_base_version) {
	effacer_meta($nom_meta_base_version);
}

function th_configurer_meta() {

	$documents_objets = lire_config('documents_objets');
	if (!preg_match('/spip\_articles/', $documents_objets))
		$documents_objets .= ",spip_articles";
	if (!preg_match('/spip\_rubriques/', $documents_objets))
		$documents_objets .= ",spip_rubriques";
	ecrire_meta('documents_objets', $documents_objets);

	ecrire_meta('image_process', 'gd2', 'non');
	ecrire_meta('formats_graphiques', lire_config('gd_formats_read'), 'non');

	ecrire_meta('auto_compress_http', 'oui');
	ecrire_meta('auto_compress_js', 'oui');
	ecrire_meta('auto_compress_closure', 'oui');
	ecrire_meta('auto_compress_css', 'oui');

	ecrire_meta('accepter_visiteurs', 'oui');

	ecrire_meta('forums_publics', 'abo');
	ecrire_meta('formats_documents_forum', 'gif, jpg, png, mp3, mp4, pdf, hex');

	ecrire_meta('type_urls', 'simple');
	ecrire_meta('post_dates', 'oui');

	include_spip('inc/config');
	appliquer_modifs_config(true);
}

function th_ajouter_mots_clef() {
	spip_log('erererr');

	//Creation mots clefs
	//Groupe Contenus
	if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Contenus'")) {
		$id_groupe = sql_insertq('spip_groupes_mots', array(
			'titre' => 'Contenus',
			'unseul' => 'non',
			'tables_liees' => 'rubriques',
			'minirezo' => 'oui',
			'comite' => 'non',
			'forum' => 'non'
		));
	}

	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='travail_en_cours' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'travail_en_cours', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='consignes' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'consignes', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='evenements' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'evenements', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blogs' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'blogs', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='ressources' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'ressources', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='images_background' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'images_background', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='agora' AND id_groupe=$id_groupe"))
		$id = sql_insertq('spip_mots', array('titre' => 'agora', 'id_groupe' => $id_groupe));

	//Groupe Presentation_rubriques
	if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Presentation' AND tables_liees LIKE '%rubriques%'")) {
		$id_groupe = sql_insertq('spip_groupes_mots', array(
			'titre' => 'Presentation',
			'unseul' => 'non',
			'tables_liees' => 'rubriques',
			'minirezo' => 'oui',
			'comite' => 'non',
			'forum' => 'non'
		));
	}

	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='blog' AND id_groupe=$id_groupe"))
		$id_mot_defaut = sql_insertq('spip_mots', array('titre' => 'blog', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='pas_une' AND id_groupe=$id_groupe"))
		$id_mot_fin = sql_insertq('spip_mots', array('titre' => 'pas_une', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe"))
		$id_veille_defaut = sql_insertq('spip_mots', array('titre' => 'laclasse.com', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='trombinoscope' AND id_groupe=$id_groupe"))
		$id_veille_defaut = sql_insertq('spip_mots', array('titre' => 'trombinoscope', 'id_groupe' => $id_groupe));

	//Groupe Presentation_articles
	if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='Presentation' AND tables_liees LIKE '%articles%'")) {
		$id_groupe = sql_insertq('spip_groupes_mots', array(
			'titre' => 'Presentation',
			'unseul' => 'non',
			'tables_liees' => 'articles',
			'minirezo' => 'oui',
			'comite' => 'non',
			'forum' => 'non'
		));
	}

	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='laclasse.com' AND id_groupe=$id_groupe"))
		$id_veille_defaut = sql_insertq('spip_mots', array('titre' => 'laclasse.com', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='sommaire_edito' AND id_groupe=$id_groupe"))
		$id_veille_defaut = sql_insertq('spip_mots', array('titre' => 'sommaire_edito', 'id_groupe' => $id_groupe));
	if (!$id_mot = sql_getfetsel("id_mot", "spip_mots", "titre='livrable' AND id_groupe=$id_groupe"))
		$id_veille_defaut = sql_insertq('spip_mots', array('titre' => 'livrable', 'id_groupe' => $id_groupe));

	//Groupe Sites
	if (!$id_groupe = sql_getfetsel("id_groupe", "spip_groupes_mots", "titre='site'")) {
		$id_groupe = sql_insertq('spip_groupes_mots', array(
			'titre' => 'site',
			'unseul' => 'non',
			'tables_liees' => '',
			'minirezo' => 'oui',
			'comite' => 'non',
			'forum' => 'non'
		));
	}
}

function  th_configurer_rubriques() {
	$mots = array(
		'travail_en_cours' => 'Travail des classes',
		'consignes' => 'Consignes',
		'ressources' => 'Espace Ressources',
		'blogs' => 'Agenda',
		'evenements' => 'Blog pédagogique',
		'images_background' => 'Contenu éditorial',
		'agora' => 'Discuter avec'
	);
	foreach ($mots as $mot => $titre) {
		$count = (int)sql_countsel(
			'spip_rubriques as sr
                LEFT JOIN spip_mots_liens as sml
                    ON (sr.id_rubrique = sml.id_objet AND sml.objet = "rubrique")
                LEFT JOIN spip_mots as sm
                    ON (sml.id_mot = sm.id_mot)',
			array(
				'sm.titre = "' . $mot . '"',
				'sr.id_parent = 0'
			)
		);

		if ($count < 1) {
			include_spip('action/editer_rubrique');
			$id_rubrique = rubrique_inserer(0);
			rubrique_modifier($id_rubrique, array('titre' => $titre));

			$id_mot = (int)sql_getfetsel(
				'id_mot',
				'spip_mots',
				'titre = "' . $mot . '"'
			);

			include_spip('action/editer_liens');
			$res = objet_associer(array("mots" => $id_mot), array("rubriques" => $id_rubrique));
		}
	}
}
