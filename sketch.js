const white = "#fcfffd";
const light = '#EAF2F1';
const mid = '#64b6ac';
const dark = '#5d737e';

let sudo;
let sweep;

function setup() {

	createCanvas(windowWidth, windowHeight);
	createBackground();

	sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
	sweep.setMines(sudo.grid);

	document.addEventListener('contextmenu', event => event.preventDefault());

	noLoop();
}

function draw() {

	updatePixels();
	sudo.draw();
	sweep.draw();
}

function mousePressed() {

	sweep.clicked(mouseX, mouseY);
	draw();
}

function keyPressed() {

	if (keyCode == 82) {

		sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
		sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
		sweep.setMines(sudo.grid);

		draw();
	}
}

function createBackground() {

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {

			if (random() > 0.5) {
				set(i, j, color("#5E7480"));
			} else {
				set(i, j, color("#5A707A"));
			}
		}
	}
	updatePixels();
}
