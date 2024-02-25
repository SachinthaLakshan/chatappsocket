const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origins: ['*']
	}
});

app.use("/",
	async (req, res, next) => {
		res.write(`<h1>Socket IO Start on Port : ${process.env.PORT || 9001}</h1>`);
		res.end();
	}
);

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		console.log("end user:",data.userToCall);
		console.log("from user:",data.from);
		io.emit(`callUser-${data.userToCall}`, { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.emit(`callAccepted-${data.to}`, data.signal)
	})
})

server.listen(process.env.PORT || 9001, () => console.log("server is running on port 9001"))
