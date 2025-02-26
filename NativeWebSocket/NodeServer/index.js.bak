const WebSocket = require("ws");

const server = new WebSocket.Server({port: 8080 });

server.on("connection", (socket) => {
    console.log("Novo cliente conectado!");

    socket.on("message", (message) => {
        console.log("Mensagem recebida:", message);

        // Reenviar para todos os clientes conectados
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                 client.send('Eco do servidor: ${message}');
            }
        });
    });

    socket.on("close", () => console.log("Cliente desconectado"));
});

console.log("Servidor WebSocket rodando na porta 8080...");
