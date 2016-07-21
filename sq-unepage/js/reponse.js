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
		this.id = data.id;
		this.classe_id = data.classe_id;
		this.titre = data.titre;
		this.date = data.date;
		this.date_date = data.date_date;
		this.nombre_commentaires = data.nombre_commentaires;
		this.x = data.nombre_jours;
		this.x_absolu = data.nombre_jours+data.consigne.x; // Le bloc réponse est relatif à la position x de la consigne
		this.y = data.y;
		this.connecteur;
		
		this.index = data.index;

		// Base			

		this.div_base = document.createElement("div");
		this.div_base.style.position = "absolute";
		this.div_base.style.left = (this.x_absolu/g_projet.nombre_jours*100)+'%';
		this.div_base.style.top = (this.y)*100+"%";

		this.div_base.setAttribute("class","timeline_item reponse_haute reponse_haute_consigne_parent"+data.consigne.id+" hide");
		this.div_base.setAttribute("id","reponse_haute"+this.id);
		this.div_base.setAttribute("data-consigne-id",data.consigne.id);
		this.div_base.setAttribute("data-reponse-id",this.id);
		
		for (k=0;k<data.classes.length;k++){
			if (this.classe_id == data.classes[k].id){
				var nom_classe = data.classes[k].nom;
			}
		}
		
  	g_projet.timeline.append(this.div_base);

    // Texte
    
		var date_texte = this.date.substring(0, 2) + " " + g_nom_mois[parseFloat(this.date.substring(3, 5))-1];
		this.div_texte = document.createElement("div");
		this.div_texte.onSelectStart = null;
		this.div_texte.setAttribute("onClick","callReponse("+data.consigne.id+","+this.id+");");
		this.div_texte.setAttribute("id","reponse"+this.id);
		
		var coul = ""+this.classe_id+"";
		var coul = coul.substr(coul.length-1,1);
		this.div_texte.setAttribute("class","reponse couleur_texte_travail_en_cours couleur_travail_en_cours"+coul);
		
		this.div_texte.innerHTML  = "<div class=\"picto_nombre_commentaires\">"+this.nombre_commentaires+"</div> "+
			"<div class=\"photo\"><img src=\""+data.vignette+"\" /></div> "+
			"<div class=\"texte\">"+
			"<div class=\"titre\" class=\"\">"+this.titre+"</div> "+
			"<div class=\"auteur_date\">"+nom_classe+" - "+date_texte+"</div> "+
			"</div>"+
			"<div class=\"nettoyeur\"></div> ";
			
		this.div_base.appendChild(this.div_texte);
		
		this.connecteur = $('<div/>', {
  		'id':'connecteur_consigne_'+data.consigne.id+'_reponse_'+this.id,
  		'class':'connecteur_timeline couleur_travail_en_cours'+coul+' hide',
  		'data-consigne-id':data.consigne.id,
  		'data-reponse-id':this.id
		});
		
		g_projet.timeline_fixed.append(this.connecteur);
	
    // Calcul de la hauteur de la consigne
    
		this.largeur = $(this.div_base).outerWidth();
		this.hauteur = $(this.div_base).outerHeight()+7;	

    // Draggable
	
		if (g_u_admin==0) {
  		$(this.div_base).draggable({
  			axis: "y" ,
  			start: function(event,ui){
  				$(this).addClass('no_event');					
  			},
				drag: function(event,ui) {
  			  updateConnecteurs();	
				},
  			stop: function(event,ui) {
  				yy = (ui.offset.top-g_projet.timeline.offset().top)/g_projet.timeline.height();
  				
  				$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:this.id, type_objet:"article", X:0, Y:yy } );
  				
  				$(this).removeClass('no_event');		
  				this.y = yy;
  			}
  		});
		}
	}

}
