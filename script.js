


//potential different puzzles
let puzzlesArray = [[4, "", 7, "", "", 6, 9, 5, "", "", 9, 3, 1, "", 7, "", "", "", 1, "", "", "", "", "", "", "", "", "", 8, "", "", "", 2, "", "", 6, "", "", 4, "", "", "", 5, "", "", 2, "", "", 4, "", "", "", 1, "", "", "", "", "", "", "", "", "", 7, "", "", "", 8, "", 1, 4, 9, "", "", 5, 2, 7, "", "", 1, "", 3],
["", "", 5, 6, "", 3, "", "", "", "", "", 1, "", "", "", 6, "", 8, "", 2, "", "", 1, "", "", "", "", 3, "", "", "", "", "", 2, "", "", "", "", 6, 8, 9, 5, 1, "", "", "", "", 8, "", "", "", "", "", 6, "", "", "", "", 8, "", "", 2, "", 4, "", 9, "", "", "", 7, "", "", "", "", "", 9, "", 7, 8, "", ""],
["", 1, 3, "", 2, "", "", "", "", "", 2, "", "", "", 7, "", 1, 6, "", "", "", 4, "", "", 7, "", "", "", "", 2, "", "", 3, "", "", 7, 8, "", 4, "", "", 9, "", 5, "", "", "", "", 2, "", "", "", "", "", 3, 4, "", "", 9, "", "", "", 8, "", 6, 7, "", "", "", "", "", 4, 2, "", 9, "", 1, 4, "", "", ""],
[1, "", "", "", "", "", "", "", 9, 2, "", "", 6, 5, 7, "", "", "", "", "", 5, 9, "", "", "", 6, "", 8, "", 1, "", "", "", "", "", 5, "", "", "", 4, 1, 8, "", "", "", 6, "", "", "", "", "", 3, "", 8, "", 7, "", "", "", 2, 1, "", "", "", "", "", 1, 8, 4, "", "", 7, 5, "", "", "", "", "", "", "", 6],
["", 8, 1, 5, 4, "", 6, "", "", "", "", 3, 7, "", "", 5, 9, "", "", "", "", "", "", 6, "", 1, "", "", "", "", "", "", "", 4, 5, "", "", 5, "", "", 9, "", "", 2, "", "", 2, 4, "", "", "", "", "", "", "", 7, "", 4, "", "", "", "", "", "", 1, 6, "", "", 2, 7, "", "", "", "", 5, "", 6, 7, 9, 8, ""],
["", 6, "", 9, "", 3, 2, 4, "", "", "", 9, "", "", "", 6, "", "", 8, "", "", 5, 2, "", "", "", "", "", "", "", "", "", 1, 4, "", 7, "", 8, 1, "", "", "", 5, 9, 6, 4, "", 6, "", "", "", "", "", "", "", "", 8, "", 6, 2, "", "", 3, "", "", 4, "", "", "", 8, "", "", "", 1, 3, "", "", 9, "", 6, ""],
[8, "", "", "", "", "", "", "", "", "", "", 3, 6, "", "", "", "", "", "", 7, "", "", 9, "", 2, "", "", "", 5, "", "", "", 7, "", "", "", "", "", "", "", 4, 5, 7, "", "", "", "", "", 1, "", "", "", 3, "", "", "", 1, "", "", "", "", 6, 8, "", "", 8, 5, "", "", "", 1, "", "", 9, "", "", "", "", 4, "", ""]]
let puzzleList = document.getElementsByClassName("puzzleList")[0]
let initialGrid = puzzlesArray[0]

let solutionGrid//updated when cells are solved
let presentedGrid; //updated when user inputs guesses or if cells solved
let cellData, currentlyClickedPuzzleId;


let buttonListOne = document.getElementsByClassName("buttonListOne")[0]
let buttonListTwo = document.getElementsByClassName("buttonListTwo")[0]

//create the html list of different sudokus
for (let i = 0; i < puzzlesArray.length; i++) {
    let puzzleListItem = document.createElement("li")
    puzzleListItem.className = "puzzleListItem"
    puzzleListItem.id = `sudoku${i + 1}`
    if (i + 1 == 1) {
        currentlyClickedPuzzleId = puzzleListItem.id;
        puzzleListItem.style.background = "dodgerblue"
    }
    puzzleListItem.innerText = `Sudoku ${i + 1}`
    puzzleList.appendChild(puzzleListItem)
    puzzleListItem.addEventListener("click", () => {
        if (writingCustom) {
            buttonListTwo.style.display = ""
            buttonListOne.style.display = "block"
        }
        currentlyClickedPuzzleId = puzzleListItem.id
        initialGrid = puzzlesArray[i]
        initialise()
        for (let child of puzzleList.children) {
            if (child == puzzleListItem) {
                child.style.background = "dodgerblue"
            }
            else {
                child.style.background = ""
            }
        }
    })
}


function initialise() {
    solutionGrid = initialGrid.slice()
    presentedGrid = initialGrid.slice() //update currentlyEnterValues when a different sudoku is selected or we click on customgrid
    cellData = updateCellData()
    updateOverallCandidatesPerX()
    if (findSolution()) {
        solutionFound = true
        updateGridOnHtml()
    } else {
        throw new Error("Solution not found during initialisation")
    }

}



function getGridValue(row, column, grid = solutionGrid) {

    let index = column + 9 * row
    let gridValue = grid[index]
    return gridValue
}


