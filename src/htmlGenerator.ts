import { EmailConfig, Theme, Widget, Section, ButtonStyle } from './types';

export function generateInlineHtml(config: EmailConfig): string {
  const { header, footer, theme, sections } = config;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(header.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: ${theme.fontFamily}; background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${adjustColor(theme.primaryColor, 40)} 100%); color: ${theme.textColor}; line-height: 1.6; padding: 20px; min-height: 100vh; margin: 0;">

<div style="max-width: 1000px; margin: 0 auto; background: ${theme.backgroundColor}; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); border-radius: ${theme.borderRadius}; overflow: hidden;">
  
  ${generateHeader(header, theme)}

  <div style="padding: 40px;">
    ${sections.map(section => generateSection(section, theme)).join('\n\n    ')}
  </div>

  ${generateFooter(footer, theme)}

</div>

</body>
</html>`;
}

function generateHeader(header: { title: string; subtitle: string; showGradient: boolean }, theme: Theme): string {
  const bgStyle = header.showGradient 
    ? `background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${adjustColor(theme.primaryColor, 30)} 100%);`
    : `background: ${theme.primaryColor};`;
    
  return `<div style="${bgStyle} color: #fff; padding: 50px 40px; text-align: center; position: relative; overflow: hidden; border-top: 6px solid; border-image: linear-gradient(90deg, ${theme.secondaryColor} 0%, ${theme.accentColor} 50%, ${theme.secondaryColor} 100%) 1;">
      <h1 style="
        font-size: clamp(1.5em, 5vw, 2.8em);
        margin: 0 0 10px 0;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 2px #fff;
        line-height: 1.1;
        color: #fff;
        background: rgba(0,0,0,0.08);
        border-radius: 8px;
        padding: 0.2em 0.5em;
        display: inline-block;
        word-break: break-word;
      ">
        ${escapeHtml(header.title)}
      </h1>
      <p style="
        font-size: clamp(1em, 2.5vw, 1.3em);
        font-weight: 500;
        opacity: 0.98;
        margin: 0;
        color: ${theme.secondaryColor};
        text-shadow: 0 1px 4px rgba(0,0,0,0.18);
        background: rgba(0,0,0,0.05);
        border-radius: 6px;
        padding: 0.15em 0.4em;
        display: inline-block;
        word-break: break-word;
      ">
        ${escapeHtml(header.subtitle)}
      </p>
    </div>`;
}

function generateFooter(footer: { content: string; showGradientBorder: boolean }, theme: Theme): string {
  const borderStyle = footer.showGradientBorder 
    ? `border-top: 6px solid; border-image: linear-gradient(90deg, ${theme.secondaryColor} 0%, ${theme.accentColor} 50%, ${theme.primaryColor} 100%) 1;`
    : `border-top: 2px solid ${theme.primaryColor};`;
    
  return `<div style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 30px; text-align: center; font-size: 1em; color: #666; ${borderStyle}">
    <strong>${escapeHtml(footer.content)}</strong>
  </div>`;
}

function generateSection(section: Section, theme: Theme): string {
  const borderColor = section.borderColor || theme.secondaryColor;
  
  return `<div style="margin-bottom: 50px;">
      <h2 style="color: ${theme.primaryColor}; font-size: 1.8em; font-weight: 700; margin: 0 0 25px 0; padding-bottom: 12px; border-bottom: 4px solid ${borderColor}; position: relative;">
        ${escapeHtml(section.title)}
      </h2>
      
      ${section.widgets.map(widget => generateWidget(widget, theme)).join('\n\n      ')}
    </div>`;
}

function generateWidget(widget: Widget, theme: Theme): string {
  switch (widget.type) {
    case 'text':
      return generateTextWidget(widget, theme);
    case 'heading':
      return generateHeadingWidget(widget, theme);
    case 'button':
      return generateButtonWidget(widget, theme);
    case 'buttonGroup':
      return generateButtonGroupWidget(widget, theme);
    case 'list':
      return generateListWidget(widget, theme);
    case 'divider':
      return generateDividerWidget(theme);
    case 'notice':
      return generateNoticeWidget(widget, theme);
    case 'meeting':
      return generateMeetingWidget(widget, theme);
    case 'video':
      return generateVideoWidget(widget);
    case 'map':
      return generateMapWidget(widget);
    case 'image':
      return generateImageWidget(widget);
    default:
      return '';
  }
}

function generateTextWidget(widget: { content: string; isBold?: boolean; isItalic?: boolean }, _theme: Theme): string {
  let content = escapeHtml(widget.content);
  if (widget.isBold) content = `<strong>${content}</strong>`;
  if (widget.isItalic) content = `<em>${content}</em>`;
  return `<p style="margin: 0 0 15px 0;">${content}</p>`;
}

function generateHeadingWidget(widget: { text: string; level: 'h3' | 'h4' }, theme: Theme): string {
  const styles = widget.level === 'h3' 
    ? `color: ${theme.primaryColor}; font-size: 1.3em; font-weight: 700; margin: 0 0 15px 0;`
    : `color: ${theme.primaryColor}; font-size: 1.1em; font-weight: 700; margin: 20px 0 10px 0;`;
  return `<${widget.level} style="${styles}">${escapeHtml(widget.text)}</${widget.level}>`;
}

function generateButtonWidget(widget: { text: string; url: string; variant: string }, theme: Theme): string {
  const style = getButtonStyle(widget.variant, theme);
  return `<a href="${escapeHtml(widget.url)}" target="_blank" style="${style}">${escapeHtml(widget.text)}</a>`;
}

function generateButtonGroupWidget(widget: { buttons: ButtonStyle[] }, theme: Theme): string {
  if (widget.buttons.length === 0) return '';
  const buttons = widget.buttons.map(btn => {
    const style = getButtonStyle(btn.variant, theme);
    return `<a href="${escapeHtml(btn.url)}" target="_blank" style="${style}">${escapeHtml(btn.text)}</a>`;
  }).join('\n          ');
  
  return `<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
          ${buttons}
        </div>`;
}

function generateListWidget(widget: { items: { id: string; text: string }[]; ordered?: boolean }, _theme: Theme): string {
  const tag = widget.ordered ? 'ol' : 'ul';
  const items = widget.items.map(item => 
    `<li style="margin: 10px 0; color: #555;">${escapeHtml(item.text)}</li>`
  ).join('\n          ');
  
  return `<${tag} style="margin: 15px 0; padding-left: 25px;">
          ${items}
        </${tag}>`;
}

function generateDividerWidget(theme: Theme): string {
  return `<hr style="border: none; border-top: 2px solid ${theme.secondaryColor}; margin: 25px 0;">`;
}

function generateNoticeWidget(widget: { content: string; variant: string }, theme: Theme): string {
  const variants: Record<string, { bg: string; border: string; text: string }> = {
    info: { bg: '#e3f2fd', border: theme.primaryColor, text: '#1565c0' },
    warning: { bg: 'linear-gradient(135deg, #fff3cd 0%, #fffbea 100%)', border: theme.secondaryColor, text: '#856404' },
    success: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
    danger: { bg: '#ffebee', border: theme.accentColor, text: '#c62828' },
  };
  
  const v = variants[widget.variant] || variants.info;
  
  return `<div style="background: ${v.bg}; border-left: 5px solid ${v.border}; padding: 25px; margin-bottom: 20px; border-radius: 8px; text-align: center; font-size: 1.2em; font-weight: 700; color: ${v.text}; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        ${escapeHtml(widget.content)}
      </div>`;
}

function generateMeetingWidget(widget: { title: string; details: { id: string; key: string; value: string }[]; buttons: ButtonStyle[] }, theme: Theme): string {
  const details = widget.details.map(d => 
    `<div style="margin: 10px 0; font-size: 0.95em;"><strong style="color: #555; font-weight: 600; min-width: 120px; display: inline-block;">${escapeHtml(d.key)}:</strong> ${escapeHtml(d.value)}</div>`
  ).join('\n        ');
  
  const buttons = widget.buttons.length > 0 
    ? `<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
          ${widget.buttons.map(btn => {
            const style = getButtonStyle(btn.variant, theme);
            return `<a href="${escapeHtml(btn.url)}" target="_blank" style="${style}">${escapeHtml(btn.text)}</a>`;
          }).join('\n          ')}
        </div>`
    : '';
  
  return `<div style="background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%); border-left: 5px solid ${theme.primaryColor}; padding: 25px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        <h3 style="color: ${theme.primaryColor}; font-size: 1.4em; font-weight: 700; margin: 0 0 15px 0; display: flex; align-items: center; flex-wrap: wrap; gap: 10px;">
          ${escapeHtml(widget.title)}
        </h3>
        ${details}
        ${buttons}
      </div>`;
}

function generateVideoWidget(widget: { url: string; title?: string }): string {
  // Extract video ID for YouTube embeds
  const youtubeMatch = widget.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return `<div style="margin: 20px 0;">
        ${widget.title ? `<p style="margin: 0 0 10px 0; font-weight: 600;">${escapeHtml(widget.title)}</p>` : ''}
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
        </div>
      </div>`;
  }
  
  return `<div style="margin: 20px 0;">
        ${widget.title ? `<p style="margin: 0 0 10px 0; font-weight: 600;">${escapeHtml(widget.title)}</p>` : ''}
        <a href="${escapeHtml(widget.url)}" target="_blank" style="color: #1976d2;">Watch Video</a>
      </div>`;
}

function generateMapWidget(widget: { embedUrl: string; title?: string }): string {
  return `<div style="margin: 20px 0;">
        ${widget.title ? `<p style="margin: 0 0 10px 0; font-weight: 600;">${escapeHtml(widget.title)}</p>` : ''}
        <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
          <iframe style="width: 100%; height: 300px; border: none;" src="${escapeHtml(widget.embedUrl)}" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>`;
}

function generateImageWidget(widget: { url: string; alt?: string; width?: string }): string {
  const width = widget.width || '100%';
  return `<div style="margin: 20px 0; text-align: center;">
        <img src="${escapeHtml(widget.url)}" alt="${escapeHtml(widget.alt || '')}" style="max-width: ${width}; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
      </div>`;
}

function getButtonStyle(variant: string, theme: Theme): string {
  const base = `display: inline-block; padding: 12px 24px; font-size: 0.95em; font-weight: 600; text-decoration: none; border-radius: 6px; transition: all 0.3s ease; cursor: pointer; border: none; text-align: center; font-family: ${theme.fontFamily};`;
  
  switch (variant) {
    case 'primary':
      return `${base} background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${adjustColor(theme.primaryColor, 30)} 100%); color: #fff; box-shadow: 0 4px 12px ${hexToRgba(theme.primaryColor, 0.3)};`;
    case 'secondary':
      return `${base} background: linear-gradient(135deg, ${theme.secondaryColor} 0%, ${adjustColor(theme.secondaryColor, 20)} 100%); color: #333; box-shadow: 0 4px 12px ${hexToRgba(theme.secondaryColor, 0.3)};`;
    case 'accent':
      return `${base} background: linear-gradient(135deg, ${theme.accentColor} 0%, ${adjustColor(theme.accentColor, 20)} 100%); color: #fff; box-shadow: 0 4px 12px ${hexToRgba(theme.accentColor, 0.3)};`;
    case 'outline':
      return `${base} background: transparent; border: 2px solid ${theme.primaryColor}; color: ${theme.primaryColor};`;
    default:
      return `${base} background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${adjustColor(theme.primaryColor, 30)} 100%); color: #fff;`;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadHtml(html: string, filename: string = 'announcement.html'): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function saveToLocalStorage(config: EmailConfig): void {
  localStorage.setItem('emailConfig', JSON.stringify(config));
}

export function loadFromLocalStorage(): EmailConfig | null {
  const saved = localStorage.getItem('emailConfig');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}
