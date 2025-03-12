"Delete Existing PostgreSQL Resources"
kubectl delete deployment postgres
kubectl delete pvc postgres-pvc

"Redeploy PostgreSQL"
kubectl apply -f .\k8s\postgres-configmap.yaml
kubectl apply -f .\k8s\postgres-deployment.yaml

kubectl get pods