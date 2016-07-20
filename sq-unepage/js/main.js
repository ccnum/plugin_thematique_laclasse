var g_loaded = false;

/**
 * Première fonction initialisant le document
 * et les variables globales, puis appelant
 * le chargement du projet 
 *
 * @see loadProjet
 */   

function init() {
  g_zone                      = document.getElementById("zone");
  g_click_reponse             = false;
  g_hide_travaux              = false;
  g_hide_articles_blog        = false;
  g_hide_articles_evenement   = false;
  g_classes                   = [];
  g_classe_index              = 0;
  g_intervenants              = [];
  g_intervenant_index         = 0;
  g_consignes                 = [];
  g_consigne_index            = 0;
  g_reponses                  = [];
  g_reponse_index             = 0;
  g_articles_blog             = [];
  g_article_blog_index        = 0;
  g_articles_evenement        = [];
  g_article_evenement_index   = 0;
  g_couleur_blog              = '';
  g_duration_def              = 800;
  
  // Charge le projet
  
  loadProjet(g_u_xml+"projet");
}


/**
 *  Charge le XML du projet,
 *  initialise le projet
 *  puis appelle le chargement des classes.
 *
 * @param {string} fichier - URL du fichier
 */

function loadProjet(fichier){  
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
			
			g_couleur_blog = xmldoc.getElementsByTagName("couleur_blog")[0].childNodes[0].nodeValue;			
			
			var dataForProjet = {};
			
			dataForProjet.date_debut = xmldoc.getElementsByTagName("date_debut")[0].childNodes[0].nodeValue;
			dataForProjet.date_fin = xmldoc.getElementsByTagName("date_fin")[0].childNodes[0].nodeValue;
			dataForProjet.couleur_fond = xmldoc.getElementsByTagName("couleur_fond")[0].childNodes[0].nodeValue;
			dataForProjet.couleur_base_texte = xmldoc.getElementsByTagName("couleur_base_texte")[0].childNodes[0].nodeValue;
			dataForProjet.couleur_1erplan1 = xmldoc.getElementsByTagName("couleur_1erplan1")[0].childNodes[0].nodeValue;
			dataForProjet.couleur_1erplan2 = xmldoc.getElementsByTagName("couleur_1erplan2")[0].childNodes[0].nodeValue;
			dataForProjet.couleur_1erplan3 = xmldoc.getElementsByTagName("couleur_1erplan3")[0].childNodes[0].nodeValue;
			
			dataForProjet.largeur = getLargeurZone();
			dataForProjet.hauteur = getHauteurZone();

			dataForProjet.fps = parseFloat(xmldoc.getElementsByTagName("fps")[0].childNodes[0].nodeValue);
			dataForProjet.zoom_consignes = xmldoc.getElementsByTagName("zoom_consignes")[0].childNodes[0].nodeValue;
			dataForProjet.liste_y_consignes = xmldoc.getElementsByTagName("seq_posy_consignes")[0].childNodes[0].nodeValue;
			dataForProjet.liste_y_blogs = xmldoc.getElementsByTagName("seq_posy_blogs")[0].childNodes[0].nodeValue;
			dataForProjet.liste_y_evenements = xmldoc.getElementsByTagName("seq_posy_evenements")[0].childNodes[0].nodeValue;

			dataForProjet.url_popup_consigne = xmldoc.getElementsByTagName("url_popup_consigne")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_reponse = xmldoc.getElementsByTagName("url_popup_reponse")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_reponseajout = xmldoc.getElementsByTagName("url_popup_reponseajout")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_blog = xmldoc.getElementsByTagName("url_popup_blog")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_evenement = xmldoc.getElementsByTagName("url_popup_evenement")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_ressources = xmldoc.getElementsByTagName("url_popup_ressources")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_agora = xmldoc.getElementsByTagName("url_popup_agora")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_classes = xmldoc.getElementsByTagName("url_popup_classes")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_chat = xmldoc.getElementsByTagName("url_popup_chat")[0].childNodes[0].nodeValue;
			dataForProjet.url_popup_chat2 = xmldoc.getElementsByTagName("url_popup_chat2")[0].childNodes[0].nodeValue;

			if (xmldoc.getElementsByTagName("image_fond")[0].childNodes[0]){
				dataForProjet.image_fond = xmldoc.getElementsByTagName("image_fond")[0].childNodes[0].nodeValue;
			}else{
				dataForProjet.image_fond = "";
			}
			
			// Initialise le projet
			
      g_projet = new Projet();
      g_projet.init(dataForProjet);
			
			// Lance le chargement des classes
			
			loadClasses(g_u_xml+"classes");
		}
	}
}


