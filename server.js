const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.get('/siteA', function(req, res){
    res.sendFile(__dirname + '/view/siteA.html');
});
app.get('/client', function(req, res){
    res.sendFile(__dirname + '/view/client.html');
});
app.get('/agent', function(req, res){
    res.sendFile(__dirname + '/view/agent.html');
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id); 
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat_message', function(msg){
        console.log('message: ', msg, ' id:', socket.id);
        io.emit('chat_message', {msg});
    });
    socket.on('join_room', function(data) {
        console.log('join_room');
        socket.join(data.room);
    });
    socket.on('leave_room', (data) => {
        socket.leave(data.room);
    });
});

server.listen(3000, () => console.log('Server is running at 3000'));