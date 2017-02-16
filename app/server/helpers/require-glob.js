const path = require('path');
const glob = require('glob');
const _ = require('lodash');

const root = path.resolve('./');
const serverDir = path.resolve('./app/server');

const resolveGlob = exports.resolveGlob = (globs) => {
  globs = _.isString(globs) ? [globs] : globs;

  return globs.reduce((modules, singleGlob) => modules.concat(
    glob
      .sync(singleGlob, { root })
      .map((filename) => path.resolve(root, filename))
  ), []);
};

const requireGlob = exports.requireGlob = (globs) => (
  resolveGlob(globs).map((absolutePath) => {
    const relativePath = path.relative(serverDir, absolutePath);

    console.log('Requiring: %s...', relativePath);

    return require(absolutePath);
  })
);

exports.requireAndExecute = (globs, ...args) => (
  requireGlob(globs).forEach((func) => {
    func(...args);
  })
);
