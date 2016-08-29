<?php

/* Surcharges Fonctions puglins */

function formulaires_joindre_document_traiter(
  $id_document = 'new',
  $id_objet = 0,
  $objet = '',
  $mode = 'auto',
  $galerie = false,
  $proposer_media = true,
  $proposer_ftp = true
) {
  $res = array('editable' => true);
  $ancre = '';
  // on joint un document deja dans le site
  if (_request('joindre_mediatheque')) {
    $refdoc_joindre = _request('refdoc_joindre');
    $refdoc_joindre = strtr($refdoc_joindre, ";,", "  ");
    $refdoc_joindre = preg_replace(',\b(doc|document|img),', '', $refdoc_joindre);
    // expliciter les intervales xxx-yyy
    while (preg_match(",\b(\d+)-(\d+)\b,", $refdoc_joindre, $m)) {
      $refdoc_joindre = str_replace($m[0], implode(" ", range($m[1], $m[2])), $refdoc_joindre);
    }
    $refdoc_joindre = explode(" ", $refdoc_joindre);
    include_spip('action/editer_document');
    foreach ($refdoc_joindre as $j) {
      if ($j = intval(preg_replace(',^(doc|document|img),', '', $j))) {
        // lier le parent en plus
        $champs = array('ajout_parents' => array("$objet|$id_objet"));
        document_modifier($j, $champs);
        if (!$ancre) {
          $ancre = $j;
        }
        $sel[] = $j;
        $res['message_ok'] = _T('medias:document_attache_succes');
      }
    }
    if ($sel) {
      $res['message_ok'] = singulier_ou_pluriel(count($sel), 'medias:document_attache_succes',
        'medias:nb_documents_attache_succes');
    }
    set_request('refdoc_joindre', ''); // vider la saisie
  } // sinon c'est un upload
  else {
    $ajouter_documents = charger_fonction('ajouter_documents', 'action');

    $mode = joindre_determiner_mode($mode, $id_document, $objet);
    include_spip('inc/joindre_document');
    $files = joindre_trouver_fichier_envoye();

    $nouveaux_doc = $ajouter_documents($id_document, $files, $objet, $id_objet, $mode);

    if (defined('_tmp_zip')) {
      unlink(_tmp_zip);
    }
    if (defined('_tmp_dir')) {
      effacer_repertoire_temporaire(_tmp_dir);
    }

    // checker les erreurs eventuelles
    $messages_erreur = array();
    $nb_docs = 0;
    $sel = array();
    foreach ($nouveaux_doc as $doc) {
      if (!is_numeric($doc)) {
        $messages_erreur[] = $doc;
      } // cas qui devrait etre traite en amont
      elseif (!$doc) {
        $messages_erreur[] = _T('medias:erreur_insertion_document_base', array('fichier' => '<em>???</em>'));
      } else {
        if (!$ancre) {
          $ancre = $doc;
        }
        $sel[] = $doc;
      }
    }
    if (count($messages_erreur)) {
      $res['message_erreur'] = implode('<br />', $messages_erreur);
    }
    if ($sel) {
      $res['message_ok'] = singulier_ou_pluriel(count($sel), 'medias:document_installe_succes',
        'medias:nb_documents_installe_succes');
    }
    if ($ancre) {
      if ($id_)
      $res['redirect'] = "spip.php?page=$objet&id_$objet=$id_objet&mode_complet#doc$ancre";
    }
  }
  if (count($sel) or isset($res['message_ok'])) {
    $callback = "";
    if ($ancre) {
      $callback .= "jQuery('#doc$ancre a.editbox').eq(0).focus();";
    }
    if (count($sel)) {
      // passer les ids document selectionnes aux pipelines
      $res['ids'] = $sel;

      $sel = "#doc" . implode(",#doc", $sel);
      $callback .= "jQuery('$sel').animateAppend();";
    }
    $js = "if (window.jQuery) jQuery(function(){ajaxReload('documents',{callback:function(){ $callback }});});";
    $js = "<script type='text/javascript'>$js</script>";
    if (isset($res['message_erreur'])) {
      $res['message_erreur'] .= $js;
    } else {
      $res['message_ok'] .= $js;
    }
  }

  return $res;
}

