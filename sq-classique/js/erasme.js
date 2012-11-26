////////////////////////////////////////////////////////////////
// Rechargements
////////////////////////////////////////////////////////////////
function reload_cookie(url,cookie_nom,cookie_valeur) {	
	//alert (cookie_valeur);
	document.cookie = cookie_nom + "=" + escape(cookie_valeur);
	reload(url);
}

function reload(url) {
	if (url == 'self')
	{
		location.reload( true );
		window.location.reload();
	}
	else window.location.href = url;
}



