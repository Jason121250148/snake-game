import io from "../io";

import GameController from "../logic/GameController";

const gameCenter = io.of("/game-center");
let memberCounter = 0;
let roomName = "";
const rooms = new Map();
gameCenter.on("connection", socket => {
    memberCounter++;
    _onClickEvent(socket);
    if (memberCounter % 2 === 0)
    {
        roomName = getRoomName();
        socket.join(roomName);
        rooms.get(roomName).push(socket);
        socket.emit("initPlayer", {
            player: "Player1"
        });
        let timeCount = 3;
        const intervalID = setInterval(() => {
            roomName = getRoomName();
            gameCenter.to(roomName).emit("count", {
                time: timeCount--
            });
            if (!timeCount)
            {
                roomName = getRoomName();
                gameCenter.to(roomName).emit("redirect");
                clearInterval(intervalID);
            }
        }, 1000);
        const gameController = new GameController(25, 40, gameCenter, roomName);
        (rooms.get(roomName)).forEach(item => {
            item.gameController = gameController;
        });
        gameController.snakeAutoRun();
    }
    else
    {
        roomName = getRoomName();
        socket.join(roomName);
        rooms.set(roomName, [socket]);
        socket.emit("initPlayer", {
            player: "Player2"
        });
    }
});

const getRoomName = () => {
    return "room" + Math.floor((memberCounter-1)/2);
};

const _onClickEvent = (socket) => {
    socket.on("click", info => {
        socket.gameController.playerClick(info);
    });
};
