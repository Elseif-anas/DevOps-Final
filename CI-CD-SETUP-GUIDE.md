# CI/CD Pipeline Setup Guide

## 📋 GitHub Actions CI/CD Pipeline Documentation

This document contains all the information needed to set up and run the CI/CD pipeline for the Student Management System.

---

## 🔐 Required GitHub Secrets

Before the pipeline can run, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets:

#### 1. **DOCKER_USERNAME**
- **Description**: Your Docker Hub username
- **Example**: `anasfida`
- **How to get**: Your Docker Hub account username

#### 2. **DOCKER_PASSWORD**
- **Description**: Your Docker Hub password or access token (recommended)
- **How to get**: 
  - Login to Docker Hub
  - Go to Account Settings → Security → New Access Token
  - Create a token with Read & Write permissions
  - Use this token instead of your password

#### 3. **AZURE_CREDENTIALS**
- **Description**: Azure service principal credentials in JSON format
- **How to get**:
  ```bash
  az ad sp create-for-rbac \
    --name "github-actions-devops" \
    --role contributor \
    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
    --sdk-auth
  ```
- **Format**: The output JSON (entire JSON object)
  ```json
  {
    "clientId": "xxx",
    "clientSecret": "xxx",
    "subscriptionId": "xxx",
    "tenantId": "xxx",
    "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
    "resourceManagerEndpointUrl": "https://management.azure.com/",
    "activeDirectoryGraphResourceId": "https://graph.windows.net/",
    "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
    "galleryEndpointUrl": "https://gallery.azure.com/",
    "managementEndpointUrl": "https://management.core.windows.net/"
  }
  ```

#### 4. **AZURE_RESOURCE_GROUP**
- **Description**: Your Azure Resource Group name
- **Example**: `devops-final-rg`
- **How to get**: The name of the resource group where your AKS cluster is located

#### 5. **AKS_CLUSTER_NAME**
- **Description**: Your Azure Kubernetes Service cluster name
- **Example**: `student-management-aks`
- **How to get**: The name of your AKS cluster

---

## 🚀 Pipeline Overview

The CI/CD pipeline consists of the following stages:

### **Stage 1: Build & Test Backend**
- ✅ Checkout code
- ✅ Setup Node.js 18
- ✅ Install dependencies
- ✅ Run unit tests
- ✅ Upload test results

### **Stage 2: Build & Test Frontend**
- ✅ Checkout code
- ✅ Setup Node.js 18
- ✅ Install dependencies
- ✅ Run unit tests
- ✅ Build production bundle
- ✅ Upload build artifacts

### **Stage 3: Build & Push Docker Images**
- ✅ Build Backend Docker image
- ✅ Build Frontend Docker image
- ✅ Build MongoDB Docker image
- ✅ Push all images to Docker Hub
- ✅ Tag with latest and commit SHA

### **Stage 4: Deploy to Azure Kubernetes**
- ✅ Login to Azure
- ✅ Connect to AKS cluster
- ✅ Create namespace if needed
- ✅ Apply all Kubernetes manifests
- ✅ Verify deployment rollout
- ✅ Get service URLs

### **Stage 5: Post-Deployment Validation**
- ✅ Check all pods are running
- ✅ Test backend health endpoint
- ✅ Generate deployment report

### **Stage 6: Notifications**
- ✅ Generate pipeline summary
- ✅ Report all stage results

---

## 🔄 Pipeline Triggers

The pipeline is configured to run on:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Push to develop branch**
   ```bash
   git push origin develop
   ```

3. **Pull Request to main or develop**
   ```bash
   # Create a PR on GitHub
   ```

4. **Manual Trigger**
   - Go to Actions tab → Select workflow → Click "Run workflow"

---

## 📦 Prerequisites

### Before Running the Pipeline:

1. **Docker Hub Account**
   - Sign up at https://hub.docker.com
   - Create repositories:
     - `anasfida/student-backend`
     - `anasfida/student-frontend`
     - `anasfida/student-mongo`

