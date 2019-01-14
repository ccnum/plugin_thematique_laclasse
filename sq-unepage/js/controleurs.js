var vue = 'timeline';
var canShowConsigneSidebar = false;
var antiPushState = false;

var detailsLivrableOpen = false;


// Verifie les parametres dans l'url
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results){
    return results[1] || 0;
  }
}

$().ready(function(){
  
  $('#timeline_fixed').on('click', function(event){
    event.stopPropagation();
  	CCN.projet.showWholeTimeline();
  	changeTimelineMode('consignes');
  });
  
  $(window).on('resize', function(){ onResize(); });
  
  onResize();
    
  function slideshowActualites(actu) {
    var posY = actu.offset().top-$('#menu_bas .actualites-inner').offset().top;
    
    $('#menu_bas .actualites-inner').animate({scrollTop: (32*actu.index())},500);
    
    var _actu = actu;
    
    setTimeout(function(){
      if (_actu.index() < $('#menu_bas .actualites-inner .actualites-actu').length-1) {
        slideshowActualites($('#menu_bas .actualites-inner .actualites-actu').eq(_actu.index()+1));
      } else {
        slideshowActualites($('#menu_bas .actualites-inner .actualites-actu').eq(0));
      }
    },8000);
  }
  
  slideshowActualites($('#menu_bas .actualites-inner .actualites-actu').eq(0));
      
  $('#sidebarExpand').on('click', function(){
    toggleSidebarExpand();
  });
  
  $('#sidebarCache').on('click', function(){
    $('body').removeClass('hasSidebarExpanded');
  });
  
  $("#menu_bas ul a").not('#menu-classes-select ul a').tooltip({
    position: {
      my: "center bottom-4",
      at: "center top",
      using: function( position, feedback ) {
        $( this ).css( position );
        $( "<div>" )
          .addClass( "arrow" )
          .addClass( feedback.vertical )
          .addClass( feedback.horizontal )
          .appendTo( this );
      },
      collision: "fit",
    },
    show: {
      duration: 100,
      effect: 'fadeIn'
    },
    hide: {
      duration: 100,
      effect: 'fadeOut'
    }
    
    
  });

  // Click des logos-menus
  // Ouverture Timeline
  /*
  $( "ul.vue a.logo_menu-timeline" ).click(function() {
    $('#zone_classe').stop().fadeOut(1000);
    $('#zone').stop().fadeIn(1000);
    $('#menu-classe').stop().fadeOut(1000);
    $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeOut(0);
    $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeOut(0);
    $('#menu_bas a[data-filter-value=".ressource_classes"]').parent().stop().fadeIn(1000);
    $('#menu_bas a[data-filter-value=".ressource_agora"]').parent().stop().fadeIn(1000);
    
    vue = 'timeline';
  });

  // Ouverture Classes
  
  $( "ul.vue a.logo_menu-classe" ).click(function() {
    $('#zone_classe').stop().fadeIn(1000,function(){
      $('#classes').isotope({ layoutMode : 'masonry' });
    });
    $('#zone').stop().fadeOut(1000);
    $('#menu-classe').stop().fadeIn(1000);
    $('#menu_bas a[data-filter-value=".ressource_classes"]').parent().stop().fadeOut(0);
    $('#menu_bas a[data-filter-value=".ressource_agora"]').parent().stop().fadeOut(0);
    $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeIn(1000);
    $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeIn(1000);
    
    if (($('#menu_bas a[data-filter-value=".ressource_consignes"]').hasClass('selected')) 
     || ($('#menu_bas a[data-filter-value=".ressource_reponses"]').hasClass('selected'))) {
       // isotope ressources ferme tout
    }
    
    vue = 'classes';
  });
  */

  // Initialisation des logos-menus
  
  // $("#menu_bas li.logo a.selected").each(function (){ changeCouleurLogoMenu(this); });
  /*
  $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeOut(1000);
  $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeOut(1000);
  */
});

var antifloodHashChange = false;


function onHashChange() {
  if (antifloodHashChange == false) {
    setContentFromState(History.getState());
  }
}


/**
 * Initialise la vue depuis l'URL donnée
 * ou depuis l'état de l'historique donné
 */
 
var currentState = {};

