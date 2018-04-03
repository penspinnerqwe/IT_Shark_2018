'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let countOfNumbers = bankAccount.indexOf('\n') + 1;
    let etolon = [
        '   \n  |\n  |\n', ' _ \n _|\n|_ \n', ' _ \n _|\n _|\n',
        '   \n|_|\n  |\n', ' _ \n|_ \n _|\n', ' _ \n|_ \n|_|\n',
        ' _ \n  |\n  |\n', ' _ \n|_|\n|_|\n', ' _ \n|_|\n _|\n'  
    ];   
    let result = '';

    for(let i = 0; i <= countOfNumbers - 3; i += 3){
        let tempStringItem = '';     
        for(let j = 0; j < 3; j++)
            tempStringItem += bankAccount.substring(i + j * countOfNumbers, i + j * countOfNumbers + 3) + '\n';
        result += etolon.indexOf(tempStringItem) + 1;
    }
    return result;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let wordsArr = text.split(' ');

    let returnedString = '';
    while(wordsArr.length > 0) {
        returnedString += (returnedString.length !== 0 ? ' ' : '') + wordsArr.shift();

        if(!wordsArr.length || returnedString.length + 1 + wordsArr[0].length > columns ){
            yield returnedString;
            returnedString = '';
        }
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    return Math.max(getRank(handToWorkArray(hand, 1)), getRank(handToWorkArray(hand, 14)));
}
    
function handToWorkArray (hand, valueOfA) {
    return hand.map( item => {
        let temp = [item.substring(0, item.length - 1), item[item.length - 1]];
        temp[0] = parseInt(temp[0].replace('A', valueOfA).replace('J',11).replace('Q',12).replace('K',13));
        return temp;
    }).sort((a, b) => {
        return b[0] - a[0];
    });
}
    
function getRank (handArr) {
    let freqOfValues = frequenciesOfValues (handArr);
    let freqOfSuits = frequenciesOfSuits (handArr);
    let longestincreasingSequ = getLongestIncreasingSequ (handArr);
    
    if(longestincreasingSequ == 5 && freqOfSuits[0][1] == 5)
        return PokerRank.StraightFlush;
    
    if(freqOfValues[0][1] == 4)
        return PokerRank.FourOfKind;
    
    if(freqOfValues[0][1] == 3 && freqOfValues[1][1] == 2) 
        return PokerRank.FullHouse;
    
    if(freqOfSuits[0][1] == 5)
        return PokerRank.Flush;
    
    if(longestincreasingSequ == 5 && freqOfSuits.length > 1)
        return PokerRank.Straight;
    
    if(freqOfValues[0][1] == 3 && freqOfValues[1][1] != 2) 
        return PokerRank.ThreeOfKind;
    
    if(freqOfValues[0][1] == 2 && freqOfValues[1][1] == 2)
        return PokerRank.TwoPairs;
    
    if(freqOfValues[0][1] == 2 && freqOfValues[1][1] != 2)
        return PokerRank.OnePair;
    
    return PokerRank.HighCard;
}
    
function frequenciesOfValues (arr) {
    let etolon = [], result = [];
    for(let i = 0; i < 14; i++)
        etolon.push(i + 1);
    
    etolon.forEach( item => {
        result.push([item, arr.filter(x => x[0] === item).length])
    });
    
    return result.filter(item => item[1] !== 0).sort((a, b) => { return b[1] - a[1] });
}
    
function frequenciesOfSuits (arr) {
    let etolon = ['♣','♦','♥','♠'], result = [];
    
    etolon.forEach( item => {
        result.push([item, arr.filter(x => x[1] === item).length])
    });
    
    return result.filter(item => item[1] !== 0).sort((a, b) => { return b[1] - a[1] });;
}
    
function getLongestIncreasingSequ (arr){
    let freqArr = []
    
    for(let j = 0; j < arr.length - 2; j++) {
        let count = 1;
        
        for(let i = j; i < arr.length - 1; i++) {
            if(arr[i][0] - arr[i + 1][0] === 1)
                count++;
            if(i == arr.length - 2 || arr[i][0] - arr[i + 1][0] !== 1){
                freqArr.push(count);
                break;
            }
        }
    }
    
    return Math.max(...freqArr);
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let figureArr = figure.split('\n').map(item => {
        return item.split('');
    });
    let pointsArr = [];

    figureArr.forEach((item, i) => {
        item.forEach((subitem, j) => {
            if(subitem === '+')
                pointsArr.push({x: j, y: i}); 
        });
    });

    while(pointsArr.length > 0) {
        let currentPoint = pointsArr.shift();

        let leftNeig = pointsArr.filter(item => item.y === currentPoint.y);
        let bottomNeig = pointsArr.filter(item => item.x === currentPoint.x);

        let needToStop = false;
        for(let i = 0; i < bottomNeig.length; i++) 
            for(let j = 0; j < leftNeig.length; j++) 
                if(isFigure(figureArr, currentPoint, leftNeig[j], bottomNeig[i]) && !needToStop) {             
                    yield getFigure(currentPoint, leftNeig[j], bottomNeig[i]);
                    needToStop = true;
                }
    }
}

function isFigure (figureArr, lefTopP, rightTopP, leftBottomP) {
    for(let i = lefTopP.x; i <= rightTopP.x; i++) {
        if(figureArr[lefTopP.y][i] === ' ' || figureArr[leftBottomP.y][i] === ' ')
            return false;
    }

    for(let i = lefTopP.y; i <= leftBottomP.y; i++) {
        if(figureArr[i][lefTopP.x] === ' ' || figureArr[i][rightTopP.x] === ' ')
            return false;
    }

    return true;
}

function getFigure (lefTopP, rightTopP, leftBottomP) {
    let width = rightTopP.x - lefTopP.x - 1;
    let height = leftBottomP.y - lefTopP.y - 1;

    return '+' + '-'.repeat(width) + '+\n' +
        ('|' + ' '.repeat(width) + '|\n').repeat(height) +
        '+' + '-'.repeat(width) + '+\n';
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
