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
	var url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_agora, url_popup_classes, url_popup_chat, url_popup_chat2;
	var div_base, div_barre, div_base_context, div_mois;
	
	// méthode init
	this.init = function(canvas, largeur, hauteur, fps, date_debut, date_fin, couleur_fond, couleur_base_texte, couleur_1erplan1, couleur_1erplan2, couleur_1erplan3, image_fond, zoom_consignes, liste_y_consignes, liste_y_blogs, liste_y_evenements, url_popup_consigne, url_popup_reponse, url_popup_reponseajout, url_popup_blog, url_popup_evenement, url_popup_ressources, url_popup_agora, url_popup_classes, url_popup_chat, url_popup_chat2){
			this.x = 0;
			this.xx = 0;
			this.dzoom = 0;
			this.x_dest = 0;
			this.dx = 0;
			this.y = 0;
			this.yy = 0;
			this.y_dest = 0;
			this.dy = 0;
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
		// Canvas général
			this.image_fond = new Image();
			if (image_fond.length > 1){
				this.image_fond.src = image_fond;
			}
			this.div_base = document.createElement("canvas");
			this.div_base.setAttribute("id","canvas_projet");

		//	Tailles		
			this.largeur = largeur;
			this.hauteur = hauteur;
			this.div_base.width = largeur;
			this.div_base.height = hauteur;			
			//resizenow();

		// Canvas
			canvas.appendChild(this.div_base);

		//Contexte de rendu générique
			this.div_base_context = this.div_base.getContext("2d");			
			this.div_base_context.font = "10px sans-serif";
	 		this.div_base_context.textBaseline = "top";
			this.div_base_context.lineWidth = 0.5;
			this.div_base_context.strokeStyle = this.couleur_1erplan1;

		// urls
			this.url_popup_consigne = url_popup_consigne;
			this.url_popup_reponse = url_popup_reponse;
			this.url_popup_reponseajout = url_popup_reponseajout;
			this.url_popup_blog = url_popup_blog;
			this.url_popup_evenement = url_popup_evenement;
			this.url_popup_ressources = url_popup_ressources;
			this.url_popup_agora = url_popup_agora;
			this.url_popup_classes = url_popup_classes;		
			this.url_popup_chat	= url_popup_chat;
			this.url_popup_chat2 = url_popup_chat2;
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
		//Initialisation de certains affichages - type document.ready
			if (this.frame == -1)
			{
				for (i=0;i<consignes.length;i++){
					consignes[i].largeur = $(consignes[i].div_base).outerWidth();
					consignes[i].hauteur = $(consignes[i].div_base).outerHeight();
					if (consignes[i].div_reponse_plus.style.visibility == 'visible')
					{
						consignes[i].div_reponse_plus.style.left = consignes[i].largeur+10+"px";
						//consignes[i].div_home.style.left = consignes[i].largeur+55+"px";
					}
					//else consignes[i].div_home.style.left = consignes[i].largeur+10+"px";
					for (j=0; j<consignes[i].reponses.length;j++){
						consignes[i].reponses[j].hauteur = $(consignes[i].reponses[j].div_base).outerHeight();
					}
				}
			}
			
		//Every frame if g_action
			if ((g_action == true)||(g_action_mois == true)||(this.frame == -1))
			{
				// calcul ratio zoom
					var ratio = this.largeur/this.nombre_jours_vus;
				// prépare rendu
					this.div_base.style.cursor = "default";

					this.div_base_context.drawImage(this.image_fond, 0, 0, this.largeur, this.hauteur);

					/*
					if (this.image_fond.src){
						this.div_base_context.drawImage(this.image_fond, 0, 0, this.largeur, this.hauteur);
					}
					else{
						this.div_base_context.fillStyle = this.couleur_fond;
						this.div_base_context.fillRect(0, 0, this.largeur, this.hauteur);
					}
					*/
		 		
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

				// zone interactive barre mois
					this.div_base_context.fillStyle = "#eee";
					this.x_barre = 0;
					this.largeur_barre = (this.nombre_jours_vus)*this.largeur;
					this.div_base_context.fillRect(this.x_barre, this.hauteur-44, this.largeur_barre, 20);

					if (this.mois_select >= 0){
						this.div_base_context.fillStyle = this.couleur_1erplan2;
						this.div_base_context.fillRect(this.xx+this.mois_select*this.xx, this.hauteur-44, this.largeur_mois, 20);
					}
					this.div_base_context.fillStyle = this.couleur_1erplan2;
					this.mois_rollover = -1;

					if ((y > this.hauteur-30)&&(y < this.hauteur)){
						this.div_base.style.cursor = "pointer";
						this.mois_rollover = Math.round((x-this.xx-(this.largeur_mois/2))/this.largeur_mois);
						if (this.mois_rollover >= 0 && this.mois_rollover < this.nombre_mois){
							this.div_base_context.fillRect(this.mois_rollover*this.largeur_mois+this.xx, this.hauteur-44, this.largeur_mois, 20);
						}
					}

				// fond : lignes + mois
					var mois = this.premier_mois;
					var annee = this.premiere_annee;
					this.div_base_context.fillStyle = this.couleur_1erplan1;
					for (i=0;i<this.nombre_mois;i++){
						this.div_base_context.fillStyle = this.couleur_1erplan1;				
						var x = this.largeur_mois*i;
						if (mois == 0){
							var texte = g_nom_mois[mois]+" "+annee+" ";
							if (this.mois_select == -1){
								texte += "+";
							}else{
								texte += "-";
							}
							this.div_base_context.fillText(texte, x+this.xx+this.largeur_mois/2-28, this.hauteur-42);
						}else{
							var texte = g_nom_mois[mois]+" ";
							if (this.mois_select == -1){
								texte += "+";
							}else{
								texte += "-";
							}
							this.div_base_context.fillText(texte, x+this.xx+this.largeur_mois/2-14, this.hauteur-42);
						}
						if (i > 0){
							this.drawline(this.div_base_context, x+this.xx, 0, x+this.xx, this.hauteur, "#eee", 0.5);
						}
						mois++;
						if (mois >= 12){
							annee++;
							mois = 0;
						}
					}

				// repère aujourdhui
					//this.drawline(this.div_base_context, this.xx+(this.aujourdhui*ratio), this.hauteur-40, this.xx+(this.aujourdhui*ratio), this.hauteur-20, "#fff", 0.5);

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
						//Maj tailles et position
							consignes[i].div_base.style.left = this.xx+consignes[i].x*ratio + "px";
							consignes[i].div_base.style.top = this.yy+consignes[i].y + "px";
						//Connecteurs
							this.get_x_date(consignes[i].date);
							var color = $('#consigne'+consignes[i].id).css('background-color');
							var opacity = $(consignes[i].div_base).css('opacity');
							this.drawline(this.div_base_context, this.xx+(this.x_date*ratio)-8, this.hauteur-44, this.xx+consignes[i].x*ratio, this.yy+consignes[i].y+consignes[i].hauteur, color, '3', opacity);
						//réponses si consigne ouverte
							if (consignes[i].select == true)
								for (j=0; j<consignes[i].reponses.length;j++){
									//$(this.reponses[j].div_base).fadeTo(0,0).fadeTo(2000,1).css('visibility','visible');
									var color = $('#reponse'+consignes[i].reponses[j].id).css('background-color');
									var opacity = $(consignes[i].reponses[j].div_base).css('opacity');
									this.drawline(this.div_base_context, this.xx+consignes[i].x*ratio+consignes[i].largeur, this.yy+consignes[i].y, this.xx+consignes[i].x*ratio+consignes[i].reponses[j].x, this.yy+consignes[i].y-(consignes[i].reponses[j].y*g_projet.hauteur)+consignes[i].reponses[j].hauteur, color, '1.5', opacity);
								}
					}
		// frame
			this.frame++;
			//log(this.frame);
			if (this.frame > this.fps*10)
			{
				stop_action ();
			}
		}
	
	}

	// méthode get_x_date
	this.get_x_date = function(date_abs){
		var date = new Date();
		date.setDate(parseFloat(date_abs.substring(0, 2)));
		date.setMonth(parseFloat(date_abs.substring(3, 5))-1);
		date.setFullYear(parseFloat(date_abs.substring(6, 10)));
		this.x_date = Math.round((date-this.date_debut)/(24*60*60*1000));
	}

	// méthode changezoompos
	this.changezoompos = function(nombre_jours_vus_dest, x_dest, y_dest){
		g_action = true;
		g_projet.frame = 0;
		this.nombre_jours_vus_dest = nombre_jours_vus_dest;
		this.x_dest = x_dest/(this.largeur/(this.nombre_jours_vus_dest-this.nombre_jours_vus));
		this.y_dest = y_dest;
	}
	
	// méthode changepos
	this.changepos = function(nombre_jours_vus_dest, x_dest, y_dest){
		g_action = true;
		g_projet.frame = 0;			
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
				//consignes[i].div_titre.removeAttribute("onClick");
				//consignes[i].div_titre.setAttribute("onClick","consigne_ouvre("+consignes[i].numero+");");
				//consignes[i].div_titre.innerHTML = "<div onMouseOut=\"this.style.color='"+this.couleur_base_texte+"';\" onMouseOver=\"this.style.color='"+this.couleur_1erplan3+"';\" style='white-space:nowrap;' onClick=\"consigne_ouvre("+consignes[i].numero+");\"><font style='font-size:"+consignes[i].taille_titre+"px;line-height:"+(consignes[i].taille_titre-2)+"px;'><b>"+consignes[i].titre+"</b></font><font style='font-size:10px;'><br/>"+consignes[i].date_texte+"</font></div>";
				//consignes[i].div_home.style.visibility = "hidden";
				//consignes[i].div_reponse_plus.style.visibility = "hidden";
				$(consignes[i].div_base).stop(true).fadeTo(0,1).css('visibility','visible');
				for (j=0; j<consignes[i].reponses.length;j++){
					$(consignes[i].reponses[j].div_base).stop(true).fadeTo(0,0).css('visibility','hidden');
				}
				consignes[i].montre_questionscommentaires();
				consignes[i].div_base.style.cursor = "pointer";
				consignes[i].select = false;
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
		this.drawline = function(context, from_x, from_y, dest_x, dest_y, color, width, opacity){
			rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			if (opacity != undefined)	color = "rgba("+rgb[1]+", "+rgb[2]+", "+rgb[3]+", " + opacity + ")";
			if (width != undefined) context.lineWidth = width;
			if (color != undefined) context.fillStyle = color;
			if ((width > 1)&&(color != undefined)) context.strokeStyle = color; else context.strokeStyle = this.couleur_1erplan1;
			//if (opacity != undefined)	log (color);
			context.beginPath();
			context.moveTo(from_x, from_y);
			context.lineTo(dest_x, dest_y);
			context.closePath();
			context.stroke();
		}

	// méthode click
		this.click = function(x, y, consignes, articles_blog, articles_evenement){
			//alert (y);
		if (y > this.hauteur-40 ){

			if (y <= this.hauteur){
				// un mois est actif
				if (this.mois_select != -1)
				{	
					this.changevoittout(consignes, articles_blog, articles_evenement);
				}
				else
					if (y > this.hauteur-40 ){
						this.mois_select = Math.round((x-2+(this.largeur_mois/2))/this.largeur_mois)-1;
						if (this.mois_select < this.nombre_mois/2){
							this.changezoompos(90, (this.mois_select*this.largeur_mois), 0);
						}else{
							this.changezoompos(90, ((this.mois_select+1)*this.largeur_mois), 0);
						}
					}
			}

		}			
		}
}
