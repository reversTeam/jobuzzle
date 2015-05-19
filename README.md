# <a name="Title">Generic Framework Front/Back</a>

1. <a href="#installation">Installation</a>
2. <a href="#configuration">Configuration</a>
    1. <a href="#configuration-language">Langues</a>
    2. <a href="#configuration-modules">Modules</a>
    3. <a href="#configuration-router">Routeur</a>
    4. <a href="#configuration-servicelocator">Service Locator</a>
    5. <a href="#configuration-environnement">Environnement</a>
    6. <a href="#configuration-translation">Traduction</a>
3. <a href="#autoload">Autoload</a>
4. <a href="#dispatcher">Dispatcher</a>
5. <a href="#factory">Factory</a>
6. <a href="#initializer">Initializer</a>
7. <a href="#manager">Manager</a>
    1. <a href="#manager-service">Service Manager</a>
    2. <a href="#manager-route">Route Manager</a>
    3. <a href="#manager-template">Template Manager</a>
    4. <a href="#manager-models">Model Manager</a>
    5. <a href="#manager-entity">Entity Manager</a>
    6. <a href="#manager-controller">Controller Manager</a>
8. <a href="#route">Route</a>
9. <a href="#service">Service</a>
10. <a href="#router">Routeur</a>
11. <a href="#servicelocator">ServiceLocator</a>
12. <a href="#translator">Translator</a>
13. <a href="#utility">Utility</a>
14. <a href="#modules">Modules</a>
    1. <a href="#modules-declaration">Déclaration</a>
    2. <a href="#modules-nomenclature">Nomenclature</a>


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

## <a name="configuration">Configuration</a>
La configuration du framework et de ses modules sont disponibles via l'objet `Config`, c'est un objet global. Les dossiers de configurations sont disponibles dans chacuns de vos modules et sont totalements flexibles, elles suivent l'architecture de votre dossier `Config` à quelques exeptions près, en effet un lien est créé entre les configurations de vos modules et les configurations du framework pour les rendres accessible via `Config['modules']['nom_du_module']`.
Dans le dossier `Config` de votre framework se trouve deux dossiers, `dev` et `prod`. C'est dans ce dossier que vous mettrez les configurations propres au différents environnements. Pour changer d'environnement, il vous suffit de modifier `env` dans le fichier `global.yml` qui se trouve dans le dossier de configuration de votre framework.

### <a name="configuration-language">Langues</a>
Le fichier `language.yml` disponible dans les configurations générales vous permettra de définir la langue par défaut de votre application, ainsi que les différentes langues disponibles. Exemple :
``` yaml
all:
	- EN_us
	- FR_fr
default : FR_fr
```
La variable `default` permet de définir une langue par défaut pour votre application, le <a href="#translator">Translator</a> se référera à la langue par défaut si une traduction était indisponible.

### <a name="configuration-modules">Modules</a>
Les configurations des modules servent à déclarer un module comme actif, ou alors à le désactiver. Si le module est désactivé, il ne sera pas chargé, et ses configurations ne seront pas accessible par le reste de votre application. Exemple :
```yaml
Example: true
ModuleName: true
ModuleDisable: false
```

### <a name="configuration-router">Routeur</a>
Le routeur s'occupe de construire ou de résoudre les routes qui lui sont envoyées. Ses configurations permettent de définir un controlleur et une méthode par défaut qui sera appellée lorsque le routeur cherchera à résoudre la route `/`. Nous déclarons aussi au routeur ce qu'il doit faire si une route est inconue ou alors si une erreur survenait. Exemple:
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
Le service locator est un objet, il est disponible partout dans votre application, le fichier de configuration détermine où se trouve la classe qu'il doit instancier et quel est le nom par lequel vous y ferez référence. On y distingue deux types d'objet, les `invokables` qui seront instanciés directement, et les `factories`, la factory est un objet intermédiaire qui vous permettra de configurer un objet avant utilisation. Exemple:
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
Les configuration d'environnement vous permettrons d'intéragir différemment avec votre application en fonction de votre environnement de développement (`dev`) ou celui de production (`prod`), vous êtes alors libre de créer votre propre arboréscence de dossier qui définira alors votre tableau de configuration.
L'environnement actif (`Config['global']['env']`) est disponible directement via l'objet de configuration sur la référence `Config['env']`.
Par exemple si vos configurations sont semblables à celle ci :
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

`Config.env.server.host` est égal à `v1.api.local.jobuzzle.dev` ce qui aurait été différent si vous aviez eu la configuration `env: prod`, dans ce cas `Config.env.server.host` aurait été `v1.api.jobuzzle.com`

