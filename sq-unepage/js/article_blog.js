/**
 * Génère un article du blog du projet (blog).
 *
 * @constructor
 */
 
 function ArticleBlog(){

	var id, titre, date, nombre_commentaires, x, y, type_objet, left, top;
	var div_base, div_texte, div_commentaires;


  /**
   * Initialise l'article de blog.
   *
   * @param {Object} data - Données à affecter à l'instance
   */
   
	this.init = function(data){
    this.data                 = data;
		this.id                   = this.data.id;
		this.type_objet           = this.data.type_objet;
		this.id_objet             = this.data.id_objet;					
		this.titre                = this.data.titre;
		this.date                 = this.data.date;
		this.nombre_commentaires  = this.data.nombre_commentaires;
		this.x                    = this.data.nombre_jours;
		this.y                    = this.data.y;
		this.index                = this.data.index;
		this.left                 = -1;
		this.top                  = -1;
		
		this.div_base = $('<div/>')
		  .attr('class','timeline_item article_blog_container')
		  .css({
  		  'left':'-1000px',
  		  'top':this.y+'px'
		  });
		
		this.img = $('<img src="'+CCN.urlImgBlog+'">');
		
		this.div_base.append(this.img);

	// texte
		var date_texte = this.date.substring(0, 2) + " " + CCN.nomMois[parseFloat(this.date.substring(3, 5))-1];
		this.div_texte = document.createElement("div");
		this.div_texte.setAttribute("class","cache");
		this.div_texte.onSelectStart = null;
		
		var html = "<div id='article_blog"+this.id+"' class='article_blog ";
		if ((this.titre.match("gazette"))||(this.titre.match("novamag"))||(this.titre.match("magazine"))) html = html+" article_blog2 ";
		html = html + "' onClick='callBlog("+this.id_objet+",\""+this.type_objet+"\");'><span><b>"+this.titre+"</b><br/>"+date_texte+"</span>";
		
		if (nombre_commentaires > 0) html += "<div class=\"picto_nombre_commentaires\">"+nombre_commentaires+"</div>";
		html +=	"</div>";
		this.div_texte.innerHTML = html;
		
    this.div_base.append(this.div_texte);
		
  	CCN.projet.timeline.append(this.div_base);
		
		var _thisId = this.id;
		
		/*
		this.div_texte.on('click',function(){
  		callArticleBlog(_thisId);
    });
	*/
	
	// draggable
		if (CCN.admin==0)
		$(this.div_base).draggable({
			axis: "y" ,
			start: function(event,ui){
				$(this).children('div').children('div').removeAttr("onClick");
				stop_action ();
				},
			stop: function(event,ui) {
				y_parent = $(this).parent().height();
				yy = ui.position.top / y_parent;
				$.get("spip.php?page=ajax&mode=article-sauve-coordonnees", {id_objet:this.id_objet, type_objet:this.type_objet, X:0, Y:yy } );
			}
		});
	}	
}