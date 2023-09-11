import * as fs from 'fs';
import * as path from 'path';

/**
 * Traverse the project's file tree until it reaches the directory where package.json file exists.
 * This assumes that the directory where package.json resides is the project's root directory.
 *
 * @returns the project's root directory
 */
export const getProjectRootDir = () => {
  // initialize current directory
  let currDir = __dirname;

  // go back 1 step into file tree if package.json file does not exist in the current directory
  while (!fs.existsSync(path.join(currDir, 'package.json'))) {
    currDir = path.join(currDir, '..');
  }

  // this is the project's root directory
  return currDir;
};
