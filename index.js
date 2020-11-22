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

  console.log('START')
  response.status(200).send('ok')
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body
  var possibleMoves = ['up', 'down', 'left', 'right']

  function stayOnBoard(gameData){
    //TODO: First we want to check the size of the board, and make sure we stay on the board.
    //if head = on left, bottom, top or rigth edge of the board, then
        // var  possibleMoves = !the way to die
        let height = gameData.board.height;
        let width = gameData.board.width;

        let horx = gameData.you.head[y]; 
        let verx = gameData.you.head[x]; 


}
  //Here we start our code to handle the battlefield. 
  // console.log(gameData);
  stayOnBoard(gameData);
  
  var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
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
