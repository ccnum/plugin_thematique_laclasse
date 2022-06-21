<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

/*
 * Nous voulons présenter une interface à l'utilisateur. Cette interface doit proposer d'importer un fichier csv
 * contenant des informations sur les auteurs que l'on souhaite importer.
 */
$mot_de_passe_acces_page = 'toto';

if ( isset($_POST['mdp']) && $_POST['mdp']===$mot_de_passe_acces_page){
    $_SESSION['auth'] = true;
    header("Refresh:0");
}

if( !isset($_SESSION['auth']) || $_SESSION['auth']!==true ){
    $url_courante = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    echo '<form method="post" action="' . $url_courante . '"><input type="password" name="mdp" placeholder="Accès à l\'import"></form>';
} else{
    // Ici, on est connecté et autorisé à voir. On peut donc afficher la page d'import des utilisateurs.
}