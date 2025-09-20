/**
 * Seedream API Client
 * Handles communication with Seedream video generation service
 */

export interface SeedreamConfig {
  apiUrl: string;
  apiKey: string;
  model?: string;
  duration?: number;
  quality?: string;
}

export interface GenerationRequest {
  prompt: string;
  duration?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  model?: string;
  loop?: boolean;
  style?: string;
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
  error?: string;
  metadata?: {
    duration: number;
    resolution: string;
    fileSize: number;
  };
}

export class SeedreamClient {
  private config: SeedreamConfig;

  constructor(config: SeedreamConfig) {
    this.config = config;
  }

  /**
   * Generate a video from a prompt
   */
  async generateVideo(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          ...request,
          duration: request.duration || this.config.duration || 15,
          quality: request.quality || this.config.quality || 'high',
          model: request.model || this.config.model || 'dream-loop-v1',
          loop: true, // Always enable loop for our use case
        }),
      });

      if (!response.ok) {
        throw new Error(`Seedream API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Seedream generation error:', error);
      throw error;
    }
  }

  /**
   * Check the status of a video generation job
   */
  async getGenerationStatus(jobId: string): Promise<GenerationResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Seedream API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Seedream status check error:', error);
      throw error;
    }
  }

  /**
   * Poll for video completion with timeout
   */
  async waitForCompletion(
    jobId: string, 
    maxWaitTime: number = 180000, // 3 minutes
    pollInterval: number = 5000    // 5 seconds
  ): Promise<GenerationResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getGenerationStatus(jobId);

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(status.error || 'Video generation failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Video generation timed out');
  }

  /**
   * Generate video and wait for completion in one call
   */
  async generateAndWait(request: GenerationRequest): Promise<GenerationResponse> {
    const initialResponse = await this.generateVideo(request);

    if (initialResponse.status === 'completed') {
      return initialResponse;
    }

    return await this.waitForCompletion(initialResponse.id);
  }
}

/**
 * Create a Seedream client instance from environment variables
 */
export function createSeedreamClient(): SeedreamClient {
  const config: SeedreamConfig = {
    apiUrl: process.env.SEEDREAM_API_URL || 'https://api.seedream.com/v1',
    apiKey: process.env.SEEDREAM_API_KEY || '',
    model: process.env.SEEDREAM_MODEL || 'dream-loop-v1',
    duration: parseInt(process.env.SEEDREAM_DURATION || '15'),
    quality: process.env.SEEDREAM_QUALITY || 'high',
  };

  if (!config.apiKey) {
    throw new Error('SEEDREAM_API_KEY environment variable is required');
  }

  return new SeedreamClient(config);
}

/**
 * Mock Seedream client for development/testing
 * Returns sample video URLs and simulates API delays
 */
export class MockSeedreamClient {
  async generateAndWait(request: GenerationRequest): Promise<GenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Return mock response with sample video
    return {
      id: `mock-${Date.now()}`,
      status: 'completed',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video for testing
      metadata: {
        duration: 15,
        resolution: '1920x1080',
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    };
  }

  async generateVideo(request: GenerationRequest): Promise<GenerationResponse> {
    return {
      id: `mock-${Date.now()}`,
      status: 'processing',
      progress: 0,
    };
  }

  async getGenerationStatus(jobId: string): Promise<GenerationResponse> {
    return {
      id: jobId,
      status: 'completed',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    };
  }
}