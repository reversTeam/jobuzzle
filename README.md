# <a name="Title">Generic Framework Front/Back</a>

1. <a href="#installation">Installation</a>
2. <a href="#configuration">Configurations Global</a>
    1. <a href="#configuration-language">Langues</a>
    2. <a href="#configuration-modules">Modules</a>
    3. <a href="#configuration-router">Router</a>
    4. <a href="#configuration-servicelocator">Service Locator</a>
    5. <a href="#configuration-environnement">Environement</a>
    6. <a href="#configuration-translation">Traduction</a>
3. <a href="#autoload">Autoload</a>
4. <a href="#dispatcher">Dispatcher</a>
5. <a href="#factory">Factory</a>
6. <a href="#initializer">Initializer</a>
7. <a href="#manager">Manager</a>
8. <a href="#route">Route</a>
9. <a href="#service">Service</a>
10. <a href="#router">Router</a>
11. <a href="#servicelocator">ServiceLocator</a>
12. <a href="#translator">Translator</a>
13. <a href="#utility">Utility</a>
14. <a href="#modules">Modules</a>


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

## <a name="autoload">Autoload</a>
L'objet `Autoload` est celui qui si charge de loader les modules, chaque modules herite de ce `MasterAutoload`, a son intialisation il vient loader les Traduction, les `Route` et les `Service` du module qui est en train d'être instancié. La methode qui sera appeller juste apres le constructeur, sera la méthod `onBootstrap` qui ne fait rien dans le parent, elle permettra au enfant d'effectué des actions supplémentaire si elle le désire.

Voici la déclaration Basic d'un Autoload : 
```javascript
#import (Config.path +'/Kernel/Autoload/MasterAutoload') = MasterAutoload;

class ExampleAutoload extends MasterAutoload {

    confModuleName = 'Example';

}

#export ExampleAutoload;
```


## <a name="dispatcher">Dispatcher</a>
L'objet `Dispatcher` est celui qui gere les évenements, sont role est de permettre a votre application d'avoir des points de branchement, afin de pouvoir plugger des actions a certain étape de l'éxecution de votre code. Pour se faire il met a votre disposion trois méthode :
    1. trigger : Qui permet d'émettre un événement
    2. listen : Qui permet d'écouter un évenement
    3. unlisten : Qui permet de se deconnecter d'un événement

Lorsque l'on écoute un événement on a la trois scope qui s'offre a nous séparer par des `:`, c'est scope sont enfaite 
    1. Module : C'est le module qui lance l'événement
    2. Class : C'est la class qui a send cet événement
    3. Method : C'est la méthod dans la quel l'événement a été lancé

Il est possible de définir les scope a `*` afin de dire par exemple :
    `Example:Test:*` : Je veux listen tous les event de la class Test du module Example
    `*:Test:init` : Je veux listen tous les events de toutes les méthod init de toutes les classe Test de tous les modules
    `Exemple:*:init` : Je veux listen tous les init de toutes les classe du module Example
    `*:*:*` : Je veux tous listen
    ...

Il est également possible de transmettre des paramêtre du trigger a ceux qui listen, de cette facon :
```javascript
var dispatcher = serviceLocator.get('Dispatcher');
dispatcher.trigger('Example:Test:init', [ 42 ]);
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
Les `Factory`, permettent de construire des objects et de setter les attibuts de l'objet afin qu'il soit tout prêt à l'usage, vous pouvez créer plusieurs `factory` pour une même `invokables`. Afin d'avoir deux configurations d'objet pour deux context différents.
Dans notre exemple nous souhaiton avoir un object qui sera instancié et qui aura dans ses attribut le `Translator` et le `Router`.

Pour ce faire nous créeons notre objec invokable comme ceci :
```javascript
class Example {
    
    _translator = {};
    _router = {};

    #default get, set for _translator;
    #default get, set for _router;

}
```
Maintenant nous lui créeons une factory :
```javascript

#import (Config.path +'/Kernel/Factory/MasterFactory') = MasterFactory;

class ExampleFactory extends MasterFactory {

    // Le nom de la Factory ajouter dans le manager
    invokableClassName = 'Exemple';

    create : function (serviceManager) {
        // Dans obj nous avons notre invokable car c'est le parent qui se charge de nous instancié l'objet
        var obj = _super(serviceManager);

        obj.setTranslator(serviceLocator.get('Translator'));
        obj.setRouter(serviceLocator.get('Router'));

        return obj;
    }

}

#export ExampleFactory;