### <a name="configuration-translation">Traduction</a>
Les configurations de traductions se trouve dans `Config/translation/...`. Vous avez un dossier pour chaque langue que vous avez configurer dans votre fichier `language.yml`. Dans ces dossiers se trouve un fichier `routes.yml`, qui sera utilisé seulement pour la traduction des routes de votre application.
Vous avez donc par exemple dans ce fichiers `routes.yml`
```yaml
create: creer
delete: supprimer
update: editer
```
Seul les routes ont un comportement un peu particulier car elles sont utilisées tel quel par le routeur au moment du match.
Le reste des traductions aura le même comportement, elles seront toutes disponibles via un system de key, en chaine de caractères avec comme caractères séparateur `.`. C'est à dire que si vous créer un fichier `header.yml` de ce type :
```yaml
menu:
    messages: Messages
    user_name: {{last_name}} {{first_name}}
    disconnect: Deconnexion
```
Vous utiliserez alors le translator de la facon suivante pour acceder aux différentes sections:
```javascript
var t = serviceLocator.get('Translator');
console.log(t.translate('header.menu.messages'));
console.log(t.translate('header.menu.user_name', {
    "last_name" : "Doe",
    "first_name" : "John"
}));
console.log(t.translate('header.menu.disconnect'));
```
Comme nous venons de le voir, nous avons la capacité de faire correspondre des segments de texte avec des variables passées en paramètres à la methode `translate` de notre `Translator`, pour cela il faut que la variable soit renseignée par `{{` `}}`

## <a name="autoload">Autoload</a>
L'objet `Autoload` charge les modules, chaque modules hérite de ce `MasterAutoload`, à son intialisation, il vient charger les Traduction, les `Route` et les `Service` du module qui est en train d'être instancié. La methode qui sera appellée juste apres le constructeur, sera la méthode `onBootstrap` qui ne fait rien dans le parent, elle permettra aux enfants d'effectuer des actions supplémentaires si elle le désire.

Voici la déclaration basique d'un Autoload : 
```javascript
#import (Config.path +'/Kernel/Autoload/MasterAutoload') = MasterAutoload;

class ExampleAutoload extends MasterAutoload {

    confModuleName = 'Example';

}

#export ExampleAutoload;
```


## <a name="dispatcher">Dispatcher</a>
L'objet `Dispatcher` gère les évenements, sont role permet à votre application d'avoir des points de branchement, afin de pouvoir plugger des actions à certaines étapes de l'éxecution de votre code. Pour ce faire, il met à votre disposion trois méthodes :
    1. trigger : Qui permet d'émettre un événement
    2. listen : Qui permet d'écouter un évenement
    3. unlisten : Qui permet de se déconnecter d'un événement

Lorsque l'on écoute un événement, trois scopes s'offrent à nous séparés par des `:` : 
    1. Module : C'est le module qui lance l'événement
    2. Class : C'est la classe qui a send cet événement
    3. Method : C'est la méthode dans la quel l'événement a été lancé

Il est possible de définir les scopes a `*` afin de :
    `Example:Test:*` : Je veux listen tous les events de la classe Test du module Example
    `*:Test:init` : Je veux listen tous les events de toutes les méthodes init de toutes les classes Test de tous les modules
    `Exemple:*:init` : Je veux listen tous les init de toutes les classe du module Example
    `*:*:*` : Je veux tout listen
    ...

Il est également possible de transmettre les paramêtre passés au trigger à ceux qui listen :
```javascript
var dispatcher = serviceLocator.get('Dispatcher');
dispatcher.trigger('Example:Test:init', 42);
```

Il sera ensuite catcher par une méthode de ce type :
```javascript
var dispatcher = serviceLocator.get('Dispatcher');

class obj {
    initialize: function () {
        dispatcher.listen('Example:Test:init', this, this.itsInit);
    }

    itsInit: function (name, id) {
        console.log('name: ' + name + ' - id: ' + id);
        if (id == 42)
            dispatcher.unlisten('Example:Test:init', this);
    }
}

var o = new obj();
```



## <a name="factory">Factory</a>
Les `Factory`, permettent de construire des objets et de set les attibuts de l'objet afin qu'il soit tout prêt à l'usage, vous pouvez créer plusieurs `factory` pour une même `invokables`. Afin d'avoir deux configurations d'objet pour deux contextes différents.
Dans notre exemple nous souhaitont avoir un objet qui sera instancié et qui aura dans ses attributs le `Translator` et le `Router`.

