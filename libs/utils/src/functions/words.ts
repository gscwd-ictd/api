export const abbreviate = (word: string) => {
    const words = word.split(' ');
    let abbreviation = '';

    const capitalPattern = new RegExp('[A-Z]');

    words.map((_word) => {
        if (capitalPattern.test(_word[0])) abbreviation += _word[0];
    });
    return abbreviation;
}