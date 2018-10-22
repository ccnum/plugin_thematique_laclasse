/**
 * Génère une réponse.
 *
 * @constructor
 */
 
function Reponse() {

	// Membres
	
	var id, classe_id, titre, date, nombre_commentaires, x, y;
	var div_base, div_texte, div_commentaires, connecteur;
	
  
  /**
   * Initialise la réponse.
   *
   * @param {Object} data - Données à affecter à l'instance
   */
 
  this.init = function(data) {	
    this.data                     = data;
		this.id                       = this.data.id;
		this.classe_id                = this.data.classe_id;
		this.titre                    = this.data.titre;
		this.consigne                 = this.data.consigne;
		this.date                     = this.data.date;
		this.date_date                = this.data.date_date;
		this.nombre_commentaires      = this.data.nombre_commentaires;
		this.x                        = this.data.nombre_jours;
		this.x_absolu                 = this.data.nombre_jours+this.consigne.x; // Le bloc réponse est relatif à la position x de la consigne
		this.y                        = this.data.y;
		this.index                    = this.data.index;
		this.nom_classe               = '';
		this.connecteur;
		
		for (k = 0 ; k < this.data.classes.length ; ++k){
			if (this.classe_id == this.data.classes[k].id){
				this.nom_classe = this.data.classes[k].nom;
			}
		}

    this.initDOM();
	}


  /**
   * Crée l'élément DOM et l'intègre dans la timeline.
   */   
 
  this.initDOM = function() {
    
		var coul = ""+this.classe_id+"";
		    coul = coul.substr(coul.length-1,1);

    this.div_base = $('<div/>')
      .attr('id','reponse_haute'+this.id)
      .attr('class','timeline_item reponse_haute reponse_haute_consigne_parent'+this.consigne.id+' hide')
      .attr('data-consigne-id',this.consigne.id)
      .attr('data-reponse-id',this.id)
      .css({
        'top'   : (this.y*100)+'%',
        'left'  : (this.x_absolu/CCN.projet.nombre_jours*100)+'%'
      });
      
    var date_texte = this.date.substring(0, 2) + " " + CCN.nomMois[parseFloat(this.date.substring(3, 5))-1];
    
    this.div_texte = $('<div/>')
      .attr('id','reponse'+this.id)
      .attr('class','reponse couleur_texte_travail_en_cours couleur_travail_en_cours'+coul)
      .html("<div class=\"picto_nombre_commentaires\">"+this.nombre_commentaires+"</div> "+
			"<div class=\"photo\"><img src=\""+this.data.vignette+"\" /></div> "+
			"<div class=\"texte\">"+
			"<div class=\"titre\" class=\"\">"+this.titre+"</div> "+
			"<div class=\"auteur_date\">"+this.nom_classe+" - "+date_texte+"</div> "+
			"</div>"+
			"<div class=\"nettoyeur\"></div>");
			
		
		this.connecteur = $('<div/>', {
  		'id':'connecteur_consigne_'+this.consigne.id+'_reponse_'+this.id,
  		'class':'connecteur_timeline couleur_travail_en_cours'+coul+' hide',
  		'data-consigne-id':this.consigne.id,
  		'data-reponse-id':this.id
		});
		
		this.div_base.append(this.div_texte);
		
  	CCN.timelineLayerConsignes.prepend(this.div_base);
		CCN.projet.timeline_fixed.append(this.connecteur);
		
		var _thisId = this.id;
		var _thisIdObjet = this.id;
		
		this.div_texte.on('click',function(){
  		callReponse(_thisId);
    });
	
    // Calcul de la hauteur de la consigne
    
		this.largeur = $(this.div_base).outerWidth();
		this.hauteur = $(this.div_base).outerHeight()+7;	

    // Draggable
	
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
   * Affiche la réponse dans la timeline.
   *
   * @param {Object} data - Données à affecter à l'instance
   */
 
	this.showInTimeline = function() {
  	var reponse_DOM = $('.reponse_haute[data-reponse-id="'+this.id+'"]');
	
  	$('body').addClass('highlightReponse');
    $('.reponse_haute, .connecteur_timeline').removeClass('current_select');
    
    $('#connecteur_consigne_'+this.consigne.id+'_reponse_'+this.id).addClass('current_select');
    reponse_DOM.addClass('current_select');
	}

}
