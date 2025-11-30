# Deployment Guide - AWS Lightsail (Ubuntu 24)

This guide will help you deploy the Blood Donation App to your AWS Lightsail server.

## Prerequisites
1.  **AWS Lightsail Instance**: Ubuntu 24.04 LTS.
2.  **SSH Access**: You should be able to connect to your server via SSH.
3.  **Project Files**: This project on your local machine.

## Step 1: Prepare the Server
1.  Connect to your server:
    ```bash
    ssh ubuntu@<YOUR_SERVER_IP>
    ```

## Step 2: Copy Files to Server
You need to copy the project files to your server. You can use `scp` (Secure Copy) from your **local machine**.

Run this command from your project root folder (`g:\NMR\abhi`):

```powershell
# Replace <YOUR_KEY.pem> with your AWS key path and <YOUR_SERVER_IP> with the server's IP
scp -r -i <YOUR_KEY.pem> ./backend ./frontend ./deployment ubuntu@<YOUR_SERVER_IP>:~/blood-donation-app
```

*Alternatively, if you are using Git, you can just clone the repository on the server.*

## Step 3: Run the Setup Script
1.  SSH back into your server.
2.  Navigate to the project folder:
    ```bash
    cd ~/blood-donation-app
    ```
3.  Make the script executable and run it:
    ```bash
    chmod +x deployment/setup.sh
    ./deployment/setup.sh
    ```

## Step 4: Final Configuration
1.  **Update Frontend Config**:
    The frontend is currently pointing to your local PC. You need to update it to point to the server's public IP.
    
    *On the server:*
    ```bash
    nano frontend/src/config.js
    ```
    Change `API_URL` to:
    ```javascript
    const config = {
        API_URL: 'https://lifeflow.chishiya.xyz/api',
    };
    export default config;
    ```

2.  **Rebuild Frontend**:
    ```bash
    cd frontend
    npm run build
    ```

3.  **Restart Nginx** (Optional, but good practice):
    ```bash
    sudo systemctl restart nginx
    ```

## Step 5: Verify
Open your browser and visit: `https://lifeflow.chishiya.xyz`

## Step 6: Update Mobile App
To make the mobile app work with the new server:
1.  Update `frontend/src/config.js` **on your local PC** to use the AWS Public IP.
2.  Run `npm run update:mobile`.
3.  Re-run the app on your phone.

## Step 7: Configure Domain (Optional)
If you are using a custom domain (like `lifeflow.chishiya.xyz`):

1.  **Update Nginx Config**:
    ```bash
    sudo nano /etc/nginx/sites-available/blood-donation
    ```
    Change `server_name _;` to:
    ```nginx
    server_name lifeflow.chishiya.xyz;
    ```

2.  **Restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    ```
