# Student Management System - DevOps Final Exam Project

A complete 3-tier web application with full DevOps implementation including containerization, CI/CD, Kubernetes deployment, configuration management, and automated testing.

![Student Management System](https://img.shields.io/badge/Status-Complete-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Section A: Containerization](#section-a-containerization)
- [Section B: CI/CD Automation](#section-b-cicd-automation)
- [Section C: Kubernetes (AKS)](#section-c-kubernetes-aks)
- [Section D: Ansible Configuration](#section-d-ansible-configuration)
- [Section E: Selenium Testing](#section-e-selenium-testing)
- [Screenshots Guide](#screenshots-guide)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This Student Management System is a full-stack web application that demonstrates complete DevOps practices. The application provides CRUD (Create, Read, Update, Delete) operations for managing student records with a beautiful, responsive UI.

### Features

✅ **Frontend (React)**
- Beautiful Material-UI design
- Responsive layout (desktop, tablet, mobile)
- Student listing with search/filter
- Add/Edit student forms
- Real-time validation

✅ **Backend (Node.js + Express)**
- RESTful API
- MongoDB integration
- Input validation
- Error handling
- Health check endpoints

✅ **Database (MongoDB)**
- NoSQL database
- Indexed collections
- Sample data initialization
- Data persistence

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB 7.0
- **ODM**: Mongoose
- **Testing**: Jest, Supertest

### DevOps Tools
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (AKS)
- **CI/CD**: GitHub Actions
- **Configuration Management**: Ansible
- **Testing**: Selenium WebDriver
- **Cloud**: Microsoft Azure

---

## 📁 Project Structure

```
DevOps Final Exam/
├── frontend/                    # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                     # Node.js backend API
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── tests/                  # Unit tests
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── database/                    # MongoDB configuration
│   ├── Dockerfile
│   └── mongo-init.js
│
├── kubernetes/                  # K8s manifests
│   ├── namespace.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── README.md
│
├── ansible/                     # Ansible configuration
│   ├── playbook.yml
│   ├── hosts.ini
│   ├── ansible.cfg
│   └── README.md
│
├── selenium-tests/              # Automated tests
│   ├── test-runner.js
│   ├── simple-test.js
│   ├── package.json
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml  # GitHub Actions workflow
│
├── docker-compose.yml           # Multi-container setup
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Node.js 18+ (for local development)
- Git

### Run with Docker Compose (Easiest)

```bash
# Clone the repository
cd "d:\DevOps Final Exam"

# Start all services
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

### Run Locally (Development)

```bash
# Terminal 1 - Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Terminal 2 - Start Backend
cd backend
npm install
npm start

# Terminal 3 - Start Frontend
cd frontend
npm install
npm start

# Access at http://localhost:3000
```

### Stop Services

```bash
# Stop Docker Compose
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

---

## 📦 SECTION A: CONTAINERIZATION (10 Marks)

### Task A1: Docker Images

Three separate Dockerfiles have been created:

#### 1. Frontend Dockerfile (`frontend/Dockerfile`)
- **Base Image**: node:18-alpine (build), nginx:alpine (production)
- **Build Type**: Multi-stage build
- **Features**:
  - Optimized build process
  - Static file serving with Nginx
  - Small image size
  - Production-ready

#### 2. Backend Dockerfile (`backend/Dockerfile`)
- **Base Image**: node:18-alpine
- **Features**:
  - Non-root user for security
  - Health check included
  - Environment variables support
  - Production dependencies only

#### 3. Database Dockerfile (`database/Dockerfile`)
- **Base Image**: mongo:7.0
- **Features**:
  - Custom initialization script
  - Sample data seeding
  - Health check
  - Volume support

### Task A2: Docker Compose Setup

The `docker-compose.yml` file orchestrates all services:

```yaml
Key Features:
✅ 3 services: frontend, backend, mongodb
✅ Custom network: student-management-network
✅ Persistent volumes: mongodb_data, mongodb_config
✅ Health checks for all services
✅ Service dependencies (depends_on)
✅ Environment variables
✅ Port mappings
```

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify all containers running
docker-compose ps
```

### Expected Output

```
NAME                  STATUS    PORTS
student-frontend      Up        0.0.0.0:80->80/tcp
student-backend       Up        0.0.0.0:5000->5000/tcp
student-db            Up        0.0.0.0:27017->27017/tcp
```

### 📸 Screenshots Required:
1. `docker-compose ps` - All containers running
2. `docker images` - All images listed
3. Browser showing the running application

---

## 🔄 SECTION B: CI/CD AUTOMATION (14 Marks)

### Task B1: Pipeline Development

Location: `.github/workflows/ci-cd-pipeline.yml`

The GitHub Actions pipeline includes:

#### Stage 1: Build Stage
- **Frontend Build**: Installs dependencies, runs tests, creates production build
- **Backend Build**: Installs dependencies, runs unit tests

#### Stage 2: Automated Tests
- Jest tests for backend API
- React tests for frontend
- Validates code quality

#### Stage 3: Docker Build & Push
- Builds Docker images for all services
- Tags with branch name and commit SHA
- Pushes to Docker Hub registry
- Uses build caching for efficiency

#### Stage 4: Deployment to Kubernetes
- Deploys to Azure Kubernetes Service (AKS)
- Updates running containers
- Performs rolling updates
- Validates deployment health

### Task B2: Trigger Configuration

The pipeline triggers on:
- ✅ Push to `main` branch
- ✅ Push to `develop` branch
- ✅ Pull requests to `main`
- ✅ Manual workflow dispatch

### Setup Instructions

1. **Create Docker Hub Account**
   - Sign up at https://hub.docker.com
   - Create access token

2. **Create GitHub Secrets**
   Go to Repository Settings → Secrets → Actions:
   ```
   DOCKER_USERNAME: your_dockerhub_username
   DOCKER_PASSWORD: your_dockerhub_token
   AZURE_CREDENTIALS: azure_service_principal_json
   AZURE_RESOURCE_GROUP: your_resource_group
   AZURE_AKS_CLUSTER: your_aks_cluster_name
   ```

3. **Update Docker Image Names**
   In `kubernetes/*.yaml` files, replace:
   ```yaml
   image: YOUR_DOCKERHUB_USERNAME/student-frontend:latest
   ```

4. **Trigger Pipeline**
   ```bash
   git add .
   git commit -m "Deploy application"
   git push origin main
   ```

### 📸 Screenshots Required:
1. GitHub Actions workflow file
2. Pipeline run showing all stages completed (green checkmarks)
3. Docker Hub showing pushed images
4. Deployment logs

---

## ☸️ SECTION C: KUBERNETES ON AZURE (AKS) (12 Marks)

### Task C1: Kubernetes Manifests

All Kubernetes YAML files are in the `kubernetes/` directory:

#### Resources Created:
1. **Namespace**: `student-management`
2. **MongoDB**:
   - PersistentVolumeClaim (5Gi)
   - Deployment (1 replica)
   - Service (ClusterIP)
   - ConfigMap with init script

3. **Backend**:
   - Deployment (2 replicas)
   - Service (ClusterIP)
   - Resource limits
   - Health checks

4. **Frontend**:
   - Deployment (2 replicas)
   - Service (LoadBalancer - Public IP)
   - Resource limits
   - Health checks

5. **Horizontal Pod Autoscaler** (Optional):
   - Auto-scales based on CPU/Memory
   - Min: 2, Max: 5 replicas

### Task C2: Deploy to AKS

#### Step 1: Create AKS Cluster

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

# Get credentials
az aks get-credentials \
  --resource-group student-management-rg \
  --name student-aks-cluster
```

#### Step 2: Deploy Application

```bash
# Navigate to kubernetes directory
cd kubernetes

# Create namespace
kubectl apply -f namespace.yaml

# Deploy MongoDB
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# Wait for MongoDB
kubectl wait --for=condition=ready pod -l app=mongodb -n student-management --timeout=300s

# Deploy Backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Wait for Backend
kubectl wait --for=condition=ready pod -l app=backend -n student-management --timeout=300s

# Deploy Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

#### Step 3: Verify Deployment

```bash
# Check all pods (should show Running)
kubectl get pods -n student-management

# Check services (note the EXTERNAL-IP)
kubectl get svc -n student-management

# Check deployments
kubectl get deployments -n student-management

# Get frontend public IP
kubectl get service frontend-service -n student-management
```

#### Step 4: Access Application

```bash
# Get the external IP (wait for it to be assigned)
kubectl get svc frontend-service -n student-management --watch

# Once EXTERNAL-IP is shown, open in browser:
http://<EXTERNAL-IP>
```

### 📸 Screenshots Required:
1. `kubectl get pods -n student-management` - All Running
2. `kubectl get svc -n student-management` - All services with IPs
3. Browser showing the application via public IP
4. Application working (add/view students)

---

## ⚙️ SECTION D: ANSIBLE CONFIGURATION MANAGEMENT (8 Marks)

### Task D1: Inventory Setup

Location: `ansible/hosts.ini`

The inventory file defines three server groups:
- **webservers**: Nginx servers (2 hosts)
- **appservers**: Node.js servers (2 hosts)
- **dbservers**: MongoDB server (1 host)

### Task D2: Playbook

Location: `ansible/playbook.yml`

The playbook automates:

#### 1. Web Server Configuration
- Installs Nginx
- Configures firewall (UFW)
- Sets up reverse proxy
- Creates web directories

#### 2. Application Server Configuration
- Installs Node.js 18
- Installs PM2 process manager
- Configures application environment
- Sets up firewall rules

#### 3. Database Server Configuration
- Installs MongoDB 7.0
- Configures remote access
- Sets up firewall
- Starts and enables service

#### 4. Docker Installation (All Servers)
- Installs Docker Engine
- Installs Docker Compose
- Configures user permissions
- Starts Docker service

#### 5. Security Hardening (All Servers)
- Installs fail2ban
- Configures automatic updates
- Updates all packages

### Setup and Run

```bash
# Navigate to ansible directory
cd ansible

# Update hosts.ini with your server IPs
nano hosts.ini

# Test connectivity
ansible all -i hosts.ini -m ping

# Run playbook (dry-run first)
ansible-playbook -i hosts.ini playbook.yml --check

# Run playbook for real
ansible-playbook -i hosts.ini playbook.yml

# Run specific tasks
ansible-playbook -i hosts.ini playbook.yml --tags docker

# Run on specific hosts
ansible-playbook -i hosts.ini playbook.yml --limit webservers
```

### Verify Installation

```bash
# Check Nginx on web servers
ansible webservers -i hosts.ini -m shell -a "systemctl status nginx"

# Check Node.js on app servers
ansible appservers -i hosts.ini -m shell -a "node --version"

# Check MongoDB on db servers
ansible dbservers -i hosts.ini -m shell -a "systemctl status mongod"

# Check Docker on all servers
ansible all -i hosts.ini -m shell -a "docker --version"
```

### 📸 Screenshots Required:
1. `ansible all -i hosts.ini -m ping` - All hosts responding
2. Playbook execution showing successful tasks
3. Service verification commands
4. Application running on configured servers

---

## 🧪 SECTION E: SELENIUM AUTOMATED TESTING (6 Marks)

### Task E1: Test Cases

Location: `selenium-tests/test-runner.js`

Seven comprehensive test cases are implemented:

#### Test 1: Homepage Load Verification
- Verifies homepage loads successfully
- Checks page title
- Validates main heading content

#### Test 2: Navigation Functionality
- Tests navigation between pages
- Validates URL changes
- Checks navbar links

#### Test 3: Add Student Form Validation
- Tests form field loading
- Fills out student information
- Validates dropdown selections
- Checks form submission

#### Test 4: Search Functionality
- Tests search/filter feature
- Validates real-time filtering
- Checks search results

#### Test 5: Student Table Display
- Verifies table rendering
- Checks all columns present
- Validates table headers

#### Test 6: Responsive Design
- Tests desktop view (1920x1080)
- Tests tablet view (768x1024)
- Tests mobile view (375x667)

#### Test 7: Button Functionality
- Tests button clicks
- Validates navigation
- Checks button interactions

### Task E2: Setup and Execution

```bash
# Navigate to selenium-tests directory
cd selenium-tests

# Install dependencies
npm install

# Make sure application is running first
# In another terminal:
cd ..
docker-compose up -d

# Run all tests
npm test

# Run simple test
node simple-test.js

# Run with custom URL
BASE_URL=http://your-ip npm test
```

### Test Output

The test runner provides:
- ✅ Real-time console output
- 📸 Automated screenshots (saved to `screenshots/`)
- 📊 JSON test report (`test-results.json`)
- 📈 Summary statistics

### Example Output:
```
======================================================================
🚀 STARTING SELENIUM AUTOMATED TESTS
======================================================================
Base URL: http://localhost:80
Browser: chrome
Timeout: 10000ms
======================================================================

✅ PASSED: Homepage Loads Successfully
📸 Screenshot saved: screenshot-Homepage-Loads-Successfully-1234567890.png
✅ PASSED: Navigation Between Pages
✅ PASSED: Add Student Form Validation
✅ PASSED: Search Students Functionality
✅ PASSED: Student Table Display
✅ PASSED: Responsive Design Check
✅ PASSED: Button Click Functionality

======================================================================
📊 TEST SUMMARY
======================================================================
Total Tests: 7
✅ Passed: 7
❌ Failed: 0
⏱️  Duration: 45.23s
======================================================================
```

### 📸 Screenshots Required:
1. Console output showing all tests passed
2. Test screenshots from `screenshots/` directory
3. `test-results.json` content
4. Application UI during test execution

---

## 📸 Screenshots Guide for Submission

### Section A: Docker (2-3 screenshots)
1. `docker-compose ps` output
2. `docker images` showing all three images
3. Browser with running application

### Section B: CI/CD (3-4 screenshots)
1. GitHub Actions workflow YAML
2. Successful pipeline run (all stages green)
3. Docker Hub with pushed images
4. Deployment completion logs

### Section C: Kubernetes (4-5 screenshots)
1. `kubectl get pods -n student-management`
2. `kubectl get svc -n student-management`
3. `kubectl get deployments -n student-management`
4. Browser showing app via public IP
5. Application working (CRUD operations)

### Section D: Ansible (3-4 screenshots)
1. `ansible all -m ping` output
2. Playbook execution (successful)
3. Service status verification
4. Application on configured server

### Section E: Selenium (3-4 screenshots)
1. Test execution console output
2. Multiple test screenshots
3. test-results.json content
4. All tests passing summary

---

## 🔧 Troubleshooting

### Docker Issues

#### Containers not starting
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

#### Port already in use
```bash
# Stop conflicting services
# Windows:
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### Kubernetes Issues

#### Pods not starting
```bash
# Describe pod
kubectl describe pod <pod-name> -n student-management

# Check logs
kubectl logs <pod-name> -n student-management

# Check events
kubectl get events -n student-management --sort-by='.lastTimestamp'
```

#### Service has no external IP
```bash
# Check service
kubectl describe svc frontend-service -n student-management

# In some environments, use NodePort instead:
# Edit frontend-service.yaml:
spec:
  type: NodePort
  ports:
  - port: 80
    nodePort: 30080
```

### Ansible Issues

#### SSH connection failed
```bash
# Test SSH manually
ssh -i ~/.ssh/id_rsa username@server_ip

# Add SSH key
ssh-copy-id -i ~/.ssh/id_rsa username@server_ip

# Check inventory
ansible-inventory -i hosts.ini --list
```

#### Permission denied
```bash
# Add user to sudo group on target server
sudo usermod -aG sudo username

# Test sudo access
ansible all -i hosts.ini -m shell -a "sudo whoami"
```

### Selenium Issues

#### ChromeDriver version mismatch
```bash
# Update ChromeDriver
npm install chromedriver@latest

# Or use Firefox
BROWSER=firefox npm test
```

#### Connection refused
```bash
# Verify app is running
curl http://localhost:80

# Check Docker containers
docker-compose ps

# Restart application
docker-compose restart
```

---

## 🎓 Exam Submission Checklist

### Code Files
- [ ] All source code in repository
- [ ] Dockerfiles for all services
- [ ] docker-compose.yml
- [ ] Kubernetes manifests
- [ ] Ansible playbook and inventory
- [ ] Selenium test scripts
- [ ] CI/CD pipeline YAML
- [ ] README documentation

### Screenshots
- [ ] Section A: Docker containers running (2-3 screenshots)
- [ ] Section B: CI/CD pipeline success (3-4 screenshots)
- [ ] Section C: Kubernetes deployment (4-5 screenshots)
- [ ] Section D: Ansible execution (3-4 screenshots)
- [ ] Section E: Selenium tests (3-4 screenshots)

### Documentation
- [ ] README.md with setup instructions
- [ ] Each section has dedicated README
- [ ] Comments in code files
- [ ] Configuration examples provided

### Functionality
- [ ] Application runs locally
- [ ] Docker Compose works
- [ ] All CRUD operations functional
- [ ] Beautiful UI with responsive design
- [ ] Tests pass successfully

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review section-specific README files
3. Verify all prerequisites are installed
4. Check Docker/Kubernetes logs
5. Ensure ports are not in use

---

## 📝 License

This project is created for educational purposes as part of a DevOps final exam.

---

## 👨‍💻 Author

Created for DevOps Final Exam - December 2025

---

## 🌟 Features Highlight

- ✅ Beautiful Material-UI Design
- ✅ Full CRUD Operations
- ✅ MongoDB Database
- ✅ Docker Containerization
- ✅ Docker Compose Orchestration
- ✅ GitHub Actions CI/CD
- ✅ Kubernetes Deployment
- ✅ Azure AKS Ready
- ✅ Ansible Configuration
- ✅ Selenium Automated Tests
- ✅ Responsive Design
- ✅ Production Ready

---

**Good luck with your exam! 🎉**
