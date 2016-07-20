/* * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  controleurs-timeline.js
 *
 *  Fonctions d'affichage générales
 *
 */
   
function largeur_zone() {
  return $(window).width()*0.98;
}

function hauteur_zone() {
  return $(window).height()*0.873;
}

function resizenow() {
  update_connecteurs();
}

////////////////////////////////////////////////////////////////
// Travaux
////////////////////////////////////////////////////////////////
function showhide_travaux(mode){
	if (mode==undefined) if (g_hide_travaux == false) mode = 'hide'; else mode = 'show';
	if (mode=='hide'){
		for (i=0; i<g_consignes.length;i++){
			$(g_consignes[i].div_base).stop().fadeTo(2000,0.1);
			//g_consignes[i].cache_questionscommentaires();
			if (g_consignes[i].select == true){
				//$(g_consignes[i].div_home).fadeOut('slow');
				$(g_consignes[i].div_reponse_plus).fadeOut('slow');
				for (j=0; j<g_consignes[i].reponses.length;j++){
					$(g_consignes[i].reponses[j].div_base).fadeOut('slow');
				}
			}
		}
		g_hide_travaux = true;
	}
	else{
		hide_articles_evenement();
		hide_articles_blog();
		for (i=0; i<g_consignes.length;i++){
			$(g_consignes[i].div_base).fadeTo('slow',1);
			//g_consignes[i].montre_questionscommentaires();
			if (g_consignes[i].select == true){
				//$(g_consignes[i].div_home).fadeIn('slow');
				$(g_consignes[i].div_reponse_plus).fadeIn('slow');
				g_consignes[i].cache_questionscommentaires();
				for (j=0; j<g_consignes[i].reponses.length;j++){
					$(g_consignes[i].reponses[j].div_base).stop().fadeIn('slow');
				}
			}
		}
		g_hide_travaux = false;

		//Propagation isotope
			isotope_ressources_ferme_tout();
	}
}


/**
 * Gère les événements lors du click sur une consigne et appelle {@link consigne.ouvre}.
 *
 * @param {number} numero - Index de la consigne (voir ex.1) ou ID SPIP de l'objet (voir ex.2)
 * @param {boolean} [isIdOfObject] - Définit si le numéro passé avec le paramètre <tt>numero</tt> est l'ID SPIP de l'objet
 *
 * @example
 * // Avec l'index de la consigne
 * consigne_ouvre(0);
 *
 * @example
 * // Avec l'ID SPIP la consigne
 * consigne_ouvre(146, true);
 *
 * @see consigne_click
 * @see consigne#ouvre
 */
 
function consigne_ouvre(numero, isIdOfObject) {
  
  if (isIdOfObject == true) {
    var numero = $('.consigne[data-id="'+numero+'"]').data('index');
  }
  
	var consigne_deja_select = 0;
	
	for (i=0; i<g_consignes.length;i++){
		if (i != numero) {
  		if (g_consignes[i].select == true) {
    		consigne_deja_select++;
      }
    }
	}
	
  if (consigne_deja_select != 0){
  //	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
  }
  
  // Puis on ouvre la consigne
  
  g_consignes[numero].ouvre(g_projet, g_consignes, g_articles_blog, g_articles_evenement);
  
  // Listener de fermeture (TO DO)
  
  g_projet.timeline.unbind().click(function(){
  //	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
  });
  
  // Propagation isotope
  var bouton = $(".filter a[onclick*='consigne_ouvre("+numero+")']");
  isotope_filtre(bouton);
}

function consigne_ferme(numero){
	// Listener de fermeture
  $("#canvas_projet").unbind('click');
	
	// Fermeture
  g_consignes[numero].ferme(g_projet, g_consignes, g_articles_blog, g_articles_evenement);
	
	// Propagation isotope
  isotope_consignes_ferme_tout();
}

////////////////////////////////////////////////////////////////
// Réponses
////////////////////////////////////////////////////////////////

