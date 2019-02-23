let gol_app = angular.module('gol',[]);
gol_app.controller('golCtrl',function($scope){
	'use strict';

	$scope.init = {
		pop:0,
		width:0,
		height:0,
		size:1
	};

	let utility = {
		randomInt : function(min,max){
			return Math.floor(Math.random() * (max-min+1)) + min;
		}
	}

	let canvas = document.getElementById('gol');
	let control = canvas.getContext('2d');
	let canvas_active = false;

	let going = null; // used to hold interval object
	let setCanvasRes = function() {
		canvas.setAttribute('width', window.innerWidth + 'px');
		canvas.setAttribute('height', window.innerHeight + 'px');
	}



	let view = function(){
		let scale = 1.0;
		let translate = {x:0,y:0};
		window.addEventListener("resize",function(){
			view.drawWorld(world.getActiveCells());
		});
		// control.strokeStyle="white";
		// control.lineWidth=1;
		return {
			clear:function(){
				control.save();
				control.setTransform(1, 0, 0, 1, 0, 0);
				control.clearRect(0, 0, canvas.width, canvas.height);
				control.restore();
			},
			drawWorld:function(active_cells){
				view.clear();
				control.beginPath();
				active_cells.forEach(function(cell){
					control.rect(cell.x + 0.075,cell.y + 0.075,0.85,0.85);
				});
				control.fillStyle="black";
				control.fill();
			},
			reset:function(){
				setCanvasRes();
				translate = {x:0,y:0};
				scale = $scope.init.size;
				view.translate(window.innerWidth/(2 / $scope.init.size), window.innerHeight/(2 / $scope.init.size));
			},
			translate:function(x,y){
				let changeX = x/scale;
				let changeY = y/scale;
				translate.x += changeX;
				translate.y += changeY;
				control.translate(changeX,changeY);
			},
			updateWorld:function(b_and_d){
				control.beginPath();
				b_and_d.births.forEach(function(cell){
					control.rect(cell.x + 0.075,cell.y + 0.075,0.85,0.85);
				});
				control.fillStyle="black";
				control.fill();

				control.beginPath();
				b_and_d.deaths.forEach(function(cell){
					control.rect(cell.x, cell.y, 1, 1);
				});
				control.fillStyle="white";
				control.fill();
				// control.strokeStyle="white";
				// control.stroke();
			},
			zoom:function(s,x,y){
				control.translate(-translate.x, -translate.y);
				control.scale(s,s);
				translate.x /= s;
				translate.y /= s;
				let prev_scale = scale;
				scale *= s;
				control.translate(translate.x + ((x/scale) - (x/prev_scale)), translate.y + ((y/scale) - (y/prev_scale)));
				translate.x += ((x/scale) - (x/prev_scale));
				translate.y += ((y/scale) - (y/prev_scale));
			}
		};
	}();

	window.addEventListener('resize',function(){
		setCanvasRes();
		view.reset();
	});

	let world = function(){
		let cells = new Set();
		let size = 0;

		let cell_id = function(){
			let x_reg = /x(.*)y/;
			let y_reg = /.*y(.*)/;
			return {
				create:function(x,y){
					return 'x' + x + 'y' + y;
				},
				decode:function(id){
					let x_srch = x_reg.exec(id);
					let y_srch = y_reg.exec(id);
					return x_srch && y_srch ? {x:parseInt(x_srch[1]),y:parseInt(y_srch[1])} : null;
				}
			}
		}();

		let positions = {
			pre:[
				{x:-1,y:1},
				{x:0,y:1},
				{x:1,y:1},
				{x:-1,y:0}
			],
			post:[
				{x:1,y:0},
				{x:-1,y:-1},
				{x:0,y:-1},
				{x:1,y:-1}
			]
		}

		let next_states = null;
		let populateNextStates = function(){
			next_states = new Map();
			for(let i = 0 ; i < 512 ; i++){
				let place_finder = i;
				let neighbors = 0;
				let status = null;
				let position = 1;
				while(position < 5){
					neighbors += (place_finder & 1);
					place_finder = place_finder >>> 1;
					position += 1;
				}
				status = (place_finder & 1);
				place_finder = place_finder >>> 1;
				position += 1;
				while(position < 10){
					neighbors += (place_finder & 1);
					place_finder = place_finder >>> 1;
					position += 1;
				}
				if((status === 1 && [2,3].includes(neighbors)) ||
					 (status === 0 && neighbors === 3)){
					next_states.set(i,1);
				} else {
					next_states.set(i,0);
				}
			}
		}

		let getCell = function(x,y){
			return cells.has(cell_id.create(x,y)) ? 1 : 0;
		}

		populateNextStates();

		return {
			advanceTime:function(){
				let deaths = [];
				let births = [];

				let potential_birth = new Set();

				// deaths
				let active_cells = world.getActiveCells();
				active_cells.forEach(function(cell){
					let num_rep = 0;
					positions.pre.forEach(function(pos){
						let x = pos.x + cell.x;
						let y = pos.y + cell.y;
						num_rep = num_rep | getCell(x,y);
						num_rep = num_rep << 1;
						potential_birth.add(cell_id.create(x,y));
					});
					num_rep = num_rep | 1;
					positions.post.forEach(function(pos){
						let x = pos.x + cell.x;
						let y = pos.y + cell.y;
						num_rep = num_rep << 1;
						num_rep = num_rep | getCell(x,y);
						potential_birth.add(cell_id.create(x,y));
					});
					if(next_states.get(num_rep) !== 1){
						deaths.push(cell_id.create(cell.x,cell.y));
					}
				});

				// births
				let potential_birth_filtered = Array.from(potential_birth).map(cell_id.decode).filter(function(cell){
					return getCell(cell.x,cell.y) === 0;
				});
				potential_birth_filtered.forEach(function(cell){
					let num_rep = 0;
					positions.pre.forEach(function(pos){
						let x = pos.x + cell.x;
						let y = pos.y + cell.y;
						num_rep = num_rep | getCell(x,y);
						num_rep = num_rep << 1;
					});
					num_rep = num_rep | 0;
					positions.post.forEach(function(pos){
						let x = pos.x + cell.x;
						let y = pos.y + cell.y;
						num_rep = num_rep << 1;
						num_rep = num_rep | getCell(x,y);
					});
					if(next_states.get(num_rep) === 1){
						births.push(cell_id.create(cell.x,cell.y));
					}
				});

				deaths.forEach(function(cid){
					cells.delete(cid);
				});
				births.forEach(function(cid){
					cells.add(cid);
				});

				return {births:births.map(cell_id.decode),deaths:deaths.map(cell_id.decode)};
			},
			getActiveCells:function(){
				return Array.from(cells).map(cell_id.decode);
			},
			randomize:function(width,height,n) {
				for(let i = 0 ; i < n ; i++){
					world.setCell(utility.randomInt(-width,width),utility.randomInt(-height,height),1);
				}
			},
			reset:function(){
				cells.clear();
			},
			setCell:function(x,y,active) {
				let id_string = cell_id.create(x,y);
				if(active){
					cells.add(id_string);
				} else {
					cells.delete(id_string);
				}
			}
		};
	}();

	let controller = function(){
		let going = null;
		let speed = 100; // ms of delay

		let start = function(){
			if(going){
				clearInterval(going);
			}
			going = setInterval(function(){
				view.updateWorld(world.advanceTime());
			},speed);
		}

		let stop = function(){
			clearInterval(going);
			going = null;
		}

		return {
			createWorld:function(){
				world.randomize($scope.init.width,$scope.init.height,$scope.init.pop);
			},
			reset:function(){
				stop();
				view.reset();
				world.reset();
			},
			zoom:function(s,x,y){
				view.zoom(s,x,y);
				view.drawWorld(world.getActiveCells());
			},
			setSpeed:function(new_speed){
				speed = new_speed;
				start();
			},
			toggle:function(){
				if(going){
					stop();
				} else {
					start();
				}
			},
			translate:function(x,y){
				view.translate(x,y);
				view.drawWorld(world.getActiveCells());
			}
		}
	}();

	window.addEventListener("keypress", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		switch (event.key) {
			case " ":
				controller.toggle();
				break;
			case "Escape":
				controller.reset();
				$("#welcome").modal();
				canvas_active = false;
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);

	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		switch (event.key) {
			case "Control":
				if(canvas_active){
					$('#gol').addClass('move');
				}
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);

	window.addEventListener("keyup", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		switch (event.key) {
			case "Control":
				$('#gol').removeClass('move');
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);

	window.addEventListener("mousemove", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		if(event.buttons === 1) { // left mouse down
			if(event.ctrlKey){
				controller.translate(event.movementX,event.movementY);
			}
		}
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);

	window.addEventListener("mousedown", function (event) {
		if(event.ctrlKey){
				$('#gol').addClass('moving');
		}
	}, true);

	window.addEventListener("mouseup", function (event) {
		$('#gol').removeClass('moving');
	}, true);

	window.addEventListener("wheel", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		controller.zoom(1 + ((-event.deltaY)/10), event.x - (window.innerWidth/2), event.y - (window.innerHeight/2));
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);

	$('#controls').popover({content: '<span class="glyphicon glyphicon-zoom-in"></span> Scroll wheel up<br/>\
																		<span class="glyphicon glyphicon-zoom-out"></span> Scroll wheel down<br/>\
																		<span class="glyphicon glyphicon-move"></span> Ctrl click and drag<br/>\
																		<span class="glyphicon glyphicon-pause"></span> Spacebar<br/>\
																		<span class="glyphicon glyphicon-stop"></span> Escape',
													html: true, placement: "bottom", trigger:'focus'});

	$scope.start = function(){
		controller.reset();
		controller.createWorld();
		controller.zoom($scope.init.size,0,0);
		controller.toggle();
		canvas_active = true;
	}
	$("#welcome").modal();
});
