const express = require("express");
const app = express();

const http = require("http");
const path = require("path");

const socketio = require("socket.io");
// main method for server in socketio
const server = http.createServer(app);

const io = socketio(server);
// setup ejs template engine convert js data to html
app.set("view engine", "ejs");
// setup public folder so thaht we can access static files like css ,js, images nd vanilla js files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  // accept location on backend and send it to frontend with the help of socket -- io.emit se jitne log jude honge utne logo ko unki location dikhegi
  socket.on("send-location",function(data){
  io.emit("recieve-location",{id:socket.id ,...data})
  })
  // if user disconnects then send it to frntend ki user discon..
  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });

});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000, function () {
  console.log("server is running on port 3000");
});
