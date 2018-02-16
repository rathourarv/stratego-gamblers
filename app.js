const express = require('express');
const fs = require('fs');
const cookieParser =require('cookie-parser');
const Game=require('./src/models/game.js');
const app = express();
const log = require("./src/handlers/logger.js").log;

const AddPlayerHandler = require('./src/handlers/addPlayerHandler.js');


app.fs=fs;

let game = new Game();

const setBattlefield = function(req,res,next){
  let playerId = req.params.playerId;
  let placedPositions = req.body;
  game.setBattlefieldFor(playerId,placedPositions);
  console.log(game.battlefield);
    
  game.updateStatus(); 
  next();
};

const checkForReady = function(req,res,next){
  if(game.readyStatus){
    res.redirect('/battlefield.html');
    return;
  }
  res.send('wait for opponent');
};

const setupRedArmy=function(req,res){
  let setupTemp = app.fs.readFileSync('./templates/setupArmy','utf8');
  setupTemp = setupTemp.replace('{{team}}','Red');
  res.send(setupTemp);
};

const setupBlueArmy = function (req, res) {
  let setupTemp = app.fs.readFileSync('./templates/setupArmy', 'utf8');
  setupTemp = setupTemp.replace('{{team}}', 'Blue');
  res.send(setupTemp);
};


app.use(log());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(express.static('public'));
app.post("/gameId",new AddPlayerHandler().getRequestHandler());
app.post('/setup/player/:playerId',setBattlefield);
app.use('/setup/player/:playerId',checkForReady);
app.get('/setupRedArmy',setupRedArmy);
app.get('/setupBlueArmy', setupBlueArmy);
module.exports=app;
