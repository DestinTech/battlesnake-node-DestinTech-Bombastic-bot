const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'DestinTech',
    color: '#6600cc',
    head: 'beluga',
    tail: 'bolt'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body
  console.log(gameData.board.width)
  
  console.log('START')
  response.status(200).send('ok')
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}

let lastMove;
function handleMove(request, response) {
  var gameData = request.body
  console.log("lastMove: " +lastMove);

  var possibleMoves = ['up', 'down', 'left', 'right']

  function preventCollision(gameData) {
    body = gameData.body;
    console.log(gameData);
  }


  function stayOnBoard(gameData){
    function removeMove(x) {
      let index = possibleMoves.indexOf(x);
      if (index > -1){
        possibleMoves.splice(index, 1);
      }
    }
    //TODO: First we want to check the size of the board, and make sure we stay on the board.
    //if head = on left, bottom, top or rigth edge of the board, then
        // var  possibleMoves = !the way to die

        // If the last move was up, we can't go down. if the last move was left, we cant go right. 
        let height = gameData.board.height;
        let width = gameData.board.width;
        let quox = gameData.you.head.x;  //horizontal
        let quoy = gameData.you.head.y; //vertical 

        console.log("width: " +width + ", x: "+ quox + ", y: "+ quoy);

        const leftSide = 0;
        const rightSide = width - 1;
        const top = height - 1;
        const bottom = 0;
        

        /* 
        This method won't work, as it's splicing by location in the array.  The location is changing before the second removal is activated. 
        */
        if (quox === rightSide || lastMove === "left"){ //horizontal avoidance
          console.log('cant go right')
          removeMove("right");
        }
        if (quox === leftSide || lastMove === "right"){
          console.log('cant go left')
          removeMove("left");
        }
        if (quoy === top || lastMove === "down"){
          console.log('cant go up')
          removeMove("up");
        }
        if (quoy === bottom || lastMove === "up"){
          console.log('cant go down')
          removeMove("down");
        }        
}

  stayOnBoard(gameData); // WORKS!!
  preventCollision(gameData);

    let index = possibleMoves.indexOf(lastMove);
    if (index > -1){
      possibleMoves.splice(index, 1);
    }

  var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  console.log(possibleMoves)
  console.log(possibleMoves.length)
  
  lastMove = move;
  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
  var possibleMoves = ['up', 'down', 'left', 'right']


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
