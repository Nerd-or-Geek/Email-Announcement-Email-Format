import React from 'react';
import { 
  WidgetTemplate, 
  widgetTemplates, 
  Widget, 
  MeetingWidget, 
  NoticeWidget, 
  ButtonGroupWidget,
  KeyValueItem,
  ButtonStyle
} from '../types';
import { v4 as uuidv4 } from 'uuid';

interface WidgetTemplatesProps {
  onSelectTemplate: (widget: Widget) => void;
}

export const WidgetTemplates: React.FC<WidgetTemplatesProps> = ({ onSelectTemplate }) => {
  const applyTemplate = (template: WidgetTemplate) => {
    const baseWidget = {
      id: uuidv4(),
      type: template.type,
    };

    // Create fresh copies of nested arrays with new IDs
    if (template.type === 'meeting') {
      const meetingData = template.defaultData as Partial<MeetingWidget>;
      const widget: MeetingWidget = {
        ...baseWidget,
        type: 'meeting',
        title: meetingData.title || '',
        details: (meetingData.details || []).map((d: KeyValueItem) => ({ ...d, id: uuidv4() })),
        buttons: (meetingData.buttons || []).map((b: ButtonStyle) => ({ ...b, id: uuidv4() })),
      };
      onSelectTemplate(widget);
    } else if (template.type === 'notice') {
      const noticeData = template.defaultData as Partial<NoticeWidget>;
      const widget: NoticeWidget = {
        ...baseWidget,
        type: 'notice',
        content: noticeData.content || '',
        variant: noticeData.variant || 'info',
      };
      onSelectTemplate(widget);
    } else if (template.type === 'buttonGroup') {
      const buttonData = template.defaultData as Partial<ButtonGroupWidget>;
      const widget: ButtonGroupWidget = {
        ...baseWidget,
        type: 'buttonGroup',
        buttons: (buttonData.buttons || []).map((b: ButtonStyle) => ({ ...b, id: uuidv4() })),
      };
      onSelectTemplate(widget);
    }
  };

  return (
    <div className="sidebar-section">
      <h3>📦 Widget Templates</h3>
      <p className="text-muted" style={{ fontSize: '0.85em', marginBottom: '12px' }}>
        Quick-add pre-configured widgets
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {widgetTemplates.map((template) => (
          <button
            key={template.id}
            className="widget-item"
            style={{ 
              textAlign: 'left', 
              cursor: 'pointer',
              border: '1px solid #e0e0e0',
              background: '#fff'
            }}
            onClick={() => applyTemplate(template)}
          >
            <div className="widget-item-header" style={{ marginBottom: '4px' }}>
              <span className="widget-item-title">{template.name}</span>
              <span className="badge badge-blue">{template.type}</span>
            </div>
            <p style={{ fontSize: '0.8em', color: '#666', margin: 0 }}>
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
