const path = require('path');
const { stat, readdir} = require('fs/promises');

const dir = path.join(__dirname, 'secret-folder');
const files = readdir(dir, { withFileTypes: true });

files.then((file) => {
  const onlyFiles = file.filter((allFiles) => allFiles.isFile());
  for (let allFiles of onlyFiles){
    stat(path.join(dir, allFiles.name)).then((fileStats) => {
      const file = path.parse(allFiles.name);
      process.stdout.write(`${file.name} - ${file.ext.slice(1)} - ${(fileStats.size/1024).toFixed(3)} kb\n`);
    });
  }
});
