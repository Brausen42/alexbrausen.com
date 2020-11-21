import { Box, Button, Paper, Slider, styled, TextField, IconButton } from '@material-ui/core';
import { Menu, Close } from '@material-ui/icons';
import { Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useSwipeable } from 'react-swipeable';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';

/*
import { GPU } from "gpu.js";
const gpu = new GPU();
    const up = 1;
    const down = -1;
    const left = -1 * num;
    const right = num;
const kernal = gpu.createKernel(
    function(cells) {
    function correct(idx) {
        return (idx + this.constants.total) % this.constants.total;
    }
    const current = cells[this.thread.x];
    const idx = this.thread.x;

    let sum = 0;
    sum += cells[correct(idx + this.constants.up)];
    sum += cells[correct(idx + this.constants.down)];
    sum += cells[correct(idx + this.constants.left)];
    sum += cells[correct(idx + this.constants.right)];
    sum += cells[correct(idx + this.constants.upperLeft)];
    sum += cells[correct(idx + this.constants.upperRight)];
    sum += cells[correct(idx + this.constants.lowerLeft)];
    sum += cells[correct(idx + this.constants.lowerRight)];

    if (current == 1) {
        if (sum === 2 || sum === 3) {
        return 1;
        } else {
        return 0;
        }
    } else {
        if (sum === 3) {
        return 1;
        } else {
        return 0;
        }
    }
    },
    {
    constants: {
        up,
        down,
        left,
        right,
        upperLeft: up + left,
        upperRight: up + right,
        lowerLeft: down + left,
        lowerRight: down + right,
        total
    },
    output: [total]
    }

    vertices = []
      kernal(cells).forEach((visible, idx) => {
        if (visible) {
          const x = (idx % num) - offset;
          const y = Math.floor(idx / num) - offset;
          
          [
            x - size,
            y - size,
            elevation,
            x,
            y - size,
            elevation,
            x,
            y,
            elevation,
            x,
            y,
            elevation,
            x - size,
            y,
            elevation,
            x - size,
            y - size,
            elevation
          ].forEach(dimension => vertices.push(dimension));
        }
        cells[idx] = visible;
      });
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
      setTimeout(stepInTime, timestep);
    }
);
*/

const Styled = {
	GameOfLife: styled(Box)({
		width: '100%',
		height: '100%',
		overflow: 'visible'
	}),
	HUD: {
		Root: styled(Box)({
			position: 'absolute',
			display: 'flex'
		}),
		Controls: styled(Box)({
			marginLeft: 'auto',
			padding: '10px 0px'
		}),
		Stats: styled(Paper)({
			display: 'inline-block',
			margin: '5px',
			padding: props => props.open ? '5px': '0px',
			height: 'max-content',
			maxWidth: '400px',
			opacity: '0.8',
			borderRadius: props => props.open ? '5px': '50%'
		})
	}
};

