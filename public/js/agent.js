var socket = io();

/**
 * Post message to server if any client is selected
 * @param {*} e 
 */
var postMessage = function(e) {
    console.log('postMessage is been called', app.selectedUser);
    if (app.selectedUser) {
        socket.emit('agent_message', {
            to: app.selectedUser.id,
            msg:this.message
        });
        //app.messages.push({user: 'self', msg:this.message});
        app.selectedUser.chats.push({user: 'self', msg:this.message});
        app.message = '';
    }
    e.preventDefault();
}; 

var refereshUserList = function () {
    fetchChannelUsers(app.currentChannel);
};

var selectUser = function (user) {
    console.log('user: ', user);
    app.selectedUser = user;
    app.selectedUser.chats = app.selectedUser.chats || [];
};

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
        selectedUser: {}
    },
    methods: {
        post: postMessage,
        refereshUserList: refereshUserList,
        selectUser: selectUser
    }
});

/**
 * Fetch available user list for given channel
 * @param {*} channelName 
 */
var fetchChannelUsers = function (channelName) {
    socket.emit('fetch_channel_users', {channel:channelName});
};

/**
 * trigger event on socket connection. Only using for checking ID
 */
socket.on('connect', function () {
    console.log('id: ', socket.id);
    let searchParams = (new URL(document.location)).searchParams;
    console.log('location: ', searchParams.get('site'));
    socket.emit('agent_login', {
        site: searchParams.get('site'),
        page: searchParams.get('page')
    });
});

/**
 * trigger event on socket connection. Only using for checking ID
 */
socket.on('site_info', function (data) {
    app.site = data.site;
});

/**
 * trigger event on socket connection. Only using for checking ID
 */
socket.on('client_added', function (data) {
    app.users.push(data);
});

/**
 * Fetch user agent channel list
 */
socket.on('agent_site', function (data) {
    console.log('agent_site info: ', data);
    app.site = data.site;
    app.channels = data.site.channels;
    app.currentChannel = app.site.defaultChannel;
    fetchChannelUsers(app.currentChannel);
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
    console.log('msg recieved: ', data.client);
    //app.messages.push(data);
    var user = {};
    for(var i=0;i<app.users.length; i++) {
        if (app.users[i].id === data.client) {
            user = app.users[i];
        }
    }
    user.chats.push({user: 'client', msg: data.msg});
});