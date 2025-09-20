#!/bin/bash

# Dream Loop Generator Setup Script
echo "🌙 Setting up Dream Loop Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 Please edit .env.local to configure your ComfyUI settings"
else
    echo "✅ .env.local already exists"
fi

# Check if ComfyUI is available
echo "🔍 Checking for ComfyUI..."
if curl -s http://localhost:8188/queue > /dev/null 2>&1; then
    echo "✅ ComfyUI is running at http://localhost:8188"
    echo "🎯 Ready to generate real videos!"
else
    echo "⚠️  ComfyUI is not running at http://localhost:8188"
    echo "📝 The app will use mock generation for development"
    echo ""
    echo "To set up ComfyUI:"
    echo "1. git clone https://github.com/comfyanonymous/ComfyUI.git"
    echo "2. cd ComfyUI && pip install -r requirements.txt"
    echo "3. python main.py"
    echo "4. Place Seedream models in ComfyUI/models/checkpoints/"
fi

echo ""
echo "🚀 Setup complete! Run the following commands to start:"
echo ""
echo "   npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "🌟 Happy dream loop generating!"