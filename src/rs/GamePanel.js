export default class GamePanel
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this._init();
        this._initPanel();
        this._initSnake();
        this._initBeans();
        this.vender();
        this.snakeRun();
    }

    _init()
    {
        this.length = 10;
        this.cubes = new Array();
        this.gamePanel = $(".game-panel")[0];
    }

    _initSnake()
    {
        this.snake1 = new Array();
        this.snake2 = new Array();
        //1表示1号玩家的蛇
        //2表示2号玩家的蛇
        for(let i = 10; i < 20; i++)
        {
            this.snake1.push([10,i]);
            // this.cubes[10][i] = 1;
        }
    }

    _initBeans()
    {
        //100表示豆子
        this.beans = new Array();
        this.beans.push([10,5]);
    }

    _initPanel()
    {
        this.panel2d = this.gamePanel.getContext("2d");
        $(this.gamePanel).css({
            "height": this.x * this.length,
            "width": this.y * this.length
        });
    }

    vender()
    {
        //clear
        for(let i = 0; i < this.x; i++)
        {
            for(let j = 0; j < this.y; j++)
            {
                this.panel2d.fillStyle = "black";
                this.panel2d.fillRect(j * this.length, i * this.length, this.length, this.length);

            }
        }
        //画蛇
        this.panel2d.fillStyle = "green";
        this.snake1.forEach(item => {
            this.panel2d.fillRect(item[1] * this.length, item[0] * this.length, this.length, this.length);
        });

        //画豆子
        this.panel2d.fillStyle = "red";
        this.beans.forEach(bean => {
            this.panel2d.fillRect(bean[1] * this.length, bean[0] * this.length, this.length, this.length);
        });
    }

    snakeRun()
    {
        let i = 4;
        window.setInterval(() => {
            this.snake1.pop();
            this.vender();
        }, 1000);
    }
}