2. **Azure Account & AKS Cluster**
   ```bash
   # Create resource group
   az group create --name devops-final-rg --location eastus

   # Create AKS cluster
   az aks create \
     --resource-group devops-final-rg \
     --name student-management-aks \
     --node-count 2 \
     --node-vm-size Standard_B2s \
     --enable-managed-identity \
     --generate-ssh-keys
   ```

3. **GitHub Repository**
   - Push your code to GitHub
   - Configure secrets as described above

---

## 🧪 Testing the Pipeline

### Step 1: Initial Setup
```bash
# 1. Clone your repository
git clone https://github.com/Elseif-anas/DevOps-Final.git
cd DevOps-Final

# 2. Ensure all files are committed
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 2: Monitor Pipeline Execution
1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see the pipeline running
4. Click on the workflow run to see detailed logs

### Step 3: Verify Each Stage
- ✅ **Build & Test Backend** - Should pass all tests
- ✅ **Build & Test Frontend** - Should build successfully
- ✅ **Build & Push Docker** - Check Docker Hub for images
- ✅ **Deploy to AKS** - Check Azure Portal for deployment
- ✅ **Validate Deployment** - Check pods are running

---

## 🐛 Troubleshooting

### Common Issues and Solutions:

#### 1. **Docker Login Failed**
```
Error: Error: Cannot perform an interactive login from a non TTY device
```
**Solution**: Check that `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are set correctly

#### 2. **Azure Login Failed**
```
Error: Login failed with Error: Unable to parse JSON
```
**Solution**: Ensure `AZURE_CREDENTIALS` is the complete JSON output from `az ad sp create-for-rbac`

#### 3. **AKS Context Failed**
```
Error: Resource group not found
```
**Solution**: Verify `AZURE_RESOURCE_GROUP` and `AKS_CLUSTER_NAME` secrets match your Azure resources

#### 4. **Frontend Tests Fail**
```
Error: Test suite failed to run
```
**Solution**: The pipeline uses `--passWithNoTests` flag, but if specific tests fail, check test files

#### 5. **Backend Tests Fail**
```
Error: MongoDB connection failed
```
**Solution**: Tests don't require MongoDB. Check `api.test.js` for correct configuration

#### 6. **Deployment Timeout**
```
Error: Waiting for deployment rollout timeout
```
**Solution**: 
- Check pod logs: `kubectl logs -n student-management -l app=backend`
- Increase timeout in pipeline if needed
- Verify Docker images are accessible

#### 7. **Image Pull Error**
```
Error: ImagePullBackOff
```
**Solution**: 
- Ensure Docker Hub repositories are public OR
- Add image pull secrets to Kubernetes

---

## 📊 Pipeline Success Indicators

### What Success Looks Like:

1. **GitHub Actions Tab**
   - All stages show green checkmarks ✅
   - Total execution time: ~5-10 minutes

2. **Docker Hub**
   - Three new images with `latest` tag
   - Images should have recent "Last Pushed" timestamp

3. **Azure Portal**
   - AKS cluster shows "Succeeded" status
   - All pods in "Running" state

4. **Application Access**
   - Get external IP: `kubectl get svc frontend-service -n student-management`
   - Application accessible in browser

---

## 📸 Required Screenshots for Submission

### Screenshot 1: GitHub Actions Workflow File
- Navigate to `.github/workflows/ci-cd-pipeline.yml`
- Take screenshot showing the complete YAML content

### Screenshot 2: Pipeline Run Success
- Go to Actions tab
- Show a successful run with all stages green
- Include timestamp and commit SHA

### Screenshot 3: Docker Hub Images
- Login to Docker Hub
- Show all three repositories with recent images
- Include tags (latest, commit SHA)

### Screenshot 4: Kubernetes Deployment
Run these commands and capture output:
```bash
kubectl get pods -n student-management
kubectl get svc -n student-management
kubectl get deployments -n student-management
```

### Screenshot 5: Application Running
- Open browser to frontend LoadBalancer IP
- Show the application homepage
- Demonstrate CRUD functionality

---

## 🔧 Manual Testing Commands

After pipeline completes, verify manually:

