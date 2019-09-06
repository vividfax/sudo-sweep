class Minesweeper {

    constructor() {

        this.grid;
    }

    setMines(sudoku) {

        let grid = [...Array(27)].map(e => Array(27));

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {

                let mines = this.getMines(sudoku[i][j]);
                grid = this.placeMines(grid, mines, i, j);
            }
        }
        grid = this.getClues(grid);

        this.grid = grid;
    }

    getMines(n) {

        n -= 1; // modded for 0-8 instead of 1-9

        let places = [];

        for (let i = 0; i < 9; i++) {

            if (i < n) {
                places.push('⁕');

            } else {
                places.push('');
            }
        }
        return shuffle(places);
    }

    placeMines(grid, mines, x, y) {

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                const x2 = x * 3 + i;
                const y2 = y * 3 + j;

                grid[x2][y2] = mines[j * 3 + i];
            }
        }
        return grid;
    }

    getClues(grid) {

        for (let i = 0; i < 27; i++) {
            for (let j = 0; j < 27; j++) {

                if (grid[i][j] == '⁕') {
                    continue;
                }
                const neighbours = this.getNeighbours(grid, i, j);

                if (neighbours != 0) {
                    grid[i][j] = neighbours;
                }
            }
        }
        return grid;
    }

    getNeighbours(grid, x, y) {

        let neighbours = 0;

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {

                if (i == x && j == y) {
                    continue;
                }
                if (i < 0 || i >= 27 || j < 0 || j >= 27) {
                    continue;
                }
                if (grid[i][j] == '⁕') {
                    neighbours += 1;
                }
            }
        }
        return neighbours;
    }

    draw() {

        translate(500, 0);

        const cellSize = 15;

        for (let i = 0; i < 27; i++) {
            for (let j = 0; j < 27; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                fill(light);
                stroke(mid);
                strokeWeight(1);
                rect(x, y, cellSize, cellSize);

                noStroke();
                textAlign(CENTER, CENTER);
                textFont('monospace');

                const number = this.grid[i][j];

                if (number == '⁕') {

                    fill(dark);
                    textSize(cellSize);

                } else {

                    fill(mid);
                    textSize(cellSize * .75);
                }
                text(number, x + cellSize / 2, y + cellSize / 2);
            }
        }
        this.drawGuidelines(cellSize);
    }

    drawGuidelines(cellSize) {

        cellSize *= 3;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                noFill();
                stroke(dark);
                strokeWeight(1);
                rect(x, y, cellSize, cellSize);
            }
        }
        noFill();
        stroke(dark);
        strokeWeight(2);

        rect(0, 0, cellSize * 9, cellSize * 9);
        rect(cellSize * 3, 0, cellSize * 3, cellSize * 9);
        rect(0, cellSize * 3, cellSize * 9, cellSize * 3);
    }
}