function show_reponse(index_consigne,index_reponse){
	for (i=0; i<g_consignes[index_consigne].reponses.length;i++){
		//log (i+' '+index_reponse);	
		$(g_consignes[index_consigne].reponses[i].div_base).stop(true);
		if (i != index_reponse) $(g_consignes[index_consigne].reponses[i].div_base).stop(true).fadeTo(300,0.5);
		if (i == index_reponse) $(g_consignes[index_consigne].reponses[i].div_base).stop(true).fadeTo(300,1);		
	}
}
function hide_reponse(index_consigne,index_reponse){
	for (i=0; i<g_consignes[index_consigne].reponses.length;i++){
		$(g_consignes[index_consigne].reponses[i].div_base).stop(true).fadeTo(300,1);
	}
}

////////////////////////////////////////////////////////////////
// Articles_evenement
////////////////////////////////////////////////////////////////

function show_one_article_evenement(numero,duration){
	for (j=0; j<g_articles_evenement.length;j++){
		$(g_articles_evenement[j].img).stop(true);
		$(g_articles_evenement[j].div_texte).stop(true);
		if (j != numero) hide_article_evenement(j,1,duration);
		if (j == numero) show_article_evenement(j,1,duration);
	}
	for (j=0; j<g_articles_blog.length;j++) {
		$(g_articles_blog[j].img).stop(true);
		$(g_articles_blog[j].div_texte).stop(true);
		hide_article_blog(j,1,duration);
		}
}

function hide_article_evenement(i,delay,duration){
	if (duration == undefined) duration = g_duration_def;
	var th = g_articles_evenement[i];
	var i = i;
	$(th.div_texte).delay(delay).hide(duration/100, function() {
		if (th.left == -1) th.left = $(th.img).position().left;
		if (th.top == -1) th.top = $(th.img).position().top;
		var w = 150;
		var h = 94;
		if (th.left == 0) th.left = w/4;
		if (th.top == 0) th.top = h/3;
		var ll = w/3 + "px";
		var tt = h/3 + "px";
		$(th.div_base).css('z-index','90');
		$(th.div_texte).css('display','none');
		$(th.img).stop().animate({opacity: 0.2, width:ll, height:tt, top:th.top, left:th.left},duration,"easeInOutBack",function(){
			if ($('.article_evenement:visible').length == 0) {
				//$('#evenements a').html($('#evenements a').html().replace("Masquer", "Afficher"));
				g_hide_articles_evenement = true;
				//$('#evenements a').fadeTo('fast',1);
			}
		});
	});
}
function show_article_evenement(i,delay,duration){
	if (duration == undefined) duration = g_duration_def;
	var th = g_articles_evenement[i];
	var i = i;
	$(th.div_base).css('z-index','200');	
	$(th.img).stop().delay(delay).animate({width:'150px', height:'94px', top:0, left:0, opacity: 1},duration, "easeInOutBack",function(){
		$(th.div_texte).show(duration/1000,function(){
			if ($('.article_evenement:visible').length == $('.article_evenement').length) {
				//$('#evenements a').html($('#evenements a').html().replace("Afficher", "Masquer"));
				g_hide_articles_evenement = false;
				//$('#evenements a').fadeTo('fast',1);
			}
		});
	});
}
function showhide_articles_evenement(duration){
	if (duration == undefined) duration = g_duration_def;
	//$('#evenements a').fadeTo('fast',0);
	if (g_hide_articles_evenement == false){
			$.each(g_articles_evenement, function(index, value) {
			var delay = Math.random()*duration*0;
			hide_article_evenement(index,delay,duration);	
		});		
		showhide_travaux('show');
	}else{
		showhide_travaux('hide');
		hide_articles_blog();
		$.each(g_articles_evenement, function(index, value) {	
			var delay = Math.random()*duration*0;
			show_article_evenement(index,delay,duration);
		});

	}
}
function hide_articles_evenement(duration){
	if (duration == undefined) duration = g_duration_def;
	//$('#evenements a').fadeTo('fast',0);
	//hide_articles_blog();
	$.each(g_articles_evenement, function(index, value) {	
			var delay = Math.random()*duration*0;
			hide_article_evenement(index,0,duration);
		});	
}

function show_articles_evenement(duration){
	if (duration == undefined) duration = g_duration_def;
	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);
	showhide_travaux('hide');
	hide_articles_blog();
	$.each(g_articles_evenement, function(index, value) {	
			var delay = Math.random()*duration*0;
			show_article_evenement(index,0,duration);
		});	
	$("#canvas_projet").unbind().click(function(){ showhide_travaux('show');});	
}


////////////////////////////////////////////////////////////////
// Articles_blog
////////////////////////////////////////////////////////////////

