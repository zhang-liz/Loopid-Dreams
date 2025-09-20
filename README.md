# 🌙 Dream Loop Generator

A webapp that transforms 3 dream elements into hypnotic, seamlessly looping videos using Seedream AI. Input elements like "cat", "galaxy", "waterfall" and watch them morph into each other with dreamlike transitions.

## ✨ Features

- **Dream Input Form**: Simple interface for 3 dream elements
- **Intelligent Prompt Generation**: Crafts optimized prompts for seamless loops
- **Seedream Integration**: Generates videos using Seedream's AI technology
- **Hypnotic Loops**: 10-15 second videos designed for repeated viewing
- **Seamless Transitions**: Elements melt into each other with dream logic

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up Seedream API**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Seedream API key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Set up ComfyUI** (Optional - uses mock client if not available)
   - Install ComfyUI: `git clone https://github.com/comfyanonymous/ComfyUI.git`
   - Install Seedream models in `ComfyUI/models/checkpoints/`
   - Start ComfyUI: `python main.py`
   - ComfyUI will be available at http://localhost:8188

5. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

Update `.env.local` with your ComfyUI settings:

```env
COMFYUI_API_URL=http://localhost:8188
COMFYUI_CLIENT_ID=seedream-client
SEEDREAM_MODEL_PATH=models/checkpoints/seedream-v1.safetensors
SEEDREAM_DURATION=15
SEEDREAM_WIDTH=1024
SEEDREAM_HEIGHT=576
```

## 💫 How It Works

1. **Input**: Enter 3 dream elements (e.g., "cat", "galaxy", "face")
2. **Generate**: AI creates a prompt for seamless loop transitions  
3. **Process**: ComfyUI + Seedream generates a hypnotic video loop
4. **Watch**: Enjoy the endless, mesmerizing transitions

## 🎨 Example Dream Loops

- Cat → Galaxy → Face → Waterfall → Cat
- Ocean → Mountain → Clock → Ocean
- Fire → Ice → Wind → Fire

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI Integration**: ComfyUI + Seedream Models
- **Video Generation**: Custom ComfyUI workflows for seamless loops
- **Development**: Local development focused MVP

## 📱 Usage

1. Enter three dream elements in the form
2. Click "Generate Dream Loop"
3. Wait for Seedream to process your request
4. Watch your hypnotic loop and replay to spot hidden transitions!

## 📺 ComfyUI Workflow

For advanced users who want to customize the generation process:

1. **Import Workflow**: Load `src/assets/seedream-workflow.json` into ComfyUI
2. **Customize Nodes**: Adjust parameters like steps, CFG, dimensions
3. **Add Custom Nodes**: Enhance with ControlNet, LoRAs, or other extensions
4. **Export Results**: Generated videos are saved in ComfyUI's output folder

The webapp automatically detects ComfyUI availability and falls back to mock generation for development.

---

*Built for hackathon rapid prototyping with focus on dreamlike video generation*
