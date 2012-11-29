////////////////////////////////////////////////////////////////
// classe de projet
////////////////////////////////////////////////////////////////
function projet(){  
	
	// membres
	var x, xx, x_dest, dx;
	var y, yy, y_dest, dy;
	var largeur, hauteur, fps, frame, dzoom, x_barre, largeur_barre;
	var largeur_mois, premier_mois, nombre_mois, mois_select, mois_rollover, premier_jour, nombre_jours, nombre_jours_vus, premiere_annee, date_debut, date_fin, aujourdhui;
	var couleur_fond, couleur_1erplan1, couleur_1erplan2, couleur_1erplan3, couleur_blog, image_fond, zoom_consignes;
	var liste_cy_consignes, liste_y_blogs, liste_y_evenements;
	var url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_classes, url_popup_chat;
	var div_base, div_barre, div_base_context, div_mois;

	
	// méthode init
	this.init = function(canvas, largeur, hauteur, fps, date_debut, date_fin, couleur_fond, couleur_base_texte, couleur_1erplan1, couleur_1erplan2, couleur_1erplan3, image_fond, zoom_consignes, liste_y_consignes, liste_y_blogs, liste_y_evenements, url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_classes, url_popup_chat){
			this.x = 0;
			this.xx = 0;
			this.dzoom = 0;
			this.x_dest = 0;
			this.dx = 0;
			this.y = 0;
			this.yy = 0;
			this.y_dest = 0;
			this.dy = 0;
			this.largeur = largeur;
			this.hauteur = hauteur;
			this.fps = fps;
			this.frame = -1;
			this.calcdate(date_debut, date_fin);
			this.couleur_fond = couleur_fond;
			this.couleur_base_texte = couleur_base_texte;
			this.couleur_1erplan1 = couleur_1erplan1;
			this.couleur_1erplan2 = couleur_1erplan2;
			this.couleur_1erplan3 = couleur_1erplan3;
			this.zoom_consignes = zoom_consignes;
		// liste y consignes
			var liste_y = liste_y_consignes.split(",");
			this.liste_y_consignes = [];
			for (i=0;i<liste_y.length;i++){
				this.liste_y_consignes.push(parseFloat(liste_y[i]));
			}
		// liste y articles de blog
			var liste_y = liste_y_blogs.split(",");
			this.liste_y_blogs = [];
			for (i=0;i<liste_y.length;i++){
				this.liste_y_blogs.push(parseFloat(liste_y[i]));
			}
		// liste y articles d'événement
			var liste_y = liste_y_evenements.split(",");
			this.liste_y_evenements = [];
			for (i=0;i<liste_y.length;i++){
				this.liste_y_evenements.push(parseFloat(liste_y[i]));
			}
		// image de fond
			this.image_fond = new Image();
			if (image_fond.length > 1){
				this.image_fond.src = image_fond;
			}
			this.div_base = document.createElement("canvas");
			this.div_base.setAttribute("id","canvas_projet");
			this.div_base.width = largeur;
			this.div_base.height = hauteur;
			this.div_base.style.cursor = "default";			
			// prépare rendu
			this.div_base_context = this.div_base.getContext("2d");
			this.div_base_context.lineWidth = 0.5;
			this.div_base_context.strokeStyle = this.couleur_1erplan1;
			this.div_base_context.fillStyle = this.couleur_1erplan1;			
			this.div_base_context.font = "10px sans-serif";
	 		this.div_base_context.textBaseline = "top";
			canvas.appendChild(this.div_base);
			
		//barre mois
			this.div_mois = document.createElement("canvas");
			this.div_mois.setAttribute("id","canvas_mois");
			this.div_mois.width = largeur;
			this.div_mois.height = 20;			
			this.div_mois.style.position = "absolute";
			this.div_mois.style.left = "0px";
			this.div_mois.style.top = "800px";
			this.div_mois.style.zIndex = 1000;
			this.div_mois.style.cursor = "pointer";
			// prépare rendu
			this.div_mois_context = this.div_mois.getContext("2d");
			this.div_mois_context.lineWidth = 0.5;
			this.div_mois_context.strokeStyle = this.couleur_1erplan1;
			this.div_mois_context.font = "10px sans-serif";
	 		this.div_mois_context.textBaseline = "top";
			this.div_mois_context.fillStyle = "#eee";
			
			canvas.appendChild(this.div_mois);
			
		// urls
			this.url_popup_consigne = url_popup_consigne;
			this.url_popup_reponse = url_popup_reponse;
			this.url_popup_reponseajout = url_popup_reponseajout;
			this.url_popup_blog = url_popup_blog;
			this.url_popup_evenement = url_popup_evenement;
			this.url_popup_ressources = url_popup_ressources;
			this.url_popup_classes = url_popup_classes;		
			this.url_popup_chat	= url_popup_chat;
	}
	
	// méthode calcdate
	this.calcdate = function(date_debut, date_fin){
		var jd1 = parseFloat(date_debut.substring(0, 2));
		var md1 = parseFloat(date_debut.substring(3, 5));
		var yd1 = parseFloat(date_debut.substring(6, 10));
		var jd2 = parseFloat(date_fin.substring(0, 2));
		var md2 = parseFloat(date_fin.substring(3, 5));
		var yd2 = parseFloat(date_fin.substring(6, 10));
		this.date_debut = new Date();
		this.date_debut.setDate(jd1);
		this.date_debut.setMonth(md1-1);
		this.date_debut.setFullYear(yd1);
		this.date_fin = new Date();
		this.date_fin.setDate(jd2);
		this.date_fin.setMonth(md2-1);
		this.date_fin.setFullYear(yd2);
		this.nombre_mois = Math.round((this.date_fin-this.date_debut)/(24*60*60*30.5*1000));
		this.nombre_jours = Math.round((this.date_fin-this.date_debut)/(24*60*60*1000));
		this.nombre_jours_vus = this.nombre_jours;
		this.nombre_jours_vus_dest = this.nombre_jours_vus;
		this.premier_mois = md1-1;
		this.premier_jour = Math.round(this.date_debut/(24*60*60*1000));
		this.mois_rollover = -1;
		this.mois_select = -1;
		this.aujourdhui = Math.round(new Date()-this.date_debut)/(24*60*60*1000);
		this.premiere_annee = yd1;
	}
	
	// méthode update
	this.update = function(canvas, consignes, articles_blog, articles_evenement, x, y, mousedown, couleur_blog){
		//if (g_action == true) log(g_action);
		if ((g_action == true)||(this.frame == -1))
		{
			// calcul ratio zoom
				var ratio = this.largeur/this.nombre_jours_vus;
			
			// calcul precalcul zoom + position
				this.largeur_mois = Math.round(this.largeur/this.nombre_mois)*(this.nombre_jours/this.nombre_jours_vus);
				this.dzoom = (this.nombre_jours_vus_dest-this.nombre_jours_vus)/10;
				this.nombre_jours_vus += this.dzoom;
				this.dx = (this.x_dest-this.x)/10;
				this.x += this.dx;
				this.xx = this.x*ratio;
				this.dy = (this.y_dest-this.y)/10;
				this.y += this.dy;
				this.yy = this.y;
				
			// image de fond
				if (this.image_fond.src){
					this.div_base_context.drawImage(this.image_fond, 0, 0, this.largeur, this.hauteur);
				}else{
					this.div_base_context.fillStyle = this.couleur_fond;
					this.div_base_context.fillRect(0, 0, this.largeur, this.hauteur);
				}
			
			// zone interactive barre mois
				this.x_barre = 0;
				this.largeur_barre = (this.nombre_jours_vus)*this.largeur;
				//this.div_mois_context.fillRect(this.xx+this.mois_select*this.xx, this.hauteur-20, this.largeur_mois, 20);				
				this.div_mois_context.fillRect(0, 0, this.largeur_barre, 20);
			
				if (this.mois_select >= 0){
					this.div_mois_context.fillStyle = this.couleur_1erplan2;
					this.div_mois_context.fillRect(this.xx+this.mois_select*this.xx, this.hauteur-20, this.largeur_mois, 20);
				}
				this.div_mois_context.fillStyle = this.couleur_1erplan2;
				this.mois_rollover = -1;
				if (y > this.hauteur-40){
					this.div_mois.style.cursor = "pointer";
					this.mois_rollover = Math.round((x-this.xx-(this.largeur_mois/2))/this.largeur_mois);
					if (this.mois_rollover >= 0 && this.mois_rollover < this.nombre_mois){
						this.div_mois_context.fillRect(this.mois_rollover*this.largeur_mois+this.xx, this.hauteur-20, this.largeur_mois, 20);
					}
				}

			// fond : lignes + mois
				var mois = this.premier_mois;
				var annee = this.premiere_annee;

				for (i=0;i<this.nombre_mois;i++){
					var x = this.largeur_mois*i;
					if (mois == 0){
						var texte = g_nom_mois[mois]+" "+annee+" ";
						if (this.mois_select == -1){
							texte += "+";
						}else{
							texte += "-";
						}
						this.div_base_context.fillText(texte, x+this.xx+this.largeur_mois/2-28, this.hauteur-15);
					}else{
						var texte = g_nom_mois[mois]+" ";
						if (this.mois_select == -1){
							texte += "+";
						}else{
							texte += "-";
						}
						this.div_base_context.fillText(texte, x+this.xx+this.largeur_mois/2-14, this.hauteur-15);
					}
					if (i > 0){
						this.drawline(this.div_base_context, x+this.xx, 0, x+this.xx, this.hauteur);
					}
					mois++;
					if (mois >= 12){
						annee++;
						mois = 0;
					}
				}
			// repère aujourdhui
				/*var my_gradient = this.div_base_context.createLinearGradient(0, 0, 0, this.hauteur-20); 
				my_gradient.addColorStop(1, couleur_blog);
				my_gradient.addColorStop(0.9, "#eee");
				my_gradient.addColorStop(0.4, "#fff");					
				my_gradient.addColorStop(0.5, "#fff");
				my_gradient.addColorStop(0.6, "#fff");			
				my_gradient.addColorStop(0.08, "#eee");
				my_gradient.addColorStop(0, couleur_blog);
				this.div_base_context.fillStyle = my_gradient;
				//this.div_base_context.fillStyle= "#fff";
				this.div_base_context.fillRect(this.xx+(this.aujourdhui*ratio), 0, 1, this.hauteur-20);
				if (this.frame < this.fps/4){
					//this.div_base_context.fillRect(this.xx+(this.aujourdhui*ratio), 0, 1, this.hauteur-40);
				}*/

			// update les articles du blog
				for (i=0;i<articles_blog.length;i++){
					articles_blog[i].div_base.style.left = this.xx+articles_blog[i].x*ratio + "px";
					articles_blog[i].div_base.style.top = this.yy+articles_blog[i].y + "px";
				}
			// update les articles d'événement
				for (i=0;i<articles_evenement.length;i++){
					articles_evenement[i].div_base.style.left = this.xx+articles_evenement[i].x*ratio + "px";
					articles_evenement[i].div_base.style.top = this.yy+articles_evenement[i].y + "px";
				}
			// update les consignes
				for (i=0;i<consignes.length;i++){
					consignes[i].div_base.style.left = this.xx+consignes[i].x*ratio + "px";
					//log (this.yy);
					consignes[i].div_base.style.top = this.yy+consignes[i].y + "px";
					//Connecteurs JsPlumb
						//jsPlumb.connect({source:"consigne"+consignes[i].id, target:"canvas_mois", anchors:["BottomCenter", [ 1/i, 1, 0, 1 ]]});					
				}
			
		}
		
		// frame
			this.frame++;
			if (this.frame > this.fps/2){
				this.frame = 0;
			}
			
	}
	
	// méthode changezoompos
	this.changezoompos = function(nombre_jours_vus_dest, x_dest, y_dest){
		activate_action();
		this.nombre_jours_vus_dest = nombre_jours_vus_dest;
		this.x_dest = x_dest/(this.largeur/(this.nombre_jours_vus_dest-this.nombre_jours_vus));
		this.y_dest = y_dest;
	}
	
	// méthode changepos
	this.changepos = function(nombre_jours_vus_dest, x_dest, y_dest){
		activate_action();
		this.mois_select = Math.round(((this.largeur_mois/2))/this.largeur_mois)-1;
		this.nombre_jours_vus_dest = nombre_jours_vus_dest;
		this.x_dest = x_dest;
		this.y_dest = y_dest;
	}

	// méthode changevoittout
		this.changevoittout = function(consignes, articles_blog, articles_evenement){
			this.changezoompos(this.nombre_jours, 0, 0);
			this.mois_select = -1;
			this.mois_rollover = -1;
			// dé-fade toutes les consignes
			for (i=0; i<consignes.length;i++){
				consignes[i].montre_questionscommentaires();
				//consignes[i].div_titre.removeAttribute("onClick");
				//consignes[i].div_titre.setAttribute("onClick","consigne_ouvre("+consignes[i].numero+");");
				//consignes[i].div_titre.innerHTML = "<div onMouseOut=\"this.style.color='"+this.couleur_base_texte+"';\" onMouseOver=\"this.style.color='"+this.couleur_1erplan3+"';\" style='white-space:nowrap;' onClick=\"consigne_ouvre("+consignes[i].numero+");\"><font style='font-size:"+consignes[i].taille_titre+"px;line-height:"+(consignes[i].taille_titre-2)+"px;'><b>"+consignes[i].titre+"</b></font><font style='font-size:10px;'><br/>"+consignes[i].date_texte+"</font></div>";
				consignes[i].div_base.style.opacity = "1";
				//consignes[i].div_home.style.visibility = "hidden";
				consignes[i].div_reponse_plus.style.visibility = "hidden";
				consignes[i].select = false;
				consignes[i].div_base.style.cursor = "pointer";
				for (j=0; j<consignes[i].reponses.length;j++){
					consignes[i].reponses[j].div_base.style.visibility = "hidden";
				}
			}
			// affiche tous les articles de blog
				for (i=0; i<articles_blog.length;i++){
					$(articles_blog[i].div_base).fadeIn(3000);
					//articles_blog[i].div_base.style.visibility = "visible";
			}
			// affiche tous les articles d'événement
				for (i=0; i<articles_evenement.length;i++){
					$(articles_evenement[i].div_base).fadeIn(3000);
					//articles_evenement[i].div_base.style.visibility = "visible";
			}
			//show_buttons();
		}
	
	// méthode drawline
		this.drawline = function(context, from_x, from_y, dest_x, dest_y){
			context.beginPath();
			context.moveTo(from_x, from_y);
			context.lineTo(dest_x, dest_y);
			context.closePath();
			context.stroke();
		}

	// méthode click
		this.click = function(x, y, consignes, articles_blog, articles_evenement){
			//alert (y);
			if (y <= this.hauteur){
				// barre des mois
				if (y > this.hauteur-40 ){
					if (this.mois_select == -1){
						this.mois_select = Math.round((x-2+(this.largeur_mois/2))/this.largeur_mois)-1;
						if (this.mois_select < this.nombre_mois/2){
							this.changezoompos(90, (this.mois_select*this.largeur_mois), 0);
						}else{
							this.changezoompos(90, ((this.mois_select+1)*this.largeur_mois), 0);
						}
					}else{
						this.changevoittout(consignes, articles_blog, articles_evenement);
					}
				}
			}
			}
	
}