function show_one_article_blog(numero,duration){
	for (j=0; j<g_articles_blog.length;j++){
		$(g_articles_blog[j].img).stop(true);
		$(g_articles_blog[j].div_texte).stop(true);
		if (j != numero) hide_article_blog(j,1,duration);
		if (j == numero) show_article_blog(j,1,duration);
	}
	for (j=0; j<g_articles_evenement.length;j++) {
		$(g_articles_evenement[j].img).stop(true);
		$(g_articles_evenement[j].div_texte).stop(true);
		hide_article_evenement(j,1,duration);
	}
}

function hide_article_blog(i,delay,duration){
	if (duration == undefined) duration = g_duration_def;
	var th = g_articles_blog[i];
	var i = i;
	$(th.div_texte).delay(delay).hide(duration/100, function() {
		if (th.left == -1) th.left = $(th.img).position().left;
		if (th.top == -1) th.top = $(th.img).position().top;
		var w = 98;
		var h = 98;
		if (th.left == 0) th.left = w/4;
		if (th.top == 0) th.top = h/3;
		var ll = w/3 + "px";
		var tt = h/3 + "px";
		$(th.div_base).css('z-index','90');
		$(th.div_texte).css('display','none');		
		$(th.img).stop().animate({opacity:0.2, width:ll, height:tt, top:th.top, left:th.left},duration,"easeInOutBack",function(){
			if ($('.article_blog:visible').length == 0) {
				//$('#blog a').html($('#blog a').html().replace("Masquer", "Afficher"));
				g_hide_articles_blog = true;
				//$('#blog a').fadeTo('fast',1);
			}
			//$(th.div_base).bind('mouseleave',function(){hide_article_blog(i,0)});
		});
	});
}

function show_article_blog(i,delay,duration){
	if (duration == undefined) duration = g_duration_def;
	var th = g_articles_blog[i];
	var i = i;
	$(th.div_base).css('z-index','200');
	$(th.img).stop().delay(delay).animate({width:'98px', height:'98px', left:0, top:0, opacity:1},duration,"easeInOutBack",function(){
		$(th.div_texte).show(duration/1000,function(){
			if ($('.article_blog:visible').length == $('.article_blog').length) {
				//$('#blog a').html($('#blog a').html().replace("Afficher", "Masquer"));
				g_hide_articles_blog = false;
				//$('#blog a').fadeTo('fast',1);
			}
		});
	});
}

function showhide_articles_blog(duration){
	if (duration == undefined) duration = g_duration_def;
	//$('#blog a').fadeTo('fast',0);
	if (g_hide_articles_blog == false){
		$.each(g_articles_blog, function(index, value) {
			var delay = Math.random()*duration*0;
			hide_article_blog(index,delay,duration);	
		});
		showhide_travaux('show');
	}else{
		showhide_travaux('hide');
		hide_articles_evenement();
		$.each(g_articles_blog, function(index, value) {
			var delay = Math.random()*duration*0;
			show_article_blog(index,delay,duration);
		});
	}
}

function hide_articles_blog(duration){
	if (duration == undefined) duration = g_duration_def;
	$.each(g_articles_blog, function(index, value) {	
		var delay = Math.random()*duration*0;
		hide_article_blog(index,0,duration);
	});
}

function show_articles_blog(duration){
	if (duration == undefined) duration = g_duration_def;
	g_projet.changevoittout(g_consignes, g_articles_blog, g_articles_evenement);	
	showhide_travaux('hide');
	hide_articles_evenement();
	$.each(g_articles_blog, function(index, value) {	
		var delay = Math.random()*duration*0;
		show_article_blog(index,0,duration);
	});
	$("#canvas_projet").unbind().click(function(){ showhide_travaux('show');});
}

////////////////////////////////////////////////////////////////
// Popups
////////////////////////////////////////////////////////////////

function consigne_click(id_consigne){
	var url = g_projet.url_popup_consigne+"&id_article="+id_consigne;
	loadContentInMainSidebar(url, 'article', 'consignes');
	consigne_ouvre(id_consigne, true);
}

