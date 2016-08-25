var CCN = {};

    CCN.nomMois               = new Array("Janv.", "Fév.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.");
    CCN.nomCompletMois        = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
    CCN.travailEnCoursId;
    CCN.couleurBlog;
    CCN.dureeTransition;
    
    CCN.projet;
    CCN.classes;
    CCN.intervenants;
    CCN.consignes;
    CCN.reponses;
    CCN.articlesBlog;         // blogs        : Blog du projet    (accessible par tous, bulles roses)
    CCN.articlesEvenement;    // evenements   : Blog pédagogique  (caché aux élèves, losanges bleu ciel)
    
    CCN.timelineLayerConsignes;
    CCN.timelineLayerBlogs;
    CCN.timelineLayerEvenements;

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function log(message) {
	console.log(message);
}


/**
 *  Retourne la valeur du noeud XML demandé.
 *
 * @param {string} tagName - Nom du noeud demandé
 * @param xml - Ressource XML
 * @returns {string} Valeur du noeud demandé
 */

function getXMLNodeValue(tagName, xml) {
  return xml.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;
}


/**
 * Retourne vrai si le noeud existe.
 *
 * @param {string} tagName - Nom du noeud demandé
 * @param xml - Ressource XML
 * @returns {boolean} <tt>true</tt> si le noeuf existe, <tt>false</tt> sinon
 */

function hasXMLNodeValue(tagName, xml) {
  return xml.getElementsByTagName(tagName)[0].childNodes[0];
}

/**
 * Retourne un tableau des paramètres d'une URL passée en paramètre string
 * Voir : http://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
 */
 
function getJsonFromUrl(query) {
  var result = {};
  
  query = query.substring(query.indexOf("?") + 1);
  query.split("&").forEach(function(part) {
    if(!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    var eq = part.indexOf("=");
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
    var from = key.indexOf("[");
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]");
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}