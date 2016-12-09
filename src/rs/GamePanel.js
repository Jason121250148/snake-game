export default class GamePanel
{
    constructor()
    {
        this._initSocketEvent();
        this._initListener();
    }

    _initPanel()
    {
        this.length = 15;
        this.cubes = new Array();
        this.gamePanel = document.getElementById("game-panel");
        this.gamePanel.width = this.y * this.length;
        this.gamePanel.height = this.x * this.length;
        this.panel2d = this.gamePanel.getContext("2d");

        this.intervalID = null;
    }

    _initSocketEvent()
    {
        this.socket = io.connect("/game-center");
        this.socket.on("initPlayer", info => {
            this.player = info.player;
            $("#info-panel").html("You are " + this.player);
        });
        this.socket.on("init", info => {
            this.x = info.x;
            this.y = info.y;
            this.snake1 = info.snake1;
            this.snake2 = info.snake2;
            this.bean = info.bean;
            this._initPanel();
            this.render();
        });
        this.socket.on("nextStep", info => {
            this.snake1 = info.snake1;
            console.log(this.snake1);
            this.snake2 = info.snake2;
            this.render();
        });
        this.socket.on("newBean", info => {
            this.bean = info.bean;
        });
        this.socket.on("gameOver", info => {
            if (info.win === this.player)
            {
                $("#info-panel").html("YOU WIN!");
            }
            else
            {
                $("#info-panel").html("YOU LOSE!");
            }
        });
    }

    _initListener()
    {
        $(document).keydown(this._fireClickEvent.bind(this));
    }

    _fireClickEvent(event)
    {
        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)
        {
            this.socket.emit("click", {
                player: this.player,
                keyCode: event.keyCode
            });
        }
    }

    render()
    {
        //clear
        for(let i = 0; i < this.x; i++)
        {
            for(let j = 0; j < this.y; j++)
            {
                this.panel2d.fillStyle = 'rgb(' + Math.floor(255 - 5 * i) + ',' + Math.floor(255 - 2 * j) + ',0)';
                this.panel2d.fillRect(j * this.length, i * this.length, this.length, this.length);
            }
        }

        //画蛇
        this.panel2d.fillStyle = "green";
        this.snake1.forEach(item => {
            this.panel2d.fillRect(item[1] * this.length, item[0] * this.length, this.length, this.length);
        });
        this.panel2d.fillStyle = "blue";
        this.snake2.forEach(item => {
            this.panel2d.fillRect(item[1] * this.length, item[0] * this.length, this.length, this.length);
        });

        //画豆子
        this.panel2d.fillStyle = "red";
        this.panel2d.fillRect(this.bean[1] * this.length, this.bean[0] * this.length, this.length, this.length);
    }
}
