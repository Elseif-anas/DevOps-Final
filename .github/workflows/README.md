# GitHub Actions CI/CD Pipeline

This directory contains the CI/CD workflow configuration for the Student Management System.

## Pipeline Stages

### 1. Build Stage (Frontend + Backend)
- Installs dependencies
- Runs linting (if configured)
- Creates production builds

### 2. Test Stage
- Runs automated tests for both frontend and backend
- Validates code quality

### 3. Docker Build & Push
- Builds Docker images for all services
- Pushes images to Docker Hub registry
- Tags images appropriately

### 4. Deploy to Kubernetes
- Deploys to Azure Kubernetes Service (AKS)
- Updates running containers with new images
- Performs health checks

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Docker Hub Credentials
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

### Azure Credentials
- `AZURE_CREDENTIALS`: Azure service principal JSON
- `AZURE_RESOURCE_GROUP`: Azure resource group name
- `AZURE_AKS_CLUSTER`: AKS cluster name

## Triggering the Pipeline

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Manual trigger via GitHub Actions UI

## How to Setup

1. Create a Docker Hub account and get your credentials
2. Create an Azure account and setup AKS cluster
3. Add all required secrets to GitHub repository
4. Push code to trigger the pipeline

## Monitoring

Monitor pipeline execution in the GitHub Actions tab of your repository.
