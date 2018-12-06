/**
 * Génère un article du blog pédagogique (événement).
 *
 * @constructor
 */
 
 function ArticleEvenement(){

	var id, titre, date, nombre_commentaires, x, y, type_objet, left, top;
	var div_base, div_texte, div_commentaires;


  /**
   * Initialise l'événement.
   *
   * @param {Object} data - Données à affecter à l'instance
   */
   
	this.init = function(data){
    this.data                   = data;
		this.id                     = this.data.id;
		this.type_objet             = this.data.type_objet;
		this.id_objet               = this.data.id_objet;
		this.titre                  = this.data.titre;
		this.date                   = this.data.date;
		this.nombre_commentaires    = this.data.nombre_commentaires;
		this.x                      = this.data.nombre_jours;
		this.y                      = this.data.y;
		this.index                  = this.data.index;
		this.left                   = -1;
		this.top                    = -1;			
		this.show = false;
		
		this.div_base = $('<div/>')
		  .attr('class','timeline_item article_evenement_container')
      .css({
        'top'   : (this.y*100)+'%',
        'left'  : (this.x/CCN.projet.nombre_jours*100)+'%'
      });
		
		this.img = $('<img src="'+CCN.urlImgEvenement+'">');
		
		this.div_base.append(this.img);
		
		var date_texte = this.date.substring(0, 2) + " " + CCN.nomMois[parseFloat(this.date.substring(3, 5))-1];
		
		// Trim text if too long
		if (this.titre.length > 25){
				this.titre = this.titre.substring(0, 25) + "(...)";
		}

		var html = "<div id='article_evenement"+this.id+"' class='article_evenement'>";
		html += "<div class='article_evenement_inner'><div class='article_evenement_texte'><b>"+this.titre+"</b><br/><span class='article_evenement_date'>"+date_texte+"</span></div></div>";
		
		if (this.nombre_commentaires > 0) html += "<div class=\"picto_nombre_commentaires\">"+this.nombre_commentaires+"</div>";
		html +=	"</div>";
		
		this.div_texte = $('<div/>')
		  .attr('class','')
		  .html(html);
		
    this.div_base.append(this.div_texte);
		
  	CCN.timelineLayerEvenements.prepend(this.div_base);
  	
  	var _thisId = this.id_objet;
	  var _thisTypeObjet = this.type_objet;
		
		this.div_texte.on('click',function(){
  		callArticleEvenement(_thisId, _thisTypeObjet);
    });
	
		if (CCN.admin==0) {
  		this.div_base.draggable({
  			axis: "y" ,
  			start: function(event,ui){
  				$(this).children('div').children('div').removeAttr("onClick");
  				},
  			stop: function(event,ui) {
  				y_parent = $(this).parent().height();
  				yy = ui.position.top / y_parent;
  				$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:_thisId, type_objet:_thisTypeObjet, X:0, Y:yy }, 
  				  function(data) {
      				console.log(data);
      		  }
      		);
  			}
  		});
    }
  }
}

