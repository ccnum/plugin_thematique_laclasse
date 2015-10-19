////////////////////////////////////////////////////////////////
// objet reponse
////////////////////////////////////////////////////////////////
function reponse(){

	// membres
	var id, classe_id, titre, date, nombre_commentaires, x, y;
	var div_base, div_texte, div_commentaires;

	// méthode init
	this.init = function(projet, consigne, classes, numero, id, classe_id, titre, date, date_date, nombre_commentaires, nombre_jours, y, vignette, index){
  	
		this.id = id;
		this.classe_id = classe_id;
		this.titre = titre;
		this.date = date;
		this.date_date = date_date;
		this.nombre_commentaires = nombre_commentaires;
		this.x = nombre_jours;
		this.x_absolu = nombre_jours+consigne.x; // Le bloc réponse est relatif à la position x de la consigne
		this.y = y;
		
		console.log(consigne);

    console.log('this x : '+this.x);
    console.log('this x_relatif : '+this.x_relatif);
    console.log('consigne.x (donc son nombre de jours) : '+consigne.x);

		this.index = index;

		// base			

		this.div_base = document.createElement("div");
		this.div_base.style.position = "absolute";
		this.div_base.style.left = (this.x_absolu/g_projet.nombre_jours*100)+'%';
		//this.div_base.style.top = -(this.y)+"px";
		//y_parent = $(this).parent().parent().height();
		//if ((this.y < 1)&&(this.y > 0)) alert(this.y*g_projet.hauteur);
		this.div_base.style.top = -(this.y*g_projet.hauteur)+"px";
		if (this.y > 1) alert (this.y);

		this.div_base.style.cursor = "cursor";
		this.div_base.style.visibility = "visible"; // TO DO hidden
		this.div_base.setAttribute("class","reponse_haute");
		for (k=0;k<classes.length;k++){
			if (classe_id == classes[k].id){
				var nom_classe = classes[k].nom;
			}
		}
		consigne.div_base.appendChild(this.div_base);

	// texte
		var date_texte = date.substring(0, 2) + " " + g_nom_mois[parseFloat(date.substring(3, 5))-1];
		this.div_texte = document.createElement("div");
		this.div_texte.onSelectStart = null;
				
		this.div_texte.setAttribute("onClick","reponse_click("+consigne.id+","+this.id+");");
		$(this.div_base).mouseover(function(){	show_reponse(consigne.numero,index);	});
		$(this.div_base).mouseleave(function(){ hide_reponse(consigne.numero,index);	});

		this.div_texte.setAttribute("id","reponse"+this.id);
		var coul = ""+classe_id+"";
		var coul = coul.substr(coul.length-1,1);
		this.div_texte.setAttribute("class","reponse couleur_texte_travail_en_cours couleur_travail_en_cours"+coul);
		
		//this.taille_titre = 9+12*projet.zoom_consignes/(0.3*nombre_reponses+1);
		this.div_texte.innerHTML  = "<div class=\"picto_nombre_commentaires\">"+nombre_commentaires+"</div> "+
			"<div class=\"photo\"><img src=\""+vignette+"\" /></div> "+
			"<div class=\"texte\">"+
			"<div class=\"titre\" class=\"\">"+this.titre+"</div> "+
			"<div class=\"auteur_date\">"+nom_classe+" - "+date_texte+"</div> "+
			"</div>"+
			"<div class=\"nettoyeur\"></div> ";
		this.div_base.appendChild(this.div_texte);
	
	// calcul hauteur consigne
		this.largeur = $(this.div_base).outerWidth();
		this.hauteur = $(this.div_base).outerHeight()+7;	

	//draggable
		if (g_u_admin==0)
		$(this.div_base).draggable({
			axis: "y" ,
			start: function(event,ui){
				//$(this).removeAttr("onClick");
				$(this).children('div').removeAttr("onClick");					
			},
			stop: function(event,ui) {
				//if ($(this.select).val() == true)	{
					yy = - (ui.position.top / g_projet.hauteur);
					//alert(ui.offset.top+' '+ui.position.top+' '+yy);
					//yy = -ui.position.top-70;
					//alert (y_parent+':'+ui.offset.top+':'+ui.position.top+':'+yy);
					$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:id, type_objet:"article", X:0, Y:yy } );
					//$(this).attr("onClick","consigne_ouvre("+$(this.numero).val()+")");
				//}
			}
		});
	}

}
