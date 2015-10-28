(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }


  var View = SG.View = function ($el) {
    this.$el = $el;
    this.speed = 0;
    this.score = SG.Score;
    this.board = new SG.Board(20);
    this.setupGrid();
    this.running = false;
    this.over = true;
    alertsUpdate("press start to begin","display", true);
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.KEYS = {
    87: "N",
    65: "W",
    68: "E",
    83: "S",
    38: "N",
    39: "E",
    40: "S",
    37: "W",
    32: "PAUSE"
  };

  View.STEP_MILLIS = 100;

  View.prototype.handleKeyEvent = function (event) {
    if (View.KEYS[event.keyCode] === "PAUSE"){
      if (this.over) {
        this.over = false;
        multiUpdate(0);
        speedUpdate(100);
        scoreUpdate(0);
        appleUpdate(0);
        this.speed = 0;
        SG.Score = 0;
        alertsUpdate("","display", false);
        this.board.snake = new SG.Snake(this.board);
      }
      if (this.running){
      window.clearInterval(window.intervalId);
      this.running = false;
      alertsUpdate("Paused, press start to continue","display", true);
      return;
    } else {
      this.running = true;
      alertsUpdate("","display", false);
      window.intervalId = window.setInterval(
        this.step.bind(this),
        (View.STEP_MILLIS - (this.speed))
      );
      return;
    }
    }
    if (View.KEYS[event.keyCode] && this.running) {
      if (this.board.snake.inputBuffer.length <3) {
      this.board.snake.inputBuffer.push(View.KEYS[event.keyCode]);
      }
    } else {
      // some other key was pressed; ignore.
    }
  };

  View.prototype.render = function () {
    // simple text based rendering
    // this.$el.html(this.board.render());
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.snake.head()], "head");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {

    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      if (typeof coord === 'undefined'){
        return;
      }
      var flatCoord = (coord.i * this.board.dim) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };
  View.prototype.computeSpeed = function(){
    var speed = (View.STEP_MILLIS - this.speed - Math.floor(this.board.snake.eatenApples/2));
    if (speed < 20){
      speedUpdate(20);
      return 20;
    } else {
      speedUpdate(speed);
      return speed;
    }
  };

  View.prototype.step = function () {
    multiUpdate(this.board.apple.surroundings());
    segmentsUpdate(this.board.snake.segments.length);

    if (this.board.snake.inputBuffer.length > 0) {
      this.board.snake.turn(this.board.snake.inputBuffer.shift());
    }
    this.board.snake.move();
    if (this.board.snake.segments.length > 0) {
      if(SG.Score >= 100 * this.speed){
        this.speed = Math.floor(SG.Score/100);
        window.clearInterval(window.intervalId);
        window.intervalId = window.setInterval(
          this.step.bind(this),
          (this.computeSpeed())
        );
      }
      this.render();
    } else {
      alertsUpdate("You Scored " + SG.Score + " points!","display", true);
      window.clearInterval(window.intervalId);
      this.over = true;
      this.running = false;
    }
  };
})();
