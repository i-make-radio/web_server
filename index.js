var http = require('http'),
    fs = require('fs'), 
    express = require('express');

var songs = require('./songs.js')

const app = express();

var server = http.Server(app);
var io = require('socket.io')(server);

var songsPlayed = []

io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });

  socket.on('my other event', function (data) {
    console.log(data);
 });

   // Play ******************************
  
  socket.on('startPlayingPublisher', function(songId) {
    var song = songs[songId-1];
    song.startTime = Date();
    song.isPlaying = true
    songsPlayed.push(song);
    console.log('server in startPlayingPublisher', socket.emit);
    io.emit('startPlayingSubscriber', song);
  });

  socket.on('stopPlayingPublisher', (data) => {
    console.log(data.songId, songsPlayed)
    if (data.songId == songsPlayed[songsPlayed.length - 1].id)
    {
      var song = songsPlayed[songsPlayed.length - 1]
      song.isPlaying = false
      song.timeElapsed = data.timeElapsed
      songsPlayed[songsPlayed.length - 1] = song

      io.emit('stopPlayingSubscriber', song);
    }
  })

  socket.on('resumePlayingPublisher', (songId) => {
    if (data.songId == songsPlayed[songsPlayed.length - 1].id)
    {
      var song = songsPlayed[songsPlayed.length - 1]
      song.isPlaying = true
      songsPlayed[songsPlayed.length - 1] = song

      io.emit('startPlayingSubscriber', song);
    }
  })

  // Volume ******************************
  
  socket.on('volumeChangePublisher', (songVolume) => {
    io.emit('volumeChangeSubscriber', songVolume)
  })

  // Username ******************************

  socket.username = "Anonymous"
  
  socket.on('change_username', (data) => {
    console.log('username changed to ' + data.username)
    socket.username = data.username               
  })

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', { message: data.message, username: socket.username})
  })

});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
 })

app.get('/allSongs', (req, res) => {
  res.send(songs)
})

app.get('/playedSongs', (req, res) => {
  res.send(songsPlayed)
})

app.get('/subscriber', (req, res) => {
	res.sendFile(__dirname + '/htmls/subscriber.html')
});

app.get('/publisher', (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname + '/htmls/publisher.html')
});

app.get('/client_publisher', (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname + '/htmls/client_publisher.html')
});

app.get('/client_subscriber', (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname + '/htmls/client_subscriber.html')
});

app.use(express.static(__dirname + '/'))

server.listen(8080);




// fs.readFile('./htmls/index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(8000);
// });