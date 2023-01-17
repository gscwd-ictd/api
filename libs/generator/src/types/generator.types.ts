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
