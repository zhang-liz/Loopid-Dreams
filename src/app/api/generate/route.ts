import { NextRequest, NextResponse } from 'next/server';
import { generateLoopPrompt, optimizeDreamElements, type DreamElements } from '@/lib/promptEngine';
import { createComfyUIClient, MockComfyUIClient, type SeedreamWorkflowParams } from '@/lib/comfyUIApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { elements } = body;

    // Validate input
    if (!elements || !Array.isArray(elements) || elements.length !== 3) {
      return NextResponse.json(
        { error: 'Please provide exactly 3 dream elements' },
        { status: 400 }
      );
    }

    // Validate each element
    for (const element of elements) {
      if (!element || typeof element !== 'string' || element.trim().length === 0) {
        return NextResponse.json(
          { error: 'All dream elements must be non-empty strings' },
          { status: 400 }
        );
      }
    }

    // Convert array to DreamElements interface
    const dreamElements: DreamElements = {
      element1: elements[0],
      element2: elements[1],
      element3: elements[2]
    };

    // Optimize and generate prompt
    const optimizedElements = optimizeDreamElements(dreamElements);
    const prompt = generateLoopPrompt(optimizedElements);

    console.log('Generated prompt:', prompt);
    console.log('Dream elements:', optimizedElements);

    // Create ComfyUI client - use mock for development if ComfyUI is not available
    let comfyUIClient;
    const comfyUIUrl = process.env.COMFYUI_API_URL || 'http://localhost:8188';
    
    try {
      // Test if ComfyUI is available
      const testResponse = await fetch(`${comfyUIUrl}/queue`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (testResponse.ok) {
        comfyUIClient = createComfyUIClient();
        console.log('Using real ComfyUI client');
      } else {
        throw new Error('ComfyUI not responding');
      }
    } catch (error) {
      console.warn('ComfyUI not available, using mock client:', error);
      comfyUIClient = new MockComfyUIClient();
    }

    // Prepare workflow parameters
    const workflowParams: SeedreamWorkflowParams = {
      prompt,
      width: parseInt(process.env.SEEDREAM_WIDTH || '1024'),
      height: parseInt(process.env.SEEDREAM_HEIGHT || '576'),
      duration: parseInt(process.env.SEEDREAM_DURATION || '15'),
      steps: 20,
      cfg: 7.5,
      model_path: process.env.SEEDREAM_MODEL_PATH || 'seedream-v1.safetensors'
    };

    // Generate video
    const result = await comfyUIClient.generateVideo(workflowParams);

    if (result.status === 'failed') {
      return NextResponse.json(
        { error: result.error || 'Video generation failed' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      videoUrl: result.videoUrl,
      prompt: prompt,
      elements: optimizedElements,
      images: result.images || [],
      jobId: result.id,
      comfyUIWorkflow: workflowParams
    });

  } catch (error) {
    console.error('Video generation error:', error);
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { error: `Failed to generate dream loop: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}