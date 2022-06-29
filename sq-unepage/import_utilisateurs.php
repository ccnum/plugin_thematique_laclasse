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
    // Ici, on est connecté et autorisé à voir. On peut donc afficher la page d'import des utilisateurs et importer les données.
    if( isset($_POST['import_utilisateurs']) ){
        if( isset($_FILES['fichier_csv_utilisateurs']) && $_FILES['fichier_csv_utilisateurs']['error']===0){

            //var_dump($_POST);
            //var_dump($_FILES);
            importer_donnees_du_tableur($_FILES['fichier_csv_utilisateurs']['tmp_name']);
        } else{
            $erreur = new Erreur(
                'Erreur lors de l\'upload du fichier.',
                'Fichier trop gros ?'
            );
            echo $erreur->afficher_erreur();
        }
    }

    echo genererVue($url_courante);

}


function genererVue($url_courante=''): string
{
    $codeHTML  = '<html><head>
<style>
th{border: 5px solid black;}
</style>
</head><body>
<h4>Assurez-vous que votre tableur corresponde à ceci :</h4><table>
    <caption>Organisation des colonnes</caption>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Login SPIP/LACLASSE</th>
            <th>email(s)</th>
            <th>Numéro des rubriques où il est admin</th>
            <th>Numéro des articles où il est auteur</th>
        </tr>
    </thead>
</table>
';
    $codeHTML .= '<form enctype="multipart/form-data" method="post" action="' . $url_courante . '">';
    $codeHTML .= '<h4>Formulaire d\'import :</h4>';
    $codeHTML .= '<p><label for="fichier_csv_utilisateurs">Fichier csv uniquement !</p><input type="file" name="fichier_csv_utilisateurs" id="fichier_csv_utilisateurs" required></label>';
    $codeHTML .= '<h5>Choix des tables :</h5>';
    $codeHTML .= '<select name="table_auteur"><option disabled selected value="">---Veuillez choisir---</option>';
    foreach (get_liste_tables() as $table){
        $nom_table = reset($table);
        if( strlen($nom_table)>8 && substr($nom_table,-8)==='_auteurs' && substr($nom_table,-16)!=='_donnees_auteurs' && substr($nom_table,-14)!=='_zones_auteurs'){
            $codeHTML .= '<option value="' . $nom_table . '">' . $nom_table . '</option>';
        }
    }
    $codeHTML .= '</select>';
    $codeHTML .= '<select name="table_auteur_liens"><option disabled selected value="">---Veuillez choisir---</option>';
    foreach (get_liste_tables() as $table){
        $nom_table = reset($table);
        if( strlen($nom_table)>14 && substr($nom_table,-14)==='_auteurs_liens'){
            $codeHTML .= '<option value="' . $nom_table . '">' . $nom_table . '</option>';
        }
    }
    $codeHTML .= '</select>';
    $codeHTML .= '<p><input accept="text/csv" name="import_utilisateurs" type="submit" value="Importer"></p>';
    return $codeHTML . '</form></body></html>';
}


function importer_donnees_du_tableur($nom_fichier_tableur=''){
    $liste_auteurs = generer_liste_auteur($nom_fichier_tableur);
    foreach ($liste_auteurs as $auteur){
        //$auteur->existe_deja_en_bdd();
    }
}

/**
 * Renvoie un tableau d'objets Auteur avec les informations sur ces auteurs.
 * @param string $nom_fichier_tableur
 * @return array
 */
function generer_liste_auteur(string $nom_fichier_tableur=''): array
{
    $liste_auteurs = array();
    $ligne=0;
    if (($handle = fopen($nom_fichier_tableur, "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if ($ligne!==0){
                $liste_auteurs[] = new Auteur_SPIP($data);
            }
            $ligne++;
        }
        fclose($handle);
    }
    return $liste_auteurs;
}



class Auteur_SPIP{
    public int $id_auteur = 0;
    public string $nom = '';
    public array $emails = array();
    public string $login = '';

    /**
     * @var string
     * Les valeurs possibles trouvées :
     * - 0minirezo  -> Admin ?
     * - 1comite    -> Semble correspondre aux rédacteurs.
     * - 5poubelle  -> utilisateur supprimé ?
     * - 6forum     -> utilisateur basique ?
     */
    public string $statut = '6forum';

    /**
     * @var string
     * Toujous non webmestre par défaut. Il n'y a AUCUNE raison de donner des droits de webmestre automatiquement.
     */
    public string $webmestre = 'non';

    public array $rubriques_ou_auteur_est_admin = array();

    public array $articles_ou_auteur_est_auteur = array();

    public function __construct(array $data=array())
    {
        $this->nom = $data[1] . ' ' . $data[0];
        $this->emails = explode(':', $data[3]);
        $this->login = $data[2];
        $this->statut = $this->detecter_statut($data[4]);
        $this->rubriques_ou_auteur_est_admin = $this->detecter_rubriques_possedees($data[4]);
        $this->articles_ou_auteur_est_auteur = $this->detecter_articles_possedes($data[5]);
    }

    private function detecter_statut($data): string
    {
        /*
         * Si des rubriques sont déclarées comme ayant cette personne comme admin, cette personne est donc admin.
         * Les restrictions par rubriques seront faites plus tard.
         */
        if ($data!==''){
            return '0minirezo';
        }
        return '6forum';
    }

    private function detecter_rubriques_possedees(string $data=''): array
    {
        if(mb_strtolower($data)==='toutes'){
            return array();
        }
        $donnees_crado = explode(", ", $data);
        $donnees_finales= array();
        foreach ($donnees_crado as $donnee_crado){
            $donnees_finales[] = trim($donnee_crado);
        }
        return $donnees_finales;
    }

