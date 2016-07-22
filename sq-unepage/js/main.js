var indexClasse;
var indexConsigne;
var indexReponse;
var indexArticleBlog;
var indexArticleEvenement;
var indexIntervenant;

/**
 * Première fonction initialisant le document
 * et les variables globales, puis appelant
 * le chargement du projet 
 *
 * @see loadProjet
 */   

function initCCN() {
  indexClasse                 = 0;
  indexConsigne               = 0;
  indexReponse                = 0;
  indexArticleBlog            = 0;
  indexArticleEvenement       = 0;
  indexIntervenant            = 0;
  
  g_hide_travaux              = false;
  g_hide_articles_blog        = false;
  g_hide_articles_evenement   = false;
  
  CCN.classes                 = [];
  CCN.intervenants            = [];
  CCN.consignes               = [];
  CCN.reponses                = [];
  CCN.articlesBlog            = [];
  CCN.articlesEvenement       = [];
  
  CCN.couleurBlog             = '';
  CCN.dureeTransition         = 800;
  
  // Charge le projet
  
  loadProjet(CCN.urlXml+"projet");
}


/**
 *  Charge le XML du projet,
 *  initialise le projet
 *  puis appelle le chargement des classes.
 *
 * @param {string} fichier - URL du fichier
 */

function loadProjet(fichier){  
  
  $.ajax({
    url: fichier,
    dataType: 'xml',
    success: function(xml) {			
			var dataForProjet = {};
			
			dataForProjet.date_debut                = getXMLNodeValue('date_debut',xml);
			dataForProjet.date_fin                  = getXMLNodeValue('date_fin',xml);
			dataForProjet.couleur_fond              = getXMLNodeValue('couleur_fond',xml);
			dataForProjet.couleur_base_texte        = getXMLNodeValue('couleur_base_texte',xml);
			dataForProjet.couleur_1erplan1          = getXMLNodeValue('couleur_1erplan1',xml);
			dataForProjet.couleur_1erplan2          = getXMLNodeValue('couleur_1erplan2',xml);
			dataForProjet.couleur_1erplan3          = getXMLNodeValue('couleur_1erplan3',xml);
			
			dataForProjet.largeur                   = getLargeurZone();
			dataForProjet.hauteur                   = getHauteurZone();

			dataForProjet.fps                       = parseFloat(getXMLNodeValue('fps',xml));
			dataForProjet.zoom_consignes            = getXMLNodeValue('zoom_consignes',xml);
			dataForProjet.liste_y_consignes         = getXMLNodeValue('seq_posy_consignes',xml);
			dataForProjet.liste_y_blogs             = getXMLNodeValue('seq_posy_blogs',xml);
			dataForProjet.liste_y_evenements        = getXMLNodeValue('seq_posy_evenements',xml);

			dataForProjet.url_popup_consigne        = getXMLNodeValue('url_popup_consigne',xml);
			dataForProjet.url_popup_reponse         = getXMLNodeValue('url_popup_reponse',xml);
			dataForProjet.url_popup_reponseajout    = getXMLNodeValue('url_popup_reponseajout',xml);
			dataForProjet.url_popup_blog            = getXMLNodeValue('url_popup_blog',xml);
			dataForProjet.url_popup_evenement       = getXMLNodeValue('url_popup_evenement',xml);
			dataForProjet.url_popup_ressources      = getXMLNodeValue('url_popup_ressources',xml);
			dataForProjet.url_popup_agora           = getXMLNodeValue('url_popup_agora',xml);
			dataForProjet.url_popup_classes         = getXMLNodeValue('url_popup_classes',xml);
			dataForProjet.url_popup_chat            = getXMLNodeValue('url_popup_chat',xml);
			dataForProjet.url_popup_chat2           = getXMLNodeValue('url_popup_chat2',xml);

			dataForProjet.image_fond                = (hasXMLNodeValue('image_fond',xml)) ? getXMLNodeValue('image_fond',xml) : '';
			
			// Initialise le projet
			
      CCN.projet = new Projet();
      CCN.projet.init(dataForProjet);			
      
			CCN.couleurBlog = getXMLNodeValue('couleur_blog',xml);		
			
			// Lance le chargement des classes
			
			loadClasses(CCN.urlXml+"classes");
    }
  });
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
			
			CCN.travailEnCoursId = parseFloat(xmldoc.getElementsByTagName("travail_en_cours_id")[0].childNodes[0].nodeValue);
			
			var xml_classe = xmldoc.getElementsByTagName("classe");
			
      // Pour chaque classe, on ajoute une entrée dans le tableau `CCN.classes`
			
			for (i=0;i<xml_classe.length;i++){
  			var dataForClasse = {};
  			
				dataForClasse.id = parseFloat(xml_classe[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				dataForClasse.nom = xml_classe[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				
				// Initialise la classe
				
				var nouvelle_classe = new Classe();
				nouvelle_classe.init(dataForClasse);
				
				CCN.classes.push(nouvelle_classe);
				indexClasse++;
			}
			
			
			var xml_intervenant = xmldoc.getElementsByTagName("intervenant");
			
      // Pour chaque intervenant, on ajoute une entrée dans le tableau `CCN.intervenants`
			
			for (i=0;i<xml_intervenant.length;i++){
  			var dataForIntervenant = {};
  			
				dataForIntervenant.id = parseFloat(xml_intervenant[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				dataForIntervenant.nom = xml_intervenant[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue;
				
				// Initialise la classe
				
				var nouvel_intervenant = new Intervenant();
				    nouvel_intervenant.init(dataForIntervenant);
				
				CCN.intervenants.push(nouvel_intervenant);
				indexIntervenant++;
			}
			
			// Lance le chargement des consignes
			
			loadConsignes(CCN.urlXml+"consignes");
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
			
			// Pour chaque consigne, on ajoute une entrée dans le tableau `CCN.consignes`
			
			for (i = 0; i < xml_consigne.length; i++){
  			
  			var dataForConsigne = {};
  			
        // Déclaration de la consigne
        
        dataForConsigne.id = parseFloat(xml_consigne[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        dataForConsigne.intervenant_id = parseFloat(xml_consigne[i].getElementsByTagName("intervenant_id")[0].childNodes[0].nodeValue);					
        dataForConsigne.titre = xml_consigne[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
        dataForConsigne.titre = dataForConsigne.titre.replace("[", "<");
        dataForConsigne.titre = dataForConsigne.titre.replace("]", ">");
        dataForConsigne.image = xml_consigne[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
        					
        // Positionnement en y de la consigne
        
        dataForConsigne.y = parseFloat(xml_consigne[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);
        
        if (index_y >= CCN.projet.liste_y_consignes.length){
        	index_y = 0;
        }
        
        if ((dataForConsigne.y <= 0) || (dataForConsigne.y >= 1.05)) {
          dataForConsigne.y = CCN.projet.liste_y_consignes[index_y];
        }
        
        index_y++;
        
        // Date de la consigne
        
        dataForConsigne.date_texte = xml_consigne[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        dataForConsigne.date = new Date();
        dataForConsigne.date.setDate(parseFloat(dataForConsigne.date_texte.substring(0, 2)));
        dataForConsigne.date.setMonth(parseFloat(dataForConsigne.date_texte.substring(3, 5))-1);
        dataForConsigne.date.setFullYear(parseFloat(dataForConsigne.date_texte.substring(6, 10)));
        dataForConsigne.jour_consigne = parseFloat(Math.round((dataForConsigne.date)/(24*60*60*1000)));
        dataForConsigne.nombre_jours = dataForConsigne.jour_consigne-CCN.projet.premier_jour; // Compte des jours avec le premier jour de la CCN comme 0
        
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
        
        dataForConsigne.classes = CCN.classes;
        dataForConsigne.intervenants = CCN.intervenants;
        dataForConsigne.numero = indexConsigne;
        
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
        
        var hauteur_utile_reponses = CCN.projet.hauteur-nouvelle_consigne.hauteur-140; 
        var hauteur_max_reponses = hauteur_utile_reponses/liste_y.length;
        
        // Nouvelles réponses ajoutées à la consigne en cours de traitement
        
        var nb_classe_reponse = 0;
        var nb_classe_commentaires = 0;
        var indexReponseInConsigne = 0;			
        		
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
          dataForReponse.classes = CCN.classes;
          dataForReponse.numero = indexReponse;
          dataForReponse.index = indexReponseInConsigne;
          
          // Initialise la réponse de la consigne
          
        	var nouvelle_reponse = new Reponse();
            	nouvelle_reponse.init(dataForReponse);
            	nouvelle_consigne.reponses.push(nouvelle_reponse);
        	
        	
          // Sélection de la classe prime sur classe logguée
        	
        	if (CCN.classeSelection > 0){
        		if (CCN.classeSelection == dataForReponse.classe_id){
        			nb_classe_reponse++;
        			nb_classe_commentaires += nombre_commentaires_reponse;
        		}
        	} else {
        		if (CCN.idRestreint == dataForReponse.classe_id){
        			nb_classe_reponse++;
        			nb_classe_commentaires += nombre_commentaires_reponse;
        		}
        	}
        	indexReponseInConsigne++;
        	indexReponse++;
        }
        
        // Ajoute le bouton de réponse si pas encore de réponse de la classe
        if (nb_classe_reponse == 0)	nouvelle_consigne.showNewReponseButtonInTimeline(); // TO SEE
        
        // Consigne suivante
        
        CCN.consignes.push(nouvelle_consigne);
        indexConsigne++;
			}
			
			// Lance le chargement des articles de blog
			loadBlog(CCN.urlXml+"articles_blog");
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
				
				if (index_y >= CCN.projet.liste_y_blogs.length){
					index_y = 0;
				}
				if (dataForArticleBlog.y==0) {
  				dataForArticleBlog.y = CCN.projet.liste_y_blogs[index_y];
  		  }
				
				index_y++;
				
				// Date de l'article de blog
				
				dataForArticleBlog.date = xml_blog[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				
				date.setDate(parseFloat(dataForArticleBlog.date.substring(0, 2)));
				date.setMonth(parseFloat(dataForArticleBlog.date.substring(3, 5))-1);
				date.setFullYear(parseFloat(dataForArticleBlog.date.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				dataForArticleBlog.nombre_jours = jour_article-CCN.projet.premier_jour;
				dataForArticleBlog.nombre_commentaires = parseFloat(xml_blog[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				
				dataForArticleBlog.numero = indexArticleBlog;
				dataForArticleBlog.index = indexArticleBlog;
				dataForArticleBlog.y = dataForArticleBlog.y*(CCN.projet.hauteur);
				
				
				// Initialise l'article de blog
				
				var nouvel_article = new ArticleBlog();
				    nouvel_article.init(dataForArticleBlog);
				
				CCN.articlesBlog.push(nouvel_article);

				indexArticleBlog++;
			}
			
			// Lance le chargement des articles d'événements
			
			loadEvenements(CCN.urlXml+"articles_evenement");			
		}
	}
}


/**
 *  Charge le XML des événements
 *  puis appelle initTimeline 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadEvenements(fichier){
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
				
				var dataForEvenement = {};
				
				dataForEvenement.id = xml_evenement[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
				dataForEvenement.type_objet = xml_evenement[i].getElementsByTagName("type_objet")[0].childNodes[0].nodeValue;
				dataForEvenement.id_objet = xml_evenement[i].getElementsByTagName("id_objet")[0].childNodes[0].nodeValue;
				dataForEvenement.titre = xml_evenement[i].getElementsByTagName("titre")[0].childNodes[0].nodeValue;
				dataForEvenement.y = xml_evenement[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
				dataForEvenement.titre = dataForEvenement.titre.replace("[", "<");
				dataForEvenement.titre = dataForEvenement.titre.replace("]", ">");
        
        // Positionnement en y de l'article d'événement
				
				if (index_y >= CCN.projet.liste_y_evenements.length){
					index_y = 0;
				}
				if (dataForEvenement.y==0) {
  				dataForEvenement.y = CCN.projet.liste_y_evenements[index_y];
  		  }
				//if (y!=0) alert (titre+date+y);
				index_y++;
			
        // Date
				
				dataForEvenement.date = xml_evenement[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
				var date = new Date();
				
				date.setDate(parseFloat(dataForEvenement.date.substring(0, 2)));
				date.setMonth(parseFloat(dataForEvenement.date.substring(3, 5))-1);
				date.setFullYear(parseFloat(dataForEvenement.date.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				dataForEvenement.nombre_jours = jour_article-CCN.projet.premier_jour;
				dataForEvenement.nombre_commentaires = parseFloat(xml_evenement[i].getElementsByTagName("commentaires")[0].childNodes[0].nodeValue);
				
				dataForEvenement.numero = indexArticleEvenement;
				dataForEvenement.index = indexArticleEvenement;
				dataForEvenement.y = dataForEvenement.y*(CCN.projet.hauteur-5);
				
				// Initialise l'article d'événement
				
				var nouvel_article = new ArticleEvenement();
				nouvel_article.init(dataForEvenement);
				
				CCN.articlesEvenement.push(nouvel_article);
				indexArticleEvenement++;
			}
			
			////////////////////////////////////////////////////////////////
			//
			//  Chargement xmls terminé -> démarrage de l'application
			//
			////////////////////////////////////////////////////////////////
			
      // Initialise la vue à l'ouverture selon les arguments dans l'url
      
      initTimeline();
		}
	}
}
 

/**
 *  Initialise la vue, la timeline,
 *  définit les événements attribués aux éléments de la timeline.
 */
 
function initTimeline(){
  
  // Premier update pour initialiser certaines variables dont on a besoin
  
  CCN.projet.initTimelineMonths();
  
  // Ouverture des icones evts et blogs
  
  hide_articles_blog(CCN.dureeTransition);
  hide_articles_evenement(CCN.dureeTransition);
  
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
    CCN.projet.showWholeTimeline(CCN.consignes, CCN.articlesBlog, CCN.articlesEvenement);
  });
  
	// Zoom sur la date au chargement de la page
	
	if (CCN.dateToShowAtInit != "0"){
		var jd = parseFloat(CCN.dateToShowAtInit.substring(0, 2));
		var md = parseFloat(CCN.dateToShowAtInit.substring(3, 5));
		var yd = parseFloat(CCN.dateToShowAtInit.substring(6, 10));
		
		date = new Date();
		date.setDate(jd);
		date.setMonth(md-1);
		date.setFullYear(yd);
		
		// On est dans le temps du projet ?
		
		if (Math.round(date) >= Math.round(CCN.projet.date_debut) && Math.round(date) <= Math.round(CCN.projet.date_fin)){
			var mois = Math.round((date-CCN.projet.date_debut)/(24*60*60*30.5*1000));
			CCN.projet.mois_select = mois;
			if (mois < CCN.projet.nombre_mois/2){
				CCN.projet.showRangeOfTimeline(90, (mois*CCN.projet.largeur_mois), 0);
			}else{
				CCN.projet.showRangeOfTimeline(90, ((mois+1)*CCN.projet.largeur_mois), 0);
			}
		}
	}
	
	// Ouverture au chargement d'un article, article événement, consigne ou réponse
	
	if (CCN.idObjetToShowAtInit != "0"){
		// Consigne
		if (CCN.typePopupToShowAtInit == "consignes"){
			for (k=0; k<CCN.consignes.length;k++){
				if (CCN.consignes[k].id == CCN.idObjetToShowAtInit){
					callConsigne(CCN.idObjetToShowAtInit);
				}
			}
		}
    // Réponse
    if (CCN.typePopupToShowAtInit == "travail_en_cours"){
    	for (k=0; k<CCN.consignes.length;k++){
    		for (l=0; l<CCN.consignes[k].reponses.length;l++){
    			if (CCN.consignes[k].reponses[l].id == CCN.idObjetToShowAtInit){
    				callReponse(CCN.idObjetToShowAtInit);
    			}
    		}
    	}
    }
    // Article de blog
    if (CCN.typePopupToShowAtInit == "blogs"){
    	callBlog(CCN.idObjetToShowAtInit,"article");
    }
    // Article d'événement
    if (CCN.typePopupToShowAtInit == "evenements"){
    	callEvenement(CCN.idObjetToShowAtInit,"article");
    }
    // Ressource
    if (CCN.typePopupToShowAtInit == "ressources"){
    	callRessource(CCN.idObjetToShowAtInit,"article");
    }
	}
	else {
		// Ouverture de la popup projet si première fois
		$().ready(function(){
			if (document.cookie.indexOf('visited=true') === -1) {
				var expires = new Date();
				expires.setDate(expires.getDate()+30);
				document.cookie = "visited=true; expires="+expires.toUTCString();
				//$('.presentation').colorbox({width:'900px',height: '600px',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false, open: true}); (TO DO ?)
			}			
		});
	}

	// Les listeners pour l'affichage timeline
	
	$().ready(function(){
		// Listener popups
    $('.presentation').colorbox({width:'80%',height: '80%',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false});
    $('.profil').colorbox({width:'80%',height: '80%'});
    
    window.addEventListener("resize", function(event) { updateTimeline(); }, false);
	});	
}




// C'est parti

// window.onload = init();

$(function(){
  initCCN();
});
