# Plan de tests à écrire — Front-end

Ce document liste les cas de tests à écrire pour ce projet, en deux étapes : des tests unitaires/intégration (Jest) puis des tests end-to-end (Cypress). Il s'appuie sur les comportements attendus identifiés dans `archi_test_ini.md` (état initial du fork) et `architecture.md` (état actuel du code).

## Feuille de route

### Étape 1 — Tests unitaires & d'intégration (Jest)

| | |
|---|---|
| **Outil** | Jest |
| **Prérequis** | Avoir lu la documentation Jest ([Getting Started](https://jestjs.io/docs/getting-started), [Unit Testing with Mocks and Spies](https://jestjs.io/docs/mock-functions)) |
| **Résultat attendu** | Tous les services et composants sont couverts par les tests · tous les tests s'exécutent avec succès · couverture ≥ 80% sur le front-end |
| **Recommandations** | Commencer par les cas de tests les plus simples · réaliser en priorité les tests des services |

### Étape 2 — Tests E2E (Cypress)

| | |
|---|---|
| **Outil** | Cypress |
| **Prérequis** | Avoir lu la [documentation Cypress](https://docs.cypress.io/) |
| **Résultat attendu** | Tous les écrans sont couverts par des tests E2E · tous les tests E2E s'exécutent avec succès · couverture ≥ 80% sur la partie E2E |
| **Recommandations** | Commencer par les formulaires les plus simples (inscription, connexion), puis évoluer vers les écrans plus complexes · mocker les appels d'API avec `cy.intercept()` |
| **Point de vigilance** | Avant d'implémenter un nouveau test E2E, s'assurer que le précédent fonctionne normalement |

### Étape 3 (à des fins d'apprentissage) — Tests d'acceptation avec Cucumber

| | |
|---|---|
| **Outil** | Cucumber (`@badeball/cypress-cucumber-preprocessor`, exécuté au-dessus de Cypress) |
| **Objectif** | Découvrir l'approche BDD (Behavior-Driven Development) : quelques scénarios d'acceptation existants sont réécrits en Gherkin (`Given/When/Then`), en supplément de la suite Cypress de l'étape 2 — celle-ci reste la référence pour la couverture E2E |
| **Portée** | Un nombre volontairement restreint de scénarios (ex. connexion, création d'un étudiant), pas une réécriture complète du plan E2E |
| **Résultat attendu** | Les scénarios `.feature` choisis s'exécutent avec succès et démontrent la mécanique Gherkin → step definitions → Cypress |

---

## Étape 1 — Détail des cas de tests Jest

### La pyramide appliquée à ce projet

```text
        ▲
       /█\        Tests end-to-end — voir Étape 2 (Cypress)       ┐
      /███\                                                       │
     /█████\                                                      │  Cucumber (Gherkin) — voir Étape 3
    /███████\      Tests d'intégration — composant + template,    │  reformule en Given/When/Then une
   /█████████\      backend simulé (HttpTestingController)        │  sélection de scénarios existants,
  /███████████\                                                   │  transversal à la pyramide plutôt
 /█████████████\   Tests unitaires — fonctions pures, services,   │  qu'un niveau supplémentaire
/███████████████\   guards, intercepteurs, validité de formulaires┘
```

Le plus grand nombre de cas se trouve en bas de la pyramide (rapides, isolés, aucune dépendance au DOM), le plus petit nombre en haut. On commence par le bas. Cucumber n'ajoute pas un quatrième niveau : c'est une *formulation* (Gherkin) qui peut s'appliquer à n'importe quel niveau — ici, elle habille une sélection de scénarios E2E déjà couverts par Cypress (étape 2), elle ne les remplace pas.

### 1. Tests unitaires — fonctions pures

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 1.1 | `decodeJwt()` décode un payload JWT valide | `core/utils/jwt.util.ts` | `"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZG9lIn0.sig"` | `{ sub: "jdoe" }` |

### 2. Tests unitaires — services (backend simulé)

Le service est instancié seul via `TestBed`, avec `provideHttpClientTesting()` pour simuler les réponses du backend sans réseau réel.

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 2.1 | `UserService.register()` transmet le bon payload | `core/service/user.service.ts` | `{ firstName, lastName, login, password }` | Requête `POST /api/register` avec ce payload exact |
| 2.2 | `UserService.login()` extrait le token de la réponse | `core/service/user.service.ts` | Réponse backend simulée `{ token: "abc" }` | L'observable émet la chaîne `"abc"` |
| 2.3 | `StudentService.getAll()` retourne la liste | `core/service/student.service.ts` | Réponse simulée : tableau de 2 `StudentResponse` | L'observable émet ce même tableau ; requête `GET /api/students` |
| 2.4 | `StudentService.getById(id)` retourne un étudiant | `core/service/student.service.ts` | `id = 5`, réponse simulée `{ id: 5, ... }` | L'observable émet cet objet ; requête `GET /api/students/5` |
| 2.5 | `StudentService.create()` envoie le bon payload | `core/service/student.service.ts` | `StudentRequest` valide | Requête `POST /api/students` avec ce payload ; l'observable émet le `StudentResponse` renvoyé |
| 2.6 | `StudentService.update(id, student)` envoie le bon payload | `core/service/student.service.ts` | `id = 5`, `StudentRequest` valide | Requête `PUT /api/students/5` avec ce payload |
| 2.7 | `StudentService.delete(id)` cible la bonne URL | `core/service/student.service.ts` | `id = 5` | Requête `DELETE /api/students/5` |

### 3. Tests unitaires — guards et intercepteurs fonctionnels

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 3.1 | `authGuard` autorise un utilisateur connecté | `core/guards/auth.guard.ts` | `UserService.isLoggedIn()` renvoie `true` | Le guard renvoie `true` |
| 3.2 | `jwtInterceptor` ajoute l'en-tête `Authorization` | `core/interceptors/jwt.interceptor.ts` | Un JWT `"abc"` est présent en `localStorage`, requête sortante quelconque | La requête transmise à `next()` porte l'en-tête `Authorization: Bearer abc` |

### 4. Tests unitaires — validité des formulaires réactifs

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 4.1 | `loginForm` valide une fois les deux champs remplis | `pages/login/login.component.ts` | `{ login: "jdoe", password: "secret" }` | `loginForm.valid === true` |
| 4.2 | `registerForm` valide une fois les quatre champs remplis | `pages/register/register.component.ts` | 4 champs renseignés | `registerForm.valid === true` |
| 4.3 | `studentForm` valide un email bien formé | `pages/student-form/student-form.component.ts` | `email: "ada@example.com"` (+ autres champs valides) | `studentForm.valid === true` |
| 4.4 | `StudentFormComponent.isEditMode` distingue création/édition | `pages/student-form/student-form.component.ts` | `studentId = null` puis `studentId = 3` | `false` puis `true` |

### 5. Tests d'intégration — composant + template + backend simulé (cas nominal)

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 5.1 | `StudentListComponent` affiche la liste reçue | `pages/student-list/student-list.component.ts` | Backend simulé renvoie 2 étudiants | `component.students` contient ces 2 éléments ; le template affiche 2 lignes |
| 5.2 | `StudentDetailComponent` affiche l'étudiant demandé | `pages/student-detail/student-detail.component.ts` | Route avec `id = 1`, backend simulé renvoie ce `StudentResponse` | `component.student` égal à l'objet renvoyé |
| 5.3 | `HeaderComponent` affiche le nom d'utilisateur connecté | `shared/header/header.component.ts` | `username$` émet `"jdoe"` | Le template affiche `"jdoe"` (menu utilisateur) |
| 5.4 | `HeaderComponent` affiche le lien de connexion si déconnecté | `shared/header/header.component.ts` | `username$` émet `null` | Le template affiche le lien « Se connecter » |
| 5.5 | `HomeComponent` salue l'utilisateur connecté | `pages/home/home.component.ts` | `username$` émet `"jdoe"` | Le template contient le texte « Bienvenue, jdoe ! » |

### 6. Cas d'erreur et branches alternatives — nécessaires pour les 80% de couverture

Ces cas complètent les précédents pour exercer les branches non couvertes par les seuls scénarios nominaux (gestion des erreurs réseau, accès refusé, validation).

| # | Test | Fichier | Entrée | Sortie attendue |
|---|---|---|---|---|
| 6.1 | `LoginComponent` distingue identifiants invalides | `pages/login/login.component.ts` | Backend simulé répond `401` | `component.invalidCredentials === true`, `component.serverUnreachable === false` |
| 6.2 | `LoginComponent` détecte un backend injoignable | `pages/login/login.component.ts` | Backend simulé répond `500` (ou statut `0`) | `component.serverUnreachable === true`, `component.invalidCredentials === false` |
| 6.3 | `authGuard` refuse un utilisateur non connecté | `core/guards/auth.guard.ts` | `UserService.isLoggedIn()` renvoie `false` | Le guard renvoie `false` |
| 6.4 | `jwtInterceptor` laisse passer une requête sans token | `core/interceptors/jwt.interceptor.ts` | Aucun JWT en `localStorage` | La requête transmise à `next()` n'a pas d'en-tête `Authorization` |
| 6.5 | `StudentListComponent` signale une erreur de chargement | `pages/student-list/student-list.component.ts` | Backend simulé répond en erreur sur `GET /api/students` | `component.loadError === true` |
| 6.6 | `StudentDetailComponent` signale un étudiant introuvable | `pages/student-detail/student-detail.component.ts` | Backend simulé répond `404` sur `GET /api/students/:id` | `component.notFound === true` |
| 6.7 | `StudentFormComponent` signale une erreur serveur à la soumission | `pages/student-form/student-form.component.ts` | Backend simulé répond en erreur sur `POST`/`PUT` | `component.serverError === true` |
| 6.8 | `RegisterComponent`/`LoginComponent` bloquent un formulaire invalide | `pages/register/register.component.ts`, `pages/login/login.component.ts` | Un champ requis est vide, `onSubmit()` appelé | Le service (`register()`/`login()`) n'est jamais appelé ; `submitted === true` |

---

## Étape 2 — Détail des scénarios E2E (Cypress)

> Cypress n'est pas encore installé/configuré dans ce projet — un prérequis technique avant de pouvoir exécuter cette étape est d'ajouter la dépendance et la configuration de base (`cypress.config.ts`, dossier `cypress/e2e`).

Chaque scénario mocke les appels API concernés via `cy.intercept()`, du formulaire le plus simple vers les écrans les plus complexes.

| # | Écran | Scénario | Mock API (`cy.intercept`) | Résultat attendu |
|---|---|---|---|---|
| 1 | Inscription | Remplir le formulaire avec des valeurs valides et soumettre | `POST /api/register` → 200 | Snackbar de confirmation affiché, redirection vers `/login` |
| 2 | Connexion | Remplir login/mot de passe valides et soumettre | `POST /api/login` → 200 `{ token }` | Redirection vers `/`, nom d'utilisateur visible dans le header |
| 3 | Connexion | Soumettre avec un mauvais mot de passe | `POST /api/login` → 401 | Message « Login ou mot de passe incorrect » affiché, pas de redirection |
| 4 | Accueil | Visiter `/` sans être connecté | — | Message générique + lien « Se connecter » dans le header |
| 5 | Accueil | Visiter `/` avec un JWT valide déjà stocké | — | Message personnalisé « Bienvenue, *nom* ! » |
| 6 | Header | Se déconnecter depuis le menu utilisateur | — | Retour à `/`, header affiche à nouveau « Se connecter » |
| 7 | Étudiants (accès) | Visiter `/students` sans être connecté | — | Redirection automatique vers `/login` (vérifie `authGuard`) |
| 8 | Liste des étudiants | Visiter `/students` connecté | `GET /api/students` → 200, liste de 2 étudiants | Les 2 lignes s'affichent dans le tableau |
| 9 | Création d'un étudiant | Depuis la liste, cliquer « + Nouveau », remplir et soumettre | `POST /api/students` → 200 | Redirection vers `/students` |
| 10 | Détail d'un étudiant | Visiter `/students/1` | `GET /api/students/1` → 200 | Les informations de l'étudiant s'affichent |
| 11 | Édition d'un étudiant | Depuis la fiche, cliquer « Modifier », changer un champ et soumettre | `GET /api/students/1` → 200, `PUT /api/students/1` → 200 | Redirection vers `/students` |
| 12 | Suppression d'un étudiant | Depuis la liste, cliquer « Supprimer » et confirmer | `DELETE /api/students/1` → 200 | La ligne disparaît de la liste |

---

## Étape 3 — Détail des scénarios d'acceptation (Cucumber / Gherkin)

> Prérequis technique : installer `@badeball/cypress-cucumber-preprocessor` et configurer Cypress pour reconnaître les fichiers `.feature` (résolution des steps dans un dossier `cypress/e2e/**/*.feature` + fichiers de step definitions associés).

Ces scénarios reformulent en Gherkin une sélection ciblée de cas déjà couverts par la suite E2E de l'étape 2 (voir la colonne « Cas E2E correspondant ») — l'objectif est pédagogique (montrer la mécanique Gherkin → step definitions → Cypress), pas d'étendre la couverture fonctionnelle.

| # | Feature | Scénario Gherkin | Cas E2E correspondant |
|---|---|---|---|
| C1 | Connexion | `Given` je suis sur la page de connexion<br>`And` je saisis un login et un mot de passe valides<br>`When` je soumets le formulaire<br>`Then` je suis redirigé vers l'accueil<br>`And` mon nom d'utilisateur est visible dans le header | Cas E2E #2 |
| C2 | Connexion | `Given` je suis sur la page de connexion<br>`When` je soumets le formulaire avec un mauvais mot de passe<br>`Then` le message « Login ou mot de passe incorrect » s'affiche<br>`And` je reste sur la page de connexion | Cas E2E #3 |
| C3 | Gestion des étudiants | `Given` je suis connecté<br>`And` je suis sur la liste des étudiants<br>`When` je crée un nouvel étudiant avec des informations valides<br>`Then` je suis redirigé vers la liste des étudiants | Cas E2E #9 |

Ces trois scénarios `.feature` sont un point de départ ; ils pourront être complétés au fil de l'apprentissage sans obligation de couvrir l'intégralité du tableau de l'étape 2.
