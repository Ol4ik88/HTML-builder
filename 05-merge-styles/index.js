const { readdir } = require ('fs/promises');
const path = require ('path');
const fs = require ('fs');

const dirSource = path.join(__dirname, 'styles');
const dirTarget = path.join(__dirname, 'project-dist', 'bundle.css');

const ws = fs.createWriteStream(dirTarget);

async function bundle() {
  const files = await readdir(dirSource, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const fileCSS = path.join(dirSource, file.name);
      const rs = fs.createReadStream(fileCSS);
      rs.pipe(ws, {end: false});
    }
  }
}

try {
  bundle();
  process.stdout.write('Файлы собраны успешно!');
} catch (err) {
  process.stderr.write(err.message);
}