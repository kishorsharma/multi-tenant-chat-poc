var socket = io();

/**
 * Post message to server if any client is selected
 * @param {*} e 
 */
var postMessage = function(e) {

    socket.emit('client_message', {
        msg:this.message
    });
    app.messages.push({user: 'self', msg:this.message});
    app.message = '';
    e.preventDefault();
};

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        messages: [
            {msg: 'First message'}
        ]
    },
    methods: {
        post: postMessage
    }
});

/**
 * Fetch available user list for given channel
 * @param {*} channelName 
 */
var fetchChannelQuestion = function (channelName) {
    socket.emit('fetch_channel_questions', {channel:channelName});
};

/**
 * trigger event on socket connection. Only using for checking ID
 */
socket.on('connect', function () {
    console.log('id: ', socket.id);
    let searchParams = (new URL(document.location)).searchParams;
    console.log('location: ', searchParams.get('site'));
    socket.emit('client_login', {
        site: searchParams.get('site'),
        channel: searchParams.get('channel'),
        username: searchParams.get('name'),
        email: searchParams.get('email')
    });
});

/**
 * Fetch user agent channel list
 */
socket.on('client_site', function (data) {
    console.log('client_site info: ', data);
    app.site = data.site;
    fetchChannelQuestion(app.site.defaultChannel);
});

/**
 * Fetch question to be displayed
 */
socket.on('client_site', function (data) {
    console.log('client_site info: ', data);
    app.site = data.site;
    fetchChannelQuestion(app.site.defaultChannel);
});

/**
 * Socket event listner for agent reply message for this client
 */
socket.on('agent_reply', function(data) {
    console.log('msg recieved: ', data);
    app.messages.push(data);
    socket.emit('agent_msg', data);
});