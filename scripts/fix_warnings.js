const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // 1. Fix double slashes in images src
      content = content.replace(/src=[\"']\/https:\/\//g, 'src=\"https://');

      // 2. Fix missing sizes on <Image ... fill ... />
      content = content.replace(/<Image([^>]*?)>/g, (match, props) => {
        if (props.includes('fill') && !props.includes('sizes=')) {
          return match.replace(/fill/g, 'fill sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\"');
        }
        return match;
      });

      // 3. Fix width/height modified warnings on logo images
      if (fullPath.includes('Header.tsx') || fullPath.includes('Footer.tsx') || fullPath.includes('not-found.tsx') || fullPath.includes('page.tsx')) {
         content = content.replace(/<Image([^>]*?)src=(['\"])(.*?logo(?:_l0mrgw)?\.png.*?)\2([^>]*?)>/g, (match, p1, quote, src, p2) => {
             if (!match.includes('style={{')) {
                 if (match.includes('className=')) {
                     return match.replace(/className=/, 'style={{ width: \"auto\", height: \"auto\" }} className=');
                 } else {
                     return match.replace(/<Image /, '<Image style={{ width: \"auto\", height: \"auto\" }} ');
                 }
             }
             return match;
         });
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
console.log('Finished updating files.');