const GameOfLife = () => {
	const [num, setNum] = useState(100);
	const [density, setDensity] = useState(0.5);
	const [fps, setFps] = useState(30);
	const [view, setView] = useState({ width: 0, height: 0 });
	const [zoom, setZoom] = useState(0);
	const [configureOpen, setConfigureOpen] = useState(false);
	const canvasRef = useRef();
	const rootRef = useRef();
	
	const camera = useMemo(() =>  new THREE.PerspectiveCamera(75, 1, 0.1, 1000), []);

	useEffect(() => {
		camera.position.z = Math.abs(num - zoom);
	}, [num, zoom]);

	useEffect(() => {
		setZoom(0);
	}, [num]);

	const swipeHandlers = useSwipeable({ trackMouse: true, preventDefaultTouchmoveEvent: true, onSwiping: (() => {
		let previous = { x: 0, y: 0 };
		return function({ first, deltaX, deltaY }) {
			if (first) {
				previous = { x: 0, y: 0 };
			}
			const scaleFactor = camera.position.z / (num * 2);
			camera.position.x -= (previous.x - deltaX) * scaleFactor;
			camera.position.y += (previous.y - deltaY) * scaleFactor;
			previous = { x: deltaX, y: deltaY };
		};
	})() });

	console.log('rerendering...');

	// Core Game of life logic
	useEffect(() => {
		const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
		const observer = new ResizeObserver(entries => {
			let { height, width } = entries[0].contentRect;
			height *= .99;
			width *= .99;
			renderer.setSize(width, height);
			camera.aspect = width/height;
			setView({ height, width });
			camera.updateProjectionMatrix();
		});

		observer.observe(rootRef.current);
		
		const scene = new THREE.Scene();

		const geometry = new THREE.BufferGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

		const total = num ** 2;
		const offset = Math.floor(num / 2);

		const createCellGrid = total => new Uint8Array(total).map(() => (Math.random() > density ? 1 : 0));

		const up = 1;
		const down = -1;
		const left = -1 * num;
		const right = num;
		const upperLeft = up + left;
		const upperRight = up + right;
		const lowerLeft = down + left;
		const lowerRight = down + right;

		const neighborIndices = [
			up,
			down,
			left,
			right,
			upperLeft,
			upperRight,
			lowerLeft,
			lowerRight
		];

		let cells = createCellGrid(total);
		let nextCells = new Uint8Array(total);
		const cellNeighbors = new Int32Array(total * 8);
		const correct = idx => (idx + total) % total;

		let currentNeighborIdx = 0;
		cells.forEach(( _, idx) => {
			neighborIndices.forEach((neighborIdx) => {
				cellNeighbors[currentNeighborIdx++] = correct(idx + neighborIdx);
			});
		});
		const vertices = new Int16Array(total * 18);
		let lastVertexIndex = 0;
		const size = 1;
		const elevation = 1;

		const updateVertices = () => {
			lastVertexIndex = 0;
			cells.forEach((visible, idx) => {
				if (visible) {
					const x = (idx % num) - offset;
					const y = Math.floor(idx / num) - offset;
					vertices[lastVertexIndex] = x - size;
					vertices[lastVertexIndex + 1] = y - size;
					vertices[lastVertexIndex + 2] = elevation;
					vertices[lastVertexIndex + 3] = x;
					vertices[lastVertexIndex + 4] = y - size;
					vertices[lastVertexIndex + 5] = elevation;
					vertices[lastVertexIndex + 6] = x;
					vertices[lastVertexIndex + 7] = y;
					vertices[lastVertexIndex + 8] = elevation;
					vertices[lastVertexIndex + 9] = x;
					vertices[lastVertexIndex + 10] = y;
					vertices[lastVertexIndex + 11] = elevation;
					vertices[lastVertexIndex + 12] = x - size;
					vertices[lastVertexIndex + 13] = y;
					vertices[lastVertexIndex + 14] = elevation;
					vertices[lastVertexIndex + 15] = x - size;
					vertices[lastVertexIndex + 16] = y - size;
					vertices[lastVertexIndex + 17] = elevation;

					lastVertexIndex += 18;
				}
			});

			geometry.setAttribute(
				'position',
				new THREE.BufferAttribute(vertices.slice(0, lastVertexIndex), 3)
			);
		};

		const updateCells = () => {
			let iii = 0;
			cells.forEach((visible, idx) => {
				let sum = 0;
				for (let ii = 0 ; ii < 8 ; ii++) {
					sum += cells[cellNeighbors[iii++]];
				}
				nextCells[idx] = !((sum | visible) - 3);
			});
		};

		const animate = () => {
			renderer.render(scene, camera);
		};

		updateVertices();
		scene.add(new THREE.Mesh(geometry, material));
		camera.position.z = num < 1000 ? num : 1000;
		renderer.setAnimationLoop(animate);
		let done = true;
		const stepId = setInterval(() => {
			if (done) {
				done = false;
				updateVertices();
				updateCells();
				let temp = cells;
				cells = nextCells;
				nextCells = temp;
				done = true;
			}
			else {
				console.log('missed a frame...');
			}
		}, 1000 / fps);

		return () => {
			clearInterval(stepId);
		};
	}, [rootRef, canvasRef, num, density]);

	const Configure = useMemo(() => {
		const dimensionRef = useRef();
		const densityRef = useRef();

		function reconfigure() {
			setNum(+dimensionRef.current.value);
			setDensity(+densityRef.current.value);
		}

		function stopPropagation(e){ e.stopPropagation(); }

		useEffect(() => {
			if (dimensionRef.current) {
				dimensionRef.current.value = num;
			}
			if (densityRef.current) {
				densityRef.current.value = density;
			}
		});

		return (
			<Styled.HUD.Stats onMouseDown={stopPropagation} onTouchStart={stopPropagation} open={configureOpen}>
				{ configureOpen ? <Fragment>
					<IconButton onClick={() => setConfigureOpen(false)}><Close /></IconButton>
					<TextField
						type="number"
						inputProps={{
							min: 5,
							max: 500,
							step: 1
						}}
						helperText="Grid dimensions (Anything above 300 may slow your computer)"
						inputRef={dimensionRef}
						fullWidth
						variant="outlined"
					/>
					<TextField
						type="number"
						inputProps={{
							min: 0,
							max: 1,
							step: 0.01
						}}
						helperText="Initial population density (0 to 1)"
						inputRef={densityRef}
						fullWidth
						variant="outlined"
					/>
					<Button onClick={reconfigure} fullWidth>Reconfigure</Button>
				</Fragment> : <IconButton onClick={() => setConfigureOpen(true)}><Menu /></IconButton>
				}
			</Styled.HUD.Stats>
		);
	}, [num, density, configureOpen]);

	const Zoomer = useMemo(() => {
		function onChange(_e, value){ setZoom(value); }
		function stopPropagation(e){ e.stopPropagation(); }
		
		return (
			<Slider
				orientation="vertical"
				max={num}
				min={0}
				defaultValue={zoom}
				track={false}
				onChange={onChange}
				onMouseDown={stopPropagation}
				onTouchStart={stopPropagation}
			/>
		);
	}, [num]);

	return (
		<Styled.GameOfLife ref={rootRef}>
			<Styled.HUD.Root width={view.width} height={view.height}
				{...swipeHandlers}
			>
				{ Configure }
				<Styled.HUD.Controls>
					{ Zoomer }
				</Styled.HUD.Controls>
			</Styled.HUD.Root>
			<canvas ref={canvasRef} />
		</Styled.GameOfLife>
	);
};

export default GameOfLife;