import React, { useState, useEffect, useMemo } from 'react';
import { EmailConfig, createDefaultEmailConfig } from './types';
import { ThemeEditor } from './components/ThemeEditor';
import { HeaderFooterEditor } from './components/HeaderFooterEditor';
import { SectionEditor } from './components/SectionEditor';
import { TemplateSaver } from './components/TemplateSaver';
import { 
  generateInlineHtml, 
  copyToClipboard, 
  downloadHtml, 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from './htmlGenerator';

const App: React.FC = () => {
  const [config, setConfig] = useState<EmailConfig>(() => {
    const saved = loadFromLocalStorage();
    return saved || createDefaultEmailConfig();
  });
  
  const [activeTab, setActiveTab] = useState<'theme' | 'header' | 'sections'>('header');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>('');

  // Auto-save to localStorage
  useEffect(() => {
    saveToLocalStorage(config);
  }, [config]);

  // Generate HTML preview
  const previewHtml = useMemo(() => generateInlineHtml(config), [config]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(previewHtml);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Failed to copy');
    }
  };

  const handleDownload = () => {
    downloadHtml(previewHtml, 'announcement.html');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All changes will be lost.')) {
      setConfig(createDefaultEmailConfig());
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>📧 Email Builder</h1>
          <p>Create beautiful inline CSS emails</p>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'header' ? 'active' : ''}`}
            onClick={() => setActiveTab('header')}
          >
            📰 Header
          </button>
          <button 
            className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            🎨 Theme
          </button>
          <button 
            className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
            onClick={() => setActiveTab('sections')}
          >
            📂 Sections
          </button>
        </div>

        <div className="sidebar-content">
          {activeTab === 'header' && (
            <HeaderFooterEditor
              header={config.header}
              footer={config.footer}
              onHeaderChange={(header) => setConfig({ ...config, header })}
              onFooterChange={(footer) => setConfig({ ...config, footer })}
            />
          )}
          
          {activeTab === 'theme' && (
            <ThemeEditor
              theme={config.theme}
              onChange={(theme) => setConfig({ ...config, theme })}
            />
          )}
          
          {activeTab === 'sections' && (
            <SectionEditor
              sections={config.sections}
              onChange={(sections) => setConfig({ ...config, sections })}
            />
          )}

          <TemplateSaver
            currentConfig={config}
            onLoadTemplate={(loadedConfig) => setConfig(loadedConfig)}
          />

          <div className="sidebar-section" style={{ marginTop: '20px' }}>
            <h3>⚙️ Actions</h3>
            <div className="btn-group" style={{ flexDirection: 'column' }}>
              <button className="btn btn-primary btn-full" onClick={() => setShowCodeModal(true)}>
                📋 View & Copy HTML
              </button>
              <button className="btn btn-secondary btn-full" onClick={handleDownload}>
                💾 Download HTML
              </button>
              <button className="btn btn-outline btn-full" onClick={handleReset}>
                🔄 Reset All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="preview-panel">
        <div className="preview-controls">
          <h2>📱 Live Preview</h2>
          <div className="btn-group">
            <button className="btn btn-primary btn-small" onClick={handleCopy}>
              {copyStatus || '📋 Copy HTML'}
            </button>
            <button className="btn btn-secondary btn-small" onClick={handleDownload}>
              💾 Download
            </button>
          </div>
        </div>

        <div className="preview-frame">
          <iframe
            title="Email Preview"
            srcDoc={previewHtml}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              minHeight: '600px'
            }}
          />
        </div>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>HTML Code</h3>
              <button className="modal-close" onClick={() => setShowCodeModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '15px' }}>
                <button className="btn btn-primary" onClick={handleCopy}>
                  {copyStatus || '📋 Copy to Clipboard'}
                </button>
              </div>
              <pre className="code-output">{previewHtml}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
