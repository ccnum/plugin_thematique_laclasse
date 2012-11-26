<?php

//Variables Globales

$GLOBALS['debut_annee_scolaire']='2009-07';
$GLOBALS['auteur_debut']=1;
$GLOBALS['auteur_affiche'] = ' OR aut.nom LIKE "%Art Gens%" OR aut.nom LIKE "%bertolini%" OR aut.nom LIKE "%Service Agriculture et Environnement%" OR aut.login LIKE "%jmoulin%" OR aut.login LIKE "%pvincent%" OR aut.login LIKE "%hleroy%" OR aut.login LIKE "%cmonnet%"';

if ($GLOBALS['meta']['nom_site']=='cluemo.laclasse.com')	$GLOBALS['auteur_debut']=89;
if ($GLOBALS['meta']['nom_site']=='ledechetmatiere.laclasse.com')	$GLOBALS['auteur_debut']=42;
if ($GLOBALS['meta']['nom_site']=='maisondeladanse.laclasse.com')	$GLOBALS['auteur_debut']=7;
//if ($GLOBALS['meta']['nom_site']=='novaterra.laclasse.com')	$GLOBALS['auteur_debut']=1;

//Fonctions
 function rand_hexcolor()
 {
 $color = dechex(mt_rand(0,16777215));
 $color = str_pad($color,6,'0');

 return $color;
 } 

//Initialisations connexion	
/*
	if (isset($GLOBALS['auteur_session']['nom']))
		{
			$id_auteur = $GLOBALS['auteur_session']['id_auteur'];
			$GLOBALS['result_admin'] = mysql_query("SELECT rubriques.id_rubrique, titre FROM spip_auteurs_rubriques AS lien, spip_rubriques AS rubriques, spip_auteurs AS auteur WHERE lien.id_auteur=$id_auteur AND lien.id_rubrique=rubriques.id_rubrique AND auteur.statut='0minirezo' AND auteur.id_auteur=$id_auteur");
			$GLOBALS['restreint'] = mysql_num_rows($GLOBALS['result_admin']);
		}
	else
		{
			$GLOBALS['restreint'] = 0;
		}
*/
	/*
	$url_logout = "http://www.laclasse.com/pls/education/!page.html?pid=65&paction=logout&service=".urlencode("#URL_SITE_SPIP")."%2Fspip%2Ephp%3Faction%3Dlogout%26logout%3D".urlencode($login)."%26url%3Dspip%252Ephp%253Fpage%253Dsommaire";
	$url_login = "http://www.laclasse.com/pls/education/!page.html?pid=65&paction=login&service=".urlencode("#URL_SITE_SPIP")."%2Fspip%2Ephp%3Faction%3Dcookie%26session_login_hidden%3D[LOGIN]%26session_password%3D[PASSWORD]%26essai_login%3Doui%26url%3Dspip%252Ephp%253Fpage%253Dpublier%2526id_rubrique%253D3";
	$url_publier = "http://www.laclasse.com/pls/education/!page.html?pid=65&paction=login&service=".urlencode("#URL_SITE_SPIP")."%2Fspip%2Ephp%3Faction%3Dcookie%26session_login_hidden%3D[LOGIN]%26session_password%3D[PASSWORD]%26essai_login%3Doui%26url%3Dspip%252Ephp%253Fpage%253Dpublier%2526id_rubrique%253D8";
	$url_inscription = "http://www.laclasse.com/pls/education/!page.laclasse?contexte=INSCRIPTION&rubrique=0";
	$url_pass_perdu = "http://www.laclasse.com/pls/education/!page.laclasse?contexte=QUESTION&rubrique=0";
	$url_logout_spip = "spip.php?action=logout&logout=".$login."&url=spip.php?page=sommaire";
	*/


