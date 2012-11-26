<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

function th_declarer_tables_principales($tables_principales){	
	
	//-- Ajout des champs extras ----------------------------------
		$tables_principales['spip_articles']['field']['id_consigne'] = "bigint(21) NOT NULL";
		$tables_principales['spip_articles']['field']['X'] = "float NOT NULL"; 
		$tables_principales['spip_articles']['field']['Y'] = "float NOT NULL";
		$tables_principales['spip_syndic_articles']['field']['X'] = "float NOT NULL";
		$tables_principales['spip_syndic_articles']['field']['Y'] = "float NOT NULL";
		return $tables_principales;
}

function th_declarer_tables_interfaces($interface){
	
	return $interface;
}


?>