function setContentFromState(state) {
  
  if (typeof state.data !== 'object' || state.data == null) return;
  var state = state.data;  
  
  if (state.type_objet == undefined)        { state.type_objet = ''; }
  if (state.page == undefined)              { state.page = ''; }
  if (state.id_rubrique == undefined)       { state.id_rubrique = ''; }
  if (state.id_article == undefined)        { state.id_article = ''; }
  if (state.id_syndic_article == undefined) { state.id_syndic_article = ''; }
  if (state.id_objet == undefined)          { state.id_objet = ''; }
  
  if (currentState.type_objet == undefined)        { currentState.type_objet = ''; }
  if (currentState.page == undefined)              { currentState.page = ''; }
  if (currentState.id_rubrique == undefined)       { currentState.id_rubrique = ''; }
  if (currentState.id_article == undefined)        { currentState.id_article = ''; }
  if (currentState.id_syndic_article == undefined) { currentState.id_syndic_article = ''; }
  if (currentState.id_objet == undefined)          { currentState.id_objet = ''; }
  
  isSamePage = true;
  
  for (var index in state) { 
    if (state[index] != currentState[index]) {
      isSamePage = false;
      break;
    } 
  }
  currentState = state;

  if (isSamePage) { return; }
  
  antifloodHashChange = true;
  
  // Ressource
  if ((state.type_objet == '0'
   && state.id_objet == '0')
   || (state.type_objet == ''
   && state.id_objet == '')) {
     CCN.projet.showWholeTimeline();
   }
  

  if (state.type_objet == "ressources"){
		changeTimelineMode('consignes');
		callRessource();
		
		if (state.page == 'rubrique') {
  		if (state.id_rubrique != CCN.idRubriqueRessources) {
  	    callRessourceRubrique(state.id_rubrique, 'ressources');
  	  }
		}
		
		if (state.page == 'article') {
  	  callRessourceArticle(state.id_article, 'ressources');
		}
		
		if (state.page == 'syndic_article') {
  	  callRessourceSyndicArticle(state.id_syndic_article, 'ressources');
		}
  }
  
  // Agora
  
  if (state.type_objet == "agora"){
		changeTimelineMode('consignes');
		callAgora();
		
		if (state.page == 'rubrique') {
  		if (state.id_rubrique != CCN.idRubriqueAgora) {
  	    callRessourceRubrique(state.id_rubrique, 'agora');
  	  }
		}
		
		if (state.page == 'article') {
  	  callRessourceArticle(state.id_article, 'agora');
		}
		
		if (state.page == 'syndic_article') {
  	  callRessourceSyndicArticle(state.id_syndic_article, 'agora');
		}
  }
  
  // Actualités
  
  if (state.page == "actualites"){
		callActualites();
  }
	
	
	if (state.id_objet != "0"){
  	
		// Consigne
		
		if (state.type_objet == "consignes"){
  		changeTimelineMode('consignes');
			for (k=0; k<CCN.consignes.length;k++){
				if (CCN.consignes[k].id == state.id_objet){
					callConsigne(state.id_objet);
				}
			}
    }

    // Réponse
    
    if (state.type_objet == "travail_en_cours"){
      // Si travail en cours est un livrable
      if($.urlParam('type') == 'livrables'){
        callLivrable(null, open);
        callLivrable(state.id_objet);
        changeTimelineMode('livrables');
      }
      else {
        changeTimelineMode('consignes');
        for (k=0; k<CCN.consignes.length;k++){
          for (l=0; l<CCN.consignes[k].reponses.length;l++){
            if (CCN.consignes[k].reponses[l].id == state.id_objet){
              callReponse(state.id_objet);
            }
          }
        }
      }
    }
		
		
    // Classe
    if (state.type_objet == "classes"){
      changeTimelineMode('consignes');
    	for (k=0; k<CCN.classes.length;k++){
  			if (CCN.classes[k].id == state.id_objet){
  				callClasse(state.id_objet);
    		}
    	}
    }
    
    
    // Article de blog
    
    if (state.type_objet == "blogs"){
		  changeTimelineMode('blogs');
    	callArticleBlog(state.id_objet,"article");
    }
    
    // Article d'événement
    
    if (state.type_objet == "evenements"){
		  changeTimelineMode('evenements');
    	callArticleEvenement(state.id_objet,"article");
    }
	}
	else { // state.id_objet == 0)
  	
    // Ressource
    if (state.type_objet == "ressources"){
      
    } else if (state.type_objet == 'travail_en_cours') {
      if (state.page == 'rubrique') {
        callClasses();
      }
    } else {
		  changeTimelineMode('consignes');
		}
	}
	
}



/**
 * Initialise les binds jQuery des sidebars
 */
  
function initLocalEvents(parent) {
}


/**
 * Gère la mise à jour des styles lorsque l'écran est resizé
 */

function onResize() {
  $('#crayons-surcharge-styles').text('.crayon-active.markItUpEditor { height: '+(parseInt($(window).height())-228)+'px !important; } .resizehandle { display:none !important; }');
}


/**
 * Affiche ou réduit l'affichage plein écran des sidebars.
 */

function toggleSidebarExpand() {
  if ($('body').hasClass('hasSidebarExpanded')) {
    $('body').removeClass('hasSidebarExpanded');
    
    if ($('body').hasClass('hadSidebarLateralVisible')) {
      $('body').removeClass('hadSidebarLateralVisible');
      showSidebarLateral();
    }
  } else {
    $('body').addClass('hasSidebarExpanded');
    
    if ($('body').hasClass('hasSidebarLateralVisible')) {
      $('body').addClass('hadSidebarLateralVisible');
    }
    hideSidebarLateral();
  }
}


/**
 * Définit la largeur de la zone.
 */

