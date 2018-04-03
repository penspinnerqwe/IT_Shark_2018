'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    let sides = ['N','E','S','W'];
    
    for(let i = 0; i < 2; i++) {
        for(let index = 0, turnIndicator = false; index < sides.length; index += 2, turnIndicator = !turnIndicator) 
            sides.splice(index + 1, 0, !turnIndicator ? sides[index] + sides[(index + 1) % sides.length] : sides[(index + 1) % sides.length] + sides[index]);
    }
    
    let subSides = [];
    for(let index = 0; index < sides.length; index += 4) {
        subSides.push(sides[index] + 'b' + sides[(index + 4) % sides.length]);
        subSides.push(sides[index + 2] + 'b' + sides[index]);
        subSides.push(sides[index + 2] + 'b' + sides[(index + 4) % sides.length]);
        subSides.push(sides[(index + 4) % sides.length] + 'b' + sides[index]); 
    }
    
    for(let index = 0, subIndex = 0; index < sides.length; index += 2, subIndex++)
        sides.splice(index + 1, 0, subSides[subIndex]);
    
    return sides.map((item, i) => {
        return {abbreviation: item, azimuth: 11.25 * i};
    })
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let root = { value: str };
    buildTree (root);
    
    let stack = [ root ];
    while (stack.length > 0) {
        let temp = stack.shift();
        
        if(temp.children) 
            temp.children.forEach(item => {
                item.value = temp.value + item.value; 
                stack.push(item);
            });
        else
            yield temp.value;
    } 
}
    
function buildTree (node) {
    let firstLiteral = node.value.indexOf('{');
    
    if (firstLiteral !== -1) {
        let secondtLiteral = sameLavelLitreral(node.value, firstLiteral);
        
        node.children = substringToChildren(node.value.substring(firstLiteral + 1, secondtLiteral));
        node.children.forEach(item => {
            item.value += node.value.substring(secondtLiteral + 1, node.value.length);
        });
    
        node.value = node.value.substring(0,firstLiteral);
        
        node.children.forEach(item => {
            buildTree (item);
        });
    }
}
    
function substringToChildren (string) {
    let result = [], signOfLavel = 0, tempString = '';
    
    for(let i = 0; i <= string.length; i++) {
        if (string[i] === '{')
            signOfLavel++;
        if (string[i] === '}')
            signOfLavel--; 
        if(string[i] === ',' && signOfLavel === 0 || i === string.length) {
            result.push({ value: tempString });
            tempString = '';
            continue;
        } 
        tempString += string[i]; 
    }
    return result;
}
    
function sameLavelLitreral (string, firstLiteral) {
    let signOfLavel = 0;
    
    for(let i = firstLiteral + 1; i < string.length; i++) {
        if (string[i] === '}' && signOfLavel === 0)
            return i;
        if (string[i] === '{')
            signOfLavel++;
        if (string[i] === '}')
            signOfLavel--;
    }
    return -1;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let arr = new Array(n).fill(0).map( item => { return new Array(n).fill(0); });
    let i = 0, j = 0, tik = 0;
    
    while (i < n && j < n) {
        if ((i + j) % 2 == 0) 
            tik = diagonalFilling (arr, i, j, tik);
        else 
            tik = diagonalFilling (arr, j, i, tik);
    
        if(i + 1 < n) i++;
        else j++;
    }
    
    return arr;
}

function diagonalFilling (arr, index1, index2, tik) {
    let localI = index1, localJ = index2;
    
    if( index1 > index2 ){
        while (localI >= index2, localJ <= index1) {
            arr[localI][localJ] = tik++;
            localI--;
            localJ++;
        }
    } else {
        while (localI <= index2, localJ >= index1) {
            arr[localI][localJ] = tik++;
            localI++;
            localJ--;
        }
    } 
    
    return tik;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let degreeOfTop = [];
    dominoes.forEach(item => {
        if(item[0] !== item[1]) {
            degreeOfTop[item[0]] = (degreeOfTop[item[0]] || 0) + 1;
            degreeOfTop[item[1]] = (degreeOfTop[item[1]] || 0) + 1;
        }
    });

    let isConnected = true;
    dominoes.forEach(item => {
        if(!degreeOfTop[item[0]] || !degreeOfTop[item[1]])
            isConnected = false;
    });        

    let criterion = degreeOfTop.reduce((res, current) => { 
        return res += current % 2; 
    }, 0);

    return criterion < 3 && isConnected;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let resultString = '';
    
    let tempArr = [];
    nums.forEach((element, i, arr) => {
        tempArr.push(element);
        if(arr[i + 1] && element + 1 !== arr[i + 1] || i === arr.length - 1) {
            resultString += arrayToString(tempArr) + (i < arr.length - 1 ? ',' : '');
            tempArr = [];
        } 
    });
    
    return resultString;
}
    
function arrayToString (arr) {
    if(arr.length >= 3) 
        return arr[0] + '-' + arr[arr.length - 1];
    else
        return JSON.stringify(arr).replace(/[\[\]]/g,'');
}
    

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
