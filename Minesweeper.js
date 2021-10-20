class Minesweeper {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
		this.subsize = 2;
		if (this.w + this.h == 5) this.subsize = 3;
		if (this.w + this.h == 6) this.subsize = 4;
        this.size = w * h;
		console.log(this.size);
		console.log(this.subsize);

        this.grid;
        this.visibility = [...Array(this.size * this.subsize)].map(e => Array(this.size * this.subsize));
        this.flagged = [...Array(this.size * this.subsize)].map(e => Array(this.size * this.subsize));
        this.exploded = false;
    }

    setMines(sudoku) {

        let grid = [...Array(this.size * this.subsize)].map(e => Array(8));

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                let mines = this.createMines(sudoku[i][j]);
				console.log(mines);
                grid = this.placeMines(grid, mines, i, j);
            }
        }
        grid = this.getClues(grid);

        this.grid = grid;
    }

    createMines(n) {

        n -= 1; // modded for 0-8 instead of 1-9

        let places = [];

        for (let i = 0; i < this.subsize * this.subsize; i++) {

            if (i < n) {
                places.push('⁕');

            } else {
                places.push('');
            }
        }
        return shuffle(places);
    }

    placeMines(grid, mines, x, y) {

        for (let i = 0; i < this.subsize; i++) {
            for (let j = 0; j < this.subsize; j++) {

                const x2 = x * this.subsize + i;
                const y2 = y * this.subsize + j;

                grid[x2][y2] = mines[j * this.subsize + i];
            }
        }
        return grid;
    }

    getClues(grid) {

        for (let i = 0; i < this.size * this.subsize; i++) {
            for (let j = 0; j < this.size * this.subsize; j++) {

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
                if (i < 0 || i >= this.size * this.subsize || j < 0 || j >= this.size * this.subsize) {
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

        const cellSize = 60 / this.subsize;

        for (let i = 0; i < this.size * this.subsize; i++) {
            for (let j = 0; j < this.size * this.subsize; j++) {

                const x = i * cellSize;
                const y = j * 60 / this.subsize;
				const number = this.grid[i][j];

                if (this.visibility[i][j] && !(this.flagged[i][j] && number == '⁕')) {
                    fill("#DBEBE9");
                } else {
                    fill(white);
                }
                stroke(dark);
                strokeWeight(1);
                rect(x, y, cellSize, 60 / this.subsize);

                noStroke();
                textAlign(CENTER, CENTER);
                textFont('Fira Code');

                if (number == '⁕') {

                    fill(dark);
                    textSize(cellSize);

                } else {

                    fill(dark);
                    textSize(cellSize * .75);
                }
				if (this.flagged[i][j] && !(this.visibility[i][j] && number != '⁕')) {
					fill(mid);
                    textSize(cellSize * .75);
                    text("?", x + cellSize / 2, y + 60 / this.subsize / 2 + 2);
                } else if (this.visibility[i][j]) {
					if (number == '⁕') {
						text('*', x + cellSize / 2, y + 60 / this.subsize / 2 + 2);
					} else {
						text(number, x + cellSize / 2, y + 60 / this.subsize / 2 + 2);
					}
                }
            }
        }
        this.drawGuidelines(cellSize);
        pop();
    }

    drawGuidelines(cellSize) {

        cellSize *= this.subsize;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                const x = i * cellSize;
                const y = j * cellSize;

                noFill();
                stroke(mid);
                strokeWeight(3);
                rect(x, y, cellSize, cellSize);
            }
        }
        noFill();
        stroke(dark);
        strokeWeight(4);

        rect(0, 0, cellSize * this.size, cellSize * this.size);
        rect(cellSize * this.w, 0, cellSize * this.w, cellSize * this.size);
        rect(0, cellSize * this.h, cellSize * this.size, cellSize * this.h);
    }

    clicked(x, y) {

        x -= this.x;
        y -= this.y;

        let cellSize = 60/this.subsize;

        for (let i = 0; i < this.size * this.subsize; i++) {
            for (let j = 0; j < this.size * this.subsize; j++) {

                if (x > i * cellSize && x < i * cellSize + cellSize) {
                    if (y > j * 60 / this.subsize && y < j * 60 / this.subsize + 60 / this.subsize) {

                        if (startTime == "") {
                            startTime = new Date();
                            startTime = startTime.getTime();
                        }
                        if (mouseButton == LEFT && !this.flagged[i][j]) {

                            if (this.grid[i][j] == "⁕") {
                                this.explode();
                            } else if (this.grid[i][j] == "") {
                                this.visibility[i][j] = true;
                                this.freeNeighbours(i, j);
                            } else {
                                this.visibility[i][j] = true;
                            }
                        } else if (mouseButton != LEFT && !this.visibility[i][j]) {
                            this.flagged[i][j] = !this.flagged[i][j];
                        }
                        if (mouseButton == LEFT) {
                            this.chord(i, j);
                        }
                    }
                }
            }
        }
    }

    explode() {

        for (let i = 0; i < this.size * this.subsize; i++) {
            for (let j = 0; j < this.size * this.subsize; j++) {

                this.visibility[i][j] = true;
                this.exploded = true;
            }
        }
    }

    freeNeighbours(x, y) {

        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {

                if (i == x && j == y) {
                    continue;
                } else if (i < 0 || j < 0 || i >= this.size * this.subsize || j >= this.size * this.subsize) {
                    continue;
                }
                if (!this.visibility[i][j]) {
                    this.visibility[i][j] = true;

                    if (this.grid[i][j] == "") {
                        this.freeNeighbours(i, j);
                    }
                }
            }
        }
    }

    chord(i, j) {

        if (this.flaggedNeighbours(i, j) == this.grid[i][j]) {
            this.chordNeighbours(i, j);
        }
    }

    flaggedNeighbours(x, y) {

        let neighbours = 0;

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {

                if (i == x && j == y) {
                    continue;
                }
                if (i < 0 || i >= this.size * this.subsize || j < 0 || j >= this.size * this.subsize) {
                    continue;
                }
                if (this.flagged[i][j] && !this.visibility[i][j]) {
                    neighbours += 1;
                }
            }
        }
        return neighbours
    }

    chordNeighbours(x, y) {

        for (let i = x-1; i <= x+1; i++) {
            for (let j = y-1; j <= y+1; j++) {

                if (i >= 0 && j >= 0 && i < this.size * this.subsize && j < this.size * this.subsize) {

                    if (this.flagged[i][j]) {
                        // continue;
                    } else if (this.grid[i][j] == "⁕") {
                        this.explode();
                    } else if (this.grid[i][j] == "") {
                        this.visibility[i][j] = true;
                        this.freeNeighbours(i,j);
                    } else {
                        this.visibility[i][j] = true;
                    }
                }
            }
        }
    }

    validate() {

        if (this.exploded) {
            return false;
        }
        for (let i = 0; i < this.size * this.subsize; i++) {
            for (let j = 0; j < this.size * this.subsize; j++) {

                if (!this.visibility[i][j] && this.grid[i][j] != "⁕") {
                    return false;
                }
            }
        }
        return true;
    }
}