function getLargeurZone() {
  return $(window).width()*0.98;
}


/**
 * Définit la hauteur de la zone.
 */

function getHauteurZone() {
  return $(window).height()*0.873;
}


/**
 * Appelle le recalcul des connecteurs.
 *
 * @see updateConnecteurs
 */

function updateTimeline() {
  updateConnecteurs();
}


/**
 * Change le mode d'affichage de la timeline.
 *
 * @param {string} type - Peut être <tt>consignes</tt>, <tt>blogs</tt> ou <tt>evenements</tt>
 */
 
function changeTimelineMode(type) {  
  var classCss = {};
      classCss.consignes = 'show_consignes';
      classCss.blogs = 'show_blogs';
      classCss.evenements = 'show_evenements';
      classCss.livrables = 'show_livrables';  

  if (!$('body').hasClass(classCss[type])) {
    CCN.projet.showWholeTimeline();
    
    for (var index in classCss) {
      $('body').removeClass(classCss[index]);
    }
    
    $('body').addClass(classCss[type]);
    
    updateMenuIcon([type], 'timelineMode');
  }
  
  $('#menu_bas .logo a.menu_logo_type_sidebarView').removeClass('selected');
  
} 


/**
 * Gère les événements lors du click sur une consigne et appelle {@link consigne#showInTimeline}.
 *
 * @param {number} numero - ID SPIP de l'objet
 *
 * @example
 * // Avec l'ID SPIP #146 de la consigne
 * showConsigneInTimeline(146, true);
 *
 * @see callConsigne
 * @see consigne#showInTimeline
 */
 
function showConsigneInTimeline(numero) {
  for (var index_consigne in CCN.consignes) {
    if (CCN.consignes[index_consigne].id == numero) {
    //  CCN.projet.showWholeTimeline();
      CCN.consignes[index_consigne].showInTimeline();
    }
  }
  
  // TODO : icones
}


/**
 * Gère les événements lors du click sur une réponse et appelle {@link reponse#showInTimeline}.
 *
 * @param {number} numero - ID SPIP de l'objet
 *
 * @example
 * // Avec l'ID SPIP #146 de la consigne
 * showReponseInTimeline(146);
 *
 * @see callConsigne
 * @see consigne#ouvre
 */
 
function showReponseInTimeline(numero) {
  for (var index_consigne in CCN.consignes) {
    for (var index_reponse in CCN.consignes[index_consigne].reponses) {
      if (CCN.consignes[index_consigne].reponses[index_reponse].id == numero) {
        CCN.consignes[index_consigne].reponses[index_reponse].showInTimeline();
      }
    }
  }
}


/**
 * Redirige vers la fonction la plus appropriée
 * pour charger l'élément
 *
 * @param {Object} opts - Données identifiant l'élément
 * @param {string} opts.type - Le type de la page à charger (<tt>rubrique</tt>, <tt>article</tt>…)
 * @param {string} opts.mode - La modalité d'affichage de la page (<tt>ajax</tt>, <tt>ajax-detail</tt>, <tt>detail</tt>)
 * @param {string} [opts.id_rubrique] - L'id de la rubrique si c'est une <tt>rubrique</tt>
 * @param {string} [opts.id_article] - L'id de l'article si c'est un <tt>article</tt>
 * @param {string} [opts.id_consigne] - L'id de la consigne si c'est une réponse de classe
 *
 * @see callConsigne
 * @see callReponse
 * @see callClasse
 *
 * @todo Compléter au maximum la fonction
 */

function call(opts) {
  console.log(opts);
  
  if (opts.type == 'rubrique') {  
    if (opts.type_objet == 'travail_en_cours') {
      toggleSidebarExpand();
      // Classe
      callClasse(opts.id_rubrique);
    }  
  }
  
  if (opts.type == 'article') {  
    if (opts.type_objet == 'travail_en_cours' && opts.type_entite != null && opts.type_entite == 'reponse') {
      // Réponse d'une classe
      callReponse(opts.id_article);
    }  
  }
  
}

/**
 * Appelle le chargement de la consigne 
 * dans la sidebar principale et appelle 
 * l'affichage de la consigne dans la timeline.
 *
 * @param {number} id_consigne - ID de la consigne
 *
 * @see loadContentInMainSidebar
 * @see showConsigneInTimeline
 *
 * @todo Définir le contenu de la sidebar secondaire
 */

function callConsigne(id_consigne){
  
  changeTimelineMode('consignes');
  
	var url = CCN.projet.url_popup_consigne+"&id_article="+id_consigne;
	showConsigneInTimeline(id_consigne);
	setFullscreenModeToCols(false);
	updateMenuIcon(['consignes-'+id_consigne], 'mainView');
	
  	loadContentInMainSidebar(url, 'article', 'consignes', function(){
    	updateUrl({
        'type_objet':'consignes',
        'id_objet':id_consigne,
        'id_rubrique':id_consigne,
        'page':'article'	
      },'Consigne',"./spip.php?page=article&id_article="+id_consigne+"&mode=complet");
    });
  
	
	/*
	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
	*/
	
	console.log('callConsigne');
}


