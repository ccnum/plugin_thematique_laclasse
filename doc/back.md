# Table des matières

- Qu’est ce qu’une CCN ?
  - Usages (LN)
  - Différentes section du front 
- Une nouvelle CCN
  - Configuration générale 
  - Paramètres du site (Y)
  - Configuration du CAS (Y)
  - Configuration de la section Aide 
  - Configuration de l’espace docs 
- Les Rubriques 
  - Les mots clefs
  - L’Agenda
  - Le Blog pédagogique
  - Le Blog privé
  - Le Contenu éditorial (Image de fond de la CCN) 
  - Discuter avec
  - Espace Ressources
  - Consignes
  - Les classes
  - Les livrables
- Les notifications (mails) 
- Import des utilisateurs.trices 
  - Import csv
- Les Rôles
  - Configuration des rôles utilisateurs.trices
  - Lier  un.e professeur.e à une classe
  - Lier un.e intervenant.e à une consigne
  - Lier un.e partenaire à une rubrique ressources
  - Lier un.e utilisateur.trice à une rubrique annexe
- Premiers contenus 
  - Création d’une consigne
  - Description d’une classe
  - Réponse à une consigne
  - Les Forums
    - Envoyer un commentaire
    - Modérer un commentaire
  - Alimentation d’un Livrable
  - Publication d’un article sur une rubrique annexe


## Qu’est ce qu’une CCN ?
### Usages 
### Différentes section du front 


# Une nouvelle CCN
 ### Configuration générale 
 ### Paramètres du site 

Configuration -> Identitée du site
Dans le champ Nom de votre Site vous avez la possibilité de préciser le nom de votre CCN, ce champ sera ensuite affiché sur toutes les parties du site en front comme ci dessous

Le champs description rapide est utilisé pour la rubrique aide que l’on retrouver par le biais du pictogramme
 
Dans la barre de navigation en haut de page
Il vous permet d’y ajouter des information plus spécifiques concernant votre CCN (ce champs accepter les balises html ainsi que les embed si vous souhaitez par exemple y intégrer une vidéo youtube ou tout type de média hébergé sur une plateforme annexe)

Exemple d’utilisation du champ

#### Paramètres du plugin Thématique
Le plugin thématique est le coeur du fonctionnement des CCN il permet la transformation d’un site SPIP classique en L’interface des Classes Culturelles Numériques


Il est configurable sous 
Configuration -> Gestion des plugins -> Pictogramme marteau/clé à molette



Vous y trouverez plusieurs champs :

##### label site ent nom :

- ce champ permet la modification du nom de la pastille blanche en haut de page sur la
partie front
 


	
##### label site ent url :

 - ce champ permet la modification de l’url de la pastille blanche 


label espace doc url :
	voir configuration de l’espace Doc

### Configuration du CAS 
	
Le plugin thématique utilise une version modifiée  du plugin cicas 
disponible ici il permet la connection par l’ENT laclasse.com et le création de l’utilisateur du CAS dans la base de donnée SPIP

La configuration du CAS est possible sous
configuration => Configurer CAS (SSO)



Le premier champ “Mode d’authentification” permet de choisir quel mode de connection est proposé  par défaut

Les champs “Url du serveur CAS” “Repertoire du serveur CAS” “Port du serveur CAS”  permettent de se connecter au serveur CAS afin de transmettre les information de connection


Le champ “Identifiant utilisateur fourni par le serveur CAS” permet de choisir la valeur qui sera utilisée afin de connecter l’utilisateur au site SPIP (soit par le login fourni par le CAS soit par l’email fourni par la CAS)

Le champ “eq texte cicasstatutcrea” permet de définir le rôle spip qui sera attribué par défaut à l’utilisateur lors de sa première connection  :

0minirezo (administrateur ou administrateur restreint)
1comite (rédacteur)
6forum (visiteur)

le champ titre cicas attributtes permet lier les information utilisateurs reçus  par la CAS au nom des champs de base de donnée SPIP de l’utilisateur

par exemple le champs laclasse reçu par le CAS sera lié au champ ent dans la BD de SPIP

