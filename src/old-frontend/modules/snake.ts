let randomNum = function(low : number, high : number){
    return Math.floor(Math.random() * (high - low)) + low;
}

let createCoordinates2D = function(initX : number|null , initY : number|null) : Coordinates2D{
    return {
        x : initX == null ? 0 : initX,
        y : initY == null ? 0 : initY
    }
}

const DIRECTIONS = {
    Up : createCoordinates2D(0,-1),
    Right : createCoordinates2D(1,0),
    Down : createCoordinates2D(0,1),
    Left : createCoordinates2D(-1,0),
    None : createCoordinates2D(0,0)
}

// Coordinates2D implementation
interface Coordinates2D {
    x : number;
    y : number;
}

let add = function(pos1 : Coordinates2D|null, pos2 : Coordinates2D|null) : Coordinates2D|null{
    return (pos1 == null || pos2 == null) ? null : {x: pos1.x + pos2.x, y: pos1.y + pos2.y};
}

let equal = function(pos1 : Coordinates2D|null, pos2 : Coordinates2D|null) : boolean{
    return (pos1 == null || pos2 == null) ? false : !!((pos1.x == pos2.x) && (pos1.y == pos2.y));
}

// CONTROL implementation
interface Control {
    drawSnake(snake : SnakePlayer) : void,
    drawFood(food : Coordinates2D) : void,
    clear() : void,
    update() : void,
    isUpdated() : boolean,
    getUpdate() : Coordinates2D
}

interface Control2D extends Control {

}

let createControl2D = function(canvas : HTMLCanvasElement, context : CanvasRenderingContext2D) : Control2D {
    let _unit : number = 20;
    let _canvas : HTMLCanvasElement = canvas;
    let _context : CanvasRenderingContext2D = context;
    let _bounds : Coordinates2D|null = null;
    let _updated : boolean = true;
    let update = function() {
        if(_canvas != null){
            let bounding = _canvas.getBoundingClientRect();
            _canvas.setAttribute('width', bounding.width + 'px');
            _canvas.setAttribute('height', bounding.height + 'px');
            // set _bounds
            let xbound = Math.floor(bounding.width / _unit);
            xbound  = (xbound % 2) == 0 ? xbound / 2 : (xbound - 1) /2;
            let ybound = Math.floor(bounding.height / _unit);
            ybound  = (ybound % 2) == 0 ? ybound / 2 : (ybound - 1) /2;
            _bounds = createCoordinates2D(xbound, ybound);
        }
    }
    _canvas.addEventListener("animationend", update);
    return {
        drawSnake : function(snake : SnakePlayer) {
            if(_bounds != null){
                let head = snake.getHead();
                if (head != null){
                    if((Math.abs(head.x) > _bounds.x) || (Math.abs(head.y) > _bounds.y)) {
                        snake.kill();
                    }
                }
                snake.getBody().map(function(piece : Coordinates2D){
                    _context.fillStyle = "green";
                    // @ts-ignore
                    _context.fillRect((piece.x + _bounds.x) * _unit, (piece.y + _bounds.y) * _unit, _unit, _unit)
                });
            }
        },
        drawFood : function(food : Coordinates2D){
            if(_bounds != null){
                _context.fillStyle = "yellow";
                //_context.fillRect((food.x + _bounds.x) * _unit, (food.y + _bounds.y) * _unit, _unit, _unit);
                _context.beginPath();
                _context.ellipse(((food.x + _bounds.x) * _unit) + (_unit/2), ((food.y + _bounds.y) * _unit) + (_unit/2), _unit / 2, _unit / 2,0,0,360);
                _context.closePath();
                _context.fill();
            }
        },
        clear : function() {
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
        },
        update : function() {
            update();
            _updated = true;
        },
        isUpdated : function() : boolean {
            return _updated;
        },
        getUpdate : function() : Coordinates2D {
            return _bounds as Coordinates2D;
        }
    }
}


// SNAKEPLAYER implementation
enum Status {
    Alive,
    Dead,
}

type SnakeBody = Coordinates2D[];

interface SnakePlayer  {
    _body: SnakeBody,
    _direction: Coordinates2D,
    _canTurn: boolean,
    _grow: boolean,
    _status: Status,
    move() : void,
    changeDirection(newDir : Coordinates2D) : void,
    getBody() : SnakeBody,
    getHead() : Coordinates2D|null,
    setHead(newHead : Coordinates2D) : void,
    grow() : void,
    kill() : void,
    isDead() : boolean
}