/**
 * Appelle le chargement de la réponse 
 * dans la sidebar principale et appelle 
 * le chargement de la réponse dans la sidebar secondaire.
 *
 * @param {number} id_reponse - ID de la réponse
 * @param {number} id_consigne - ID de la consigne parente
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 * @see showConsigneInTimeline
 */
 
function callReponse(id_reponse){
  changeTimelineMode('consignes');
	setFullscreenModeToCols(true);
  
  var id_consigne = getIdConsigneFromIdReponse(id_reponse);
	var id_classe = getIdClasseFromIdReponse(id_reponse);
	
	updateMenuIcon(['consignes-'+id_consigne, 'classes-'+id_classe], 'mainView');
  
	var url = CCN.projet.url_popup_reponse+"&id_article="+id_reponse;
  showConsigneInTimeline(id_consigne);
	
	loadContentInMainSidebar(url, 'article', 'travail_en_cours', function(){
  	updateUrl({
        'type_objet':'travail_en_cours',
        'id_objet':id_reponse,
        'id_article':id_reponse,
        'page':'article'	
      }, "Réponse", "./spip.php?page=article&id_article="+id_reponse+"&mode=complet");
  });
  

	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');

	showReponseInTimeline(id_reponse);
}


/**
 * Appelle le chargement de la classe 
 * dans la sidebar principale et appelle 
 * le chargement de la classe dans la sidebar secondaire.
 *
 * @param {number} id_classe - ID de la classe
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 *
 * @todo *1 : Modifier le contenu de la sidebar secondaire
 */
 
function callClasse(id_classe){
  changeTimelineMode('consignes');
  toggleSidebarExpand();
	setFullscreenModeToCols(true);
	updateMenuIcon(['classes','classes-'+id_classe],'sidebarView');
  
	var url = CCN.projet.url_popup_classes;
	if (id_classe!='') url = CCN.projet.url_popup_classes+'&id_rubrique='+id_classe+'&type_objet=travail_en_cours';
  loadContentInMainSidebar(url, 'rubrique', 'classes', function(){
  	updateUrl({
        'type_objet':'classes',
        'id_objet':id_classe,
        'id_rubrique':id_classe,
        'page':'rubrique'	
      }, "Classe", "./spip.php?page=rubrique&id_objet="+id_classe+"&mode=complet&type_objet=classes");
  });

	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
}


/**
 * Appelle le chargement des classes 
 * dans la sidebar principale
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 */
 
function callClasses(){
  changeTimelineMode('consignes');
  toggleSidebarExpand();
	setFullscreenModeToCols(true);
	updateMenuIcon(['classes'], 'sidebarView');

  blankMainSidebar('<div class="sidebar_bubble"><div class="fiche_titre couleur_texte_ressources couleur_ressources0"><div class="texte"><div class="titre">Travail en cours</div></div></div></div><div class="sidebar_bubble sidebar_bubble_blank">Naviguez dans l\'espace travail en cours grâce à la barre latérale sur votre droite.</div>');

  var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
  loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
}


/**
 * Appelle le chargement de l'article de blog
 * dans la sidebar principale et appelle
 * (…)
 *
 * @param {number} id_objet
 * @param {string} type_objet
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 *
 * @todo Modifier le contenu de la sidebar secondaire
 * @todo Documenter
 */

function callArticleBlog(id_article){
  changeTimelineMode('blogs');
	setFullscreenModeToCols(false);
	updateMenuIcon(['blogs'],'mainView');
	
	var url = CCN.projet.url_popup_blog+"&page=article&id_article="+id_article;
	loadContentInMainSidebar(url, 'article', 'blogs', function(){
  	updateUrl({
        'type_objet':'blogs',
        'id_objet':id_article,
        'id_article':id_article,
        'page':'article'	
      }, "Blog", "./spip.php?page=article&id_article="+id_article+"&mode=complet");
  });
  
	/*
	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
	showReponseInTimeline(id_reponse);
	*/
}


/**
 * Appelle le chargement de la ressource
 * dans la sidebar principale et appelle
 * (…)
 *
 * @param {number} id_objet
 * @param {string} type_objet
 *
 * @see loadContentInLateralSidebar
 *
 * @todo Modifier le contenu de la sidebar secondaire
 * @todo Documenter
 */

function callRessource(){
  changeTimelineMode('consignes');
  toggleSidebarExpand();
	updateMenuIcon(['ressources'], 'sidebarView');
	
blankMainSidebar('<div class="sidebar_bubble"><div class="fiche_titre couleur_texte_ressources couleur_ressources0"><div class="texte"><div class="titre">Espace ressources</div></div></div></div><div class="sidebar_bubble sidebar_bubble_blank">Naviguez dans l\'espace ressources grâce à la barre latérale sur votre droite.</div>');
	setFullscreenModeToCols(true);
	
  var url_lateral = CCN.projet.url_popup_ressources;
  loadContentInLateralSidebar(url_lateral, 'rubrique', 'ressources', function(){
  });

	console.log('callRessource');
}


