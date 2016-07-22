/**
 * Génère un intervenant.
 *
 * @constructor
 */

function Intervenant(){

	var id, nom;


  /**
   * Initialise l'intervenant.
   *
   * @param {Object} data - Données à affecter à l'instance
   */

	this.init = function(data){
    this.data = data;
		this.id = data.id;
		this.nom = data.nom;
	}
	
}
