const bodyParser = require("body-parser");
const express = require("express");

let lastMove;

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.get("/", handleIndex);
app.post("/start", handleStart);
app.post("/move", handleMove);
app.post("/end", handleEnd);

app.listen(PORT, () =>
  console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`)
);

function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: "1",
    author: "DestinTech",
    color: "#6600cc",
    head: "beluga",
    tail: "bolt",
  };
  response.status(200).json(battlesnakeInfo);
}

function handleStart(request, response) {
  var gameData = request.body;
  console.log(gameData.board.width);

  console.log("START");
  response.status(200).send("ok");
}

function handleEnd(request, response) {
  var gameData = request.body;
  console.log("END");
  response.status(200).send("ok");
}

let counter = 0;

function handleMove(request, response) {
  var gameData = request.body;
  var possibleMoves = ["up", "down", "left", "right"];
  let move;
  let me = snakeFactory("you", gameData);
  //TODO: make a class for game board that holds me, enemies, and the game board variables along with any other properties
  console.log("\n New Move... Thinking...");
  console.log("lastMove: " + lastMove);

  stayOnBoard(gameData, possibleMoves); // WORKS!!

  // randomize move every 3 moves to allow collision detection testing
  if (counter < 3) {
    move = stayOnTrack(possibleMoves);
    counter++;
  } else {
    move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; //otherwise, random move that's avaialable.
    counter = 0;
  }

  preventCollision(move, me, possibleMoves); // TODO: define the quardinates of the body, and keep 1 block from the snake

  console.log(possibleMoves);
  console.log("MOVE: " + move + "\n");
  lastMove = move;
  response.status(200).send({
    move: move,
  });
}

function preventCollision(move, me, possibleMoves) { 
  //here we will check what space the "move" we want to make will occupy.
  //move = planned next move we want to verify is safe
  move = move;
  me = me; // me contains my snake,  me.location, .head, and .body all contain quordinates
  //We want to import gameData and create a variable for the enemies to verify we don't hit an enemy also, unless they are weaker and it's within their head's moves.
  function lookAhead() { // in this function we get our current location, and calculate the outcome of the plannedMove in the current board state, TODO: not taking account for our enemies moves.
    let plannedMove = {
      head: {
        x: 0,
        y: 0,
      },
    };
  console.log("lookahead called:" + move)
    if (move === "down") {
      plannedMove.head.y = me.location.head.y - 1;
      plannedMove.head.x = me.location.head.x;
    } else if (move === "up") {
      plannedMove.head.y = me.location.head.y + 1;
      plannedMove.head.x = me.location.head.x;
    } else if (move === "left") {
      plannedMove.head.x = me.location.head.x - 1;
      plannedMove.head.y = me.location.head.y;
    } else if (move === "right") {
      plannedMove.head.x = me.location.head.x + 1;
      plannedMove.head.y = me.location.head.y;
    } else {
      console.log("error");
    }
  
    return plannedMove;
  }
  function checkHazards(me, plannedMove, move,possibleMoves) { // in this function we verify if the quordinates found in lookAhead are safe to move to.
    let snake = me.location;
    let hazards = [
      //make a list of hazard locations
      snake.body, //hazards of my own snakes body
    ];

    //check for quordinate == the locations to our expected next move
    console.log("Hazards: ");
    for (let hazard in hazards) { //Loop thoguh all hazards
      haz = hazards[hazard];
      console.log({ haz });//print all the hazards to console.
      console.log({plannedMove.head})
      if (plannedMove.head === hazards.hazard) { // if the pkanned
        removeMove(move, possibleMoves);
        dangerousMove = move;
        move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; //otherwise, random move that's avaialable.
        console.log(`DANGER! changing from ${dangerousMove} to ${move}.`)
      }
      else{
        console.log(`the move appears safe, moving ${move}...`)
      }
    }
  }

  plannedMove = lookAhead(); //get the quordinates of the chosen next move
  checkHazards(me, plannedMove, move, possibleMoves); //check for hazards on the next quordinate, change move if there is danger.
  //TODO:check for enemies close to the next quordinate, to see if it's a head. If it's a head, compare size. if size is bigger, move towards quordinate.
  return move;


}

const snakeFactory = (name, gameData) => {
  //let enemySnakes = gameData.board.snakes;
  //console.log(enemySnakes);
  let location;
  let length;
  let selSnake;
  name = name;
  const checkLocation = () => {
    if (name === "you") {
      selSnake = gameData.you;
    } else {
      //selSnake = enemySnakes[name];
    }
    location = {
      head: {
        x: selSnake.head.x,
        y: selSnake.head.y,
      },
      //'tail': {
      // 'x': selSnake.tail.x,
      // 'y': selSnake.tail.y
      // },
      body: selSnake.body,
    };
    console.log("snake initialized: " + name);
  };

  checkLocation();
  return { name, location, length }; // return the snake
};

function removeMove(move, possibleMoves) {
  let index = possibleMoves.indexOf(move);
  if (index > -1) {
    possibleMoves.splice(index, 1);
  }
}

function stayOnBoard(gameData, possibleMoves) {
  // First we want to check the size of the board, and make sure we stay on the board.
  //if head = on left, bottom, top or rigth edge of the board, then
  // var  possibleMoves = !the way to die

  // If the last move was up, we can't go down. if the last move was left, we cant go right.
  let height = gameData.board.height;
  let width = gameData.board.width;
  let quox = gameData.you.head.x; //horizontal
  let quoy = gameData.you.head.y; //vertical

  const leftSide = 0;
  const rightSide = width - 1;
  const top = height - 1;
  const bottom = 0;

  /* 
      This method won't work, as it's splicing by location in the array.  The location is changing before the second removal is activated. 
      */
  if (quox === rightSide || lastMove === "left") {
    //horizontal avoidance
    console.log("cant go right");
    removeMove("right", possibleMoves);
  }
  if (quox === leftSide || lastMove === "right") {
    console.log("cant go left");
    removeMove("left", possibleMoves);
  }
  if (quoy === top || lastMove === "down") {
    console.log("cant go up");
    removeMove("up", possibleMoves);
  }
  if (quoy === bottom || lastMove === "up") {
    console.log("cant go down");
    removeMove("down", possibleMoves);
  }
}

function stayOnTrack(possibleMoves) {
  let index = possibleMoves.indexOf(lastMove); //find if the last move is in the list
  if (index > -1) {
    // if it is in the list
    return lastMove; // do what we did last if it's an option.
  } else {
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; //otherwise, random move that's avaialable.
  }
}

// {
//   game: {
//     ruleset: { name: 'solo', version: 'v1.0.15' },
//     timeout: 500
//   },
//   turn: 5,
//   board: {
//     height: 7,
//     width: 7,
//     snakes: [ [Object] ],
//     food: [ [Object], [Object] ],
//     hazards: []
//   },
//   you: {
//     id: 'gs_PcKRx3BR6CJjKbwJbwTdvgQ7',
//     name: 'Bombastic-bot',
//     latency: '57',
//     health: 95,
//     body: [ [Object], [Object], [Object] ],
//     head: { x: 5, y: 6 },
//     length: 3,
//     shout: ''
//   }
// }

// [ { x: 5, y: 6 },
//   { x: 6, y: 6 },
//   { x: 6, y: 5 },
//   { x: 6, y: 4 },
//   { x: 6, y: 3 },
//   { x: 6, y: 2 },
//   { x: 6, y: 1 },
//   { x: 6, y: 0 },
//   { x: 5, y: 0 },
//   { x: 4, y: 0 },
//   { x: 3, y: 0 },
//   { x: 2, y: 0 },
//   { x: 1, y: 0 },
//   { x: 0, y: 0 },
//   { x: 0, y: 1 },
//   { x: 0, y: 2 },
//   { x: 0, y: 3 },
//   { x: 0, y: 4 },
//   { x: 0, y: 5 },
//   { x: 0, y: 6 },
//   { x: 1, y: 6 },
//   { x: 2, y: 6 },
//   { x: 3, y: 6 },
//   { x: 4, y: 6 } ]
