import { v4 as uuidv4 } from 'uuid';

// Widget Types
export type WidgetType = 
  | 'text'
  | 'heading'
  | 'button'
  | 'buttonGroup'
  | 'list'
  | 'divider'
  | 'notice'
  | 'meeting'
  | 'video'
  | 'map'
  | 'image';

// Button Style
export interface ButtonStyle {
  id: string;
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'accent' | 'outline';
}

// List Item
export interface ListItem {
  id: string;
  text: string;
}

// Key-Value Item (for meeting details)
export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
}

// Base Widget Interface
export interface BaseWidget {
  id: string;
  type: WidgetType;
}

// Text Widget
export interface TextWidget extends BaseWidget {
  type: 'text';
  content: string;
  isBold?: boolean;
  isItalic?: boolean;
}

// Heading Widget
export interface HeadingWidget extends BaseWidget {
  type: 'heading';
  text: string;
  level: 'h3' | 'h4';
}

// Button Widget
export interface ButtonWidget extends BaseWidget {
  type: 'button';
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'accent' | 'outline';
}

// Button Group Widget
export interface ButtonGroupWidget extends BaseWidget {
  type: 'buttonGroup';
  buttons: ButtonStyle[];
}

// List Widget
export interface ListWidget extends BaseWidget {
  type: 'list';
  items: ListItem[];
  ordered?: boolean;
}

// Divider Widget
export interface DividerWidget extends BaseWidget {
  type: 'divider';
}

// Notice Widget
export interface NoticeWidget extends BaseWidget {
  type: 'notice';
  content: string;
  variant: 'info' | 'warning' | 'success' | 'danger';
}

// Meeting Widget
export interface MeetingWidget extends BaseWidget {
  type: 'meeting';
  title: string;
  details: KeyValueItem[];
  buttons: ButtonStyle[];
}

// Video Widget
export interface VideoWidget extends BaseWidget {
  type: 'video';
  url: string;
  title?: string;
}

// Map Widget
export interface MapWidget extends BaseWidget {
  type: 'map';
  embedUrl: string;
  title?: string;
}

// Image Widget
export interface ImageWidget extends BaseWidget {
  type: 'image';
  url: string;
  alt?: string;
  width?: string;
}

// Union of all widget types
export type Widget = 
  | TextWidget
  | HeadingWidget
  | ButtonWidget
  | ButtonGroupWidget
  | ListWidget
  | DividerWidget
  | NoticeWidget
  | MeetingWidget
  | VideoWidget
  | MapWidget
  | ImageWidget;

// Section
export interface Section {
  id: string;
  title: string;
  widgets: Widget[];
  borderColor?: string;
  collapsed?: boolean;
}

// Theme
export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

// Header Config
export interface HeaderConfig {
  title: string;
  subtitle: string;
  showGradient: boolean;
}

// Footer Config
export interface FooterConfig {
  content: string;
  showGradientBorder: boolean;
}

// Email Config
export interface EmailConfig {
  header: HeaderConfig;
  footer: FooterConfig;
  theme: Theme;
  sections: Section[];
}

// Default Theme
export const defaultTheme: Theme = {
  primaryColor: '#001489',
  secondaryColor: '#FFCD00',
  accentColor: '#BA0C2F',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  fontFamily: "'Ubuntu', Arial, sans-serif",
  borderRadius: '8px',
};

// Theme Templates
export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  theme: Theme;
}

export const themeTemplates: ThemeTemplate[] = [
  {
    id: 'cap-default',
    name: 'CAP Default',
    description: 'Civil Air Patrol colors',
    theme: defaultTheme,
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean blue theme',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#60a5fa',
      accentColor: '#1e40af',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: "'Ubuntu', Arial, sans-serif",
      borderRadius: '12px',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Nature-inspired theme',
    theme: {
      primaryColor: '#166534',
      secondaryColor: '#86efac',
      accentColor: '#15803d',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: "'Ubuntu', Arial, sans-serif",
      borderRadius: '8px',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm and inviting',
    theme: {
      primaryColor: '#ea580c',
      secondaryColor: '#fdba74',
      accentColor: '#c2410c',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: "'Ubuntu', Arial, sans-serif",
      borderRadius: '10px',
    },
  },
];

// Widget Templates
export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  defaultData: Partial<Widget>;
}

export const widgetTemplates: WidgetTemplate[] = [
  {
    id: 'meeting-standard',
    name: 'Standard Meeting',
    description: 'Meeting with location, time, and details',
    type: 'meeting',
    defaultData: {
      title: 'Meeting Title',
      details: [
        { id: uuidv4(), key: 'Location', value: 'TBA' },
        { id: uuidv4(), key: 'UOD', value: 'TBA' },
        { id: uuidv4(), key: 'Details', value: 'TBA' },
      ],
      buttons: [],
    },
  },
  {
    id: 'meeting-virtual',
    name: 'Virtual Meeting',
    description: 'Online meeting with join link',
    type: 'meeting',
    defaultData: {
      title: 'Virtual Meeting',
      details: [
        { id: uuidv4(), key: 'Location', value: 'Virtual' },
        { id: uuidv4(), key: 'UOD', value: 'Civilian' },
        { id: uuidv4(), key: 'Time', value: 'TBA' },
      ],
      buttons: [
        { id: uuidv4(), text: 'Join Meeting', url: '', variant: 'primary' },
      ],
    },
  },
  {
    id: 'notice-no-meeting',
    name: 'No Meeting Notice',
    description: 'Notice for cancelled meetings',
    type: 'notice',
    defaultData: {
      content: 'NO MEETING',
      variant: 'warning',
    },
  },
  {
    id: 'cta-buttons',
    name: 'Call to Action',
    description: 'Group of action buttons',
    type: 'buttonGroup',
    defaultData: {
      buttons: [
        { id: uuidv4(), text: 'Learn More', url: '', variant: 'primary' },
        { id: uuidv4(), text: 'Register', url: '', variant: 'accent' },
      ],
    },
  },
];

// Helper Functions
export function createWidget(type: WidgetType): Widget {
  const id = uuidv4();
  
  switch (type) {
    case 'text':
      return { id, type, content: '' };
    case 'heading':
      return { id, type, text: '', level: 'h3' };
    case 'button':
      return { id, type, text: 'Button', url: '', variant: 'primary' };
    case 'buttonGroup':
      return { id, type, buttons: [] };
    case 'list':
      return { id, type, items: [], ordered: false };
    case 'divider':
      return { id, type };
    case 'notice':
      return { id, type, content: '', variant: 'info' };
    case 'meeting':
      return { id, type, title: '', details: [], buttons: [] };
    case 'video':
      return { id, type, url: '' };
    case 'map':
      return { id, type, embedUrl: '' };
    case 'image':
      return { id, type, url: '' };
    default:
      return { id, type: 'text', content: '' };
  }
}

export function createSection(): Section {
  return {
    id: uuidv4(),
    title: 'New Section',
    widgets: [],
    collapsed: false,
  };
}

export function createDefaultEmailConfig(): EmailConfig {
  return {
    header: {
      title: 'Squadron Announcements',
      subtitle: 'Civil Air Patrol - Heartland Composite Squadron',
      showGradient: true,
    },
    footer: {
      content: 'Remember to "Reply All" if you have questions or need clarification on anything listed above.',
      showGradientBorder: true,
    },
    theme: { ...defaultTheme },
    sections: [],
  };
}
