const { exec } = require('child_process');
const path = require('path');
const { css, js, images } = require('./build-config.json');
const handler = (err, stdout, stderr) => {
  console.log(this);
  console.log(stdout);
  console.error(stderr);
}

const buildProcesses = [
  ...css.map(
    item => `rm -rf ${item.dest}`
  ),
  ...js.map(
    item => `rm -rf ${item.dest}`
  ),
  `rm -rf ${images.dest}`,
  // compile css
  ...css.map(
    item => `lessc ${item.src} ${item.dest} --clean-css`
  ),
  // compile js
  ...js.map(
    item => `browserify ${item.src} -t babelify | uglifyjs -c > ${item.dest}`
  ),
  'npm run custom',
]
.map(
  command => {
    // TODO, hacky, but gives us access to locally installed binaries
    const buildProcess = exec(`PATH=$PATH:./node_modules/.bin ${command}`);
    buildProcess.stdout.pipe(process.stdout);
    buildProcess.stderr.pipe(process.stderr);
    return buildProcess;
  }
);

// imagemin doesn't have a CLI

const onExit = (options, err) => {
  buildProcesses.forEach(
    buildProcess => buildProcess.kill()
  );
};

//do something when app is closing
process.on('exit', onExit);

//catches ctrl+c event
process.on('SIGINT', onExit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);

//catches uncaught exceptions
process.on('uncaughtException', onExit);
