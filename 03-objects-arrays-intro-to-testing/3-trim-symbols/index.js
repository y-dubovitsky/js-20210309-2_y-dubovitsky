/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
function trimSymbols(string, size) {
    if(size == 0 || string.length == 0) return '';

    let counter = 0;
    const arr = string.split("");

    // if(size == 0 || string.length == 0) return '';
    if(size == undefined) return string;

    const result = arr.reduce((prev, cur) => {
        cur.charCodeAt() === prev.charCodeAt(prev.length - 1) ? counter++ : ''
        if (counter < size) {
            return prev + cur;
        } else {
            counter = 0;
            return prev;
        }
    })
    return result;
}

console.log(trimSymbols('eedaaad', 2)); // eedaad
console.log(trimSymbols('', 2)); // eedaad
console.log(trimSymbols('XXXXXXXXXXXX')); // XXXXXXXXXXXX
console.log(trimSymbols('accbbdd', 0)); // 
console.log(trimSymbols('xxxaaxx', 1)); // xax
console.log(trimSymbols('xxxaaaaab', 1)); // xab

const text = 'asdffdgdfa';

console.log(text.charCodeAt(text.length - 1));