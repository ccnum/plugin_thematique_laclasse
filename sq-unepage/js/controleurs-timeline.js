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
 * Afficher/cacher les travaux.
 *
 * @todo Documenter
 */

function showhide_travaux(mode){
  console.log('showHideTravaux');
	if (mode == undefined) if (g_hide_travaux == false) mode = 'hide'; else mode = 'show';
	
	if (mode == 'hide') {
		for (i = 0 ; i < CCN.consignes.length ; i++) {
			$(CCN.consignes[i].div_base).stop().fadeTo(2000,0.1);
			
			if (CCN.consignes[i].select == true) {
				$(CCN.consignes[i].div_reponse_plus).fadeOut('slow');
				
				for (j = 0 ; j < CCN.consignes[i].reponses.length ; j++) {
					$(CCN.consignes[i].reponses[j].div_base).fadeOut('slow');
				}
			}
		}
		g_hide_travaux = true;
	}
	
	else {
		hide_articles_evenement();
		hide_articles_blog();
		
		for (i = 0 ; i < CCN.consignes.length ; i++){
			$(CCN.consignes[i].div_base).fadeTo('slow',1);
			
			if (CCN.consignes[i].select == true){
				$(CCN.consignes[i].div_reponse_plus).fadeIn('slow');
				CCN.consignes[i].hideConsignePastille();
				
				for (j = 0 ; j < CCN.consignes[i].reponses.length ; j++){
					$(CCN.consignes[i].reponses[j].div_base).stop().fadeIn('slow');
				}
			}
		}
		g_hide_travaux = false;

		// Propagation isotope
		isotope_ressources_ferme_tout();
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
 * showConsigneInTimeline(146, true);
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
 * @deprecated
 */

function show_one_article_evenement(numero,duration){
	for (j=0; j<CCN.articlesEvenement.length;j++){
		$(CCN.articlesEvenement[j].img).stop(true);
		$(CCN.articlesEvenement[j].div_texte).stop(true);
		if (j != numero) hide_article_evenement(j,1,duration);
		if (j == numero) show_article_evenement(j,1,duration);
	}
	
	for (j=0; j<CCN.articlesBlog.length;j++) {
		$(CCN.articlesBlog[j].img).stop(true);
		$(CCN.articlesBlog[j].div_texte).stop(true);
		hide_article_blog(j,1,duration);
  }
}


/**
 * @deprecated
 */

function hide_article_evenement(i,delay,duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	var th = CCN.articlesEvenement[i];
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


/**
 * Affiche un événement.
 *
 * @todo Documenter
 */

function show_article_evenement(i,delay,duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	var th = CCN.articlesEvenement[i];
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


/**
 * @deprecated
 */

function showhide_articles_evenement(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	
	if (g_hide_articles_evenement == false) {
			$.each(CCN.articlesEvenement, function(index, value) {
			var delay = Math.random()*duration*0;
			hide_article_evenement(index,delay,duration);	
		});
		
		showhide_travaux('show');
	}
	else {
		showhide_travaux('hide');
		hide_articles_blog();
		
		$.each(CCN.articlesEvenement, function(index, value) {	
			var delay = Math.random()*duration*0;
			show_article_evenement(index,delay,duration);
		});
	}
}


/**
 * Cache un événement.
 *
 * @todo Documenter
 */

function hide_articles_evenement(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	
	$.each(CCN.articlesEvenement, function(index, value) {	
		var delay = Math.random()*duration*0;
		hide_article_evenement(index,0,duration);
	});	
}


/**
 * Affiche les événements
 *
 * @todo Documenter
 */

function show_articles_evenement(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	CCN.projet.showWholeTimeline(CCN.consignes, CCN.articlesBlog, CCN.articlesEvenement);
	showhide_travaux('hide');
	hide_articles_blog();
	$.each(CCN.articlesEvenement, function(index, value) {	
			var delay = Math.random()*duration*0;
			show_article_evenement(index,0,duration);
		});	
}


/**
 * @deprecated
 */ 
 
function show_one_article_blog(numero,duration){
	for (j=0; j<CCN.articlesBlog.length;j++){
		$(CCN.articlesBlog[j].img).stop(true);
		$(CCN.articlesBlog[j].div_texte).stop(true);
		if (j != numero) hide_article_blog(j,1,duration);
		if (j == numero) show_article_blog(j,1,duration);
	}
	for (j=0; j<CCN.articlesEvenement.length;j++) {
		$(CCN.articlesEvenement[j].img).stop(true);
		$(CCN.articlesEvenement[j].div_texte).stop(true);
		hide_article_evenement(j,1,duration);
	}
}


/**
 * Cache l'article du blog [Note : n'existera sûrement plus une fois le append DOM]
 *
 * @todo Documenter
 */

function hide_article_blog(i,delay,duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	var th = CCN.articlesBlog[i];
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


/**
 * @deprecated
 */

function show_article_blog(i,delay,duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	var th = CCN.articlesBlog[i];
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


/**
 * @deprecated
 */

function showhide_articles_blog(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	//$('#blog a').fadeTo('fast',0);
	if (g_hide_articles_blog == false){
		$.each(CCN.articlesBlog, function(index, value) {
			var delay = Math.random()*duration*0;
			hide_article_blog(index,delay,duration);	
		});
		showhide_travaux('show');
	}else{
		showhide_travaux('hide');
		hide_articles_evenement();
		$.each(CCN.articlesBlog, function(index, value) {
			var delay = Math.random()*duration*0;
			show_article_blog(index,delay,duration);
		});
	}
}


/**
 * Cache les articles de blog
 *
 * @todo Documenter
 */

function hide_articles_blog(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	$.each(CCN.articlesBlog, function(index, value) {	
		var delay = Math.random()*duration*0;
		hide_article_blog(index,0,duration);
	});
}


/**
 * Affiche les articles de blog
 *
 * @todo Documenter
 */

function show_articles_blog(duration){
	if (duration == undefined) duration = CCN.dureeTransition;
	CCN.projet.showWholeTimeline(CCN.consignes, CCN.articlesBlog, CCN.articlesEvenement);	
	showhide_travaux('hide');
	hide_articles_evenement();
	$.each(CCN.articlesBlog, function(index, value) {	
		var delay = Math.random()*duration*0;
		show_article_blog(index,0,duration);
	});
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
	var url = CCN.projet.url_popup_consigne+"&id_article="+id_consigne;
	loadContentInMainSidebar(url, 'article', 'consignes');
	showConsigneInTimeline(id_consigne);
	
	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
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
	if (id_classe==undefined) id_classe='';
	if ($('#zone_classe').is(':hidden'))	{
		hide_popups();
		var url = CCN.projet.url_popup_classes;
		if (id_classe!='') url = CCN.projet.url_popup_classes+'&id_rubrique='+id_classe+'&type_objet=travail_en_cours';
    loadContentInMainSidebar(url, 'rubrique', 'classes');
	
  	var url_travail_en_cours = 'spip.php?page=rubrique&mode=detail&id_rubrique='+CCN.travailEnCoursId;
  	loadContentInLateralSidebar(url_travail_en_cours, 'rubrique', 'travail_en_cours');
    
		$('#menug li a.selected').removeClass('selected');
		$('#ajax_rub_#ID_RUBRIQUE_OUVRE').addClass('selected');
	}
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
	hide_popups();
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

function callEvenement(id_objet,type_objet){
	hide_popups();
	var url = CCN.projet.url_popup_evenement+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url,'evenement');
	console.log('callEvenement');
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

function callBlog(id_objet,type_objet){
	hide_popups();	
	var url = CCN.projet.url_popup_blog+"&page="+type_objet+"&id_"+type_objet+"="+id_objet;
	popup(url,'blog');
	console.log('callBlog');
}


/**
 * @param {number} id_consigne
 * @param {number} id_rubrique_classe
 * @param {number} numero
 *
 * @todo Documenter
 */

function createReponse(id_consigne, id_rubrique_classe, numero){
	hide_popups();
	var url = CCN.projet.url_popup_reponseajout +"&id_consigne="+id_consigne+"&id_rubrique="+id_rubrique_classe;
	popup(url,'edition');
	if (numero!=undefined) CCN.consignes[numero].div_reponse_plus.style.visibility = "hidden"; // TO DO ?
	console.log('createReponse');
}


/**
 * Appelle le chargement de la ressource
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

function ressources_click(){
	if ($('#zone_classe').is(':hidden'))	{
		hide_popups();
		showhide_travaux('show');
		var url = CCN.projet.url_popup_ressources;
		popup(url,'edition');
    console.log('ressources_click');
	}	
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
		hide_popups();
		showhide_travaux('show');
		//popup('spip.php?page=rubrique&id_rubrique=33&mode=detail&type_objet=ressources','agora');
		var url = CCN.projet.url_popup_agora;
		popup(url,'agora');
		console.log('callAgora');
	}
}


/**
 * @deprecated
 */

function callChat(type){
	var url = CCN.projet.url_popup_chat;
	if (type==2) url = CCN.projet.url_popup_chat2;
	if (url.match("target=blank"))	window.open(url);
	
	else {
  	if (url.match("<"))	{
  		hide_popups();
  	//	popup_html(url,'chat'); 
    } 
    
    else {
  		hide_popups();
  		popup(url,'chat');
  		console.log('callChat');
  	}
	}
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
 * Cache les popups. 
 *
 * @todo Documenter
 *
 * @deprecated Sert pour Isotope (donc ne sert pas pour l'instant) 
 */

function hide_popups(){
	
	// Propagation isotope
	isotope_ressources_ferme_tout();
}


/**
 * @deprecated
 */

function stop_action(){
	CCN.projet.frame=0;
}


/**
 * @deprecated
 */

function activate_action(){
	CCN.projet.frame=0;
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
