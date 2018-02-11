
const sites = require('./mocks/sites.json');
const channelUserList = {};
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id); 
        socket.on('disconnect', function(){
            console.log('user disconnected', socket.id);
            let _channelUsers = channelUserList[`${socket.site.name}_${socket.channel}`] || {};
            _channelUsers.clients = (_channelUsers.clients || []).filter( function (client) {
                console.log(client);
                return client.id !== socket.id;
            });
        });
        
        socket.on('join_room', function(data) {
            console.log('join_room');
            socket.join(data.room);
        });

        socket.on('leave_room', (data) => {
            socket.leave(data.room);
        });
    
        /* Client events */
        socket.on('client_message', function(data){
            console.log('message: ', data.msg, ' id:', socket.id);
            console.log('site: ', socket.site.name, ' channel:', socket.currentChannel);
            
            let _channelUsers = channelUserList[`${socket.site.name}_${socket.channel}`] || {};
            console.log('channelUserList: ', channelUserList);
            console.log('_channelUsers: ', _channelUsers);
            let siteAgent = _channelUsers.agent;
            if (siteAgent) {
                io.to(siteAgent.id).emit('client_message', {
                    client: socket.id,
                    msg: data.msg
                });
            } else {
                io.to(socket.id).emit('agent_reply', {msg: 'No Agent online. Kindly try later'});
            }
            
        });

        socket.on('client_login', function(data){
            console.log('message: ', data, ' id:', socket.id);
            socket.channel = data.channel;
            for (let i=0; i<sites.length; i++) {
                if (sites[i].id === data.site) {
                    socket.site = sites[i];
                    break;
                }
            }
            data.channel = data.channel || socket.site.defaultChannel;
            let _channelUsers = channelUserList[`${socket.site.name}_${data.channel}`] || {};
            _channelUsers.clients = _channelUsers.clients || [];
            _channelUsers.clients.push({
                id: socket.id,
                site: socket.site,
                username: data.username,
                email: data.email
            });
            channelUserList[`${socket.site.name}_${data.channel}`]= _channelUsers;
            console.log(channelUserList);
            io.to(socket.id).emit('client_site', {site: socket.site});
        });

        socket.on('fetch_channel_questions', (data) => {
            console.log('fetch_channel_questions', data.channel);
            data.channel = data.channel || socket.site.defaultChannel;
            const siteChannelName = `${socket.site.name}_${data.channel}`;
            socket.currentChannel = data.channel;
            io.to(socket.id).emit('channel_question_list', {questions: channelUserList[siteChannelName]});
        });
    
        /* Agent events */
        socket.on('agent_message', function(data) {
            console.log('message: ', data, ' id:', socket.id);
            io.to(data.to).emit('agent_reply', {msg: data.msg});
        });
    
        socket.on('fetch_channel_users', (data) => {
            console.log('fetch_channel_users', data.channel);
            console.log(channelUserList);
            const siteChannelName = `${socket.site.name}_${data.channel}`;
            const clients = channelUserList[siteChannelName] ? channelUserList[siteChannelName].clients : [];
            console.log(channelUserList);
            io.to(socket.id).emit('channel_user_list', {users: clients});
        });
    
        socket.on('agent_login', function(data){
            console.log('message: ', data, ' id:', socket.id);
            for (let i=0; i<sites.length; i++) {
                if (sites[i].id === data.site) {
                    socket.site = sites[i];
                    break;
                }
            }
            data.channel = data.channel || socket.site.defaultChannel;
            let _channelUsers = channelUserList[`${socket.site.name}_${data.channel}`] || {};
            _channelUsers.agent= {
                id: socket.id,
                site: socket.site
            };
            channelUserList[`${socket.site.name}_${data.channel}`] = _channelUsers;
            console.log('>>>>>>>>>>>>>>>>', channelUserList);
            io.to(socket.id).emit('agent_site', {site: socket.site});
        });
    });
};