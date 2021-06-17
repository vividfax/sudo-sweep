const white = "#fcfffd";
const light = '#EAF2F1';
const mid = '#64b6ac';
const dark = '#5d737e';

let sudo;
let sweep;

let validation;
let win = false;

let startTime = "";
let timeElapsed = "";

let refreshButton;

function setup() {

	createCanvas(windowWidth, windowHeight);
	createBackground();

	sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
	sweep.setMines(sudo.grid);

	document.addEventListener('contextmenu', event => event.preventDefault());

	refreshButton = new Button("New game", width/2, height/8*7);
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

	refreshButton.hover(mouseX, mouseY);
	refreshButton.display();
}

function mousePressed() {

	sweep.clicked(mouseX, mouseY);
	sudo.clicked(mouseX, mouseY);

	refreshButton.clicked(mouseX, mouseY);
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
	text(timeElapsed, width/2, height/5);
}


function newPuzzle() {

	sudo = new Sudoku(width / 2 - 240 - 30, height / 2 - 120);
	sweep = new Minesweeper(width / 2 + 30, height / 2 - 120);
	sweep.setMines(sudo.grid);

	startTime = "";
	timeElapsed = "";
	validation = false;
}
