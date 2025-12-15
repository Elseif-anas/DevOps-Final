# Ansible Configuration Management

This directory contains Ansible playbooks and inventory for configuring the Student Management System infrastructure.

## Prerequisites

1. **Install Ansible:**
   ```bash
   # On Ubuntu/Debian
   sudo apt update
   sudo apt install ansible -y

   # On macOS
   brew install ansible

   # On Windows (WSL)
   sudo apt update && sudo apt install ansible -y
   ```

2. **SSH Access:**
   - Ensure you have SSH access to target servers
   - Setup SSH keys for passwordless authentication

## Inventory Setup

The `hosts.ini` file contains server groups:
- **webservers**: Nginx web servers
- **appservers**: Node.js application servers
- **dbservers**: MongoDB database servers

### Update Inventory

Edit `hosts.ini` and replace with your actual server IPs:
```ini
[webservers]
web1 ansible_host=YOUR_SERVER_IP ansible_user=YOUR_USERNAME

[appservers]
app1 ansible_host=YOUR_SERVER_IP ansible_user=YOUR_USERNAME

[dbservers]
db1 ansible_host=YOUR_SERVER_IP ansible_user=YOUR_USERNAME
```

## Playbook Overview

The `playbook.yml` includes multiple roles:

1. **Web Server Configuration (Nginx)**
   - Installs and configures Nginx
   - Sets up firewall rules
   - Configures reverse proxy

2. **Application Server Configuration (Node.js)**
   - Installs Node.js 18
   - Installs PM2 for process management
   - Configures application environment

3. **Database Server Configuration (MongoDB)**
   - Installs MongoDB 7.0
   - Configures database access
   - Sets up security rules

4. **Docker Installation**
   - Installs Docker on all servers
   - Configures Docker daemon

5. **Security Hardening**
   - Configures fail2ban
   - Enables automatic security updates
   - Hardens SSH configuration

## Running the Playbook

### Test Connectivity
```bash
ansible all -i hosts.ini -m ping
```

### Run Full Playbook
```bash
ansible-playbook -i hosts.ini playbook.yml
```

### Run Specific Roles
```bash
# Only web servers
ansible-playbook -i hosts.ini playbook.yml --limit webservers

# Only install Docker
ansible-playbook -i hosts.ini playbook.yml --tags docker

# Skip Docker installation
ansible-playbook -i hosts.ini playbook.yml --skip-tags docker
```

### Dry Run (Check Mode)
```bash
ansible-playbook -i hosts.ini playbook.yml --check
```

### Verbose Output
```bash
ansible-playbook -i hosts.ini playbook.yml -v
# or -vv, -vvv, -vvvv for more verbosity
```

## Available Tags

Use tags to run specific tasks:
- `update`: System updates
- `packages`: Package installation
- `nginx`: Nginx configuration
- `nodejs`: Node.js setup
- `mongodb`: MongoDB setup
- `docker`: Docker installation
- `firewall`: Firewall configuration
- `security`: Security hardening

Example:
```bash
ansible-playbook -i hosts.ini playbook.yml --tags "nginx,nodejs"
```

## Testing After Execution

### Verify Nginx
```bash
ansible webservers -i hosts.ini -m shell -a "systemctl status nginx"
```

### Verify Node.js
```bash
ansible appservers -i hosts.ini -m shell -a "node --version"
```

### Verify MongoDB
```bash
ansible dbservers -i hosts.ini -m shell -a "systemctl status mongod"
```

### Verify Docker
```bash
ansible all -i hosts.ini -m shell -a "docker --version"
```

## Common Issues

### SSH Connection Issues
```bash
# Test SSH connection
ssh -i ~/.ssh/id_rsa username@server_ip

# Add SSH key
ssh-copy-id -i ~/.ssh/id_rsa username@server_ip
```

### Permission Denied
Ensure your user has sudo privileges:
```bash
# On target server
sudo usermod -aG sudo username
```

### MongoDB Not Starting
Check logs:
```bash
ansible dbservers -i hosts.ini -m shell -a "journalctl -u mongod -n 50"
```

## Screenshots for Submission

Capture these for your exam submission:
1. `ansible all -i hosts.ini -m ping` - Successful connectivity
2. `ansible-playbook -i hosts.ini playbook.yml` - Complete playbook run
3. Verification commands showing services running
4. Browser showing application deployed via Ansible

## Security Notes

- Never commit `hosts.ini` with real IPs to public repositories
- Use Ansible Vault for sensitive data:
  ```bash
  ansible-vault create secrets.yml
  ansible-playbook -i hosts.ini playbook.yml --ask-vault-pass
  ```
- Regularly update all packages
- Use SSH keys instead of passwords