Pour ce faire nous créeons notre objet invokable comme ceci :
```javascript
class ExampleBookMainService {
    
    _translator = {};
    _router = {};

    #default get, set for _translator;
    #default get, set for _router;

}

#export ExampleBookMainService;
```
Les noms des modules doivent suivre cette convention, ainsi que les déclarations dans les managers afin de ne jamais écraser la classe d'un autre module:
`ModuleName``BundleName``Directory``NomDeClass``CurrentDir`
`./Modules/Example/Bundle/Book/Service/ExampleBookMainService`


Maintenant nous lui créeons une factory :
```javascript

#import (Config.path +'/Kernel/Factory/MasterFactory') = MasterFactory;

class ExampleBookServiceMainFactory extends MasterFactory {

    // Le nom de la Factory ajouter dans le manager
    invokableClassName = 'example_book_main_service';

    create : function (serviceManager) {
        // Dans obj nous avons notre invokable car c'est le parent qui se charge de nous instancié l'objet
        var obj = _super(serviceManager);

        obj.setTranslator(serviceLocator.get('Translator'));
        obj.setRouter(serviceLocator.get('Router'));

        return obj;
    }

}

#export ExampleBookServiceMainFactory;

```

## <a name="initializer">Initializer</a>
L'objet `Initializer` permet l'instanciation de différents composants du Framework, tels que les `Modules` ou encore les `Mediators`.
Actuellement nous avons le `ModuleIntializer`, c'est l'objet qui s'occupe de prendre les modules actifs et de charger chacunes des classes `Autoload` des modules, une fois l'objet instancié, il appelle directement la méthode `onBootstrap` de l'objet, comme nous le montre son code :
```javascript
    loadModules : function () {
        var basePath = Config['path'] +'/Modules';
        var req = {};
        var obj = {};

        for (var i in Config['modules']) {
            req = Utility.require(basePath +'/'+ i +'/'+ i + 'Autoload');
            obj = new req();
            obj.onBootstrap();
        }
    }
```

## <a name="manager">Manager</a>
Le design `Manager` est un objet qui permet de stocker des collections d'objets, il fonctionne un peu comme le serviceLocator, sauf qu'il n'est pas accessible dans le contexte global, mais aussi qu'il permet via la configuration `shared` de définir si l'objet qui sera retourné sera une nouvelle instance ou alors un singleton.

Nous avons actuellement deux type de manager `RouteManager` et `ServiceManager`. Chaque module intégre ses propres `Service` et ses propre routes, lorsque l'<a name"#initialize">Initializer</a> vient charger le module, le module injecte ses `Manager` au sein des différents managers disponibles dans le <a name="#servicelocator">ServiceLocator</a>. Pour ce faire il faut respecter la déclaration de ses composants, dans le dossier `Config` de votre module vous avez un fichier qui sera en liaison avec le manager en relation :
`route_manager.yml` c'est ici que l'on déclare les `RouteManager` de notre module afin qu'il soit injecté dans le manager principal :
```yaml
invokables:
    ExampleRoute: ExampleService
```
`service_manager.yml` c'est ici que l'on déclare les `ServiceManager` de notre module afin qu'il soit injecté dans le manager principal :
```yaml
factories:
    ExampleService: Factory/ExampleServiceFactory
invokables:
    ExampleService: ExampleService
shared :
    ExampleService : true
```

### <a name="#manager-service">Service Manager</a>
### <a name="#manager-route">Route Manager</a>
### <a name="#manager-template">Template Manager</a>
### <a name="#manager-models">Model Manager</a>
### <a name="#manager-entity">Entity Manager</a>
### <a name="#manager-controller">Controller Manager</a>


## <a name="route">Route</a>
Le design `Route` permet la déclaration des routes sous forme d'objet avec la notions d'héritage, ainsi une `Route` instanciée par cet objet, aura directement les routes suivantes :
```
/{name_route}
/{name_route}/{create}
/{name_route}/:id_name_route
/{name_route}/:id_name_route/{update}
/{name_route}/:id_name_route/{delete}
```
Nous distinguons dans cette exemple deux des trois types de routes qui sont à notre disposition :
    1. {name_route} : C'est une route de type `Translation` ce qui signifie que l'identifiant de la traduction est `name_route` et donc qu'il faut que vous ayez dans votre fichier `[Modules/ModulesName/]Config/translation/route.yml` la traduction correspondante.
    2. :id_name_route : C'est une route de type `Parameters` ce qui signifie que la valeur de ce paramètre sera régi par une regex et donc qu'il devra répondre à un type. Dans notre exemple il semble logique que le pattern correspond a ceci `[0-9]`
    3. name_route : Ce dernier type que nous n'avons pas vu dans notre exemple est un type `Litteral` c'est a dire qu'aucune action ne sera effectuée sur ce type de chaine, elle matchera seulement si la chaine est exactement la même.
