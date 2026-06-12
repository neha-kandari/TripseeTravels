const fs = require('fs');
const path = require('path');

const destinations = ['andaman', 'bali', 'dubai', 'malaysia', 'maldives', 'singapore', 'thailand', 'vietnam'];
const files = destinations.map(dest => path.join('d:/Tripsee2/app/destination', dest, 'page.tsx'));

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Extract destination name from path
  const destName = path.basename(path.dirname(file));
  const cacheKey = `tripsee_packages_${destName}`;

  // 1. Replace allPackages state definition
  // Handle different variations: useState<Package[]>([]), useState<Array<...>>([]), etc.
  content = content.replace(
    /const\s+\[allPackages,\s*setAllPackages\]\s*=\s*useState(?:<[^>]+>)?\(\s*\[\]\s*\);/g,
    `const [allPackages, setAllPackages] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('${cacheKey}');
      if (cached) return JSON.parse(cached);
    }
    return [];
  });`
  );

  // 2. Replace loading/isLoading state definition
  content = content.replace(
    /const\s+\[(loading|isLoading),\s*set(Loading|IsLoading)\]\s*=\s*useState\(true\);/g,
    `const [$1, set$2] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('${cacheKey}');
    }
    return true;
  });`
  );

  // 3. Inject localStorage.setItem after setAllPackages(...)
  // Search for setAllPackages(transformedPackages) or setAllPackages(apiPackages)
  content = content.replace(
    /setAllPackages\(([^)]+)\);/g,
    `setAllPackages($1);
        if (typeof window !== 'undefined' && Array.isArray($1) && $1.length > 0) {
          localStorage.setItem('${cacheKey}', JSON.stringify($1));
        }`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
