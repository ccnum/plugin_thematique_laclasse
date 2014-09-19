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
					stop_action ();
				},
			stop: function(event,ui) {
				y_parent = $(this).parent().height();
				yy = ui.position.top / y_parent;
				alert (type_objet);
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

