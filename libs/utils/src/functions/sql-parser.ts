import { join } from 'path';
import { readFileSync } from 'fs';
import { getProjectRootDir } from './root-dir-finder';



export const parseSql = (filePath: string) => {

  // read the file and return the raw sql statement.
  try {
    return readFileSync(
      join(getProjectRootDir(), filePath),
      'utf-8',
    );
  } catch (error) {
    throw new Error(
      'Attempt to parse SQL has failed. Make sure that file path, name, and extension are correct.',
    );
  }
};
