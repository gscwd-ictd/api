export type StringGeneratorOptions = {
  length: number;
  numeric?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
};

export const GENERATOR_SERVICE = 'GENERATOR_SERVICE';

export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

export const NUMERIC = '0123456789';
