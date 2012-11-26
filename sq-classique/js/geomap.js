//array para gadar os markers
var markers = [];
//array para gardar o html contido das xanelas de cada marker
var contidosHTML = [];
//array para gardar as URL dos sonidos que se reproduciran en cada xanela
var URLsons = [];

function getNodeText(node){
	return node.text || node.firstChild ? node.firstChild.nodeValue : "";
}

//GL recoller a id da URL do artigo
//ENG get id from the article'URL
//FR recuperer l'id de l'article dans l'URL
// cette fonction n'est plus utilisee depuis qu'on colle l'id dans le guid du RSS
// on la garde en reserve au cas ou...
function extraerID(url){
	var posicion = url.indexOf("article");
	if (posicion != -1) {
		url = url.substring(posicion + 7);
		posicion = url.indexOf ("&");
		if (posicion != -1) {
			url = url.substring(0,posicion);
		}
	//se non e un artigo de spip que lle dean
	} else {
		url = url.substring(url.length - 4);
	}
	return url;
}

function coordenadas (articulo){
	$.ajax({
		type: "POST",
		url: "'.generer_url_public('cambiar_coordenadas').'",
		data: "id_article="+articulo+"&lat="+document.forms.formulaire_coordenadas.lat.value+"&lonx="+document.forms.formulaire_coordenadas.lonx.value,
		success: function() {
		}
	});
}

function creamarker0(point, html, icon, son, idmap) {
	//creamos un obxecto GMarker e o gradamos nunha variable
	var marker = new GMarker(point, icon);
	//engadimos un evento para que ao pulsar no marker se abra a ventana co html indicado
	var map = eval('map'+idmap);
	GEvent.addListener(marker, "mouseover", function() {
		marker.openInfoWindowHtml(html);
		//cando se abre a ventana do marker executamos as seguintes intsruccions
		GEvent.addListener(marker,"infowindowopen", function() {
			if(son){
				//esta parte del codigo enbebe un obxecto flah na ventana creado con flashobject.js
				var fo = new FlashObject(URLbaseGis + "/img_pack/musicplayer.swf?autoplay=true&song_url="+son, "player_x", "17", "17", "6", "#FFFFFF");
				fo.write("player");
			}
		});
	});
	GEvent.addListener(marker, "click", function() {
		window.open(html);
	});			
	return marker;
}

function creamarker(point, html, icon, son, idmap, draggable, id_gis, link) {
	//engadimos un evento para que ao pulsar no marker se abra a ventana co html indicado
		var map = eval('map'+idmap);

	//Create the marker with draggable option
		if (draggable=='true')
			{
				var marker = new GMarker(point, {draggable:true,icon:icon});
				GEvent.addListener(marker, "dragend", function(){
				var center = marker.getPoint();
				var lat = center.lat();
				var lonx = center.lng();
				var zoom = 	map.getZoom();
				$.get("spip.php", { page: "action", type: "update_coord_gis", id_gis: id_gis, lat: lat, lonx: lonx, zoom :zoom  } );
		  		//jQuery("#formulaire_editer_gis #lat").val(center.lat());
				//jQuery("#formulaire_editer_gis #lonx").val(center.lng());
				map.panTo(center);
				});
				
				//Open popup
					GEvent.addListener(marker, "click", function() {
						marker.openInfoWindowHtml(html);
						//cando se abre a ventana do marker executamos as seguintes intsruccions
						GEvent.addListener(marker,"infowindowopen", function() {
							if(son)	{
								//esta parte del codigo enbebe un obxecto flah na ventana creado con flashobject.js
								var fo = new FlashObject(URLbaseGis + "/img_pack/musicplayer.swf?autoplay=true&song_url="+son, "player_x", "17", "17", "6", "#FFFFFF");
								fo.write("player");
							}
						});
					});
				
			}
			else
			{
				var marker = new GMarker(point, icon);
				//Open popup
					GEvent.addListener(marker, "mouseover", function() {
						marker.openInfoWindowHtml(html);
						//cando se abre a ventana do marker executamos as seguintes intsruccions
						GEvent.addListener(marker,"infowindowopen", function() {
							if(son)	{
								//esta parte del codigo enbebe un obxecto flah na ventana creado con flashobject.js
								var fo = new FlashObject(URLbaseGis + "/img_pack/musicplayer.swf?autoplay=true&song_url="+son, "player_x", "17", "17", "6", "#FFFFFF");
								fo.write("player");
							}
						});
					});

				//Link
					GEvent.addListener(marker, "click", function() {
						window.location.href = link;
					});	
			}


	return marker;
}

