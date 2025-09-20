/**
 * ComfyUI API Client for Seedream Video Generation
 * Handles communication with ComfyUI server for video generation workflows
 */

import { v4 as uuidv4 } from 'uuid';

export interface ComfyUIConfig {
  apiUrl: string;
  clientId: string;
  modelPath?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface SeedreamWorkflowParams {
  prompt: string;
  width: number;
  height: number;
  duration: number;
  seed?: number;
  steps?: number;
  cfg?: number;
  model_path?: string;
}

export interface ComfyUIResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, any>;
}

export interface GenerationResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
  error?: string;
  images?: string[];
}

export class ComfyUIClient {
  private config: ComfyUIConfig;
  private ws: WebSocket | null = null;
  private activeJobs = new Map<string, any>();

  constructor(config: ComfyUIConfig) {
    this.config = config;
  }

  /**
   * Create a Seedream video generation workflow
   */
  private createSeedreamWorkflow(params: SeedreamWorkflowParams): any {
    const workflow = {
      "1": {
        "inputs": {
          "text": params.prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Positive)"
        }
      },
      "2": {
        "inputs": {
          "text": "low quality, blurry, distorted, text, watermark, logo, bad anatomy",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Negative)"
        }
      },
      "3": {
        "inputs": {
          "seed": params.seed || Math.floor(Math.random() * 1000000),
          "steps": params.steps || 20,
          "cfg": params.cfg || 7.5,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["1", 0],
          "negative": ["2", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler"
        }
      },
      "4": {
        "inputs": {
          "ckpt_name": params.model_path || "seedream-v1.safetensors"
        },
        "class_type": "CheckpointLoaderSimple",
        "_meta": {
          "title": "Load Checkpoint"
        }
      },
      "5": {
        "inputs": {
          "width": params.width,
          "height": params.height,
          "batch_size": params.duration // Use duration as batch size for video frames
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
          "title": "Empty Latent Image"
        }
      },
      "6": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode",
        "_meta": {
          "title": "VAE Decode"
        }
      },
      "7": {
        "inputs": {
          "filename_prefix": "seedream_loop",
          "images": ["6", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Image"
        }
      },
      "8": {
        "inputs": {
          "images": ["6", 0],
          "fps": 8,
          "loop_count": 0,
          "filename_prefix": "dream_loop",
          "format": "image/gif",
          "pingpong": false,
          "save_output": true
        },
        "class_type": "SaveAnimatedWEBP",
        "_meta": {
          "title": "Save Animated Video"
        }
      }
    };

