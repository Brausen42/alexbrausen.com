<template>
    <div>
        <canvas id="snake-game" class="gameDisplay"></canvas>
        <div class="gameDisplay">
            <h1 v-if="!active">Snake</h1>
            <p v-if="!active">Use the arrow keys, or WASD to navigate!</p>
            <button v-on:click="startGame" v-if="!active" id="start">Start</button>
            <h2 v-if="score != null">Final Score: {{score}}</h2>
            <h2 style="color:red;" v-if="isJosalin && (score != null)">Great job Josalin!! I love you :)</h2>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"; 

let randomNum = function(low : number, high : number){
    return Math.floor(Math.random() * (high - low)) + low;
}

// COORDINATES implementation
interface Coordinates {
    x : number;
    y : number;
}

let createCoordinates = function(initX : number|null , initY : number|null) : Coordinates{
    return {
        x : initX == null ? 0 : initX,
        y : initY == null ? 0 : initY
    }
}

let add = function(pos1 : Coordinates|null, pos2 : Coordinates|null) : Coordinates|null{
    return (pos1 == null || pos2 == null) ? null : {x: pos1.x + pos2.x, y: pos1.y + pos2.y};
}

let equal = function(pos1 : Coordinates|null, pos2 : Coordinates|null) : boolean{
    return (pos1 == null || pos2 == null) ? false : !!((pos1.x == pos2.x) && (pos1.y == pos2.y));
}

// CONTROL implementation
interface Control {
    drawSnake(snake : SnakePlayer) : void,
    drawFood(food : Coordinates) : void,
    clear() : void,
    update() : void,
    isUpdated() : boolean,
    getUpdate() : Coordinates
}

interface Control2D extends Control {

}

let createControl2D = function(canvas : HTMLCanvasElement, context : CanvasRenderingContext2D) : Control2D {
    let _unit : number = 20;
    let _canvas : HTMLCanvasElement = canvas;
    let _context : CanvasRenderingContext2D = context;
    let _bounds : Coordinates|null = null;
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
            _bounds = createCoordinates(xbound, ybound);
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
                snake.getBody().map(function(piece : Coordinates){
                    _context.fillStyle = "green";
                    // @ts-ignore
                    _context.fillRect((piece.x + _bounds.x) * _unit, (piece.y + _bounds.y) * _unit, _unit, _unit)
                });
            }
        },
        drawFood : function(food : Coordinates){
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
        getUpdate : function() : Coordinates {
            return _bounds as Coordinates;
        }
    }
}


// SNAKEPLAYER implementation
enum Status {
    Alive,
    Dead,
}

type SnakeBody = Coordinates[];

interface SnakePlayer  {
    _body: SnakeBody,
    _direction: Coordinates,
    _canTurn: boolean,
    _grow: boolean,
    _status: Status,
    move() : void,
    changeDirection(newDir : Coordinates) : void,
    getBody() : SnakeBody,
    getHead() : Coordinates|null,
    setHead(newHead : Coordinates) : void,
    grow() : void,
    kill() : void,
    isDead() : boolean
}

let createSnakePlayer = function(pos : Coordinates|null, dir : Coordinates|null) : SnakePlayer{
    return {
        _body: pos == null ? [createCoordinates(0,0)] : [pos],
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
        changeDirection: function(newDir : Coordinates) : void{
            if(this._canTurn && (this._body[0]!=null) && !equal(add(newDir,this._body[0]),this._body[1])){
                this._direction = newDir;
                this._canTurn = false;
            }
        },
        getBody: function() : SnakeBody {
            return this._body;
        },
        getHead: function() : Coordinates|null {
            return this._body[0];
        },
        setHead: function(newHead : Coordinates) : void {
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
    let getNewFood = function() : Coordinates {
        let getFoodOption = () => {return createCoordinates(randomNum(-_bounds.x, _bounds.x), randomNum(-_bounds.y, _bounds.y));};
        let newFood = getFoodOption();
        while(player.getBody().some((val) => {return equal(val,newFood);})){
            newFood = getFoodOption();
        }
        return newFood;
    }
    let control : Control | null = null;
    let _bounds : Coordinates = createCoordinates(10,10);
    let player : SnakePlayer = createSnakePlayer(null, DIRECTIONS.None);
    let food : Coordinates = getNewFood();
    let delay : number = 100;
    let loop = function(res : any, rej : any) : void {
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
                res(player.getBody().length);
                return;
            }
            setTimeout(loop, delay, res, rej);
        } else {
            res(0);
            return;
        }
    }
    return {
        start: function(ctrl : Control) : Promise<number> {
            control = ctrl;
            setPlayerControls(player);
            control.update();
            let scoreProm = new Promise<number>(function(res,rej){
                loop(res,rej);
            });
            return scoreProm;
        },
        getPlayer: function() : SnakePlayer {
            return player;
        }
    }
}

const DIRECTIONS = {
    Up : createCoordinates(0,-1),
    Right : createCoordinates(1,0),
    Down : createCoordinates(0,1),
    Left : createCoordinates(-1,0),
    None : createCoordinates(0,0)
}

export default Vue.extend({
    props: ['content'],
    data(){
        return {
            canvas: null as HTMLCanvasElement|null,
            control: null as CanvasRenderingContext2D|null,
            activeGame: null as SnakeGame|null,
            score : null as number|null,
            isJosalin: false
        }
    },
    computed:{
        ready() : boolean {
            return (this.control != null) && (this.canvas != null)
        },
        active() : boolean {
            return this.activeGame != null
        }
    },
    methods:{
        startGame:async function(){
            if(this.ready){
                this.score = null;
                this.activeGame = createSinglePlayerSnake();
                let self = this;
                this.activeGame.start(createControl2D(this.canvas as HTMLCanvasElement, this.control as CanvasRenderingContext2D)).then(function(res){
                    self.score = res;
                    self.activeGame = null;
                });
            }
            else {
                if (this.setupCanvas()){
                    this.startGame();
                }
            }
        },
        setupCanvas() : boolean{
            if(this.canvas == null){
                this.canvas = document.getElementById('snake-game') != null ? document.getElementById('snake-game') as HTMLCanvasElement: null;
            }

            if(this.canvas == null){
                return false;
            }
            this.control = this.canvas.getContext("2d");
            if(this.control == null){
                alert("Could not create canvas context. Snake will fail to run.");
                return false;
            }
            return true;
        },
    },
    created(){
        this.setupCanvas();
        let self = this;
        window.addEventListener("keypress", function (event) {
            switch(event.code){
                case "KeyJ":
                    self.isJosalin = true;
                    break;
                default:
                    break;
            }
        });
    }
});

</script>

<style lang="scss">
    @import '../style';

    button {
        display: block;
        margin: 0 auto;
        font-size: 2em;
        padding: 10px;
        &:hover {
            @include glow(1px, $accentColor);
        }
    }

    button:hover {
        cursor: pointer;
        
    }

    .gameDisplay {
        text-align: center;
        display: block;
        position: absolute;
        left: 5%;
        width: 90%;
        height: 80%;
    }

    #snake-game {
        background-color: lightgrey;
        @include insetGlow(50px, gray);
    }
</style>