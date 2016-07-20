var vue = 'timeline';


/**
 * Change la couleur du bouton une fois cliqué.
 *
 * @param {string} val - Sélecteur de l'élément DOM en jQuery
 */

function logo_menu_change_couleur(val){
  var color = $(val).css('background-color');
  $(val).parent().parent().parent().children("h3").css('background-color',color);
}

////////////////////////////////////////////////////////////////
// 
//   Listeneurs Affichage

$().ready(function(){
  $('#timeline_fixed').on('click', function(){
  	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
  })
      
      
  $('#sidebarExpand').on('click', function(){
    $('body').toggleClass('hasSidebarExpanded');
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
      isotope_ressources_ferme_tout();
    }
    
    stop_action ();
    vue = 'classes';
  });

  // Fermeture du canvas
  
  $("#canvas_projet").click(function(){
    //alert ('ok');
    //g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
  });

  // Initialisation des logos-menus
  
  $("#menu_bas li.logo a.selected").each(function (){ logo_menu_change_couleur(this); });
  $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeOut(1000);
  $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeOut(1000);
});

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

function reload_cookie(url,cookie_nom,cookie_valeur) {
  document.cookie = cookie_nom + "=" + escape(cookie_valeur);
  reload(url);
}


/**
 * Gère le rechargement de la page
 *
 * @param {string} url - URL de la page à charger avec AJAX ou <tt>self</tt> pour recharger la même page
 *
 * @see reload_cookie
 */

function reload(url) {
  if (url == 'self')  {
    location.reload( true );
    window.location.reload();
  }
  else window.location.href = url;
}


/**
 *
 * @deprecated 
 */

function isotope_ressources_ferme_tout(){
  //showhide_travaux('show');
  //var bouton = $(".filter a[onclick*='showhide_travaux'][class*='tout']");
  //isotope_filtre(bouton);
  //$('#menu_haut ul li a').removeClass('selected');
}


/**
 *
 * @deprecated 
 */

function isotope_classes_ferme_tout(){
/*
  var bouton = $("#menu-classes a.logo_menu-tout");
  isotope_filtre(bouton);
  
*///$('#menu-classes ul li a').removeClass('selected');
}


/**
 *
 * @deprecated 
 */

function isotope_consignes_ferme_tout(){
  //g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
/*
  var bouton = $(".filter a[onclick*='g_projet.changevoittout']");
  isotope_filtre(bouton);
*/
}
