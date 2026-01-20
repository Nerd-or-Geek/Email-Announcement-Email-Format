import React from 'react';
import { HeaderConfig, FooterConfig } from '../types';

interface HeaderFooterEditorProps {
  header: HeaderConfig;
  footer: FooterConfig;
  onHeaderChange: (header: HeaderConfig) => void;
  onFooterChange: (footer: FooterConfig) => void;
}

export const HeaderFooterEditor: React.FC<HeaderFooterEditorProps> = ({
  header,
  footer,
  onHeaderChange,
  onFooterChange,
}) => {
  return (
    <>
      <div className="sidebar-section">
        <h3>📰 Header</h3>
        
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={header.title}
            onChange={(e) => onHeaderChange({ ...header, title: e.target.value })}
            placeholder="Squadron Announcements"
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={header.subtitle}
            onChange={(e) => onHeaderChange({ ...header, subtitle: e.target.value })}
            placeholder="Civil Air Patrol - Heartland Composite Squadron"
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={header.showGradient}
              onChange={(e) => onHeaderChange({ ...header, showGradient: e.target.checked })}
            />
            Show gradient background
          </label>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>📝 Footer</h3>
        
        <div className="form-group">
          <label>Footer Text</label>
          <textarea
            value={footer.content}
            onChange={(e) => onFooterChange({ ...footer, content: e.target.value })}
            placeholder="Remember to reply all..."
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={footer.showGradientBorder}
              onChange={(e) => onFooterChange({ ...footer, showGradientBorder: e.target.checked })}
            />
            Show gradient border
          </label>
        </div>
      </div>
    </>
  );
};