    private function detecter_articles_possedes(string $data=''): array
    {
        $donnees_crado = explode(", ", $data);
        $donnees_finales= array();
        foreach ($donnees_crado as $donnee_crado){
            $donnees_finales[] = trim($donnee_crado);
        }
        return $donnees_finales;
    }

    /**
     * @return void
     */
    public function inserer_auteur_en_bdd(){
        $connexion = new ConnexionBDD();
        $connexion = $connexion->getConnexion();
        // L'auteur existe-t-il déjà dans la base de données ? Si non, on le créé.
        if (!$this->existe_deja_en_bdd()){
            try {
                //$transaction = $connexion->prepare("INSERT INTO krimi_auteurs (nom, email, login, statut, webmestre) VALUES (?,?,?,?,?)");
                $connexion->beginTransaction();
                $transaction->execute([$this->nom, $this->email, $this->login, $this->statut, $this->webmestre]);
                $this->id_auteur = $connexion->lastInsertId();
                $connexion->commit();
            }catch (Exception $e){var_dump($e);}
        } else {
            // Si il existe déjà, on récupère au moins son identifiant.
            try {
                //$transaction = $connexion->query("SELECT * FROM krimi_auteurs WHERE login=\"" .$this->login . "\"");
                $user = $transaction->fetch();
                $this->id_auteur = $user['id_auteur'];
            }catch (Exception $e){var_dump($e);}
        }
        // Maintenant que l'auteur est en BDD, mettons à jour ses rubriques et articles possédés.
        $this->inserer_possessions_auteur();
    }

    private function inserer_possessions_auteur(){
        $connexion = new ConnexionBDD();
        $connexion = $connexion->getConnexion();
        try {
            /*
             *  +-----------+----------+----------+-----+
                | id_auteur | id_objet | objet    | vu  |
                +-----------+----------+----------+-----+

                -> id_auteur    : l'identifiant de l'auteur
                -> id_objet     : l'identifiant de l'objet
                -> objet        : le type d'objet ("article" ou "rubrique" -> pas vu autre chose...)
                -> vu           : pas la moindre idée... semble toujours égale à "non"
            */

            // Ajoutons les rubriques où l'auteur est admin.
            foreach ($this->rubriques_ou_auteur_est_admin as $rubrique){
                if (!$this->existe_deja_lien_auteur($this->id_auteur, $rubrique, 'rubrique')){
                    //$requete = "INSERT INTO krimi_auteurs_liens (id_auteur, id_objet, objet, vu) VALUES (?,?,?,?)";
                    $requete= $connexion->prepare($requete);
                    $requete->execute([$this->id_auteur, $rubrique, 'rubrique', 'non']);
                }
            }
            // Et ajoutons les articles où l'auteur est "auteur".
            foreach ($this->articles_ou_auteur_est_auteur as $article){
                if (!$this->existe_deja_lien_auteur($this->id_auteur, $article, 'article')){
                    //$requete = "INSERT INTO krimi_auteurs_liens (id_auteur, id_objet, objet, vu) VALUES (?,?,?,?)";
                    $requete= $connexion->prepare($requete);
                    $requete->execute([$this->id_auteur, $article, 'article', 'non']);
                }
            }
        }catch (Exception $e){var_dump($e);}
    }

    private function existe_deja_lien_auteur($id_auteur=0, $id_objet=0, $type_objet='rubrique'): bool
    {
        $connexion = new ConnexionBDD();
        $connexion = $connexion->getConnexion();
        try {
            //$requete = 'SELECT * FROM krimi_auteurs_liens WHERE id_auteur=' . $id_auteur . ' AND id_objet=' . $id_objet . ' AND objet="' . $type_objet . '"';
            $transaction = $connexion->query($requete);
            if ($transaction->fetch()){
                return true;
            }
        }catch (Exception $e){var_dump($e);}
        return false;
    }

    public function existe_deja_en_bdd(): bool
    {
        $connexion = new ConnexionBDD();
        $connexion = $connexion->getConnexion();
        try {
            //$stmt = $connexion->query("SELECT * FROM krimi_auteurs WHERE login=\"" . $this->login . "\"");
            $user = $stmt->fetch();
            if ($user){
                return true;
            }
        }catch (Exception $e){}
        return false;
    }
}

/**
 * @return array
 */
function get_liste_tables(): array
{
    $liste_tables = array();

    $connexion = new ConnexionBDD();
    $connexion = $connexion->getConnexion();
    try {
        $stmt = $connexion->query("SHOW TABLES;");
        $liste_tables = $stmt->fetchAll();
    }catch (Exception $e){}
    return $liste_tables;
}

/**
 * Gestion de la connexion à la BDD.
 */
class ConnexionBDD{
    private string $servername = "localhost";
    private string $db         = "";
    private string $username   = "";
    private string $password   = "";
    private string $charset    = "utf8";
    private array $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    public function __construct(){
        $variables = new Env();
        $this->db = $variables->env_variables['database'];
        $this->username = $variables->env_variables['db_username'];
        $this->password = $variables->env_variables['db_password'];
    }

    private function dsn(): string
    {
        return "mysql:host=$this->servername;dbname=$this->db;charset=$this->charset;";
    }

    /**
     * @return PDO
     */
    public function getConnexion(): PDO
    {
        return new PDO($this->dsn(), $this->username, $this->password, $this->options);
    }
}

/**
 * Sert à récupérer les variables d'environnement.
 */
class Env{

    public array $env_variables = array();
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