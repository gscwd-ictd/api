import { ItemPatterns } from '../constants';
import { ObjectValues } from '../utils';

// microservice target types
export type Items = ObjectValues<typeof ItemPatterns>;
