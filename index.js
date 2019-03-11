var http = require('http'),
    fs = require('fs'), 
    express = require('express');

const app = express();

app.get('/subscriber', (req, res) => {
	res.sendFile(__dirname + '/htmls/subscriber.html')
});

app.get('/publisher', (req, res) => {
	console.log(__dirname)
	res.sendFile(__dirname + '/htmls/publisher.html')
});

app.use(express.static(__dirname + '/'))

app.listen(8080);


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