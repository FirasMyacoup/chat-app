const app = require("express")();
const server = require("http").createServer(app);
const PORT = 3001;
const uuid = require("uuid");
const io = require("socket.io")(server);

let users = [];
let rooms = [];

io.on("connection", (socket) => {
 console.log(`User connected: ${socket.id}`);

 socket.emit("me", socket.id);
 users.push(socket.id);

 socket.on("disconnect", () => {
  console.log(`User ${socket.id} disconnected.`);
  users = users.filter((user) => user !== socket.id);
  console.log(users);
  socket.disconnect();
 });

 socket.emit("getAllUsers", users);
 console.log(users);

 socket.on("create_room", () => {
  const room = {
   id: uuid.v4(),
   capacity: 10,
   usersJoined: [socket.id],
   chat: [],
  };
  socket.join(room);
  socket.emit("get_room", room);
  console.log("Room created: " + room.id);
  rooms.push(room);
 });

 socket.on("join_room", (room) => {
  socket.join(room.id);
  console.log(`user ${socket.id} joined room: ${room.id}`);
 });
 socket.emit("getAllRooms", rooms);

 socket.on("message", (payload) => {
  console.log(`Message from ${socket.id} : ${payload.message}`);
  rooms.map((room) => {
   if (room.id === payload.room) {
    singleChat = { message: payload.message, writer: payload.socketId };
    room.chat.push(singleChat);
    payload.chat = room.chat;
   }
  });

  io.to(payload.room).emit("chat", payload);
 });
});

server.listen(PORT, () => {
 console.log(`Server on port ${PORT}`);
});