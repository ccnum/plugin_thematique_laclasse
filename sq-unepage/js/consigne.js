/**
 * Génère une consigne.
 *
 * @constructor
 */
 
function consigne(){

	// Membres
	
	var id, numero, titre, date, date_texte, nombre_reponses, nombre_commentaires, x, y, largeur, hauteur, select, taille_titre;
	var div_base, div_titre, div_home, div_reponse_plus, div_reponses, div_reponses_classe;
	var reponses;
	var nombre_jours_max;
	var nombre_jours;

	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE init()
   *
   */
 
  this.init = function(projet, canvas, numero, id, titre, date, nombre_jours, nombre_jours_max, nombre_reponses, nombre_commentaires, y, image, intervenant_id, classes, intervenants){
		this.id = id;
		this.intervenant_id = intervenant_id;
		this.numero = numero;
		this.titre = titre;
		this.date = date;
		this.nombre_reponses = nombre_reponses;
		this.nombre_commentaires = nombre_commentaires;
		this.nombre_jours = nombre_jours;
		this.x = nombre_jours;
		this.nombre_jours_max = nombre_jours_max;
		if (this.nombre_jours_max <= 0){
			this.nombre_jours_max = nombre_jours;
		}
		
		this.y = y; // Entre 0 et 1
		this.image = image;
		this.select = false;

    // Base
    			
		this.div_base = document.createElement("div");
		this.div_base.setAttribute('class','timeline_item consigne_haute');
		this.div_base.setAttribute('id','consigne_haute'+this.id);
		this.div_base.style.position = "absolute";			
		this.div_base.style.left = (this.x/g_projet.nombre_jours*100)+'%';
		this.div_base.style.top = (this.y*100)+"%";

    g_projet.timeline.append(this.div_base);

		for (k = 0; k < intervenants.length; k++){
			if (intervenant_id == intervenants[k].id){
				var nom_intervenant = intervenants[k].nom;
			}
		}

    // Titre
	
		this.date_texte = date.substring(0, 2) + " " + g_nom_mois[parseFloat(date.substring(3, 5))-1] + " " + date.substring(6, 10);
		this.div_titre = document.createElement("div");
		this.div_titre.setAttribute("onClick","consigne_click("+this.id+")");
		this.div_titre.setAttribute("id","consigne"+this.id);
		this.div_titre.setAttribute("data-id",this.id);
		this.div_titre.setAttribute("data-index",this.numero);
		var coul = ""+intervenant_id+"";
		var coul = coul.substr(coul.length-1,1);			
		this.div_titre.setAttribute("class","consigne couleur_texte_consignes couleur_consignes"+coul);

		this.taille_titre = 9+12*projet.zoom_consignes/(0.3*nombre_reponses+1);
		
		var reponses_puces = '';
		
		for (var j = 1;j <= nombre_reponses;j++) {
  		reponses_puces += '<div class="reponse_puce"></div>';
		}
		
		for (var j = 1;j <= classes.length-nombre_reponses;j++) {
  		reponses_puces += '<div class="reponse_puce disabled"></div>';
		}
				
		this.div_titre.innerHTML  = "<div class=\"picto_nombre_commentaires\">"+nombre_commentaires+"</div> "+
			"<div class=\"photo\"><img src=\""+image+"\" /></div> "+
			"<div class=\"texte\">"+
			"<div class=\"titre\" style=\"font-size:"+this.taille_titre+"px;line-height:"+(this.taille_titre-2)+"px;\">"+this.titre+"</div> "+
			"<div class=\"auteur_date\">"+nom_intervenant+"<!-- - "+this.date_texte+"-->"+
			"<div class=\"picto_nombre_reponses\">"+reponses_puces+"</div>"+
			"</div> "+
			"</div>"+
			"<div class=\"nettoyeur\"></div> ";
			
		this.div_base.appendChild(this.div_titre);	

	  // Calcul des tailles des consignes
	  
		this.largeur = $(this.div_base).outerWidth();
		this.hauteur = $(this.div_base).outerHeight();
		
    // Préparation bouton réponse plus (crayon)
	
		this.div_reponse_plus = document.createElement("div");
		this.div_reponse_plus.innerHTML = "<div class='bouton_reponse_consigne' onClick='ajoutreponse_click("+this.id+","+g_u_id_restreint+","+this.numero+");'><img src='"+g_u_chemin+"img/reponse_plus.png' title='Répondre à la consigne' > Répondre à la consigne</div>"; // TODO : Répondre > puis > Modifier ma réponse (voir le TO SEE de main.js)
		
		/*
		this.div_reponse_plus.style.position = "absolute";
		this.div_reponse_plus.style.visibility = "hidden";
		this.div_reponse_plus.style.cursor = "pointer";
		this.div_reponse_plus.left = (this.largeur+10)+"px";
		this.div_reponse_plus.style.top = (this.hauteur-25)+"px";
    */
		
		this.div_base.appendChild(this.div_reponse_plus);

    // Prépare le tableau de réponse
		
		this.reponses = [];

    // Draggable (admin)
	
		if (g_u_admin==0) {
			$(this.div_base).draggable({
				axis: "y" ,
				start: function(event,ui){
				//	$(this).removeAttr("onClick");
				  $(this).addClass('no_event');
				},
				drag: function(event,ui) {
  			  update_connecteurs();	
				},
				
				stop: function(event,ui) {
  				yy = (ui.offset.top-g_projet.timeline.offset().top)/g_projet.timeline.height();
					
					$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:id, type_objet:"article", X:0, Y:yy } );
				  $(this).removeClass('no_event');
					
					this.y = yy;
					
					$(this).css({'top':(yy*100)+'%'});
				}
			});
		}
  }
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE ajouter_reponse_plus()
   *
   *  Bouton répondre à la consigne
   *
   */
 
  this.ajouter_reponse_plus = function(){
		if ((g_u_id_restreint > 0)
		  &&(g_u_type_restreint != '')
		  &&(g_u_type_restreint == 'travail_en_cours')){
			  this.div_reponse_plus.style.visibility = "visible";
        //this.div_home.style.left = this.largeur+50+"px";
		}
	}
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE ajoutereponseclasse()
   *
   */
 
  this.ajoutereponseclasse = function(nombre_reponses, nombre_commentaires){
	}
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE ajoutereponse()
   *
   */
 
  this.ajoutereponse = function(reponse){
		this.reponses.push(reponse);
  }
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE montre_questionscommentaires()
   *
   */
   
	this.montre_questionscommentaires = function(){
		$("#consigne"+this.id+" .picto_nombre_commentaires").fadeIn('slow');
	//	$("#consigne"+this.id+" .picto_nombre_reponses").fadeIn('slow');
		//$(this.div_titre).fadeIn('slow');
		//$(this.div_titre).fadeIn('slow');
	}
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE cache_questionscommentaires()
   *
   */
 
  this.cache_questionscommentaires = function(){
		$("#consigne"+this.id+" .picto_nombre_commentaires").fadeOut('slow');
	//	$("#consigne"+this.id+" .picto_nombre_reponses").fadeOut('slow');
		//$(this.div_reponses_classe).fadeOut('slow');
		//$(this.div_commentaires_classe).fadeOut('slow');
	}
	
  /* * * * * * * * * * * * * * * * * * * * * * * *
   *  
   *  MÉTHODE ferme()
   *
   */
   
	this.ferme = function(projet, consignes, articles_blog, articles_evenement){
		
		console.log('methode : consigne.ferme()');
		
		projet.changevoittout(consignes, articles_blog, articles_evenement);
		this.montre_questionscommentaires();
		this.select = false;
	}

  /**
   * Affiche la consigne et les réponses associées.
   *
   * @param {Object} projet - Projet global de la CCN
   * @param {string[]} consignes - Liste des consignes
   * @param {string[]} articles_blog - Liste des articles de blog
   * @param {string[]} articles_evenements - Liste des événements
   *
   * @see consigne_ouvre
   * @see consigne_click
   */
   
  this.ouvre = function(projet, consignes, articles_blog, articles_evenement){

  //  deprecated
	//	var y_dest = (projet.hauteur-this.hauteur-50)-this.y; 
	
	  projet.setIntervalConnecteurs = setInterval(function(){
  	  update_connecteurs();
	  },1);
	  
	  
		var consigne_id = this.id;
  		
		$('.connecteur_timeline').addClass('hide');
		$('.connecteur_timeline[data-consigne-id="'+consigne_id+'"]').removeClass('hide');
		
		var y_dest = 0;
		
		this.cache_questionscommentaires();	
		
		projet.changepos(this.nombre_jours_max, this.x-3, y_dest);
		
		$('.consigne_haute').not('#consigne_haute'+this.id).addClass('hide');
		$('.reponse_haute').not('.reponse_haute_consigne_parent'+this.id).addClass('hide');
    
    // On ouvre les réponses
		
		$('#consigne_haute'+this.id).removeClass('hide');
		$('.reponse_haute_consigne_parent'+this.id).removeClass('hide');
		
		this.div_titre.removeAttribute("onClick");
		this.div_titre.setAttribute("onClick","consigne_click("+this.id+");");
		
    // Cache les articles de blog (TO DO)
	
		for (i=0; i<articles_blog.length;i++){
			//$(articles_blog[i].div_base).fadeOut('normal');
			$(articles_blog[i].div_base).hide();
		}
    
    // Cache les articles d'événement (TO DO)
		
		for (i=0; i<articles_evenement.length;i++){
			//$(articles_evenement[i].div_base).fadeOut('normal');
			$(articles_evenement[i].div_base).hide();
		}
		
		
		// TO DO : mieux
		
		setTimeout(function(){
  	//	update_connecteurs();
  		
  		clearInterval(projet.setIntervalConnecteurs);
		},2300);
		
		stop_action();
	//	consigne_click(this.id);
		this.select = true;
	}
}