/**
 *  Charge le XML des classes (liste)
 *  puis appelle le chargement des consignes.
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadClasses(fichier){
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
  			var dataForClasse = {};
  			
				dataForClasse.id = parseFloat(xml_classe[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				dataForClasse.nom = xml_classe[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				
				// Initialise la classe
				
				var nouvelle_classe = new Classe();
				nouvelle_classe.init(dataForClasse);
				
				g_classes.push(nouvelle_classe);
				g_classe_index++;
			}
			
			
			var xml_intervenant = xmldoc.getElementsByTagName("intervenant");
			
      // Pour chaque intervenant, on ajoute une entrée dans le tableau `g_intervenants`
			
			for (i=0;i<xml_intervenant.length;i++){
  			var dataForIntervenant = {};
  			
				dataForIntervenant.id = parseFloat(xml_intervenant[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				dataForIntervenant.nom = xml_intervenant[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				
				// Initialise la classe
				
				var nouvel_intervenant = new Intervenant();
				    nouvel_intervenant.init(dataForIntervenant);
				
				g_intervenants.push(nouvel_intervenant);
				g_intervenant_index++;
			}
			
			// Lance le chargement des consignes
			
			loadConsignes(g_u_xml+"consignes");
		}
	}
}


/**
 *  Charge le XML des consignes et des réponses
 *  puis appelle le chargement des articles du blog 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadConsignes(fichier){
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
  			
  			var dataForConsigne = {};
  			
        // Déclaration de la consigne
        
        dataForConsigne.id = parseFloat(xml_consigne[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        dataForConsigne.intervenant_id = parseFloat(xml_consigne[i].getElementsByTagName("intervenant_id")[0].childNodes[0].nodeValue);					
        dataForConsigne.titre = xml_consigne[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
        dataForConsigne.titre = dataForConsigne.titre.replace("[", "<");
        dataForConsigne.titre = dataForConsigne.titre.replace("]", ">");
        dataForConsigne.image = xml_consigne[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
        					
        // Positionnement en y de la consigne (sert encore ?) 
        
        dataForConsigne.y = parseFloat(xml_consigne[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);
        
        if (index_y >= g_projet.liste_y_consignes.length){
        	index_y = 0;
        }
        
        if ((dataForConsigne.y <= 0) || (dataForConsigne.y >= 1.05)) {
          dataForConsigne.y = g_projet.liste_y_consignes[index_y];
        }
        
        index_y++;
        
        // Date de la consigne
        
        dataForConsigne.date_texte = xml_consigne[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        dataForConsigne.date = new Date();
        dataForConsigne.date.setDate(parseFloat(dataForConsigne.date_texte.substring(0, 2)));
        dataForConsigne.date.setMonth(parseFloat(dataForConsigne.date_texte.substring(3, 5))-1);
        dataForConsigne.date.setFullYear(parseFloat(dataForConsigne.date_texte.substring(6, 10)));
        dataForConsigne.jour_consigne = parseFloat(Math.round((dataForConsigne.date)/(24*60*60*1000)));
        dataForConsigne.nombre_jours = dataForConsigne.jour_consigne-g_projet.premier_jour; // Compte des jours avec le premier jour de la CCN comme 0
        
        xml_reponses = xml_consigne[i].getElementsByTagName("reponse");
        
        dataForConsigne.nombre_reponses = (xml_reponses) ? xml_reponses.length : 0;
        
        // Calcul nombre de jour max + totaux commentaires de la consigne à partir des réponses
        
        var liste_jours_max = [];
        dataForConsigne.nombre_commentaires = 0;
        
        for (j = 0; j < xml_reponses.length; j++){
        	var date_texte_reponse = xml_reponses[j].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        	var date_jours_max = new Date();
        	
        	date_jours_max.setDate(parseFloat(date_texte_reponse.substring(0, 2)));
        	date_jours_max.setMonth(parseFloat(date_texte_reponse.substring(3, 5))-1);
        	date_jours_max.setFullYear(parseFloat(date_texte_reponse.substring(6, 10)));
        	
        	var jours = parseFloat(Math.round((date_jours_max)/(24*60*60*1000)))-dataForConsigne.jour_consigne;
        	liste_jours_max.push(jours);
        	
        	var nombre_commentaires_reponse = parseFloat(xml_reponses[j].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
        	dataForConsigne.nombre_commentaires += nombre_commentaires_reponse;
        }
        
        dataForConsigne.nombre_jours_max = 0;
        
        for (j = 0; j < liste_jours_max.length; j++){
        	if (dataForConsigne.nombre_jours_max < liste_jours_max[j]){
        		dataForConsigne.nombre_jours_max = liste_jours_max[j];
        	}
        }
        dataForConsigne.nombre_jours_max += dataForConsigne.nombre_jours_max/5;
        if (dataForConsigne.nombre_jours_max <= 30){
        	dataForConsigne.nombre_jours_max = 30;
        }
        
        dataForConsigne.classes = g_classes;
        dataForConsigne.intervenants = g_intervenants;
        dataForConsigne.numero = g_consigne_index;
        
        // Initialise la consigne
        
        var nouvelle_consigne = new Consigne();
            nouvelle_consigne.init(dataForConsigne);
        
        
        // Calcul du positionnement y intelligent des réponses (TO DO)
        
        var liste_y = [];
        
        for (j = 0; j < xml_reponses.length; j++) {
        	if (j == 0){
        		var rd = Math.floor(Math.random()*xml_reponses.length);
        		liste_y.push(rd);
        	} else {
        		for (k = 0; k < 15; k++){
        			var meme = 0;
        			var rd = Math.floor(Math.random()*xml_reponses.length);
        			for (l = 0; l < j; l++){
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
        
        // TO DO
        
        var hauteur_utile_reponses = g_projet.hauteur-nouvelle_consigne.hauteur-140; 
        var hauteur_max_reponses = hauteur_utile_reponses/liste_y.length;
        
        // Nouvelles réponses ajoutées à la consigne en cours de traitement
        
        var nb_classe_reponse = 0;
        var nb_classe_commentaires = 0;
        var g_reponse_index1 = 0;			
        		
        for (j = 0;j < xml_reponses.length; j++){
          var dataForReponse = {};
          
        	dataForReponse.id = parseFloat(xml_reponses[j].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        	dataForReponse.classe_id = parseFloat(xml_reponses[j].getElementsByTagName("classe_id")[0].childNodes[0].nodeValue);
        	dataForReponse.titre = xml_reponses[j].getElementsByTagName("texte")[0].childNodes[0].nodeValue;
        	dataForReponse.titre = dataForReponse.titre.replace("[", "<");
        	dataForReponse.titre = dataForReponse.titre.replace("]", ">");
        	dataForReponse.date = xml_reponses[j].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        	dataForReponse.date_date = new Date();
        	dataForReponse.date_date.setDate(parseFloat(dataForReponse.date.substring(0, 2)));
        	dataForReponse.date_date.setMonth(parseFloat(dataForReponse.date.substring(3, 5))-1);
        	dataForReponse.date_date.setFullYear(parseFloat(dataForReponse.date.substring(6, 10)));
        	
        	dataForReponse.nombre_jours = parseFloat(Math.round((dataForReponse.date_date)/(24*60*60*1000)))-dataForConsigne.jour_consigne;
        	dataForReponse.nombre_commentaires = parseFloat(xml_reponses[j].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
        	
        	if (xml_reponses[j].getElementsByTagName("vignette")[0].childNodes[0]){
        		dataForReponse.vignette = xml_reponses[j].getElementsByTagName("vignette")[0].childNodes[0].nodeValue;
        	} else {
        		dataForReponse.vignette = "";
        	}
        
          // Positionnement en hauteur (TO DO)
        	
        	dataForReponse.y = parseFloat(xml_reponses[j].getElementsByTagName("y")[0].childNodes[0].nodeValue);
        	if ((dataForReponse.y === 0)||(dataForReponse.y > 0.8)||(dataForReponse.y < -0.2)) {
        		dataForReponse.y = (liste_y[j])/(xml_reponses.length);
        	}
        	dataForReponse.y = (liste_y[j])/(xml_reponses.length+5)+0.12;
        
          dataForReponse.consigne = nouvelle_consigne;
          dataForReponse.classes = g_classes;
          dataForReponse.numero = g_reponse_index;
          dataForReponse.index = g_reponse_index1;
          
          // Initialise la réponse de la consigne
          
        	var nouvelle_reponse = new Reponse();
            	nouvelle_reponse.init(dataForReponse);
            	nouvelle_consigne.reponses.push(nouvelle_reponse);
        	
        	
          // Sélection de la classe prime sur classe logguée
        	
        	if (g_u_classe_select > 0){
        		if (g_u_classe_select == dataForReponse.classe_id){
        			nb_classe_reponse++;
        			nb_classe_commentaires += nombre_commentaires_reponse;
        		}
        	} else {
        		if (g_u_id_restreint == dataForReponse.classe_id){
        			nb_classe_reponse++;
        			nb_classe_commentaires += nombre_commentaires_reponse;
        		}
        	}
        	g_reponse_index1++;
        	g_reponse_index++;
        }
        
        // Ajoute le bouton de réponse si pas encore de réponse de la classe
        if (nb_classe_reponse == 0)	nouvelle_consigne.showNewReponseButtonInTimeline(); // TO SEE
        
        // Consigne suivante
        
        g_consignes.push(nouvelle_consigne);
        g_consigne_index++;
			}
			
			// Lance le chargement des articles de blog
			loadBlog(g_u_xml+"articles_blog");
		}
	}
}


/**
 *  Charge le XML des articles du blog
 *  puis appelle le chargement des événements 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadBlog(fichier){
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
  			
  			var dataForArticleBlog = {};
				
				// Nouvel article de blog
				
				dataForArticleBlog.id = xml_blog[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				dataForArticleBlog.type_objet = xml_blog[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
				dataForArticleBlog.id_objet = xml_blog[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
				dataForArticleBlog.titre = xml_blog[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
				dataForArticleBlog.titre = dataForArticleBlog.titre.replace("[", "<");
				dataForArticleBlog.titre = dataForArticleBlog.titre.replace("]", ">");
				dataForArticleBlog.y = xml_blog[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
				
				// Positionnement en y de l'article de blog
				
				if (index_y >= g_projet.liste_y_blogs.length){
					index_y = 0;
				}
				if (dataForArticleBlog.y==0) {
  				dataForArticleBlog.y = g_projet.liste_y_blogs[index_y];
  		  }
				
				index_y++;
				
				// Date de l'article de blog
				
				dataForArticleBlog.date = xml_blog[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				
				date.setDate(parseFloat(dataForArticleBlog.date.substring(0, 2)));
				date.setMonth(parseFloat(dataForArticleBlog.date.substring(3, 5))-1);
				date.setFullYear(parseFloat(dataForArticleBlog.date.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				dataForArticleBlog.nombre_jours = jour_article-g_projet.premier_jour;
				dataForArticleBlog.nombre_commentaires = parseFloat(xml_blog[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				
				
				//
				//
				//
				//
				// numero, id, titre, date, nombre_commentaires, nombre_jours, y, type_objet, id_objet, index
				//
				//
				//
				//
				
				dataForArticleBlog.numero = g_article_blog_index;
				dataForArticleBlog.index = g_article_blog_index;
				dataForArticleBlog.y = dataForArticleBlog.y*(g_projet.hauteur);
				
				
				// Initialise l'article de blog
				
				var nouvel_article = new ArticleBlog();
				    nouvel_article.init(dataForArticleBlog);
				    
			//	nouvel_article.init(g_article_blog_index, id, titre, date_texte, nombre_commentaires, nombre_jours, y*(g_projet.hauteur), type_objet, id_objet, g_article_blog_index)
				
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
    //  setInterval(update, 1000/g_projet.fps);
      
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
  
  g_projet.initTimelineMonths();
  
  // Ouverture des icones evts et blogs
  
  hide_articles_blog(g_duration_def);
  hide_articles_evenement(g_duration_def);
  
	updateConnecteurs();
  
  $('.reponse_haute')
  .on('mouseover',function(){
    $('body').addClass('hoveringReponse');
    $(this).addClass('hover');
    $('#connecteur_consigne_'+$(this).data('consigne-id')+'_reponse_'+$(this).data('reponse-id')).addClass('hover');
  })
  .on('mouseleave',function(){
    $('body').removeClass('hoveringReponse');
    $(this).removeClass('hover');
    $('.connecteur_timeline').removeClass('hover');
  });
  
  $('.mois').on('click',function(){
    g_projet.showWholeTimeline(g_consignes, g_articles_blog, g_articles_evenement);
  });
  
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
				g_projet.showRangeOfTimeline(90, (mois*g_projet.largeur_mois), 0);
			}else{
				g_projet.showRangeOfTimeline(90, ((mois+1)*g_projet.largeur_mois), 0);
			}
		}
	}
	
	// Ouverture au chargement d'un article, article événement, consigne ou réponse
	
	if (g_u_id_objet != "0"){
		// Consigne
		if (g_u_type_popup == "consignes"){
			for (k=0; k<g_consignes.length;k++){
				if (g_consignes[k].id == g_u_id_objet){
					callConsigne(g_u_id_objet);
				}
			}
		}
    // Réponse
    if (g_u_type_popup == "travail_en_cours"){
    	for (k=0; k<g_consignes.length;k++){
    		for (l=0; l<g_consignes[k].reponses.length;l++){
    			if (g_consignes[k].reponses[l].id == g_u_id_objet){
    				callReponse(g_consignes[k].id, g_u_id_objet);
    				showConsigneInTimeline(g_consignes[k].numero);
    			}
    		}
    	}
    }
    // Article de blog
    if (g_u_type_popup == "blogs"){
    	callBlog(g_u_id_objet,"article");
    }
    // Article d'événement
    if (g_u_type_popup == "evenements"){
    	callEvenement(g_u_id_objet,"article");
    }
    // Ressource
    if (g_u_type_popup == "ressources"){
    	callRessource(g_u_id_objet,"article");
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
    window.addEventListener("resize", function(event) { activate_action(); updateTimeline(); }, false);
    window.addEventListener("blur", function(event) { stop_action(); }, false);
	});	
}



function updateConnecteurs() {
  $('.connecteur_timeline').each(function(){
    
    var connecteur_consigne = $('#consigne_haute'+$(this).data('consigne-id'));
    var connecteur_reponse = $('#reponse_haute'+$(this).data('reponse-id'));
    
    var connecteur = $(this);
    
    var x1 = connecteur_consigne.offset().left+connecteur_consigne.outerWidth()-5;
    var y1 = connecteur_consigne.offset().top+g_projet.timeline.offset().top+5;
    var x2 = connecteur_reponse.offset().left+5;
    var y2 = connecteur_reponse.offset().top+g_projet.timeline.offset().top+5;
    
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';
    
    connecteur.css({
      'position': 'absolute',
      'transform': transform,
      'left': parseFloat(x1)+'px', 
      'top': parseFloat(y1)+'px'
    })
    .width(parseFloat(length)+'px');
  });
}

// C'est parti
window.onload = init();
