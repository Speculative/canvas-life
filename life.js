//Modulus fix
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}

var life;

//Yeah I just made a bunch of convenience functions idk
function init() {
	life = new Life(10, 10);
}

function auto() {
	life.auto();
}

function next() {
	//Complete and total disregard for member privacy
	life.lifeBoard = life.nextFrame();
	life.drawBoard();
}

//Still learning how to OOP Javascript
function Life(rows, cols) {
	this.autoIntervalID;
	this.canvas = document.getElementById("life");
	this.rows = rows;
	this.cols = cols;
	
	if (this.canvas.getContext) {
		this.ctx = this.canvas.getContext('2d');
		//Init the Game of Life board
		this.lifeBoard = new Array(rows);
		for (var i = 0; i < rows; i++) {
			this.lifeBoard[i] = new Array(cols);
		}
		this.populateRandom();
		this.drawBoard();
	} else {
		console.debug("Canvas unsupported!");
	}
}

Life.prototype.auto = function() {
	if (!this.autoIntervalID) {
		var delay = parseInt(document.getElementById("delay").value);
		var self = this;
		this.autoIntervalID = window.setInterval(function() {
				self.drawBoard(self.canvas, self.lifeBoard);
				self.lifeBoard = self.nextFrame(self.lifeBoard);
			}, delay);
	} else {
		window.clearInterval(this.autoIntervalID);
		this.autoIntervalID = 0;
	}
}

Life.prototype.populateRandom = function() {
	//Populate randomly
	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			this.lifeBoard[i][j] = Boolean(Math.round(Math.random()));
		}
	}
}

Life.prototype.drawBoard = function() {
	var cellWidth = this.canvas.width / this.rows;
	var cellHeight = this.canvas.height / this.rows;
	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			if (this.lifeBoard[i][j] === true) {
				this.ctx.fillStyle = "#AADDEE";
			} else {
				this.ctx.fillStyle = "#EE6644";
			}
			this.ctx.fillRect(i*cellWidth, j*cellHeight, cellWidth, cellHeight);
		}
	}
}

Life.prototype.neighbors = function(x, y) {
	//I am ashamed of how ugly this is
	//There must be a better way but I don't know how
	//Hooray for automatically casting boolean to int
	var nc = 0
		+ (this.lifeBoard[(x-1).mod(this.rows)][(y-1).mod(this.cols)])
		+ (this.lifeBoard[x][(y-1).mod(this.cols)])
		+ (this.lifeBoard[(x+1).mod(this.rows)][(y-1).mod(this.cols)])
		+ (this.lifeBoard[(x+1).mod(this.rows)][y])
		+ (this.lifeBoard[(x+1).mod(this.rows)][(y+1).mod(this.cols)])
		+ (this.lifeBoard[x][(y+1).mod(this.cols)])
		+ (this.lifeBoard[(x-1).mod(this.rows)][(y+1).mod(this.cols)])
		+ (this.lifeBoard[(x-1).mod(this.rows)][y]);
	return nc;
}

Life.prototype.nextFrame = function() {
	//Make empty board
	var nextBoard = new Array(this.rows);
	for (var i = 0; i < this.rows; i++) {
		nextBoard[i] = new Array(this.cols);
	}
	
	//Populate empty board with next generation
	for (var i = 0; i < nextBoard.length; i++) {
		for (var j = 0; j < nextBoard[0].length; j++) {
			var nc = this.neighbors(i, j);
			if ((this.lifeBoard[i][j] && nc === 2) || (nc ===3)) {
				nextBoard[i][j] = true;
			} else {
				nextBoard[i][j] = false;
			}
		}
	}
	return nextBoard;
}
