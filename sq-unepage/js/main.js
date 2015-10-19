var g_loaded = false;

/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  init()
 *
 *  Première fonction initialisant le document
 *  et les variables globales, puis appelant
 *  le chargement du projet 
 *
 */
 
function init() {
  
  // Initialise le document
  
  g_zone = document.getElementById("zone");
  g_zone.onmousedown = mouse_down;
  g_zone.onmouseup = mouse_up;
  g_zone.onmousemove = mouse_move;
  g_projet = new projet();
  
  // Initialise les globales
 
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
  g_couleur_blog = '';
  g_duration_def = 800;
  // g_bouton_plus = new bouton();
  
  stop_action();
  
  // Charge le projet -> c'est parti
  projet_load(g_u_xml+"projet");
}

/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  projet_load()
 *
 *  Charge le XML du projet,
 *  initialise le projet
 *  puis appelle le chargement des classes 
 *
 */

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
			xmldoc0 = xmldoc0.trim();
			var xmldoc = LoadXMLString(xmldoc0);
			
			// Récupération des données extraites du XML
			
			var date_debut = xmldoc.getElementsByTagName("date_debut")[0].childNodes[0].nodeValue;
			var date_fin = xmldoc.getElementsByTagName("date_fin")[0].childNodes[0].nodeValue;
			var couleur_fond = xmldoc.getElementsByTagName("couleur_fond")[0].childNodes[0].nodeValue;
			var couleur_base_texte = xmldoc.getElementsByTagName("couleur_base_texte")[0].childNodes[0].nodeValue;
			var couleur_1erplan1 = xmldoc.getElementsByTagName("couleur_1erplan1")[0].childNodes[0].nodeValue;
			var couleur_1erplan2 = xmldoc.getElementsByTagName("couleur_1erplan2")[0].childNodes[0].nodeValue;
			var couleur_1erplan3 = xmldoc.getElementsByTagName("couleur_1erplan3")[0].childNodes[0].nodeValue;
			g_couleur_blog = xmldoc.getElementsByTagName("couleur_blog")[0].childNodes[0].nodeValue;			
			//var largeur = parseFloat(xmldoc.getElementsByTagName("largeur")[0].childNodes[0].nodeValue);
			//var hauteur = parseFloat(xmldoc.getElementsByTagName("hauteur")[0].childNodes[0].nodeValue);
			var largeur = largeur_zone();
			var hauteur = hauteur_zone();

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
			var url_popup_agora = xmldoc.getElementsByTagName("url_popup_agora")[0].childNodes[0].nodeValue;
			var url_popup_classes = xmldoc.getElementsByTagName("url_popup_classes")[0].childNodes[0].nodeValue;
			var url_popup_chat = xmldoc.getElementsByTagName("url_popup_chat")[0].childNodes[0].nodeValue;
			var url_popup_chat2 = xmldoc.getElementsByTagName("url_popup_chat2")[0].childNodes[0].nodeValue;

			if (xmldoc.getElementsByTagName("image_fond")[0].childNodes[0]){
				var image_fond = xmldoc.getElementsByTagName("image_fond")[0].childNodes[0].nodeValue;
			}else{
				var image_fond = "";
			}
			
			// Initialise le projet
			g_projet.init(g_zone, largeur, hauteur, fps, date_debut, date_fin, couleur_fond, couleur_base_texte, couleur_1erplan1, couleur_1erplan2, couleur_1erplan3, image_fond, zoom_consignes, liste_y_consignes, liste_y_blogs, liste_y_evenements, url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_agora, url_popup_classes, url_popup_chat, url_popup_chat2);
			
			// Lance le chargement des classes
			classes_load(g_u_xml+"classes");
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  classes_load()
 *
 *  Charge le XML des classes (liste)
 *  puis appelle le chargement des consignes 
 *
 */
 
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
			xmldoc0 = xmldoc0.trim();
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_classe = xmldoc.getElementsByTagName("classe");
			
      // Pour chaque classe, on ajoute une entrée dans le tableau `g_classes`
			
			for (i=0;i<xml_classe.length;i++){
				var id = parseFloat(xml_classe[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				var nom = xml_classe[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				
				// Initialise la classe
				
				var nouvelle_classe = new classe();
				nouvelle_classe.init(id, nom);
				
				g_classes.push(nouvelle_classe);
				g_classe_index++;
			}
			
			// Lance le chargement des consignes
			consignes_load(g_u_xml+"consignes");
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  consignes_load()
 *
 *  Charge le XML des consignes + réponses
 *  puis appelle le chargement des articles du blog 
 *
 */
 
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
			xmldoc0 = xmldoc0.trim();
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_consigne = xmldoc.getElementsByTagName("consigne");
			var index_y = 0;	
			
			// Pour chaque consigne, on ajoute une entrée dans le tableau `g_consignes`
			
			for (i = 0; i < xml_consigne.length; i++){
  			
        // Déclaration de la consigne
        
        var id = parseFloat(xml_consigne[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var intervenant_id = parseFloat(xml_consigne[i].getElementsByTagName("intervenant_id")[0].childNodes[0].nodeValue);					
        var titre = xml_consigne[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
        titre = titre.replace("[", "<");
        titre = titre.replace("]", ">");
        var image = xml_consigne[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
        					
        // Positionnement en y de la consigne (sert encore ?) 
        
        var y = parseFloat(xml_consigne[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);
        
        if (index_y >= g_projet.liste_y_consignes.length){
        	index_y = 0;
        }
        
        if ((y <= 0) || (y >= 1.05)) {
          y = g_projet.liste_y_consignes[index_y];
        }
        
        index_y++;
        
        // Date de la consigne
        
        var date_texte = xml_consigne[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        var date = new Date();
        date.setDate(parseFloat(date_texte.substring(0, 2)));
        date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
        date.setFullYear(parseFloat(date_texte.substring(6, 10)));
        var jour_consigne = parseFloat(Math.round((date)/(24*60*60*1000)));
        var nombre_jours = jour_consigne-g_projet.premier_jour;
        
        xml_reponses = xml_consigne[i].getElementsByTagName("reponse");
        
        var nombre_reponses = (xml_reponses) ? xml_reponses.length : 0;
        
        // Calcul nombre de jour max + totaux commentaires de la consigne à partir des réponses
        
        var liste_jours_max = [];
        var nombre_commentaires = 0;
        
        for (j = 0; j < xml_reponses.length; j++){
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
        
        for (j = 0; j < liste_jours_max.length; j++){
        	if (nombre_jours_max < liste_jours_max[j]){
        		nombre_jours_max = liste_jours_max[j];
        	}
        }
        nombre_jours_max += nombre_jours_max/5;
        if (nombre_jours_max <= 30){
        	nombre_jours_max = 30;
        }
        
        // Initialise la consigne
        
        var nouvelle_consigne = new consigne();
        nouvelle_consigne.init(g_projet, g_zone, g_consigne_index, id, titre, date_texte, nombre_jours, nombre_jours_max, nombre_reponses, nombre_commentaires, y, image, intervenant_id, g_classes);
        
        nouvelle_consigne.y = (y*(g_projet.hauteur));
        
        // Calcul du positionnement y intelligent des réponses
        
        var liste_y = [];
        
        for (j = 0; j < xml_reponses.length; j++) {
        	if (j == 0){
        		var rd = Math.floor(Math.random()*xml_reponses.length);
        		liste_y.push(rd);
        	} else {
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
        
        // Nouvelles réponses ajoutées à la consigne en cours de traitement
        
        var nb_classe_reponse = 0;
        var nb_classe_commentaires = 0;
        var g_reponse_index1 = 0;			
        		
        for (j = 0;j < xml_reponses.length; j++){
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
        	} else {
        		var vignette = "";
        	}
        
          // Positionnement en hauteur
        	
        	var reponse_y = parseFloat(xml_reponses[j].getElementsByTagName("y")[0].childNodes[0].nodeValue);
        	if ((reponse_y === 0)||(reponse_y > 0.8)||(reponse_y < -0.2)) {
        		reponse_y = (liste_y[j])/(xml_reponses.length);
        	}
        	reponse_y = (liste_y[j])/(xml_reponses.length+5)+0.12;
        
          // Initialise la réponse de la consigne
        	
        	var nouvelle_reponse = new reponse();
        	nouvelle_reponse.init(g_projet, nouvelle_consigne, g_classes, g_reponse_index, id_reponse, classe_id_reponse, titre_reponse, date_texte_reponse, nombre_commentaires_reponse, nombre_jours_reponse, reponse_y, vignette, g_reponse_index1);
        	nouvelle_consigne.ajoutereponse(nouvelle_reponse);
        	
          // Sélection de la classe prime sur classe logguée
        	
        	if (g_u_classe_select > 0){
        		if (g_u_classe_select == classe_id_reponse){
        			nb_classe_reponse++;
        			nb_classe_commentaires += nombre_commentaires_reponse;
        		}
        	} else {
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
        
        // Consigne suivante
        
        g_consignes.push(nouvelle_consigne);
        g_consigne_index++;
			}
			
			// Lance le chargement des articles de blog
			blog_load(g_u_xml+"articles_blog");
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  blog_load()
 *
 *  Charge le XML des articles du bloc
 *  puis appelle le chargement des événements 
 *
 */
 
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
			xmldoc0 = xmldoc0.trim();
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_blog = xmldoc.getElementsByTagName("article");
			var index_y = 0;	
			for (i = 0; i < xml_blog.length; i++){
				
				// Nouvel article de blog
				
				var id = xml_blog[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				var type_objet = xml_blog[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
				var id_objet = xml_blog[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
				var titre = xml_blog[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
				var y = xml_blog[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
				titre = titre.replace("[", "<");
				titre = titre.replace("]", ">");
				
				// Positionnement en y de l'article de blog
				
				if (index_y >= g_projet.liste_y_blogs.length){
					index_y = 0;
				}
				if (y==0) {
  				y = g_projet.liste_y_blogs[index_y];
  		  }
				
				index_y++;
				
				// Date de l'article de blog
				
				var date_texte = xml_blog[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				
				date.setDate(parseFloat(date_texte.substring(0, 2)));
				date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
				date.setFullYear(parseFloat(date_texte.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				var nombre_jours = jour_article-g_projet.premier_jour;
				var nombre_commentaires = parseFloat(xml_blog[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				
				// Initialise l'article de blog
				
				var nouvel_article = new article_blog();
				nouvel_article.init(g_projet, g_zone, g_article_blog_index, id, titre, date_texte, nombre_commentaires, nombre_jours, y*(g_projet.hauteur), type_objet, id_objet, g_article_blog_index)
				g_articles_blog.push(nouvel_article);

				g_article_blog_index++;
			}
			
			// Lance le chargement des articles d'événements
			evenements_load(g_u_xml+"articles_evenement");			
			
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  evenements_load()
 *
 *  Charge le XML des événements
 *  puis appelle init_view 
 *
 */
 
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
			xmldoc0 = xmldoc0.trim();
			var xmldoc = LoadXMLString(xmldoc0);
			
			var xml_evenement = xmldoc.getElementsByTagName("article");
			var index_y = 0;	
			
			for (i = 0; i < xml_evenement.length; i++){
				
				// Nouvel article d'événement
				
				var id = xml_evenement[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				var type_objet = xml_evenement[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
				var id_objet = xml_evenement[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
				var titre = xml_evenement[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
				var y = xml_evenement[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
				titre = titre.replace("[", "<");
				titre = titre.replace("]", ">");
        
        // Positionnement en y de l'article d'événement
				
				if (index_y >= g_projet.liste_y_evenements.length){
					index_y = 0;
				}
				if (y==0) {
  				y = g_projet.liste_y_evenements[index_y];
  		  }
				//if (y!=0) alert (titre+date+y);
				index_y++;
			
        // Date
				
				var date_texte = xml_evenement[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				
				date.setDate(parseFloat(date_texte.substring(0, 2)));
				date.setMonth(parseFloat(date_texte.substring(3, 5))-1);
				date.setFullYear(parseFloat(date_texte.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				var nombre_jours = jour_article-g_projet.premier_jour;
				var nombre_commentaires = parseFloat(xml_evenement[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				
				// Initialise l'article d'événement
				
				var nouvel_article = new article_evenement();
				nouvel_article.init(g_projet, g_zone, g_article_evenement_index, id, titre, date_texte, nombre_commentaires, nombre_jours, y*(g_projet.hauteur-5), type_objet, id_objet, g_article_evenement_index);
				
				g_articles_evenement.push(nouvel_article);
				g_article_evenement_index++;
			}
			
			////////////////////////////////////////////////////////////////
			//
			//  Chargement xmls terminé -> démarrage de l'application
			//
			////////////////////////////////////////////////////////////////
			
      // Boucle infinie pour la màj de l'application
      setInterval(update, 1000/g_projet.fps);
      
      // Initialise la vue à l'ouverture selon les arguments dans l'url
      init_view();
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  init_view()
 *
 *  Initialise la vue, la timeline,
 *  définit les événements attribués aux éléments de la timeline 
 *
 */
 
function init_view(){
  
  // Premier update pour initialiser certaines variables dont on a besoin
  
  g_projet.update(g_zone, g_consignes, g_articles_blog, g_articles_evenement, g_mousex, g_mousey, g_mousedown, g_couleur_blog);
  g_projet.init_timeline();
  
  // Ouverture des icones evts et blogs
  
  hide_articles_blog(g_duration_def);
  hide_articles_evenement(g_duration_def);
	
	// Zoom sur la date (TO DO)
	
	if (g_u_date != "0"){
		var jd = parseFloat(g_u_date.substring(0, 2));
		var md = parseFloat(g_u_date.substring(3, 5));
		var yd = parseFloat(g_u_date.substring(6, 10));
		
		date = new Date();
		date.setDate(jd);
		date.setMonth(md-1);
		date.setFullYear(yd);
		
		// On est dans le temps du projet ?
		
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
	
	// Ouverture au chargement d'un article, article événement, consigne ou réponse
	
	if (g_u_id_objet != "0"){
		// Consigne
		if (g_u_type_popup == "consignes"){
			for (k=0; k<g_consignes.length;k++){
				if (g_consignes[k].id == g_u_id_objet){
					consigne_click(g_u_id_objet);
					consigne_ouvre(g_consignes[k].numero);
				}
			}
		}
    // Réponse
    if (g_u_type_popup == "travail_en_cours"){
    	for (k=0; k<g_consignes.length;k++){
    		for (l=0; l<g_consignes[k].reponses.length;l++){
    			if (g_consignes[k].reponses[l].id == g_u_id_objet){
    				reponse_click(g_consignes[k].id, g_u_id_objet);
    				consigne_ouvre(g_consignes[k].numero);
    			}
    		}
    	}
    }
    // Article de blog
    if (g_u_type_popup == "blogs"){
    	article_blog_click(g_u_id_objet,"article");
    }
    // Article d'événement
    if (g_u_type_popup == "evenements"){
    	article_evenement_click(g_u_id_objet,"article");
    }
    // Ressource
    if (g_u_type_popup == "ressources"){
    	article_ressource_click(g_u_id_objet,"article");
    }
	}
	else {
		// Ouverture de la popup projet si première fois
		$().ready(function(){
			if (document.cookie.indexOf('visited=true') === -1) {
				var expires = new Date();
				expires.setDate(expires.getDate()+30);
				document.cookie = "visited=true; expires="+expires.toUTCString();
				//$('.presentation').colorbox({width:'900px',height: '600px',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false, open: true});
			}			
		});
	}

	// Les listeners pour l'affichage timeline
	
	$().ready(function(){
		// Listener popups
    $('.presentation').colorbox({width:'80%',height: '80%',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false});
    $('.profil').colorbox({width:'80%',height: '80%'});
    
    // Listeners de changements sur la fenêtre pour forcer les calculs d'affichage timeline
    window.addEventListener("focus", function(event) { activate_action(); }, false);
    window.addEventListener("resize", function(event) { activate_action(); resizenow(); }, false);
    window.addEventListener("blur", function(event) { stop_action(); }, false);
	});	
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  update()
 *
 *  Met à jour les données à interpréter à chaque frame
 *
 */
 
function update(){
	// Update le projet
  g_projet.update(g_zone, g_consignes, g_articles_blog, g_articles_evenement, g_mousex, g_mousey, g_mousedown, g_couleur_blog);
  
  // Compteur de frame
  g_frame++;
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  mouse_down()
 *
 */
 
function mouse_down(){
	g_mousedown = true;
	g_projet.click(g_mousex, g_mousey, g_consignes, g_articles_blog, g_articles_evenement);
	return false;
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  mouse_move()
 *
 */
 
function mouse_up(){
	g_mousedown = false;
	return false;
}


/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  mouse_move()
 *
 */
 
function mouse_move(evenement){
	g_mousex = evenement.clientX-(window.innerWidth-g_zone.clientWidth)/2;
	g_mousey = evenement.clientY-20;
	
  // Pour gérer le mouseover sur la barre de mois : hack temporaire pour ne pas utiliser deux canvas
  if (g_mousey > g_projet.hauteur-80) 
  	activate_action();
  else 
  	g_action_mois = false;
}

// C'est parti
window.onload = init();
