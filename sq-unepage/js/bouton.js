////////////////////////////////////////////////////////////////
// objet bouton
////////////////////////////////////////////////////////////////
function bouton(){

	// membres
	var url_base, opacite;
	var div_base;
		
	// méthode init
	this.init = function(projet, canvas, type){
		switch(type){
			// bouton plus pour ajout d'article
			case 0:
				this.div_base = document.createElement("div");
				if ((g_u_id_restreint > 0)&&(g_u_type_restreint != '')&&(g_u_type_restreint != 'travail_en_cours')){
				this.div_base.innerHTML = "<div id='reponse_plus2' class='bouton_article_plus' ><img src='"+g_u_chemin+"img/reponse_plus.png' onClick='createReponse(0, "+g_u_id_restreint+");' title='publier un nouvel article'></div>";
				this.div_base.style.position = "absolute";
				this.div_base.style.left = "195px";
				this.div_base.style.bottom = "-105px";
				this.div_base.style.visibility = "visible";
				}
				break;
			// bouton plus pour ajout dans le canvas
			case 1:
				this.div_base = document.createElement("div");
				if ((g_u_id_restreint > 0)&&(g_u_type_restreint != '')&&(g_u_type_restreint != 'travail_en_cours')){
				this.div_base.innerHTML = "<div id='reponse_plus2' class='bouton_article_plus' ><img src='"+g_u_chemin+"img/reponse_plus.png' onClick='createReponse(0, "+g_u_id_restreint+");' title='publier un nouvel article'></div>";
				this.div_base.style.position = "absolute";
				this.div_base.style.left = "20px";
				this.div_base.style.bottom = "60px";
				this.div_base.style.visibility = "visible";
				}
				break;
			}
		canvas.appendChild(this.div_base);
	}
	
	// méthode update
	this.update = function(){
		if (this.opacite < 1){
			this.opacite += 0.1;
			this.div_base.style.opacity = this.opacite;
		}
	}

	
}