//Function qui retourne le nom de login de l'auteur en fonction de son id
	function auteur_login($id_auteur)
	{
		$login_auteur="";
		$result_auteur = spip_query("SELECT login FROM spip_auteurs WHERE id_auteur=$id_auteur");
		while ($row_auteur = spip_fetch_array($result_auteur))
			{
				$login_auteur=$row_auteur["login"];
			} 
		return $login_auteur;
	}

//Function qui retourne le nom de l'auteur en fonction de son id
	function auteur_nom($id_auteur)
	{
		$nom_auteur="";
		$result_auteur = spip_query("SELECT nom FROM spip_auteurs WHERE id_auteur=$id_auteur");						
		while ($row_auteur = spip_fetch_array($result_auteur))
			{
				$nom_auteur=$row_auteur["nom"];
			} 
		return $nom_auteur;
	}

	function inserer_mot_article($id_article,$id_mot)
	{
		$result_mot = spip_query("INSERT INTO `spip_mots_articles` ( `id_mot` , `id_article` ) VALUES ('$id_mot', '$id_article');");
	}

//Function principale qui affiche l'arborescence des rubriques restreintes, totale ou aucune
//en fonction du statut
	function auteur_publier($id_auteur,$statut)
		{
			global $restreint;
			global $result_admin;
			$droit=1;
			//admin restreint
			if ($restreint!=0)
				{
						while ($row_admin = spip_fetch_array($result_admin)) 
						{
							$id_rubrique = $row_admin["id_rubrique"];
							$titre = supprimer_numero($row_admin["titre"]);
							auteur_publier_rubrique($id_rubrique,$titre,'>&nbsp;','');
							//echo "> <b><a class='lienss' href='#URL_SITE_SPIP/ecrire/?exec=naviguer&id_rubrique=".$id_rubrique."'>".supprimer_numero($titre)."</a></b><br />";
							auteur_publier_branche($row_admin["id_rubrique"]);
						}
				}

			else
		
			//administrateur
			if ($statut=='0minirezo')
				{
					auteur_publier_branche(0);
				}
		
		else
		
			//visiteur
			{
				$droit=0;
				echo "Vous n'avez pas de droits d'acc&egrave;s ouverts en publication.";
			}
			return $droit;
		}


//Fonction qui affiche toute l'arborescence des rubriques
function auteur_publier_branche($leparent)
			{
				global $id_parent;
				global $id_rubrique;
				global $i;
				
				$i++;
			 	$query="SELECT * FROM spip_rubriques WHERE id_parent='$leparent' ORDER BY 0+titre, titre";
			 	$result=mysql_query($query);

				while($row=mysql_fetch_array($result))
				{
					$my_rubrique=$row["id_rubrique"];
					$titre=supprimer_numero($row["titre"]);
					
					if (!ereg(",$my_rubrique,","$toutes_rubriques"))
					{
						$espace="";
						$espace2="";
						for ($count=0;$count<$i;$count++){$espace.="&nbsp;&nbsp;";}
						$espace .= "|";
						if ($i==1)
							$espace = ">&nbsp;";
						
						if ($i==1) $style = "publier_gras";
						//echo "<a class='lienss' href='#URL_SITE_SPIP/ecrire/?exec=naviguer&id_rubrique=".$my_rubrique."'>".supprimer_numero($titre)."<br />";
						auteur_publier_rubrique($my_rubrique,$titre,$espace,$style);
						//echo "</a>";
						auteur_publier_branche($my_rubrique);
					}
				}
				$i=$i-1;
			}

