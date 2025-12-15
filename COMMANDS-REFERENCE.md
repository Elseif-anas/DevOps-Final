# Useful Commands Reference

## 🐳 Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongo

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache

# Check running containers
docker-compose ps

# Remove everything including volumes
docker-compose down -v
```

### Troubleshooting
```bash
# Check container status
docker ps -a

# Inspect container
docker inspect student-frontend

# Execute command in container
docker exec -it student-backend sh
docker exec -it student-db mongosh

# View container logs
docker logs student-frontend
docker logs student-backend --tail 100

# Check Docker networks
docker network ls
docker network inspect student-management-network

# Check volumes
docker volume ls
docker volume inspect student_mongodb_data

# Remove unused resources
docker system prune -a
docker volume prune
```

---

## ☸️ Kubernetes Commands

### Cluster Management
```bash
# Set context to AKS cluster
az aks get-credentials --resource-group student-management-rg --name student-aks-cluster

# Check cluster info
kubectl cluster-info
kubectl get nodes

# View all resources
kubectl get all -n student-management
```

### Deployments
```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Apply specific file
kubectl apply -f kubernetes/frontend-deployment.yaml

# Delete resources
kubectl delete -f kubernetes/
kubectl delete namespace student-management

# Check deployment status
kubectl get deployments -n student-management
kubectl rollout status deployment/frontend-deployment -n student-management

# Rollback deployment
kubectl rollout undo deployment/frontend-deployment -n student-management

# Scale deployment
kubectl scale deployment/backend-deployment --replicas=3 -n student-management
```

### Pods
```bash
# List all pods
kubectl get pods -n student-management

# Describe pod
kubectl describe pod <pod-name> -n student-management

# View pod logs
kubectl logs <pod-name> -n student-management
kubectl logs -f <pod-name> -n student-management

# Execute command in pod
kubectl exec -it <pod-name> -n student-management -- sh

# Delete pod (will be recreated)
kubectl delete pod <pod-name> -n student-management
```

### Services
```bash
# List services
kubectl get svc -n student-management

# Describe service
kubectl describe svc frontend-service -n student-management

# Get service URL
kubectl get svc frontend-service -n student-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Port forward (local testing)
kubectl port-forward svc/frontend-service 8080:80 -n student-management
```

### Debugging
```bash
# Check events
kubectl get events -n student-management --sort-by='.lastTimestamp'

# Check resource usage
kubectl top nodes
kubectl top pods -n student-management

# View endpoint details
kubectl get endpoints -n student-management

# Check persistent volumes
kubectl get pv
kubectl get pvc -n student-management
```

---

## 🔄 Git & GitHub Actions Commands

### Git Operations
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/yourusername/student-management.git

# Push to GitHub
git push -u origin main

# Create new branch
git checkout -b develop
git push -u origin develop

# View commit history
git log --oneline
git log --graph --all --oneline
```

### GitHub Actions
```bash
# Trigger workflow manually
# Go to: GitHub → Actions → Select workflow → Run workflow

# View workflow runs
gh run list

# View workflow details
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

---

## ⚙️ Ansible Commands

### Connectivity Tests
```bash
# Ping all hosts
ansible all -i ansible/hosts.ini -m ping

# Ping specific group
ansible webservers -i ansible/hosts.ini -m ping

# Check ansible version
ansible --version

# List inventory
ansible-inventory -i ansible/hosts.ini --list
ansible-inventory -i ansible/hosts.ini --graph
```

### Playbook Execution
```bash
# Run playbook (dry-run)
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --check

# Run playbook
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml

# Run with verbose output
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml -v
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml -vv
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml -vvv

# Run specific tags
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --tags docker
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --tags "nginx,nodejs"

# Skip specific tags
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --skip-tags security

# Run on specific hosts
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --limit webservers
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --limit "web1,app1"

# Start from specific task
ansible-playbook -i ansible/hosts.ini ansible/playbook.yml --start-at-task="Install Docker"
```

### Ad-hoc Commands
```bash
# Execute command on all hosts
ansible all -i ansible/hosts.ini -m shell -a "uptime"
ansible all -i ansible/hosts.ini -m shell -a "df -h"

# Check service status
ansible webservers -i ansible/hosts.ini -m shell -a "systemctl status nginx"
ansible dbservers -i ansible/hosts.ini -m shell -a "systemctl status mongod"

# Install package
ansible all -i ansible/hosts.ini -m apt -a "name=curl state=present" --become

# Copy file
ansible all -i ansible/hosts.ini -m copy -a "src=/local/file dest=/remote/file"