/**
 * Appelle le chargement d'un article ressource
 * dans la sidebar secondaire
 *
 * @param {number} id_article
 *
 * @see loadContentInMainSidebar
 *
 * @todo Documenter
 */

function callRessourceArticle(id_article, type_objet){
  changeTimelineMode('consignes');
	setFullscreenModeToCols(true);
	updateMenuIcon([type_objet],'sidebarView');
	
	var url = "./spip.php?page=article&id_article="+id_article+"&mode=ajax-detail";
	loadContentInMainSidebar(url, 'article', type_objet, function(){
  	updateUrl({
        'type_objet':type_objet,
        'id_article':id_article,
        'page':'article'	
      }, "Ressources", "./spip.php?page=article&id_article="+id_article+"&type_objet="+type_objet+"&mode=complet");
	});
	
	var url_lateral = (type_objet == 'ressources') ? CCN.projet.url_popup_ressources : CCN.projet.url_popup_agora;
	/*loadContentInLateralSidebar(url_lateral, 'rubrique', type_objet, function(){
  });*/
	
	console.log('callRessourceArticle');
}


/**
 * Appelle le chargement d'un article syndic
 * dans la sidebar secondaire
 *
 * @param {number} id_syndic_article
 *
 * @see loadContentInMainSidebar
 *
 * @todo Documenter
 */

function callRessourceSyndicArticle(id_syndic_article, type_objet){
  changeTimelineMode('consignes');
	setFullscreenModeToCols(true);
	updateMenuIcon([type_objet],'sidebarView');
	
	var url = "./spip.php?page=syndic_article&id_syndic_article="+id_syndic_article+"&mode=ajax-detail";
	loadContentInMainSidebar(url, 'syndic_article', type_objet, function(){
  	updateUrl({
        'type_objet':type_objet,
        'id_syndic_article':id_syndic_article,
        'page':'article'	
      }, "Ressources", "./spip.php?page=syndic_article&id_syndic_article="+id_syndic_article+"&type_objet="+type_objet+"&mode=complet");
  });
	
	
	var url_lateral = (type_objet == 'ressources') ? CCN.projet.url_popup_ressources : CCN.projet.url_popup_agora;
	loadContentInLateralSidebar(url_lateral, 'rubrique', type_objet, function(){
  });
	
	console.log('callRessourceSyndicArticle');
}



/**
 * Appelle le chargement d'une rubrique ressource
 * dans la sidebar secondaire
 *
 * @param {number} id_rubrique
 *
 * @see loadContentInMainSidebar
 *
 * @todo Documenter
 */

function callRessourceRubrique(id_rubrique, type_objet){
  changeTimelineMode('consignes');
	setFullscreenModeToCols(true);
	updateMenuIcon([type_objet],'sidebarView');
  
	var url = "./spip.php?page=rubrique&id_rubrique="+id_rubrique+"&mode=ajax-detail";
	loadContentInMainSidebar(url, 'rubrique', type_objet, function(){
  	updateUrl({
        'type_objet':type_objet,
        'id_rubrique':id_rubrique,
        'page':'rubrique'	
      }, "Ressources", "./spip.php?page=rubrique&id_rubrique="+id_rubrique+"&type_objet="+type_objet+"&mode=complet");
  });
	
	
  var url_lateral = (type_objet == 'ressources') ? CCN.projet.url_popup_ressources : CCN.projet.url_popup_agora;
  //loadContentInLateralSidebar(url_lateral, 'rubrique', type_objet, function(){


	console.log('callRessourceRubrique');
}


/**
 * Appelle le chargement de l'événement
 * dans la sidebar principale et appelle
 * (…)
 *
 * @param {number} id_objet
 * @param {string} type_objet
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 *
 * @todo Modifier le contenu de la sidebar secondaire
 * @todo Documenter
 */

function callArticleEvenement(id_objet, type_objet){
  changeTimelineMode('evenements');
	setFullscreenModeToCols(false);
	updateMenuIcon(['evenements'],'mainView');
	
	var url = CCN.projet.url_popup_evenement+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	loadContentInMainSidebar(url, 'article', 'evenements', function(){
  	updateUrl({
        'type_objet':'evenements',
        'id_article':id_objet,
        'page':type_objet	
      }, "Événement", "./spip.php?page="+type_objet+"&id_article="+id_objet+"&mode=complet");
  });
	
	console.log('callArticleEvenement');
}


/**
 * Appelle le chargement de l'agora
 * dans la sidebar principale et appelle
 * (…)
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 *
 * @todo Modifier le contenu de la sidebar principale
 * @todo Modifier le contenu de la sidebar secondaire
 * @todo Documenter
 */

