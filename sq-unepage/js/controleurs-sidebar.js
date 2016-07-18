function loadContentInMainSidebar(url) {
  console.log('%c Main'+' %c '+url+' ', 'background:#8BC34A;color:#fff;padding:2px;border-radius:2px;', 'background:#009688;color:#fff;padding:2px;display:block;margin-top:5px;border-radius:2px;');
  
  
  // TODO : loading ?
  
  // $('#sidebar_main').load(url+' #sidebar_content_inner', {limit:25});
  
  
  $.ajax({
    url: url,
    success: function(html) {
      $('#sidebar_main_around').replaceWith(html);
      $('body').scrollTop(0);
    }
  });
  
  
  // TODO : callback /loading ?
}

function hideSidebarLateral() {
  $('body').removeClass('hasSidebarLateralVisible');
}