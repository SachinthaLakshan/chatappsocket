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
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, user }) => {
		console.log("callUser worked!",{ userToCall,  from, user });
		io.to(userToCall).emit("callUser", { signal: signalData, from, user });
	});

	socket.on("answerCall", (data) => {
		console.log("answerCall worked!",data);
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(process.env.PORT || 9001, () => console.log("server is running on port 9001"))