let createSnakePlayer = function(pos : Coordinates2D|null, dir : Coordinates2D|null) : SnakePlayer{
    return {
        _body: pos == null ? [createCoordinates2D(0,0)] : [pos],
        _direction: dir == null ? DIRECTIONS.None : dir,
        _canTurn: true,
        _grow : false,
        _status: Status.Alive,
        move: function() : void{
            if(this._status == Status.Alive && (!equal(this._direction, DIRECTIONS.None))){
                // create the new head
                let next = add(this._body[0], this._direction);
                if(next != null) {
                    this._body.unshift(next);
                    if (this._body.slice(1,this._body.length).some((val) => {return equal(val,next);})){
                        this.kill();
                    }
                }
                this._canTurn = true;
                // pop the tail off if we aren't growing
                if (this._grow) {this._grow = false; return }
                this._body.pop();
            }
        },
        changeDirection: function(newDir : Coordinates2D) : void{
            if(this._canTurn && (this._body[0]!=null) && !equal(add(newDir,this._body[0]),this._body[1])){
                this._direction = newDir;
                this._canTurn = false;
            }
        },
        getBody: function() : SnakeBody {
            return this._body;
        },
        getHead: function() : Coordinates2D|null {
            return this._body[0];
        },
        setHead: function(newHead : Coordinates2D) : void {
            this._body[0] = newHead;
        },
        grow: function() : void {
            this._grow = true;
        },
        kill: function() : void {
            this._status = Status.Dead;
        },
        isDead: function() : boolean {
            return this._status == Status.Dead;
        }
    }
}

interface SnakeGame {
    start(ctrl : Control) : Promise<number>,
}

interface SinglePlayerSnake extends SnakeGame {
    getPlayer() : SnakePlayer
}

let createSinglePlayerSnake = function() : SinglePlayerSnake {
    let setPlayerControls = function(player : SnakePlayer){
        window.addEventListener("keydown", function (event) {
            switch(event.code){
                case "ArrowUp":
                case "KeyW":
                    player.changeDirection(DIRECTIONS.Up);
                    break;
                case "ArrowRight":
                case "KeyD":
                    player.changeDirection(DIRECTIONS.Right);
                    break;
                case "ArrowDown":
                case "KeyS":
                    player.changeDirection(DIRECTIONS.Down);
                    break;
                case "ArrowLeft":
                case "KeyA":
                    player.changeDirection(DIRECTIONS.Left);
                    break;
                default:
                    return;
            }
            event.preventDefault();
        }, true);
    }
    let getNewFood = function() : Coordinates2D {
        let getFoodOption = () => {return createCoordinates2D(randomNum(-_bounds.x, _bounds.x), randomNum(-_bounds.y, _bounds.y));};
        let newFood = getFoodOption();
        while(player.getBody().some((val) => {return equal(val,newFood);})){
            newFood = getFoodOption();
        }
        return newFood;
    }
    let control : Control | null = null;
    let _bounds : Coordinates2D = createCoordinates2D(10,10);
    let player : SnakePlayer = createSnakePlayer(null, DIRECTIONS.None);
    let food : Coordinates2D = getNewFood();
    let delay : number = 100;
    let loop = async function() : Promise<number> {
        if (control != null){
            if (control.isUpdated()) {
                _bounds = control.getUpdate();
                if((Math.abs(food.x) > _bounds.x) || (Math.abs(food.y) > _bounds.y)) {
                    food = getNewFood();
                }
            }
            player.move();
            if(equal(player.getHead(),food)){
                player.grow()
                food = getNewFood();
            }
            control.clear();
            control.drawSnake(player);
            control.drawFood(food);
            if(player.isDead()){
                return player.getBody().length;
            }
            setTimeout(loop, delay);
        }
        return 0;
    }
    return {
        start: async function(ctrl : Control) : Promise<number> {
            control = ctrl;
            setPlayerControls(player);
            control.update();
            let score = await loop();
            return score;
        },
        getPlayer: function() : SnakePlayer {
            return player;
        }
    }
}

export default {
    createSinglePlayerSnake,
    createControl2D
}
