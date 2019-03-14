var http = require('http'),
    fs = require('fs'),
    express = require('express');

var songs = require('./songs.js')

const app = express();

const server = http.Server(app);
const io = require('socket.io')(server);

var currentSong = null
var songsPlayed = []

io.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function(data) {
        console.log(data);
    });

    // Play ******************************

    socket.on('startPlayingPublisher', (song) => {
        console.log('******* server in startPlayingPublisher', song.id);

        const timeElapsed = new Date().getTime() / 1000 - song.timeElapsed

        song.startTime = timeElapsed

        const oldSongMatchingId = songsPlayed.find(oldSong => {
            console.log('Looking at ID', oldSong.id);
            return oldSong.id == song.id
        })

        if (oldSongMatchingId == null) {
            console.log(timeElapsed)
            song.timeElapsed = null // Not needed for backend because we save startTime
            songsPlayed.push(song);
        } else {
            oldSongMatchingId.startTime = timeElapsed
        }

        console.log('server in startPlayingPublisher', songsPlayed);

        currentSong = song
        io.emit('startPlayingSubscriber', { currentSong: currentSong, otherSongs: songsPlayed });
    });

    socket.on('stopPlayingPublisher', (songId) => {
        console.log('server in stopPlayingPublisher', songId)
        currentSong = null
        io.emit('stopPlayingSubscriber');
    })

    // Volume ******************************

    socket.on('volumeChangePublisher', (songVolume) => {
        io.emit('volumeChangeSubscriber', { hello: 'world' })
    })

    // Chat ******************************

    socket.username = "Anonymous"

    socket.on('change_username', (data) => {
        console.log('username changed to ' + data.username)
        socket.sockets.username = data.username
    })

    socket.on('new_message', (data) => {
        console.log('server in new_message', data)
            // io.sockets.emit('resumePlayingPublisher', { message: data.message, username: socket.username })

        io.emit('new_message', { message: data.message, username: socket.username })
    })

});
server.listen(8080);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.get('/currentSong', (req, res) => {
    res.send({ currentSong: currentSong, otherSongs: songsPlayed })
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