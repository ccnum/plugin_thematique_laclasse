var g_loaded = false;

////////////////////////////////////////////////////////////////
// init
////////////////////////////////////////////////////////////////
function init(){
        // init le document
		    g_zone = document.getElementById("zone");
		    g_zone.onmousedown = mouse_down;
		    g_zone.onmouseup = mouse_up;
		    g_zone.onmousemove = mouse_move;
		    g_projet = new projet();

        // init les globales
		    g_frame = 0;
		    g_click_reponse = false;
		    g_hide_travaux = false;
		    g_hide_articles_blog = false;
		    g_hide_articles_evenement = false;
		    g_classes = [];
		    g_classe_index = 0;
		    g_consignes = [];
		    g_consigne_index = 0;
		    g_reponses = [];
		    g_reponse_index = 0;
		    g_articles_blog = [];
		    g_article_blog_index = 0;
		    g_articles_evenement = [];
		    g_article_evenement_index = 0;
			g_bouton_plus = new bouton();
			g_couleur_blog = '';
		  	g_duration_def = 800;
		  	g_action = false;
		  	g_action_mois = false;
		  	g_action_reponses = false;		  	
      	
      	// chargement du projet -> c'est parti
			projet_load(g_u_xml+"projet");
}

////////////////////////////////////////////////////////////////
// init_view
////////////////////////////////////////////////////////////////
function init_view(){
	// 1ère update pour initialiser certaines variables dont on a besoin
		g_projet.update(g_zone, g_consignes, g_articles_blog, g_articles_evenement, g_mousex, g_mousey, g_mousedown, g_couleur_blog);
	
	// Ouverture des icones evts et blogs
		hide_articles_blog(g_duration_def);
		hide_articles_evenement(g_duration_def);
	
	// zoom sur la date
	if (g_u_date != "0"){
		var jd = parseFloat(g_u_date.substring(0, 2));
		var md = parseFloat(g_u_date.substring(3, 5));
		var yd = parseFloat(g_u_date.substring(6, 10));
		date = new Date();
		date.setDate(jd);
		date.setMonth(md-1);
		date.setFullYear(yd);
		// on est dans le temps du projet ?
		if (Math.round(date) >= Math.round(g_projet.date_debut) && Math.round(date) <= Math.round(g_projet.date_fin)){
			var mois = Math.round((date-g_projet.date_debut)/(24*60*60*30.5*1000));
			g_projet.mois_select = mois;
			if (mois < g_projet.nombre_mois/2){
				g_projet.changezoompos(90, (mois*g_projet.largeur_mois), 0);
			}else{
				g_projet.changezoompos(90, ((mois+1)*g_projet.largeur_mois), 0);
			}
		}
	}
	
	// ouverture au chargement d'un article, article événement, consigne ou réponse
	if (g_u_id_objet != "0"){
		// consigne
		if (g_u_type_popup == "consigne"){
			for (k=0; k<g_consignes.length;k++){
				if (g_consignes[k].id == g_u_id_objet){
					consigne_click(g_u_id_objet);
					consigne_ouvre(g_consignes[k].numero);					
				}
			}
		}
		// réponse
			if (g_u_type_popup == "reponse"){
				for (k=0; k<g_consignes.length;k++){
					for (l=0; l<g_consignes[k].reponses.length;l++){
						if (g_consignes[k].reponses[l].id == g_u_id_objet){
							reponse_click(g_consignes[k].id, g_u_id_objet);
							consigne_ouvre(g_consignes[k].numero);							
						}
					}
				}
			}
		// article de blog
			if (g_u_type_popup == "article"){
				article_blog_click(g_u_id_objet,"article");
			}
		// article d'événement
			if (g_u_type_popup == "article_evt"){
				article_evenement_click(g_u_id_objet,"article");
			}
		// ressource
			if (g_u_type_popup == "ressource"){
				article_ressource_click(g_u_id_objet,"article");
			}
	}
	else
	{	
		//Ouverture de la popup projet si première fois
		$().ready(function(){
			if (document.cookie.indexOf('visited=true') === -1) {
				var expires = new Date();
				expires.setDate(expires.getDate()+30);
				document.cookie = "visited=true; expires="+expires.toUTCString();
				$('.presentation').colorbox({width:'900px',height: '600px',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false, open: true});
			}			
		});
	}
	
	//Listener popups
		$().ready(function(){
			$('.presentation').colorbox({width:'900px',height: '600px',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false});
			$('.profil').colorbox({width:'900px',height: '600px'});
		});		
}

