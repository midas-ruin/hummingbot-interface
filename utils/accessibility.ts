/**
 * Utility functions for improving application accessibility
 */

/**
 * Sets focus on a specified element with safety checks
 * @param selector - CSS selector for the element to focus
 * @param fallbackSelector - Optional fallback if primary selector not found
 */
export function focusElement(selector: string, fallbackSelector?: string): void {
  try {
    // Try to focus the specified element
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      return;
    }
    
    // If not found and fallback provided, try the fallback
    if (fallbackSelector) {
      const fallbackElement = document.querySelector(fallbackSelector) as HTMLElement;
      if (fallbackElement) {
        fallbackElement.focus();
        return;
      }
    }
    
    // If all else fails, focus the body to reset focus
    document.body.focus();
  } catch (error) {
    console.error('Error setting focus:', error);
  }
}

/**
 * Handles keyboard accessibility for navigation between elements
 * @param event - Keyboard event
 * @param navigationMap - Map of key codes to element selectors
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  navigationMap: Record<string, string>
): void {
  // Check if Alt key is pressed with another key
  if (event.altKey && navigationMap[event.key]) {
    event.preventDefault();
    focusElement(navigationMap[event.key]);
  }
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param message - Message to announce
 * @param ariaLive - ARIA live setting (polite or assertive)
 */
export function announceToScreenReader(message: string, ariaLive: 'polite' | 'assertive' = 'polite'): void {
  // Try to find existing announcer
  let announcer = document.getElementById('accessibility-announcer');
  
  // Create announcer if it doesn't exist
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'accessibility-announcer';
    announcer.setAttribute('aria-live', ariaLive);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  } else {
    // Update aria-live if specified
    announcer.setAttribute('aria-live', ariaLive);
  }
  
  // Set the message to be announced
  announcer.textContent = message;
  
  // Clear after a delay to allow for re-announcing the same message if needed
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Detects and sets user's preferred motion and contrast settings
 * @returns Object with user's accessibility preferences
 */
export function detectAccessibilityPreferences(): {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
} {
  let prefersReducedMotion = false;
  let prefersHighContrast = false;
  
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
  }
  
  return {
    prefersReducedMotion,
    prefersHighContrast
  };
}
