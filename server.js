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

require('./socketEvents')(io);

/*
io.on('connection', (socket) => {
    console.log('a user connected', socket.id); 
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('join_room', function(data) {
        console.log('join_room');
        socket.join(data.room);
    });
    socket.on('leave_room', (data) => {
        socket.leave(data.room);
    });

    /* Client events 
    socket.on('chat_message', function(msg){
        console.log('message: ', msg, ' id:', socket.id);
        io.emit('chat_message', {msg});
    });

    /* Agent events 
    socket.on('agent_message', function(data){
        console.log('message: ', data, ' id:', socket.id);
        io.to(data.to).emit('agent_message', {msg: data.msg});
    });

    socket.on('fetch_channel_users', () => {
        console.log('fetch_channel_users');
        io.to(socket.id).emit('channel_user_list', {msg});
    });

    socket.on('agent_login', function(msg){
        console.log('message: ', msg, ' id:', socket.id);
        socket.userInfo = {site: msg.site};
        io.to(socket.id).emit('agent_channels', {msg});
    });
});
*/

server.listen(3000, () => console.log('Server is running at 3000'));