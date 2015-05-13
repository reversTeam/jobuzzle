# <a name="Title">Generic Framework Front/Back</a>

1. <a href="#installation">Installation</a>
2. <a href="#configuration">Configurations Global</a>
    1. <a href="#configuration-language">Langues</a>
    2. <a href="#configuration-modules">Modules</a>
    3. <a href="#configuration-router">Router</a>
    4. <a href="#configuration-servicelocator">Service Locator</a>
    5. <a href="#configuration-environnement">Environement</a>
    6. <a href="#configuration-translation">Traduction</a>
3. <a href="#servicelocator">ServiceLocator</a>

## <a name="installation>Installation</a>
### Clone du dépot

```bash
git clone git@gitlab.jobuzzle.com:Jobuzzle/Framework.git --recursive
cd Framework
git submodule foreach --recursive git checkout -b g_remote origin/g_remote
git submodule foreach --recursive git checkout master
git checkout -b g_remote origin/g_remote
git remote add generic git@gitlab.jobuzzle.com:Generic/Framework.git
git submodule foreach --recursive npm install
```

## <a name="configuration">Configurations</a>
Les configuration du framework et de ses modules sont disponnible via l'object `Config` c'est un object globale. Les dossiers de configurations sont disponnible dans chaqu'un de vos modules et son totalement flexible, elles suivent l'architecture de votre dossier `Config` a quelque exeptions près, en effet un liens est créer entre les configurations de vos modules et les configuration du framework, pour les rendres accessible via  `Config['modules']['nom_du_module']`.
Dans le dossier `Config` de votre framework se trouve deux dossiers `dev` et `prod` c'est dans se dossier que vous mettrez les configurations propres au différents environements, pour changer d'environnement il vous suffis de modifier `env` dans le fichier `global.yml` qui se trouve dans le dossier de configuration de votre framework.

### <a name="configuration-language">Langues</a>
Le fichier `language.yml` disponible dans les configuration générale vous permettra de définir la langue par default de votre application, ainsi que les differents langues disponible, il a cette forme la :
``` yaml
all:
	- EN_us
	- FR_fr
default : FR_fr
```
La variable `default` permet de définir une langue par default pour votre application, le <a href="#translator">Translator</a> se référera a la langue par default si une traduction été indisponnible.

### <a name="configuration-modules">Modules</a>
Les configurations du modules servent a déclarer un module comme actif, ou alors a le desactiver. Si le module est désactiver, il ne sera pas charger les ses configurations ne seront pas accessible par le reste de votre application, il a ce format :
```yaml
Example: true
ModuleName: true
ModuleDisable: false
```

### <a name="configuration-router">Router</a>
Le router, est celui qui s'occupe de construire ou de résoudre des routes qui lui sont envoyer. Ses configuration permette de définir un controller et une méthode par default qui sera appeller lorsque le router cherchera a résoudre la route `/`. Nous déclarons aussi au router ce qu'il dois faire si une route est inconus ou alors si une erreur survenais. Voicis les configurations de base :
```yaml
default: 
    controller : ExampleController
    method : home
404:
    contoller: ErrorController
    method : error404
403:
    controller: ErrorController
    method: error403
```

### <a name="configuration-servicelocator">Service Locator</a>
Le service locator est un objet, il est disponnible partout dans votre application, le fichier de configuration permet de déterminé ou se trouve la class qu'il dois instancié et quel est le nom par lequel vous y ferez référence. On distingue deux type d'object, les `invokables` qui seront instancié directement, et les `factories`, la factory est un object intermédiaire qui vous permettra de configurer un object avant utilisations
```yaml
factories:
    Test : Path/To/TestFactory

invokables:
	Translator : Kernel/Translator
    RouteManager: Kernel/Managers/RouteManager
    ServiceManager: Kernel/Managers/ServiceManager
    ModuleInitializer: Kernel/Initializer/ModuleInitializer
    Router : Kernel/Router
    Dispatcher : Kernel/Dispatcher/DispatcherBase

```

### <a name="configuration-environnement">Environnement</a>
Les configuration d'environnement vous permettrons d'intéragire différemment avec votre application en fonction de si vous êtes en environnement de dévelloppement (`dev`) ou alors de production (`prod`), vous êtes libre de créer votre propre arboréscence de dossier qui définira alors votre tableau de configuration.
L'environnement actif (`Config['global']['env']`) est disponnible directement via l'objet de configuration sur la référence `Config['env']`.
Par exemple si vos configuration sont semblable a celle ci :
`Conf/dev/server.yml`
```yaml
host: v1.api.local.jobuzzle.dev
```

`Conf/prod/server.yml`
```yaml
host: v1.api.jobuzzle.com
```

`Config/global.yml`
```y
env: dev
```

`Config.env.server.host` est égale a `v1.api.local.jobuzzle.dev` ce qui aurait été différent si vous aviez eu la configuration `env: prod`, dans ce cas `Config.env.server.host` aurait été `v1.api.jobuzzle.com`

### <a name="configuration-translation">Traduction</a>
Les configurations de traduction se trouve dans `Config/translation/...`. Vous avez un dossier pour chaque langue que vous avez configurer dans votre fichier `language.yml`. Dans ces dossiers se trouve un fichier `routes.yml`, qui seras utiliser seulement pour la traduction des routes de votre application.
Vous avez donc par exemple dans ce fichiers `routes.yml`
```yaml
create: creer
delete: supprimer
update: editer
```
Seul les routes ont un comportement un peu particulier car elles sont utiliser tel quel par le router au moment du match.
Le reste des traductions aura le meme comportement, ils seront toutes disponible via un system de key, en chaine de caractères avec comme caracteres séparateur `.`. C'est a dire que si vous créer un fichier `header.yml` de ce type :
```yaml
menu:
    messages: Messages
    user_name: {{last_name}} {{first_name}}
    disconnect: Deconnexion
```
Vous utiliserais alors le translator de la facon suivante pour acceder au differentes sections:
```javascript
var t = serviceLocator.get('Translator');
console.log(t.translate('header.menu.messages'));
console.log(t.translate('header.menu.user_name', {
    "last_name" : "Doe",
    "first_name" : "John"
}));
console.log(t.translate('header.menu.disconnect'));
```
Comme nous venons de le voir nous avons la capacité de faire correspondre des segments de text avec des variables passer en parametres a la methode `translate` de notre `Translator`, pour cela il faut que la variable soit renseigné par `{{` `}}`

## <a name="servicelocator">ServiceLocator</a>
Le `serviceLocator` est un objet déclarer dans le scope globale de votre application ce qui lui donne la particularité d'être accèssible partout au seins de votre application, il stock des object de type `singleton`, c'est a dire que vous intéragirez toujours avec la même instance d'object peut importe le nombre de get que vous effecturer sur cette meme entité.
Vous pouvez ajouter des object a votre `serviceLocator` via son fichier de condiguration disponnible a cet endroi `Config/servicelocator.yml`. On utilise le `serviceLocator` de cette facon.
```javascript
var serviceManager = serviceLocator.get('ServiceManager');
var router = serviceLocator.get('Router');
```
Le `serviceLocator` vous donne accès au différents managers ainsi que des composant du Kernel comme le router. Pour plus de renseignement sur les capacité de votre `serviceLocator` regardez votre configuration `Config/servicelocator.yml`