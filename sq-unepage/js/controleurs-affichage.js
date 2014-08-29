////////////////////////////////////////////////////////////////
// Déclaration des globales
////////////////////////////////////////////////////////////////
  var vue = 'timeline';

////////////////////////////////////////////////////////////////
// Controleurs affichage
////////////////////////////////////////////////////////////////
    function logo_menu_change_couleur(val){
        $(val).parent().parent().parent().children("h3").css('background-color',$(val).css('background-color'));
      }

    function isotope_ressources_ferme_tout(){
        //showhide_travaux('show');
        var bouton = $(".filter a[onclick*='showhide_travaux'][class*='tout']");
        isotope_filtre(bouton);
        //$('#menu_haut ul li a').removeClass('selected');
      }

    function isotope_classes_ferme_tout(){
        var bouton = $("#menu-classes a.logo_menu-tout");
        isotope_filtre(bouton);
        //$('#menu-classes ul li a').removeClass('selected');
    }

    function isotope_consignes_ferme_tout(){
        //g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
        var bouton = $(".filter a[onclick*='g_projet.changevoittout']");
        isotope_filtre(bouton);
    }

////////////////////////////////////////////////////////////////
// Listeneurs Affichage
//////////////////////////////////////////////////////////////// 

$().ready(function(){

    //Select
      /*$(".custom-select").each(function(){
        $(this).wrap("<span class='select-wrapper'></span>");
        $(this).after("<span class='holder'></span>");
        var selectedOption = $(this).find(":selected").text();
        $(this).next(".holder").text(selectedOption);
      })*/

      $('div[name=annee_scolaire] input[type=radio]').change( function() {
        var valeur = $('div[name=annee_scolaire] input[type=radio]:checked').val()
        reload_cookie('','[(#EVAL{_cookie_annee_scolaire})]',valeur)
      });

      $('div[name=rubrique_admin] input[type=radio]').change( function() {
        var valeur = $('div[name=rubrique_admin] input[type=radio]:checked').val()
        reload_cookie('','[(#EVAL{_cookie_rubrique})]',valeur)
      });
      
    //Tooltip 
      $("#menu_bas ul a").tooltip({
          position: {
            my: "center top+20",
            at: "center bottom",
            using: function( position, feedback ) {
              $( this ).css( position );
              $( "<div>" )
                .addClass( "arrow" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            },
            collision: "none",
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

    //Click des logos-menus
      //Ouverture Timeline
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

      //Ouverture Classes
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
        if (($('#menu_bas a[data-filter-value=".ressource_consignes"]').hasClass('selected'))||($('#menu_bas a[data-filter-value=".ressource_reponses"]').hasClass('selected'))) isotope_ressources_ferme_tout();
        stop_action ();
        vue = 'classes';
      });

    //Fermeture du canvas
      $("#canvas_projet").click(function(){
        //alert ('ok');
        //g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);      
      });

    //Initialisation des logos-menus
      $("#menu_bas li a.selected").each(function (){ logo_menu_change_couleur(this); });
      $('#menu_bas a[data-filter-value=".ressource_consignes"]').parent().stop().fadeOut(1000);
      $('#menu_bas a[data-filter-value=".ressource_reponses"]').parent().stop().fadeOut(1000);


  });


////////////////////////////////////////////////////////////////
// Colorbox
////////////////////////////////////////////////////////////////
  function popup(url,mode){
    if (g_u_mode_popup == 'detail') var iframe = true; else var iframe = false;
    if ((mode=='consigne0')||(mode=='reponse'))
    {
       $().colorbox({width:'85%',height: '85%', iframe: iframe, returnFocus: false, href:url, scrolling: true });
    }
    else 
    if (mode=='classes')
    {

        $().colorbox({width:'85%',height: '85%', iframe: iframe, returnFocus: false, href:url, scrolling: true, 
        onClosed:function(){isotope_classes_ferme_tout(); }
        });
    }
    else
      $().colorbox({width:'85%',height: '85%', iframe: iframe, returnFocus: false, href:url, scrolling: true,
      onClosed:function(){isotope_ressources_ferme_tout();}
      });
  }

  function popup_html(url){
      if (g_u_mode_popup == 'detail') var iframe = true; else var iframe = false;
      $().colorbox({width:'85%',height: '85%', html:url,
          onClosed:function(){isotope_ressources_ferme_tout();isotope_classes_ferme_tout();}
      });
  }

  $().ready(function(){
        $(".colorbox").colorbox({width:'85%',height: '85%', rel:'colorbox', iframe: true, returnFocus: false, scrolling: true,
        onClosed:function(){isotope_ressources_ferme_tout();}
        });       
  });

////////////////////////////////////////////////////////////////
// Cookies
////////////////////////////////////////////////////////////////
function reload_cookie(url,cookie_nom,cookie_valeur) {
  //alert (cookie_valeur);
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
