# 📦 Kubernetes Configuration

Ce dossier **`kubernetes/`** contient les fichiers de configuration nécessaires pour déployer les microservices et les bases de données associées dans un cluster **Kubernetes**.

## 📂 **Structure du dossier**

```
/kubernetes
├── auth
│   ├── auth-deployment.yaml     # Déploiement du service Auth
│   ├── auth-service.yaml        # Service exposant Auth
|   ├── auth-db-service.yaml     # Service pour la base de données Auth
|   ├── auth-db-deployment.yaml  # Déploiement de la base de données PostgreSQL pour Auth
│
├── book
│   ├── book-deployment.yaml     # Déploiement du service Book
│   ├── book-service.yaml        # Service exposant Book
│   ├── book-db-deployment.yaml  # Déploiement de la base de données PostgreSQL pour Book
│   ├── book-db-service.yaml     # Service pour la base de données Book
│
├── movie
│   ├── movie-deployment.yaml    # Déploiement du service Movie
│   ├── movie-service.yaml       # Service exposant Movie
│   ├── movie-db-deployment.yaml # Déploiement de la base de données PostgreSQL pour Movie
│   ├── movie-db-service.yaml    # Service pour la base de données Movie
```

## 🚀 **Prérequis**
Avant de déployer l'application sur Kubernetes, assurez-vous d'avoir :

- **Minikube** installé → [Documentation officielle](https://minikube.sigs.k8s.io/docs/)
- **Kubectl** installé → [Documentation officielle](https://kubernetes.io/docs/tasks/tools/)
- **Docker** installé et en cours d'exécution

## 🏗 **Démarrer Minikube et le cluster Kubernetes**

1. **Lancer Minikube** (si ce n'est pas déjà fait) :
   ```bash
   minikube start
   ```
2. **Vérifier l'état du cluster** :
   ```bash
   kubectl cluster-info
   ```
3. **Lister les nœuds disponibles** :
   ```bash
   kubectl get nodes
   ```

## 🔨 **Déployer les services et bases de données**

Déployons chaque service individuellement :

### 1️⃣ **Déploiement du service d'authentification**
```bash
kubectl apply -f kubernetes/auth/auth-deployment.yaml
kubectl apply -f kubernetes/auth/auth-service.yaml
kubectl apply -f kubernetes/auth/auth-db-service.yaml
kubectl apply -f kubernetes/auth/auth-db-deployment.yaml
```

### 2️⃣ **Déploiement du service de gestion des livres**
```bash
kubectl apply -f kubernetes/book/book-deployment.yaml
kubectl apply -f kubernetes/book/book-service.yaml
kubectl apply -f kubernetes/book/book-db-deployment.yaml
kubectl apply -f kubernetes/book/book-db-service.yaml
```

### 3️⃣ **Déploiement du service de gestion des films**
```bash
kubectl apply -f kubernetes/movie/movie-deployment.yaml
kubectl apply -f kubernetes/movie/movie-service.yaml
kubectl apply -f kubernetes/movie/movie-db-deployment.yaml
kubectl apply -f kubernetes/movie/movie-db-service.yaml
```

## 🔍 **Vérifier l'état des pods et services**

1. **Lister les pods actifs** :
   ```bash
   kubectl get pods
   ```
2. **Lister les services exposés** :
   ```bash
   kubectl get svc
   ```

## 🔄 **Exposer un service localement (port-forwarding)**
Si les services sont en `ClusterIP`, ils ne sont pas accessibles directement depuis votre machine. Vous pouvez utiliser le `port-forward` pour tester un service.

Exemple pour accéder au service **Auth** :
```bash
kubectl port-forward svc/auth-service 4000:3000
kubectl port-forward svc/book-service 5000:3001
kubectl port-forward svc/movie-service 6000:6000
```
Ensuite, ouvrez **Postman** ou un navigateur et accédez à :
```
http://localhost:4000
```

## **Pour un accès plus direct, tu peux mettre type: NodePort. Par exemple, sur auth-service.yaml :**
```bash
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  type: NodePort
  selector:
    app: auth-service
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30090    # Port random entre 30000-32767
```
Tu pourras alors taper http://**<NodeIP>**:30090.

En production, on utilise souvent un Ingress + LoadBalancer. Tu peux configurer un Ingress Controller (Nginx, Traefik, etc.) pour router /auth → auth-service, /books → book-service, etc.

## 🚧 **Dépannage**

Si vous avez une erreur **"No connection could be made"** ou **"Cluster unreachable"**, essayez ces étapes :

1. Vérifier si Minikube tourne bien :
   ```bash
   minikube status
   ```
2. Si Minikube est arrêté, redémarrez-le :
   ```bash
   minikube delete
   minikube start
   ```
3. Vérifier si les pods fonctionnent bien :
   ```bash
   kubectl get pods -A
   ```
4. Voir les logs d'un pod :
   ```bash
   kubectl logs <nom-du-pod>
   ```

## 🛑 **Arrêter et supprimer le déploiement**
Si vous souhaitez arrêter l’environnement Kubernetes et supprimer tous les services :
```bash
kubectl delete -f kubernetes/
minikube stop
```

## 🎯 **Résumé**
- 📌 **Lancer Minikube** → `minikube start`
- 📌 **Déployer l’application** → `kubectl apply -f kubernetes/`
- 📌 **Vérifier les services et pods** → `kubectl get pods`, `kubectl get svc`
- 📌 **Tester un service en local** → `kubectl port-forward svc/auth-service 4000:3000`
- 📌 **Arrêter le cluster** → `minikube stop`

Avec ces instructions, vous pouvez facilement **démarrer, gérer et tester** votre application sur Kubernetes ! 🚀

