import React from 'react';
import { X, Palette, Type, Sparkles } from "lucide-react";
import { themes } from "../data/themes";
import { fonts } from "../data/fonts";

const ThemeCustomizer = ({ 
  theme, 
  isAnimated, 
  onThemeChange, 
  onAnimationChange, 
  onClose 
}) => {
  const handlePresetTheme = (presetTheme) => {
    onThemeChange(presetTheme);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <span className="font-semibold">Theme Customizer</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Animation Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-base font-semibold">Animated Portfolio</div>
              <div className="text-sm text-gray-600">Enable smooth animations and effects</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAnimated}
              onChange={(e) => onAnimationChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Preset Themes */}
        <div>
          <div className="text-base font-semibold mb-3">Preset Themes</div>
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {themes.map((presetTheme) => (
              <button
                key={presetTheme.name}
                onClick={() => handlePresetTheme(presetTheme)}
                className="p-3 rounded-lg border-2 hover:border-gray-400 transition-all group text-left"
                style={{
                  backgroundColor: presetTheme.backgroundColor,
                  borderColor: presetTheme.accentColor + '30'
                }}
              >
                <div 
                  className="w-full h-8 rounded mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${presetTheme.accentColor}, ${presetTheme.accentColor}80)`
                  }}
                />
                <p 
                  className="text-xs font-medium group-hover:scale-105 transition-transform"
                  style={{ color: presetTheme.textColor }}
                >
                  {presetTheme.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="text-base font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" />
            Font Family
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => onThemeChange({ fontFamily: e.target.value })}
            className="w-full mt-2 p-2 border rounded-md"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Colors */}
        <div className="space-y-4">
          <div className="text-base font-semibold">Custom Colors</div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => onThemeChange({ backgroundColor: e.target.value })}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{theme.backgroundColor}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => onThemeChange({ textColor: e.target.value })}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{theme.textColor}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => onThemeChange({ accentColor: e.target.value })}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">{theme.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="text-base font-semibold mb-3">Live Preview</div>
          <div 
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${isAnimated ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily,
              borderColor: theme.accentColor + '50'
            }}
          >
            <h3 className={`text-xl font-bold mb-2 ${isAnimated ? 'animate-bounce' : ''}`} style={{ color: theme.accentColor }}>
              Sample Heading
            </h3>
            <p className="mb-3">
              This is how your portfolio text will look with the selected theme settings and animations.
            </p>
            <button
              className={`px-4 py-2 rounded font-medium text-white transition-all ${isAnimated ? 'hover:scale-105' : ''}`}
              style={{ backgroundColor: theme.accentColor }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
