<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function th_declarer_tables_principales($tables_principales) {

	//-- Ajout des champs extras ----------------------------------
	$tables_principales['spip_articles']['field']['id_consigne'] = "bigint(21) NOT NULL";
	$tables_principales['spip_articles']['field']['X'] = "float NOT NULL";
	$tables_principales['spip_articles']['field']['Y'] = "float NOT NULL";
	$tables_principales['spip_syndic_articles']['field']['X'] = "float NOT NULL";
	$tables_principales['spip_syndic_articles']['field']['Y'] = "float NOT NULL";
	$tables_principales['spip_rubriques']['field']['id_rubrique_lien'] = "bigint(21) NOT NULL";

	$nom = $GLOBALS['meta']['nom_site'];
	if ((strpos($nom, 'design') !== FALSE) || (strpos($nom, 'zerogaspi') !== FALSE)) {
		$tables_principales['spip_articles']['field']['champ1'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ2'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ3'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ4'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ5'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ6'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ7'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ8'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ9'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ10'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ11'] = "longtext NOT NULL";
		$tables_principales['spip_articles']['field']['champ12'] = "longtext NOT NULL";
	}

	return $tables_principales;
}

function th_declarer_tables_interfaces($interface) {

	return $interface;
}
