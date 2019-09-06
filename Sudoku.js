class Sudoku {

    constructor() {

        const grid = [...Array(9)].map(e => Array(9));
        const position = 0;
        const current = round(random(1, 9));

        this.grid = this.findPath(grid, position, current);
    }

    findPath(grid, position, current) {

        if (position == 81) {
            return grid;
        }
        if (this.conflict(grid, position, current)) {
            return false;
        }
        const x = this.getColumn(position);
        const y = this.getRow(position);
        grid[x][y] = current;

        position++;

        let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        options = shuffle(options);

        for (let i = 0; i < options.length; i++) {

            const next = options[i];
            const test = this.findPath(grid, position, next);

            if (test != false) {
                return test;
            }
        }
        grid[x][y] = '';
        return false;
    }

    conflict(grid, position, current) {

        const column = this.getColumn(position);
        const row = this.getRow(position);
        const sector = this.getSector(position);

        for (let i = 0; i < 9; i++) {

            if (grid[column][i] == current || grid[i][row] == current) {
                return true;
            }
        }
        for (let i = 0; i < position; i++) {

            if (sector == this.getSector(i)) {

                const iColumn = this.getColumn(i);
                const iRow = this.getRow(i);

                if (grid[iColumn][iRow] == current) {
                    return true;
                }
            }
        }
        return false;
    }

    getSector(position) {

        let x = this.getColumn(position);
        let y = this.getRow(position);
        x = floor(x / 3);
        y = floor(y / 3);

        return y * 3 + x;
    }

    getColumn(position) {
        return position % 9;
    }

    getRow(position) {
        return floor(position / 9);
    }

    draw() {

        translate(150, 100);

        const cellSize = 45;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                fill(light);
                stroke(mid);
                strokeWeight(1);
                rect(x, y, cellSize, cellSize);

                fill(dark);
                noStroke();
                textSize(cellSize / 2);
                textAlign(CENTER, CENTER);
                textFont('monospace');

                let number = this.grid[i][j];
                number -= 1; // modded for 0-8 instead of 1-9

                text(number, x + cellSize / 2, y + cellSize / 2);
            }
        }
        this.drawGuidelines(cellSize);
    }

    drawGuidelines(cellSize) {

        noFill();
        stroke(dark);
        strokeWeight(2);

        rect(0, 0, cellSize * 9, cellSize * 9);
        rect(cellSize * 3, 0, cellSize * 3, cellSize * 9);
        rect(0, cellSize * 3, cellSize * 9, cellSize * 3);
    }
}
