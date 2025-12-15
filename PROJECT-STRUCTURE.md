# Project Structure Overview

```
DevOps Final Exam/
│
├── 📱 frontend/                          # React Frontend Application
│   ├── public/
│   │   └── index.html                   # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js                # Navigation bar component
│   │   ├── pages/
│   │   │   ├── Home.js                  # Homepage with statistics
│   │   │   ├── Students.js              # Student list with search
│   │   │   ├── AddStudent.js            # Add student form
│   │   │   └── EditStudent.js           # Edit student form
│   │   ├── App.js                       # Main app component
│   │   ├── index.js                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── Dockerfile                        # Frontend container image
│   ├── nginx.conf                        # Nginx configuration
│   ├── package.json                      # Dependencies
│   ├── .dockerignore
│   ├── .env.example
│   └── .gitignore
│
├── 🔧 backend/                           # Node.js Backend API
│   ├── controllers/
│   │   └── studentController.js         # Business logic
│   ├── models/
│   │   └── Student.js                   # MongoDB schema
│   ├── routes/
│   │   └── studentRoutes.js             # API endpoints
│   ├── tests/
│   │   └── api.test.js                  # Unit tests
│   ├── server.js                         # Express server
│   ├── Dockerfile                        # Backend container image
│   ├── package.json                      # Dependencies
│   ├── .dockerignore
│   ├── .env.example
│   └── .gitignore
│
├── 🗄️ database/                          # MongoDB Configuration
│   ├── Dockerfile                        # Database container image
│   └── mongo-init.js                     # Initialization script
│
├── ☸️ kubernetes/                        # Kubernetes Manifests
│   ├── namespace.yaml                    # Namespace definition
│   ├── mongodb-pvc.yaml                  # Persistent volume claim
│   ├── mongodb-deployment.yaml           # MongoDB deployment
│   ├── mongodb-service.yaml              # MongoDB service
│   ├── backend-deployment.yaml           # Backend deployment
│   ├── backend-service.yaml              # Backend service
│   ├── frontend-deployment.yaml          # Frontend deployment
│   ├── frontend-service.yaml             # Frontend service (LoadBalancer)
│   ├── hpa.yaml                          # Horizontal Pod Autoscaler
│   └── README.md                         # K8s deployment guide
│
├── 🔄 .github/workflows/                 # CI/CD Pipeline
│   └── ci-cd-pipeline.yml                # GitHub Actions workflow
│       ├── Stage 1: Build & Test
│       ├── Stage 2: Docker Build & Push
│       ├── Stage 3: Deploy to AKS
│       └── Stage 4: Notifications
│
├── ⚙️ ansible/                           # Configuration Management
│   ├── playbook.yml                      # Main playbook
│   │   ├── Web Server Configuration
│   │   ├── App Server Configuration
│   │   ├── Database Configuration
│   │   ├── Docker Installation
│   │   └── Security Hardening
│   ├── hosts.ini                         # Inventory file
│   ├── ansible.cfg                       # Ansible configuration
│   └── README.md                         # Ansible guide
│
├── 🧪 selenium-tests/                    # Automated Testing
│   ├── test-runner.js                    # Main test suite
│   │   ├── Test 1: Homepage Load
│   │   ├── Test 2: Navigation
│   │   ├── Test 3: Add Student Form
│   │   ├── Test 4: Search Functionality
│   │   ├── Test 5: Table Display
│   │   ├── Test 6: Responsive Design
│   │   └── Test 7: Button Functionality
│   ├── simple-test.js                    # Basic test example
│   ├── package.json                      # Test dependencies
│   ├── .gitignore
│   └── README.md                         # Testing guide
│
├── 📄 Documentation Files
│   ├── README.md                         # Main documentation (comprehensive)
│   ├── QUICKSTART.md                     # Quick setup guide
│   └── SUBMISSION-CHECKLIST.md           # Exam submission checklist
│
├── 🔨 Utility Scripts
│   ├── run.ps1                           # PowerShell helper (Windows)
│   └── run.sh                            # Bash helper (Linux/Mac)
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml                # Multi-container orchestration
│   └── .dockerignore                     # Docker ignore rules
│
└── 📋 Other Files
    └── .gitignore                        # Git ignore rules
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                      (React + MUI)                          │
│                    Port: 80 (Nginx)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                        BACKEND                              │
│                  (Node.js + Express)                        │
│                       Port: 5000                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ MongoDB Driver
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                       DATABASE                              │
│                     (MongoDB 7.0)                           │
│                      Port: 27017                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline Flow

```
┌──────────────┐
│ Git Push     │
│ (main/dev)   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Build & Test        │
│  - Install deps      │
│  - Run unit tests    │
│  - Build frontend    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Docker Build        │
│  - Build images      │
│  - Tag images        │
│  - Push to Hub       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Deploy to K8s       │
│  - Update manifests  │
│  - Rolling update    │
│  - Health checks     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Notifications       │
│  - Success/Failure   │
└──────────────────────┘
```

---

## 🌐 Kubernetes Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AKS CLUSTER                              │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │         Namespace: student-management              │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  Frontend    │  │  Frontend    │              │   │
│  │  │  Pod         │  │  Pod         │              │   │
│  │  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                  │                       │   │
│  │         └────────┬─────────┘                       │   │
│  │                  │                                 │   │
│  │         ┌────────▼─────────┐                       │   │
│  │         │  LoadBalancer    │◄──── Public IP       │   │
│  │         │  Service         │                       │   │
│  │         └──────────────────┘                       │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │  Backend     │  │  Backend     │              │   │
│  │  │  Pod         │  │  Pod         │              │   │
│  │  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                  │                       │   │
│  │         └────────┬─────────┘                       │   │
│  │                  │                                 │   │
│  │         ┌────────▼─────────┐                       │   │
│  │         │  ClusterIP       │                       │   │
│  │         │  Service         │                       │   │
│  │         └──────────────────┘                       │   │
│  │                                                     │   │
│  │         ┌──────────────────┐                       │   │
│  │         │  MongoDB         │                       │   │
│  │         │  Pod             │                       │   │
│  │         └────────┬─────────┘                       │   │
│  │                  │                                 │   │
│  │         ┌────────▼─────────┐                       │   │
│  │         │  PVC (5Gi)       │                       │   │
│  │         │  Persistent      │                       │   │
│  │         │  Storage         │                       │   │
│  │         └──────────────────┘                       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Flow

```
┌──────────────────┐
│ Start App        │
│ (Docker Compose) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Selenium Tests   │
│ - Homepage       │
│ - Navigation     │
│ - Forms          │
│ - Search         │
│ - CRUD Ops       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate Report  │
│ - Screenshots    │
│ - JSON Results   │
│ - Console Output │
└──────────────────┘
```

---

## 📦 Docker Compose Services

```
┌─────────────────────────────────────┐
│   student-management-network        │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Frontend (Port 80)          │  │
│  │  - Nginx                     │  │
│  │  - Static files              │  │
│  └──────────────────────────────┘  │
│              │                      │
│              │ Proxy /api           │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │  Backend (Port 5000)         │  │
│  │  - Node.js + Express         │  │
│  │  - REST API                  │  │
│  └──────────────────────────────┘  │
│              │                      │
│              │ MongoDB Driver       │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │  MongoDB (Port 27017)        │  │
│  │  - Database                  │  │
│  │  - Volume: mongodb_data      │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔐 Security Features

