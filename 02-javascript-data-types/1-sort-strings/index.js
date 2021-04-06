/**
 * sortStrings - sorts array of string by two criteria 'asc' or 'desc'
 * @param {string[]} arr - the array of strings
 * @param {string} [param='asc'] param - the sorting type 'asc' or 'desc'
 * @returns {string[]}
 */
export default function sortStrings(arr, param = 'asc') {
    let result = new Array(...arr);

    switch(param) {
        case 'asc' : {
            result = result.sort(
                (a, b) => compareViaIntlCollarator(a, b, ['ru', 'en'])
            );
            break;
        }
        case 'desc' : {
            result = result.sort(
                (a, b) => compareViaStringComparator(a, b, ['ru', 'en'], -1)
            );
            break;
        }
        default : {
            result;
        }
    }

    return result;
}

export function compareViaIntlCollarator(a, b, locales, direction = 1) {
    const collator = new Intl.Collator(
        [
            ...locales
        ],
        {
            sensitivity: 'variant',
            caseFirst: 'upper'
        }
    );

    return collator.compare(a, b) * direction;
}

function compareViaStringComparator(a, b, locales, direction = 1) {
    return direction * a.localeCompare(b, [...locales], {sensitivity: 'variant', caseFirst: 'upper'});
}
