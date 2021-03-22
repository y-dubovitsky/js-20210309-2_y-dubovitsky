/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
function invertObj(obj) {
    let a = {}
    Object.entries(obj).reduce((prev, curr) => {
        console.log(a[cur[0]]);
    }, a)
}

invertObj({
    a: '1',
    b: '2',
    c: '3'
});