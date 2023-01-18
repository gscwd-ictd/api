import { AuthPatterns, ItemPatterns } from '../constants';
import { ObjectValues } from '../utils';

// microservice target types
export type Authentication = ObjectValues<typeof AuthPatterns>;

export type Items = ObjectValues<typeof ItemPatterns>;
