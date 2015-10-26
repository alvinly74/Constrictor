(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var Score = SG.Score = 0;

  var Coord = SG.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };

  Coord.prototype.equals = function (coord2) {
    return (this.i == coord2.i) && (this.j == coord2.j);
  };

  Coord.prototype.isOpposite = function (coord2) {
    return (this.i == (-1 * coord2.i)) && (this.j == (-1 * coord2.j));
  };

  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j);
  };

  var Apple = SG.Apple = function (board) {
    this.board = board;
    this.replace();
  };

  Apple.prototype.replace = function () {
    var x = Math.floor(Math.random() * this.board.dim);
    var y = Math.floor(Math.random() * this.board.dim);

    // Don't place an apple where there is a snake
    while (this.board.snake.isOccupying([x, y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  };
  Apple.prototype.surroundings = function(){
    var directionCount = 0;
    var north = [];
    var east = [];
    var south = [];
    var west = [];
    var northConfirm = false;
    var southConfirm = false;
    var eastConfirm = false;
    var westConfirm = false;
    var that = this;
    for (var i = 0 ; i < this.board.dim; i++){
      if (i < this.position.i){
        north.push(i);
      } else if (i === this.position.i) {

      } else {
        south.push(i);
      }
    }
    for (var j = 0; j < this.board.dim; j++){
      if (j < this.position.j){
        west.push(j);
      } else if (j === this.position.j){

      } else {
        east.push(j);
      }
    }
    north.forEach(function(idx){
      if (that.board.snake.isOccupying([idx,that.position.j])){
        // debugger;
        northConfirm = true;
      }
    });
    south.forEach(function(idx){
      if (that.board.snake.isOccupying([idx,that.position.j])){
        // debugger;
        southConfirm = true;
      }
    });
    east.forEach(function(idx){
      if (that.board.snake.isOccupying([that.position.i,idx])){
        // debugger;
        eastConfirm = true;
      }
    });
    west.forEach(function(idx){
      if (that.board.snake.isOccupying([that.position.i,idx])){
        // debugger;
        westConfirm = true;
      }
    });
    [northConfirm,southConfirm,eastConfirm,westConfirm].forEach(function(confirm){
      if (confirm === true){
        directionCount +=1;
      }
    });
    return directionCount;
  };

  var Snake = SG.Snake = function (board) {
    this.dir = "N";
    this.turning = false;
    this.board = board;
    this.array = [];
    var center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [center];

    this.growTurns = 2;
  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };


  Snake.prototype.eatApple = function () {

    if (this.head().equals(this.board.apple.position)) {

      SG.Score += this.segments.length * this.board.apple.surroundings();
      this.segments = [this.head()];
      this.growTurns += 10000;
      return true;
    } else {
      return false;
    }
  };

  Snake.prototype.isOccupying = function (array) {
    var result = false;
    this.segments.forEach(function (segment) {
      if (segment.i === array[0] && segment.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function () {
    var head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };

  Snake.prototype.move = function () {
    // move snake forward
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));

    // allow turning again
    this.turning = false;

    // maybe eat an apple
    if (this.eatApple()) {
      this.board.apple.replace();
    }

    // if not growing, remove tail segment
    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    // destroy snake if it eats itself or runs off grid
    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (dir) {
    // avoid turning directly back on yourself
    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) ||
      this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

  var Board = SG.Board = function (dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function (dim) {
    var grid = [];

    for (var i = 0; i < dim; i++) {
      var row = [];
      for (var j = 0; j < dim; j++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }

    return grid;
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);

    this.snake.segments.forEach(function (segment) {
      grid[segment.i][segment.j] = Snake.SYMBOL;
    });

    grid[this.apple.position.i][this.apple.position.j] = Apple.SYMBOL;

    // join it up
    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i < this.dim) &&
      (coord.j >= 0) && (coord.j < this.dim);
  };
})();