function reponse_click(id_consigne, id_reponse){
	var url = g_projet.url_popup_reponse+"&id_consigne="+id_consigne+"&id_article="+id_reponse;
	loadContentInMainSidebar(url, 'article', 'travail_en_cours');
	
	// TODO
	// Changer la page des consignes en la page des (…?)
	
	var url_consigne = g_projet.url_popup_consigne+"&id_article="+id_consigne;
	loadContentInLateralSidebar(url_consigne, 'article', 'consignes');
}

function classes_click(id_rubrique_ouvre, id_travail_en_cours){
	if (id_rubrique_ouvre==undefined) id_rubrique_ouvre='';
	if ($('#zone_classe').is(':hidden'))	{
		hide_popups();
		var url = g_projet.url_popup_classes;
		if (id_rubrique_ouvre!='') url = g_projet.url_popup_classes+'&id_rubrique='+id_rubrique_ouvre+'&type_objet=travail_en_cours';
    loadContentInMainSidebar(url, 'rubrique', 'classes');
	
	
    // TODO
  	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+id_travail_en_cours;
  	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
    
		$('#menug li a.selected').removeClass('selected');
		$('#ajax_rub_#ID_RUBRIQUE_OUVRE').addClass('selected');
	}
}

/* * * * * * Below : to convert into loadXXXInSidebar * * * * * */

function article_ressource_click(id_objet,type_objet){
	hide_popups();
	var url = g_projet.url_popup_ressources+"&id_"+type_objet+"="+id_objet;
	popup(url,'ressource');
	console.log('article_ressource_click');
}

function article_evenement_click(id_objet,type_objet){
	hide_popups();
	var url = g_projet.url_popup_evenement+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url,'evenement');
	console.log('article_evenement_click');
}

function article_blog_click(id_objet,type_objet){
	hide_popups();	
	var url = g_projet.url_popup_blog+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url,'blog');
	console.log('article_blog_click');
}

function ajoutreponse_click(id_consigne, id_rubrique_classe, numero){
	hide_popups();
	var url = g_projet.url_popup_reponseajout +"&id_consigne="+id_consigne+"&id_rubrique="+id_rubrique_classe;
	popup(url,'edition');
	if (numero!=undefined) g_consignes[numero].div_reponse_plus.style.visibility = "hidden"; // TO DO ?
	console.log('ajoutreponse_click');
}

function reponse_ajouter_click(){
	hide_popups();
	var url = g_projet.url_popup_reponseajout;
	popup(url,'reponse_editer');
	console.log('reponse_ajouter_click');
}

function ressources_click(){
	if ($('#zone_classe').is(':hidden'))	{
		hide_popups();
		showhide_travaux('show');
		var url = g_projet.url_popup_ressources;
		popup(url,'edition');
    console.log('ressources_click');
	}	
}

function agora_click(){
	if ($('#zone_classe').is(':hidden'))	{
		hide_popups();
		showhide_travaux('show');
		//popup('spip.php?page=rubrique&id_rubrique=33&mode=detail&type_objet=ressources','agora');
		var url = g_projet.url_popup_agora;
		popup(url,'agora');
		console.log('agora_click');
	}
}

function chat_click(type){
	var url = g_projet.url_popup_chat;
	if (type==2) url = g_projet.url_popup_chat2;
	if (url.match("target=blank"))	window.open(url);
	else
	if (url.match("<"))	{
		hide_popups();
		popup_html(url,'chat'); } else {
		hide_popups();
		popup(url,'chat');
		console.log('chat_click');
	}
}


function hide_popups(){
	g_action = false;
	//Propagation isotope
	isotope_ressources_ferme_tout();
}


////////////////////////////////////////////////////////////////
// Boutons
////////////////////////////////////////////////////////////////

function hide_buttons(){
	//g_bouton_plus.div_base.style.visibility = "hidden";
	reponse_plus2 = document.getElementById("reponse_plus2");
	if (reponse_plus2 != null) reponse_plus2.style.visibility = "hidden";
}

function show_buttons(){
	//g_bouton_plus.div_base.style.visibility = "visible";
	reponse_plus2 = document.getElementById("reponse_plus2");
	if (reponse_plus2 != null) reponse_plus2.style.visibility = "visible";
}




// Deprecated

function stop_action(){
	g_action = false;
	g_action_mois = false;
	g_projet.frame=0;
//	log('stop_action');
}

// Deprecated

function activate_action(){
	g_action = true;
	g_action_mois = false;
	g_projet.frame=0;
//	log('activate_action');
}
