/**
 * Clears the NPM cache for a file and loads the current version.
 *
 * @param {String} module - The absolute path to a file.
 * @return {*}
 */
module.exports = function requireCurrent(module) {
  if (!process.env.RUNNING_IN_CI) delete require.cache[require.resolve(module)];
  return require(module);
}
