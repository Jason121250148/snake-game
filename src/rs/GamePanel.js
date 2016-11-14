export default class GamePanel
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this._init();
        this._initSnake();
        this._initBean();
        this._initListener();
        this.render();
        this.snakeAutoRun();
    }

    _init()
    {
        this.length = 15;
        this.cubes = new Array();
        this.gamePanel = document.getElementById("game-panel");
        this.gamePanel.width = this.y * this.length;
        this.gamePanel.height = this.x * this.length;
        this.panel2d = this.gamePanel.getContext("2d");

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

    _initBean()
    {
        this.bean = this._generateBean();
    }

    _initListener()
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

        //画豆子
        this.panel2d.fillStyle = "red";
        this.panel2d.fillRect(this.bean[1] * this.length, this.bean[0] * this.length, this.length, this.length);
    }

    snakeAutoRun()
    {
        this.intervalID = window.setInterval(this._goNext.bind(this), 200);
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
        //1. 判断是否死亡
        if (!this._checkIfDie(nextStep))
        {
            //2. 判断是否吃到了豆子
            if (this._checkEatBean(nextStep))
            {
                this.snake1.unshift(nextStep);
                this.bean = this._generateBean();
            }
            else
            {
                this.snake1.pop();
                this.snake1.unshift(nextStep);
            }
            this.render();
        }
        else
        {
            alert("You die!");
            window.clearInterval(this.intervalID);
            return;
        }
    }

    _checkIfDie(nextStep)
    {
        let isDie = false;
        if (nextStep[0] === -1 || nextStep[0] === this.x || nextStep[1] === -1 || nextStep[1] === this.y)
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

    _checkEatBean(nextStep)
    {
        let eatBean = false;
        if (this.bean[0] === nextStep[0] && this.bean[1] === nextStep[1])
        {
            eatBean = true;
        }
        return eatBean;
    }

    _generateBean()
    {
        let pos0 = Math.floor(Math.random() * this.x);
        let pos1 = Math.floor(Math.random() * this.y);
        return [pos0, pos1];
    }
}
