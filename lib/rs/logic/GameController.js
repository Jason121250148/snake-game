export default class GameController
{
    constructor(x, y, gameCenter, roomName)
    {
        setTimeout(()=>{},0);
        this.x = x;
        this.y = y;
        this.gameCenter = gameCenter;
        this.roomName = roomName;
        this._init();
        this._initSnake();
        this._initBean();
        this._initGamePanel();
    }

    _init()
    {
        this.length = 15;
        this.cubes = new Array();

        this.keyMap = {
            37: "left",
            38: "top",
            39: "right",
            40: "down",
        };
        this.directionCode = 37;
        this.directionCode_2 = 39;
        this.intervalID = null;
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

    playerClick(info)
    {
        if (info.player === "Player1")
        {
            if (this.directionCode !== info.keyCode)
            {
                if (!(this.directionCode - 2 === info.keyCode || this.directionCode + 2 === info.keyCode))
                {
                    this.directionCode = info.keyCode;
                }
            }
        }
        else if (info.player === "Player2")
        {
            if (this.directionCode_2 !== info.keyCode)
            {
                if (!(this.directionCode_2 - 2 === info.keyCode || this.directionCode_2 + 2 === info.keyCode))
                {
                    this.directionCode_2 = info.keyCode;
                }
            }
        }
    }

    _initGamePanel()
    {
        this.gameCenter.to(this.roomName).emit("init", {
            x: this.x,
            y: this.y,
            snake1: this.snake1,
            snake2: this.snake2,
            bean: this.bean,
        });
    }

    snakeAutoRun()
    {
        this.intervalID = setInterval(this._goNext.bind(this), 300);
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
            case "left":
                pos0_2 = this.snake2[0][0];
                pos1_2 = this.snake2[0][1] - 1;
                break;
            case "top":
                pos0_2 = this.snake2[0][0] - 1;
                pos1_2 = this.snake2[0][1];
                break;
            case "right":
                pos0_2 = this.snake2[0][0];
                pos1_2 = this.snake2[0][1] + 1;
                break;
            case "down":
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
                this.gameCenter.to(this.roomName).emit("newBean", {
                    bean: this.bean
                });
            }
            else
            {
                this.snake1.pop();
                this.snake1.unshift(nextStep);
            }
            this.gameCenter.to(this.roomName).emit("nextStep", {
                snake1: this.snake1,
                snake2: this.snake2
            });
        }
        else
        {
            this.gameCenter.to(this.roomName).emit("gameOver", {
                win: "Player2",
                die: "Player1"
            });
            clearInterval(this.intervalID);
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
                this.gameCenter.to(this.roomName).emit("newBean", {
                    bean: this.bean
                });
            }
            else
            {
                this.snake2.pop();
                this.snake2.unshift(nextStep_2);
            }
            this.gameCenter.to(this.roomName).emit("nextStep", {
                snake1: this.snake1,
                snake2: this.snake2
            });
        }
        else
        {
            this.gameCenter.to(this.roomName).emit("gameOver", {
                win: "Player1",
                die: "Player2"
            });
            clearInterval(this.intervalID);
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