function updateGridOnHtml() {
    let container = document.getElementsByClassName("container")[0]

    Array.from(container.children).forEach(child => {
        if (child.className == "gridDiv") {
            container.removeChild(child)
        }
    })
    let gridDiv = document.createElement("div")
    gridDiv.className = "gridDiv"

    container.insertBefore(gridDiv, container.children[0])
    for (let row = 0; row <= 8; row++) {
        let lineDiv = document.createElement("div")
        lineDiv.className = "lineDiv"
        gridDiv.appendChild(lineDiv)
        for (let column = 0; column <= 8; column++) {

            let inputBox = document.createElement("input")
            inputBox.className = "numberInput"
            inputBox.id = `input${column + 9 * row}`
            inputBox.type = "textbox"
            inputBox.value = getGridValue(row, column, presentedGrid);
            if (inputBox.value == "") {
                inputBox.className = "unsolvedInput"
            } else {
                if (inputBox.value == getGridValue(row, column)) {
                    inputBox.className = "solvedInput"
                } else {
                    inputBox.className = "incorrectInput"

                }
            }


            inputBox.addEventListener("input", (event) => {

                if (requiredNumbers.includes(Number(event.data))) {
                    inputBox.value = event.data
                    presentedGrid[column + 9 * row] = Number(event.data)
                    document.getElementById(`input${(column + 9 * row) + 1}`).focus()
                } else {
                    presentedGrid[column + 9 * row] = ""
                    inputBox.value = ""
                }
                inputBox.className = "unsolvedInput"

            })


            inputBox.addEventListener("keydown", (event) => {
                if (event.key == "ArrowRight") {
                    let nextInputBox
                    if ((column + 9 * row < 80)) {
                        nextInputBox = document.getElementById(`input${(column + 9 * row) + 1}`)
                    } else {
                        nextInputBox = document.getElementById(`input0`)
                    }
                    nextInputBox.focus()
                    event.preventDefault()
                }
                if (event.key == "ArrowLeft") {
                    let nextInputBox
                    if ((column + 9 * row > 0)) {
                        nextInputBox = document.getElementById(`input${(column + 9 * row) - 1}`)
                    } else {
                        nextInputBox = document.getElementById(`input80`)
                    }
                    nextInputBox.focus()
                    event.preventDefault()
                }
                if (event.key == "ArrowUp") {
                    let nextInputBox
                    if ((row > 0)) {
                        nextInputBox = document.getElementById(`input${(column + 9 * (row - 1))}`)
                    } else {
                        nextInputBox = document.getElementById(`input${(column + 9 * (8))}`)
                    }
                    nextInputBox.focus()
                    event.preventDefault()
                }
                if (event.key == "ArrowDown") {
                    let nextInputBox
                    if ((row < 8)) {
                        nextInputBox = document.getElementById(`input${(column + 9 * (row + 1))}`)
                    } else {
                        nextInputBox = document.getElementById(`input${(column + 9 * (0))}`)
                    }
                    nextInputBox.focus()
                    event.preventDefault()
                }
                if (event.key == "Backspace") {
                    inputBox.value = ""
                    inputBox.dispatchEvent(new Event("input"))
                    event.preventDefault()
                }

            })

            if ([2, 5].includes(column)) {
                inputBox.style.borderRight = "2px solid black"
            }

            lineDiv.appendChild(inputBox)

        }

        if ([0, 3, 6].includes(row)) {
            lineDiv.className = "lineDivTop"
        } else if (row == 8) {
            lineDiv.className = "lineDivBottom"
        } else {
            lineDiv.className = "lineDivMiddle"
        }
    }
}


function getRowX(rowNumber, grid = solutionGrid) {
    return grid.slice(rowNumber * 9, rowNumber * 9 + 9)
}

function getColumnX(columnNumber, grid = solutionGrid) {
    let columnX = []
    for (r = 0; r < 9; r++) {
        columnX.push(getGridValue(r, columnNumber, grid))
    }
    return columnX
}


function getBoxX(boxNumber, grid = solutionGrid) {
    let boxX = [], boxRange;
    if (boxNumber == 0) {
        boxRange = [0, 1, 2, 9, 10, 11, 18, 19, 20]
    }
    else if (boxNumber == 1) {
        boxRange = [3, 4, 5, 12, 13, 14, 21, 22, 23]
    }
    else if (boxNumber == 2) {
        boxRange = [6, 7, 8, 15, 16, 17, 24, 25, 26]
    }
    else if (boxNumber == 3) {
        boxRange = [27, 28, 29, 36, 37, 38, 45, 46, 47]
    }
    else if (boxNumber == 4) {
        boxRange = [30, 31, 32, 39, 40, 41, 48, 49, 50]
    }
    else if (boxNumber == 5) {
        boxRange = [33, 34, 35, 42, 43, 44, 51, 52, 53]
    }
    else if (boxNumber == 6) {
        boxRange = [54, 55, 56, 63, 64, 65, 72, 73, 74]
    }
    else if (boxNumber == 7) {
        boxRange = [57, 58, 59, 66, 67, 68, 75, 76, 77]
    }
    else if (boxNumber == 8) {
        boxRange = [60, 61, 62, 69, 70, 71, 78, 79, 80]
    }
    for (let br of boxRange) {
        boxX.push(grid[br])
    }
    return boxX
}



let requiredNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let overallCandidatesPerBox = {}, overallCandidatesPerRow = {}, overallCandidatesPerColumn = {}
let solutionFound = false


initialise()


function soleCandidates() {
    let found = false
    for (let i = 0; i < cellData.length; i++) {
        let cell = cellData[i]
        if (cell.candidates.length == 1) {
            console.log(`cell ${cell.cellNo} has the sole candidate ${cell.candidates[0]}`)
            solutionGrid[cell.cellNo] = cell.candidates[0]
            cellData = updateCellData()
            updateOverallCandidatesPerX()
            found = true
        }
        if (cellData.findIndex(element => element.candidates.length == 0) != -1) {
            throw new Error("zero candidates")
        }


    }
    return found
}

function uniqueCandidates() {
    //check boxes
    let found = false
    for (let bn = 0; bn < 9; bn++) {
        for (let [candidate, placement] of Object.entries(overallCandidatesPerBox[bn])) {
            candidate = Number(candidate)
            if (placement.cellNos.length == 1) {

                let cellIndex = cellData.findIndex((element) => element.cellNo == placement.cellNos[0])
                if (cellIndex == -1) {
                    console.log(overallCandidatesPerBox[bn])
                    console.log(placement.cellNos[0], candidate, cellData)
                }
                console.log(`Cell ${cellData[cellIndex].cellNo} has a unique candidate ${candidate}. (by looking at candidatesPerBox)`)
                solutionGrid[cellData[cellIndex].cellNo] = candidate
                cellData = updateCellData()
                found = true
            }
        }
        updateOverallCandidatesPerX()
    }
    //check rows
    for (let rn = 0; rn < 9; rn++) {
        for (let [candidate, placement] of Object.entries(overallCandidatesPerRow[rn])) {
            candidate = Number(candidate)
            if (placement.cellNos.length == 1) {
                let cellIndex = cellData.findIndex((element) => element.cellNo == placement.cellNos[0])
                console.log(`${cellData[cellIndex].cellNo} has a unique candidate ${candidate}. (by looking at candidatesPerRow)`)
                solutionGrid[cellData[cellIndex].cellNo] = candidate
                cellData = updateCellData()
                found = true

            }
        }
        updateOverallCandidatesPerX()
    }
    //check columns
    for (let cn = 0; cn < 9; cn++) {
        for (let [candidate, placement] of Object.entries(overallCandidatesPerColumn[cn])) {
            candidate = Number(candidate)
            if (placement.cellNos.length == 1) {
                let cellIndex = cellData.findIndex((element) => element.cellNo == placement.cellNos[0])
                console.log(`${cellData[cellIndex].cellNo} has a unique candidate ${candidate}. (by looking at candidatesPerColumn)`)
                solutionGrid[cellData[cellIndex].cellNo] = candidate
                cellData = updateCellData()
                found = true
            }
        }
        updateOverallCandidatesPerX()
    }
    return found
}


