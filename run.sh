#!/bin/bash

# Student Management System - Setup and Run Script
# Bash script for Linux/Mac

echo "======================================================================"
echo "    STUDENT MANAGEMENT SYSTEM - DevOps Final Exam Project"
echo "======================================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check Docker
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Display menu
echo ""
echo -e "${CYAN}What would you like to do?${NC}"
echo "1. Start Application (Docker Compose)"
echo "2. Stop Application"
echo "3. View Logs"
echo "4. Restart Application"
echo "5. Clean Everything (Remove containers and volumes)"
echo "6. Build Images"
echo "7. Check Status"
echo "8. Run Selenium Tests"
echo "9. Exit"
echo ""

read -p "Enter your choice (1-9): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}🚀 Starting Student Management System...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Application started successfully!${NC}"
        echo ""
        echo -e "${CYAN}Access the application at:${NC}"
        echo -e "  ${YELLOW}Frontend: http://localhost:80${NC}"
        echo -e "  ${YELLOW}Backend API: http://localhost:5000${NC}"
        echo -e "  ${YELLOW}MongoDB: localhost:27017${NC}"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🛑 Stopping application...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Application stopped${NC}"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}📋 Showing logs (Press Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    4)
        echo ""
        echo -e "${YELLOW}🔄 Restarting application...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Application restarted${NC}"
        ;;
    5)
        echo ""
        echo -e "${RED}🗑️  Removing all containers and volumes...${NC}"
        read -p "Are you sure? This will delete all data! (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Everything cleaned${NC}"
        else
            echo -e "${YELLOW}Cancelled${NC}"
        fi
        ;;
    6)
        echo ""
        echo -e "${YELLOW}🔨 Building Docker images...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}✅ Images built successfully${NC}"
        ;;
    7)
        echo ""
        echo -e "${CYAN}📊 Container Status:${NC}"
        docker-compose ps
        echo ""
        echo -e "${CYAN}💾 Docker Images:${NC}"
        docker images | grep student
        ;;
    8)
        echo ""
        echo -e "${YELLOW}🧪 Running Selenium Tests...${NC}"
        echo -e "${YELLOW}Make sure the application is running first!${NC}"
        echo ""
        cd selenium-tests
        if [ -d "node_modules" ]; then
            npm test
        else
            echo -e "${YELLOW}Installing dependencies first...${NC}"
            npm install
            npm test
        fi
        cd ..
        ;;
    9)
        echo ""
        echo -e "${CYAN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}❌ Invalid choice!${NC}"
        ;;
esac

echo ""
