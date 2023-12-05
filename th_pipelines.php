<?php
if (!defined("_ECRIRE_INC_VERSION")) return;

function th_jqueryui_plugins($scripts) {
	$scripts[] = "jquery.ui.core";
	$scripts[] = "jquery.ui.widget";
	$scripts[] = "jquery.ui.mouse";
	$scripts[] = "jquery.ui.position";
	$scripts[] = "jquery.ui.draggable";
	$scripts[] = "jquery.ui.droppable";
	$scripts[] = "jquery.ui.tooltip"; /* a TROUVER */
	$scripts[] = "jquery.ui.effect";
	$scripts[] = "jquery.ui.effect-bounce";

	return $scripts;
}
