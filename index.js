const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	// cors: {
	// 	origin: "*",
	// 	methods: [ "GET", "POST" ]
	// }
})

app.use("/test",
	async (req, res, next) => {
		return res.status(200).json({
			title: "Express Testing",
			message: "The app is working properly!",
		});
	}
);

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(process.env.PORT || 9001, () => console.log("server is running on port 5000"))
