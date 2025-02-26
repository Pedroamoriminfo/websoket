
const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
let rooms = {}; // Armazena as salas
//let player = {};
server.on("connection", (ws) => {
    console.log("Novo jogador conectado!");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        console.log("chegou msg");
        console.log(data.type);
        if (data.type === "create_room") {   console.log("type create room");
            let { room_id, player } = data;
            if (rooms[room_id]) {
                ws.send(JSON.stringify({ type: "error", message: "Sala já existe!" }));
                return;
            }

            rooms[room_id] = { dealer: ws, players: [] };
            ws.send(JSON.stringify({ type: "room_created", room_id, message: "Você é o Dealer!" }));
            console.log(rooms[room_id].dealer instanceof WebSocket);
            console.log(`Estado da conexão WebSocket: ${rooms[room_id].dealer.readyState}`);
            console.log(`Dealer ${player.name} criou a sala ${room_id}`);
            //rooms[room_id].dealer.send("Mensagem de teste para o Dealer"); funcional
           // console.log(JSON.stringify(rooms[room_id].dealer));
        }

        if (data.type === "join_room") {
            if (!rooms[data.room]) {
                ws.send(JSON.stringify({ type: "error", message: "Sala não encontrada!" }));
                return;
            }

            rooms[data.room].players.push(ws);
            ws.send(JSON.stringify({ type: "joined",  message: "Você entrou na sala!" }));
            console.log(`${player.name} entrou na sala ${room_id}`);
        }

        if (data.type === "deal_card") {
            
            let { room_id, card_left, card_right } = data;
            if (!rooms[room_id]) {
                ws.send(JSON.stringify({ type: "error", message: "Você não é o Dealer!" }));
                console.log(room_id, card_left, card_right);
                return;
            }

            rooms[data.room_id].players.forEach(player => {
                player.send(JSON.stringify({ type: "receive_card", card_left, card_right }));
            });

            console.log(`Dealer enviou carta ${card_left} e ${card_right} para todos na sala ${room_id}`);
        }

        if (data.type === "deal_winner") {
            let { room_id, card_winner } = data;
            if (!rooms[room_id]) {
                ws.send(JSON.stringify({ type: "error", message: "Você não é o Dealer!" }));
                console.log(room_id, card_left, card_right);
                return;
            }
            rooms[data.room_id].players.forEach(player => {
                player.send(JSON.stringify({ type: "receive_winner", card_winner }));
            });
            console.log(`Dealer escolheu a carta ${card_winner} como vencedora `);
        }
    });

    ws.on("close", () => {
        console.log("Um jogador desconectou");
    });
});

console.log("Servidor WebSocket rodando na porta 8080");