```

## <a name="initializer">Initializer</a>
L'objet `Initializer` permet l'initialisation de différents composants du Framework, tels que les `Modules` ou encore les `Mediators`.
Actuellement nous avons le `ModuleIntializer`, c'est l'objet qui s'occupe de prendre les modules actif et de charger chacune des classe `Autoload` des modules, une fois l'objet instancier il appelle directement la méthode `onBootstrap` de l'object, comme nous le montre son code :
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
Le design `Manager` est un objet qui permet de stocker des collections d'objet, il fonctionne un peu comme le serviceLocator, sauf qu'il n'est pas accessible dans le context globale, mais aussi qu'il permet via la configuration `shared` de définir si l'objet qui sera retourné sera une nouvelle instance ou alors un singleton.

Nous avons actuellement deux type de manager `RouteManager` et `ServiceManager`. Chaque module intégre ses propres `Service` et ses propre routes, lorsque l'<a name"#initialize">Initializer</a> vien loader le module, le module inject ses `Manager` au sein des différent managers disponnible dans le <a name="#servicelocator">ServiceLocator</a>. Pour ce faire il faut respecter la déclaration de ses composant, dans le dossier `Config` de votre module vous avez un fichier qui sera en liaison avec le manager en relation :
`route_manager.yml` c'est ici qu'on déclare les `RouteManager` de notre module afin qu'il soit injecter dans le manager principle :
```yaml
invokables:
    ExampleRoute: ExampleService
```
`service_manager.yml` c'est ici qu'on déclare les `ServiceManager` de notre module afin qu'il soit injecter dans le manager principle :
```yaml
factories:
    ExampleService: Factory/ExampleServiceFactory
invokables:
    ExampleService: ExampleService
shared :
    ExampleService : true
```


## <a name="route">Route</a>
Le design `Route`, il permet la déclaration des routes sous forme d'objet avec la notions d'héritage ainsi une `Route` instancié par cet objet, aura directement les routes suivantes :
```
/{name_route}
/{name_route}/{create}
/{name_route}/:id_name_route
/{name_route}/:id_name_route/{update}
/{name_route}/:id_name_route/{delete}
```
Nous distinguon dans cette exemple deux des trois type de routes qui sont a notre disposition, en effets :
    1. {name_route} : C'est une route de type `Translation` ce qui signifie que l'identifiant de la traduction est `name_route` et donc qu'il faut que vous ayez dans votre fichier `[Modules/ModulesName/]Config/translation/route.yml` la traduction correspondante
    2. :id_name_route : C'est une route de type `Parameters` ce qui signigie que la valeur de ce parametre sera régie par une regex et donc qu'il devra répondre a un type dans notre exemple il semble logique que le pattern corresponde a ceci `[0-9]`
    3. name_route : Ce dernier type que nous n'avons pas vue dans notre exemple est un type `Litteral` c'est a dire qu'aucune action ne sera effectuer sur ce type de chaine, elle matchera seulement si la chain est exactement la meme
Le fait d'utiliser des objects pour effectuer la création des routes va nous permettre de nous abstenir des choses rebarbatives tel que la redéclaration dans leurs intégralité si celle-ci sont plus ou moins similaire.

Adméton que dans notre application nous ayons besoins de créer des routes pour maninuper des entreprise que nous les identifions par leurs marque dans nos url, mais que nous devions aussi manipuler des étudiants, mais que pour les étudiant nous preferons utiliser leurs id plutot que leurs nom, login ou prenom pour préserver leurs annonymat.
Nous feront donc deux objets de routes :
```javascript
#import (Config.path +'/Kernel/Route/MasterRoute') = MasterRoute;

class CompanyRoute extends MasterRoute {

    baseName = 'Company';
    baseRoute = '{companies}';
    baseController = 'Company';

    paramName : 'company_url';
    paramRegex : '[a-z0-9-]+';

}

#export CompanyRoute;
```

```javascript
#import (Config.path +'/Kernel/Route/MasterRoute') = MasterRoute;

class StudentRoute extends MasterRoute {

    baseName = 'Student';
    baseRoute = '{students}';
    baseController = 'Student';

    paramName : 'student_id';
    paramRegex : '[0-9]+';

}

#export StudentRoute;
```
Ainsi nous venons donc de créer toutes ses routes :
```
/{companies}
/{companies}/{create}
/{companies}/:company_url
/{companies}/:company_url/{update}
/{companies}/:company_url/{delete}

