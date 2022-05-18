const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout } = process;

const dir = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(dir, 'utf-8');

stdout.write('Привет! Введи строку для записи в файл или "Exit" для выхода:\n');

stdin.on('data', data => {
  const chunk = data.toString();
  if (chunk.trim() === 'exit') {
    process.exit();
  } else {
    output.write(chunk);
  }
});
process.on('exit', () => stdout.write('\nЗавершение работы, пока!\n'));
process.on('SIGINT', () => {process.exit();});
