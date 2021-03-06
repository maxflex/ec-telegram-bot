require('dotenv').config()
const request = require('request');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('dist', {index: 'demo.html', maxage: '4h'}));
app.use(bodyParser.json());

console.log(process.env.TELEGRAM_TOKEN)

// handle admin Telegram messages
app.post('/hook', function(req, res){
    try {
        const message = req.body.message || req.body.channel_post;
        const chatId = message.chat.id;
        const name = message.chat.first_name || message.chat.title || "admin";
        const text = message.text || "";
        const reply = message.reply_to_message;

        if (text.startsWith("/start")) {
            console.log("/start chatId " + chatId);
            sendTelegramMessage(chatId,
                "*Добро пожаловать в бот ЕГЭ-Центра* \n " +
                "CHAT ID: `" + chatId + "`",
                "Markdown");
        } else if (reply) {
            let replyText = reply.text || "";
            let userId = replyText.split(':')[0];
            io.emit(process.env.CHAT_ID + "-" + userId, {name, text, from: 'admin'});
        } else if (text){
            io.emit(process.env.CHAT_ID, {name, text, from: 'admin'});
        }

    } catch (e) {
        console.error("hook error", e, req.body);
    }
    res.statusCode = 200;
    res.end();
});

// handle chat visitors websocket messages
io.on('connection', function(client){

    client.on('register', function(registerMsg){
        let userId = registerMsg.userId;
        let chatId = registerMsg.chatId;
        // let chatId = process.env.CHAT_ID;
        let messageReceived = false;
        console.log("useId " + userId + " connected to chatId " + chatId);

        client.on('message', function(msg) {
            messageReceived = true;
            io.emit(process.env.CHAT_ID + "-" + userId, msg);
            let visitorName = msg.visitorName ? "[" + msg.visitorName + "]: " : "";
            sendTelegramMessage(null, userId + ":" + visitorName + " " + msg.text);
        });

        client.on('disconnect', function(){
            if (messageReceived) {
                sendTelegramMessage(null, userId + " отключился");
            }
        });
    });

});

function sendTelegramMessage(chatId, text, parseMode) {
    chatIds = chatId === null ? process.env.CHAT_IDS.split(",") : [chatId];
    chatIds.forEach(function(id) {
        request
            .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
            .form({
                "chat_id": id,
                // "chat_id": process.env.CHAT_ID,
                "text": text,
                "parse_mode": parseMode
            });
    });
}

app.post('/usage-start', cors(), function(req, res) {
    console.log('usage from', req.query.host);
    res.statusCode = 200;
    res.end();
});

// left here until the cache expires
app.post('/usage-end', cors(), function(req, res) {
    res.statusCode = 200;
    res.end();
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
