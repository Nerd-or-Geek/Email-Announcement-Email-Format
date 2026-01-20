import React, { useState } from 'react';
import { 
  Widget, 
  TextWidget, 
  HeadingWidget, 
  ButtonWidget, 
  ButtonGroupWidget, 
  ListWidget, 
  NoticeWidget, 
  MeetingWidget, 
  VideoWidget, 
  MapWidget, 
  ImageWidget,
  ButtonStyle,
  ListItem,
  KeyValueItem
} from '../types';
import { v4 as uuidv4 } from 'uuid';

interface WidgetEditorProps {
  widget: Widget;
  onSave: (updates: Partial<Widget>) => void;
  onClose: () => void;
}

export const WidgetEditor: React.FC<WidgetEditorProps> = ({ widget, onSave, onClose }) => {
  const [localWidget, setLocalWidget] = useState<Widget>(widget);

  const handleSave = () => {
    onSave(localWidget);
  };

  const updateLocal = (updates: Partial<Widget>) => {
    setLocalWidget({ ...localWidget, ...updates } as Widget);
  };

  const renderEditor = () => {
    switch (localWidget.type) {
      case 'text':
        return <TextWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'heading':
        return <HeadingWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'button':
        return <ButtonWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'buttonGroup':
        return <ButtonGroupWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'list':
        return <ListWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'notice':
        return <NoticeWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'meeting':
        return <MeetingWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'video':
        return <VideoWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'map':
        return <MapWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'image':
        return <ImageWidgetEditor widget={localWidget} onChange={updateLocal} />;
      case 'divider':
        return <p className="text-muted text-center">Divider has no editable properties</p>;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Widget</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {renderEditor()}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// Text Widget Editor
const TextWidgetEditor: React.FC<{ widget: TextWidget; onChange: (u: Partial<TextWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Content</label>
      <textarea
        value={widget.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Enter text content..."
      />
    </div>
    <div className="form-group">
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={widget.isBold || false}
          onChange={(e) => onChange({ isBold: e.target.checked })}
        />
        Bold
      </label>
    </div>
    <div className="form-group">
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={widget.isItalic || false}
          onChange={(e) => onChange({ isItalic: e.target.checked })}
        />
        Italic
      </label>
    </div>
  </>
);

// Heading Widget Editor
const HeadingWidgetEditor: React.FC<{ widget: HeadingWidget; onChange: (u: Partial<HeadingWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Heading Text</label>
      <input
        type="text"
        value={widget.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Heading text..."
      />
    </div>
    <div className="form-group">
      <label>Level</label>
      <select value={widget.level} onChange={(e) => onChange({ level: e.target.value as 'h3' | 'h4' })}>
        <option value="h3">H3 - Large</option>
        <option value="h4">H4 - Small</option>
      </select>
    </div>
  </>
);

// Button Widget Editor
const ButtonWidgetEditor: React.FC<{ widget: ButtonWidget; onChange: (u: Partial<ButtonWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Button Text</label>
      <input
        type="text"
        value={widget.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Click me"
      />
    </div>
    <div className="form-group">
      <label>URL</label>
      <input
        type="url"
        value={widget.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="https://example.com"
      />
    </div>
    <div className="form-group">
      <label>Style</label>
      <select value={widget.variant} onChange={(e) => onChange({ variant: e.target.value as ButtonWidget['variant'] })}>
        <option value="primary">Primary (Blue)</option>
        <option value="secondary">Secondary (Yellow)</option>
        <option value="accent">Accent (Red)</option>
        <option value="outline">Outline</option>
      </select>
    </div>
  </>
);

// Button Group Widget Editor
const ButtonGroupWidgetEditor: React.FC<{ widget: ButtonGroupWidget; onChange: (u: Partial<ButtonGroupWidget>) => void }> = ({ widget, onChange }) => {
  const addButton = () => {
    const newButton: ButtonStyle = { id: uuidv4(), text: 'New Button', url: '', variant: 'primary' };
    onChange({ buttons: [...widget.buttons, newButton] });
  };

  const updateButton = (id: string, updates: Partial<ButtonStyle>) => {
    onChange({ buttons: widget.buttons.map(b => b.id === id ? { ...b, ...updates } : b) });
  };

  const removeButton = (id: string) => {
    onChange({ buttons: widget.buttons.filter(b => b.id !== id) });
  };

  return (
    <>
      {widget.buttons.map((btn, i) => (
        <div key={btn.id} style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '0.85em' }}>Button {i + 1}</strong>
            <button className="btn btn-small btn-danger" onClick={() => removeButton(btn.id)}>×</button>
          </div>
          <div className="form-group">
            <input
              type="text"
              value={btn.text}
              onChange={(e) => updateButton(btn.id, { text: e.target.value })}
              placeholder="Button text"
            />
          </div>
          <div className="form-group">
            <input
              type="url"
              value={btn.url}
              onChange={(e) => updateButton(btn.id, { url: e.target.value })}
              placeholder="URL"
            />
          </div>
          <div className="form-group">
            <select value={btn.variant} onChange={(e) => updateButton(btn.id, { variant: e.target.value as ButtonStyle['variant'] })}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
              <option value="outline">Outline</option>
            </select>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary btn-small btn-full" onClick={addButton}>+ Add Button</button>
    </>
  );
};

// List Widget Editor
const ListWidgetEditor: React.FC<{ widget: ListWidget; onChange: (u: Partial<ListWidget>) => void }> = ({ widget, onChange }) => {
  const addItem = () => {
    const newItem: ListItem = { id: uuidv4(), text: '' };
    onChange({ items: [...widget.items, newItem] });
  };

  const updateItem = (id: string, text: string) => {
    onChange({ items: widget.items.map(item => item.id === id ? { ...item, text } : item) });
  };

  const removeItem = (id: string) => {
    onChange({ items: widget.items.filter(item => item.id !== id) });
  };

  return (
    <>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={widget.ordered || false}
            onChange={(e) => onChange({ ordered: e.target.checked })}
          />
          Numbered list
        </label>
      </div>
      
      {widget.items.map((item, i) => (
        <div key={item.id} className="form-group" style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '8px', color: '#666' }}>{widget.ordered ? `${i + 1}.` : '•'}</span>
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(item.id, e.target.value)}
            placeholder="List item..."
            style={{ flex: 1 }}
          />
          <button className="btn btn-small btn-danger" onClick={() => removeItem(item.id)}>×</button>
        </div>
      ))}
      
      <button className="btn btn-secondary btn-small btn-full" onClick={addItem}>+ Add Item</button>
    </>
  );
};

// Notice Widget Editor
const NoticeWidgetEditor: React.FC<{ widget: NoticeWidget; onChange: (u: Partial<NoticeWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Notice Text</label>
      <input
        type="text"
        value={widget.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="NO MEETING"
      />
    </div>
    <div className="form-group">
      <label>Style</label>
      <select value={widget.variant} onChange={(e) => onChange({ variant: e.target.value as NoticeWidget['variant'] })}>
        <option value="info">Info (Blue)</option>
        <option value="warning">Warning (Yellow)</option>
        <option value="success">Success (Green)</option>
        <option value="danger">Danger (Red)</option>
      </select>
    </div>
  </>
);

// Meeting Widget Editor
const MeetingWidgetEditor: React.FC<{ widget: MeetingWidget; onChange: (u: Partial<MeetingWidget>) => void }> = ({ widget, onChange }) => {
  const addDetail = () => {
    const newDetail: KeyValueItem = { id: uuidv4(), key: '', value: '' };
    onChange({ details: [...widget.details, newDetail] });
  };

  const updateDetail = (id: string, updates: Partial<KeyValueItem>) => {
    onChange({ details: widget.details.map(d => d.id === id ? { ...d, ...updates } : d) });
  };

  const removeDetail = (id: string) => {
    onChange({ details: widget.details.filter(d => d.id !== id) });
  };

  const addButton = () => {
    const newButton: ButtonStyle = { id: uuidv4(), text: 'New Button', url: '', variant: 'primary' };
    onChange({ buttons: [...widget.buttons, newButton] });
  };

  const updateButton = (id: string, updates: Partial<ButtonStyle>) => {
    onChange({ buttons: widget.buttons.map(b => b.id === id ? { ...b, ...updates } : b) });
  };

  const removeButton = (id: string) => {
    onChange({ buttons: widget.buttons.filter(b => b.id !== id) });
  };

  return (
    <>
      <div className="form-group">
        <label>Meeting Title</label>
        <input
          type="text"
          value={widget.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="15 December - Emergency Services"
        />
      </div>

      <div style={{ marginTop: '15px', marginBottom: '10px' }}>
        <strong style={{ fontSize: '0.9em' }}>Details</strong>
      </div>
      
      {widget.details.map((detail) => (
        <div key={detail.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={detail.key}
            onChange={(e) => updateDetail(detail.id, { key: e.target.value })}
            placeholder="Label"
            style={{ width: '100px' }}
          />
          <input
            type="text"
            value={detail.value}
            onChange={(e) => updateDetail(detail.id, { value: e.target.value })}
            placeholder="Value"
            style={{ flex: 1 }}
          />
          <button className="btn btn-small btn-danger" onClick={() => removeDetail(detail.id)}>×</button>
        </div>
      ))}
      
      <button className="btn btn-secondary btn-small btn-full mb-3" onClick={addDetail}>+ Add Detail</button>

      <div style={{ marginTop: '15px', marginBottom: '10px' }}>
        <strong style={{ fontSize: '0.9em' }}>Buttons</strong>
      </div>
      
      {widget.buttons.map((btn) => (
        <div key={btn.id} style={{ background: '#f0f0f0', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={btn.text}
              onChange={(e) => updateButton(btn.id, { text: e.target.value })}
              placeholder="Button text"
              style={{ flex: 1 }}
            />
            <button className="btn btn-small btn-danger" onClick={() => removeButton(btn.id)}>×</button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              value={btn.url}
              onChange={(e) => updateButton(btn.id, { url: e.target.value })}
              placeholder="URL"
              style={{ flex: 1 }}
            />
            <select 
              value={btn.variant} 
              onChange={(e) => updateButton(btn.id, { variant: e.target.value as ButtonStyle['variant'] })}
              style={{ width: '100px' }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
        </div>
      ))}
      
      <button className="btn btn-secondary btn-small btn-full" onClick={addButton}>+ Add Button</button>
    </>
  );
};

// Video Widget Editor
const VideoWidgetEditor: React.FC<{ widget: VideoWidget; onChange: (u: Partial<VideoWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Video URL (YouTube or direct link)</label>
      <input
        type="url"
        value={widget.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="https://youtube.com/watch?v=..."
      />
    </div>
    <div className="form-group">
      <label>Title (optional)</label>
      <input
        type="text"
        value={widget.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Video title"
      />
    </div>
  </>
);

// Map Widget Editor
const MapWidgetEditor: React.FC<{ widget: MapWidget; onChange: (u: Partial<MapWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Google Maps Embed URL</label>
      <input
        type="url"
        value={widget.embedUrl}
        onChange={(e) => onChange({ embedUrl: e.target.value })}
        placeholder="https://www.google.com/maps/embed?..."
      />
      <small style={{ color: '#666', fontSize: '0.8em', display: 'block', marginTop: '5px' }}>
        Go to Google Maps → Share → Embed a map → Copy the src URL
      </small>
    </div>
    <div className="form-group">
      <label>Title (optional)</label>
      <input
        type="text"
        value={widget.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Location name"
      />
    </div>
  </>
);

// Image Widget Editor
const ImageWidgetEditor: React.FC<{ widget: ImageWidget; onChange: (u: Partial<ImageWidget>) => void }> = ({ widget, onChange }) => (
  <>
    <div className="form-group">
      <label>Image URL</label>
      <input
        type="url"
        value={widget.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
    </div>
    <div className="form-group">
      <label>Alt Text</label>
      <input
        type="text"
        value={widget.alt || ''}
        onChange={(e) => onChange({ alt: e.target.value })}
        placeholder="Image description"
      />
    </div>
    <div className="form-group">
      <label>Width</label>
      <select value={widget.width || '100%'} onChange={(e) => onChange({ width: e.target.value })}>
        <option value="100%">Full Width</option>
        <option value="75%">75%</option>
        <option value="50%">50%</option>
        <option value="25%">25%</option>
      </select>
    </div>
  </>
);
