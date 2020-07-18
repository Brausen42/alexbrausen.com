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
import snake from '../modules/snake'

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
        startGame: async function(){
            if(this.ready){
                this.score = null;
                this.activeGame = snake.createSinglePlayerSnake();
                const score = await this.activeGame.start(snake.createControl2D(this.canvas as HTMLCanvasElement, this.control as CanvasRenderingContext2D))
                this.score = score;
                this.activeGame = null;
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