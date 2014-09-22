<?php
if (!defined("_ECRIRE_INC_VERSION")) return;
 
function th_declarer_champs_extras($champs = array()) {
    $champs['spip_auteurs']['ent'] = array(
        'saisie' => 'input',//Type du champ (voir plugin Saisies)
        'options' => array(
        'nom' => 'ent',
        'label' => _T('th:ent'),
        'sql' => "varchar(255) NOT NULL DEFAULT ''",
        'defaut' => '',// Valeur par défaut
        'disable' => 'disable',
        'restrictions'=>array('voir' => array('auteur' => ''),//Tout le monde peut voir
        'modifier' => array('auteur' => 'webmestre')),//Seuls les webmestres peuvent modifier
        ),
    );
    $champs['spip_auteurs']['ent_statut'] = array(
        'saisie' => 'selection',//Type du champ (voir plugin Saisies)
        'options' => array(
        'nom' => 'ent_statut',
        'label' => _T('th:ent_statut'),
        'sql' => "varchar(255) NOT NULL DEFAULT ''",
        'defaut' => '',// Valeur par défaut
        'datas' => array('ADM' => 'ADM','ADM_ETB' => 'ADM_ETB','PROF' => 'PROF' ,'PARENT' => 'PARENT' ,'ELEVE' => 'ELEVE'),
        'restrictions'=>array('voir' => array('auteur' => ''),//Tout le monde peut voir
        'modifier' => array('auteur' => array('webmestre','0minirezo'))),//Seuls les webmestres peuvent modifier
        ),
    );
    return $champs;
}
?>
