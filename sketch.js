const white = "#fcfffd";
const light = '#EAF2F1';
const mid = '#64b6ac';
const dark = '#5d737e';

let sudo;
let sweep;

let win = false;

let startTime;
let timeElapsed = "";

function setup() {

	createCanvas(windowWidth, windowHeight);
	createBackground();

	sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
	sweep.setMines(sudo.grid);

	document.addEventListener('contextmenu', event => event.preventDefault());

	startTime = new Date();
	startTime = startTime.getTime();

	noLoop();
}

function draw() {

	let validation = sudo.validate() && sweep.validate();

	if (validation || win) {
		background(mid);
		displayTime();
	} else {
		updatePixels();
	}
	sudo.draw();
	sweep.draw();
}

function mousePressed() {

	sweep.clicked(mouseX, mouseY);
	sudo.clicked(mouseX, mouseY);
	draw();
}

function keyPressed() {

	if (keyCode == 82) {

		sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
		sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
		sweep.setMines(sudo.grid);

		startTime = new Date();
		startTime = startTime.getTime();
		timeElapsed = "";

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

function displayTime() {

	if (timeElapsed == "") {

		timeElapsed = new Date();
		timeElapsed = timeElapsed.getTime();
		timeElapsed = (timeElapsed - startTime) / 1000;
		timeElapsed += " seconds";
	}
	fill(white);
	textSize(30);
 	textFont('Fira Code');
	textAlign(CENTER, CENTER);
	text(timeElapsed, width/2, height/5);
}
