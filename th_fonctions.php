<?php

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
