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
  
  socket.on('startPlayingPublisher', (song) => {
    console.log('server in startPlayingPublisher', song);

    // const newSong = song;
    // song.startTime = Date().now;
    // song.isPlaying = true
    // songsPlayed.push(song);

    io.sockets.emit('startPlayingSubscriber', {hello: 'world'});
  });

  socket.on('stopPlayingPublisher', (data) => {
    console.log('server in stopPlayingPublisher', data)

    // if (data.songId == songsPlayed[songsPlayed.length - 1].id)
    // {
    //   var song = songsPlayed[songsPlayed.length - 1]
    //   song.isPlaying = false
    //   song.timeElapsed = data.timeElapsed
    //   songsPlayed[songsPlayed.length - 1] = song

    io.sockets.emit('stopPlayingSubscriber', {hello: 'world'});
    // }
  })

  socket.on('resumePlayingPublisher', (song) => {
    console.log('server in resumePlayingPublisher', song)

    // if (data.songId == songsPlayed[songsPlayed.length - 1].id)
    // {
    //   var song = songsPlayed[songsPlayed.length - 1]
    //   song.isPlaying = true
    //   songsPlayed[songsPlayed.length - 1] = song

    io.sockets.emit('resumePlayingPublisher', {hello: 'world'});
    // }
  })

  // Volume ******************************
  
  socket.on('volumeChangePublisher', (songVolume) => {
    io.emit('volumeChangeSubscriber', {hello: 'world'})
  })

  // Chat ******************************

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

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/htmls/chat.html')
})

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