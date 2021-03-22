/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(size === 0 || string.length === 0) return '';
    if(size === undefined) return string; //TODO Improve?

    let counter = 0;
    const arr = string.split("");

    const result = arr.reduce((prev, cur) => {
        comapreCharsInStringByCodes(cur, 0, prev, prev.length - 1) ? counter++ : ''
        if (counter < size) {
            return prev + cur;
        } else {
            counter = 0;
            return prev;
        }
    })
    return result;

    function comapreCharsInStringByCodes(a, indexA, b, indexB) {
        return a.charCodeAt(indexA) === b.charCodeAt(indexB);
    }
}

