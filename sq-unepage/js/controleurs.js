var vue = 'timeline';



$().ready(function(){
  $('#timeline_fixed').on('click', function(){
  	CCN.projet.showWholeTimeline();
  })
      
      
  $('#sidebarExpand').on('click', function(){
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
    }
    ,
    hide: {
      duration: 100,
      effect: 'fadeOut'
    }          
  });

  // Click des logos-menus
  // Ouverture Timeline
  
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

  // Initialisation des logos-menus
  
  $("#menu_bas li.logo a.selected").each(function (){ changeCouleurLogoMenu(this); });
  $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeOut(1000);
  $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeOut(1000);
});



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
      classCss.consignes = 'showConsignes';
      classCss.blogs = 'showBlogs';
      classCss.evenements = 'showEvenements';  
  
  
  if (!$('body').hasClass(classCss[type])) {
    for (var index in classCss) {
      $('body').removeClass(classCss[index]);
    }
    
    $('body').addClass(classCss[type]);
    CCN.projet.showWholeTimeline();
  }
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
}


/**
 * Gère les événements lors du click sur une réponse et appelle {@link reponse#showInTimeline}.
 *
 * @param {number} numero - ID SPIP de l'objet
 *
 * @example
 * // Avec l'ID SPIP #146 de la consigne
 * showConsigneInTimeline(146);
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
	loadContentInMainSidebar(url, 'article', 'consignes');
	showConsigneInTimeline(id_consigne);
	
	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
	
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
  
  var id_consigne = getIdConsigneFromIdReponse(id_reponse);
  
	var url = CCN.projet.url_popup_reponse+"&id_consigne="+id_consigne+"&id_article="+id_reponse;
	loadContentInMainSidebar(url, 'article', 'travail_en_cours');
  showConsigneInTimeline(id_consigne);
	
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
  
	var url = CCN.projet.url_popup_classes;
	if (id_classe!='') url = CCN.projet.url_popup_classes+'&id_rubrique='+id_classe+'&type_objet=travail_en_cours';
  loadContentInMainSidebar(url, 'rubrique', 'classes');

	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
  
	$('#menug li a.selected').removeClass('selected');
	$('#ajax_rub_#ID_RUBRIQUE_OUVRE').addClass('selected');
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
	
	var url = CCN.projet.url_popup_blog+"&page=article&id_article="+id_article;
	loadContentInMainSidebar(url, 'article', 'blogs');
	/*
	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
	showReponseInTimeline(id_reponse);
	*/
}

/* * * * * * Below : to convert into loadXXXInSidebar * * * * * */


/**
 * Appelle le chargement de la ressource
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

function callRessource(id_objet,type_objet){
	var url = CCN.projet.url_popup_ressources+"&id_"+type_objet+"="+id_objet;
	popup(url,'ressource');
	console.log('callRessource');
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

function callArticleEvenement(id_objet,type_objet){
  changeTimelineMode('evenements');
  
	var url = CCN.projet.url_popup_evenement+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url,'evenement');
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
	if ($('#zone_classe').is(':hidden'))	{
		
		var url = CCN.projet.url_popup_agora;
		popup(url,'agora');
		console.log('callAgora');
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
	var url = CCN.projet.url_popup_reponseajout +"&id_consigne="+id_consigne+"&id_rubrique="+id_rubrique_classe;
	popup(url,'edition');
	if (numero!=undefined) CCN.consignes[numero].div_reponse_plus.css('visibility','hidden'); // TO DO ?
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

function loadContentInMainSidebar(url, typePage, typeObjet) {
  console.log('%c Main'+' %c '+url+' ', 
              'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  $('#sidebar_main_inner').load(url, function() {
    showSidebar();
    hideSidebarLateral();
    $('#sidebar_content').scrollTop(0);
      
    console.log('%c Main'+' %c Loaded ', 
                'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
                'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
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

function loadContentInLateralSidebar(url, typePage, typeObjet) {
  console.log('%c Lateral'+' %c '+url+' ', 
              'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  $('#sidebar_lateral_inner').load(url, function(response, status, xhr){
    $('#sidebar_content').scrollTop(0);
    showSidebar();
      
    console.log('%c Lateral'+' %c Loaded ', 
                'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 
                'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  });
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
