# Azure Setup Commands for CI/CD Pipeline

## 🔷 Complete Azure Configuration Script

This file contains all Azure CLI commands needed to set up the infrastructure for the CI/CD pipeline.

---

## Prerequisites

1. **Azure CLI Installed**
   ```powershell
   # Check if Azure CLI is installed
   az --version
   
   # If not installed, download from:
   # https://aka.ms/installazurecliwindows
   ```

2. **Azure Subscription**
   - Active Azure subscription
   - Sufficient permissions to create resources

---

## Step 1: Login to Azure

```powershell
# Login to Azure
az login

# If you have multiple subscriptions, list them
az account list --output table

# Set the subscription you want to use
az account set --subscription "YOUR_SUBSCRIPTION_NAME_OR_ID"

# Verify current subscription
az account show
```

---

## Step 2: Create Resource Group

```powershell
# Create resource group in East US
az group create `
  --name devops-final-rg `
  --location eastus

# Verify resource group creation
az group show --name devops-final-rg
```

**Alternative Locations:**
- `eastus` - East US
- `westus2` - West US 2
- `westeurope` - West Europe
- `southeastasia` - Southeast Asia

---

## Step 3: Create AKS Cluster

### Option A: Basic Cluster (Recommended for Exam)

```powershell
# Create basic AKS cluster with 2 nodes
az aks create `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --node-count 2 `
  --node-vm-size Standard_B2s `
  --enable-managed-identity `
  --generate-ssh-keys `
  --network-plugin azure `
  --network-policy azure `
  --load-balancer-sku standard
```

**Execution Time:** 5-10 minutes ⏱️

### Option B: Production-Ready Cluster (Advanced)

```powershell
# Create production-grade AKS cluster
az aks create `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --node-count 3 `
  --node-vm-size Standard_D2s_v3 `
  --enable-managed-identity `
  --enable-cluster-autoscaler `
  --min-count 2 `
  --max-count 5 `
  --enable-addons monitoring `
  --generate-ssh-keys `
  --network-plugin azure `
  --network-policy azure `
  --load-balancer-sku standard `
  --zones 1 2 3
```

**Features:**
- Auto-scaling (2-5 nodes)
- Monitoring enabled
- Zone redundancy
- Better VM size

---

## Step 4: Get AKS Credentials

```powershell
# Get credentials to connect to the cluster
az aks get-credentials `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --overwrite-existing

# Verify connection
kubectl get nodes

# Expected output:
# NAME                                STATUS   ROLES   AGE   VERSION
# aks-nodepool1-xxxxx-vmss000000     Ready    agent   5m    v1.27.x
# aks-nodepool1-xxxxx-vmss000001     Ready    agent   5m    v1.27.x
```

---

## Step 5: Create Service Principal for GitHub Actions

### Get Subscription ID

```powershell
# Get your subscription ID
$SUBSCRIPTION_ID = az account show --query id -o tsv
Write-Host "Subscription ID: $SUBSCRIPTION_ID"
```

### Create Service Principal

```powershell
# Create service principal with contributor role
az ad sp create-for-rbac `
  --name "github-actions-devops" `
  --role contributor `
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/devops-final-rg `
  --sdk-auth
```

**Important:** Copy the ENTIRE JSON output! 
You'll need it for the `AZURE_CREDENTIALS` GitHub secret.

Expected output:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

### Verify Service Principal

```powershell
# List service principals
az ad sp list --display-name "github-actions-devops" --output table
```

---

## Step 6: Verify AKS Cluster

```powershell
# Get cluster info
az aks show `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --output table

# Get cluster credentials (if not done already)
az aks get-credentials `
  --resource-group devops-final-rg `
  --name student-management-aks

# Check cluster nodes
kubectl get nodes -o wide

# Check cluster version
kubectl version

# Check cluster namespaces
kubectl get namespaces
```

---

## Step 7: Test Cluster Connectivity

```powershell
# Create a test namespace
kubectl create namespace test-namespace

# Deploy a test pod
kubectl run nginx --image=nginx -n test-namespace

# Check pod status
kubectl get pods -n test-namespace

# Clean up test resources
kubectl delete namespace test-namespace
```

---

## Summary of Values for GitHub Secrets

After completing the above steps, you should have:

### 1. AZURE_CREDENTIALS
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  ...
}
```
*Copy entire JSON from Step 5*

### 2. AZURE_RESOURCE_GROUP
```
devops-final-rg
```

### 3. AKS_CLUSTER_NAME
```
student-management-aks
```

---

## Additional Useful Commands

### View All Resources in Resource Group

```powershell
az resource list `
  --resource-group devops-final-rg `
  --output table
```

### Get AKS Cluster Dashboard Credentials

```powershell
# Start Kubernetes dashboard (legacy)
az aks browse `
  --resource-group devops-final-rg `
  --name student-management-aks
```

### Scale AKS Cluster

```powershell
# Scale to 3 nodes
az aks scale `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --node-count 3
```

### Get Cluster Credentials for Different User

```powershell
# Get admin credentials
az aks get-credentials `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --admin
```

