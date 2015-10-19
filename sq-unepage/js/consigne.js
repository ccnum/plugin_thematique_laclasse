////////////////////////////////////////////////////////////////
// objet consigne
////////////////////////////////////////////////////////////////
function consigne(){

	// membres
	var id, numero, titre, date, date_texte, nombre_reponses, nombre_commentaires, x, y, largeur, hauteur, select, taille_titre;
	var div_base, div_titre, div_home, div_reponse_plus, div_reponses, div_reponses_classe;
	var reponses;
	var nombre_jours_max;

	// méthode init
	this.init = function(projet, canvas, numero, id, titre, date, nombre_jours, nombre_jours_max, nombre_reponses, nombre_commentaires, y, image, intervenant_id, classes){
			this.id = id;
			this.intervenant_id = intervenant_id;
			this.numero = numero;
			this.titre = titre;
			this.date = date;
			this.nombre_reponses = nombre_reponses;
			this.nombre_commentaires = nombre_commentaires;
			this.x = nombre_jours;
			this.nombre_jours_max = nombre_jours_max;
			if (this.nombre_jours_max <= 0){
				this.nombre_jours_max = nombre_jours;
			}
			this.y = y;
			this.image = image;
			this.select = false;

		// base			
			this.div_base = document.createElement("div");
			this.div_base.style.position = "absolute";
			this.div_base.style.left = this.nombre_jours*g_projet.nombre_jours/100;
			this.div_base.style.top = this.y+"px";
			this.div_base.style.zIndex = 100;
			this.div_base.style.cursor = "pointer";
			
			// canvas.appendChild(this.div_base);

      g_projet.timeline.append(this.div_base);

			for (k=0;k<classes.length;k++){
				if (intervenant_id == classes[k].id){
					var nom_classe = classes[k].nom;
				}
			}

		// titre
			this.date_texte = date.substring(0, 2) + " " + g_nom_mois[parseFloat(date.substring(3, 5))-1] + " " + date.substring(6, 10);
			this.div_titre = document.createElement("div");
			this.div_titre.setAttribute("onClick","consigne_ouvre("+this.numero+")");
			this.div_titre.setAttribute("id","consigne"+this.id);
			var coul = ""+intervenant_id+"";
			var coul = coul.substr(coul.length-1,1);			
			this.div_titre.setAttribute("class","consigne couleur_texte_consignes couleur_consignes"+coul);

			this.taille_titre = 9+12*projet.zoom_consignes/(0.3*nombre_reponses+1);
			this.div_titre.innerHTML  = "<div class=\"picto_nombre_reponses\">"+nombre_reponses+"</div> "+
				"<div class=\"picto_nombre_commentaires\">"+nombre_commentaires+"</div> "+
				"<div class=\"photo\"><img src=\""+image+"\" /></div> "+
				"<div class=\"texte\">"+
				"<div class=\"titre\" style=\"font-size:"+this.taille_titre+"px;line-height:"+(this.taille_titre-2)+"px;\">"+this.titre+"</div> "+
				"<div class=\"auteur_date\">"+nom_classe+" - "+this.date_texte+"</div> "+
				"</div>"+
				"<div class=\"nettoyeur\"></div> ";
				
			this.div_base.appendChild(this.div_titre);	
			

		  // Calcul des tailles des consignes
		  
			this.largeur = $(this.div_base).outerWidth();
			this.hauteur = $(this.div_base).outerHeight();
			log (this.titre+':'+this.largeur);
			
      // Préparation bouton réponse plus (crayon)
		
			this.div_reponse_plus = document.createElement("div");
			this.div_reponse_plus.innerHTML = "<div style='position:absolute;z-index:1;'><img src='"+g_u_chemin+"img/reponse_plus.png' onClick='ajoutreponse_click("+this.id+","+g_u_id_restreint+","+this.numero+");' title='répondre à la consigne' ></div>";
			this.div_reponse_plus.style.position = "absolute";
			this.div_reponse_plus.style.visibility = "hidden";
			this.div_reponse_plus.style.cursor = "pointer";
			this.div_reponse_plus.left = (this.largeur+10)+"px";
			this.div_reponse_plus.style.top = (this.hauteur-25)+"px";
			
			this.div_base.appendChild(this.div_reponse_plus);
							
		// bouton retour vue générale
			/*
			this.div_home = document.createElement("div");
			this.div_home.style.position = "absolute";
			this.div_home.style.left = this.largeur+10+"px";
			this.div_home.style.top = (this.hauteur-23)+"px";
			this.div_home.style.visibility = "hidden";
			this.div_home.innerHTML = "<div style='position:absolute;z-index:1;' onClick='consigne_ferme("+this.numero+");'><img src='"+g_u_chemin+"img/maison.png' title='retour à la vue générale' ></div>";
			this.div_base.appendChild(this.div_home);
			*/

		// prepare le tableau de réponse
			this.reponses = [];

		//draggable
			if (g_u_admin==0)
			$(this.div_titre).draggable({
				axis: "y" ,
				start: function(event,ui){
					$(this).removeAttr("onClick");
				},
				stop: function(event,ui) {
					//if ($(this.select).val() == true)	{
						y_parent = $(this).parent().parent().height();
						yy = ui.offset.top / y_parent;
						//alert(ui.offset.top+' '+y_parent+' '+yy);
						$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:id, type_objet:"article", X:0, Y:yy } );
						//$(this).attr("onClick","consigne_ouvre("+$(this.numero).val()+")");
					//}
				}
			});
	}

	// bouton répondre à la consigne
		this.ajouter_reponse_plus = function(){
		if ((g_u_id_restreint > 0)&&(g_u_type_restreint != '')&&(g_u_type_restreint == 'travail_en_cours')){
			this.div_reponse_plus.style.visibility = "visible";
			//this.div_home.style.left = this.largeur+50+"px";
		}
	}
	
	// ajoutereponseclasse
		this.ajoutereponseclasse = function(nombre_reponses, nombre_commentaires){
	}

	// méthode ajoutereponse
		this.ajoutereponse = function(reponse){
			this.reponses.push(reponse);
		}

	// méthode montre_questionscommentaires
		this.montre_questionscommentaires = function(){
			$("#consigne"+this.id+" .picto_nombre_commentaires").fadeIn('slow');
			$("#consigne"+this.id+" .picto_nombre_reponses").fadeIn('slow');
			//$(this.div_titre).fadeIn('slow');
			//$(this.div_titre).fadeIn('slow');
		}

	// méthode cache_questionscommentaires
		this.cache_questionscommentaires = function(){
			$("#consigne"+this.id+" .picto_nombre_commentaires").fadeOut('slow');
			$("#consigne"+this.id+" .picto_nombre_reponses").fadeOut('slow');
			//$(this.div_reponses_classe).fadeOut('slow');
			//$(this.div_commentaires_classe).fadeOut('slow');
		}

	// méthode ferme
		this.ferme = function(projet, consignes, articles_blog, articles_evenement){
			projet.changevoittout(consignes, articles_blog, articles_evenement);
			this.montre_questionscommentaires();
			this.select = false;
		}

	// méthode ouvre
		this.ouvre = function(projet, consignes, articles_blog, articles_evenement){
			//hide_buttons();
			//Si ce n'est pas le cas on ouvre la vue
				if (this.select == false){
					var y_dest = (projet.hauteur-this.hauteur-50)-this.y;
					this.cache_questionscommentaires();
					// un mois est déjà sélectionné -> on déplace 
						if (projet.mois_select >= 0){
							var x_dest = (projet.x+10)/(projet.largeur/(projet.nombre_jours_vus_dest-projet.nombre_jours_vus))-this.x+10/(projet.largeur/(projet.nombre_jours_vus));
							projet.changepos(projet.nombre_jours_vus, x_dest, y_dest);
							//this.div_home.style.visibility = "visible";
							//this.div_reponse_plus.style.visibility = "visible";
						}
					// sinon on ouvre la vue consigne
						else{
							projet.changepos(this.nombre_jours_max, -this.x+10/(projet.largeur/this.nombre_jours_max), y_dest);
							//this.div_home.style.visibility = "visible";
							//this.div_reponse_plus.style.visibility = "visible";
						}
					// fade tous les consignes
						for (i=0; i<consignes.length;i++){
							if (this!=consignes[i]) {
							$(consignes[i].div_base).stop(true).fadeTo(2000,0);
							//consignes[i].div_base.style.opacity = "0.25";
							consignes[i].div_base.style.cursor = "default";
							consignes[i].div_titre.removeAttribute("onClick");
							consignes[i].div_titre.setAttribute("onClick","consigne_ouvre("+consignes[i].numero+");");
							//consignes[i].div_titre.innerHTML  = "<div onMouseOut=\"this.style.color='"+projet.couleur_base_texte+"';\" onMouseOver=\"this.style.color='"+projet.couleur_base_texte+"';\" style='white-space:nowrap;' onClick=\"consigne_ouvre("+consignes[i].numero+");\"><font style='font-size:"+consignes[i].taille_titre+"px;line-height:"+(this.taille_titre-2)+"px;'><b>"+consignes[i].titre+"</b></font><font style='font-size:10px;'><br/>"+consignes[i].date_texte+"</font></div>";
							}
						}
					// on ouvre les réponses
						for (i=0; i<this.reponses.length;i++){
							$(this.reponses[i].div_base).stop(true).fadeTo(2000,1).css('visibility','visible');
						}
						this.div_base.style.opacity = "1";
						this.div_base.style.cursor = "pointer";
						this.div_titre.removeAttribute("onClick");
						this.div_titre.setAttribute("onClick","consigne_ouvre("+this.numero+");");
						//this.div_titre.innerHTML  = "<div onMouseOut=\"this.style.color='"+projet.couleur_1erplan3+"';\" onMouseOver=\"this.style.color='"+projet.couleur_base_texte+"';\" style='white-space:nowrap;' onClick=\"consigne_ouvre("+this.numero+");\"><font style='font-size:"+this.taille_titre+"px;line-height:"+(this.taille_titre-2)+"px;'><b>"+this.titre+"</b></font><font style='font-size:10px;'><br/>"+this.date_texte+"</font></div>";
					// cache les articles de blog
						for (i=0; i<articles_blog.length;i++){
							//$(articles_blog[i].div_base).fadeOut('normal');
							$(articles_blog[i].div_base).hide();
						}
					// cache les articles d'événement
						for (i=0; i<articles_evenement.length;i++){
							//$(articles_evenement[i].div_base).fadeOut('normal');
							$(articles_evenement[i].div_base).hide();
						}
					this.select = true;
				}
			//Si la vue est déjà ouverte on ouvre la popup
				else{
					if (vue=='timeline') {
						stop_action ();
						consigne_click(this.id);
						this.select = true;
					}
				}
		}
	
}

