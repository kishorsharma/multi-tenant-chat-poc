var socket = io();

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        messages: [
            {msg: 'First message'}
        ]
    },
    methods: {
        post: function(e) {
        socket.emit('client_message', this.message);
        e.preventDefault();
        }
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
 * Socket event listner for agent reply message for this client
 */
socket.on('agent_reply', function(data) {
    console.log('msg recieved: ', data.from);
    app.messages.push(data);
    app.message = '';
});