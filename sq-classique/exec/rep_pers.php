<?php

// script à placer dans le dossier ecrire de SPIP
// permets de r&eacute;partir les personnages dans les lieux
// pvincent@erasme.org 01-09-04

//traitement des donn&eacute;es POST et &eacute;criture dans la table

if ($_POST) 
	{
	foreach ($_POST as $id_pers => $id_lieu) 
		{ 
		  $req = "UPDATE spip_rubriques SET extra=$id_lieu WHERE id_rubrique=$id_pers";
		  $result = spip_query($req);
		}

	}

if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('inc/presentation');
include_spip('inc/auteur_voir');
include_spip('inc/message_select');

function exec_rep_pers_dist()
{
global $connect_id_auteur, $spip_display;
global $auteur_debut;
//ajout erasme - 10.09.2008
include_once('../'.$GLOBALS['dossier_squelettes'].'/mes_fonctions.php');
//foreach ($GLOBALS as $id=>$data) echo $id.$data."<br>";

//debut_page("R&eacute;partition des personnages");

echo "<br><br><br>";
//gros_titre("R&eacute;partition g&eacute;ographique des personnages");
//debut_gauche();

//debut_boite_info();

echo "<FONT FACE='Verdana,Arial,Helvetica,sans-serif' SIZE=2>";
echo "<P align=left>".propre("Cette page permets de placer chacun des personnages du cluemo dans un lieu donn&eacute;. ");

echo "</FONT>";

//fin_boite_info();

//debut_droite();
  
echo "<FONT SIZE=2 FACE='Georgia,Garamond,Times,serif'>";

global $connect_statut;

/*if ($connect_statut != "0minirezo" OR  !$connect_toutes_rubriques) 
	{
	echo "Vous n'avez pas acc&egrave;s &agrave; cette page.";
	fin_page();
	exit;
	}
*/
       $page = "?exec=rep_pers";

//  Lecture des donn&eacute;es existantes dans les tables de mot clef
	      
	      echo "<form action=\"$page\" method=\"post\">";
				
				//premiere ligne
				echo "<center><TABLE border=1><TR><TD></TD>";
	      		
	      		$req0 = "SELECT * FROM spip_rubriques WHERE id_parent=3";	
	   			$result0 = spip_query($req0);
	   			while ($lieu0 = spip_fetch_array($result0))
	   			{
	      		echo "<TD>Lieu<br /><a href=\"?exec=naviguer&id_rubrique=".$lieu0['id_rubrique']."\">".$lieu0['titre']."</a></TD>";	
	      		}	
      			
      			echo "</TR>";
      			
      			//ligne n
				$req2 = "SELECT * FROM spip_rubriques WHERE id_parent=3";
				$result2 = spip_query($req2);
	   			while ($pers = spip_fetch_array($result2))
	   			{	
	      			echo "<TR><TD>Pers<br /><a href=\"?exec=naviguer&id_rubrique=".$pers['extra']."\">".$pers['titre']."</a></TD>";
	      			$req0 = "SELECT id_rubrique,titre FROM spip_rubriques WHERE id_parent=3";	
		   			$result0 = spip_query($req0);
		   			
		   			while ($lieu = spip_fetch_array($result0))
		   			{	
		      				echo "<TD>";
		      				if ($pers['extra']==$lieu['id_rubrique']) $j="Value='".$lieu['id_rubrique']."' checked"; 
		      				else $j="Value='".$lieu['id_rubrique']."'";
		      				echo "<INPUT Type='radio' Name='".$pers['id_rubrique']."' $j></TD>";
		      			}
		      			echo "</TR>";
	      			}	
      			
      			echo "<TABLE>";	
      			echo "<p><input type=\"submit\" value=\"OK\" /></p>";

				echo "<p>";
				echo "</FONT></form>";

		
//fin_page();	

}

?>
