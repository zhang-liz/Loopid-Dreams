/**
 * Dream Loop Prompt Engineering for Seedream
 * Generates optimized prompts for seamless looping videos
 */

export interface DreamElements {
  element1: string;
  element2: string;
  element3: string;
}

/**
 * Generates a Seedream-optimized prompt for seamless loop creation
 */
export function generateLoopPrompt(elements: DreamElements): string {
  const { element1, element2, element3 } = elements;

  // Core loop structure with dream logic
  const basePrompt = `Seamless infinite loop: ${element1} morphing into ${element2}, transitioning to ${element3}, flowing back to ${element1}.`;
  
  // Dream-like transition descriptors
  const transitionStyle = "Dream-like melting transitions, surreal physics, fluid morphing, ethereal atmosphere.";
  
  // Technical specifications for optimal looping
  const technicalSpecs = "Continuous motion, hypnotic rhythm, perfect loop, no cuts, smooth fade transitions.";
  
  // Visual style enhancers
  const visualStyle = "Cinematic quality, vibrant colors, soft focus, mystical lighting, floating elements.";
  
  // Duration and format specifications
  const formatSpecs = "10-15 seconds duration, high resolution, optimized for seamless playback.";

  // Combine all elements
  const fullPrompt = [
    basePrompt,
    transitionStyle,
    technicalSpecs,
    visualStyle,
    formatSpecs
  ].join(' ');

  return fullPrompt;
}

/**
 * Generates enhanced prompt with artistic style modifiers
 */
export function generateEnhancedPrompt(elements: DreamElements): string {
  const basePrompt = generateLoopPrompt(elements);
  
  // Add artistic style modifiers
  const artisticModifiers = [
    "Salvador Dali inspired",
    "psychedelic art style",
    "flowing liquid textures",
    "particle effects",
    "gradient backgrounds",
    "neon accents"
  ];

  const randomModifier = artisticModifiers[Math.floor(Math.random() * artisticModifiers.length)];
  
  return `${basePrompt} ${randomModifier}, masterpiece quality, award-winning cinematography.`;
}

/**
 * Creates transition-specific prompts for each morphing stage
 */
export function generateTransitionPrompts(elements: DreamElements): string[] {
  const { element1, element2, element3 } = elements;
  
  return [
    `${element1} slowly dissolving and transforming into ${element2}, dream-like morphing, fluid transition`,
    `${element2} melting and reshaping into ${element3}, surreal transformation, ethereal flow`,
    `${element3} fading and morphing back into ${element1}, completing the infinite loop, seamless transition`
  ];
}

/**
 * Validates and optimizes dream elements for better prompt generation
 */
export function optimizeDreamElements(elements: DreamElements): DreamElements {
  const optimize = (element: string): string => {
    // Remove articles and common words that don't add visual value
    const cleaned = element.toLowerCase().trim()
      .replace(/^(a|an|the)\s+/, '')
      .replace(/\s+(and|or|but)\s+/, ' ');
    
    // Ensure single concept (take first word if multiple)
    const firstConcept = cleaned.split(/\s+/)[0];
    
    return firstConcept;
  };

  return {
    element1: optimize(elements.element1),
    element2: optimize(elements.element2),
    element3: optimize(elements.element3)
  };
}

/**
 * Generates alternative prompt variations for A/B testing
 */
export function generatePromptVariations(elements: DreamElements): string[] {
  const optimized = optimizeDreamElements(elements);
  
  const variations = [
    generateLoopPrompt(optimized),
    generateEnhancedPrompt(optimized),
    `Infinite dream sequence: ${optimized.element1} ↻ ${optimized.element2} ↻ ${optimized.element3} ↻ repeat. Hypnotic transitions, mystical atmosphere, perfect loop, 15 seconds.`,
    `Seamless transformation cycle: ${optimized.element1} becomes ${optimized.element2} becomes ${optimized.element3} becomes ${optimized.element1}. Fluid morphing, dream logic, ethereal beauty, looping video.`
  ];

  return variations;
}