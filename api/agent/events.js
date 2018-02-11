
const channelUserList = {};
module.exports = (io, socket) => {
    console.log('a user connected', socket.id); 

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
};