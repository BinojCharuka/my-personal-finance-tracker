const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Backgrounds
  content = content.replace(/bg-slate-50/g, 'bg-[#0a0a0a]'); // App Background
  content = content.replace(/bg-white/g, 'bg-[#121212]'); // Card Background
  content = content.replace(/bg-slate-100/g, 'bg-[#1a1a1a]'); // Subtle/Hover
  content = content.replace(/bg-slate-900/g, 'bg-[#1a1a1a]'); // Overlays
  content = content.replace(/bg-slate-800/g, 'bg-[#1a1a1a]'); 
  
  // Text
  content = content.replace(/text-slate-800/g, 'text-white'); // Headings
  content = content.replace(/text-slate-700/g, 'text-zinc-200'); // Labels
  content = content.replace(/text-slate-600/g, 'text-zinc-300'); // Sub text
  content = content.replace(/text-slate-500/g, 'text-zinc-400'); // Muted text
  content = content.replace(/text-slate-400/g, 'text-zinc-500'); // Icons/Placeholder

  // Borders
  content = content.replace(/border-slate-100/g, 'border-zinc-800/50'); 
  content = content.replace(/border-slate-200/g, 'border-zinc-800'); 
  content = content.replace(/border-slate-300/g, 'border-zinc-700'); 
  content = content.replace(/divide-slate-50/g, 'divide-zinc-800/50');
  content = content.replace(/divide-slate-100/g, 'divide-zinc-800');
  
  // Shadows
  content = content.replace(/shadow-sm/g, 'shadow-none');
  content = content.replace(/shadow-md/g, 'shadow-none');
  content = content.replace(/shadow-lg/g, 'shadow-2xl shadow-primary/10');
  
  // Brand colors -> Neon (already using 'bg-primary' etc, but need to fix text colors on primary backgrounds)
  // Our primary is now neon green, which requires dark text!
  content = content.replace(/bg-primary text-white/g, 'bg-primary text-black font-bold tracking-wide');
  content = content.replace(/bg-slate-800 text-white/g, 'bg-[#1a1a1a] text-white hover:bg-[#262626] border border-zinc-800');

  // Red and Green for expenses/income - make them neon-ish dark mode variants
  content = content.replace(/text-red-500/g, 'text-rose-500');
  content = content.replace(/bg-red-50 text-red-500/g, 'bg-rose-500/10 text-rose-500');
  content = content.replace(/text-green-500/g, 'text-emerald-400');
  content = content.replace(/bg-green-50 text-green-500/g, 'bg-emerald-400/10 text-emerald-400');
  content = content.replace(/text-blue-500/g, 'text-sky-400');
  content = content.replace(/bg-blue-50 text-blue-500/g, 'bg-sky-400/10 text-sky-400');

  // Other specific UI fixes
  content = content.replace(/bg-green-500/g, 'bg-emerald-500');
  content = content.replace(/bg-red-500/g, 'bg-rose-500');
  content = content.replace(/shadow-red-500\/20/g, 'shadow-none');
  content = content.replace(/shadow-green-500\/20/g, 'shadow-none');
  content = content.replace(/bg-red-600/g, 'bg-rose-600');
  content = content.replace(/bg-green-600/g, 'bg-emerald-600');

  // In Next.js layout body background
  content = content.replace(/bg-slate-50/g, 'bg-[#0a0a0a]');

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Updated components for dark neon theme.");
