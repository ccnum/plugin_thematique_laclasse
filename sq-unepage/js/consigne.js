/**
 * Génère une consigne.
 *
 * @constructor
 */
 
function Consigne(){
	
	var id, numero, titre, date, date_texte, nombre_reponses, nombre_commentaires, x, y, largeur, hauteur, select, taille_titre;
	var div_base, div_titre, div_home, div_reponse_plus, div_reponses, div_reponses_classe;
	var reponses;
	var nombre_jours_max;
	var nombre_jours;
  
  
  /**
   * Initialise la consigne, crée l'élément DOM et l'intègre dans la timeline.
   *
   * @param {Object} data - Données à affecter à l'instance (TODO URGENT)
   */
  
  this.init = function(data) {
		this.id = data.id;
		this.intervenant_id = data.intervenant_id;
		this.numero = data.numero;
		this.titre = data.titre;
		this.date = data.date;
		this.nombre_reponses = data.nombre_reponses;
		this.nombre_commentaires = data.nombre_commentaires;
		this.nombre_jours = data.nombre_jours;
		this.x = data.nombre_jours;
		this.nombre_jours_max = data.nombre_jours_max;
		
		if (this.nombre_jours_max <= 0){
			this.nombre_jours_max = data.nombre_jours;
		}
		
		this.y = data.y; // Entre 0 et 1
		this.image = data.image;
		this.select = false;

    // Base
    			
		this.div_base = document.createElement("div");
		this.div_base.setAttribute('class','timeline_item consigne_haute');
		this.div_base.setAttribute('id','consigne_haute'+this.id);
		this.div_base.style.position = "absolute";			
		this.div_base.style.left = (this.x/g_projet.nombre_jours*100)+'%';
		this.div_base.style.top = (this.y*100)+"%";

    g_projet.timeline.append(this.div_base);

		for (k = 0; k < data.intervenants.length; k++){
			if (data.intervenant_id == data.intervenants[k].id){
				var nom_intervenant = data.intervenants[k].nom;
			}
		}

    // Titre
	
    var date = data.date_texte;
	
		this.date_texte = date.substring(0, 2) + " " + g_nom_mois[parseFloat(date.substring(3, 5))-1] + " " + date.substring(6, 10);
		this.div_titre = document.createElement("div");
		this.div_titre.setAttribute("onClick","callConsigne("+this.id+")");
		this.div_titre.setAttribute("id","consigne"+this.id);
		this.div_titre.setAttribute("data-id",this.id);
		this.div_titre.setAttribute("data-index",this.numero);
		var coul = ""+data.intervenant_id+"";
		var coul = coul.substr(coul.length-1,1);			
		this.div_titre.setAttribute("class","consigne couleur_texte_consignes couleur_consignes"+coul);

		this.taille_titre = 9+12*g_projet.zoom_consignes/(0.3*data.nombre_reponses+1);
		
		var reponses_puces = '';
		
		for (var j = 1;j <= data.nombre_reponses;j++) {
  		reponses_puces += '<div class="reponse_puce"></div>';
		}
		
		for (var j = 1;j <= data.classes.length-data.nombre_reponses;j++) {
  		reponses_puces += '<div class="reponse_puce disabled"></div>';
		}
				
		this.div_titre.innerHTML  = "<div class=\"picto_nombre_commentaires\">"+data.nombre_commentaires+"</div> "+
			"<div class=\"photo\"><img src=\""+data.image+"\" /></div> "+
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
		this.div_reponse_plus.innerHTML = "<div class='bouton_reponse_consigne' onClick='ajoutcallReponse("+this.id+","+g_u_id_restreint+","+this.numero+");'><img src='"+g_u_chemin+"img/reponse_plus.png' title='Répondre à la consigne'> Répondre à la consigne</div>"; // TODO : Répondre > puis > Modifier ma réponse (voir le TO SEE de main.js)
		
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
  			  updateConnecteurs();	
				},
				
				stop: function(event,ui) {
  				yy = (ui.offset.top-g_projet.timeline.offset().top)/g_projet.timeline.height();
					
					$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:data.id, type_objet:"article", X:0, Y:yy } );
				  $(this).removeClass('no_event');
					
					this.y = yy;
					
					$(this).css({'top':(yy*100)+'%'});
				}
			});
		}
  }


  /**
   * Affiche le bouton <tt>Répondre à la question</tt>.
   *
   * @see loadConsignes
   */   
 
  this.showNewReponseButtonInTimeline = function(){
		if ((g_u_id_restreint > 0)
		  &&(g_u_type_restreint != '')
		  &&(g_u_type_restreint == 'travail_en_cours')){
			  this.div_reponse_plus.style.visibility = "visible";
		}
	}


  /**
   * Fait apparaître le picto du nombre de commentaires d'une consigne.
   */ 
   
	this.showConsignePastille = function() {
		$("#consigne"+this.id+" .picto_nombre_commentaires").fadeIn('slow');
	}


  /**
   * Fait disparaître le picto du nombre de commentaires d'une consigne.
   */ 
 
  this.hideConsignePastille = function() {
		$("#consigne"+this.id+" .picto_nombre_commentaires").fadeOut('slow');
	}

  /**
   * Affiche la consigne et les réponses associées.
   *
   * @param {Object} projet - Projet global de la CCN
   * @param {string[]} consignes - Liste des consignes
   * @param {string[]} articles_blog - Liste des articles de blog
   * @param {string[]} articles_evenements - Liste des événements
   *
   * @see showConsigneInTimeline
   * @see callConsigne
   *
   * @todo *1 : Vérifier
   * @todo *2 : Vérifier
   * @todo *3 : Améliorer l'arrêt du <tt>clearInterval</tt>
   */
   
  this.showInTimeline = function(projet, consignes, articles_blog, articles_evenement) {
	
	  projet.setIntervalConnecteurs = setInterval(function(){
  	  updateConnecteurs();
	  },1);
	  
	  
		var consigne_id = this.id;
  		
		$('.connecteur_timeline').addClass('hide');
		$('.connecteur_timeline[data-consigne-id="'+consigne_id+'"]').removeClass('hide');
		
		var y_dest = 0;
		
		this.hideConsignePastille();	
		
		projet.showRangeOfTimeline(this.nombre_jours_max, this.x-3, y_dest);
		
		$('.consigne_haute').not('#consigne_haute'+this.id).addClass('hide');
		$('.reponse_haute').not('.reponse_haute_consigne_parent'+this.id).addClass('hide');
    
    // On ouvre les réponses
		
		$('#consigne_haute'+this.id).removeClass('hide');
		$('.reponse_haute_consigne_parent'+this.id).removeClass('hide');
		
		this.div_titre.removeAttribute("onClick");
		this.div_titre.setAttribute("onClick","callConsigne("+this.id+");");
		
    // (TODO*1) Cache les articles de blog
	
		for (i=0; i<articles_blog.length;i++){
			$(articles_blog[i].div_base).hide();
		}
    
    // (TODO*2) Cache les articles d'événement
		
		for (i=0; i<articles_evenement.length;i++){
			$(articles_evenement[i].div_base).hide();
		}
		
		// (TODO*3) Interrompre le clearInterval

		setTimeout(function(){
  		clearInterval(projet.setIntervalConnecteurs);
		},2300);
		
		stop_action();
		this.select = true;
	}
}

