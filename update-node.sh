#!/bin/bash

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "NVM is not installed. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Install and use the required Node.js version
echo "Installing Node.js 18.18.0..."
nvm install 18.18.0
nvm use 18.18.0

# Verify the Node.js version
echo "Current Node.js version:"
node -v

echo "You can now run 'npm run dev' to start the development server." 