# Gather facts
ansible all -i ansible/hosts.ini -m setup
```

---

## 🧪 Selenium & Testing Commands

### Setup
```bash
# Navigate to test directory
cd selenium-tests

# Install dependencies
npm install

# Update ChromeDriver
npm install chromedriver@latest
```

### Running Tests
```bash
# Run all tests
npm test

# Run with Chrome (default)
npm run test:chrome

# Run with Firefox
npm run test:firefox

# Run simple test
node simple-test.js

# Run with custom URL
BASE_URL=http://your-app-url npm test

# Run in headless mode (default)
npm test

# View test results
cat test-results.json

# View screenshots
ls screenshots/
```

### Backend Tests
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- api.test.js
```

### Frontend Tests
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Run tests in CI mode
CI=true npm test
```

---

## 🔍 Monitoring & Debugging

### Application Health Checks
```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:80

# Check MongoDB
mongosh mongodb://localhost:27017
```

### Docker Health Status
```bash
# View container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Inspect health check logs
docker inspect --format='{{json .State.Health}}' student-backend | python -m json.tool
```

### System Resources
```bash
# Docker stats
docker stats

# Docker disk usage
docker system df

# Check port usage (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# Check port usage (Linux/Mac)
lsof -i :80
lsof -i :5000
lsof -i :27017
```

---

## 🔒 Security Commands

### Update Ansible Vault
```bash
# Create vault
ansible-vault create secrets.yml

# Edit vault
ansible-vault edit secrets.yml

# View vault
ansible-vault view secrets.yml

# Encrypt existing file
ansible-vault encrypt hosts.ini

# Decrypt file
ansible-vault decrypt hosts.ini
```

### Docker Security
```bash
# Scan image for vulnerabilities
docker scan student-frontend:latest

# Check image history
docker history student-frontend:latest

# Run security benchmark
docker run -it --net host --pid host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/docker-bench-security
```

---

## 🛠️ Azure CLI Commands

### AKS Cluster Management
```bash
# Login to Azure
az login

# List subscriptions
az account list --output table

# Set subscription
az account set --subscription "Your-Subscription-Name"

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

# Get credentials
az aks get-credentials \
  --resource-group student-management-rg \
  --name student-aks-cluster

# List clusters
az aks list --output table

# Show cluster details
az aks show \
  --resource-group student-management-rg \
  --name student-aks-cluster

# Scale cluster
az aks scale \
  --resource-group student-management-rg \
  --name student-aks-cluster \
  --node-count 3

# Upgrade cluster
az aks upgrade \
  --resource-group student-management-rg \
  --name student-aks-cluster \
  --kubernetes-version 1.27.0

# Stop cluster (save costs)
az aks stop \
  --resource-group student-management-rg \
  --name student-aks-cluster

# Start cluster
az aks start \
  --resource-group student-management-rg \
  --name student-aks-cluster

# Delete cluster
az aks delete \
  --resource-group student-management-rg \
  --name student-aks-cluster \
  --yes --no-wait

# Delete resource group
az group delete \
  --name student-management-rg \
  --yes --no-wait
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench
```bash
# Install Apache Bench
# Ubuntu: sudo apt install apache2-utils
# Mac: brew install httpd

# Simple load test
ab -n 1000 -c 10 http://localhost:80/

# POST request test
ab -n 100 -c 10 -p data.json -T application/json http://localhost:5000/api/students/
```

### Database Operations
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/student_management

# Show databases
show dbs

# Use database
use student_management

# Show collections
show collections

# Count documents
db.students.countDocuments()

# Find all students
db.students.find().pretty()

# Find specific student
db.students.findOne({ email: "john.doe@example.com" })

# Create index
db.students.createIndex({ email: 1 })

# Show indexes
db.students.getIndexes()

# Database stats
db.stats()

# Drop collection
db.students.drop()
```

---

## 🎯 Quick Shortcuts

### Start Everything
```bash
# Local development
docker-compose up -d

# View in browser
start http://localhost:80  # Windows
open http://localhost:80   # Mac
xdg-open http://localhost:80  # Linux
```

### Stop Everything
```bash
docker-compose down
```

### Full Reset
```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker rmi $(docker images -q "student-*")

# Clean system
docker system prune -a --volumes -f
```

### View Everything
```bash
# All containers
docker-compose ps

# All logs
docker-compose logs -f

# All Kubernetes resources
kubectl get all -n student-management
```

---

## 📝 Notes

- Replace placeholders (like `<pod-name>`, `<run-id>`) with actual values
- Commands marked with `--become` require sudo privileges
- Some commands may need modification based on your environment
- Always test commands in development before production
- Keep this reference handy during exam submission preparation

---

**Pro Tip**: Use `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac) in terminal to search command history!
