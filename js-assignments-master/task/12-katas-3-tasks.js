'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let puzzleArr = puzzle.map(item => {
        return item.split('');
    })
    let searchStrArr = searchStr.split('');
    
    for(let i = 0; i < puzzleArr.length; i++) 
        for(let j = 0; j < puzzleArr[i].length; j++) 
            if(puzzleArr[i][j] === searchStrArr[0]) {
                searchStrArr.shift();
                if(findWord(puzzleArr, searchStrArr, i, j))
                    return true;
                searchStrArr = searchStr.split('');
            }
    
    return false;
}
    
function findWord (puzzleArr, stringArr, i, j) {
    let result = false;

    if(stringArr.length === 0)
        return result = true;
    
    let currentChar = stringArr.shift();
    puzzleArr[i][j] = undefined;
    
    if(i - 1 >= 0 && puzzleArr[i - 1][j] && puzzleArr[i - 1][j] === currentChar)
        result |= findWord(puzzleArr.map(item => { return item.slice(); }), stringArr.slice(), i - 1, j);
    
    if(j + 1 < puzzleArr[0].length && puzzleArr[i][j + 1] && puzzleArr[i][j + 1] === currentChar)
        result |= findWord(puzzleArr.map(item => { return item.slice(); }), stringArr.slice(), i, j + 1);
    
    if(i + 1 < puzzleArr.length && puzzleArr[i + 1][j] && puzzleArr[i + 1][j] === currentChar)
        result |= findWord(puzzleArr.map(item => { return item.slice(); }), stringArr.slice(), i + 1, j);
    
    if(j - 1 >= 0 && puzzleArr[i][j - 1] && puzzleArr[i][j - 1] === currentChar)
        result |= findWord(puzzleArr.map(item => { return item.slice(); }), stringArr.slice(), i, j - 1);

    return result;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    let charsArr = chars.split('');
    yield chars;
    
    let j = findMaxJ (charsArr);
    while (j !== -1) {
        swap (charsArr, j, findMaxL (charsArr, j));
        invertArr (charsArr, j + 1);
        yield charsArr.join('');
        j = findMaxJ (charsArr);
    }
}
    
function invertArr (chars, index) {
    for (let i = index; i <= index + Math.floor((chars.length - 1 - index) / 2); i++)
        swap(chars, i, chars.length - 1 - i + index);
}
    
function swap (chars, i, j){
    let temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
}
    
function findMaxJ (chars) {
    let j = -1;
    for(let i = 0; i < chars.length - 1; i++)
        if(chars[i] < chars[i + 1] && j < i)
            j = i;
    return j;
}
    
function findMaxL (chars, j) {
    let l = -1;
    for(let i = 0; i < chars.length; i++)
        if(chars[i] > chars[j] && l < i)
            l = i;
    return l;
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let max = 0, actionsArr = [];
    for(let i = quotes.length - 1; i >= 0; i--) {
        if(quotes[i] > max) {
            max = quotes[i];
            actionsArr.push(0);
        } else {
            actionsArr.push(1);
        }
    }
    
    return actionsArr.reverse().reduce((result, item, i) => {
        if(item === 1) {
            result.stocksCount++;
            result.balance -= quotes[i]; 
        } else {
            result.balance += quotes[i] * result.stocksCount; 
            result.stocksCount = 0;
        }
        return result;
    }, { stocksCount: 0, balance: 0 }).balance;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = { 

    createFreqDictionary: function(url) {
        let charFreq = [];
        url.split('').forEach( item => {
            let currIndex = charFreq.findIndex( x => { return x.key === item });
            
            if (currIndex !== -1)
                charFreq[currIndex].value++;
            else
                charFreq.push({ key: item, value: 1});
        });
        
        charFreq.sort((a, b) => {
            return b.value < a.value ? -1 : 1;
        });
        
        while (charFreq.length > 1) { 
            let lastItem1 = charFreq.pop();
            let lastItem2 = charFreq.pop();
            
            let insertIndex = charFreq.findIndex( item => {
                return (lastItem2.value + lastItem1.value) > item.value;
            })
            
            charFreq.splice(insertIndex === -1 ? charFreq.length : insertIndex, 0, {
                key: lastItem2.key + lastItem1.key,
                value: lastItem2.value + lastItem1.value,
                children: [lastItem2, lastItem1]
            });
        }
        
        let stack = [ charFreq.pop() ];
        stack[0].value = '';
        while (stack.length > 0) {
            let temp = stack.pop();
            
            if(temp.children)
                temp.children.forEach ( (item, index) => {
                    stack.push(item);
                    stack[stack.length - 1].value = temp.value + index;
                });
            else
                charFreq.push({ key: temp.key, value: temp.value }); 
        }
        
        return charFreq.sort((a, b) => {
            return a.value.length <= b.value.length ? -1 : 1;
        });
    },
    
    encode: function(url) {
        this.dictionary = this.createFreqDictionary(url);
        
        let codeString = url.split('').reduce( (result, item) => {
            return result += this.dictionary.find( x => x.key === item).value;
        }, '');
        codeString += '0'.repeat(8 - codeString.length % 8);
        
        let result = '';
        for(let i = 0; i < codeString.length; i += 8)
            result += String.fromCharCode(parseInt(codeString.substring(i, i + 8), 2));
        
        return result;
    },
    
    decode: function(code) {
        let dictionary = this.dictionary;
        
        code = code.split('').map( item => {
            let tempString = item.charCodeAt(0).toString(2);
            return tempString.length < 8 ? '0'.repeat(8 - tempString.length % 8) + tempString : tempString;
        }).join('');
        
        let message = '';
        for(let i = 0; i < code.length; i++) {
            for(let j = i + 1; j <= code.length; j++) {
                let dictItem = dictionary.find( x => x.value === code.substring(i, j));
                if(dictItem) {
                    message += dictItem.key;
                    i = j - 1;
                    break;
                }
            }
        }
        
        return message;
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