/{students}
/{students}/{create}
/{students}/:student_id
/{students}/:student_id/{update}
/{students}/:student_id/{delete}
```

## <a name="service">Service</a>
Le design `Service` n'a actuellement aucune logique générique. Les `Controller` et les `Mediator` intéragirons avec ses objet.

## <a name="router">Router</a>
L'objet `Router` s'occupe de gerer l'ensemble des routes de votre applications, que ce soit au niveau de la construction de l'ensemble des routes, des imbrications, de la résolution ou encore de la création des routes de votre applications, c'est cet objet fera votre affaire.
Le router vous donne la capacité de rajouter et imbriquer vos routes de la facon suivante :
```javascript
var routeManager = serviceLocator.get('routeManager');
var router = serviceLocator.get('Router');
var companyRoute = routeManager.get('CompanyRoute');
var studentRoute = routeManager.get('StudentRoute');
router.addRoute('company', companyRoute);
router.getRoute('company').getRoute('view').addRoute('student', studentRoute);
```

Dans cet exemple nous venons d'imbriquer les routes de students dans celle de company, nos routes disponibles sont donc :
```javascript
/{companies}
/{companies}/{create}
/{companies}/:company
/{companies}/:company_url/{update}
/{companies}/:company_url/{delete}
/{companies}/:company_url/{students}
/{companies}/:company_url/{students}/{create}
/{companies}/:company_url/{students}/:student_id
/{companies}/:company_url/{students}/:student_id/{update}
/{companies}/:company_url/{students}/:student_id/{delete}
```

Le router peut maintenant procédé au match des urls entrante:
```javascript
// Dans le cadre de la langue FR_fr
router.match('/entreprises/google/etudiants/theotime-riviere/editer');

// Dans le cadre de la langue EN_us
router.match('/companies/google/students/theotime-riviere/update');
```


## <a name="servicelocator">ServiceLocator</a>
Le `serviceLocator` est un objet déclarer dans le scope globale de votre application ce qui lui donne la particularité d'être accèssible partout au seins de votre application, il stock des object de type `singleton`, c'est a dire que vous intéragirez toujours avec la même instance d'object peut importe le nombre de get que vous effecturer sur cette meme entité.
Vous pouvez ajouter des object a votre `serviceLocator` via son fichier de condiguration disponnible a cet endroi `Config/servicelocator.yml`. On utilise le `serviceLocator` de cette facon.
```javascript
var serviceManager = serviceLocator.get('ServiceManager');
var router = serviceLocator.get('Router');
```
Le `serviceLocator` vous donne accès au différents managers ainsi que des composant du Kernel comme le router. Pour plus de renseignement sur les capacité de votre `serviceLocator` regardez votre configuration `Config/servicelocator.yml`

Pour ajouter un service au seins de votre modules vous devez aller l'ajouter dans le fichier de configuration suivant :
`Modules/Example/Config/service_manager.yml`
```yaml
factories:
    Example/Service: Factory/ExampleServiceFactory
invokables:
    Example/Service: ExempleService
shared:
    Example/Service : false
```
Dans le cas présent je déclare un invokable `ExampleService` qui sera toujours instancié via sa factory, et qui n'est pas partager, donc qui me renverra toujours une nouvelle instanication de l'objet.


## <a name="translator">Translator</a>
L'objet `Translator` est l'objet qui s'occupe du stockage et de la résolutions des différentes traductions de votre application, il reprend la nomenclature de vos déclaration des traduction au seins de vos `Config/translate`. Il remet a plat toutes les traduction de tous vos modules et vous permet donc d'acceder a celle ci et de les résoudre via une simple chaine de caractère `content.title`. vous pouvez aussi lui passer un tableau au format `JSON`, si la traduction que vous désirez résoudre contient des variables. La déclarations d'une variable au seins d'une traduction dois être préfixer de `{{` et post fixé par `}}` ce qui donne : `{{ma_var}}`

Le translator peut déclarer deux type de translate celle qui sont commune a votre coeur d'applications seront directement dans le dossier :
`Config/translation`
Celle qui sont spécifique a un module :
`Modules/{MODULE_NAME}/Config/translation`
Dans ce dossier de translation vous devez retrouver autant de dossier que vous avez déclarer de langues dans votre fichier de configuration :
`Config/language.yml`
```yaml
all:
    - EN_us
    - FR_fr
default : FR_fr
```
Dans le cas présent nous avons déclarer une langue `EN_us` et une langue `FR_fr` qui se trouve être notre langue par default c'est a dire que si une traduction venais a manquer dans la langue courente de l'utilisateurs, le `Translator` ira la chercher dans la langue par default, et si il ne la trouve toujours pas il revera une chaine de ce type :
`{{ __EMPTY_TRANSLATION [NOM_DE_VARIABLE]__ }}`



## <a name="utility">Utility</a>
L'object `Utility` est une interface en charge d'unifier les codes qui ont des spécificité, sur leurs cible d'éxécution, par exemple le process de récupération d'une classe entre le serveur et le browser est différents.
Le browser a toutes la déclarations de ses classes accessible directement depuis l'objet `window`, alors que le serveur utilise le require pour faire référence a l'objet.
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
Le design des `Modules`, ce sont les composant applicatif de votre application, le code spécifique qui va déterminer le fonctionnement de votre application. Il faut pour utiliser un `Module`, le déclarer dans le fichier `Config/modules.yml` sans cette déclaration il ne sera jamais instancié et donc en fonctionnement. Vous pouvez aussi disable un module en passant sa configuration a `false` dans ce meme fichier de configuration.
Example :
```yaml
Actif : true
Inactif : false
Other : true
```
Dans ce cas seul les `Modules` : `Actif` & `Other` seront loader