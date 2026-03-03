import { BLOCK_CONFIG } from './block-registry.js';

window.renderItemPreview = function(el) {
  const { type, content } = el.dataset;
  
  if (!BLOCK_CONFIG) {
    console.error("BLOCK_CONFIG no está definido. Revisa block-registry.js");
    return;
  }

  const config = BLOCK_CONFIG[type];
  
  const html = config 
    ? config.render(content, el) 
    : `<div style="padding: 20px; color: #ff4444;">Error: Tipo [${type}] no registrado</div>`;

  el.innerHTML = `
    <div class="item-inner" style="width:100%; height:100%; display: grid; align-items: center; justify-content: center;">
      <span class="badge-type" style="flex: 1;
        font-size:10px; background:#04e9b0; color:#000; 
        padding:2px 6px; border-radius:4px; font-weight:bold; 
        text-transform:uppercase; pointer-events:none;
      ">
        ${type}
      </span>
      <div class="preview-zone" style="width:100%; height:100%; overflow:hidden; flex: 1;">
        ${html}
      </div>
    </div>`;

  if (type === 'bento') {
    setTimeout(() => {
      if (window.initBentoSlots) window.initBentoSlots();
    }, 100);
  }
};

window.createGridItem = (type, data = null) => {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const el = document.createElement('div');
  el.className = 'grid-item-live';
  el.dataset.type = type;
  
  if (type === 'bento') {
    el.style.gridColumn = `span ${data?.colSpan || 4}`;
    el.style.gridRow = `span ${data?.rowSpan || 4}`;
    el.dataset.content = data?.content || JSON.stringify({cols: 3, rows: 2});
  } else {
    el.style.gridColumn = `span ${data?.colSpan || 1}`;
    el.style.gridRow = `span ${data?.rowSpan || 1}`;
    el.dataset.content = data?.content || '';
  }

  window.renderItemPreview(el);
  
  el.onclick = (e) => { 
    e.stopPropagation(); 
    window.selectItem?.(el);
  };

  canvas.appendChild(el);
};