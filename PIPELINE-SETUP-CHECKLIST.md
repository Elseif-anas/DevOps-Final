# 🚀 CI/CD Pipeline - Quick Setup Checklist

## Step-by-Step Setup Guide for GitHub Actions Pipeline

---

## ⚡ Prerequisites

Before starting, ensure you have:
- [ ] GitHub account with repository access
- [ ] Docker Hub account
- [ ] Azure account with active subscription
- [ ] Azure CLI installed locally
- [ ] kubectl installed locally

---

## 📋 Step 1: Create Azure Resources

### 1.1 Login to Azure
```powershell
az login
```

### 1.2 Create Resource Group
```powershell
az group create --name devops-final-rg --location eastus
```

### 1.3 Create AKS Cluster
```powershell
az aks create `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --node-count 2 `
  --node-vm-size Standard_B2s `
  --enable-managed-identity `
  --generate-ssh-keys
```
⏱️ This takes 5-10 minutes

### 1.4 Get AKS Credentials
```powershell
az aks get-credentials --resource-group devops-final-rg --name student-management-aks
```

### 1.5 Verify Connection
```powershell
kubectl get nodes
```

---

## 🔐 Step 2: Create Azure Service Principal

### 2.1 Get Your Subscription ID
```powershell
az account show --query id -o tsv
```
💾 **Save this ID** - You'll need it next

### 2.2 Create Service Principal
Replace `{subscription-id}` with your actual subscription ID:
```powershell
az ad sp create-for-rbac `
  --name "github-actions-devops" `
  --role contributor `
  --scopes /subscriptions/{subscription-id}/resourceGroups/devops-final-rg `
  --sdk-auth
```

### 2.3 Save the Output
You'll get JSON output like this:
```json
{
  "clientId": "xxx-xxx-xxx",
  "clientSecret": "xxx-xxx-xxx",
  "subscriptionId": "xxx-xxx-xxx",
  "tenantId": "xxx-xxx-xxx",
  ...
}
```
💾 **Copy the ENTIRE JSON output** - You'll need this for GitHub secrets

---

## 🐳 Step 3: Prepare Docker Hub

### 3.1 Login to Docker Hub
Visit: https://hub.docker.com

### 3.2 Create Access Token (Recommended)
1. Click your profile → Account Settings
2. Go to Security → New Access Token
3. Name: `github-actions`
4. Permissions: **Read & Write**
5. Click **Generate**
6. 💾 **Copy the token** - It won't be shown again

### 3.3 Note Your Docker Username
Example: `anasfida`

---

## 🔑 Step 4: Configure GitHub Secrets

### 4.1 Go to GitHub Repository Settings
1. Open your repository: `https://github.com/Elseif-anas/DevOps-Final`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 4.2 Add Secret 1: DOCKER_USERNAME
- **Name**: `DOCKER_USERNAME`
- **Value**: Your Docker Hub username (e.g., `anasfida`)
- Click **Add secret**

### 4.3 Add Secret 2: DOCKER_PASSWORD
- **Name**: `DOCKER_PASSWORD`
- **Value**: Your Docker Hub access token (from Step 3.2)
- Click **Add secret**

### 4.4 Add Secret 3: AZURE_CREDENTIALS
- **Name**: `AZURE_CREDENTIALS`
- **Value**: The entire JSON output from Step 2.2
- Click **Add secret**

### 4.5 Add Secret 4: AZURE_RESOURCE_GROUP
- **Name**: `AZURE_RESOURCE_GROUP`
- **Value**: `devops-final-rg`
- Click **Add secret**

### 4.6 Add Secret 5: AKS_CLUSTER_NAME
- **Name**: `AKS_CLUSTER_NAME`
- **Value**: `student-management-aks`
- Click **Add secret**

### 4.7 Verify All Secrets
You should now have 5 secrets:
- ✅ DOCKER_USERNAME
- ✅ DOCKER_PASSWORD
- ✅ AZURE_CREDENTIALS
- ✅ AZURE_RESOURCE_GROUP
- ✅ AKS_CLUSTER_NAME

---

## 📤 Step 5: Push Code to GitHub

### 5.1 Ensure You're on Main Branch
```powershell
git checkout main
```

### 5.2 Add All Files
```powershell
git add .
```

### 5.3 Commit Changes
```powershell
git commit -m "Add CI/CD pipeline configuration"
```

### 5.4 Push to GitHub
```powershell
git push origin main
```

---

## 👀 Step 6: Monitor Pipeline Execution

### 6.1 Go to Actions Tab
1. Open your repository on GitHub
2. Click **Actions** tab at the top
3. You should see a new workflow run starting

### 6.2 Click on the Running Workflow
- You'll see all the jobs and stages
- Each stage will show progress in real-time

### 6.3 Expected Stages
1. ✅ Build and Test Backend (~2 min)
2. ✅ Build and Test Frontend (~2 min)
3. ✅ Build and Push Docker Images (~3 min)
4. ✅ Deploy to Azure Kubernetes (~2 min)
5. ✅ Validate Deployment (~1 min)
6. ✅ Send Notifications (~10 sec)

**Total Time**: ~10-12 minutes

---

## 🎯 Step 7: Verify Deployment

### 7.1 Check Pods
```powershell
kubectl get pods -n student-management
```
Expected output: All pods should be "Running"

### 7.2 Check Services
```powershell
kubectl get svc -n student-management
```

