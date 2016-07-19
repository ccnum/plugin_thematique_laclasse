function loadContentInMainSidebar(url, typePage, typeObjet) {
//  var url = url+'&ajaxcache='+Math.floor(Date.now());
  
  console.log('%c Main'+' %c '+url+' ', 'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
  // $('#sidebar_main').load(url+' #sidebar_content_inner', {limit:25});
  
  $('#sidebar_main_inner').load(url, function(response, status, xhr){
    if ( status == "error" ) {
      var msg = "Sorry but there was an error: ";
      console.log( msg + xhr.status + " " + xhr.statusText );
    }
    
    showSidebar();
    hideSidebarLateral();
    $('#sidebar').scrollTop(0);
      
    console.log('%c Main'+' %c Loaded ', 'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  });
  /*
  $.ajax({
    url: url,
    success: function(html) {
      $('.call_sidebar_main').remove();
      $('#sidebar_main_inner')[0].innerHTML = html;
      $('body').scrollTop(0);
      showSidebar();
      hideSidebarLateral();
        
      console.log('%c Main'+' %c Loaded ', 'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
    }
  });
  */
  
  // TODO : callback /loading ?
}

function loadContentInLateralSidebar(url, typePage, typeObjet) {
//  var url = url+'&ajaxcache='+Math.floor(Date.now());
  
  console.log('%c Lateral'+' %c '+url+' ', 'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
  $('#sidebar_lateral_inner').load(url, function(response, status, xhr){
    if ( status == "error" ) {
      var msg = "Sorry but there was an error: ";
      console.log( msg + xhr.status + " " + xhr.statusText );
    }
    
    $('#sidebar').scrollTop(0);
    showSidebar();
      
    console.log('%c Lateral'+' %c Loaded ', 'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  });
  /*
  $.ajax({
    url: url,
    success: function(html) {
      $('#sidebar_lateral_inner')[0].innerHTML = html;
      $('body').scrollTop(0);
      showSidebar();
        
      console.log('%c Lateral'+' %c Loaded ', 'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
    }
  });
  */
  
  
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