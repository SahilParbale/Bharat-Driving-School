import fs from 'fs';
import path from 'path';

const srcBase = path.resolve('bharatmds_full/www.bharatmds.com');
const destBase = path.resolve('public/assets');

const mappings = [
  { src: 'Admin/Upload/SliderPhoto', dest: 'slider' },
  { src: 'Admin/Upload/GalleryPhotos', dest: 'gallery' },
  { src: 'Admin/Upload/FeaturesPhotos', dest: 'features' },
  { src: 'Admin/Upload/ServicePhotos', dest: 'services' },
  { src: 'Admin/Upload/Videos', dest: 'videos' },
  { src: 'HomeCSS/img', dest: 'images' },
];

function sanitizeFilename(filename) {
  // Strip out cache-busting strings like "@+d.getTime());" or "?+d.getTime()"
  let clean = filename;
  clean = clean.split('@')[0];
  clean = clean.split('?')[0];
  clean = clean.replace(/%\d+[A-Z]/gi, ''); // clean URL encoded chars if any
  clean = clean.replace(/[()%;]/g, ''); // clean remaining parens/semicolons
  return clean.trim();
}

function copyFolder(srcSub, destSub) {
  const srcDir = path.join(srcBase, srcSub);
  const destDir = path.join(destBase, destSub);

  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory does not exist: ${srcDir}`);
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  let count = 0;

  files.forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const stat = fs.statSync(srcFile);

    if (stat.isFile()) {
      const cleanName = sanitizeFilename(file);
      const destFile = path.join(destDir, cleanName);

      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  });

  console.log(`Copied ${count} files from ${srcSub} to assets/${destSub}`);
}

console.log('Starting asset migration...');
mappings.forEach(({ src, dest }) => {
  copyFolder(src, dest);
});
console.log('Asset migration complete!');
