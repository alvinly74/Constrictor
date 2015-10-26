(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }



  var View = SG.View = function ($el) {
    this.$el = $el;

    this.board = new SG.Board(40);
    this.setupGrid();

    window.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );

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

  View.STEP_MILLIS = 75;

  View.prototype.handleKeyEvent = function (event) {
    if (View.KEYS[event.keyCode]) {
      if (this.board.snake.array.length <3) {
      this.board.snake.array.push(View.KEYS[event.keyCode]);
      }
        console.log(this.board.snake.array);
    } else {
      // some other key was pressed; ignore.
    }
  };

  View.prototype.render = function () {
    // simple text based rendering
    // this.$el.html(this.board.render());

    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
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

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      if (this.board.snake.array.length > 0) {
        this.board.snake.turn(this.board.snake.array.shift());
      }
      this.board.snake.move();
      this.render();
    } else {
      alert("You Scored " + SG.Score + " points!");
      window.clearInterval(window.intervalId);
    }
  };
})();
