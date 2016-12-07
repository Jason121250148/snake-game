export default class GamePanel
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this._init();
        this._initSocketEvent();
        this._initSnake();
        this._initBean();
        this._initListener();
        this.render();
    }

    _init()
    {
        this.length = 15;
        this.cubes = new Array();
        this.gamePanel = document.getElementById("game-panel");
        this.gamePanel.width = this.y * this.length;
        this.gamePanel.height = this.x * this.length;
        this.panel2d = this.gamePanel.getContext("2d");
        this.socket = io.connect("/game-center");

        this.keyMap = {
            37: "left",
            38: "top",
            39: "right",
            40: "down",
            65: "left2",
            87: "top2",
            68: "right2",
            83: "down2"
        };
        this.tempDirectionCode = 37;
        this.tempDirectionCode_2 = 68;
        this.directionCode = 37;
        this.directionCode_2 = 68;
        this.intervalID = null;
    }

    _initSocketEvent()
    {
        this.socket.on("init", info => {
            if (info.waitPlayer)
            {

            }
        });
    }

    _initSnake()
    {
        this.snake1 = new Array();
        this.snake2 = new Array();
        for(let i = 10; i <= 20; i++)
        {
            this.snake1.push([10,i]);
        }
        for(let i = 20; i >= 10; i--)
        {
            this.snake2.push([15,i]);
        }
    }

    _initBean()
    {
        this.bean = this._generateBean();
    }

    _initListener()
    {
        $(document).keydown(event => {
            if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)
            {
                if (this.directionCode !== event.keyCode)
                {
                    if (!(this.directionCode - 2 === event.keyCode || this.directionCode + 2 === event.keyCode))
                    {
                        this.tempDirectionCode = event.keyCode;
                    }
                }
            }
            else
            {
                if (this.directionCode_2 !== event.keyCode)
                {
                    if (!(this.directionCode_2 - 3 === event.keyCode || this.directionCode_2 + 3 === event.keyCode || this.directionCode_2 - 4 === event.keyCode || this.directionCode_2 + 4 === event.keyCode))
                    {
                        this.tempDirectionCode_2 = event.keyCode;
                    }
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
        this.panel2d.fillStyle = "blue";
        this.snake2.forEach(item => {
            this.panel2d.fillRect(item[1] * this.length, item[0] * this.length, this.length, this.length);
        });

        //画豆子
        this.panel2d.fillStyle = "red";
        this.panel2d.fillRect(this.bean[1] * this.length, this.bean[0] * this.length, this.length, this.length);
    }

    snakeAutoRun()
    {
        this.intervalID = window.setInterval(this._goNext.bind(this), 300);
    }

    _goNext()
    {
        let pos0, pos1, pos0_2, pos1_2, nextStep, nextStep_2;
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
        switch (this.keyMap[this.directionCode_2]) {
            case "left2":
                pos0_2 = this.snake2[0][0];
                pos1_2 = this.snake2[0][1] - 1;
                break;
            case "top2":
                pos0_2 = this.snake2[0][0] - 1;
                pos1_2 = this.snake2[0][1];
                break;
            case "right2":
                pos0_2 = this.snake2[0][0];
                pos1_2 = this.snake2[0][1] + 1;
                break;
            case "down2":
                pos0_2 = this.snake2[0][0] + 1;
                pos1_2 = this.snake2[0][1];
                break;
        }
        nextStep_2 = [pos0_2, pos1_2];

        //1. 判断snake1是否死亡
        if (!this._checkIfSnake1Die(nextStep))
        {
            //2. 判断snake1是否吃到了豆子
            if (this._checkSnake1EatBean(nextStep))
            {
                this.snake1.unshift(nextStep);
                this.bean = this._generateBean();
            }
            else
            {
                this.snake1.pop();
                this.snake1.unshift(nextStep);
            }
            this.directionCode = this.tempDirectionCode;
            this.render();
        }
        else
        {
            alert("Player1 die, Player2 win!");
            window.clearInterval(this.intervalID);
            return;
        }
        //3. 判断snake2是否死亡
        if (!this._checkIfSnake2Die(nextStep_2))
        {
            //4. 判断snake2是否吃到了豆子
            if (this._checkSnake2EatBean(nextStep_2))
            {
                this.snake2.unshift(nextStep_2);
                this.bean = this._generateBean();
            }
            else
            {
                this.snake2.pop();
                this.snake2.unshift(nextStep_2);
            }
            this.directionCode_2 = this.tempDirectionCode_2;
            this.render();
        }
        else
        {
            alert("Player2 die, Player1 win!");
            window.clearInterval(this.intervalID);
            return;
        }
    }

    _checkIfSnake1Die(nextStep)
    {
        return this._checkIfDie(nextStep);
    }

    _checkIfSnake2Die(nextStep)
    {
        return this._checkIfDie(nextStep);
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
        this.snake2.forEach(item => {
            if (item.toString() === nextStep.toString())
            {
                isDie = true;
            }
        });
        return isDie;
    }

    _checkSnake1EatBean(nextStep)
    {
        return this._checkEatBean(nextStep);
    }

    _checkSnake2EatBean(nextStep)
    {
        return this._checkEatBean(nextStep);
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
        let isBeanAvail = true;
        let newBean = [pos0, pos1];
        this.snake1.forEach(item => {
            if (newBean[0] === item[0] && newBean[1] === item[1])
            {
                isBeanAvail = false;
            }
        });
        this.snake2.forEach(item => {
            if (newBean[0] === item[0] && newBean[1] === item[1])
            {
                isBeanAvail = false;
            }
        });
        if (isBeanAvail)
        {
            return newBean;
        }
        else
        {
            return this._generateBean();
        }
    }
}
