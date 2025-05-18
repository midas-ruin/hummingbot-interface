import React, { useState, useEffect } from 'react';
import { detectAccessibilityPreferences } from '../utils/accessibility';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

const AccessibilityMenu: React.FC = () => {
  // Initialize with user's system preferences
  const { prefersReducedMotion, prefersHighContrast } = detectAccessibilityPreferences();
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: prefersHighContrast,
    largeText: false,
    reducedMotion: prefersReducedMotion,
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Apply settings to document when they change
  useEffect(() => {
    const documentEl = document.documentElement;
    
    // Set data attributes on root element
    documentEl.setAttribute('data-high-contrast', String(settings.highContrast));
    documentEl.setAttribute('data-large-text', String(settings.largeText));
    documentEl.setAttribute('data-reduced-motion', String(settings.reducedMotion));
    
    // Apply CSS classes
    if (settings.highContrast) {
      documentEl.classList.add('high-contrast');
    } else {
      documentEl.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      documentEl.classList.add('large-text');
    } else {
      documentEl.classList.remove('large-text');
    }
    
    // Save settings to localStorage
    localStorage.setItem('a11y-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('a11y-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as AccessibilitySettings;
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);
  
  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Accessibility options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="accessibility-menu"
        >
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Accessibility Settings</h3>
          </div>
          
          <div className="p-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="high-contrast" className="flex-grow text-sm text-gray-700">
                  High Contrast
                </label>
                <button
                  id="high-contrast"
                  onClick={() => toggleSetting('highContrast')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.highContrast}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="large-text" className="flex-grow text-sm text-gray-700">
                  Larger Text
                </label>
                <button
                  id="large-text"
                  onClick={() => toggleSetting('largeText')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.largeText ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.largeText}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.largeText ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="reduced-motion" className="flex-grow text-sm text-gray-700">
                  Reduced Motion
                </label>
                <button
                  id="reduced-motion"
                  onClick={() => toggleSetting('reducedMotion')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.reducedMotion}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
