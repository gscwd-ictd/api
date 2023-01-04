import { Inject, Injectable } from '@nestjs/common';
import { GENERATOR_SERVICE, LOWERCASE, NUMERIC, StringGeneratorOptions, UPPERCASE } from './generator.utils';

@Injectable()
export class GeneratorService {
  private stringGeneratorOptions = {} as StringGeneratorOptions;

  constructor(
    @Inject(GENERATOR_SERVICE)
    private readonly options: StringGeneratorOptions
  ) {
    this.stringGeneratorOptions = options;
  }

  public generate(): string {
    // extract length from options
    const { length } = this.stringGeneratorOptions;

    // initialize value for result
    let result = '';

    // compose characters based on the given values
    const characters = this._composeCharacters(this.stringGeneratorOptions);

    // generate random string
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));

    // return the generated value
    return result;
  }

  private _composeCharacters(options: StringGeneratorOptions): string {
    // extract these fields from the options object
    const { numeric, uppercase, lowercase } = options;

    // initialize value for characters
    let characters = '';

    // append uppercase characters
    if (uppercase) characters = characters.concat(UPPERCASE);

    // append lowercase characters
    if (lowercase) characters = characters.concat(LOWERCASE);

    // append numeric characters
    if (numeric) characters = characters.concat(NUMERIC);

    // if all fields are false or undefined
    if (!uppercase && !lowercase && !numeric) throw new Error('Unable to compose characters to generate a string');

    // return the resulting characters
    return characters;
  }
}