function callAgora(){
  changeTimelineMode('consignes');
  toggleSidebarExpand();
	updateMenuIcon(['agora'],'sidebarView');
	
	blankMainSidebar('<div class="sidebar_bubble"><div class="fiche_titre couleur_texte_ressources couleur_ressources0"><div class="texte"><div class="titre">Espace de discussion</div></div></div></div><div class="sidebar_bubble sidebar_bubble_blank">Naviguez dans l\'espace de discussion grâce à la barre latérale sur votre droite.</div>');
	setFullscreenModeToCols(true);
	
	/*var url = CCN.projet.url_popup_agora;
	loadContentInMainSidebar(url, 'rubrique', 'agora', function(){
  	updateUrl({
        'type_objet':'agora',
        'id_rubrique':CCN.idRubriqueAgora,
        'page':'rubrique'	
      }, "Agora", "./spip.php?page=rubrique&id_rubrique="+CCN.idRubriqueAgora+"&type_objet=agora&mode=complet");
	});*/
	
	var url_lateral = CCN.projet.url_popup_agora;
	loadContentInLateralSidebar(url_lateral, 'rubrique', 'agora', function(){
  });
	
	console.log('callAgora');
}


/**
 * Appelle le chargement de l'agora
 * dans la sidebar principale et appelle
 * (…)
 *
 * @see loadContentInMainSidebar
 * @see loadContentInLateralSidebar
 *
 * @todo Modifier le contenu de la sidebar principale
 * @todo Modifier le contenu de la sidebar secondaire
 * @todo Documenter
 */

function callActualites(){
  changeTimelineMode('consignes');
	updateMenuIcon(['actualites'],'sidebarView');
	setFullscreenModeToCols(false);
	
	var url = './spip.php?page=actualites&type_objet=actualites&mode=ajax-detail';
	loadContentInMainSidebar(url, 'rubrique', 'actualites', function(){
  	updateUrl({
        'type_objet':'actualites',
        'page':'actualites'	
      }, "Actualites", "./spip.php?page=actualites&mode=complet");
	});
	
	console.log('callActualites');
}

/**
 * Gère les événements lors du clic sur un livrable
 * 
 * @param {number} id_livrable
 * @param {string} state
 * 
 * @example
 * callLivrable(254, null)
 * callLivrable(null, open)
 */

function callLivrable(id_livrable = null, state = null){

  // Ouvre la page livrables
  if(state == 'open'){
    $('.zone-livrables').stop().fadeIn(1000);
    changeTimelineMode('livrables');
  }

  // Ouvre le detail d'un livrable
  else if(state == 'openDetails'){
      dataId = id_livrable;
      $(".livrable").css({'opacity': '0.4'});
      $('#livrable'+dataId).stop().fadeIn(500);
      $('#livrable'+dataId).addClass('active');
      detailsLivrableOpen = true;
    }

  // Ferme le detail d'un livrable  
  else if(state == 'closeDetails'){
      $('.livrable-details-wrapper').fadeOut(500);
      $('.livrable-details-wrapper').removeClass('active');
      $(".livrable").css({'opacity': '1'});
      detailsLivrableOpen = false;
      event.stopPropagation();
    }

  // Ferme la page livrable  
  else if(state == 'close'){
    if(detailsLivrableOpen == false){
      $('.zone-livrables').stop().fadeOut(1000);
      $('.logo_menu-consignes').click();
      changeTimelineMode('consignes');
    }
    }

  // Ouvre le detail d'un livrable en fonction de l'url  
  else {
      changeTimelineMode('livrables');
      $('.zone-livrables').stop().fadeIn(1000);
      dataId = id_livrable;
      $(".livrable").css({'opacity': '0.4'});
      $('#livrable'+dataId).stop().fadeIn(500);
      $('#livrable'+dataId).addClass('active');
      detailsLivrableOpen = true;
    }
  
  // Genere le lien d'un detail livrable  
  if(id_livrable){
    var url = CCN.projet.url_popup_consigne+"&id_article="+id_livrable;
    //updateMenuIcon(['livrable-'+id_livrable], 'mainView');
        updateUrl({
          'type_objet':'livrables',
          'id_objet':id_livrable,
          'id_rubrique':id_livrable,
          'page':'article'	
        },'Consigne',"./spip.php?page=article&id_article="+id_livrable+"&mode=complet&type=livrables");
      
    console.log('callLivrable');
  }

}



/**
 * @param {number} id_consigne
 * @param {number} id_rubrique_classe
 * @param {number} numero
 *
 * @todo Documenter
 */

function createReponse(id_consigne, id_rubrique_classe, numero){
  
  changeTimelineMode('consignes');
	
	var url = CCN.projet.url_popup_reponseajout +"&id_consigne="+id_consigne+"&id_rubrique="+id_rubrique_classe; // TODO Check infinite loading icon
	loadContentInMainSidebar(url, 'article', 'blogs');
	
	console.log('createReponse');
}


/**
 * Cherche l'ID de la consigne parente à une réponse de classe
 * grâce à l'ID de la réponse
 *
 * @param {number} id_reponse - ID de la réponse
 * @returns {number} Id de la consigne
 *
 * @see callReponse
 */
 
