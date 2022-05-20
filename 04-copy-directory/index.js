const { copyFile, mkdir, readdir, rm } = require ('fs/promises');
const path = require ('path');
const fs = require ('fs');

const dirSource = path.join(__dirname, 'files');

const dirCopy = path.join(__dirname,'files-copy');

async function copy() {
  await rm(dirCopy, { recursive: true, force: true });
  await mkdir(dirCopy, { recursive: true });
  const dirent = await readdir(dirSource, { withFileTypes: true });

  for (const file of dirent) {
    if (file.isFile()) {
      await copyFile(
        path.resolve(dirSource, file.name),
        path.resolve(dirCopy, file.name),
        fs.constants.COPYFILE_FICLONE,
      );
    }
  }
}
try {
  copy();
  process.stdout.write('Файлы скопированы успешно!');
} catch (err) {
  process.stderr.write(err.message);
}