//reduce candidates
//box and column/row interaction
function reduceViaBoxColumnRowInteraction() {
    let reduced = false
    for (let bn = 0; bn < 9; bn++) {
        for (let [candidate, placement] of Object.entries(overallCandidatesPerBox[bn])) {
            candidate = Number(candidate)
            if (placement.rows.length == 1) {//look at placement of each candiate for this box. If this candidate can only be placed in one row in this box
                for (let cell of cellData) {
                    if (cell.boxNo != bn && cell.rowNo == placement.rows[0] && cell.candidates.includes(candidate)) {//if there is a cell from the same row but different box whic includes this candidate, then remove this candidate from that cell
                        let temp = Array.from(cell.candidates).slice()
                        let removalIndex = temp.indexOf(candidate)
                        temp.splice(removalIndex, 1)
                        console.log(`cell ${cell.cellNo} candidates reduced from  ${cell.candidates} to ${temp} via box/row interaction`)
                        cell.candidates = temp
                        reduced = true
                        updateOverallCandidatesPerX()
                    }
                }
            }
            if (placement.columns.length == 1) {
                for (let cell of cellData) {
                    if (cell.boxNo != bn && cell.columnNo == placement.columns[0] && cell.candidates.includes(candidate)) {
                        let temp = Array.from(cell.candidates).slice()
                        let removalIndex = temp.indexOf(candidate)
                        temp.splice(removalIndex, 1)
                        console.log(`cell ${cell.cellNo} candidates reduced from  ${cell.candidates} to ${temp} via box/column interaction`)
                        cell.candidates = temp
                        reduced = true
                        updateOverallCandidatesPerX()
                    }
                }
            }
        }
    }
    return reduced
}