function getIdConsigneFromIdReponse(id_reponse) {
  for (var index_consigne in CCN.consignes) {
    for (var index_reponse in CCN.consignes[index_consigne].reponses) {
      if (CCN.consignes[index_consigne].reponses[index_reponse].id == id_reponse) {
        return CCN.consignes[index_consigne].id;
      }
    }
  }
  return null;
}



/**
 * Cherche l'ID de la classe parente à une réponse de classe
 * grâce à l'ID de la réponse
 *
 * @param {number} id_reponse - ID de la réponse
 * @returns {number} Id de la classe
 *
 * @see callReponse
 */
 
function getIdClasseFromIdReponse(id_reponse) {
  for (var index_consigne in CCN.consignes) {
    for (var index_reponse in CCN.consignes[index_consigne].reponses) {
      if (CCN.consignes[index_consigne].reponses[index_reponse].id == id_reponse) {
        return CCN.consignes[index_consigne].reponses[index_reponse].classe_id;
      }
    }
  }
  return null;
}

/**
 * Met à jour les connecteurs de la timeline.
 * <br>
 * La fonction est appelée de manière récursive (<tt>setInterval(…, 1)</tt>)
 * afin de mettre à jour en même temps que la transition CSS de la timeline.
 *
 * @todo Éléments autres que DOM ?
 */
 
