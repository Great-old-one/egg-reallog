# egg-logreal

sync logs to targetDir 

## Install

```bash
$ npm i egg-logreal
```

## Usage

- `plugin.js`

```js
exports.logreal = {
  enable: true,
  package: 'egg-logreal',
};
```

- `config.default.js`

```js
// if any files need rotate by file size, config here
exports.logreal = {
  dir: `${app.baseDir}/log`,           // list of files that will be rotated by hour
  maxDays: 7,                     // keep max days log files, default is `7`. Set `0` to keep all logs
  interval:'2m'                   // sync times  
};
```
