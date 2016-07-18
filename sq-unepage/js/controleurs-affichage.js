////////////////////////////////////////////////////////////////
// 
//   Déclaration des globales


var vue = 'timeline';

////////////////////////////////////////////////////////////////
// 
//   Controleurs affichage

function logo_menu_change_couleur(val){
  var color = $(val).css('background-color');
  //alert (color);
  $(val).parent().parent().parent().children("h3").css('background-color',color);
}

function isotope_ressources_ferme_tout(){
  //showhide_travaux('show');
  //var bouton = $(".filter a[onclick*='showhide_travaux'][class*='tout']");
  //isotope_filtre(bouton);
  //$('#menu_haut ul li a').removeClass('selected');
}

function isotope_classes_ferme_tout(){
/*
  var bouton = $("#menu-classes a.logo_menu-tout");
  isotope_filtre(bouton);
  
*///$('#menu-classes ul li a').removeClass('selected');
}

function isotope_consignes_ferme_tout(){
  //g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
/*
  var bouton = $(".filter a[onclick*='g_projet.changevoittout']");
  isotope_filtre(bouton);
*/
}

////////////////////////////////////////////////////////////////
// 
//   Listeneurs Affichage

$().ready(function(){
  /*
  $('#menu_haut_titre, #menu_haut_titre_more').on('mouseover',function(){
    $('#menu_haut_titre_more').removeClass('hide');
  }).on('mouseout',function(){
    $('#menu_haut_titre_more').addClass('hide');
  });
*/
    //Select
      /*$(".custom-select").each(function(){
        $(this).wrap("<span class='select-wrapper'></span>");
        $(this).after("<span class='holder'></span>");
        var selectedOption = $(this).find(":selected").text();
        $(this).next(".holder").text(selectedOption);
  })*/
  
  $('#timeline_fixed').on('click', function(){
  	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
  })
      
      
  $('#sidebarExpand').on('click', function(){
    $('body').toggleClass('hasSidebarExpanded');
  });
  
  $('#sidebarCache').on('click', function(){
    $('body').removeClass('hasSidebarExpanded');
  });

  // Tooltip 
  /*
  $('.menu-bas-select .call-to-select').on('mouseover', function(){
    $(this).parents().find('.liste-select').slideDown(300);
  });
  
  $('.menu-bas-select .liste-select').on('mouseleave', function(){
    $(this).slideUp(300);
  });
  */
  
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
    //if (($('#menu_bas a[data-filter-value=".ressource_classes"]').hasClass('selected'))||($('#menu_bas a[data-filter-value=".ressource_agora"]').hasClass('selected'))) $().colorbox.close;
    //g_action = true;
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

////////////////////////////////////////////////////////////////
// 
//   Colorbox

function popup(url,mode){
  
  console.log('%c Popup'+' %c '+url+' ', 'background:#E91E63;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  if (g_u_mode_popup == 'detail') var iframe = true; else var iframe = false;
  
  if ((mode=='consigne')||(mode=='reponse')) {
  //   $().colorbox({width:'85%',height: '85%', iframe: iframe, returnFocus: false, href:url, scrolling: true });
    loadSidebarContent(url);
    showSidebar();
  }
  else 
  if (mode=='classes')
  {
    loadSidebarContent(url);
    showSidebar();
/*
     showSidebar();
     
      $('#sidebar').load(url,function(){
       console.log('loaded');
       showSidebarCallback();
     });
     
     */
  }
  else {
    loadSidebarContent(url);
    showSidebar();
    /*
     showSidebar();
     
    $('#sidebar').load(url,function(){
       console.log('loaded');
       
       showSidebarCallback();
     });
     */
  }
}

function popup_html(url){
  loadSidebarContent(url);
  showSidebar();
}

////////////////////////////////////////////////////////////////
// 
//   Cookies

function reload_cookie(url,cookie_nom,cookie_valeur) {
  //alert (cookie_nom+" "+cookie_valeur);
  document.cookie = cookie_nom + "=" + escape(cookie_valeur);
  reload(url);
}

function reload(url) {
  if (url == 'self')  {
    location.reload( true );
    window.location.reload();
  }
  else window.location.href = url;
}

function loadSidebarContent(url) {
  // TO DO : loading
  
  $('#sidebar_iframe').attr('src',url);
  $('#sidebar_iframe').on('load',function(){
   showSidebarCallback();
  });
}

function showSidebar() {
  $('body').addClass('hasSidebarOpen');
  $('#sidebar').addClass('show');
  resizenow();
}

function showSidebarCallback() {
  $('#sidebar_iframe').contents().find('.crayon-init').trigger('mouseover mouseout mouseleave');
}
