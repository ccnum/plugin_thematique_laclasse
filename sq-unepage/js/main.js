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
  
  CCN.classes                 = [];
  CCN.intervenants            = [];
  CCN.consignes               = [];
  CCN.reponses                = [];
  CCN.articlesBlog            = [];
  CCN.articlesEvenement       = [];
  
  CCN.idRubriqueRessources    = null;
  CCN.idRubriqueAgora         = null;
  
  CCN.couleurBlog             = '';
  CCN.dureeTransition         = 800;
  
  CCN.timelineLayerConsignes  = $('#timeline_layer_consignes');
  CCN.timelineLayerBlogs      = $('#timeline_layer_blogs');
  CCN.timelineLayerEvenements = $('#timeline_layer_evenements');
  CCN.timelineLayerLivrables = $('#livrables');
  
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
    dataType: 'text',
    success: function(xml) {		
      xml = $.parseXML(xml.trim());
      	
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
			CCN.idRubriqueRessources = getXMLNodeValue('id_rubrique_ressources',xml);
			CCN.idRubriqueAgora = getXMLNodeValue('id_rubrique_agora',xml);
			
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
  
  $.ajax({
    url: fichier,
    dataType: 'text',
    success: function(xml) {		
      xml = $.parseXML(xml.trim());
			
			var xmlClasses = xml.getElementsByTagName("classe");
			
      // Pour chaque classe, on ajoute une entrée dans le tableau `CCN.classes`
			
			for (i = 0 ; i < xmlClasses.length ; ++i) {
  			var dataForClasse = {};
  			
				dataForClasse.id          = parseFloat(getXMLNodeValue('id',xmlClasses[i]));
				dataForClasse.nom         = getXMLNodeValue('nom',xmlClasses[i]);
				
				// Initialise la classe
				
				var nouvelleClasse = new Classe();
				    nouvelleClasse.init(dataForClasse);
				
				CCN.classes.push(nouvelleClasse);
				indexClasse++;
			}
			
			
			var xmlIntervenants = xml.getElementsByTagName("intervenant");
			
      // Pour chaque intervenant, on ajoute une entrée dans le tableau `CCN.intervenants`
			
			for (i = 0 ; i < xmlIntervenants.length; ++i) {
  			var dataForIntervenant = {};
  			
				dataForIntervenant.id     = parseFloat(getXMLNodeValue('id',xmlIntervenants[i]));
				dataForIntervenant.nom    = getXMLNodeValue('nom',xmlIntervenants[i]);
				
				// Initialise la classe
				
				var nouvelIntervenant = new Intervenant();
				    nouvelIntervenant.init(dataForIntervenant);
				
				CCN.intervenants.push(nouvelIntervenant);
				indexIntervenant++;
			}
			
			CCN.travailEnCoursId = parseFloat(getXMLNodeValue('travail_en_cours_id',xml));
			
			// Lance le chargement des consignes
			
			loadConsignes(CCN.urlXml+"consignes");
		}
	});
}


