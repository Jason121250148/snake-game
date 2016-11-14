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
        this._initListen();
        this.vender();
        this.snakeAutoRun();
    }

    _init()
    {
        this.length = 10;
        this.cubes = new Array();
        this.gamePanel = $(".game-panel")[0];

        this.keyMap = {
            37: "left",
            38: "top",
            39: "right",
            40: "down"
        };
        this.directionCode = 37;
        this.intervalID = null;
    }

    _initSnake()
    {
        this.snake1 = new Array();
        this.snake2 = new Array();
        for(let i = 10; i < 20; i++)
        {
            this.snake1.push([10,i]);
        }
    }

    _initBeans()
    {
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

    _initListen()
    {
        $(document).keydown(event => {
            if (this.directionCode !== event.keyCode)
            {
                if (!(this.directionCode - 2 === event.keyCode || this.directionCode + 2 === event.keyCode))
                {
                    this.directionCode = event.keyCode;
                }
            }
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

    snakeAutoRun()
    {
        this.intervalID = window.setInterval(this._goNext.bind(this), 500);
    }

    _goNext()
    {
        let pos0, pos1, nextStep;
        switch (this.keyMap[this.directionCode]) {
            case "left":
                pos0 = this.snake1[0][0];
                pos1 = this.snake1[0][1] - 1;
                break;
            case "top":
                pos0 = this.snake1[0][0] - 1;
                pos1 = this.snake1[0][1];
                break;
            case "right":
                pos0 = this.snake1[0][0];
                pos1 = this.snake1[0][1] + 1;
                break;
            case "down":
                pos0 = this.snake1[0][0] + 1;
                pos1 = this.snake1[0][1];
                break;
        }
        nextStep = [pos0, pos1];
        if (!this._checkDie(nextStep))
        {
            this.snake1.pop();
            this.snake1.unshift(nextStep);
            this.vender();
        }
        else
        {
            alert("You die!");
            window.clearInterval(this.intervalID);
            return;
        }
    }

    _checkDie(nextStep)
    {
        let isDie = false;
        if (nextStep[0] === -1 || nextStep[0] === 41 || nextStep[0] === 101 || nextStep[1] === -1 || nextStep[1] === 41 || nextStep[1] === 101)
        {
            isDie = true;
        }
        this.snake1.forEach(item => {
            if (item.toString() === nextStep.toString())
            {
                isDie = true;
            }
        });
        return isDie;
    }
}
