////////////////////////////////////////////////////////////////
// objet article_evenement
////////////////////////////////////////////////////////////////
function article_evenement(){

	// membres
	var id, titre, date, nombre_commentaires, x, y, type_objet, left, top;
	var div_base, div_texte, div_commentaires;

	// méthode init
		this.init = function(projet, canvas, numero, id, titre, date, nombre_commentaires, nombre_jours, y, type_objet, id_objet, index){
			this.id = id;
			this.type_objet = type_objet;
			this.id_objet = id_objet;
			this.titre = titre;
			this.date = date;
			this.nombre_commentaires = nombre_commentaires;
			this.x = nombre_jours;
			this.y = y;
			this.left = -1;
			this.top = -1;			
			this.index = index;
			this.show = false;
			this.div_base = document.createElement("div");
			this.div_base.style.position = "absolute";
			this.div_base.style.left = "-1000px";
			this.div_base.style.top = this.y+"px";
			this.div_base.style.cursor = "pointer";
			this.div_base.setAttribute("class","article_evenement_container");		
			canvas.appendChild(this.div_base);
		
		// image
			this.img = document.createElement("img");
			this.img.setAttribute("src",g_u_img_evt);
			this.div_base.appendChild(this.img);
		
		// texte
			var date_texte = date.substring(0, 2) + " " + g_nom_mois[parseFloat(date.substring(3, 5))-1];
			this.div_texte = document.createElement("div");
			this.div_texte.setAttribute("class","cache");			
			this.div_texte.onSelectStart = null;
			var html = "<div id='article_evenement"+id+"' class='article_evenement' onClick='article_evenement_click("+this.id_objet+",\""+this.type_objet+"\");'><span><b>"+titre+"</b><br/>"+date_texte+"</span>";
			if (nombre_commentaires > 0) html += "<div class=\"picto_nombre_commentaires\">"+nombre_commentaires+"</div>";
			html += "</div>";
			this.div_texte.innerHTML = html;
			this.div_base.appendChild(this.div_texte);
		
		if (g_u_admin==0)
		$(this.div_base).draggable({
			axis: "y" ,
			start: function(event,ui){
					$(this).children('div').children('div').removeAttr("onClick");
					g_action = false;
				},
			stop: function(event,ui) {
				y_parent = $(this).parent().height();
				yy = ui.position.top / y_parent;
				$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:id_objet, type_objet:type_objet, X:0, Y:yy } );
			}
		});
		
		/*
		$(this.div_base).bind('mouseenter',function(){
				show_one_article_evenement(index,1500);
			});

		$(this.div_base).bind('click',function(){
			//alert('ok');
			showhide_articles_evenement();
			});
		*/
	}
}


////////////////////////////////////////////////////////////////
// showhide_articles_evenement
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
		$(th.img).animate({opacity: 0.2, width:ll, height:tt, top:th.top, left:th.left},duration,"easeInOutBack",function(){
			if ($('.article_evenement:visible').length == 0) {
				$('#evenements a').html($('#evenements a').html().replace("Masquer", "Afficher"));
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
	$(th.img).delay(delay).animate({width:'150px', height:'94px', top:0, left:0, opacity: 1},duration, "easeInOutBack",function(){
		$(th.div_texte).show(duration/1000,function(){
			if ($('.article_evenement:visible').length == $('.article_evenement').length) {
				$('#evenements a').html($('#evenements a').html().replace("Afficher", "Masquer"));
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
			log("ferme evt");
			$.each(g_articles_evenement, function(index, value) {
			var delay = Math.random()*duration*0;
			hide_article_evenement(index,delay,duration);	
		});		
		showhide_travaux('show');
	}else{
		log("ouvre evt");
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