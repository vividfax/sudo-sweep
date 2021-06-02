const white = "#fcfffd";
const light = '#F2FAF9';
const mid = '#64b6ac';
const dark = '#5d737e';

let sudo;
let sweep;

function setup() {

	createCanvas(windowWidth, windowHeight);

	background(dark);

	sudo = new Sudoku(100, 100);
	sweep = new Minesweeper(350, 100);
	sweep.setMines(sudo.grid);

	document.addEventListener('contextmenu', event => event.preventDefault());
}

function draw() {

	sudo.draw();
	sweep.draw();
}

function mousePressed() {

	sweep.clicked(mouseX, mouseY);
}
