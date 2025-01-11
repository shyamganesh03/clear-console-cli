import path from 'path'

/**
 * Get the root folder of the project.
 * @returns {string} The absolute path to the root folder.
 */
function getRootFolder() {
  return path.resolve(process.cwd());
}

export { getRootFolder };