import { useEffect, useLayoutEffect, useState, useMemo, useRef, useCallback } from 'preact/hooks';
import { styled, Box, Paper, Slider } from '@material-ui/core';
import * as THREE from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { useSwipeable } from 'react-swipeable';

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
			padding: '5px',
			height: 'max-content'
		})
	}
};

const SCENE_ROOT_ID = 'scene-root';

const GameOfLife = () => {
	const [num, setNum] = useState(500);
	const [fps, setFps] = useState(30);
	const [actualFPS, setActualFPS] = useState(0);
	const [pps, setActualPPS] = useState(0);
	const [view, setView] = useState({ width: 0, height: 0 });
	const [zoom, setZoom] = useState(0);
	const [isZooming, setIsZooming] = useState(false);
	
	const camera = useMemo(() =>  new THREE.PerspectiveCamera(75, 1, 0.1, 1000), []);
	const renderer = useMemo(() => new THREE.WebGLRenderer(), []);

	useEffect(() => {
		camera.position.z = Math.abs(num - zoom);
	}, [num, zoom]);

	const onSwiping = useMemo(() => {
		let previous = { x: 0, y: 0 };
		return ({ first, deltaX, deltaY }) => {
			if (first) {
				previous = { x: 0, y: 0 };
			}
			if (isZooming) {
				return;
			}
			const scaleFactor = camera.position.z / num;
			camera.position.x -= (previous.x - deltaX) * scaleFactor;
			camera.position.y += (previous.y - deltaY) * scaleFactor;
			previous = { x: deltaX, y: deltaY };
		};
	}, [isZooming, num]);

	const handlers = useSwipeable({
		trackMouse: true,
		onSwiping
	});

	/*
	useEffect((() => {
		const previousZoom = useRef(zoom);
		const previous = useRef({ x: 0, y: 0 });
		const zoomCountRef = useRef(0);
		return () => {
			if (previousZoom.current !== zoom) {
				zoomCountRef.current = 0;
			}
			else if (zoomCountRef.current < 3) {
				zoomCountRef.current++;
			}

			if (dragging && (zoomCountRef.current === 3)) {
				const change = {
					x: mousePosition.end.x - previous.current.x,
					y: mousePosition.end.y - previous.current.y
				};
				camera.position.x -= (change.x) / Math.log(camera.position.z);
				camera.position.y += (change.y) / Math.log(camera.position.z);
			}
			previousZoom.current = zoom;
			previous.current = { ...mousePosition.end };
		};
	})(), [mousePosition, zoom]);
	*/
    
	useLayoutEffect(() => {
		document.getElementById(SCENE_ROOT_ID).appendChild(renderer.domElement);

		const observer = new ResizeObserver(entries => {
			let { height, width } = entries[0].contentRect;
			height *= .99;
			width *= .99;
			renderer.setSize(width, height);
			camera.aspect = width/height;
			setView({ height, width });
			camera.updateProjectionMatrix();
		});

		observer.observe(renderer.domElement.parentElement);

		renderer.domElement.addEventListener('dblclick', () => {
			const changeAmount = camera.position.z / 10;
			const changeDuration = 100;
			const changeSteps = 100;
			const changeStepTime = changeDuration / changeSteps;
			const changeStepAmount = changeAmount / changeSteps;
			const changeStep = (remainingSteps) => {
				camera.position.z -= changeStepAmount;
				if (remainingSteps > 0) {
					setTimeout(changeStep, changeStepTime, remainingSteps - 1);
				}
			};
			changeStep(changeSteps - 1);
		});
	}, [camera, renderer]);

	useEffect(() => {
		const scene = new THREE.Scene();

		const geometry = new THREE.BufferGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

		const total = num ** 2;
		const offset = Math.floor(num / 2);

		const createCellGrid = total => new Uint8Array(total).map(() => (Math.random() > 0.5 ? 1 : 0));

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

		let actualFPScount = 0;
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
			actualFPScount++;
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

		let actualPPS = 0;
		const intervalId = setInterval(() => {
			setActualFPS(actualFPScount);
			actualFPScount = 0;
			setActualPPS(actualPPS);
			actualPPS = 0;
		}, 1000);

		const animate = () => {
			renderer.render(scene, camera);
			actualPPS++;
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
			clearInterval(intervalId);
		};
	}, [num]);

	const Zoomer = useMemo(() => (
		<Slider
			orientation="vertical"
			max={num}
			min={0}
			value={zoom}
			onChange={(e, value) => setZoom(value)}
			ontouchstart={() => setIsZooming(true)}
			onMouseDown={() => setIsZooming(true)}
		/>
	), [num, zoom]);

	return (
		<Styled.GameOfLife id={SCENE_ROOT_ID}>
			<Styled.HUD.Root width={view.width} height={view.height} {...handlers} onMouseUp={() => {setIsZooming(false);}} onTouchEnd={() => setIsZooming(false)}>
				<Styled.HUD.Controls>
					{ Zoomer }
				</Styled.HUD.Controls>
			</Styled.HUD.Root>
		</Styled.GameOfLife>
	);
};

export default GameOfLife;