/**
 *  Charge le XML des consignes et des réponses
 *  puis appelle le chargement des articles du blog 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadConsignes(fichier){
  $.ajax({
    url: fichier,
    dataType: 'text',
    success: function(xml) {		
      xml = $.parseXML(xml.trim());
			
			var xmlConsignes = xml.getElementsByTagName("consigne");
			var indexY = 0;	
			
			// Pour chaque consigne, on ajoute une entrée dans le tableau `CCN.consignes`
			
			for (i = 0; i < xmlConsignes.length; ++i){
  			
  			var dataForConsigne = {};
        
        dataForConsigne.id                  = parseFloat(getXMLNodeValue('id',xmlConsignes[i]));
        dataForConsigne.intervenant_id      = parseFloat(getXMLNodeValue('intervenant_id',xmlConsignes[i]));					
        dataForConsigne.titre               = getXMLNodeValue('titre',xmlConsignes[i]);
        dataForConsigne.titre               = dataForConsigne.titre.replace("[", "<");
        dataForConsigne.titre               = dataForConsigne.titre.replace("]", ">");
        dataForConsigne.image               = getXMLNodeValue('image',xmlConsignes[i]);        
        dataForConsigne.y                   = getXMLNodeValue('y',xmlConsignes[i]);
        
        if (indexY >= CCN.projet.liste_y_consignes.length){
        	indexY = 0;
        }
        
        if ((dataForConsigne.y <= 0) || (dataForConsigne.y >= 1.05)) {
          dataForConsigne.y = CCN.projet.liste_y_consignes[indexY];
        }
        
        indexY++;
        
        dataForConsigne.date_texte          = getXMLNodeValue('date',xmlConsignes[i]);
        dataForConsigne.date                = new Date();
        dataForConsigne.date.setDate(parseFloat(dataForConsigne.date_texte.substring(0, 2)));
        dataForConsigne.date.setMonth(parseFloat(dataForConsigne.date_texte.substring(3, 5))-1);
        dataForConsigne.date.setFullYear(parseFloat(dataForConsigne.date_texte.substring(6, 10)));
        dataForConsigne.jour_consigne       = parseFloat(Math.round((dataForConsigne.date)/(24*60*60*1000)));
        dataForConsigne.nombre_jours        = dataForConsigne.jour_consigne-CCN.projet.premier_jour; // Compte des jours avec le premier jour de la CCN comme 0
        
        xmlReponses = xmlConsignes[i].getElementsByTagName("reponse");
        
        dataForConsigne.nombre_reponses     = (xmlReponses) ? xmlReponses.length : 0;
        dataForConsigne.reponses            = [];
        
        // Calcul nombre de jour max + totaux commentaires de la consigne à partir des réponses
        
        var liste_jours_max = [];
        dataForConsigne.nombre_commentaires = 0;
        
        for (j = 0; j < xmlReponses.length; j++){
        	var date_texte_reponse            = getXMLNodeValue('date',xmlReponses[j]);
        	var date_jours_max                = new Date();
        	
        	date_jours_max.setDate(parseFloat(date_texte_reponse.substring(0, 2)));
        	date_jours_max.setMonth(parseFloat(date_texte_reponse.substring(3, 5))-1);
        	date_jours_max.setFullYear(parseFloat(date_texte_reponse.substring(6, 10)));
        	
        	var jours = parseFloat(Math.round((date_jours_max)/(24*60*60*1000)))-dataForConsigne.jour_consigne;
        	liste_jours_max.push(jours);
        	
        	var nombre_commentaires_reponse   = parseFloat(getXMLNodeValue('commentaires',xmlReponses[j]));
        	dataForConsigne.nombre_commentaires += nombre_commentaires_reponse;
        	
        	dataForConsigne.reponses.push(getXMLNodeValue('classe_id',xmlReponses[j]));
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
        
        dataForConsigne.classes             = CCN.classes;
        dataForConsigne.intervenants        = CCN.intervenants;
        dataForConsigne.numero              = indexConsigne;
        
        var nouvelleConsigne = new Consigne();
            nouvelleConsigne.init(dataForConsigne);
        
        // Calcul du positionnement y intelligent des réponses (TO DO)
        
        var liste_y = [];
        
        for (j = 0; j < xmlReponses.length; j++) {
        	if (j == 0){
        		var rd = Math.floor(Math.random()*xmlReponses.length);
        		liste_y.push(rd);
        	} else {
        		for (k = 0; k < 15; k++){
        			var meme = 0;
        			var rd = Math.floor(Math.random()*xmlReponses.length);
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
        
        if (liste_y.length < xmlReponses.length){
        	liste_y.push(liste_y[0]);
        }
        
        // TO DO
        
        var hauteur_utile_reponses = CCN.projet.hauteur-nouvelleConsigne.hauteur-140; 
        var hauteur_max_reponses = hauteur_utile_reponses/liste_y.length;
        
        // Nouvelles réponses ajoutées à la consigne en cours de traitement
        
        var nb_classe_reponse = 0;
        var nb_classe_commentaires = 0;
        var indexReponseInConsigne = 0;	
        var has_current_classe_already_answer = false;		
        var answer_id_of_current_classe = null;
        		
        for (j = 0;j < xmlReponses.length; j++){
          var dataForReponse = {};
          
        	dataForReponse.id                 = parseFloat(getXMLNodeValue('id',xmlReponses[j]));
        	dataForReponse.classe_id          = parseFloat(getXMLNodeValue('classe_id',xmlReponses[j]));
        	dataForReponse.titre              = getXMLNodeValue('texte',xmlReponses[j]);
        	dataForReponse.titre              = dataForReponse.titre.replace("[", "<");
        	dataForReponse.titre              = dataForReponse.titre.replace("]", ">");
        	dataForReponse.date               = getXMLNodeValue('date',xmlReponses[j]);
        	dataForReponse.date_date          = new Date();
        	dataForReponse.date_date.setDate(parseFloat(dataForReponse.date.substring(0, 2)));
        	dataForReponse.date_date.setMonth(parseFloat(dataForReponse.date.substring(3, 5))-1);
        	dataForReponse.date_date.setFullYear(parseFloat(dataForReponse.date.substring(6, 10)));
        	
        	dataForReponse.nombre_jours       = parseFloat(Math.round((dataForReponse.date_date)/(24*60*60*1000)))-dataForConsigne.jour_consigne;
        	dataForReponse.nombre_commentaires = parseFloat(getXMLNodeValue('commentaires',xmlReponses[j]));
        	
          dataForReponse.vignette = (hasXMLNodeValue('vignette',xmlReponses[j])) ? getXMLNodeValue('vignette',xmlReponses[j]) : '';
        
          // Positionnement en hauteur (TO DO)
        	
        	dataForReponse.y = parseFloat(getXMLNodeValue('y',xmlReponses[j]));
        	
        	if ((dataForReponse.y === 0)||(dataForReponse.y > 0.8)||(dataForReponse.y < -0.2)) {
        		dataForReponse.y = (liste_y[j])/(xmlReponses.length);
        	}
			/*dataForReponse.y = (liste_y[j])/(xmlReponses.length+5)+0.12;*/
        
          dataForReponse.consigne = nouvelleConsigne;
          dataForReponse.classes = CCN.classes;
          dataForReponse.numero = indexReponse;
          dataForReponse.index = indexReponseInConsigne;
          
          // Initialise la réponse de la consigne
          
        	var nouvelleReponse = new Reponse();
            	nouvelleReponse.init(dataForReponse);
            	nouvelleConsigne.reponses.push(nouvelleReponse);
        	
        	
          // Sélection de la classe prime sur classe logguée
        	
        	if (CCN.classeSelection > 0){
        		if (CCN.classeSelection == dataForReponse.classe_id){
          		has_current_classe_already_answer = true;
          		answer_id_of_current_classe = dataForReponse.id;
          		
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
        
        if (has_current_classe_already_answer) {
        //  nouvelleConsigne.showMyReponseButtonInTimeline(answer_id_of_current_classe);
        } else {
          nouvelleConsigne.showNewReponseButtonInTimeline();
        }
        
        // Consigne suivante
        
        CCN.consignes.push(nouvelleConsigne);
        indexConsigne++;
			}
			
			// Lance le chargement des articles de blog
			loadBlog(CCN.urlXml+"articles_blog");
		}
	});
}


