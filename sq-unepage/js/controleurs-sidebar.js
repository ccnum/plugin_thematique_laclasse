function loadContentInMainSidebar(url, typePage, typeObjet) {
  console.log('%c Main'+' %c '+url+' ', 'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
  // $('#sidebar_main').load(url+' #sidebar_content_inner', {limit:25});
  
  $.ajax({
    url: url,
    success: function(html) {
      $('.call_sidebar_main').remove();
      
      if ($('#sidebar_main_around').length == 0) {
        $(html).insertAfter('#sidebar_lateral_around');
      } else {
        $('#sidebar_main_around').replaceWith(html);
      }
      
      $('body').scrollTop(0);
    }
  });
  
  
  // TODO : callback /loading ?
}

function loadContentInLateralSidebar(url, typePage, typeObjet) {
  console.log('%c Lateral'+' %c '+url+' ', 'background:#FFA000;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  // TODO : loading ?
  
  $.ajax({
    url: url,
    success: function(html) {
      if ($('#sidebar_lateral_around').length == 0) {
        $(html).insertAfter('#sidebar_main_around');
      } else {
        $('#sidebar_lateral_around').replaceWith(html);
      }
      $('body').scrollTop(0);
    }
  });
  
  
  // TODO : callback /loading ?
}

function hideSidebarLateral() {
  $('body').removeClass('hasSidebarLateralVisible');
}