const path = require('path');
const { stat, readdir} = require('fs/promises');

const dir = path.join(__dirname, 'secret-folder');

async function infoOfFile (){
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const fileStats = await stat(path.join(dir, file.name));
      const info = path.parse(file.name);
      process.stdout.write(`${info.name} - ${info.ext.slice(1)} - ${(fileStats.size/1024).toFixed(3)} kb\n`);
    }
  }
}
try {
  infoOfFile();
} catch (err) {
  process.stderr.write(err.message);
}
