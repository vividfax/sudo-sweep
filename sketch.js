const light = '#fcfffd';
const mid = '#64b6ac';
const dark = '#5d737e';

function setup() {

	createCanvas(windowWidth, windowHeight);

	background(dark);

	let sudo = new Sudoku();
	let sweep = new Minesweeper();
	sweep.setMines(sudo.grid);

	sudo.draw();
	sweep.draw();

	noLoop();
}

function draw() {

}
