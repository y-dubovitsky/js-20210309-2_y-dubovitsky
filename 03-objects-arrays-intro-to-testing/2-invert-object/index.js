/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

    if (obj === undefined) return undefined;

    return Object.fromEntries(
        Object
            .entries(obj)
            .reduce(
                (prev, cur) => {
                    const swapped = swapArrItem(cur);
                    prev.push(swapped);
                    return prev;
                }, []
            )
    );

    function swapArrItem(arr) { //TODO Make refactoring
        return ([arr[1], arr[0]]);
    }
}

