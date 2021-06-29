class Sudoku {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.size = w * h;

        const grid = [...Array(this.size)].map(e => Array(this.size));
        const position = 0;
        const current = round(random(1, this.size));

        this.grid = this.findPath(grid, position, current);
        this.visibility = [...Array(this.size)].map(e => Array(this.size));
        this.guess= [...Array(this.size)].map(e => Array(this.size));
        this.hint = [...Array(this.size)].map(e => Array(this.size));

        this.hide();

        console.log(this.grid);
    }

    findPath(grid, position, current) {

        if (position == this.size * this.size) {
            return grid;
        }
        if (this.conflict(grid, position, current)) {
            return false;
        }
        const x = this.getColumn(position);
        const y = this.getRow(position);
        grid[x][y] = current;

        position++;

        let options;

        if (this.size == 4) {
            options = [1, 2, 3, 4];
        } else if (this.size == 6) {
            options = [1, 2, 3, 4, 5, 6];
        } else if (this.size == 9){
            options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
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

        for (let i = 0; i < this.size; i++) {

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
        x = floor(x / this.w);
        y = floor(y / this.h);

        return y * this.h + x;
    }

    getColumn(position) {
        return position % this.size;
    }

    getRow(position) {
        return floor(position / this.size);
    }

    draw() {

        push();
        translate(this.x, this.y);

        const cellSize = 60;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

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
                number -= 1; // modded for 0-3 instead of 1-this.size
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

        rect(0, 0, cellSize * this.size, cellSize * this.size);
        rect(cellSize * this.w, 0, cellSize * this.w, cellSize * this.size);
        rect(0, cellSize * this.h, cellSize * this.size, cellSize * this.h);
    }

    hide() {

        let arr;

        if (this.size == 4) {
            arr = [0, 0, 0, -1];
        } else if (this.size == 6) {
            arr = [0, 0, 0, 0, 0, -1];
        } else if (this.size == 9) {
            arr = [0, 0, 0, 0, 0, 0, 0, 0, -1];
        }
        let rand = shuffle(arr);

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

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

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                if (x > i * cellSize && x < i * cellSize + cellSize) {
                    if (y > j * cellSize && y < j * cellSize + cellSize) {

                        if (startTime == "") {
                            startTime = new Date();
                            startTime = startTime.getTime();
                        }

                        let max;

                        if (this.size == 4) {
                            max = 5;
                        } else if (this.size == 6) {
                            max = 7;
                        } else if (this.size == 9) {
                            max = 10;
                        }
                        if (!this.hint[i][j] && mouseButton == LEFT) {

                            this.guess[i][j] += 1;


                            if (this.guess[i][j] == max) {
                                this.guess[i][j] = 0;
                            }
                        } else if (!this.hint[i][j]) {

                            this.guess[i][j] -= 1;

                            if (this.guess[i][j] == -1) {
                                this.guess[i][j] = max - 1;
                            }
                        }
                    }
                }
            }
        }
    }

    validate() {

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                if (this.grid[i][j] != this.guess[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}
