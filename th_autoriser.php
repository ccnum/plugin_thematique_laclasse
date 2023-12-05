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


/**
 * Autorisation de modifier un auteur
 *
 * Attention tout depend de ce qu'on veut modifier. Il faut être au moins
 * rédacteur, mais on ne peut pas promouvoir (changer le statut) un auteur
 * avec des droits supérieurs au sien.
 *
 * @param  string $faire Action demandée
 * @param  string $type Type d'objet sur lequel appliquer l'action
 * @param  int $id Identifiant de l'objet
 * @param  array $qui Description de l'auteur demandant l'autorisation
 * @param  array $opt Options de cette autorisation
 * @return bool          true s'il a le droit, false sinon
 **/
function autoriser_auteur_modifier($faire, $type, $id, $qui, $opt) {



	// Un redacteur peut modifier ses propres donnees mais ni son login/email
	// ni son statut (qui sont le cas echeant passes comme option)
	if ($qui['statut'] == '1comite'  or $qui['statut'] == '6forum') {
		if (isset($opt['webmestre']) and $opt['webmestre']) {
			return false;
		} elseif ((isset($opt['statut']) and $opt['statut'])
			or (isset($opt['restreintes']) and $opt['restreintes'])
			or $opt['email']
		) {
			return false;
		} elseif ($id == $qui['id_auteur']) {
			return true;
		} else {
			return false;
		}
	}

	// Un admin restreint peut modifier/creer un auteur non-admin mais il
	// n'a le droit ni de le promouvoir admin, ni de changer les rubriques
	if ($qui['restreint']) {
		if (isset($opt['webmestre']) and $opt['webmestre']) {
			return false;
		} elseif ((isset($opt['statut']) and ($opt['statut'] == '0minirezo'))
			or (isset($opt['restreintes']) and $opt['restreintes'])
		) {
			return false;
		} else {
			if ($id == $qui['id_auteur']) {
				if (isset($opt['statut']) and $opt['statut']) {
					return false;
				} else {
					return true;
				}
			} else {
				if ($id_auteur = intval($id)) {
					$t = sql_fetsel("statut", "spip_auteurs", "id_auteur=$id_auteur");
					if ($t and $t['statut'] != '0minirezo') {
						return true;
					} else {
						return false;
					}
				} // id = 0 => creation
				else {
					return true;
				}
			}
		}
	}

	// Un admin complet fait ce qu'il veut
	// sauf se degrader
	if ($id == $qui['id_auteur'] && (isset($opt['statut']) and $opt['statut'])) {
		return false;
	}
	// et toucher au statut webmestre si il ne l'est pas lui meme
	// ou si les webmestres sont fixes par constante (securite)
	elseif (isset($opt['webmestre']) and $opt['webmestre'] and (defined('_ID_WEBMESTRES') or !autoriser('webmestre'))) {
		return false;
	} // et modifier un webmestre si il ne l'est pas lui meme
	elseif (intval($id) and autoriser('webmestre', '', 0, $id) and !autoriser('webmestre')) {
		return false;
	} else {
		return true;
	}
}