```bash
# 1. Connect to AKS
az aks get-credentials --resource-group devops-final-rg --name student-management-aks

# 2. Check namespace
kubectl get namespaces

# 3. Check pods
kubectl get pods -n student-management

# 4. Check services
kubectl get svc -n student-management

# 5. Get frontend URL
kubectl get svc frontend-service -n student-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# 6. Test backend health
kubectl port-forward svc/backend-service 5000:5000 -n student-management
curl http://localhost:5000/health

# 7. Check logs if issues
kubectl logs -l app=backend -n student-management --tail=50
kubectl logs -l app=frontend -n student-management --tail=50
```

---

## 🎯 Pipeline Features

### ✅ Implemented Features:

1. **Parallel Build & Test**
   - Backend and Frontend build independently
   - Faster execution time

2. **Conditional Deployment**
   - Only deploys on push to main branch
   - Pull requests only build and test

3. **Docker Image Caching**
   - Uses BuildKit cache for faster builds
   - Reduces build time by ~50%

4. **Automatic Tagging**
   - Tags images with branch name, commit SHA, and latest
   - Easy rollback to previous versions

5. **Health Checks**
   - Validates all pods are running
   - Tests backend API endpoint

6. **Detailed Summaries**
   - GitHub Step Summary shows deployment details
   - Easy troubleshooting with detailed logs

7. **Manual Trigger**
   - Can run pipeline manually via GitHub UI
   - Useful for testing and demonstrations

---

## 📝 Configuration Customization

### To customize the pipeline:

1. **Change Docker Registry**
   - Edit `BACKEND_IMAGE`, `FRONTEND_IMAGE`, `MONGO_IMAGE` in env section

2. **Change Kubernetes Namespace**
   - Edit `NAMESPACE` variable in env section

3. **Add More Tests**
   - Add test scripts in `backend/package.json` or `frontend/package.json`
   - Tests will automatically run in pipeline

4. **Change Node Version**
   - Edit `node-version` in setup-node steps

5. **Add Slack/Email Notifications**
   - Add notification steps in the `notify` job

---

## ✅ Checklist for Exam Submission

- [ ] All 5 secrets configured in GitHub
- [ ] AKS cluster created and accessible
- [ ] Docker Hub repositories created
- [ ] Code pushed to GitHub main branch
- [ ] Pipeline executed successfully (all stages green)
- [ ] Screenshot 1: Workflow YAML file
- [ ] Screenshot 2: Successful pipeline run
- [ ] Screenshot 3: Docker Hub showing images
- [ ] Screenshot 4: Kubernetes pods/services
- [ ] Screenshot 5: Application running in browser
- [ ] All screenshots have timestamps
- [ ] Documentation explains each stage

---

## 🎓 Marks Breakdown (14 Marks Total)

### Task B1: Pipeline Development (10 marks)
- ✅ Build stage (frontend + backend) - 2 marks
- ✅ Automated tests - 3 marks
- ✅ Docker image build and push - 3 marks
- ✅ Deployment step to Kubernetes - 2 marks

### Task B2: Trigger Configuration (4 marks)
- ✅ Push/commit trigger - 2 marks
- ✅ Pull request trigger - 2 marks

---

## 🚀 Quick Start Commands

```bash
# 1. Setup Azure Resources
az login
az group create --name devops-final-rg --location eastus
az aks create --resource-group devops-final-rg --name student-management-aks --node-count 2

# 2. Get AKS Credentials
az aks get-credentials --resource-group devops-final-rg --name student-management-aks

# 3. Create Service Principal for GitHub
az ad sp create-for-rbac --name github-actions-devops --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/devops-final-rg --sdk-auth

# 4. Configure GitHub Secrets (via GitHub UI)
# Add all 5 secrets as documented above

# 5. Push Code to Trigger Pipeline
git add .
git commit -m "Add CI/CD pipeline"
git push origin main

# 6. Monitor Pipeline
# Go to GitHub Actions tab and watch the execution

# 7. Get Application URL
kubectl get svc frontend-service -n student-management
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs for detailed error messages
3. Verify all secrets are configured correctly
4. Ensure Azure resources are created and accessible

---

**Last Updated**: December 16, 2025
**Pipeline Version**: 1.0.0
**Status**: Production Ready ✅
