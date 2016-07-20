/**
 * Génère une classe.
 *
 * @constructor
 */

function Classe(){

	var id, nom;


  /**
   * Initialise la classe.
   *
   * @param {Object} data - Données à affecter à l'instance
   */

	this.init = function(data){
		this.id = data.id;
		this.nom = data.nom;
	}
	
}