Le fait d'utiliser des objets pour effectuer la création des routes va nous permettre de nous abstenir des choses rebarbatives tel que la redéclaration dans leurs intégralité si celle-ci sont plus ou moins similaires.

Admettons que dans notre application nous ayons besoin de créer des routes pour manipuler des entreprises, que nous les identifions par leurs marque dans nos url, mais que nous devions aussi manipuler des étudiants, mais que pour les étudiant nous préferons utiliser leurs id plutot que leurs nom, login ou prenom pour préserver leurs annonymat.
Nous ferons donc deux objets de route :
```javascript
#import (Config.path +'/Kernel/Route/MasterRoute') = MasterRoute;

class ExampleAuthorMainRoute extends MasterRoute {

    baseName = 'Author';
    baseRoute = '{authors}';
    baseController = 'Author';

    paramName : 'author_url';
    paramRegex : '[a-z0-9-]+';

}

#export ExampleAuthorMainRoute;
```

```javascript
#import (Config.path +'/Kernel/Route/MasterRoute') = MasterRoute;

class ExampleBookMainRoute extends MasterRoute {

    baseName = 'Book';
    baseRoute = '{books}';
    baseController = 'Book';

    paramName : 'book_id';

}

#export ExampleBookMainRoute;
```
Ainsi nous venons donc de créer toutes ses routes :
```
/{authors}
/{authors}/{create}
/{authors}/:author_url
/{authors}/:author_url/{update}
/{authors}/:author_url/{delete}

/{books}
/{books}/{create}
/{books}/:book_id
/{books}/:book_id/{update}
/{books}/:book_id/{delete}
```

## <a name="service">Service</a>
Le design `Service` n'à actuellement aucune logique générique. Les `Controller` et les `Mediator` intéragirons avec ces objet.

## <a name="router">Routeur</a>
L'objet `Router` s'occupe de gérer l'ensemble des routes de votre applications, que ce soit au niveau de la construction de l'ensemble des routes, des imbrications, de la résolution ou encore de la création des routes de votre applications, c'est cet objet qui fera votre affaire.
Le routeur vous donne la capacité de rajouter et imbriquer vos routes de la facon suivante :
```javascript
var routeManager = serviceLocator.get('routeManager');
var router = serviceLocator.get('Router');
var authorRoute = routeManager.get('exemple_author_main_route');
var bookRoute = routeManager.get('exemple_book_main_route');
router.addRoute('author', authorRoute);
router.getRoute('author').getRoute('view').addRoute('book', bookRoute);
```
Dans cet exemple nous venons d'imbriquer les routes de book dans celle de author, nos routes disponibles sont donc :
```javascript
/{authors}
/{authors}/{create}
/{authors}/:company
/{authors}/:author_url/{update}
/{authors}/:author_url/{delete}
/{authors}/:author_url/{books}
/{authors}/:author_url/{books}/{create}
/{authors}/:author_url/{books}/:book_id
/{authors}/:author_url/{books}/:book_id/{update}
/{authors}/:author_url/{books}/:book_id/{delete}
```

Le routeur peut maintenant procéder au match des urls entrantes:
```javascript
// Dans le cadre de la langue FR_fr
router.match('/auteurs/john-doe/livres/42/editer');

// Dans le cadre de la langue EN_us
router.match('/authors/john-doe/books/42/update');
```


## <a name="servicelocator">ServiceLocator</a>
Le `serviceLocator` est un objet déclaré dans le scope global de votre application, ce qui lui donne la particularitée d'être accessible partout au sein de votre application, il stock des objets de type `singleton`, c'est à dire que vous intéragirez toujours avec la même instance d'objet, peut importe le nombre de jets que vous effectuerez sur cette meme entitée.
Vous pouvez ajouter des objets à votre `serviceLocator` via son fichier de condiguration disponible à cet endroit `Config/servicelocator.yml`. On utilise le `serviceLocator` de cette facon.
```javascript
var serviceManager = serviceLocator.get('ServiceManager');
var router = serviceLocator.get('Router');
```
Le `serviceLocator` vous donne accès aux différents managers ainsi que des composants du Kernel comme le routeur. Pour plus de renseignement sur les capacitées de votre `serviceLocator` regardez votre configuration `Config/servicelocator.yml`.

