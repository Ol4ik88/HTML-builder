const fs = require('fs');
const path = require('path');
const { copyFile, mkdir, readdir, rm } = require ('fs/promises');

const dirProject = path.join(__dirname,'project-dist');
const dirAseets = path.join(__dirname, 'assets');
const newAssets = path.join(dirProject, 'assets');
const dirStyles = path.join(__dirname, 'styles');
const newStyles = path.join(dirProject, 'style.css');
const dirTemplate = path.join(__dirname, 'template.html');
const dirComponents = path.join(__dirname, 'components');
const dirPageIndex = path.join(dirProject, 'index.html');

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
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const fileCSS = path.join(dirStyles, file.name);
      const rs = fs.createReadStream(fileCSS);
      rs.pipe(ws, {end: false});
    }
  }
}

async function createHtmlPage() {
  const rsTemplates = fs.createReadStream(dirTemplate, 'utf-8');
  const components = await readdir(dirComponents, {withFileTypes: true});
  let data = '';
  rsTemplates.on('data', chunk => data += chunk);
  rsTemplates.on('end', async () => {
    for(const file of components) {
      if (file.isFile() && path.parse(file.name).ext === '.html'){
        const rsComponents = fs.createReadStream(path.join(dirComponents, file.name));
        const nameComponents = path.parse(file.name).name;
        let textHTML = '';
        rsComponents.on('data', chunk => textHTML += chunk);
        rsComponents.on('end', () => {
          data = data.replace(`{{${nameComponents}}}`, textHTML);
          const wsPage = fs.createWriteStream(dirPageIndex);
          wsPage.write(data);
        });
      }
    }
  });
}

try {
  mkdir(dirProject , { recursive: true });
  copy(dirAseets, newAssets);
  process.stdout.write('Файлы скопированы успешно!\n');
  bundle();
  process.stdout.write('Файлы собраны успешно!\n');
  createHtmlPage();
  process.stdout.write('Файл index успешно создан!\n');
} catch (err) {
  process.stderr.write(err.message);
}
