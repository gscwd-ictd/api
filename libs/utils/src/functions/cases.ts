const toSnake = (input: string) => input.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toCamel = (input: string) => input.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

export const keysToSnake = (input: unknown) => {
  if (input === Object(input) && !Array.isArray(input) && typeof input !== 'function') {
    const n = {};
    Object.keys(input).forEach((k) => {
      n[toSnake(k)] = keysToSnake(input[k]);
    });
    return n;
  } else if (Array.isArray(input)) {
    return input.map((i) => {
      return keysToSnake(i);
    });
  }
  return input;
};

export const keysToCamel = (input: unknown) => {
  if (input === Object(input) && !Array.isArray(input) && typeof input !== 'function') {
    const n = {};
    Object.keys(input).forEach((k) => {
      n[toCamel(k)] = keysToCamel(input[k]);
    });
    return n;
  } else if (Array.isArray(input)) {
    return input.map((i) => {
      return keysToCamel(i);
    });
  }
  return input;
};