Pour ajouter un service au sein de votre modules, vous devez aller l'ajouter dans le fichier de configuration suivant :
`Modules/Example/Config/service_manager.yml`
```yaml
factories:
    Example/Service: Factory/ExampleServiceFactory
invokables:
    Example/Service: ExempleService
shared:
    Example/Service : false
```
Dans le cas présent je déclare un invokable `ExampleService` qui sera toujours instancié via sa factory, et qui n'est pas partagé, donc qui me renverra toujours une nouvelle instantiation de l'objet.


## <a name="translator">Translator</a>
L'objet `Translator` est l'objet qui s'occupe du stockage et de la résolution des différentes traductions de votre application, il reprend la nomenclature de vos déclarations des traductions au sein de vos `Config/translate`. Il remet a plat toutes les traductions de tous vos modules et vous permet donc d'acceder à celles-ci et de les résoudres via une simple chaine de caractère `content.title`. vous pouvez aussi lui passer un tableau au format `JSON`, si la traduction que vous désirez résoudre contient des variables. La déclaration d'une variable au sein d'une traduction dois être préfixer de `{{` et post fixé par `}}` ce qui donne : `{{ma_var}}`

Le translator peut déclarer deux types de translate, celles qui sont communes à votre coeur d'application seront directement dans le dossier :
`Config/translation`
Celle qui sont spécifiques à un module :
`Modules/{MODULE_NAME}/Config/translation`
Dans ce dossier de translation, vous devez retrouver autant de dossiers, que vous avez déclaré de langues dans votre fichier de configuration :
`Config/language.yml`
```yaml
all:
    - EN_us
    - FR_fr
default : FR_fr
```
Dans le cas présent nous avons déclaré une langue `EN_us` et une langue `FR_fr` qui se trouve être notre langue par defaut. Dans le cas contraire, une traduction venait à manquer dans la langue courante de l'utilisateur, le `Translator` ira la chercher dans la langue par defaut, en cas d'echec, il renverra une chaine de ce type :
`{{ __EMPTY_TRANSLATION [NOM_DE_VARIABLE]__ }}`



## <a name="utility">Utility</a>
L'objet `Utility` est une interface en charge d'unifier les codes qui ont des spécificités, sur leurs cible d'éxécution, par exemple le processus de récupération d'une classe entre le serveur et le browser est différent.
Le browser à toutes les déclarations de ses classes accessible directement depuis l'objet `window`, alors que le serveur utilise le `require` pour faire référence à l'objet.
La surcouche Jpp nous permet via les `#targets` d'unifier l'usage au seins du Kernel, voicis notre exemple applicatif :
```javascript
#import ('fs') = fs;

var Utility = {
    'require': function (filename) {
        #target server;
            filename += '.js';
            if (!fs.existsSync(filename))
                throw "Unknow file [" + filename + "]";
            return require(filename);
        #else target;
            filename = filename.split('/');
            filename = filename[filename.length - 1];
            if (!window[filename])
                throw "Unknow class [" + filename + "]";
            return window[filename];
        #end target;
    }
}

#export Utility;
``` 


## <a name="modules">Modules</a>
Le design des `Modules`, sont les composants applicatifs de votre application. Le code spécifique qui va déterminer le fonctionnement de votre application. Il faut pour utiliser un `Module`, le déclarer dans le fichier `Config/modules.yml`. Sans cette déclaration il ne sera jamais instancié et donc en fonctionnement. Vous pouvez aussi désactiver un module en passant sa configuration à `false` dans ce meme fichier de configuration.

### <a name="#modules-declaration">Déclaration</a>
Exemple :
```yaml
Actif : true
Inactif : false
Other : true
```
Dans ce cas seul les `Modules` : `Actif` & `Other` seront chargés

### <a name="modules-nomenclature">Nomenclature</a>
Les dossiers respectent une certaine nomenclature, afin de préserver l'unicité des classes et la lisibilité des modules, car en effet deux classes du même nom se feraient écraser dans le front vu que tout est ramené à l'objet window. Il est donc très important de réspecter le nommage des fichiers qui doit correspondre à celui des classes, ainsi que le nommage des classes qui doivent être sous cette forme:
`ModuleName``BundleName``Directory``NomDeClass``CurrentDir`
`./Modules/Example/Bundle/Book/Service/ExampleBookMainService`

```
    Example/
        Assets/
        Bundle/
            Author/
                Route/
                    ExampleAuthorMainRoute.jpp
                Service/
                    ExampleAuthorMainService.jpp
                [...]
            Book/
                Route/
                    ExampleBookMainRoute.jpp
                Service/
                    Factory/
                        ExampleBookServiceMainFactory.jpp
                    ExampleBookMainService.jpp
                [...]
        Config/
            translation/
                EN_us/
                FR_fr/
```