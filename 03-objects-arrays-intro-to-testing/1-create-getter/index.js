/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const array = path.split('.');
    let result = ''; //TODO Need improve!

    return function getValueOfPathEndpoint(object) {

        outer: for (let i = 0; i < array.length; i++) {
            let shifted = array.shift();

            const type = typeof (object[shifted]);

            switch (type) {
                case ('undefinde'): {
                    result = undefined;
                    break outer;
                }
                case ('object'): {
                    getValueOfPathEndpoint(object[shifted]);
                    break;
                }
                default: {
                    result = object[shifted];
                }
            }

            return result;
        }
    }
}