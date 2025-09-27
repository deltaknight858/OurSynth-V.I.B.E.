import color from './tokens/color.dark.json';
import depth from './tokens/depth.json';
import motion from './tokens/motion.json';

const tokenGroups: Record<string, Record<string,string>> = { color, depth, motion } as any;

export function applyLabsTheme(root: HTMLElement = document.documentElement) {
  root.setAttribute('data-labs-theme', 'dark');
  for (const group of Object.values(tokenGroups)) {
    for (const [k,v] of Object.entries(group)) {
      const cssName = `--${k.replace(/\./g,'-')}`;
      root.style.setProperty(cssName, v);
    }
  }
  // inject keyframes from motion tokens that contain @keyframes
  Object.values(motion).forEach(v => {
    if (typeof v === 'string' && v.startsWith('@keyframes')) {
      const styleId = 'labs-motion-keyframes';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = v;
        document.head.appendChild(style);
      }
    }
  });
}
