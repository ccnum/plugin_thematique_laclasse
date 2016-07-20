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
    if ( status == "error" ) {
      var msg = "Sorry but there was an error: ";
      console.log( msg + xhr.status + " " + xhr.statusText );
    }
    
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
  resizenow();
}