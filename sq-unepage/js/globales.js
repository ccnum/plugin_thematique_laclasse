////////////////////////////////////////////////////////////////
// Déclaration des globales
////////////////////////////////////////////////////////////////
var g_nom_mois = new Array("Janv.", "Fév.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.");
var g_mousedown, g_mousex, g_mousey;
var g_projet;
var g_classes, g_classe_index;
var g_consignes, g_consigne_index;
var g_reponses, g_reponse_index;
var g_articles_blog, g_article_blog_index;
var g_articles_evenement, g_article_evenement_index;
var g_frame;
var g_hide_travaux;
var g_hide_articles_blog;
var g_hide_articles_evenement;
var g_popup_consigne, g_popup_reponse, g_popup_article_blog, g_popup_article_evenement, g_popup_ressources, g_popup_classes, g_popup_chat, g_popup_reponse_ajouter;
var g_bouton_plus, g_couleur_blog;
var g_duration_def;
var g_action, g_action_mois, g_action_reponses;


////////////////////////////////////////////////////////////////
// Couleurs
////////////////////////////////////////////////////////////////

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

////////////////////////////////////////////////////////////////
// Logs pour Firebug
////////////////////////////////////////////////////////////////

function log(message) {
	//if (window.console && window.console.firebug) console.log(message);
	if (typeof window.console != "undefined" && typeof window.console.debug == "function") 
		console.log(message);
}

////////////////////////////////////////////////////////////////
// sleep
////////////////////////////////////////////////////////////////
function sleep(ms){
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}


////////////////////////////////////////////////////////////////
// Load XML from a string
////////////////////////////////////////////////////////////////

function GetBrowserType()
{
var bname = "browser";
if (navigator.userAgent.indexOf("MSIE") != -1)
{
 bname = "Internet Explorer";
}
else if (navigator.userAgent.indexOf("Opera") != -1)
{
 bname = "Opera";
}
else if ((navigator.appName.indexOf("Netscape") != -1) || parseFloat(navigator.appVersion >= 3.0))
{
 bname = "Netscape Navigator";
}
else
{
 bname = "Unknown Browser";
}
return bname;
}

function LoadXMLString(xmlString)
{
  // ObjectExists checks if the passed parameter is not null.
  // isString (as the name suggests) checks if the type is a valid string.
    var xDoc;
    // The GetBrowserType function returns a 2-letter code representing
    // ...the type of browser.
    var bType = GetBrowserType();

    switch(bType)
    {
      case "Internet Explorer":
        // This actually calls into a function that returns a DOMDocument 
        // on the basis of the MSXML version installed.
        // Simplified here for illustration.
        xDoc = new ActiveXObject("MSXML2.DOMDocument")
        xDoc.async = false;
        xDoc.loadXML(xmlString);
        break;
      default:
        var dp = new DOMParser();
        xDoc = dp.parseFromString(xmlString, "text/xml");
        break;
    }
    return xDoc;

}