export type StringGeneratorOptions = {
  // the desired length for random string
  length: number;

  // whether to include numbers in the final generated result
  numeric?: boolean;

  // whether to include uppercase letters in the final generated result
  uppercase?: boolean;

  // whether to include lowercase letters in the final generated result
  lowercase?: boolean;
};

// custom service identifier
export const GENERATOR_SERVICE = 'GENERATOR_SERVICE';

// value for uppercase letters
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// value for lowercase letters
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

// value for numeric letters
export const NUMERIC = '0123456789';
