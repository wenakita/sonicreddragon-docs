/**
 * Anime.js initializer
 * This module helps load anime.js properly in the Docusaurus environment
 */

// We'll use a dynamic import to load anime.js only when needed
let animePromise = null;

export function loadAnime() {
  if (!animePromise) {
    animePromise = import('animejs/lib/anime.es.js')
      .then(module => module.default)
      .catch(error => {
        console.error('Failed to load anime.js:', error);
        return null;
      });
  }
  return animePromise;
}

// Helper function to check if we're in browser environment
export function isBrowser() {
  return typeof window !== 'undefined';
}

// Pre-load anime.js when in browser
if (isBrowser()) {
  // Load after a small delay to not block page rendering
  setTimeout(() => {
    loadAnime();
  }, 1000);
} 