- ✅ Non-root Docker containers
- ✅ Environment variables for secrets
- ✅ UFW firewall configuration
- ✅ fail2ban for intrusion prevention
- ✅ Automatic security updates
- ✅ MongoDB authentication ready
- ✅ HTTPS ready (certificate can be added)
- ✅ Input validation on backend
- ✅ CORS configuration

---

## 📈 Scalability Features

- ✅ Horizontal Pod Autoscaler (HPA)
- ✅ Multiple replicas (Frontend: 2, Backend: 2)
- ✅ LoadBalancer service
- ✅ StatefulSet ready for MongoDB
- ✅ Rolling updates
- ✅ Resource limits and requests
- ✅ Health checks and readiness probes

---

## 🎯 Key Features by Section

### Section A: Docker
- Multi-stage builds
- Volume persistence
- Health checks
- Custom networks

### Section B: CI/CD
- Automated testing
- Docker registry
- AKS deployment
- Branch-based triggers

### Section C: Kubernetes
- Namespaces
- Persistent volumes
- Services (ClusterIP, LoadBalancer)
- Auto-scaling

### Section D: Ansible
- Multi-server configuration
- Software installation
- Security hardening
- Idempotent playbooks

### Section E: Selenium
- Automated UI testing
- Screenshot capture
- Report generation
- Multiple test cases
