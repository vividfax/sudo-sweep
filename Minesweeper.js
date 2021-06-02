class Minesweeper {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.grid;
        this.visibility = [...Array(8)].map(e => Array(8));
        this.flagged = [...Array(8)].map(e => Array(8));
    }

    setMines(sudoku) {

        let grid = [...Array(8)].map(e => Array(8));

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                let mines = this.getMines(sudoku[i][j]);
                grid = this.placeMines(grid, mines, i, j);
            }
        }
        grid = this.getClues(grid);

        this.grid = grid;
    }

    getMines(n) {

        n -= 1; // modded for 0-8 instead of 1-4

        let places = [];

        for (let i = 0; i < 4; i++) {

            if (i < n) {
                places.push('⁕');

            } else {
                places.push('');
            }
        }
        return shuffle(places);
    }

    placeMines(grid, mines, x, y) {

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {

                const x2 = x * 2 + i;
                const y2 = y * 2 + j;

                grid[x2][y2] = mines[j * 2 + i];
            }
        }
        return grid;
    }

    getClues(grid) {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

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
                if (i < 0 || i >= 8 || j < 0 || j >= 8) {
                    continue;
                }
                if (grid[i][j] == '⁕') {
                    neighbours += 1;
                }
            }
        }
        return neighbours;
    }

    draw(x, y) {

        push();
        translate(this.x, this.y);

        const cellSize = 45/2;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                if (this.visibility[i][j]) {
                    fill(light);
                } else {
                    fill(white);
                }
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
                if (this.visibility[i][j]) {
                    text(number, x + cellSize / 2, y + cellSize / 2 + 1);
                } else if (this.flagged[i][j]) {

                    fill(dark);
                    textSize(cellSize * .75);
                    text("?", x + cellSize / 2, y + cellSize / 2 + 1);
                }
            }
        }
        this.drawGuidelines(cellSize);
        pop();
    }

    drawGuidelines(cellSize) {

        cellSize *= 2;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

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

        rect(0, 0, cellSize * 4, cellSize * 4);
        rect(cellSize * 2, 0, cellSize * 2, cellSize * 4);
        rect(0, cellSize * 2, cellSize * 4, cellSize * 2);
    }

    clicked(x, y) {

        x -= this.x;
        y -= this.y;

        let cellSize = 45/2;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                if (x > i * cellSize && x < i * cellSize + cellSize) {
                    if (y > j * cellSize && y < j * cellSize + cellSize) {

                        if (mouseButton == LEFT && !this.flagged[i][j]) {

                            if (this.grid[i][j] == "⁕") {
                                this.explode();
                            } else if (this.grid[i][j] == "") {
                                this.visibility[i][j] = true;
                                this.freeNeighbours(i, j);
                            } else {
                                this.visibility[i][j] = true;
                            }
                        } else if (mouseButton != LEFT) {
                            this.flagged[i][j] = !this.flagged[i][j];
                        }
                    }
                }
            }
        }
    }

    explode() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                this.visibility[i][j] = true;
            }
        }
    }

    freeNeighbours(x, y) {

        for (let i = x-1; i <= x+1; i++) {

            for (let j = y-1; j <= y+1; j++) {

                if (i >= 0 && j >= 0) {
                    if (i != x || j != y) {
                            if (this.grid[i][j] == "" && !this.visibility[i][j]) {
                                this.freeNeighbours(i, j);
                            }
                        }
                    this.visibility[i][j] = true;
                }
            }
        }
    }

    flag() {

    }
}