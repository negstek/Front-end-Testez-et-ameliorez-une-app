# Cartographie des tests — état initial du fork

*Basé uniquement sur les 3 fichiers `.spec.ts` du dépôt d'origine (`upstream/main`, commit `2a2d0e9` « first commit »), avant toute modification apportée dans ce fork.*

Ce document ne décrit pas le code applicatif lui-même, seulement ce que les tests fournis à l'origine couvrent réellement — mesuré en exécutant `npx jest --coverage` directement sur ce commit.

## Résultat mesuré

`3 suites · 4 tests` — tous verts.

| Instructions | Branches | Fonctions | Lignes |
|---|---|---|---|
| 85.1% | **0%** | 25% | 83.6% |

| Fichier testé | Instr. | Lignes | Lignes non couvertes |
|---|---:|---:|---|
| `app.component.ts` | 100% | 100% | — |
| `user.service.ts` | 83.3% | 80.0% | 13 |
| `user-mock.service.ts` | 66.7% | 66.7% | 8 |
| `register.component.ts` | 62.5% | 59.1% | 35–61 |
| `material.module.ts` | 100% | 100% | — |

## Rappel — à quoi sert `TestBed`

Les 3 fichiers ci-dessous s'appuient tous sur `TestBed`, l'utilitaire d'Angular qui crée un module Angular minimal et jetable pour chaque test, afin de pouvoir instancier composants et services avec une vraie injection de dépendances (au lieu d'un simple `new MaConsClasse()`, impossible dès qu'il y a un décorateur ou une dépendance injectée).

Trois usages différents apparaissent dans ce dépôt d'origine :

- `TestBed.configureTestingModule({...})` déclare, pour un test donné, quels composants/imports et quels `providers` (services, éventuellement mockés) seront disponibles — l'équivalent d'un `@NgModule` réduit au strict nécessaire du test.
- `TestBed.inject(UserService)` (dans `user.service.spec.ts`) récupère une instance du service telle que le conteneur d'injection de dépendances l'aurait construite, sans passer par un composant.
- `TestBed.createComponent(AppComponent)` / `TestBed.createComponent(RegisterComponent)` instancie réellement un composant à l'intérieur du module configuré, et retourne une `ComponentFixture` donnant accès à l'instance (`fixture.componentInstance`) et au DOM rendu ; `fixture.detectChanges()` déclenche le premier cycle de détection de changements (exécute `ngOnInit`, met à jour le template).

C'est ce mécanisme qui explique une partie du constat plus bas : la couverture mesurée provient surtout du code exécuté *automatiquement* par Angular lors de la création (constructeurs, `ngOnInit` via `detectChanges()`), pas de méthodes appelées intentionnellement par les tests.

### Analogie avec Spring Boot

`TestBed` n'est pas l'équivalent de `MockMvc` : `MockMvc` simule une requête HTTP entrante à travers le `DispatcherServlet` (routing, désérialisation, statut de réponse), alors que `TestBed` construit un conteneur d'injection de dépendances partiel pour instancier composants/services — un rôle plus proche de `@SpringBootTest` / `@ContextConfiguration`. L'équivalent côté Angular de `MockMvc` (intercepter/vérifier des échanges HTTP simulés) est plutôt `HttpClientTestingModule` + `HttpTestingController`, mais appliqué aux appels *sortants* du client, pas aux requêtes *entrantes* d'un contrôleur.

| Spring | Angular | Rôle |
|---|---|---|
| `@SpringBootTest` / contexte de test | `TestBed.configureTestingModule` | Construire un conteneur DI partiel pour le test |
| `MockMvc` | `HttpClientTestingModule` + `HttpTestingController` | Intercepter/vérifier des échanges HTTP simulés |

## Détail des 3 fichiers de test

### `app.component.spec.ts` — 2 tests

```ts
it('should create the app', () => { ... expect(app).toBeTruthy(); });
it(`should have the 'etudiant-frontend' title`, () => { ... expect(app.title).toEqual('etudiant-frontend'); });
```

Instancie `AppComponent` (aucune dépendance externe à l'époque) et vérifie deux choses triviales : que le composant se crée, et que la propriété `title` a la bonne valeur. Aucune interaction, aucun rendu de template vérifié au-delà de la compilation implicite.

### `user.service.spec.ts` — 1 test

```ts
beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideHttpClient()] });
  service = TestBed.inject(UserService);
});

it('should be created', () => { expect(service).toBeTruthy(); });
```

Un seul test, qui vérifie seulement que le service s'instancie. Aucune requête HTTP n'est simulée : ni `HttpClientTestingModule` ni `HttpTestingController` ne sont utilisés, donc `register()` (la seule méthode du service à l'époque) n'est jamais appelée par un test — `provideHttpClient()` est fourni mais rien ne s'en sert.

### `register.component.spec.ts` — 1 test

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [RegisterComponent],
    providers: [
      provideHttpClient(),
      { provide: UserService, useValue: UserMockService },
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(RegisterComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

it('should create', () => { expect(component).toBeTruthy(); });
```

Un seul test, qui vérifie seulement que le composant se crée après un premier `detectChanges()`. Deux défauts se cumulent dans ce câblage, visibles directement dans le fichier de test :

- `useValue: UserMockService` fournit la **classe** elle-même, pas une instance (`new UserMockService()`) — `component.userService` vaut donc la fonction constructeur, pas un objet avec une méthode `register()` appelable.
- Même si le mock était correctement instancié, `UserMockService.register()` (dans `user-mock.service.ts`) retourne `of()` **sans argument** : cet observable ne notifie jamais `next()`, donc rien ne se produirait de toute façon après soumission.

Le seul test présent ne soumet jamais le formulaire (`onSubmit()` n'est pas appelé), donc ces deux défauts ne font échouer aucun test — ils resteraient invisibles sans lecture du code.

## Ce qui n'est testé nulle part

- **Aucune interaction utilisateur** : aucun test ne remplit un champ (`FormControl.setValue`), ne soumet un formulaire, ni ne clique un bouton.
- **Aucune branche de validation** : les `Validators.required` sur les 4 champs de `RegisterComponent` ne sont exercés par aucun test (cohérent avec les 0% de branches mesurés).
- **Aucun appel réseau réel simulé** : ni `user.service.spec.ts` ni `register.component.spec.ts` n'utilisent `HttpTestingController` pour vérifier qu'une requête `POST /api/register` est bien envoyée, ni son contenu.
- **Aucune vérification du résultat après succès** : le `alert('SUCCESS!! :-)')` de `onSubmit()` n'est jamais atteint par un test.
- **Le routage n'est pas testé** : aucune spec ne vérifie que `/register` affiche `RegisterComponent`, ni le comportement de la route racine `''`.

## Constat

Les 4 tests fournis à l'origine sont des tests dits « de fumée » (*smoke tests*) : ils vérifient uniquement que les classes s'instancient sans lever d'exception. Le 85.1% d'instructions couvertes est trompeur — il vient du fait qu'Angular exécute le corps des constructeurs et des initialiseurs de champs (dont `ngOnInit`, via le premier `detectChanges()`) simplement pour créer les composants, sans qu'aucune méthode métier ne soit jamais appelée intentionnellement. Le 0% de branches en est la preuve la plus directe : aucune condition (validation de formulaire, succès/erreur réseau) n'est jamais évaluée par les deux issues possibles.

---

*Généré à partir d'une exécution réelle de `npx jest --coverage` sur `upstream/main` (commit `2a2d0e9`), le 11 septembre 2026.*
