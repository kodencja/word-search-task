class WordSearch {
    constructor(letterGrid, searchDirectionsArr, findMultiPos = 0) {
      // array of strings that represent your letter grid
      this.letterGrid = letterGrid;
      this.searchDirectionsArr = searchDirectionsArr;
    this.findMultiPos = findMultiPos;
    }

    getObjKeyValue(obj) {
        return obj[Object.keys(obj)[0]];
      };
      
      getObjPropValue(obj, prop) {
        return obj[prop];
      };
      
      getObjKeyAsNumber(obj) {
        return Number(Object.keys(obj)[0]);
      };
      
      getObjKey(obj) {
        return Object.keys(obj)[0];
      };
  
    // 1)
    find(wordsArray) {
        // const that = this;

        const arrForAllWordsAllLetters = this.getArrAllLettersRowsColsForAllWords(wordsArray);
      
        // arrForAllWordsAllLettersObjKeys - e.g. ['basic', 'java']
        const arrForAllWordsAllLettersObjKeys = Object.keys(arrForAllWordsAllLetters);
      
        return arrForAllWordsAllLettersObjKeys.reduce((total, nextWord) => {
          const nextWordLettersPosArr = this.getObjPropValue(
            arrForAllWordsAllLetters,
            nextWord
          ); // e.g. Array(5) for 'basic'
      
          // nextWordStartEndPos - e.g. {start: [ [3,1], [5,9] ], end: [ [3,5], [9,9] ] }
          const nextWordStartEndPos = this.findEachWordPos(nextWordLettersPosArr);
      
          return {
            ...total,
            [nextWord]: { ...(total[nextWord] || {}), ...nextWordStartEndPos },
          };
        }, {});
      };

      // 2)
getArrAllLettersRowsColsForAllWords(words) {
    return words.reduce((total, word) => {
      const arrAllLettersRowsColsEachWord =
        this.getArrAllLettersRowsColsForEachWord(word);
  
      return {
        ...total,
        [word]: [...(total[word] || []), ...arrAllLettersRowsColsEachWord],
      };
    }, {});
  };

  // 3)
  getArrAllLettersRowsColsForEachWord(word) {
    return [...word].map((letter, indx) => {
      // occurence of each letter of the word in all rows and columns, grouped in array by rows e.g. {j: Array(6)}  -> [Array(2), Array(1), Array(1), Array(2), Array(1), Array(1)]
      return this.getWordLettersPositionGrid(letter, indx);
    });
  };

  // 4) get search word' letters position (row, col) in letterGrid
getWordLettersPositionGrid(wordLetter, indx){
    // here 'i' means no of row
    return this.letterGrid.reduce((acc, lettersInRowGrid, i) => {
      const wordLettersIndxArrInGrid = this.getWordLettersIndxArrInGrid(
        lettersInRowGrid,
        wordLetter
      );
  
      if (wordLettersIndxArrInGrid.length <= 0) {
        return { ...acc };
      }
  
      const wordPairOfRowColsArrObj = this.getWordPairOfRowColsArrObj(
        wordLettersIndxArrInGrid,
        i
      );
  
      return {
        ...acc,
        [wordLetter]: [...(acc[wordLetter] || []), wordPairOfRowColsArrObj],
      };
    }, {});
  };

  // 5)
getWordLettersIndxArrInGrid(lettersInRowGrid, wordLetter) {
    return [...lettersInRowGrid]
      .map((el, idx) => (el === wordLetter ? idx + 1 : ""))
      .filter((el) => el);
  };


  // 6)
getWordPairOfRowColsArrObj(pairOfRowColsArr, i){
    return pairOfRowColsArr.reduce((prev, next) => {
      return { ...prev, [i + 1]: [...(prev[i + 1] || []), next] };
    }, {});
  };

  // 7)
findEachWordPos(arrForEachWordAllLetters){
    // arrOfFirstLetterOccurence - occurence of word's first letter in letterGrid grouped in arrays by rows no - each grouped array indicates the first letter position in columns e.g. [ {1: Array(2)}, {3: Array(1)}, {5: Array(1)}, {6: Array(2)}, {8: Array(1)}, {9: Array(1)} ]
    const arrOfFirstLetterOccurence = this.getObjKeyValue(arrForEachWordAllLetters[0]);
  
    // arrOfRestLettersOccurence - occurence of word's rest letters (starting from the second one) in letterGrid grouped in arrays by rows no - each object in the array represents a single letter, and within that object a grouped array indicates the that letter position in columns e.g. [ {a: [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] }, {v: [{1: [8]}, {2:[3]}, {3: [10]}, {4: [8]}, {5: [5]}, {6: [4]}, {7: Array(3)}, {8: Array(2)}, {9: Array(2)}},  {a: Array(9)} ]
    const arrOfRestLettersOccurence = arrForEachWordAllLetters.filter(
      (e, i) => i > 0
    );
  
    let findMultiStartEndPositions = true;

    return arrOfFirstLetterOccurence.reduce((acc, firstLetterInEachRow) => {
      // firstLetterInEachRow - e.g. { 1: [6, 10] }  {2: [1] }
  
      const rowNoOf1stLetter = this.getObjKey(firstLetterInEachRow); // e.g. 1, 2, 4
  
      // arrOfFirstLetterPosInOneRow - e.g. [6, 10]
      const arrOfFirstLetterPosInOneRow = firstLetterInEachRow[rowNoOf1stLetter];
  
      // compare consecutive letters' occurence staring from the first one
      const startAndEndArray =
        findMultiStartEndPositions &&
        arrOfFirstLetterPosInOneRow.reduce((total, firstLetterColPos) => {
          const firstLetterRowColPos = [
            Number(rowNoOf1stLetter),
            firstLetterColPos,
          ];
  
          const endArrayPos = this.getEndArray(
            firstLetterRowColPos,
            arrForEachWordAllLetters,
            arrOfRestLettersOccurence
          );
  
          const startArrPos =
            endArrayPos.length <= 1
              ? [firstLetterRowColPos]
              : endArrayPos.map((el) => firstLetterRowColPos);
  
          if (endArrayPos.length <= 0) return { ...total };
  
          return {
            ...total,
            end: [...(total["end"] || []), ...endArrayPos],
            start: [...(total["start"] || []), ...startArrPos],
          };
        }, {});
  
      if (Object.keys(startAndEndArray).length <= 0) return { ...acc };
  
     if(!this.findMultiPos) findMultiStartEndPositions = false;
  
      // if search multi occurence in letterGrid - i.e. findMultiStartEndPositions === true
      if (!findMultiStartEndPositions)
        return {
          ...acc,
          start: [...(acc["start"] || []), ...startAndEndArray.start[0]],
          end: [...(acc["end"] || []), ...startAndEndArray.end[0]],
        };
  
      // if search first word occurence in letterGrid - i.e. findMultiStartEndPositions === false
      return {
        ...acc,
        start: [...(acc["start"] || []), ...startAndEndArray.start],
        end: [...(acc["end"] || []), ...startAndEndArray.end],
      };
    }, {});
  };

  // 8)
getEndArray (
    firstLetterRowColPos,
    arrForEachWordAllLetters,
    arrOfRestLettersOccurence
  ){
    return searchDirectionsArr
      .map((direction, idex) => {
        const endArray = this.searchEndAlongDirection(
          firstLetterRowColPos,
          arrForEachWordAllLetters.length,
          arrOfRestLettersOccurence,
          direction
        );
  
        if (!endArray) return "";
  
        return endArray;
      })
      .filter((el) => el);
  };


  // 9)
searchEndAlongDirection(
    firstLetterRowColPos,
    wordLength,
    arrOfRestLettersOccurence,
    direction
  ) {
    // fitArrayForAllRestLetters - e.g. [ [6, 6], [7, 5], [8, 4] ] consecutive letters position in lettergrid for 'ava' (in word 'java')
    const fitArrayForAllRestLetters = this.getFitArrayPosForAllRestLetters(
      firstLetterRowColPos,
      wordLength,
      arrOfRestLettersOccurence,
      direction
    );
  
    return fitArrayForAllRestLetters.length >= arrOfRestLettersOccurence.length
      ? fitArrayForAllRestLetters[0]
      : undefined;
  };


  // 10)
getFitArrayPosForAllRestLetters(
    firstLetterRowColPos,
    wordLength,
    arrOfRestLettersOccurence,
    direction
  ) {
    let continueSearch = true;
  
    // fitArrayPosForAllRestLetters - e.g.[ [6, 9], [7, 9], [8, 9], [9, 9] ] for 'asic' (for word 'basic')
    const fitArrayPosForAllRestLetters =
      arrOfRestLettersOccurence &&
      arrOfRestLettersOccurence
        .map((singleLetterInAllRowsObj, ind) => {
          // singleLetterInAllRowsObj - e.g. 'a', 'v' or 'a' in word 'java'; {a: Array(8)} or {v: Array(9)}
          // 'ind' indicates the subsiquent letter in the word e.g. ind of 's' = 2, ind of 'h' = 3 in 'csharp' word
  
          if (!continueSearch) {
            return "";
          }
  
          // soughtRowAndColForNextLetter - e.g. [1, 7]
          const soughtRowAndColForNextLetter = this.getSoughtRowAndColForNextLetter(
            firstLetterRowColPos,
            direction,
            wordLength,
            ind
          );
  
          if (soughtRowAndColForNextLetter.length <= 0) return "";
  
          // singleRestLetterPosArrByRowNo - czyli np. na jakich cols w poszczególnych rows występuje litera 'a' (i potem inne) w słowie 'java' np. [ {1: Array(3)}, {2: Array(4)}, {3: [2, 4] }, ... ], gdzie 1, 2, 3,... to numery rows
          const singleRestLetterPosArrByRowNo = this.getObjKeyValue(
            singleLetterInAllRowsObj
          );
  
          // fitArrayPosForSingleRestLetter - [6, 9], [7, 9], [8, 9], [9, 9]
          const fitArrayPosForSingleRestLetter =
            this.getFitArrayPosForSingleRestLetter(
              singleRestLetterPosArrByRowNo,
              soughtRowAndColForNextLetter
            );
  
          if (
            fitArrayPosForSingleRestLetter &&
            fitArrayPosForSingleRestLetter.length <= 0
          ) {
            continueSearch = false;
          }
  
          return fitArrayPosForSingleRestLetter;
        })
        .filter((el) => el && el.length > 0)
        .reverse();
  
    if (fitArrayPosForAllRestLetters.length >= 0) fitArrayPosForAllRestLetters[0];
    return fitArrayPosForAllRestLetters;
  };


  // 11) return an array derived from 'searchPosOfNextLetterForVariousDirections' obj of 'direction' name if exists
getSoughtRowAndColForNextLetter(
    firstLetterRowColPos,
    direction,
    wordLength,
    ind
  ) {
    // directionSearchObj - e.g. { horizontalLeftToRight: Array(2), horizontalRightToLeft: Array(2), verticalTopToBottom: Array(2), verticalBottomToTop: Array(2) }
    const directionSearchObj = this.searchPosOfNextLetterForVariousDirections(
      firstLetterRowColPos,
      wordLength,
      ind,
      this.letterGrid
    );
  
    return directionSearchObj[
      Object.keys(directionSearchObj).filter((el) => el === direction)
    ];
  };


  // 12)
searchPosOfNextLetterForVariousDirections (
    firstLetterRowColPos,
    wordLength,
    ind,
    letterGrid
  ) {
    return {
      horizontalLeftToRight:
        firstLetterRowColPos[1] + wordLength - ind - 1 > letterGrid[0].length
          ? []
          : [firstLetterRowColPos[0], firstLetterRowColPos[1] + ind + 1],
      horizontalRightToLeft:
        firstLetterRowColPos[1] - ind - 1 <= 0
          ? []
          : [firstLetterRowColPos[0], firstLetterRowColPos[1] - ind - 1],
      verticalTopToBottom:
        firstLetterRowColPos[0] + wordLength - ind - 1 > letterGrid.length
          ? []
          : [firstLetterRowColPos[0] + ind + 1, firstLetterRowColPos[1]],
      verticalBottomToTop:
        firstLetterRowColPos[0] - ind - 1 <= 0
          ? []
          : [firstLetterRowColPos[0] - ind - 1, firstLetterRowColPos[1]],
      diagonalTopLeftToBottomRight:
        firstLetterRowColPos[0] + wordLength - ind - 1 > letterGrid.length ||
        firstLetterRowColPos[1] + wordLength - ind - 1 > letterGrid[0].length
          ? []
          : [
              firstLetterRowColPos[0] + ind + 1,
              firstLetterRowColPos[1] + ind + 1,
            ],
      diagonalBottomRightToTopLeft:
        firstLetterRowColPos[0] - ind - 1 <= 0 ||
        firstLetterRowColPos[1] - ind - 1 <= 0
          ? []
          : [
              firstLetterRowColPos[0] - ind - 1,
              firstLetterRowColPos[1] - ind - 1,
            ],
      diagonalTopRightToBottomleft:
        firstLetterRowColPos[0] + wordLength - ind - 1 > letterGrid.length ||
        firstLetterRowColPos[1] - ind - 1 <= 0
          ? []
          : [
              firstLetterRowColPos[0] + ind + 1,
              firstLetterRowColPos[1] - ind - 1,
            ],
      diagonalBottomLeftToTopRight:
        firstLetterRowColPos[1] + wordLength - ind - 1 > letterGrid[0].length
          ? []
          : [
              firstLetterRowColPos[0] - ind - 1,
              firstLetterRowColPos[1] + ind + 1,
            ],
    };
  };


  // 13) so get the following letter position as an array of length '2' - [r, c], where 'r' - number of row, 'c' - number of column
getFitArrayPosForSingleRestLetter (
    singleRestLetterPosArrByRowNo,
    soughtRowAndColForNextLetter
  ) {
    return (
      singleRestLetterPosArrByRowNo &&
      singleRestLetterPosArrByRowNo.reduce((prev, next) => {
        const rowNoOfRestLetter = this.getObjKeyAsNumber(next);
  
        // check if the row number of the rest letter position is different from sought row position (according to searching direction)
        if (rowNoOfRestLetter !== soughtRowAndColForNextLetter[0]) {
          return [...prev];
        }
        const restLetterFitCol = this.getRestLetterFitCol(
          next[rowNoOfRestLetter],
          soughtRowAndColForNextLetter
        );
        if (restLetterFitCol.length <= 0) {
          return [...prev];
        }
        return [rowNoOfRestLetter, ...restLetterFitCol];
      }, [])
    );
  };

  // 14) check if the letter position of a particular letter (from rest letters e.g. 'ava' in 'java' or 'asic' in 'basic') is equal to sought col number (soughtRowAndColForNextLetter[1])
getRestLetterFitCol (
    restLetterPosArrInTheRightRow,
    soughtRowAndColForNextLetter
  ) {
    return (
      restLetterPosArrInTheRightRow &&
      restLetterPosArrInTheRightRow.filter((el) => {
        return soughtRowAndColForNextLetter[1] === el;
      })
    );
  };  

  }
  

  const letterGrid = [
    "*****javaj", // 1
    "avajava***", // 2
    "basiccisab", // 3
    "java**avaj", // 4
    "*a******b*", // 5
    "**v**a**a*", // 6
    "***av***s*", // 7
    "***a****i*", // 8
    "**j*****c*", // 9
  ];
  
  const searchDirectionsArr = [
    "horizontalLeftToRight",
    "horizontalRightToLeft",
    "verticalTopToBottom",
    "verticalBottomToTop",
    "diagonalTopLeftToBottomRight",
    "diagonalBottomRightToTopLeft",
    "diagonalTopRightToBottomleft",
    "diagonalBottomLeftToTopRight",
  ];

  const wordSearchOne = new WordSearch(letterGrid, searchDirectionsArr);
  const wordSearchMulti = new WordSearch(letterGrid, searchDirectionsArr, 1);
  const resultOne_1 = wordSearchOne.find(["java"]);
  const resultOne_2 = wordSearchOne.find(["java", "basic"]);
  const resultOne_3 = wordSearchOne.find(["java", "basic", "vaj"]);
  const resultMulti_1 = wordSearchMulti.find(["java", "basic"]);
  const resultMulti_2 = wordSearchMulti.find(["java", "basic"]);
  const resultMulti_3 = wordSearchMulti.find(["java", "basic", "vaj"]);

  console.log('resultOne_1');
  console.log(resultOne_1);
  console.log('resultOne_2');
  console.log(resultOne_2);
  console.log('resultOne_3');
  console.log(resultOne_3);
  console.log('resultMulti_1');
  console.log(resultMulti_1);
  console.log('resultMulti_2');
  console.log(resultMulti_2);
  console.log('resultMulti_3');
  console.log(resultMulti_3);

