/**
 * Centralized block registry system
 * Provides side-effect free initialization for all blocks
 */

import { initializeAiHealthHeroBlock } from '../src/blocks/ai-health-hero/index.js';
import { initializeGeneticTestingBlock } from '../src/blocks/genetic-testing/index.js';
import { initializeImageGridBlock } from '../src/blocks/image-grid/index.js';
import { initializeHeroBannerBlock } from '../src/blocks/hero-banner/index.js';
import { initializeHeroBlock } from '../src/blocks/hero/index.js';
import { initializeLeftRightContentBlock } from '../src/blocks/left-right-content/index.js';
import { initializeNewsletterSignupBlock } from '../src/blocks/newsletter-signup/index.js';
import { initializeFaqWithImageBlock } from '../src/blocks/faq-with-image/index.js';
import { initializeAdditionalLinksBlock } from '../src/blocks/additional-links/index.js';

/**
 * Initialize all blocks in a controlled manner
 * This avoids top-level side effects and provides better control
 */
export function initializeAllBlocks() {
	// Initialize each block using their respective functions
	initializeAiHealthHeroBlock();
	initializeGeneticTestingBlock();
	initializeImageGridBlock();
	initializeHeroBannerBlock();
	initializeHeroBlock();
	initializeLeftRightContentBlock();
	initializeNewsletterSignupBlock();
	initializeFaqWithImageBlock();
	initializeAdditionalLinksBlock();
}

/**
 * Initialize individual blocks as needed
 * Export each initialization function for selective loading
 */
export {
	initializeAiHealthHeroBlock,
	initializeGeneticTestingBlock,
	initializeImageGridBlock,
	initializeHeroBannerBlock,
	initializeHeroBlock,
	initializeLeftRightContentBlock,
	initializeNewsletterSignupBlock,
	initializeFaqWithImageBlock,
	initializeAdditionalLinksBlock,
};