// http://doc.spip.org/@inc_editer_article_dist
function formulaires_public_editer_article_traiter($id_article='new', $id_rubrique=0, $retour='', $lier_trad=0, $config_fonc='articles_edit_config', $row=array(), $hidden=''){
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
  //  $res['redirect']="spip.php?page=article&id_article=$id_article1&id_consigne=$id_consigne";
  
  // $res['redirect']="spip.php?google=yahoo";
  
  // TODO
  
  return $res;
}


/************************************************************************************/
/*	FONCTIONS 																*/
/************************************************************************************/

function nb2col($nb){
	return substr($nb,strlen($nb)-1,1);
}


/****************** Tableaux et dates *****************************/

function afficher_options_date($annee,$mois,$annee_scolaire)
{
	if (date('m')>=9) $annee_actuelle = date('Y'); else $annee_actuelle = date('Y')-1;
	if ($mois<9) $annee = $annee--;	
  for ($i=$annee_actuelle;$i>=$annee;$i--) {
		$j=$i+1;
		$texte .= "<option value='$i'";
		if ($i==$annee_scolaire) $texte .= " selected ";
		$texte .= ">$i/$j</option>";
	}
	return $texte;
}

function afficher_options_date2($anneed,$moisd,$anneef,$moisf)
{
  $moisd = intval($moisd);
  $moisf = intval($moisf);
  $anneed = intval($anneed);
  $anneef = intval($anneef);

  //echo $anneef." ".$moisf;

  if ($moisd<9) $anneed = $anneed-1;
  if ($moisf<9) $anneef = $anneef-1;
  //echo $anneef." ".$moisf;

  for ($i=$anneef ; $i>=$anneed ; $i--) {
    $j=$i+1;
    $texte .= "<input type='radio' value='$i'><label>$i/$j</label>";
  }
  return $texte;
}


function tab_vide($taille)
{
	$tab = array();
    for ($i=0;$i<=$taille;$i++)	$tab[]=0;
	return $tab;
}


function date_periode($date_deb,$date_fin)
{
	$tab  = array();
	
    //Extraction des données
      list($annee1,$mois1,$jour1) = explode('-', $date_deb);
      list($annee2,$mois2,$jour2) = explode('-', $date_fin);

    //Calcul des timestamp
      $timestamp1 = mktime(0,0,0,$mois1,$jour1-1,$annee1);
      $timestamp2 = mktime(0,0,0,$mois2,$jour2,$annee2);
      $date_extract = $timestamp1;

      for ($i=1;$i<=(($timestamp2 - $timestamp1)/86400);$i++)
      {
       $date_extract = strtotime("+1 day",$date_extract);
		$date_essai = date('Y-m-d',$date_extract);
		$tab[$date_essai] = "0";
      }
	return $tab;
}

function date_periode_nb($date_deb,$date_fin)
{
	$tab  = array();
	
    //Extraction des données
      list($annee1,$mois1,$jour1) = explode('-', $date_deb);
      list($annee2,$mois2,$jour2) = explode('-', $date_fin);

    //Calcul des timestamp
      $timestamp1 = mktime(0,0,0,$mois1,$jour1-1,$annee1);
      $timestamp2 = mktime(0,0,0,$mois2,$jour2,$annee2);
      $date_extract = $timestamp1;

      for ($i=1;$i<=(($timestamp2 - $timestamp1)/86400);$i++)
      {
       $date_extract = strtotime("+1 day",$date_extract);
		$date_essai = date('Y-m-d',$date_extract);
		$tab[$date_essai] = "0";
      }
	return count($tab);
}

?>
