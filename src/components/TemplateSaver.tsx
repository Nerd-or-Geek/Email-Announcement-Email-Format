import React, { useState, useEffect } from 'react';
import { EmailConfig } from '../types';

interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  config: EmailConfig;
  createdAt: string;
}

interface TemplateSaverProps {
  currentConfig: EmailConfig;
  onLoadTemplate: (config: EmailConfig) => void;
}

const STORAGE_KEY = 'emailTemplates';

function getTemplates(): SavedTemplate[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

function saveTemplates(templates: SavedTemplate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export const TemplateSaver: React.FC<TemplateSaverProps> = ({ currentConfig, onLoadTemplate }) => {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleSave = () => {
    if (!templateName.trim()) {
      setSaveStatus('Please enter a name');
      return;
    }

    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      description: templateDescription.trim(),
      config: JSON.parse(JSON.stringify(currentConfig)), // Deep copy
      createdAt: new Date().toLocaleDateString(),
    };

    const updatedTemplates = [...templates, newTemplate];
    saveTemplates(updatedTemplates);
    setTemplates(updatedTemplates);
    
    setTemplateName('');
    setTemplateDescription('');
    setShowSaveModal(false);
    setSaveStatus('');
  };

  const handleLoad = (template: SavedTemplate) => {
    if (window.confirm(`Load "${template.name}"? This will replace your current work.`)) {
      onLoadTemplate(JSON.parse(JSON.stringify(template.config)));
      setShowLoadModal(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      saveTemplates(updatedTemplates);
      setTemplates(updatedTemplates);
    }
  };

  const handleExportTemplates = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-templates.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as SavedTemplate[];
        if (Array.isArray(imported)) {
          const merged = [...templates];
          imported.forEach(imp => {
            // Add with new ID to avoid conflicts
            merged.push({ ...imp, id: Date.now().toString() + Math.random() });
          });
          saveTemplates(merged);
          setTemplates(merged);
          alert(`Imported ${imported.length} template(s)`);
        }
      } catch {
        alert('Invalid template file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="sidebar-section">
      <h3>💾 Templates</h3>
      <p className="text-muted" style={{ fontSize: '0.85em', marginBottom: '12px' }}>
        Save and reuse your email layouts
      </p>

      <div className="btn-group" style={{ flexDirection: 'column' }}>
        <button className="btn btn-primary btn-full" onClick={() => setShowSaveModal(true)}>
          💾 Save as Template
        </button>
        <button 
          className="btn btn-secondary btn-full" 
          onClick={() => setShowLoadModal(true)}
          disabled={templates.length === 0}
        >
          📂 Load Template ({templates.length})
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Save as Template</h3>
              <button className="modal-close" onClick={() => setShowSaveModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Template Name *</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Weekly Announcement"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Brief description of this template..."
                />
              </div>
              {saveStatus && <p style={{ color: '#d32f2f', fontSize: '0.85em' }}>{saveStatus}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Template</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Load Template</h3>
              <button className="modal-close" onClick={() => setShowLoadModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {templates.length === 0 ? (
                <p className="text-muted text-center">No saved templates yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {templates.map((template) => (
                    <div 
                      key={template.id} 
                      style={{ 
                        background: '#f9f9f9', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', color: '#001489' }}>{template.name}</h4>
                          {template.description && (
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.85em', color: '#666' }}>
                              {template.description}
                            </p>
                          )}
                          <p style={{ margin: 0, fontSize: '0.75em', color: '#999' }}>
                            Saved: {template.createdAt} • {template.config.sections.length} section(s)
                          </p>
                        </div>
                        <div className="btn-group">
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleLoad(template)}
                          >
                            Load
                          </button>
                          <button 
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(template.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '10px' }}>
                  <strong>Import/Export Templates</strong>
                </p>
                <div className="btn-group">
                  <button className="btn btn-outline btn-small" onClick={handleExportTemplates}>
                    ⬇️ Export All
                  </button>
                  <label className="btn btn-outline btn-small" style={{ cursor: 'pointer' }}>
                    ⬆️ Import
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={handleImportTemplates}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
