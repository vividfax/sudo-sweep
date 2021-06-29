const white = "#ffffff";
const light = '#EAF2F1';
const mid = '#64b6ac';
const dark = '#5d737e';

let sudo;
let sweep;

let validation;
let win = false;

let startTime = "";
let timeElapsed = "";

let w = 2;
let h = 2;

let sizes = [[2, 2], [3, 2], [3, 3]];
let size = 0;

function setup() {

	createCanvas(windowWidth, windowHeight);
	createBackground();

	sudo = new Sudoku(width / 2 - 60 * w*h - 30, height / 2 - 30 * w*h, w, h);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 30 * w*h, w, h);
	sweep.setMines(sudo.grid);

	document.addEventListener('contextmenu', event => event.preventDefault());

	select("#refresh").mousePressed(() => newPuzzle());
	select("#size").mousePressed(() => {
		size++;
		if (size > 2) {
			size = 0;
		}
		w = sizes[size][0];
		h = sizes[size][1];
		newPuzzle();
	});
	noLoop();
}

function draw() {

	validation = sudo.validate() && sweep.validate();

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

		if (startTime == "") {
			startTime = timeElapsed;
		}
		timeElapsed = (timeElapsed - startTime) / 1000;
		timeElapsed += " seconds";
	}
	fill(white);
	textSize(30);
 	textFont('Fira Code');
	textAlign(CENTER, CENTER);
	text(timeElapsed, width/2, 50);
}


function newPuzzle() {

	sudo = new Sudoku(width / 2 - 60 * w*h - 30, height / 2 - 30 * w*h, w, h);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 30 * w*h, w, h);
	sweep.setMines(sudo.grid);

	startTime = "";
	timeElapsed = "";
	validation = false;
}