/**
 *  Charge le XML des articles du blog
 *  puis appelle le chargement des événements 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadBlog(fichier){
  $.ajax({
    url: fichier,
    dataType: 'text',
    success: function(xml) {		
      xml = $.parseXML(xml.trim());
      
			var xmlArticlesBlog = xml.getElementsByTagName("article");
			var indexY = 0;	
			for (i = 0; i < xmlArticlesBlog.length; i++){
  			
  			var dataForArticleBlog = {};
				
				// Nouvel article de blog
				
				dataForArticleBlog.id               = getXMLNodeValue('id',xmlArticlesBlog[i]);
				dataForArticleBlog.type_objet       = getXMLNodeValue('type_objet',xmlArticlesBlog[i]);
				dataForArticleBlog.id_objet         = getXMLNodeValue('id_objet',xmlArticlesBlog[i]);
				dataForArticleBlog.titre            = getXMLNodeValue('titre',xmlArticlesBlog[i]);
				dataForArticleBlog.titre            = dataForArticleBlog.titre.replace("[", "<");
				dataForArticleBlog.titre            = dataForArticleBlog.titre.replace("]", ">");
				dataForArticleBlog.y                = getXMLNodeValue('y',xmlArticlesBlog[i]);
				dataForArticleBlog.date             = getXMLNodeValue('date',xmlArticlesBlog[i]);;
				
				if (indexY >= CCN.projet.liste_y_blogs.length){
					indexY = 0;
				}
				
				if (dataForArticleBlog.y==0) {
  				dataForArticleBlog.y = CCN.projet.liste_y_blogs[indexY];
  		  }
  		  
				indexY++;
				
				var date = new Date();
				
				date.setDate(parseFloat(dataForArticleBlog.date.substring(0, 2)));
				date.setMonth(parseFloat(dataForArticleBlog.date.substring(3, 5))-1);
				date.setFullYear(parseFloat(dataForArticleBlog.date.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				dataForArticleBlog.nombre_jours = jour_article-CCN.projet.premier_jour;
				dataForArticleBlog.nombre_commentaires = parseFloat(getXMLNodeValue('commentaires',xmlArticlesBlog[i]));
				
				dataForArticleBlog.numero         = indexArticleBlog;
				dataForArticleBlog.index          = indexArticleBlog;
				
				var nouvelArticleBlog = new ArticleBlog();
				    nouvelArticleBlog.init(dataForArticleBlog);
				
				CCN.articlesBlog.push(nouvelArticleBlog);

				indexArticleBlog++;
			}
			
			// Lance le chargement des articles d'événements
			
			loadEvenements(CCN.urlXml+"articles_evenement");			
		}
	});
}


/**
 *  Charge le XML des événements
 *  puis appelle initTimeline 
 *
 * @param {string} fichier - URL du fichier
 */
 
