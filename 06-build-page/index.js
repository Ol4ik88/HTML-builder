const fs = require('fs');
const path = require('path');
const { copyFile, mkdir, readdir, rm } = require ('fs/promises');

const dirProject = path.join(__dirname,'project-dist');
const dirAseets = path.join(__dirname, 'assets');
const newAssets = path.join(dirProject, 'assets');
const dirStyles = path.join(__dirname, 'styles');
const newStyles = path.join(dirProject, 'style.css');

async function copy(dirAseets, newAssets) {
  await rm(newAssets, { recursive: true, force: true });
  await mkdir(newAssets, { recursive: true });
  const files = await readdir(dirAseets, { withFileTypes: true });
  for (const file of files){
    if (file.isFile()) {
      await copyFile(
        path.join(dirAseets, file.name),
        path.join(newAssets, file.name),
        fs.constants.COPYFILE_FICLONE,
      );
    } else {
      copy(path.join(dirAseets, file.name), path.join(newAssets, file.name));
    }
  }
}

async function bundle() {
  const ws = fs.createWriteStream(newStyles);
  const files= await readdir(dirStyles, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const fileCSS = path.join(dirStyles, file.name);
      if (path.extname(fileCSS) === '.css') {
        const rs = fs.createReadStream(fileCSS);
        rs.pipe(ws, {end: false});
      }
    }
  }
}

try {
  mkdir(dirProject , { recursive: true });
  copy(dirAseets, newAssets);
  process.stdout.write('Файлы скопированы успешно!');
  bundle();
  process.stdout.write('Файлы собраны успешно!');
} catch (err) {
  process.stderr.write(err.message);
}