////////////////////////////////////////////////////////////////
// update
////////////////////////////////////////////////////////////////
function update(){
	// update projet
		g_projet.update(g_zone, g_consignes, g_articles_blog, g_articles_evenement, g_mousex, g_mousey, g_mousedown, g_couleur_blog);
	
	// compteur de frame
		g_frame++;
}

////////////////////////////////////////////////////////////////
// mousedown
////////////////////////////////////////////////////////////////
function mouse_down(){
	g_mousedown = true;
	g_projet.click(g_mousex, g_mousey, g_consignes, g_articles_blog, g_articles_evenement);
	return false;
}

////////////////////////////////////////////////////////////////
// mousemove
////////////////////////////////////////////////////////////////
function mouse_up(){
	g_mousedown = false;
	return false;
}

////////////////////////////////////////////////////////////////
// mousemove
////////////////////////////////////////////////////////////////
function mouse_move(evenement){
	//log ("ok"+g_mousey);
	g_mousex = evenement.clientX-(window.innerWidth-g_zone.clientWidth)/2;
	g_mousey = evenement.clientY-20;
	//Pour gérer le mouseover sur la barre de mois : hack temporaire pour ne pas utiliser deux canvas
		if (g_mousey > g_projet.hauteur-80) g_action_mois = true;
		else g_action_mois = false;
}


////////////////////////////////////////////////////////////////
// projet_load
////////////////////////////////////////////////////////////////
function projet_load(fichier){

	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST", fichier, true);
	xmlhttp.send();
	xmlhttp.onload = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmldoc0 = xmlhttp.responseText;
			xmldoc0.async = false;
			xmldoc0 = xmldoc0.replace('\n<?xml', '<?xml');
			var xmldoc = LoadXMLString(xmldoc0);
			
			var date_debut = xmldoc.getElementsByTagName("date_debut")[0].childNodes[0].nodeValue;
			var date_fin = xmldoc.getElementsByTagName("date_fin")[0].childNodes[0].nodeValue;
			var couleur_fond = xmldoc.getElementsByTagName("couleur_fond")[0].childNodes[0].nodeValue;
			var couleur_base_texte = xmldoc.getElementsByTagName("couleur_base_texte")[0].childNodes[0].nodeValue;
			var couleur_1erplan1 = xmldoc.getElementsByTagName("couleur_1erplan1")[0].childNodes[0].nodeValue;
			var couleur_1erplan2 = xmldoc.getElementsByTagName("couleur_1erplan2")[0].childNodes[0].nodeValue;
			var couleur_1erplan3 = xmldoc.getElementsByTagName("couleur_1erplan3")[0].childNodes[0].nodeValue;
			g_couleur_blog = xmldoc.getElementsByTagName("couleur_blog")[0].childNodes[0].nodeValue;			
			var largeur = parseFloat(xmldoc.getElementsByTagName("largeur")[0].childNodes[0].nodeValue);
			var hauteur = parseFloat(xmldoc.getElementsByTagName("hauteur")[0].childNodes[0].nodeValue);
			var fps = parseFloat(xmldoc.getElementsByTagName("fps")[0].childNodes[0].nodeValue);
			var zoom_consignes = xmldoc.getElementsByTagName("zoom_consignes")[0].childNodes[0].nodeValue;
			var liste_y_consignes = xmldoc.getElementsByTagName("seq_posy_consignes")[0].childNodes[0].nodeValue;
			var liste_y_blogs = xmldoc.getElementsByTagName("seq_posy_blogs")[0].childNodes[0].nodeValue;
			var liste_y_evenements = xmldoc.getElementsByTagName("seq_posy_evenements")[0].childNodes[0].nodeValue;

			var url_popup_consigne = xmldoc.getElementsByTagName("url_popup_consigne")[0].childNodes[0].nodeValue;
			var url_popup_reponse = xmldoc.getElementsByTagName("url_popup_reponse")[0].childNodes[0].nodeValue;
			var url_popup_reponseajout = xmldoc.getElementsByTagName("url_popup_reponseajout")[0].childNodes[0].nodeValue;
			var url_popup_blog = xmldoc.getElementsByTagName("url_popup_blog")[0].childNodes[0].nodeValue;
			var url_popup_evenement = xmldoc.getElementsByTagName("url_popup_evenement")[0].childNodes[0].nodeValue;
			var url_popup_ressources = xmldoc.getElementsByTagName("url_popup_ressources")[0].childNodes[0].nodeValue;
			var url_popup_classes = xmldoc.getElementsByTagName("url_popup_classes")[0].childNodes[0].nodeValue;
			var url_popup_chat = xmldoc.getElementsByTagName("url_popup_chat")[0].childNodes[0].nodeValue;
			var url_popup_chat2 = xmldoc.getElementsByTagName("url_popup_chat2")[0].childNodes[0].nodeValue;

			if (xmldoc.getElementsByTagName("image_fond")[0].childNodes[0]){
				var image_fond = xmldoc.getElementsByTagName("image_fond")[0].childNodes[0].nodeValue;
			}else{
				var image_fond = "";
			}
			// init le projet
			g_projet.init(g_zone, largeur, hauteur, fps, date_debut, date_fin, couleur_fond, couleur_base_texte, couleur_1erplan1, couleur_1erplan2, couleur_1erplan3, image_fond, zoom_consignes, liste_y_consignes, liste_y_blogs, liste_y_evenements, url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_classes, url_popup_chat, url_popup_chat2);
			// lance le chargement des classses
			//classes_load(g_u_chemin+"xml/classes.xml");
			classes_load(g_u_xml+"classes");
		}
	}
}