function reduceViaBoxBoxInteraction() {
    //block/block interaction
    //if two boxes share the same two rows for where a candidate can go, the third block can remove this candidate from these two rows (same for cols)
    let reduced = false;
    for (let bn1 = 0; bn1 < 9; bn1++) {
        for (let bn2 = 0; bn2 < 9; bn2++) {
            if (bn1 == bn2) {
                continue
            }
            for (let [candidate1, placement1] of Object.entries(overallCandidatesPerBox[bn1])) {
                candidate1 = Number(candidate1);
                for (let [candidate2, placement2] of Object.entries(overallCandidatesPerBox[bn2])) {
                    candidate2 = Number(candidate2)
                    if (candidate1 == candidate2 && placement1.rows.length == 2 && placement2.rows.length == 2) {
                        let row1Str = JSON.stringify(Array.from(placement1.rows).sort())
                        let row2Str = JSON.stringify(Array.from(placement2.rows).sort())
                        if (row1Str == row2Str) {
                            //find cells on these two rows from boxes which aren't boxNumber1 or boxNumber2. if they contain candidate1, then remove it
                            for (let cell of cellData) {
                                if (cell.boxNo == bn1 || cell.boxNo == bn2) {
                                    continue
                                }
                                if (!placement1.rows.includes(cell.rowNo)) {
                                    continue
                                }
                                if (cell.candidates.includes(candidate1)) {
                                    let temp = Array.from(cell.candidates).slice()
                                    let removalIndex = temp.indexOf(candidate1)
                                    temp.splice(removalIndex, 1)
                                    console.log(`cell ${cell.cellNo} candidates reduced from  ${cell.candidates} to ${temp} via box/box interaction`)
                                    cell.candidates = temp;
                                    reduced = true
                                    updateOverallCandidatesPerX()
                                }
                            }
                        }
                    }
                    if (candidate1 == candidate2 && placement1.columns.length == 2 && placement2.columns.length == 2) {
                        let column1Str = JSON.stringify(Array.from(placement1.columns).sort())
                        let column2Str = JSON.stringify(Array.from(placement2.columns).sort())
                        if (column1Str == column2Str) {
                            //find cells on these two rows from boxes which aren't boxNumber1 or boxNumber2. if they contain candidate1, then remove it
                            for (let cell of cellData) {
                                if (cell.boxNo == bn1 || cell.boxNo == bn2) {
                                    continue
                                }
                                if (!placement1.columns.includes(cell.columnNo)) {
                                    continue
                                }

                                if (cell.candidates.includes(candidate1)) {
                                    let temp = Array.from(cell.candidates).slice()
                                    let removalIndex = temp.indexOf(candidate1)
                                    temp.splice(removalIndex, 1)
                                    console.log(`cell ${cell.cellNo} candidates reduced from  ${cell.candidates} to ${temp} via box/box interaction`)
                                    cell.candidates = temp;
                                    reduced = true;
                                    updateOverallCandidatesPerX()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return reduced
}

//reduce via naked subset two candidates
function reduceViaNakedSubsetTwoCandidates() {
    //look at each cell's candidates
    //if the cell has two candidates, check if any of the competing cells on the same row have only the same two candidates
    //if so, remove these two candidates from other cells on the same row. do the same for column and box
    let reduced = false
    for (let cell1 of cellData) {
        if (cell1.candidates.length == 2) {
            let candidates1Str = JSON.stringify(Array.from(cell1.candidates).sort())
            //check competitors on row first
            for (let competitorOnRow of cell1.competingCells.onSameRow) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitorOnRow && cell2.candidates.length == 2) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            //two cells (cell1 and cell2) on the same row have the same two candidates. This means all other cells on this row can remove this candidate
                            for (let cell3 of cellData) {
                                if (cell3.cellNo != cell1.cellNo && cell3.cellNo != cell2.cellNo && cell3.rowNo == cell1.rowNo) {
                                    for (let candidateToRemove of cell1.candidates) {
                                        if (cell3.candidates.includes(candidateToRemove)) {
                                            let temp = Array.from(cell3.candidates).slice()
                                            let removalIndex = temp.indexOf(candidateToRemove)
                                            temp.splice(removalIndex, 1)
                                            console.log(`cell ${cell3.cellNo} candidates reduced from ${cell3.candidates} to ${temp} (naked subset)`)
                                            console.log(`this is because ${cell1.cellNo} and ${cell2.cellNo} only have the candidates ${candidates1Str} (naked subset) `)
                                            cell3.candidates = temp;
                                            reduced = true
                                            updateOverallCandidatesPerX()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let competitorOnColumn of cell1.competingCells.onSameColumn) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitorOnColumn && cell2.candidates.length == 2) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            //two cells (cell1 and cell2) on the same column have the same two candidates. This means all other cells on this column can remove this candidate
                            for (let cell3 of cellData) {
                                if (cell3.cellNo != cell1.cellNo && cell3.cellNo != cell2.cellNo && cell3.columnNo == cell1.columnNo) {
                                    for (let candidateToRemove of cell1.candidates) {
                                        if (cell3.candidates.includes(candidateToRemove)) {
                                            let temp = Array.from(cell3.candidates).slice()
                                            let removalIndex = temp.indexOf(candidateToRemove)
                                            temp.splice(removalIndex, 1)
                                            console.log(`cell ${cell3.cellNo} candidates reduced from ${cell3.candidates} to ${temp} (naked subset)`)
                                            console.log(`this is because ${cell1.cellNo} and ${cell2.cellNo} only have the candidates ${candidates1Str} (naked subset) `)

                                            cell3.candidates = temp;
                                            reduced = true
                                            updateOverallCandidatesPerX()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let competitorOnBox of cell1.competingCells.onSameBox) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitorOnBox && cell2.candidates.length == 2) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            //two cells (cell1 and cell2) on the same box have the same two candidates. This means all other cells on this box can remove this candidate
                            for (let cell3 of cellData) {
                                if (cell3.cellNo != cell1.cellNo && cell3.cellNo != cell2.cellNo && cell3.boxNo == cell1.boxNo) {
                                    for (let candidateToRemove of cell1.candidates) {
                                        if (cell3.candidates.includes(candidateToRemove)) {
                                            let temp = Array.from(cell3.candidates).slice()
                                            let removalIndex = temp.indexOf(candidateToRemove)
                                            temp.splice(removalIndex, 1)
                                            console.log(`cell ${cell3.cellNo} candidates reduced from ${cell3.candidates} to ${temp} (naked subset)`)
                                            console.log(cellData)
                                            cell3.candidates = temp;
                                            reduced = true
                                            updateOverallCandidatesPerX()

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return reduced;
}

//naked subset 3 candidates


function reduceViaNakedSubsetThreeCandidates() {
    let reduced = false
    for (let cell1 of cellData) {
        if (cell1.candidates.length == 3) {
            let candidates1Str = JSON.stringify(Array.from(cell1.candidates).sort())
            //check competitors on row first
            for (let competitor1OnRow of cell1.competingCells.onSameRow) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitor1OnRow && cell2.candidates.length == 3) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            for (let competitor2OnRow of cell1.competingCells.onSameRow) {
                                if (competitor2OnRow == competitor1OnRow) {
                                    continue
                                }
                                for (let cell3 of cellData) {
                                    if (cell3.cellNo == competitor2OnRow && cell3.candidates.length == 3) {
                                        let candidates3Str = JSON.stringify(Array.from(cell3.candidates).sort())
                                        if (candidates1Str == candidates3Str) {
                                            //all 3 cells have only 3 candidates and these 3 candidates are all the same
                                            //other cells on this row can remove these three candidates
                                            for (let cell4 of cellData) {
                                                if (cell4.rowNo == cell1.rowNo && cell4.cellNo != cell1.cellNo && cell4.cellNo != cell2.cellNo && cell4.cellNo != cell3.cellNo) {
                                                    for (let candidateToRemove of cell1.candidates) {
                                                        if (cell4.candidates.includes(candidateToRemove)) {
                                                            let temp = Array.from(cell4.candidates).slice()
                                                            let removalIndex = temp.indexOf(candidateToRemove)
                                                            temp.splice(removalIndex, 1)
                                                            console.log(`cell ${cell4.cellNo} candidates reduced from ${cell4.candidates} to ${temp} (naked subset, triple)`)
                                                            cell4.candidates = temp
                                                            reduced = true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let competitor1OnColumn of cell1.competingCells.onSameColumn) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitor1OnColumn && cell2.candidates.length == 3) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            for (let competitor2OnColumn of cell1.competingCells.onSameColumn) {
                                if (competitor2OnColumn == competitor1OnColumn) {
                                    continue
                                }
                                for (let cell3 of cellData) {
                                    if (cell3.cellNo == competitor2OnColumn && cell3.candidates.length == 3) {
                                        let candidates3Str = JSON.stringify(Array.from(cell3.candidates).sort())
                                        if (candidates1Str == candidates3Str) {
                                            //all 3 cells have only 3 candidates and these 3 candidates are all the same
                                            //other cells on this column can remove these three candidates
                                            for (let cell4 of cellData) {
                                                if (cell4.columnNo == cell1.columnNo && cell4.cellNo != cell1.cellNo && cell4.cellNo != cell2.cellNo && cell4.cellNo != cell3.cellNo) {
                                                    for (let candidateToRemove of cell1.candidates) {
                                                        if (cell4.candidates.includes(candidateToRemove)) {
                                                            let temp = Array.from(cell4.candidates).slice()
                                                            let removalIndex = temp.indexOf(candidateToRemove)
                                                            temp.splice(removalIndex, 1)
                                                            console.log(`cell ${cell4.cellNo} candidates reduced from ${cell4.candidates} to ${temp} (naked subset, triple)`)
                                                            cell4.candidates = temp
                                                            reduced = true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let competitor1OnBox of cell1.competingCells.onSameBox) {
                for (let cell2 of cellData) {
                    if (cell2.cellNo == competitor1OnBox && cell2.candidates.length == 3) {
                        let candidates2Str = JSON.stringify(Array.from(cell2.candidates).sort())
                        if (candidates1Str == candidates2Str) {
                            for (let competitor2OnBox of cell1.competingCells.onSameBox) {
                                if (competitor2OnBox == competitor1OnBox) {
                                    continue
                                }
                                for (let cell3 of cellData) {
                                    if (cell3.cellNo == competitor2OnBox && cell3.candidates.length == 3) {
                                        let candidates3Str = JSON.stringify(Array.from(cell3.candidates).sort())
                                        if (candidates1Str == candidates3Str) {
                                            //all 3 cells have only 3 candidates and these 3 candidates are all the same
                                            //other cells on this box can remove these three candidates
                                            for (let cell4 of cellData) {
                                                if (cell4.boxNo == cell1.boxNo && cell4.cellNo != cell1.cellNo && cell4.cellNo != cell2.cellNo && cell4.cellNo != cell3.cellNo) {
                                                    for (let candidateToRemove of cell1.candidates) {
                                                        if (cell4.candidates.includes(candidateToRemove)) {
                                                            let temp = Array.from(cell4.candidates).slice()
                                                            let removalIndex = temp.indexOf(candidateToRemove)
                                                            temp.splice(removalIndex, 1)
                                                            console.log(`cell ${cell4.cellNo} candidates reduced from ${cell4.candidates} to ${temp} (naked subset, triple)`)
                                                            cell4.candidates = temp;
                                                            reduced = true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    updateOverallCandidatesPerX()
    return reduced
}

//hidden subset pair
function reduceViaHiddenSubsetPair() {
    let reduced = false
    //box
    for (let bn = 0; bn < 9; bn++) {
        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerBox[bn])) {
            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 2) {
                continue //only looking at hidden subset pairs here
            }
            let cellNos1 = JSON.stringify(placement1.cellNos.sort())
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerBox[bn])) {
                candidate2 = Number(candidate2)
                if (placement2.cellNos.length != 2 || candidate1 == candidate2) {
                    continue //only looking at hidden subset pairs here
                }
                let cellNos2 = JSON.stringify(placement2.cellNos.sort())
                if (cellNos1 == cellNos2) {
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)
                        if (cellData[ix].candidates.length > 2) {
                            console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${[candidate1, candidate2]}. Hidden subset pairs in box ${bn} `)
                            cellData[ix].candidates = [candidate1, candidate2]
                            reduced = true;
                            updateOverallCandidatesPerX()
                        }
                    }
                }
            }
        }
    }

    //row
    for (let rn = 0; rn < 9; rn++) {
        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerRow[rn])) {
            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 2) {
                continue //only looking at hidden subset pairs here
            }
            let cellNos1 = JSON.stringify(placement1.cellNos.sort())
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerRow[rn])) {
                candidate2 = Number(candidate2)
                if (placement2.cellNos.length != 2 || candidate1 == candidate2) {
                    continue //only looking at hidden subset pairs here
                }
                let cellNos2 = JSON.stringify(placement2.cellNos.sort())
                if (cellNos1 == cellNos2) {
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)
                        if (cellData[ix].candidates.length > 2) {
                            console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${[candidate1, candidate2]}. Hidden subset pairs in row ${rn} `)
                            cellData[ix].candidates = [candidate1, candidate2]
                            reduced = true
                            updateOverallCandidatesPerX()
                        }
                    }
                }
            }
        }
    }

    //column

    for (let cn = 0; cn < 9; cn++) {
        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerColumn[cn])) {
            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 2) {
                continue //only looking at hidden subset pairs here
            }
            let cellNos1 = JSON.stringify(placement1.cellNos.sort())
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerColumn[cn])) {
                candidate2 = Number(candidate2)
                if (placement2.cellNos.length != 2 || candidate1 == candidate2) {
                    continue //only looking at hidden subset pairs here
                }
                let cellNos2 = JSON.stringify(placement2.cellNos.sort())
                if (cellNos1 == cellNos2) {
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)
                        if (cellData[ix].candidates.length > 2) {
                            console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${[candidate1, candidate2]}. Hidden subset pairs in column ${cn} `)
                            cellData[ix].candidates = [candidate1, candidate2]
                            reduced = true
                            updateOverallCandidatesPerX()
                        }
                    }
                }
            }
        }
    }
    return reduced
}

function reduceViaHiddenSubsetTriple() {
    let reduced = false
    //box
    for (let bn = 0; bn < 9; bn++) {  //loop through each box
        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerBox[bn])) {
            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 3) {
                continue //only looking at hidden subset triples here
            }
            loop2:
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerBox[bn])) {
                candidate2 = Number(candidate2)
                if ((placement2.cellNos.length != 2 && placement2.cellNos.length != 3) || candidate1 == candidate2) { //candidate should only be able to be placed in 2 or 3 cells
                    continue
                }

                //check if candidate2 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                for (let c2 of placement2.cellNos) {
                    if (Array.from(placement1.cellNos).includes(c2)) {
                        continue
                    }
                    else {
                        continue loop2;
                    }
                }

                loop3:
                for (let [candidate3, placement3] of Object.entries(overallCandidatesPerBox[bn])) {
                    candidate3 = Number(candidate3)
                    if ((placement3.cellNos.length != 2 && placement3.cellNos.length != 3) || candidate1 == candidate3 || candidate2 == candidate3) { //candidate should only be able to be placed in 2 or 3 cells
                        continue
                    }
                    //check if candidate3 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                    for (let c3 of placement3.cellNos) {
                        if (Array.from(placement1.cellNos).includes(c3)) {
                            continue
                        } else {
                            continue loop3
                        }
                    }
                    let shouldntIncludeCandidates = requiredNumbers.slice()
                    for (let rc of [candidate1, candidate2, candidate3]) {
                        if (shouldntIncludeCandidates.includes(rc)) {
                            let removalIndex = shouldntIncludeCandidates.indexOf(rc)
                            shouldntIncludeCandidates.splice(removalIndex, 1)
                        }
                    }
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)
                        for (let si of shouldntIncludeCandidates) {
                            if (cellData[ix].candidates.includes(si)) {
                                let temp = cellData[ix].candidates.slice()
                                let removalIndex = cellData[ix].candidates.indexOf(si)
                                temp.splice(removalIndex, 1)

                                console.log(`looking at box ${bn}`)
                                console.log(`candidate 1: ${candidate1}. It can only be placed in three cells: ${placement1.cellNos}`)
                                console.log(`candidate 2: ${candidate2}. It can only be placed in 2 or 3 cells, ${placement2.cellNos}, `)
                                console.log(`candidate 3: ${candidate3}. It can only be placed in 2 or 3 cells, ${placement3.cellNos}`)
                                console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${temp}. Hidden subset in box ${bn} (triple) `)
                                cellData[ix].candidates = temp
                                reduced = true
                                updateOverallCandidatesPerX()
                            }
                        }
                    }

                }
            }
        }
    }

    //row

    for (let rn = 0; rn < 9; rn++) {

        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerRow[rn])) {

            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 3) {
                continue //only looking at hidden subset triples here
            }
            loop2:
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerRow[rn])) {
                candidate2 = Number(candidate2)
                if ((placement2.cellNos.length != 2 && placement2.cellNos.length != 3) || candidate1 == candidate2) { //candidate should only be able to be placed in 2 or 3 cells
                    continue
                }
                //check if candidate2 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                for (let c2 of placement2.cellNos) {
                    if (Array.from(placement1.cellNos).includes(c2)) {
                        continue
                    } else {
                        continue loop2
                    }
                }
                loop3:
                for (let [candidate3, placement3] of Object.entries(overallCandidatesPerRow[rn])) {
                    candidate3 = Number(candidate3)
                    if ((placement3.cellNos.length != 2 && placement3.cellNos.length != 3) || candidate1 == candidate3 || candidate2 == candidate3) { //candidate should only be able to be placed in 2 or 3 cells
                        continue
                    }
                    //check if candidate3 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                    for (let c3 of placement3.cellNos) {
                        if (Array.from(placement1.cellNos).includes(c3)) {
                            continue
                        } else {
                            continue loop3
                        }
                    }
                    let shouldntIncludeCandidates = requiredNumbers.slice()
                    for (let rc of [candidate1, candidate2, candidate3]) {
                        if (shouldntIncludeCandidates.includes(rc)) {
                            let removalIndex = shouldntIncludeCandidates.indexOf(rc)
                            shouldntIncludeCandidates.splice(removalIndex, 1)
                        }
                    }
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)

                        for (let si of shouldntIncludeCandidates) {
                            if (cellData[ix].candidates.includes(si)) {

                                let temp = cellData[ix].candidates.slice()
                                let removalIndex = cellData[ix].candidates.indexOf(si)
                                temp.splice(removalIndex, 1)
                                console.log(`looking at row ${rn}`)
                                console.log(`candidate 1: ${candidate1}`)
                                console.log(`candidate 1, ${candidate1}, can only be placed in three cells: ${placement1.cellNos}`)
                                console.log(`candidate 2: ${candidate2}, can only be placed in 2 or 3 cells, ${placement2.cellNos}, `)
                                console.log(`candidate 3, ${candidate3}, can only be placed in 2 or 3 cells, ${placement3.cellNos}`)
                                console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${temp}. Hidden subset in row ${rn} (triple).`)
                                cellData[ix].candidates = temp
                                reduced = true
                                updateOverallCandidatesPerX()
                            }
                        }
                    }

                }
            }
        }
    }

    //column

    for (let cn = 0; cn < 9; cn++) {
        for (let [candidate1, placement1] of Object.entries(overallCandidatesPerColumn[cn])) {

            candidate1 = Number(candidate1)
            if (placement1.cellNos.length != 3) {
                continue //only looking at hidden subset triples here
            }
            loop2:
            for (let [candidate2, placement2] of Object.entries(overallCandidatesPerColumn[cn])) {
                candidate2 = Number(candidate2)
                if ((placement2.cellNos.length != 2 && placement2.cellNos.length != 3) || candidate1 == candidate2) { //candidate should only be able to be placed in 2 or 3 cells
                    continue
                }
                //check if candidate2 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                for (let c2 of placement2.cellNos) {
                    if (Array.from(placement1.cellNos).includes(c2)) {
                        continue
                    } else {
                        continue loop2
                    }
                }
                loop3:
                for (let [candidate3, placement3] of Object.entries(overallCandidatesPerColumn[cn])) {
                    candidate3 = Number(candidate3)
                    if ((placement3.cellNos.length != 2 && placement3.cellNos.length != 3) || candidate1 == candidate3 || candidate2 == candidate3) { //candidate should only be able to be placed in 2 or 3 cells
                        continue
                    }
                    //check if candidate3 can be placed in same 3 cells as candidate1 (or a subset of those 3)
                    for (let c3 of placement3.cellNos) {
                        if (Array.from(placement1.cellNos).includes(c3)) {
                            continue
                        } else {
                            continue loop3
                        }
                    }
                    let shouldntIncludeCandidates = requiredNumbers.slice()
                    for (let rc of [candidate1, candidate2, candidate3]) {
                        if (shouldntIncludeCandidates.includes(rc)) {
                            let removalIndex = shouldntIncludeCandidates.indexOf(rc)
                            shouldntIncludeCandidates.splice(removalIndex, 1)
                        }
                    }
                    for (let pi of placement1.cellNos) {
                        let ix = cellData.findIndex((element) => element.cellNo == pi)
                        for (let si of shouldntIncludeCandidates) {
                            if (cellData[ix].candidates.includes(si)) {
                                let temp = cellData[ix].candidates.slice()
                                let removalIndex = cellData[ix].candidates.indexOf(si)
                                temp.splice(removalIndex, 1)
                                console.log(`looking at column ${cn}`)
                                console.log(`candidate 1: ${candidate1}`)
                                console.log(`candidate 1, ${candidate1}, can only be placed in three cells: ${placement1.cellNos}`)
                                console.log(`candidate 2: ${candidate2}, can only be placed in 2 or 3 cells, ${placement2.cellNos}, `)
                                console.log(`candidate 3, ${candidate3}, can only be placed in 2 or 3 cells, ${placement3.cellNos}`)
                                console.log(`candidates for ${cellData[ix].cellNo} reduced from ${cellData[ix].candidates} to ${temp}. Hidden subset in column ${cn} (triple).`)


                                cellData[ix].candidates = temp
                                reduced = true
                                updateOverallCandidatesPerX()
                            }
                        }
                    }

                }
            }
        }
    }
    return reduced
}
function reduceViaXWing() {
    let reduced = false
    //look at each row, if there is a cell which has a candidate and another cell in a different box has the same candidate
    for (let cell1 of cellData) {
        loop2:
        for (let cell2 of cellData) {
            if (cell2.boxNo != cell1.boxNo && cell1.rowNo == cell2.rowNo && cell1 != cell2) {//same row different box
                for (let candidate2 of cell2.candidates) {
                    if (cell1.candidates.includes(candidate2)) {

                        loop3:
                        for (let cell3 of cellData) {
                            if (cell1.boxNo != cell3.boxNo && cell1.columnNo == cell3.columnNo && cell1 != cell3 && cell2 != cell3) {//same column different box
                                for (let candidate3 of cell3.candidates) {
                                    if (cell1.candidates.includes(candidate3) && cell2.candidates.includes(candidate3)) {
                                        loop4:
                                        for (let cell4 of cellData) {
                                            if (cell2.boxNo != cell4.boxNo && cell2.columnNo == cell4.columnNo && cell3.rowNo == cell4.rowNo && cell1 != cell4 && cell2 != cell4 && cell3 != cell4) {
                                                for (let candidate4 of cell4.candidates) {
                                                    if (cell1.candidates.includes(candidate4) && cell2.candidates.includes(candidate4) && cell3.candidates.includes(candidate4)) {
                                                        //look at overallCandidatesPerRow[cell1.rowNo][candidate4].columns
                                                        if (overallCandidatesPerRow[cell1.rowNo][candidate4].columns.length == 2) {
                                                            if (JSON.stringify(Array.from(overallCandidatesPerRow[cell1.rowNo][candidate4].columns).sort()) == JSON.stringify(Array.from(overallCandidatesPerRow[cell3.rowNo][candidate4].columns).sort())) {
                                                                //above checks both arrays are the same
                                                                for (let cell5 of cellData) {
                                                                    if (overallCandidatesPerRow[cell1.rowNo][candidate4].columns.includes(cell5.columnNo) && cell5.rowNo != cell1.rowNo && cell5.rowNo != cell3.rowNo && cell5.candidates.includes(candidate4)) {
                                                                        console.log(`for rows ${cell1.rowNo}, ${cell3.rowNo}- the two columns ${overallCandidatesPerRow[cell1.rowNo][candidate4].columns} are such that all cells with candidate ${candidate4} in both rows are contained in the columns. So, any cells with candidate ${candidate4} on these columns but different rows can remove this as a candidate XWING`)
                                                                        console.log(`remove ${candidate4} from cell ${cell5.cellNo} XWING`)
                                                                        let temp = Array.from(cell5.candidates).slice()
                                                                        let removalIndex = temp.indexOf(candidate4)
                                                                        temp.splice(removalIndex, 1)
                                                                        cell5.candidates = temp
                                                                        reduced = true
                                                                        updateOverallCandidatesPerX()
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (overallCandidatesPerColumn[cell1.columnNo][candidate4].rows.length == 2) {
                                                            if (JSON.stringify(Array.from(overallCandidatesPerColumn[cell1.columnNo][candidate4].rows).sort()) == JSON.stringify(Array.from(overallCandidatesPerColumn[cell2.columnNo][candidate4].rows).sort())) {
                                                                //above checks both arrays are the same
                                                                for (let cell5 of cellData) {
                                                                    if (overallCandidatesPerColumn[cell2.columnNo][candidate4].rows.includes(cell5.rowNo) && cell5.columnNo != cell1.columnNo && cell5.columnNo != cell2.columnNo && cell5.candidates.includes(candidate4)) {
                                                                        console.log(`for columns ${cell1.columnNo}, ${cell2.columnNo}- the two rows ${overallCandidatesPerColumn[cell2.columnNo][candidate4].rows} are such that all cells with candidate ${candidate4} in both columns are contained in the rows. So, any cells with candidate ${candidate4} on these rows but different columns can remove this as a candidate XWING`)
                                                                        console.log(`remove ${candidate4} as a candidate from cell ${cell5.cellNo} XWING`)
                                                                        let temp = Array.from(cell5.candidates).slice()
                                                                        let removalIndex = temp.indexOf(candidate4)
                                                                        temp.splice(removalIndex, 1)
                                                                        cell5.candidates = temp
                                                                        reduced = true
                                                                        updateOverallCandidatesPerX()
                                                                    }
                                                                }

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return reduced
}



function checkIfSolved() {
    let solved = false

    for (let i = 0; i < 9; i++) {
        let currentRowX = getRowX(i)
        let currentColumnX = getColumnX(i)
        let currentBoxX = getBoxX(i)
        if (JSON.stringify(currentRowX.sort()) == JSON.stringify(requiredNumbers) && JSON.stringify(currentColumnX.sort()) == JSON.stringify(requiredNumbers) && JSON.stringify(currentBoxX.sort()) == JSON.stringify(requiredNumbers)) {
            solved = true
        } else {
            solved = false
            return solved
        }
    }
    return solved
}
function findSolution() {


    try {
        findSolutionsViaLogic()
    } catch (e) {//catch any "zero candidate errors"
        console.log(e.message)
        return false

    }
    if (checkIfSolved()) {
        return true
    }
    console.log("not solved using logic, so trying a brute force method")

    let emptyCell = cellData[cellData.findIndex(cd => cd.cellNo == solutionGrid.findIndex(element => element == ""))]

    for (let candidate of emptyCell.candidates) {
        let copyupdatedGrid = solutionGrid.slice()

        solutionGrid[emptyCell.cellNo] = candidate
        updateCellData()
        updateOverallCandidatesPerX()
        console.log(`empty cell is ${emptyCell.cellNo}. Trying candidate ${candidate}`)
        let result = findSolution()

        if (result) {
            return true
        } else {
            console.log(`Candidate ${candidate} not suitable for cell ${emptyCell.cellNo}`)
            solutionGrid = copyupdatedGrid.slice();
            updateCellData()
            updateOverallCandidatesPerX()
        }
    }
    return false
}

function findSolutionsViaLogic() {

    if (soleCandidates()) {
        return findSolutionsViaLogic()
    }

    if (uniqueCandidates()) {
        return findSolutionsViaLogic()
    }

    if (reduceViaBoxColumnRowInteraction()) {
        return findSolutionsViaLogic()
    }

    if (reduceViaBoxBoxInteraction()) {
        return findSolutionsViaLogic()
    }
    if (reduceViaNakedSubsetTwoCandidates()) {
        return findSolutionsViaLogic()
    }
    if (reduceViaNakedSubsetThreeCandidates()) {
        return findSolutionsViaLogic()
    }

    if (reduceViaHiddenSubsetPair()) {
        return findSolutionsViaLogic()
    }

    if (reduceViaHiddenSubsetTriple()) {
        return findSolutionsViaLogic()
    }
    if (reduceViaXWing()) {
        return findSolutionsViaLogic()
    }

}





function updateCellData() {
    cellData = []
    for (let index = 0; index < solutionGrid.length; index++) {
        if (solutionGrid[index] != "") {
            continue
        }
        let cellNo = index, rowNo = Math.floor((index) / 9), columnNo = (index) % 9, boxNo
        let boxRange = [0, 1, 2, 9, 10, 11, 18, 19, 20]
        if (boxRange.includes(cellNo)) {
            boxNo = 0
        }
        else {
            boxRange = [3, 4, 5, 12, 13, 14, 21, 22, 23]
            if (boxRange.includes(cellNo)) {
                boxNo = 1
            }
            else {
                boxRange = [6, 7, 8, 15, 16, 17, 24, 25, 26]
                if (boxRange.includes(cellNo)) {
                    boxNo = 2
                }
                else {
                    boxRange = [27, 28, 29, 36, 37, 38, 45, 46, 47]
                    if (boxRange.includes(cellNo)) {
                        boxNo = 3
                    }
                    else {
                        boxRange = [30, 31, 32, 39, 40, 41, 48, 49, 50]
                        if (boxRange.includes(cellNo)) {
                            boxNo = 4
                        }
                        else {
                            boxRange = [33, 34, 35, 42, 43, 44, 51, 52, 53]
                            if (boxRange.includes(cellNo)) {
                                boxNo = 5
                            }
                            else {
                                boxRange = [54, 55, 56, 63, 64, 65, 72, 73, 74]
                                if (boxRange.includes(cellNo)) {
                                    boxNo = 6
                                }
                                else {
                                    boxRange = [57, 58, 59, 66, 67, 68, 75, 76, 77]
                                    if (boxRange.includes(cellNo)) {
                                        boxNo = 7
                                    }
                                    else {
                                        boxRange = [60, 61, 62, 69, 70, 71, 78, 79, 80]
                                        if (boxRange.includes(cellNo)) {
                                            boxNo = 8
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        cellDataObj = { cellNo, rowNo, columnNo, boxNo, boxRange, candidates: [], competingCells: { onSameRow: [], onSameColumn: [], onSameBox: [] } }
        cellData.push(cellDataObj)

    }

    //below for loop calculates candidates and competing cells for each cell
    for (let cell of cellData) {

        let entireRow = getRowX(cell.rowNo)
        let entireColumn = getColumnX(cell.columnNo)
        let entireBox = getBoxX(cell.boxNo)

        for (let requiredNumber of requiredNumbers) {
            if (!entireRow.includes(requiredNumber) && !entireColumn.includes(requiredNumber) && !entireBox.includes(requiredNumber)) {
                cell.candidates.push(requiredNumber)
            }
        }

        let cell1 = cell
        for (let cell2 of cellData) {
            if (cell1 != cell2) {
                if (cell2.rowNo == cell1.rowNo) {
                    cell1.competingCells.onSameRow.push(cell2.cellNo)
                }
                if (cell2.columnNo == cell1.columnNo) {
                    cell1.competingCells.onSameColumn.push(cell2.cellNo)
                }
                if (cell2.boxNo == cell1.boxNo) {
                    cell1.competingCells.onSameBox.push(cell2.cellNo)
                }
            }
        }
    }

    return cellData
}




//work out the potential candiates per row, column, and box
function updateOverallCandidatesPerX() {
    for (let bn = 0; bn < 9; bn++) {
        let candidatesPerBox = {}
        for (let cell of cellData) {

            if (cell.boxNo != bn) {
                continue
            }
            for (let candidate of cell.candidates) {
                if (!(candidate in candidatesPerBox)) {
                    candidatesPerBox[candidate] = { rows: [], columns: [], cellNos: [] }
                }
                if (!candidatesPerBox[candidate].rows.includes(cell.rowNo)) {
                    candidatesPerBox[candidate].rows.push(cell.rowNo)
                }
                if (!candidatesPerBox[candidate].columns.includes(cell.columnNo)) {
                    candidatesPerBox[candidate].columns.push(cell.columnNo)
                }
                candidatesPerBox[candidate].cellNos.push(cell.cellNo)
            }
        }
        overallCandidatesPerBox[bn] = candidatesPerBox
    }
    for (let rn = 0; rn < 9; rn++) {
        let candidatesPerRow = {}
        for (let cell of cellData) {
            if (cell.rowNo != rn) {
                continue
            }
            for (let candidate of cell.candidates) {
                if (!(candidate in candidatesPerRow)) {
                    candidatesPerRow[candidate] = { boxes: [], cellNos: [], columns: [] }
                }
                if (!candidatesPerRow[candidate].boxes.includes(cell.boxNo)) {
                    candidatesPerRow[candidate].boxes.push(cell.boxNo)
                }
                if (!candidatesPerRow[candidate].columns.includes(cell.columnNo)) {
                    candidatesPerRow[candidate].columns.push(cell.columnNo)
                }
                candidatesPerRow[candidate].cellNos.push(cell.cellNo)
            }
        }
        overallCandidatesPerRow[rn] = candidatesPerRow
    }

    for (let cn = 0; cn < 9; cn++) {
        let candidatesPerColumn = {}
        for (let cell of cellData) {
            if (cell.columnNo != cn) {
                continue
            }
            for (let candidate of cell.candidates) {
                if (!(candidate in candidatesPerColumn)) {
                    candidatesPerColumn[candidate] = { boxes: [], cellNos: [], rows: [] }
                }
                if (!candidatesPerColumn[candidate].boxes.includes(cell.boxNo)) {
                    candidatesPerColumn[candidate].boxes.push(cell.boxNo)
                }
                if (!candidatesPerColumn[candidate].rows.includes(cell.rowNo)) {
                    candidatesPerColumn[candidate].rows.push(cell.rowNo)
                }
                candidatesPerColumn[candidate].cellNos.push(cell.cellNo)
            }
        }
        overallCandidatesPerColumn[cn] = candidatesPerColumn
    }
}


let solveButton = document.getElementById("solveButton")
let checkProgressButton = document.getElementById("checkProgressButton")
let solveSingleButton = document.getElementById("solveSingleButton")
let customSudokuButton = document.getElementById("customSudokuButton")
solveButton.addEventListener("click", (event) => {


    if (solutionFound) {
        console.log("Sudoku solved")
        presentedGrid = solutionGrid.slice()
        return updateGridOnHtml()
    } else {
        alert("Sudoku unsolved")
    }

})
checkProgressButton.addEventListener("click", checkProgress)
function checkProgress() {
    //

    if (solutionFound) {
        updateGridOnHtml()

    } else {
        alert("Sudoku unsolvable")
    }

}

solveSingleButton.addEventListener("click", (eventA) => {
    solveSingleButton.style.fontWeight = "bold"
    solveSingleButton.style.background = "aquamarine"//"rgb(211, 6, 6)"
    solveSingleButton.style.color = "black"//"rgb(211, 6, 6)"

    eventA.stopPropagation()
    document.removeEventListener("mousedown", solveOneCell) //this prevents multiple event listeners from forming if solvesinglebutton clicked multiple times
    document.addEventListener("mousedown", solveOneCell)

})

function solveOneCell(event) {
    if (event.target.id.search(/input\d+/) != -1) {
        if (solutionFound) {
            let cellNumber = event.target.id.match(/input(\d+)/)[1]
            presentedGrid[cellNumber] = solutionGrid[cellNumber]
            updateGridOnHtml()
            event.preventDefault()
        } else {
            alert("Sudoku unsolvable")
        }
    }

    solveSingleButton.style = ""
    document.removeEventListener("mousedown", solveOneCell)
}
let writingCustom = false; //boolean to indicate whether we are using an existing puzzle or writing a custom puzzle
let oldGrid, oldPuzzleId
customSudokuButton.addEventListener("click", () => {
    writingCustom = true
    oldGrid = initialGrid.slice(), oldPuzzleId = currentlyClickedPuzzleId
    currentlyClickedPuzzleId = null;
    initialGrid = new Array(81).fill("")
    presentedGrid = initialGrid.slice()
    updateGridOnHtml()

    buttonListOne.style.display = "none"
    buttonListTwo.style.display = "block"


    for (let child of puzzleList.children) {
        child.style.background = ""
    }



})


doneButton.addEventListener("click", () => {
    try {
        let inputNumberCount = 0
        for (let n of presentedGrid) {
            if (requiredNumbers.includes(n)) {
                inputNumberCount++
            }
        }
        if (inputNumberCount < 17) {
            throw new Error("Minimum 17 Digits Required")
        }
        initialGrid = presentedGrid.slice()
        checkIfGridValid()
        initialise()
        buttonListTwo.style.display = ""
        buttonListOne.style.display = "block"
    } catch (e) {
        alert(e.message)

    }
})


let cancelButton = document.getElementById("cancelButton")
cancelButton.addEventListener("click", () => {
    buttonListTwo.style.display = ""
    buttonListOne.style.display = "block"
    initialGrid = oldGrid.slice()
    currentlyClickedPuzzleId = oldPuzzleId
    if (currentlyClickedPuzzleId != null) {
        document.getElementById(currentlyClickedPuzzleId).dispatchEvent(new Event("click"))
    }
    initialise()

})

function checkIfGridValid(grid = presentedGrid) {
    for (let n = 0; n < 9; n++) {
        let thisBox = getBoxX(n, grid)
        let thisRow = getRowX(n, grid)
        let thisColumn = getColumnX(n, grid)
        let conflictError = new Error("Sudoku has conflicts")
        for (let requiredNumber of requiredNumbers) {
            let countB = 0, countR = 0, countC = 0
            for (let digit of thisBox) {
                if (digit == requiredNumber) {
                    countB++
                    if (countB > 1) {
                        throw conflictError
                    }
                }
            }
            for (let digit of thisRow) {
                if (digit == requiredNumber) {
                    countR++
                    if (countR > 1) {
                        throw conflictError
                    }
                }
            }
            for (let digit of thisColumn) {
                if (digit == requiredNumber) {
                    countC++
                    if (countC > 1) {
                        throw conflictError
                    }
                }
            }
        }
    }
    return true
}

//console.log(" https://www.kristanix.com/sudokuepic/sudoku-solving-techniques.php. ")
