/**
 * Génère une consigne.
 *
 * @constructor
 */
 
function Consigne(){
  
  /**
   * Initialise la consigne.
   *
   * @param {Object} data - Données à affecter à l'instance
   */
  
  this.init = function(data) {
    this.data                         = data;
		this.id                           = this.data.id;
		this.intervenant_id               = this.data.intervenant_id;
		this.numero                       = this.data.numero;
		this.titre                        = this.data.titre;
		this.date                         = this.data.date;
		this.nombre_reponses              = this.data.nombre_reponses;
		this.reponses_id                  = this.data.reponses;
		this.nombre_commentaires          = this.data.nombre_commentaires;
		this.nombre_jours                 = this.data.nombre_jours;
		this.x                            = this.data.nombre_jours;		
		this.y                            = this.data.y; // Entre 0 et 1
		this.image                        = this.data.image;
		this.select                       = false;
		this.date_texte                   = this.data.date_texte.substring(0, 2) + " " 
		                                    + CCN.nomMois[parseFloat(this.data.date_texte.substring(3, 5))-1] + " " 
		                                    + this.data.date_texte.substring(6, 10);
		this.taille_titre                 = 9+12*CCN.projet.zoom_consignes/(0.3*this.data.nombre_reponses+1);
		this.reponses                     = [];
		this.intervenant_nom              = '';
		this.nombre_jours_max             = this.data.nombre_jours_max;

		for (k = 0; k < this.data.intervenants.length; k++){
			if (this.data.intervenant_id == this.data.intervenants[k].id){
				this.intervenant_nom = this.data.intervenants[k].nom;
			}
		}
		
		if (this.nombre_jours_max <= 0){
			this.nombre_jours_max = data.nombre_jours;
		}
    
    this.initDOM();
  }


  /**
   * Crée l'élément DOM et l'intègre dans la timeline.
   */   
 
  this.initDOM = function() {
		var coul = ""+this.data.intervenant_id+"";
		    coul = coul.substr(coul.length-1,1);
		
		this.div_titre = $('<div/>')
		  .attr('id','consigne'+this.id)
		  .attr('class','consigne couleur_texte_consignes couleur_consignes'+coul)
		  .attr('data-id',this.id)
		  .attr('data-index',this.numero);
    
    this.div_base = $('<div/>')
      .attr('id','consigne_haute'+this.id)
      .attr('class','timeline_item consigne_haute')
      .css({
        'top'   : (this.y*100)+'%',
        'left'  : (this.x/CCN.projet.nombre_jours*100)+'%'
      });
    
    var reponses_puces = '';
		
		for (var j = 1;j <= this.data.nombre_reponses;j++) {
  		if (j <= this.data.classes.length) {
    		var couleur = this.reponses_id[j-1].substr(this.reponses_id[j-1].length-1);
  		  reponses_puces += '<div class="reponse_puce couleur_travail_en_cours'+couleur+'"></div>';
  		}
		}
		
		for (var j = 1;j <= this.data.classes.length-this.data.nombre_reponses;j++) {
  		reponses_puces += '<div class="reponse_puce disabled"></div>';
		}
				
		this.div_titre.html("<div class=\"picto_nombre_commentaires\">"+this.data.nombre_commentaires+"</div> "+
                  			"<div class=\"photo\"><img src=\""+this.data.image+"\" /></div> "+
                  			"<div class=\"texte\">"+
                    			"<div class=\"titre\" style=\"font-size:"+this.taille_titre+"px;line-height:"+(this.taille_titre-2)+"px;\">"+this.titre+"</div> "+
                    			"<div class=\"auteur_date\">"+this.intervenant_nom+"<!-- - "+this.date_texte+"-->"+
                    			  "<div class=\"picto_nombre_reponses\">"+reponses_puces+"</div>"+
                    			"</div> "+
                  			"</div>"+
                  			"<div class=\"nettoyeur\"></div>");
			
		this.div_base.append(this.div_titre);	

	  // Calcul des tailles des consignes
	  
		this.largeur = $(this.div_base).outerWidth();
		this.hauteur = $(this.div_base).outerHeight();
		
    // Préparation bouton réponse plus (crayon)
	
		this.div_reponse_plus = $("<div class='bouton_reponse_consigne' onclick='createReponse("+this.id+","+CCN.idRestreint+","+this.numero+");'><img src='"+CCN.urlRoot+"img/reponse_plus.png' title='Répondre à la consigne'> Répondre à la consigne</div>");
	
		this.div_reponse_see = $("<div class='bouton_reponse_consigne'><img src='"+CCN.urlRoot+"img/reponse_plus.png' title='Accéder à ma réponse'> Accéder à ma réponse</div>"); 
		
		this.div_base.append(this.div_reponse_plus);
		this.div_base.append(this.div_reponse_see);
    
    CCN.timelineLayerConsignes.prepend(this.div_base);
		
		var _thisId = this.id;
		var _thisIdObjet = this.id;
		
		this.div_titre.on('click', function(){
  		callConsigne(_thisId);
		});
		
     // Draggable (admin)
	
		if (CCN.admin==0) {
			$(this.div_base).draggable({
				axis: "y" ,
				start: function(event,ui){
				  $(this).addClass('no_event');
				},
				drag: function(event,ui) {
  			  updateConnecteurs();	
				},
				
				stop: function(event,ui) {
  				yy = (ui.offset.top-CCN.projet.timeline.offset().top)/CCN.projet.timeline.height();
					
					$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:_thisIdObjet, type_objet:"article", X:0, Y:yy } );
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
		if ((CCN.idRestreint > 0)
		  &&(CCN.typeRestreint != '')
		  &&(CCN.typeRestreint == 'travail_en_cours')){
			  this.div_reponse_plus.addClass('show');
		}
	}

  /**
   * Affiche le bouton <tt>Consulter ma réponse</tt>.
   *
   * @param {Number} answerId - Id de la réponse de la classe courante
   *
   * @see loadConsignes
   */   
 
  this.showMyReponseButtonInTimeline = function(answerId){
		if ((CCN.idRestreint > 0)
		  &&(CCN.typeRestreint != '')
		  &&(CCN.typeRestreint == 'travail_en_cours')){
			  this.div_reponse_see.on('click', function(){
  			  callReponse(answerId);
  		  }).addClass('show');
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
   * @see showConsigneInTimeline
   * @see callConsigne
   *
   * @todo *1 : Vérifier
   * @todo *2 : Vérifier
   * @todo *3 : Améliorer l'arrêt du <tt>clearInterval</tt>
   */
   
  this.showInTimeline = function() {
	  
	  CCN.projet.setIntervalConnecteurs = setInterval(function(){
  	  updateConnecteurs();
	  },1);
  		
		$('.connecteur_timeline').addClass('hide');
		$('.connecteur_timeline[data-consigne-id="'+this.id+'"]').removeClass('hide');
		
		var y_dest = 0;
		
		this.hideConsignePastille();	
		
		CCN.projet.showRangeOfTimeline(this.nombre_jours_max, this.x-3, y_dest);
		
		$('.consigne_haute').not('#consigne_haute'+this.id).addClass('hide');
		$('.reponse_haute').not('.reponse_haute_consigne_parent'+this.id).addClass('hide');
    
    // On ouvre les réponses
		
		$('#consigne_haute'+this.id).removeClass('hide');
		$('.reponse_haute_consigne_parent'+this.id).removeClass('hide');
		
    // (TODO*1) Cache les articles de blog
	
		for (i=0; i<CCN.articlesBlog.length;i++){
			$(CCN.articlesBlog[i].div_base).hide();
		}
    
    // (TODO*2) Cache les articles d'événement
		
		for (i=0; i<CCN.articlesEvenement.length;i++){
			$(CCN.articlesEvenement[i].div_base).hide();
		}
		
		// (TODO*3) Interrompre le clearInterval

		setTimeout(function(){
  		clearInterval(CCN.projet.setIntervalConnecteurs);
		},2300);
		
		this.select = true;
	}
}

