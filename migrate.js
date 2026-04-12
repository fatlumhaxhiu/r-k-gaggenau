const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const LANDING_DIR = path.join(ROOT_DIR, 'Landing Pages');
const BACKEND_DIR = path.join(ROOT_DIR, 'Backend');
const DEST_LANDING = path.join(ROOT_DIR, 'src', 'app', 'landing');
const DEST_ADMIN = path.join(ROOT_DIR, 'src', 'app', 'admin');

// Ensure destination directories exist
if (!fs.existsSync(DEST_LANDING)) fs.mkdirSync(DEST_LANDING, { recursive: true });
if (!fs.existsSync(DEST_ADMIN)) fs.mkdirSync(DEST_ADMIN, { recursive: true });

function convertToJSX(htmlString) {
  // Extract body content
  let bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return '';
  let content = bodyMatch[1];
  
  // Basic replacements
  content = content.replace(/class="/g, 'className="');
  content = content.replace(/for="/g, 'htmlFor="');
  // Strip inline styles entirely (both double and single quoted)
  content = content.replace(/style="[^"]*"/g, '');
  content = content.replace(/style='[^']*'/g, '');
  
  // Fix boolean attributes
  content = content.replace(/required=""/g, 'required');
  content = content.replace(/checked=""/g, 'defaultChecked');
  content = content.replace(/disabled=""/g, 'disabled');
  content = content.replace(/readonly=""/ig, 'readOnly');
  content = content.replace(/rows="(\d+)"/g, 'rows={$1}');
  content = content.replace(/tabindex=/ig, 'tabIndex=');
  content = content.replace(/autocomplete=/ig, 'autoComplete=');

  // Close unclosed tags (img, input, br, hr)
  content = content.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/ig, '<$1$2 />');
  
  // Some stitch-specific raw text fixes (like &amp;)
  // The raw HTML might contain comments <!-- --> that are valid in JSX if { /* */ }
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  return content;
}

function processDirectory(sourceDir, destDir, type) {
  // Read folders like landingpage_gewerbereinigung_deutsch
  const folders = fs.readdirSync(sourceDir).filter(f => fs.lstatSync(path.join(sourceDir, f)).isDirectory() && f !== 'pureline_identity');
  
  for (const folder of folders) {
    const htmlPath = path.join(sourceDir, folder, 'code.html');
    if (!fs.existsSync(htmlPath)) continue;
    
    const htmlObj = fs.readFileSync(htmlPath, 'utf8');
    const jsxContent = convertToJSX(htmlObj);
    
    // Generate route slug
    let slug = folder;
    if (type === 'landing') {
      slug = folder.replace('landingpage_', '').replace('_deutsch', '').replace(/_/g, '-');
    } else if (type === 'admin') {
      slug = folder.replace('_updated_nav', '').replace('_r_k_gaggenau', '').replace(/_/g, '-');
      if (slug === 'dashboard-overview') slug = 'dashboard';
    }
    
    const targetRouteDir = path.join(destDir, slug);
    if (!fs.existsSync(targetRouteDir)) fs.mkdirSync(targetRouteDir, { recursive: true });
    
    // Convert to a Next.js Server Component
    const componentName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    
    const tsxCode = `export default function ${componentName}Page() {
  return (
    <>
      ${jsxContent}
    </>
  );
}`;

    fs.writeFileSync(path.join(targetRouteDir, 'page.tsx'), tsxCode);
    console.log(`✅ [${type.toUpperCase()}] Created /${type}/${slug}`);
  }
}

// Execute migration
try {
  console.log("Starting HTML -> JSX Migration...");
  processDirectory(LANDING_DIR, DEST_LANDING, 'landing');
  processDirectory(BACKEND_DIR, DEST_ADMIN, 'admin');
  console.log("Migration Complete!");
} catch (e) {
  console.error("Migration failed: ", e);
}