    return workflow;
  }

  /**
   * Queue a prompt for execution
   */
  async queuePrompt(workflow: any): Promise<ComfyUIResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: workflow,
          client_id: this.config.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ComfyUI queue error:', error);
      throw error;
    }
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.config.apiUrl}/queue`);
      if (!response.ok) {
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ComfyUI queue status error:', error);
      throw error;
    }
  }

  /**
   * Get generated outputs
   */
  async getHistory(promptId: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.apiUrl}/history/${promptId}`);
      if (!response.ok) {
        throw new Error(`ComfyUI API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ComfyUI history error:', error);
      throw error;
    }
  }

  /**
   * Generate video and wait for completion
   */
  async generateVideo(params: SeedreamWorkflowParams): Promise<GenerationResult> {
    try {
      // Create workflow
      const workflow = this.createSeedreamWorkflow(params);
      
      // Queue the prompt
      const queueResponse = await this.queuePrompt(workflow);
      const promptId = queueResponse.prompt_id;

      // Poll for completion
      return await this.waitForCompletion(promptId);
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        id: uuidv4(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Wait for generation to complete
   */
  private async waitForCompletion(
    promptId: string,
    maxWaitTime: number = 300000, // 5 minutes
    pollInterval: number = 2000    // 2 seconds
  ): Promise<GenerationResult> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const history = await this.getHistory(promptId);
        
        if (history[promptId]) {
          const result = history[promptId];
          
          if (result.status?.completed) {
            // Extract output files
            const outputs = result.outputs;
            const videoUrl = this.extractVideoUrl(outputs);
            const images = this.extractImageUrls(outputs);
            
            return {
              id: promptId,
              status: 'completed',
              videoUrl,
              images,
            };
          }
          
          if (result.status?.status_str === 'error') {
            return {
              id: promptId,
              status: 'failed',
              error: result.status.messages?.join(', ') || 'Generation failed',
            };
          }
        }

        // Check queue status for progress
        const queueStatus = await this.getQueueStatus();
        const queuePosition = this.findQueuePosition(promptId, queueStatus);
        
        if (queuePosition >= 0) {
          return {
            id: promptId,
            status: 'processing',
            progress: Math.max(0, Math.min(100, (maxWaitTime - (Date.now() - startTime)) / maxWaitTime * 100)),
          };
        }

      } catch (error) {
        console.warn('Error checking status:', error);
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    return {
      id: promptId,
      status: 'failed',
      error: 'Generation timed out',
    };
  }

  /**
   * Extract video URL from ComfyUI outputs
   */
  private extractVideoUrl(outputs: any): string | undefined {
    for (const nodeId in outputs) {
      const nodeOutput = outputs[nodeId];
      if (nodeOutput.gifs && nodeOutput.gifs.length > 0) {
        return `${this.config.apiUrl}/view?filename=${nodeOutput.gifs[0].filename}&subfolder=${nodeOutput.gifs[0].subfolder}&type=${nodeOutput.gifs[0].type}`;
      }
      if (nodeOutput.videos && nodeOutput.videos.length > 0) {
        return `${this.config.apiUrl}/view?filename=${nodeOutput.videos[0].filename}&subfolder=${nodeOutput.videos[0].subfolder}&type=${nodeOutput.videos[0].type}`;
      }
    }
    return undefined;
  }

  /**
   * Extract image URLs from ComfyUI outputs
   */
  private extractImageUrls(outputs: any): string[] {
    const imageUrls: string[] = [];
    
    for (const nodeId in outputs) {
      const nodeOutput = outputs[nodeId];
      if (nodeOutput.images) {
        for (const image of nodeOutput.images) {
          imageUrls.push(`${this.config.apiUrl}/view?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`);
        }
      }
    }
    
    return imageUrls;
  }

  /**
   * Find position in queue
   */
  private findQueuePosition(promptId: string, queueStatus: any): number {
    if (!queueStatus.queue_running || !queueStatus.queue_pending) {
      return -1;
    }

    // Check if currently running
    for (let i = 0; i < queueStatus.queue_running.length; i++) {
      if (queueStatus.queue_running[i][1] === promptId) {
        return 0; // Currently processing
      }
    }

    // Check position in pending queue
    for (let i = 0; i < queueStatus.queue_pending.length; i++) {
      if (queueStatus.queue_pending[i][1] === promptId) {
        return i + 1;
      }
    }

    return -1; // Not found in queue
  }
}

/**
 * Create ComfyUI client from environment variables
 */
export function createComfyUIClient(): ComfyUIClient {
  const config: ComfyUIConfig = {
    apiUrl: process.env.COMFYUI_API_URL || 'http://localhost:8188',
    clientId: process.env.COMFYUI_CLIENT_ID || 'seedream-client',
    modelPath: process.env.SEEDREAM_MODEL_PATH || 'seedream-v1.safetensors',
    width: parseInt(process.env.SEEDREAM_WIDTH || '1024'),
    height: parseInt(process.env.SEEDREAM_HEIGHT || '576'),
    duration: parseInt(process.env.SEEDREAM_DURATION || '15'),
  };

  return new ComfyUIClient(config);
}

/**
 * Mock ComfyUI client for development
 */
export class MockComfyUIClient extends ComfyUIClient {
  constructor() {
    super({
      apiUrl: 'http://localhost:8188',
      clientId: 'mock-client',
    });
  }

  async generateVideo(params: SeedreamWorkflowParams): Promise<GenerationResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      id: `mock-${Date.now()}`,
      status: 'completed',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      images: [],
    };
  }
}