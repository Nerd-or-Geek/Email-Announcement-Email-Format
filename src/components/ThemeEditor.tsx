import React from 'react';
import { Theme, ThemeTemplate, themeTemplates } from '../types';

interface ThemeEditorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange }) => {
  const handleChange = (key: keyof Theme, value: string) => {
    onChange({ ...theme, [key]: value });
  };

  const applyTemplate = (template: ThemeTemplate) => {
    onChange({ ...template.theme });
  };

  return (
    <div className="sidebar-section">
      <h3>🎨 Theme & Colors</h3>
      
      <div className="template-grid mb-3">
        {themeTemplates.map(template => (
          <div 
            key={template.id}
            className={`template-card ${theme.primaryColor === template.theme.primaryColor ? 'active' : ''}`}
            onClick={() => applyTemplate(template)}
          >
            <div style={{ 
              display: 'flex', 
              gap: '3px', 
              marginBottom: '8px',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px', 
                background: template.theme.primaryColor 
              }} />
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px', 
                background: template.theme.secondaryColor 
              }} />
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '4px', 
                background: template.theme.accentColor 
              }} />
            </div>
            <h4>{template.name}</h4>
            <p>{template.description}</p>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Primary Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Secondary Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Accent Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Background Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Text Color</label>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={theme.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Border Radius</label>
        <select 
          value={theme.borderRadius}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
        >
          <option value="0px">None (0px)</option>
          <option value="4px">Small (4px)</option>
          <option value="8px">Medium (8px)</option>
          <option value="12px">Large (12px)</option>
          <option value="16px">Extra Large (16px)</option>
        </select>
      </div>
    </div>
  );
};