function loadEvenements(fichier){
  $.ajax({
    url: fichier,
    dataType: 'text',
    success: function(xml) {		
      xml = $.parseXML(xml.trim());
			
			var xmlArticlesEvenement = xml.getElementsByTagName("article");
			var indexY = 0;	
			
			for (i = 0; i < xmlArticlesEvenement.length; i++){
				
				// Nouvel article d'événement
				
				var dataForEvenement = {};
				
				dataForEvenement.id = getXMLNodeValue('id',xmlArticlesEvenement[i]);
				dataForEvenement.type_objet = getXMLNodeValue('type_objet',xmlArticlesEvenement[i]);
				dataForEvenement.id_objet = getXMLNodeValue('id_objet',xmlArticlesEvenement[i]);
				dataForEvenement.titre = getXMLNodeValue('titre',xmlArticlesEvenement[i]);
				dataForEvenement.y = getXMLNodeValue('y',xmlArticlesEvenement[i]);
				dataForEvenement.titre = dataForEvenement.titre.replace("[", "<");
				dataForEvenement.titre = dataForEvenement.titre.replace("]", ">");
				
				if (indexY >= CCN.projet.liste_y_evenements.length){
					indexY = 0;
				}
				if (dataForEvenement.y==0) {
  				dataForEvenement.y = CCN.projet.liste_y_evenements[indexY];
  		  }
  		  
				indexY++;
				
				dataForEvenement.date = getXMLNodeValue('date',xmlArticlesEvenement[i]);
				var date = new Date();
				
				date.setDate(parseFloat(dataForEvenement.date.substring(0, 2)));
				date.setMonth(parseFloat(dataForEvenement.date.substring(3, 5))-1);
				date.setFullYear(parseFloat(dataForEvenement.date.substring(6, 10)));
				
				var jour_article = parseFloat(Math.round((date)/(24*60*60*1000)));
				dataForEvenement.nombre_jours = jour_article-CCN.projet.premier_jour;
				dataForEvenement.nombre_commentaires = parseFloat(getXMLNodeValue('commentaires',xmlArticlesEvenement[i]));
				
				dataForEvenement.numero = indexArticleEvenement;
				dataForEvenement.index = indexArticleEvenement;
				
				// Initialise l'article d'événement
				
				var nouvelArticleEvenement = new ArticleEvenement();
				    nouvelArticleEvenement.init(dataForEvenement);
				
				CCN.articlesEvenement.push(nouvelArticleEvenement);
				
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
	});
}
 

/**
 *  Initialise la vue, la timeline,
 *  définit les événements attribués aux éléments de la timeline.
 */
 
function initTimeline(){

  window.onpopstate = onHashChange;
  
  // Premier update pour initialiser certaines variables dont on a besoin
  
  CCN.projet.initTimelineMonths();
  CCN.projet.showWholeTimeline();
  
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
  
  $('.mois, .timeline_trigger').on('click',function(){
    changeTimelineMode('consignes');
    CCN.projet.showWholeTimeline();
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
	
  if (CCN.idObjetToShowAtInit == 0) {
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
  
//  CCN.projet.showWholeTimeline();
  
	setContentFromState({
  	data: {
      'type_objet':CCN.typePopupToShowAtInit,
      'id_objet':CCN.idObjetToShowAtInit,
      'page':CCN.pageToShowAtInit,
      'id_rubrique':CCN.idRubriqueToShowAtInit,
      'id_article':CCN.idArticleToShowAtInit,
      'id_syndic_article':CCN.idSyndicArticleToShowAtInit
    }
	});
  
	// Les listeners pour l'affichage timeline
	
	$().ready(function(){
		// Listener popups
	/*$('.cache .mediabox').colorbox({width:'80%',height: '80%', className:"aide-ccn", slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false, title: function(){
		var title = $(this).data("title");
		if ($(this).hasClass("description")) {
			$(this).css({position: 'absolute', top:'50%', color: 'red' })
			console.log("Description");
			console.log($(this).parent());
			$(this).parent();
			return "<p class='desc'>" + title + "</p>";
		}
		else {

			return "<p class='lol'>" + title + "</p>";
		}

		$(".aide-ccn .cboxLoadedContent").each(function(){

			if ($(this).hasClass("description")) {

			}
			$("#cboxTitle").hasClass('description').html("TESTETSTETSTSSTSTS");
		});

	}});*/
	// Silder colorbox d'aide
	$(".ccn-aide").colorbox({width:'80%',height: 'auto',rel:'ccn-aide', inline:true, href:$(this).attr('href'), current: "{current}/{total}" });
	$('.logo_menu-aide').click(function(){
		$(".ccn-aide").colorbox({open: true});
	})
	
    //$('.presentation').colorbox({ width:'80%',height: '80%',slideshow:true, slideshowSpeed: 5000, transition:"fade", loop:false});
    $('.profil').colorbox({width:'80%',height: '80%'});
    
	window.addEventListener("resize", function(event) { updateTimeline(); }, false);
	

});	
}

// C'est parti

// window.onload = init();

$(function(){
  initCCN();
});
