"Deleting the pods..."
kubectl delete pod -l app=auth-service
kubectl delete pod -l app=book-service

"Deleting the docker images from minikube..."
minikube ssh -- docker rmi -f auth-service:latest
minikube ssh -- docker rmi -f book-service:latest

"Building the docker images..."
docker build -t auth-service:latest .\auth-service\
docker build -t book-service:latest .\book-service\

"Loading images..."
minikube image load auth-service:latest
"auth-service:latest image loaded successfuly"
minikube image load book-service:latest
"book-service:latest image loaded successfuly"

"Applying kubernetes deployment configurations..."
kubectl apply -f .\k8s\auth-service-deployment.yaml
kubectl apply -f .\k8s\book-service-deployment.yaml

"Pods status :"
kubectl get pods

"Cluster and pods IP:PORT"
minikube ip
kubectl get svc
minikube service list
minikube service auth book --url