### View AKS Cluster Logs

```powershell
# Get cluster activity logs
az monitor activity-log list `
  --resource-group devops-final-rg `
  --output table
```

---

## Troubleshooting

### Issue: "az: command not found"
**Solution:** Install Azure CLI
```powershell
# Download and install from:
# https://aka.ms/installazurecliwindows

# Or use winget
winget install Microsoft.AzureCLI
```

### Issue: "Insufficient permissions"
**Solution:** Ensure you have Contributor or Owner role
```powershell
# Check your role assignment
az role assignment list --assignee YOUR_EMAIL@domain.com --output table
```

### Issue: "Quota exceeded"
**Solution:** Request quota increase or use smaller VM size
```powershell
# Check current quota
az vm list-usage --location eastus --output table

# Use smaller VM size
--node-vm-size Standard_B2s
```

### Issue: "AKS cluster creation failed"
**Solution:** Check activity logs
```powershell
# View deployment logs
az deployment group list `
  --resource-group devops-final-rg `
  --output table

# Get specific deployment details
az deployment group show `
  --resource-group devops-final-rg `
  --name DEPLOYMENT_NAME
```

### Issue: "kubectl: command not found"
**Solution:** Install kubectl
```powershell
# Install kubectl using Azure CLI
az aks install-cli

# Or download from:
# https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/

# Verify installation
kubectl version --client
```

---

## Cost Management

### Check Estimated Costs

```powershell
# View cost analysis
az consumption usage list `
  --start-date 2025-12-01 `
  --end-date 2025-12-31 `
  --output table
```

### Estimated Monthly Costs for This Setup

| Resource | Size | Estimated Cost |
|----------|------|----------------|
| AKS Cluster | Control Plane | Free |
| VM Nodes (2x) | Standard_B2s | $30-40/month |
| Load Balancer | Standard | $20/month |
| Public IP | Standard | $3/month |
| **Total** | | **~$55/month** |

**Note:** Costs are estimates and vary by region.

### Stop Cluster to Save Costs

```powershell
# Stop the cluster (keeps configuration, stops billing for VMs)
az aks stop `
  --resource-group devops-final-rg `
  --name student-management-aks

# Start the cluster when needed
az aks start `
  --resource-group devops-final-rg `
  --name student-management-aks
```

---

## Cleanup (After Exam)

### Delete Everything

```powershell
# Delete the entire resource group (removes all resources)
az group delete `
  --name devops-final-rg `
  --yes `
  --no-wait

# Verify deletion
az group exists --name devops-final-rg
# Should return: false
```

### Delete Only AKS Cluster

```powershell
# Delete just the AKS cluster
az aks delete `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --yes `
  --no-wait
```

### Delete Service Principal

```powershell
# Get service principal ID
$SP_ID = az ad sp list --display-name "github-actions-devops" --query [0].id -o tsv

# Delete service principal
az ad sp delete --id $SP_ID
```

---

## Complete Setup Script (Copy-Paste Ready)

```powershell
# ======================================
# Complete Azure Setup for CI/CD Pipeline
# ======================================

# 1. Login
az login

# 2. Create resource group
az group create --name devops-final-rg --location eastus

# 3. Create AKS cluster
az aks create `
  --resource-group devops-final-rg `
  --name student-management-aks `
  --node-count 2 `
  --node-vm-size Standard_B2s `
  --enable-managed-identity `
  --generate-ssh-keys `
  --network-plugin azure

# 4. Get credentials
az aks get-credentials `
  --resource-group devops-final-rg `
  --name student-management-aks

# 5. Verify connection
kubectl get nodes

# 6. Create service principal
$SUBSCRIPTION_ID = az account show --query id -o tsv
az ad sp create-for-rbac `
  --name "github-actions-devops" `
  --role contributor `
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/devops-final-rg `
  --sdk-auth

Write-Host "`n==================================="
Write-Host "COPY THE JSON OUTPUT ABOVE!"
Write-Host "You need it for AZURE_CREDENTIALS"
Write-Host "===================================`n"

Write-Host "GitHub Secrets:"
Write-Host "AZURE_CREDENTIALS: [JSON output above]"
Write-Host "AZURE_RESOURCE_GROUP: devops-final-rg"
Write-Host "AKS_CLUSTER_NAME: student-management-aks"
```

---

## Verification Checklist

- [ ] Azure CLI installed and working
- [ ] Successfully logged into Azure
- [ ] Resource group created (`devops-final-rg`)
- [ ] AKS cluster created (`student-management-aks`)
- [ ] Can connect to cluster with kubectl
- [ ] `kubectl get nodes` shows 2 nodes in Ready state
- [ ] Service principal created
- [ ] JSON output copied for GitHub secrets
- [ ] Have all 3 values for GitHub secrets

---

**Setup Time:** 15-20 minutes (including AKS creation)  
**Last Updated:** December 16, 2025  
**Status:** Production Ready ✅
