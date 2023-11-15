<?php

function th_autoriser() {
}

// declarations d'autorisations
function autoriser_th_creer_onglet_dist($faire, $type, $id, $qui, $opt) {
	return autoriser('configurer', 'th', $id, $qui, $opt);
}

function autoriser_th_configurer_dist($faire, $type, $id, $qui, $opt) {
	return autoriser('webmestre', $type, $id, $qui, $opt);
}
