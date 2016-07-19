function loadContentInMainSidebar(url, typePage, typeObjet) {
  console.log('%c Main'+' %c '+url+' ', 
              'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
  $('#sidebar_main_inner').load(url, function() {
    showSidebar();
    hideSidebarLateral();
    $('#sidebar_content').scrollTop(0);
      
    console.log('%c Main'+' %c Loaded ', 
                'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 
                'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  });
  
  // TODO : callback /loading ?
}

function loadContentInLateralSidebar(url, typePage, typeObjet) {
  console.log('%c Lateral'+' %c '+url+' ', 
              'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 
              'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
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
  
  
  // TODO : callback /loading ?
}

function showSidebarLateral() {
  $('body').addClass('hasSidebarLateralVisible');
}
function hideSidebarLateral() {
  $('body').removeClass('hasSidebarLateralVisible');
}

function showSidebar() {
  $('body').addClass('hasSidebarOpen');
  $('#sidebar').addClass('show');
  resizenow();
}