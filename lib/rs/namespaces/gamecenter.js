import io from "../io";

const gameCenter = io.of("/game-center");
let memberCounter = 0;
let roomName = "";
gameCenter.on("connection", function(socket) {
    memberCounter++;
    if (memberCounter % 2 === 0)
    {
        roomName = getRoomName();
        socket.join(roomName);
        console.log(roomName);
        let timeCount = 3;
        const intervalID = setInterval(() => {
            roomName = getRoomName();
            gameCenter.to(roomName).emit("count", {
                time: timeCount--
            });
            if (!timeCount)
            {
                roomName = getRoomName();
                gameCenter.to(roomName).emit("begin");
                clearInterval(intervalID);
            }
        }, 1000);
    }
    else
    {
        roomName = getRoomName();
        socket.join(roomName);
        console.log(roomName);
    }
});

const getRoomName = () => {
    return "room" + Math.floor((memberCounter-1)/2);
};
