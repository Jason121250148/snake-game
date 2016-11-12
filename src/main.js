import Snake from "./rs/Snake.js";
import GamePanel from "./rs/GamePanel.js";

require("./res/main.less");

const mySnake = new Snake("Jason's snake");
const gamePanel = new GamePanel(40, 100);

mySnake.sayName();
