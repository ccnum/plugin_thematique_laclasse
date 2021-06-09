# Outil d'administration et d'animation des classes culturelles numériques liées à l'ENT laclasse.com

**Plugin pour SPIP 3**

## Exemple d'installation sur une machine locale.

### Pré-requis

Sur une machine Ubuntu 20.04 LTS, il est nécessaire d'installer les dépendances suivantes.

```bash
sudo apt install apache2 php7.4 mysql-server sqlite3 libapache2-mod-php7.4 git php-xml php-xml-htmlsax3 php-mysql php-gd sqlite php-sqlite3 libsqlite3-dev php7.4-xml
```

### Installer SPIP

Les CCN sont en fait un module de [SPIP](https://www.spip.net/fr_rubrique91.html). Commençons par installer celui-ci.

Téléchargez SPIP et décompressez-le dans un répertoire du serveur. En local, on pourra créer un dossier nommé
`/var/www/html/ccn/nouvelle_ccn` et extraire SPIP à l'intérieur. Pour être certain que tout est bien installé, sachez
que vous devez retrouver des dossiers et des fichiers directement dans `/var/www/html/ccn/nouvelle_ccn` (comme un
fichier nommé `spip.php` ou encore `index.php`, etc).

À présent, ouvre une page de votre navigateur à l'adresse
[http://localhost/ccn/krimi/ecrire/](http://localhost/ccn/krimi/ecrire/) qui vous permettra de finir d'installer SPIP
avec quelques configurations supplémentaires. Durant l'installation, il vous sera demandé de renseigner un utilisateur
SQL qui aura des droits suffisants. Je recommande de créer un utilisateur SQL dédié à l'usage des CCN.

Assurez-vous que le dossier suivant existe et est accessible en écriture `/var/www/html/ccn/nouvelle_ccn/plugins/auto/`.

Activez le dépôt officiel de SPIP à l'adresse
[http://localhost/ccn/nouvelle_ccn/ecrire/?exec=charger_plugin](http://localhost/ccn/nouvelle_ccn/ecrire/?exec=charger_plugin).
Un simple clic suffit, le champ contenant l'url du dépôt officiel devrait déjà être pré-rempli.