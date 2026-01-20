import React, { useState } from 'react';
import { Section, Widget, WidgetType, createWidget, createSection } from '../types';
import { WidgetEditor } from './WidgetEditor';

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ sections, onChange }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showWidgetModal, setShowWidgetModal] = useState<string | null>(null);
  const [editingWidget, setEditingWidget] = useState<{ sectionId: string; widget: Widget } | null>(null);

  const addSection = () => {
    const newSection = createSection();
    onChange([...sections, newSection]);
    setExpandedSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    onChange(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    onChange(sections.filter(s => s.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      onChange(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      onChange(newSections);
    }
  };

  const addWidget = (sectionId: string, type: WidgetType) => {
    const widget = createWidget(type);
    onChange(sections.map(s => 
      s.id === sectionId 
        ? { ...s, widgets: [...s.widgets, widget] }
        : s
    ));
    setShowWidgetModal(null);
    setEditingWidget({ sectionId, widget });
  };

  const updateWidget = (sectionId: string, widgetId: string, updates: Partial<Widget>) => {
    onChange(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            widgets: s.widgets.map(w => 
              w.id === widgetId ? { ...w, ...updates } as Widget : w
            ) 
          }
        : s
    ));
  };

  const deleteWidget = (sectionId: string, widgetId: string) => {
    onChange(sections.map(s => 
      s.id === sectionId 
        ? { ...s, widgets: s.widgets.filter(w => w.id !== widgetId) }
        : s
    ));
  };

  const moveWidget = (sectionId: string, widgetId: string, direction: 'up' | 'down') => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const index = section.widgets.findIndex(w => w.id === widgetId);
    if (direction === 'up' && index > 0) {
      const newWidgets = [...section.widgets];
      [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
      updateSection(sectionId, { widgets: newWidgets });
    } else if (direction === 'down' && index < section.widgets.length - 1) {
      const newWidgets = [...section.widgets];
      [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
      updateSection(sectionId, { widgets: newWidgets });
    }
  };

  const widgetTypes: { type: WidgetType; icon: string; label: string }[] = [
    { type: 'meeting', icon: '📅', label: 'Meeting' },
    { type: 'text', icon: '📝', label: 'Text' },
    { type: 'heading', icon: '🔤', label: 'Heading' },
    { type: 'button', icon: '🔘', label: 'Button' },
    { type: 'buttonGroup', icon: '🔳', label: 'Buttons' },
    { type: 'list', icon: '📋', label: 'List' },
    { type: 'notice', icon: '⚠️', label: 'Notice' },
    { type: 'divider', icon: '➖', label: 'Divider' },
    { type: 'video', icon: '🎬', label: 'Video' },
    { type: 'map', icon: '🗺️', label: 'Map' },
    { type: 'image', icon: '🖼️', label: 'Image' },
  ];

  const getWidgetLabel = (type: WidgetType): string => {
    return widgetTypes.find(w => w.type === type)?.label || type;
  };

  const getWidgetIcon = (type: WidgetType): string => {
    return widgetTypes.find(w => w.type === type)?.icon || '📦';
  };

  return (
    <div className="sidebar-section">
      <h3>📂 Sections</h3>
      
      {sections.map((section, index) => (
        <div key={section.id} className="section-item">
          <div 
            className="section-item-header"
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
          >
            <h4>{section.title || 'Untitled Section'}</h4>
            <div className="btn-group">
              <button 
                className="btn btn-small btn-outline"
                onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
                disabled={index === 0}
              >
                ↑
              </button>
              <button 
                className="btn btn-small btn-outline"
                onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
                disabled={index === sections.length - 1}
              >
                ↓
              </button>
              <button 
                className="btn btn-small btn-danger"
                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
              >
                ×
              </button>
            </div>
          </div>
          
          {expandedSection === section.id && (
            <div className="section-item-content">
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  placeholder="Section Title"
                />
              </div>
              
              <div className="form-group">
                <label>Border Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={section.borderColor || '#FFCD00'}
                    onChange={(e) => updateSection(section.id, { borderColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={section.borderColor || '#FFCD00'}
                    onChange={(e) => updateSection(section.id, { borderColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-2 mb-2">
                <strong style={{ fontSize: '0.85em', color: '#555' }}>Widgets:</strong>
              </div>
              
              {section.widgets.map((widget, wIndex) => (
                <div key={widget.id} className="widget-item">
                  <div className="widget-item-header">
                    <span className="widget-item-title">
                      {getWidgetIcon(widget.type)} {getWidgetLabel(widget.type)}
                    </span>
                    <div className="widget-item-actions">
                      <button 
                        className="btn btn-small"
                        onClick={() => moveWidget(section.id, widget.id, 'up')}
                        disabled={wIndex === 0}
                        style={{ background: '#f0f0f0' }}
                      >
                        ↑
                      </button>
                      <button 
                        className="btn btn-small"
                        onClick={() => moveWidget(section.id, widget.id, 'down')}
                        disabled={wIndex === section.widgets.length - 1}
                        style={{ background: '#f0f0f0' }}
                      >
                        ↓
                      </button>
                      <button 
                        className="widget-edit"
                        onClick={() => setEditingWidget({ sectionId: section.id, widget })}
                      >
                        Edit
                      </button>
                      <button 
                        className="widget-delete"
                        onClick={() => deleteWidget(section.id, widget.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                className="btn btn-secondary btn-small btn-full mt-2"
                onClick={() => setShowWidgetModal(section.id)}
              >
                + Add Widget
              </button>
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-primary btn-full mt-2" onClick={addSection}>
        + Add Section
      </button>

      {/* Widget Type Selection Modal */}
      {showWidgetModal && (
        <div className="modal-overlay" onClick={() => setShowWidgetModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Widget</h3>
              <button className="modal-close" onClick={() => setShowWidgetModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="widget-type-grid">
                {widgetTypes.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    className="widget-type-btn"
                    onClick={() => addWidget(showWidgetModal, type)}
                  >
                    <span className="icon">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget Editor Modal */}
      {editingWidget && (
        <WidgetEditor
          widget={editingWidget.widget}
          onSave={(updates) => {
            updateWidget(editingWidget.sectionId, editingWidget.widget.id, updates);
            setEditingWidget(null);
          }}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </div>
  );
};