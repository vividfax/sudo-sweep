class Sudoku {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        const grid = [...Array(4)].map(e => Array(4));
        const position = 0;
        const current = round(random(1, 4));

        this.grid = this.findPath(grid, position, current);
        this.visibility = [...Array(4)].map(e => Array(4));
    }

    findPath(grid, position, current) {

        if (position == 16) {
            return grid;
        }
        if (this.conflict(grid, position, current)) {
            return false;
        }
        const x = this.getColumn(position);
        const y = this.getRow(position);
        grid[x][y] = current;

        position++;

        let options = [1, 2, 3, 4];
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

        for (let i = 0; i < 4; i++) {

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
        x = floor(x / 2);
        y = floor(y / 2);

        return y * 2 + x;
    }

    getColumn(position) {
        return position % 4;
    }

    getRow(position) {
        return floor(position / 4);
    }

    draw() {

        push();
        translate(this.x, this.y);

        const cellSize = 60;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                fill(light);
                stroke(mid);
                strokeWeight(3);
                rect(x, y, cellSize, cellSize);

                fill(dark);
                noStroke();
                textSize(cellSize / 2);
                textAlign(CENTER, CENTER);
                textFont('monospace');

                let number = this.grid[i][j];
                number -= 1; // modded for 0-8 instead of 1-4

                text(number, x + cellSize / 2, y + cellSize / 2);
            }
        }
        this.drawGuidelines(cellSize);
        pop();
    }

    drawGuidelines(cellSize) {

        noFill();
        stroke(dark);
        strokeWeight(4);

        rect(0, 0, cellSize * 4, cellSize * 4);
        rect(cellSize * 2, 0, cellSize * 2, cellSize * 4);
        rect(0, cellSize * 2, cellSize * 4, cellSize * 2);
    }
}
