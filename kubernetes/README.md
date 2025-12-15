# Kubernetes Deployment Guide for AKS

## Prerequisites
- Azure CLI installed
- kubectl installed
- Docker Hub account
- Azure subscription

## Step 1: Create AKS Cluster

```bash
# Login to Azure
az login

# Create resource group
az group create --name student-management-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group student-management-rg \
  --name student-aks-cluster \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --generate-ssh-keys

# Get AKS credentials
az aks get-credentials \
  --resource-group student-management-rg \
  --name student-aks-cluster
```

## Step 2: Update Docker Image References

Before deploying, update the image references in:
- `backend-deployment.yaml` - Replace `YOUR_DOCKERHUB_USERNAME`
- `frontend-deployment.yaml` - Replace `YOUR_DOCKERHUB_USERNAME`

## Step 3: Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Deploy MongoDB
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n student-management --timeout=300s

# Deploy Backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Wait for Backend to be ready
kubectl wait --for=condition=ready pod -l app=backend -n student-management --timeout=300s

# Deploy Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Optional: Deploy autoscalers
kubectl apply -f hpa.yaml
```

## Step 4: Verify Deployment

```bash
# Check all pods
kubectl get pods -n student-management

# Check services
kubectl get services -n student-management

# Check deployments
kubectl get deployments -n student-management

# Get frontend public IP (wait for EXTERNAL-IP)
kubectl get service frontend-service -n student-management --watch
```

## Step 5: Access Application

Once the LoadBalancer assigns an external IP:

```bash
# Get the external IP
kubectl get service frontend-service -n student-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Open browser and navigate to: `http://<EXTERNAL-IP>`

## Useful Commands

```bash
# View logs
kubectl logs -l app=backend -n student-management
kubectl logs -l app=frontend -n student-management

# Describe resources
kubectl describe deployment backend-deployment -n student-management
kubectl describe service frontend-service -n student-management

# Scale deployment
kubectl scale deployment backend-deployment --replicas=3 -n student-management

# Delete all resources
kubectl delete namespace student-management
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n student-management
kubectl logs <pod-name> -n student-management
```

### Service not accessible
```bash
kubectl get endpoints -n student-management
kubectl describe service <service-name> -n student-management
```

### Check cluster info
```bash
kubectl cluster-info
kubectl get nodes
```

## Clean Up

```bash
# Delete namespace (removes all resources)
kubectl delete namespace student-management

# Delete AKS cluster
az aks delete \
  --resource-group student-management-rg \
  --name student-aks-cluster \
  --yes --no-wait

# Delete resource group
az group delete --name student-management-rg --yes --no-wait
```

## Screenshots to Capture for Submission

1. `kubectl get pods -n student-management` - All pods in Running state
2. `kubectl get svc -n student-management` - All services with IPs
3. Browser showing the running application
4. Application functionality (CRUD operations working)
