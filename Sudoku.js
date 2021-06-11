class Sudoku {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        const grid = [...Array(4)].map(e => Array(4));
        const position = 0;
        const current = round(random(1, 4));

        this.grid = this.findPath(grid, position, current);
        this.visibility = [...Array(4)].map(e => Array(4));
        this.guess= [...Array(4)].map(e => Array(4));
        this.hint = [...Array(4)].map(e => Array(4));

        this.hide();
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

                fill(white);
                stroke(mid);
                strokeWeight(3);
                rect(x, y, cellSize, cellSize);

                fill(dark);
                noStroke();
                textSize(cellSize / 2);
                textAlign(CENTER, CENTER);
                textFont('Fira Code');

                let number;

                if (this.hint[i][j]) {
                    number = this.hint[i][j];
                    fill(dark);
                } else {
                    number = this.guess[i][j];
                    fill(mid);
                }
                number -= 1; // modded for 0-3 instead of 1-4
                if (number == -1) {
                    number = "";
                }
                text(number, x + cellSize / 2, y + cellSize / 2 + 1);
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

    hide() {

        let rand = shuffle([0, 0, 0, -1]);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                this.guess[i][j] = 0;

                if (this.grid[i][j] == 1 && rand[i] == 0) {
                    this.hint[i][j] = 1;
                    this.guess[i][j] = 1;
                }
            }
        }
    }

    clicked(x, y) {

        x -= this.x;
        y -= this.y;

        let cellSize = 60;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                if (x > i * cellSize && x < i * cellSize + cellSize) {
                    if (y > j * cellSize && y < j * cellSize + cellSize) {

                        if (!this.hint[i][j]) {

                            this.guess[i][j] += 1;

                            if (this.guess[i][j] == 5) {
                                this.guess[i][j] = 0;
                            }
                        }
                    }
                }
            }
        }
    }

    validate() {

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                if (this.grid[i][j] != this.guess[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

}