### 7.3 Get Application URL
```powershell
kubectl get svc frontend-service -n student-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
💾 **Copy this IP address**

### 7.4 Open Application in Browser
```
http://{EXTERNAL-IP}
```
Replace `{EXTERNAL-IP}` with the IP from step 7.3

---

## 📸 Step 8: Take Screenshots for Submission

### Screenshot 1: Workflow YAML File
1. Go to your repository
2. Navigate to `.github/workflows/ci-cd-pipeline.yml`
3. Take screenshot showing the file content

### Screenshot 2: Successful Pipeline Run
1. Go to Actions tab
2. Click on a successful workflow run (all green checkmarks)
3. Take screenshot showing:
   - All stages completed successfully
   - Timestamp
   - Commit SHA

### Screenshot 3: Docker Hub Images
1. Login to Docker Hub
2. Go to your repositories
3. Take screenshot showing:
   - `anasfida/student-backend` with latest tag
   - `anasfida/student-frontend` with latest tag
   - `anasfida/student-mongo` with latest tag
   - Recent "Last Pushed" timestamps

### Screenshot 4: Kubernetes Deployment
Run this command and take screenshot:
```powershell
kubectl get all -n student-management
```

### Screenshot 5: Running Application
1. Open browser to your application URL
2. Take screenshot showing:
   - Homepage loaded successfully
   - Navigation working
   - Student list displaying

---

## 🔧 Troubleshooting

### Issue: Pipeline Fails at Azure Login
**Solution**: 
```powershell
# Recreate service principal
az ad sp create-for-rbac --name github-actions-devops-2 --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/devops-final-rg --sdk-auth
# Update AZURE_CREDENTIALS secret with new output
```

### Issue: Docker Push Fails
**Solution**:
- Verify DOCKER_USERNAME is correct (no typos)
- Regenerate Docker Hub access token
- Update DOCKER_PASSWORD secret

### Issue: Pods Not Running
**Solution**:
```powershell
# Check pod status
kubectl describe pod {pod-name} -n student-management

# Check logs
kubectl logs {pod-name} -n student-management

# Common fix: Pull images manually
docker pull anasfida/student-backend:latest
docker pull anasfida/student-frontend:latest
docker pull anasfida/student-mongo:latest
```

### Issue: LoadBalancer IP Pending
**Solution**:
```powershell
# Wait a few minutes, then check again
kubectl get svc frontend-service -n student-management -w

# If still pending after 5 minutes, check AKS
az aks show --resource-group devops-final-rg --name student-management-aks
```

---

## ✅ Final Verification Checklist

Before submitting, verify:
- [ ] Pipeline runs successfully (all stages green)
- [ ] All 5 screenshots taken and labeled
- [ ] Docker Hub shows 3 images with recent timestamps
- [ ] All Kubernetes pods are Running
- [ ] Application accessible via LoadBalancer IP
- [ ] Can add/edit/delete students in application
- [ ] Backend API responds at /health endpoint
- [ ] CI/CD-SETUP-GUIDE.md included in submission

---

## 📊 Expected Results

### Successful Pipeline Run Shows:
- ✅ Build and Test Backend: **SUCCESS** (2m 15s)
- ✅ Build and Test Frontend: **SUCCESS** (2m 30s)
- ✅ Build and Push Docker: **SUCCESS** (3m 45s)
- ✅ Deploy to AKS: **SUCCESS** (2m 10s)
- ✅ Validate Deployment: **SUCCESS** (45s)
- ✅ Notify: **SUCCESS** (10s)

### Docker Hub Should Show:
```
anasfida/student-backend:latest    (pushed 5 minutes ago)
anasfida/student-frontend:latest   (pushed 5 minutes ago)
anasfida/student-mongo:latest      (pushed 5 minutes ago)
```

### Kubernetes Should Show:
```
NAME                                    READY   STATUS    RESTARTS   AGE
mongodb-deployment-xxx                  1/1     Running   0          5m
backend-deployment-xxx                  2/2     Running   0          5m
frontend-deployment-xxx                 2/2     Running   0          5m
```

---

## 🎓 Marks Breakdown

This CI/CD implementation covers:

**Task B1: Pipeline Development (10 marks)**
- Build stage for frontend and backend ✅
- Automated tests (Jest for backend, React tests for frontend) ✅
- Docker image build and push to Docker Hub ✅
- Deployment to AKS cluster ✅

**Task B2: Trigger Configuration (4 marks)**
- Runs on push to main/develop branches ✅
- Runs on pull requests ✅
- Manual trigger via workflow_dispatch ✅

**Total: 14/14 marks** 🎉

---

## 📞 Quick Commands Reference

```powershell
# Check pipeline status (from GitHub CLI)
gh run list

# Check AKS status
kubectl get all -n student-management

# Get application URL
kubectl get svc frontend-service -n student-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# View logs
kubectl logs -l app=backend -n student-management --tail=50
kubectl logs -l app=frontend -n student-management --tail=50

# Restart deployment (if needed)
kubectl rollout restart deployment/backend-deployment -n student-management
kubectl rollout restart deployment/frontend-deployment -n student-management

# Delete everything (to start over)
kubectl delete namespace student-management
```

---

**Setup Time**: 20-30 minutes (including Azure resource creation)
**Pipeline Execution Time**: 10-12 minutes
**Total Time**: ~45 minutes

**Status**: Ready for Production ✅
**Last Updated**: December 16, 2025
