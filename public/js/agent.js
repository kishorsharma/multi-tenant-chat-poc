var socket = io();

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        messages: [
            {msg: 'First message'}
        ],
        users: [],
        channels: [],
        currentChannel: 'home',
        selectedUser: null
    },
    methods: {
        post: postMessage
    }
});

/**
 * Post message to server if any client is selected
 * @param {*} e 
 */
var postMessage = function(e) {
    if (selectedUser) {
        socket.emit('agent_message', {
            to: selectedUser.id,
            msg:this.message
        });
        app.messages.push({user: 'self', msg:this.message});
        app.message = '';
    }
    e.preventDefault();
}; 

/**
 * Fetch available user list for given channel
 * @param {*} channelName 
 */
var fetchChannelUsers = function (channelName) {
    socket.emit('fetch_channel_users');
};

/**
 * trigger event on socket connection. Only using for checking ID
 */
socket.on('connect', function () {
    console.log('id: ', socket.id);
});  

/**
 * Fetch user agent channel list
 */
socket.on('agent_channels', function (data) {
    app.channels.push(data.channels);
    fetchChannelUsers(app.channels[0]);
});

/**
 * Fetch channel user list
 */
socket.on('channel_user_list', function (data) {
    console.log('fetch_user_list: ', data);
    app.users = data.users;
});

/**
 * Socket event listner for client message for this agent
 */
socket.on('client_message', function(data) {
    console.log('msg recieved: ', data.from);
    app.messages.push(data);
});