function agregarmarker (xmlItem, idmap, minZoom, maxZoom, markerMngerXD, ombre, iconx, icony) {
	//almacenamos en distintas variables la informacion contenida nen los chilNodes de cada item-marker do xml
	var xmlLat = $("geo_lat",xmlItem);
	var xmlLng = $("geo_long",xmlItem);
	var xmlSon = $("enclosure",xmlItem);
	var id = $("guid",xmlItem);
	var is_marker = eval('markerManager'+idmap);
	if ((xmlLat.length == 0) || (xmlLng.length == 0)) 
	{
		//alert (String(id.text()));
		return;
	}
	else {
		var lat = parseFloat(xmlLat.text());
		var lng = parseFloat(xmlLng.text());
		var id = parseInt(id.text());
		//var html = "<div id='window_" + id +"' class='window_content'><div id='player'></div><h3><a href='" + $("link",xmlItem).text() + "'>" + $("title",xmlItem).text() + "</a></h3>" + $("description",xmlItem).text() + "</div>";
		var html = "<div id='window_" + id +"' class='window_content'><a class='ajax' href='" + $("link",xmlItem).text() + "'><h3>" + $("title",xmlItem).text() + "</h3>" + $("description",xmlItem).text() + "</a><div id='player'></div></div>";
		var icon = $("geo_icon",xmlItem).text();
		
		//ajout erasme
		var link = $("link",xmlItem).text();
		var iconx = $("geo_iconx",xmlItem).text();
		var icony = $("geo_icony",xmlItem).text();
		var draggable = $("draggable",xmlItem).text();
		//fin ajout		
	
		var son;
		if (xmlSon.length != 0) son = xmlSon.attr("url");
   	
		//creamos un Gpoint para situar nel o marker
		var point = new GPoint(lng,lat);
		
		//creamos un icono para o marker
		var icono_categoria = new GIcon();
		icono_categoria.image = (icon != "" ? icon : MarkerImgBase);
		if(ombre){
			icono_categoria.shadow = URLbase + "img_pack/shadow.png";
		}
		//modif erasme
		if (iconx) icono_categoria.iconSize = new GSize(iconx,icony); else icono_categoria.iconSize = new GSize(MarkerBaseWidth, MarkerBaseHeight);
		if (iconx) icono_categoria.iconAnchor = new GPoint((iconx/2), icony); else icono_categoria.iconAnchor = new GPoint((MarkerBaseWidth/2), MarkerBaseHeight);
		//fin modif
		icono_categoria.shadowSize = new GSize(37, 34);		
		icono_categoria.infoWindowAnchor = new GPoint(20, 0);
			
		// creamos el marker con los datos almacenados en las variables
		var marker = creamarker(point, html, icono_categoria, son, idmap, draggable, id, link);
		// recollemos a informacion que sexa necesaria en distintos arrays, usando como identificador a id do artigo
		markers["id_"+id] = marker;
		contidosHTML["id_"+id] = html;
		URLsons["id_"+id] = son;
		//engadimos o marker ao markerManager antes "map.addOverlay(marker);"
		if (maxZoom) {
			if(is_marker){
				is_marker.addMarker(marker, minZoom,  maxZoom);
			}
			else{
				markerManager.addMarker(marker, minZoom,  maxZoom);
			}
		} else if (is_marker){
			eval(is_marker).addMarker(marker, minZoom);
		}
	}	
}

function abrirVentana(identificador, idmap) {
	var map = eval('map'+ idmap);
	map.closeInfoWindow();
	GEvent.addListener(markers["id_"+identificador], "infowindowopen", function() {
		if(URLsons["id_"+identificador]){
			//esta parte del codigo enbebe un obxecto flah na ventana creado con flashobject.js
			var fo = new FlashObject( URLbaseGis + "/img_pack/musicplayer.swf?autoplay=true&song_url=" + URLsons["id_"+identificador], "player_x", "17", "17", "6", "#FFFFFF");
			fo.write("player");
		}
	});
	markers["id_"+identificador].openInfoWindowHtml(contidosHTML["id_"+identificador]);
}
