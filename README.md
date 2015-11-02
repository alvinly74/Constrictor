Snake Project that calculates score based on length rather than amount of Apples.

**[Live Demo](http://appacademy.github.io/snake.js/html/snake.html)**

After the first apple, the snake will grow to a maximum of 100 segments. Score is calculated based on how many sides the snake surrounds the apple.

Score is calculated using the number of segments, multiplied by the amount of sides the snake surrounds the apple, and multiplied again by (1 + (1 * {number of apples eaten})).
speed is increased by one unit for every 100 points, and every 2 apples eaten.

Without using the apple count in both score and speed, I found that the game would be very simple for a user to continuously eat apples. the game would be too easy for too long.