function updateConnecteurs() {
  $('.connecteur_timeline').each(function(){
    
    var connecteur_consigne = $('#consigne_haute'+$(this).data('consigne-id'));
    var connecteur_reponse = $('#reponse_haute'+$(this).data('reponse-id'));
    
    var connecteur = $(this);
    
    var x1 = connecteur_consigne.offset().left+connecteur_consigne.outerWidth()-5;
    var y1 = connecteur_consigne.offset().top+CCN.projet.timeline.offset().top+5;
    var x2 = connecteur_reponse.offset().left+5;
    var y2 = connecteur_reponse.offset().top+CCN.projet.timeline.offset().top+5;
    
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


/**
 * Change la couleur du bouton une fois cliqué.
 *
 * @param {string} val - Sélecteur de l'élément DOM en jQuery
 * @todo Améliorer la récupération de la couleur ?
 */

function changeCouleurLogoMenu(val){
  var color = $(val).css('background-color');
  $(val).parent().parent().parent().children("h3").css('background-color',color);
}


/**
 * Met à jour l'URL
 */

function updateUrl(object, title, url) {
  currentState = object;
  
  if (CCN.hash != '') {
    if(CCN.hash.substring(0,5) == 'forum'){}
    else {
      History.pushState(object, title, url+'#'+CCN.hash);
    }
    
    setTimeout(function(){
    
      var anchor = $("#"+ CCN.hash);
      
      if (anchor.length > 0) {
      
        // TODO : cela est appelé deux fois minimum à cause de History.js (donc un trigger('click') sur .triggertoggleshow ne fonctionne pas car il ouvre puis ferme)
        
        // Forum : ouvre les items
        anchor.find('.toggleshow').show();
        anchor.closest('.intervention_item_around').find('.toggleshow').show();
        
        $('#sidebar_content, #sidebar_main_inner, #sidebar_lateral_inner').animate({scrollTop: anchor.offset().top-60},'slow');
      }
      
      CCN.hash = '';
    },500);
  } else { 
    History.pushState(object, title, url);
  }
  antiPushState = false;
}

/*
  function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

scrollToAnchor('id3');
*/

/**
 * @deprecated
 */

function popup(url,mode){
  console.log('%c Popup (insertion jQuery désactivée, préférer `{type_objet}_click`)'+' %c '+url+' ', 
              'background:tomato;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
}


/**
 * Met à jour le cookie et recharge la page.
 *
 * @param {string} url - URL de la page de destination
 * @param {string} cookie_nom - Nom du cookie
 * @param {string} cookie_valeur - Valeur du cookie
 */

function reloadAndSetCookie(url,cookie_nom,cookie_valeur) {
  document.cookie = cookie_nom + "=" + escape(cookie_valeur);
  reload(url);
}


/**
 * Gère le rechargement de la page.
 *
 * @param {string} url - URL de la page à charger avec AJAX ou <tt>self</tt> pour recharger la même page
 *
 * @see reloadAndSetCookie
 */

function reload(url) {
  if (url == 'self')  {
    location.reload( true );
    window.location.reload();
  }
  else window.location.href = url;
}

/**
 * Charge l'URL dans la sidebar principale.
 *
 * @param {string} url - URL de la page à charger avec AJAX
 * @param {string} typePage - Type du contenu SPIP : <tt>article</tt>, <tt>rubrique</tt>…
 * @param {string} typeObjet - Type de l'objet principal de la page : <tt>consignes</tt>, <tt>travail_en_cours</tt>, <tt>blogs</tt>, <tt>evenements</tt>, <tt>ressources</tt>, <tt>classes</tt>…
 *
 * @see loadContentInLateralSidebar
 *
 * @todo Loading et son callback
 */

function loadContentInMainSidebar(url, typePage, typeObjet, callback) {
  
  $('body').addClass('loading');
  showSidebar();
  hideSidebarLateral();
  emptyMainSidebar();
  
  console.log('%c Main'+' %c '+url+' ', 
              'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  $('#sidebar_main_inner').load(url, function(response) {
    $('body').removeClass('loading');
    $('#sidebar_content').scrollTop(0);
    initLocalEvents($('#sidebar_main_inner'));
    
    if (callback) callback(response);

    console.log('%c Main'+' %c Loaded ', 
                'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
                'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
    
    antifloodHashChange = false;
  });
}


/**
 * Charge l'URL dans la sidebar secondaire.
 *
 * @param {string} url - URL de la page à charger avec AJAX
 * @param {string} typePage - Type du contenu SPIP : <tt>article</tt>, <tt>rubrique</tt>…
 * @param {string} typeObjet - Type de l'objet principal de la page : <tt>consignes</tt>, <tt>travail_en_cours</tt>, <tt>blogs</tt>, <tt>evenements</tt>, <tt>ressources</tt>, <tt>classes</tt>…
 *
 * @see loadContentInMainSidebar
 *
 * @todo Loading et son callback
 */

function loadContentInLateralSidebar(url, typePage, typeObjet, callback) {
  console.log('%c Lateral'+' %c '+url+' ', 
              'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  $('body').addClass('loading');
  showSidebar();
  //emptyLateralSidebar();
  
  $('#sidebar_lateral_inner').load(url, function(response, status, xhr){
    $('body').removeClass('loading');
    $('#sidebar_content').scrollTop(0);
    initLocalEvents($('#sidebar_lateral_inner'));
      
    if (callback) callback(response);
      
    antifloodHashChange = false;
    console.log('%c Lateral'+' %c Loaded ', 
                'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 
                'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
                
  });
}


/**
 * Update le menu
 */

function updateMenuIcon(ids, mode) {
  if (mode == 'timelineMode') {
    $('#menu_bas .logo a').removeClass('selected');
    for (var i in ids) {
      $('.menu_logo_'+ids[i]).addClass('selected');
    }
  }
  
  // mainView :
  // on clean tous les items
  // et on active les ids
  
  if (mode == 'mainView') {
    $('#menu_bas .logo a').removeClass('selected');
    for (var i in ids) {
      $('.menu_logo_'+ids[i]).addClass('selected');
    }
  }
  
  
  // sidebarView :
  // on clean uniquement les items sidebarView
  // et on active les ids
  
  if (mode == 'sidebarView') {
    $('#menu_bas .logo a.menu_logo_type_sidebarView').removeClass('selected');
    for (var i in ids) {
      $('.menu_logo_'+ids[i]).addClass('selected');
    }
  }
  /*
  $('#menu_bas .logo a').removeClass('selected');
  $('.menu_logo_'+id).addClass('selected');
  */
}


/**
 * Vide la sidebar principale.
 *
 * @see loadContentInMainSidebar
 */

function emptyMainSidebar() {
//   $('#sidebar_main_inner').empty();
  $('#sidebar_main_inner').html('<div class="popup"><div class="sidebar_bubble sidebar_bubble_empty"></div></div>');
}


/**
 * Vide la sidebar latérale.
 *
 * @see loadContentInLateralSidebar
 */

function emptyLateralSidebar() {
//   $('#sidebar_lateral_inner').empty();
  $('#sidebar_lateral_inner').html('<div class="popup"><div class="sidebar_bubble sidebar_bubble_empty"></div></div>');
}


/**
 * Définit l'affichage plein écran de/des sidebars
 */

function setFullscreenModeToCols(setCols) {
  if (setCols == true) {
    $('body').addClass('modeCols').removeClass('modeFullscreen');
  } else {
    $('body').removeClass('modeCols').addClass('modeFullscreen');
  }
}


/**
 * Ajoute un bloc blanc vide dans la sidebar principale.
 *
 * @see loadContentInMainSidebar
 */

function blankMainSidebar(msg) {
  var message = (msg) ? msg : '';
  $('#sidebar_main_inner').html('<div class="popup popup_blank">'+msg+'</div>');
}


/**
 * Affiche la sidebar secondaire.
 *
 * @see loadContentInLateralSidebar
 */

function showSidebarLateral() {
  $('body').addClass('hasSidebarLateralVisible');
}


/**
 * Masque la sidebar secondaire.
 *
 * @see loadContentInLateralSidebar
 */
 
function hideSidebarLateral() {
  $('body').removeClass('hasSidebarLateralVisible');
}


/**
 * Affiche la sidebar principale.
 *
 * @see loadContentInMainSidebar
 */

function showSidebar() {
  $('body').addClass('hasSidebarOpen');
  $('#sidebar').addClass('show');
  updateTimeline();
}