////////////////////////////////////////////////////////////////
// classes_load
////////////////////////////////////////////////////////////////
function classes_load(fichier){
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST", fichier, true);
	xmlhttp.send();
	xmlhttp.onload = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmldoc0 = xmlhttp.responseText;
			xmldoc0.async = false;
			xmldoc0 = xmldoc0.replace('\n<?xml', '<?xml');
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_classe = xmldoc.getElementsByTagName("classe");
			for (i=0;i<xml_classe.length;i++){
				var id = parseFloat(xml_classe[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				var nom = xml_classe[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				var nouvelle_classe = new classe();
				nouvelle_classe.init(id, nom);
				g_classes.push(nouvelle_classe);
				g_classe_index++;
			}
			// lance le chargement des consignes
			//consignes_load(g_u_chemin+"xml/consignes.xml");
			consignes_load(g_u_xml+"consignes");
		}
	}
}

////////////////////////////////////////////////////////////////
// consignes_load
////////////////////////////////////////////////////////////////
function consignes_load(fichier){
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST", fichier, true);
	xmlhttp.send();
	xmlhttp.onload = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmldoc0 = xmlhttp.responseText;
			xmldoc0.async = false;
			xmldoc0 = xmldoc0.replace('\n<?xml', '<?xml');
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_consigne = xmldoc.getElementsByTagName("consigne");
			var index_y = 0;	
			for (i=0;i<xml_consigne.length;i++){
				// nouvelle consigne
					var id = parseFloat(xml_consigne[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
					var intervenant_id = parseFloat(xml_consigne[i].getElementsByTagName("intervenant_id")[0].childNodes[0].nodeValue);					
					var titre = xml_consigne[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
					titre = titre.replace("[", "<");
					titre = titre.replace("]", ">");
					var image = xml_consigne[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
										
				// positionnement en y de la consigne
					var y = parseFloat(xml_consigne[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);
					if (index_y >= g_projet.liste_y_consignes.length){
						index_y = 0;
					}
					if ((y<=0)||(y>=1.05)) y = g_projet.liste_y_consignes[index_y];
					index_y++;

				// date
					var date_texte = xml_consigne[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
					var date = new Date();
					date.setDate(parseFloat(date_texte.substring(0, 2)));
					date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
					date.setFullYear(parseFloat(date_texte.substring(6, 10)));
					var jour_consigne = parseFloat(Math.round((date)/(24*60*60*1000)));
					var nombre_jours = jour_consigne-g_projet.premier_jour;
					xml_reponses = xml_consigne[i].getElementsByTagName("reponse");
					if (xml_reponses){
						var nombre_reponses = xml_reponses.length;
					}else{
						var nombre_reponses = 0;
					}
				// calcul nombre de jour max + totaux commentaires de la consigne à partir des réponses
					var liste_jours_max = [];
					var nombre_commentaires = 0;
					for (j=0;j<xml_reponses.length;j++){
						var date_texte_reponse = xml_reponses[j].getElementsByTagName("date")[0].childNodes[0].nodeValue;
						var date_jours_max = new Date();
						date_jours_max.setDate(parseFloat(date_texte_reponse.substring(0, 2)));
						date_jours_max.setMonth(parseFloat(date_texte_reponse.substring(3, 5))-1);
						date_jours_max.setFullYear(parseFloat(date_texte_reponse.substring(6, 10)));
						var jours = parseFloat(Math.round((date_jours_max)/(24*60*60*1000)))-jour_consigne;
						liste_jours_max.push(jours);
						var nombre_commentaires_reponse = parseFloat(xml_reponses[j].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
						nombre_commentaires += nombre_commentaires_reponse;
					}
					var nombre_jours_max = 0;
					for (j=0;j<liste_jours_max.length;j++){
						if (nombre_jours_max < liste_jours_max[j]){
							nombre_jours_max = liste_jours_max[j];
						}
					}
					nombre_jours_max += nombre_jours_max/5;
					if (nombre_jours_max <= 30){
						nombre_jours_max = 30;
					}
					var nouvelle_consigne = new consigne();
					nouvelle_consigne.init(g_projet, g_zone, g_consigne_index, id, titre, date_texte, nombre_jours, nombre_jours_max, nombre_reponses, nombre_commentaires, y, image, intervenant_id, g_classes);
					nouvelle_consigne.y = (y*(g_projet.hauteur));

				// calcul positionnement y intelligent des réponses
					var liste_y = [];
					for (j=0;j<xml_reponses.length;j++){
						if (j == 0){
							var rd = Math.floor(Math.random()*xml_reponses.length);
							liste_y.push(rd);
						}else{
							for (k=0;k<15;k++){
								var meme = 0;
								var rd = Math.floor(Math.random()*xml_reponses.length);
								for (l=0;l<j;l++){
									if (rd == liste_y[l]){
										meme++;
									}
								}
								if (meme == 0){
									liste_y.push(rd);
									break;
								}
							}
						}
					}
					if (liste_y.length < xml_reponses.length){
						liste_y.push(liste_y[0]);
					}
					var hauteur_utile_reponses = g_projet.hauteur-nouvelle_consigne.hauteur-140; 
					var hauteur_max_reponses = hauteur_utile_reponses/liste_y.length;

				// nouvelles réponses ajoutées à la consigne en cours de traitement
					var nb_classe_reponse = 0;
					var nb_classe_commentaires = 0;
					var g_reponse_index1 = 0;					
					for (j=0;j<xml_reponses.length;j++){
						var id_reponse = parseFloat(xml_reponses[j].getElementsByTagName("id")[0].childNodes[0].nodeValue);
						var classe_id_reponse = parseFloat(xml_reponses[j].getElementsByTagName("classe_id")[0].childNodes[0].nodeValue);
						var titre_reponse = xml_reponses[j].getElementsByTagName("texte")[0].childNodes[0].nodeValue;
						titre_reponse = titre_reponse.replace("[", "<");
						titre_reponse = titre_reponse.replace("]", ">");
						var date_texte_reponse = xml_reponses[j].getElementsByTagName("date")[0].childNodes[0].nodeValue;
						var date_reponse = new Date();
						date_reponse.setDate(parseFloat(date_texte_reponse.substring(0, 2)));
						date_reponse.setMonth(parseFloat(date_texte_reponse.substring(3, 5))-1);
						date_reponse.setFullYear(parseFloat(date_texte_reponse.substring(6, 10)));
						var nombre_jours_reponse = parseFloat(Math.round((date_reponse)/(24*60*60*1000)))-jour_consigne;
						var nombre_commentaires_reponse = parseFloat(xml_reponses[j].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
						if (xml_reponses[j].getElementsByTagName("vignette")[0].childNodes[0]){
							var vignette = xml_reponses[j].getElementsByTagName("vignette")[0].childNodes[0].nodeValue;
						}else{
							var vignette = "";
						}

					//Positionnement en hauteur
						var reponse_y = parseFloat(xml_reponses[j].getElementsByTagName("y")[0].childNodes[0].nodeValue);
						if (reponse_y == 0) reponse_y = ((liste_y[j]+1)*hauteur_max_reponses);
						reponse_y = reponse_y + nouvelle_consigne.hauteur + 10;

					//Création bloc
						var nouvelle_reponse = new reponse();
						nouvelle_reponse.init(g_projet, nouvelle_consigne, g_classes, g_reponse_index, id_reponse, classe_id_reponse, titre_reponse, date_texte_reponse, nombre_commentaires_reponse, nombre_jours_reponse, reponse_y, vignette, g_reponse_index1);
						nouvelle_consigne.ajoutereponse(nouvelle_reponse);
						
					// sélection de la classe prime sur classe logguée
						if (g_u_classe_select > 0){
							if (g_u_classe_select == classe_id_reponse){
								nb_classe_reponse++;
								nb_classe_commentaires += nombre_commentaires_reponse;
							}
						}else{
							if (g_u_id_restreint == classe_id_reponse){
								nb_classe_reponse++;
								nb_classe_commentaires += nombre_commentaires_reponse;
							}
						}
						g_reponse_index1++;
						g_reponse_index++;
					}
				// Ajoute le bouton de réponse si pas encore de réponse de la classe
					if (nb_classe_reponse == 0)	nouvelle_consigne.ajouter_reponse_plus();
					
				// consigne suivante
					g_consignes.push(nouvelle_consigne);
					g_consigne_index++;
			}
			// lance le chargement des articles de blog
			//blog_load(g_u_chemin+"xml/articles_blog.xml");
			blog_load(g_u_xml+"articles_blog");
		}
	}
}

////////////////////////////////////////////////////////////////
// blog_load
////////////////////////////////////////////////////////////////
function blog_load(fichier){
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST", fichier, true);
	xmlhttp.send();
	xmlhttp.onload = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmldoc0 = xmlhttp.responseText;
			xmldoc0.async = false;
			xmldoc0 = xmldoc0.replace('\n<?xml', '<?xml');
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_blog = xmldoc.getElementsByTagName("article");
			var index_y = 0;	
			for (i=0;i<xml_blog.length;i++){
				// nouvelle article de blog
				var id = xml_blog[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				var type_objet = xml_blog[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
				var id_objet = xml_blog[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
				var titre = xml_blog[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
				var y = xml_blog[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
				titre = titre.replace("[", "<");
				titre = titre.replace("]", ">");
				// positionnement en y de l'article de blog
					if (index_y >= g_projet.liste_y_blogs.length){
						index_y = 0;
					}
					if (y==0) y = g_projet.liste_y_blogs[index_y];
					index_y++;
				// date
				var date_texte = xml_blog[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				date.setDate(parseFloat(date_texte.substring(0, 2)));
				date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
				date.setFullYear(parseFloat(date_texte.substring(6, 10)));
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				var nombre_jours = jour_article-g_projet.premier_jour;
				var nombre_commentaires = parseFloat(xml_blog[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				var nouvel_article = new article_blog();
				nouvel_article.init(g_projet, g_zone, g_article_blog_index, id, titre, date_texte, nombre_commentaires, nombre_jours, y*(g_projet.hauteur), type_objet, id_objet, g_article_blog_index)
				g_articles_blog.push(nouvel_article);

				g_article_blog_index++;
			}
			// lance le chargement des articles d'événements
			//evenements_load(g_u_chemin+"xml/articles_evenement.xml");
			evenements_load(g_u_xml+"articles_evenement");			
			
		}
	}
}

////////////////////////////////////////////////////////////////
// evenements_load
////////////////////////////////////////////////////////////////
function evenements_load(fichier){
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST", fichier, true);
	xmlhttp.send();
	xmlhttp.onload = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var xmldoc0 = xmlhttp.responseText;
			xmldoc0.async = false;
			xmldoc0 = xmldoc0.replace('\n<?xml', '<?xml');
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_evenement = xmldoc.getElementsByTagName("article");
			var index_y = 0;	
			for (i=0;i<xml_evenement.length;i++){
				// nouvelle article d'événement
					var id = xml_evenement[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
					var type_objet = xml_evenement[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
					var id_objet = xml_evenement[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
					var titre = xml_evenement[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
					var y = xml_evenement[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
					titre = titre.replace("[", "<");
					titre = titre.replace("]", ">");
				// positionnement en y de l'article d'événement
					if (index_y >= g_projet.liste_y_evenements.length){
						index_y = 0;
					}
					if (y==0) y = g_projet.liste_y_evenements[index_y];
					//if (y!=0) alert (titre+date+y);
					index_y++;
				// date
					var date_texte = xml_evenement[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
					var date = new Date();
					date.setDate(parseFloat(date_texte.substring(0, 2)));
					date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
					date.setFullYear(parseFloat(date_texte.substring(6, 10)));
					var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
					var nombre_jours = jour_article-g_projet.premier_jour;
				var nombre_commentaires = parseFloat(xml_evenement[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				var nouvel_article = new article_evenement();
				nouvel_article.init(g_projet, g_zone, g_article_evenement_index, id, titre, date_texte, nombre_commentaires, nombre_jours, y*(g_projet.hauteur-5), type_objet, id_objet, g_article_evenement_index);
				g_articles_evenement.push(nouvel_article);
				g_article_evenement_index++;
			}
			////////////////////////////////////////////////////////////////
			// chargement xmls terminé -> démarrage de l'application
			////////////////////////////////////////////////////////////////
			// init : à bouger
				g_bouton_plus.init(g_projet, g_zone,0);			
			// boucle infinie pour la màj de l'application
				setInterval(update, 1000/g_projet.fps);
			// init la vue à l'ouverture selon les arguments dans l'url
				init_view();
		}
	}
}


////////////////////////////////////////////////////////////////
// consigne_ouvre
////////////////////////////////////////////////////////////////
function consigne_ouvre(numero){
	var consigne_deja_select = 0;
	for (i=0; i<g_consignes.length;i++){
		if (i != numero){
			if (g_consignes[i].select == true){
				consigne_deja_select++;
			}
		}
	}

	//Si aucune autre consigne n'est déjà ouverte on l'ouvre
		if (consigne_deja_select == 0){
			g_consignes[numero].ouvre(g_projet, g_consignes, g_articles_blog, g_articles_evenement);
		}
}

////////////////////////////////////////////////////////////////
// consigne_ferme
////////////////////////////////////////////////////////////////
function consigne_ferme(numero){
	g_consignes[numero].ferme(g_projet, g_consignes, g_articles_blog, g_articles_evenement);
}

////////////////////////////////////////////////////////////////
// consigne_click
////////////////////////////////////////////////////////////////
function consigne_click(id_consigne){
	hide_popups();
	var url = g_projet.url_popup_consigne+"&id_article="+id_consigne;
	popup(url);	
}

////////////////////////////////////////////////////////////////
// reponse_click
////////////////////////////////////////////////////////////////
function reponse_click(id_consigne, id_reponse){
	hide_popups();
	var url = g_projet.url_popup_reponse+"&id_consigne="+id_consigne+"&id_article="+id_reponse;
	popup(url);
}

////////////////////////////////////////////////////////////////
// ajoutreponse_click
////////////////////////////////////////////////////////////////
function ajoutreponse_click(id_consigne, id_rubrique_classe, numero){

	hide_popups();
	var url = g_projet.url_popup_reponseajout +"&id_consigne="+id_consigne+"&id_rubrique="+id_rubrique_classe;
	popup(url);
	//alert(numero);
	if (numero!=undefined) g_consignes[numero].div_reponse_plus.style.visibility = "hidden";

}

////////////////////////////////////////////////////////////////
// article_blog_click
////////////////////////////////////////////////////////////////
function article_blog_click(id_objet,type_objet){
	hide_popups();	
	var url = g_projet.url_popup_blog+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url);
}

////////////////////////////////////////////////////////////////
// article_evenement_click
////////////////////////////////////////////////////////////////
function article_evenement_click(id_objet,type_objet){
	hide_popups();
	var url = g_projet.url_popup_evenement+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url);
}


////////////////////////////////////////////////////////////////
// article_ressource_click
////////////////////////////////////////////////////////////////
function article_ressource_click(id_objet,type_objet){
	hide_popups();
	var url = g_projet.url_popup_ressources+"&id_"+type_objet+"="+id_objet;
	popup(url);
}

////////////////////////////////////////////////////////////////
// ressources_click
////////////////////////////////////////////////////////////////
function ressources_click(){
	hide_popups();
	var url = g_projet.url_popup_ressources;
	popup(url);	
}

////////////////////////////////////////////////////////////////
// classes_click
////////////////////////////////////////////////////////////////
function classes_click(){
	hide_popups();
	var url = g_projet.url_popup_classes;
	popup(url);
}

////////////////////////////////////////////////////////////////
// chat_click
////////////////////////////////////////////////////////////////
function chat_click(type){
	var url = g_projet.url_popup_chat;
	if (type==2) url = g_projet.url_popup_chat2;
	if (url.match("target=blank"))
	{
		window.open(url);
	}
	else
	if (url.match("<"))
	{
		hide_popups();
		popup_html(url);	
	}	
	else
	{
		hide_popups();
		popup(url);
	}
}

////////////////////////////////////////////////////////////////
// reponse_ajouter_click
////////////////////////////////////////////////////////////////
function reponse_ajouter_click(){
	hide_popups();
	var url = g_projet.url_popup_reponseajout;
	popup(url);
}


////////////////////////////////////////////////////////////////
// hide_popups
////////////////////////////////////////////////////////////////
function hide_popups(){
	g_action = false;
}

////////////////////////////////////////////////////////////////
// hide_buttons
////////////////////////////////////////////////////////////////
function hide_buttons(){
	g_bouton_plus.div_base.style.visibility = "hidden";
	reponse_plus2 = document.getElementById("reponse_plus2");
	if (reponse_plus2 != null) reponse_plus2.style.visibility = "hidden";
}

////////////////////////////////////////////////////////////////
// show_buttons
////////////////////////////////////////////////////////////////
function show_buttons(){
	g_bouton_plus.div_base.style.visibility = "visible";
	reponse_plus2 = document.getElementById("reponse_plus2");
	if (reponse_plus2 != null) reponse_plus2.style.visibility = "visible";
}


////////////////////////////////////////////////////////////////
// showhide_travaux
////////////////////////////////////////////////////////////////
function showhide_travaux(mode){
	if (mode==undefined) mode = '';
	if ((g_hide_travaux == false)||(mode=='hide')){
		for (i=0; i<g_consignes.length;i++){
			$(g_consignes[i].div_base).fadeTo(2000,0.1);
			//g_consignes[i].cache_questionscommentaires();
			if (g_consignes[i].select == true){
				$(g_consignes[i].div_home).fadeOut('slow');
				$(g_consignes[i].div_reponse_plus).fadeOut('slow');
				for (j=0; j<g_consignes[i].reponses.length;j++){
					$(g_consignes[i].reponses[j].div_base).fadeOut('slow');
				}
			}
		}
		g_hide_travaux = true;
	}else{
		for (i=0; i<g_consignes.length;i++){
			$(g_consignes[i].div_base).fadeTo('slow',1);
			//g_consignes[i].montre_questionscommentaires();
			if (g_consignes[i].select == true){
					$(g_consignes[i].div_home).fadeIn('slow');
					$(g_consignes[i].div_reponse_plus).fadeIn('slow');
					g_consignes[i].cache_questionscommentaires();
					for (j=0; j<g_consignes[i].reponses.length;j++){
						$(g_consignes[i].reponses[j].div_base).fadeIn('slow');
					}
			}
		}
		g_hide_travaux = false;
	}
}

////////////////////////////////////////////////////////////////
// c'est parti
////////////////////////////////////////////////////////////////
window.onload = init();