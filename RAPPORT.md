## Rapport du projet – Difficultés rencontrées et validation des objectifs

### Difficultés et leçons apprises

1. **Communication entre microservices**

   - L’un des plus grands défis était de faire communiquer correctement les microservices Auth et Book. Par exemple, nous avons dû veiller à ce que le service Book puisse valider les jetons JWT via le service Auth.
   - Nous avons passé du temps sur la configuration des URL (ex. variable d’environnement `AUTH_SERVICE_URL`) et la vérification que les containers (ou pods Kubernetes) puissent se joindre.

2. **Supervision et passage des tests**

   - Nous avons passé plus de temps à faire en sorte que les tests passent qu’à rajouter de nouvelles fonctionnalités. Les tests unitaires, l’intégration Postman/Swagger, et la bonne configuration de Prisma ont parfois nécessité des ajustements.
   - Nous avons aussi dû gérer les connexions à la base de données lors des tests en local.

3. **Déploiement Kubernetes et ports**

   - Lors du déploiement sur Minikube, nous avons rencontré des soucis de ports. Nous avons dû ajuster soigneusement nos fichiers de déploiement (ex. `auth:3000`, `book:3001`) et vérifier via les logs que tout était bien exposé.
   - Sur Minikube, il faut aussi surveiller les NodePorts ou les adresses temporaires renvoyées.

4. **Vérification de l’utilisation des bases de données**
   - Parfois, s’assurer que chaque microservice utilisait bien sa propre base PostgreSQL a exigé un logging plus fin et une lecture attentive des migrations Prisma.
   - Nous avons fini par utiliser `dotenv-cli` et `.env.dev` pour vérifier que les migrations se déroulaient correctement.

En résumé, ces obstacles nous ont beaucoup appris sur la **configuration multi-conteneurs**, la **gestion des variables d’environnement** et le **test-driven development**.

---

### Validation des objectifs du Projet APP5

Ci-dessous, un résumé des exigences et comment notre projet les satisfait :

1. **Au moins deux types d’objets**

   - **Utilisateurs** (gérés par Auth)
   - **Livres** (gérés par Book)

2. **Implémentation des requêtes classiques (GET, POST, PUT, DELETE)**

   - **Auth**
     - `POST /api/auth/register`
     - `POST /api/auth/login`
     - `GET /api/auth/verify-token`
     - `POST /api/auth/logout`
   - **Book**
     - `POST /api/books` (création)
     - `GET /api/books` (lecture avec filtres ou pagination)
     - `PUT /api/books/:id` (mise à jour)
     - `DELETE /api/books/:id` (suppression)

3. **Pagination**

   - Sur le service Book, nous gérons la pagination via des paramètres type `?page=` et `?limit=`.

4. **Filtrage des données (paramètres optionnels)**

   - Sur `GET /api/books`, on peut filtrer par titre, auteur, etc. via des query params.

5. **Navigation dans l’arborescence**

   - Le service Auth gère les utilisateurs connectés ; la navigation se fait en utilisant le token JWT pour accéder à des ressources liées (ex. livres d’un utilisateur).
   - Les routes REST (ex. `/api/auth/...` ou `/api/books/...`) permettent d’enchaîner de façon cohérente.

6. **Documentation OpenAPI 3**

   - Chaque microservice dispose d’une doc Swagger (OpenAPI 3) via `/api-docs`.
   - Nous utilisons **express-oas-generator** pour générer la spec, complétée à la main selon les endpoints.

7. **Validation des entrées/sorties (Joi)**

   - Nous validons par exemple les champs `username` et `password` dans l’Auth, et `title`, `author`, `year` dans Book.

8. **Conteneurisation Docker**

   - Nous avons un Dockerfile par microservice. Le fichier `docker-compose.yml` lance Postgres, Auth et Book.
   - L’exécution se fait via `docker compose build` puis `docker compose up`.

9. **Petit rapport**

   - _Le présent document_ expose les difficultés, la répartition des tâches et les retours sur le déroulé du projet.

10. **Tests**

- **Unitaires** avec Jest,
- **Manuels** via Postman,
- **Automatisés** sur GitHub Actions.

#### Options bonus

- **CI/CD** : Intégré grâce à **GitHub Actions**.
- **Déploiement sous Kubernetes** : On a fourni des scripts PowerShell pour Minikube (`deploy_services_to_minikube.ps1`, `deploy_postgres_to_minikube.ps1`), ainsi qu’une doc correspondante.

---

**Conclusion** : Malgré quelques blocages, notre projet **répond à l’ensemble des contraintes** (2+ objets, CRUD, pagination, Docker, validation, OpenAPI) et implémente **plusieurs bonus** (CI/CD, déploiement Kubernetes). Cela fut riche d’enseignements !
