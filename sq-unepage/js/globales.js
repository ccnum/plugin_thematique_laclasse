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
    
    
var g_hide_travaux;
var g_hide_articles_blog;
var g_hide_articles_evenement;

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