Le plugin cicas Propose aussi d’autres options de configuration disponibles sous Configuration => Gestion des plugins => cicas: Authentification CAS (SSO)  Pictogramme marteau/clé à molette


Le champ “titre cuid list” [A COMPLETER]
Le champ  “eq titre serveur nb cas” permet de définir le nombre de serveur de connection disponibles une fois les paramètres sauvés, l’on pourra configurer les information de connection sous Configuration => Configurer CAS (SSO)

le champ “eq update auteur vide” Dans le cas où le champ “Identifiant utilisateur fourni par le serveur CAS” (voir ci dessus) est vide en base de donnée SPIP le CAS ira remplir ce champ à la connection de l’utilisateur

le champs “eq update auteur all” écrase le champ “Identifiant utilisateur fourni par le serveur CAS” (voir ci dessus) en tout condition et le remplace par la valeur reçue par le serveur CAS
 
### Configuration de la section Aide 
### Configuration de l’espace docs 
### Les Rubriques 
#### Les mots clefs
#### L’Agenda
#### Le Blog pédagogique
#### Le Blog privé
#### Le Contenu éditorial (Image de fond de la CCN)
#### Discuter avec
#### Espace Ressources
#### Consignes
#### Les classes
#### Les livrables
#### Les notifications (mails)
#### Import des utilisateurs.trices 
##### Import csv

Afin d’importer plusieurs utilisateur en même temps vous pouvez utiliser le plugin csv2auteurs 
Ce plugin permet la création de plusieurs utilisateur à l’aide d’un fichier CSV
Le fichier doit être formaté sous cet ordre nom;email;login;statut;ss_groupe;zone;pass
Les champs qui nous intéressent dans ce cas vont être :
Nom : Le nom complet de l’utilisateur
email : l’email de l’utilisateur, dans le cas ou vous utiliseriez l'authentification CAS assurez vous que le mail renvoyé par le CAS et spip soient le même
login : ce login doit correspondre point par point au login utilisé par l'authentification CAS
(dans le cas de laclasse.com la premiere lettre du prénom puis  le nom ex : Jane Doe devient jdoe)
statut : le statut définit les droit de l’utilisateur créé (voir roles)
ss_groupe : n’est pas utilisé dans notre cas, il est a laisser vide
zone: ce champ va vous permettre de définir l’ecole ou college à créer un tant que rubrique liée au prof

Une fois votre fichier csv préparé 
ex : 
nom;email;login;statut;ss_groupe;zone;pass
Adam Léonie;leonie.adam@laclasse.local;ladam;visiteur;;;motdepasse
Ake pourLui;apourlui@adresse.com;yakepourlui;visiteur;;;motdepasse
Aurore Boréale;aurore.boreale@laclasse.local;aboreale;redacteur;;Collège Jane Doe;motdepasse


Vous pouvez sous maintenance -> csv2auteurs importer votre fichier, vous pouvez laissez les champs configurés par défaut et appuyer sur “lancer la moulinette”
Les utilisateur seront ajoutés à spip
Attention dans le cas de l’utilisation du CAS vous devez être sur que l’adresse mail indiquée sur laclasse et l’adresse dans le fichier csv soit bien la même sans quoi le CAS ne sera pas capable de lier l’utilisateur laclasse à SPIP, vous pouvez aussi lier les utilisateur par leur pseudo au lieu du mail (sous configuration -> configuration CAS(SSO) -> Identifiant utilisateur fournit par le serveur CAS) dans le cas d’une nouvelle CCN ce changement ne devrait pas  poser problème mais attention aux ccns instanciées depuis plusieurs années il ce pourrait que les pseudos aient changé sur laclasse ou sur SPIP

#### Les Rôles
#### Configuration des rôles utilisateurs.trices
#### Lier  un.e professeur.e à une classe
#### Lier un.e intervenant.e à une consigne
#### Lier un.e partenaire à une rubrique ressources
#### Lier un.e utilisateur.trice à une rubrique annexe
### Premiers contenus 
### Création d’une consigne
### Description d’une classe
### Réponse à une consigne
### Les Forums
### Envoyer un commentaire
### Modérer un commentaire
### Alimentation d’un Livrable
### Publication d’un article sur une rubrique annexe

