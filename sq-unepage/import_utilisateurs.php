<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// On active les sessions (pour gérer les connexions).
session_start();
//session_destroy();
// On charge les variables d'environnement (présentes dans un fichier .env).
$env = new Env();

/*
 * Nous voulons présenter une interface à l'utilisateur. Cette interface doit proposer d'importer un fichier csv
 * contenant des informations sur les auteurs que l'on souhaite importer.
 */
$url_courante = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

if ( isset($_POST['mdp']) && $env->verifier_mot_de_passe($_POST['mdp'])){
    $_SESSION['auth'] = true;
    header("Refresh:0");
}

if( !isset($_SESSION['auth']) || $_SESSION['auth']!==true ){
    echo '<form method="post" action="' . $url_courante . '"><input type="password" name="mdp" placeholder="Accès à l\'import"></form>';
} else{
    // Ici, on est connecté et autorisé à voir. On peut donc afficher la page d'import des utilisateurs.
    echo genererVue($url_courante);
    if( isset($_POST['import_utilisateurs']) ){
        var_dump($_POST);
        var_dump($_FILES);
    }
}


function genererVue($url_courante=''): string
{
    $codeHTML = '<form enctype="multipart/form-data" method="post" action="' . $url_courante . '">';
    $codeHTML .= '<input type="file" name="fichier_csv_utilisateurs" required>';
    $codeHTML .= '<input name="import_utilisateurs" type="submit" value="Importer">';
    return $codeHTML . '</form>';
}


/**
 * Sert à récupérer les variables d'environnement.
 */
class Env{

    private array $env_variables = array();
    private string $env_file_location = '.env';

    public function __construct($env_file_location='')
    {
        $this->env_file_location = $env_file_location==='' ? getcwd().'/plugins/plugin_thematique_laclasse_v3/sq-unepage/.env' : $env_file_location;
        try {
            $lignes = file($this->env_file_location);
            try {
                foreach ($lignes as $ligne){
                    // Il s'agit d'un fichier .env, sa grammaire est de type : « NOM_VARIABLE=VALEUR »
                    $morceaux = explode('=', $ligne);
                    if (count($morceaux)==2){
                        $this->env_variables[trim($morceaux[0])]=trim($morceaux[1]);
                    }
                }
            }catch (Erreur $exception){
                echo $exception;
            }
        } catch (Erreur $e){
            $erreur = new Erreur(
                'Fichier .env introuvable ici : ' .$this->env_file_location.'.',
                'Créez ce fichier ici : '.$this->env_file_location
            );
            echo $erreur->afficher_erreur();
        }
    }

    public function verifier_mot_de_passe(string $mot_de_passe_a_tester=''): bool
    {
        try {
            if( !isset($this->env_variables['mot_de_passe_import_utilisateurs']) ){
                throw new Erreur(
                    'Impossible de trouver la variable dans le fichier .env (' .$this->env_file_location.').',
                    'Ajoutez ceci dans votre fichier .env : "mot_de_passe_import_utilisateurs=le_mot_de_passe_que_vous_voulez_pour_protéger_cette_page".');
            }
        } catch (Erreur $e){
            echo $e->afficher_erreur();
        }
        if (trim($mot_de_passe_a_tester)===$this->env_variables['mot_de_passe_import_utilisateurs']) {
            return true;
        }
        return false;
    }
}

/**
 * Sert à représenter proprement les erreurs.
 */
class Erreur extends Exception{

    private string $probleme='';
    private string $solution='';

    /**
     * @param string $probleme
     * @param string $solution
     */
    public function __construct(string $probleme='', string $solution='')
    {
        $this->probleme = $probleme;
        $this->solution = $solution;
        parent::__construct();
    }


    public function afficher_erreur(): string
    {
        $affichage = '<div><dl>';
        $affichage.= '<dt>Problème</dt>';
        $affichage.= '<dd>'.$this->probleme.'</dd>';
        $affichage.= '<dt>Solution</dt>';
        $affichage.= '<dd>'.$this->solution.'</dd>';
        $affichage.= '</dl></div>';
        return $affichage;
    }
}