function auteur_publier_rubrique($id_rubrique,$titre,$espace='',$style='',$couper=true)
{		
		include_spip('inc/securiser_action');
		//Exclusion des rubriques publier et espace de discussion		
		if (($id_rubrique!=8)&&($id_rubrique!=4))
		{
			$hash1 = $GLOBALS['auteur_session']['id_auteur'].$GLOBALS['auteur_session']['pass'];
			$action = "editer_article";
			$style .= sprintf(" publier %s",$style);
			$redirect= $GLOBALS['meta']['adresse_site']."/spip.php?page=article";

			//Titres
				$titre_article="Publication";			
				if (strcmp($GLOBALS['meta']['nom_site'],'novaterra.laclasse.com')==0)	$titre_article="Exploration";
				$titre = attribut_html($titre);
				if ($couper) $titre1 = couper($titre,17); else $titre1=$titre;
				if ((strpos($titre,"Nouvel")==false)&&(strpos($titre,"pondre")==false)&&(strpos($titre,"Consigne")==false)&&(strcmp($titre," ")!=0)) $titre = "dans ".$titre;
				else $titre='';
			//Mot-Clef
				if (strcmp($GLOBALS['meta']['nom_site'],'bd.laclasse.com')==0)
				{
					$result_rubrique = spip_query("SELECT id_parent FROM spip_rubriques WHERE id_rubrique=$id_rubrique");
					while ($row_rubrique = spip_fetch_array($result_rubrique))	{	$id_parent=$row_rubrique["id_parent"];	}

					if ($id_parent==3)
					{
						//Michel Meral -> marge
						if (($GLOBALS['auteur_session']['id_auteur']==3)||($GLOBALS['auteur_session']['id_auteur']==3))
							{
							$redirect = $GLOBALS['meta']['adresse_site']."/spip.php?page=inc-mot&id_mot=5";
							$titre_article="Marge";
							}
						//classes BD -> planche			
						else
							{
							$redirect = $GLOBALS['meta']['adresse_site']."/spip.php?page=inc-mot&id_mot=4";
							$titre_article="Planche";
							}
					}
				}

			//Ajout de la date
				$titre_article .= " du ".date("m.d.y");
				$confirmation= attribut_html("Etes vous sûr de vouloir créer une nouvelle ".$titre_article." ?");
				$att=" mmethod='post' name='formulaire' onSubmit='return confirmation(\"$confirmation\")'";
				$mode="<input type='hidden' name='statut' value='publie' /><input id='titreparent' name='titreparent' type='hidden' type='text' value='".$titre1."' /><input type='hidden' id='id_parent' name='id_parent' value='".$id_rubrique."' /><input type='hidden' name='editer_article' value='oui' /><input type='hidden' name='titre' value='".$titre_article."' /><input id='text_area' name='texte' type='hidden' value=''>".$espace."<input class='".$style."' type='submit' title='Publier un nouvel article ".$titre."' value='".$titre1."' />";
				$arg="oui";							
				echo securiser_action_auteur($action, $arg, $redirect, $mode, $att);
			}
}


/*Lien vers UNE rubrique administrée (reservé aux personnes qui n'en ont qu'une)*/

		function auteur_publier_lien($titre='',$id_rubrique=0,$espace='',$style='')
		{
				global $restreint;
				global $result_admin;
				$droit=1;

				//Génération automatique du titre du lien
					//la MDLD -> consigne
					if (($GLOBALS['auteur_session']['login']=='capitaine')
						||($GLOBALS['auteur_session']['login']=='olivier')
						||($GLOBALS['auteur_session']['login']=='ordinateur'))
						{
						$titre="Publier une consigne";
						}
					//classes répondre à la consigne
					else
						{
						$titre="Répondre";
						}
		
				//admin restreint
				if ($restreint!=0)
					{
							mysql_data_seek($result_admin,0);
							$row_admin = spip_fetch_array($result_admin);
							$id_rubrique = $row_admin["id_rubrique"];
							if ($titre=='') $titre = supprimer_numero($row_admin["titre"]);
							auteur_publier_rubrique($id_rubrique,$titre,$espace,$style,false);
					}

				else
		
				//administrateur
				if ($statut=='0minirezo')
					{
							if ($titre=='') $titre = 'Publier un nouvel Article dans Le projet';
							if ($id_rubrique==0) $id_rubrique = 5;
							auteur_publier_rubrique($id_rubrique,$titre,$espace,$style,false);
					}
		
			else
		
				//visiteur
				{
					$droit=0;
				}
				return $droit;		
		
			}


?>
