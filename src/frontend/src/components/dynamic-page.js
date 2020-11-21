import { h } from 'preact';
import { useContext, useMemo, useState, useCallback } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { StateContext } from '../utilities/storage';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';


const Root = styled.div`
    background: ${props => props.active ? 'linear-gradient(white, transparent, white)': 'radial-gradient(white, transparent)'};
    backdrop-filter: blur(10px);
    color: rgb(32, 39, 47);
    position: fixed;
    top: ${props => props.active ? '0px' : `${props.y}px`};
    left: ${props => props.active ? '0px' : `${props.x}px`};
    width: ${props => props.active ? '100%' : `${props.diameter}px`};
    height: ${props => props.active ? '100%' : `${props.diameter}px`};
    border-radius: ${props => props.active ? '0px' : `${props.diameter / 2}px`};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.active ? 'unset' : 'center'};
    align-items:  ${props => props.active ? 'unset' : 'center'};
    transition: all 0.5s ease-out;
    text-decoration: none;
    cursor: ${props => props.active ? 'unset' : 'pointer'};
    z-index: ${props => props.active ? 10 : 0};
    opacity: ${props => props.visible ? 1.0 : 0};
    box-shadow: 0px 0px 10px 5px rgb(32, 39, 47, 0.5);
    transform: ${props => props.active ? 'unset' : `translate(-50%, -50%)`};
    &:hover {
        box-shadow: 0px 0px 20px 5px rgb(32, 39, 47, 0.5);
    }
`;

const Title = styled.h1`
    display: block;
    text-transform: capitalize;
    font-family: "Poiret One", cursive;
    font-size: ${props => props.active ? undefined: `${props.diameter / 100}rem`};
    text-align: ${props => props.active ? 'left': 'center'};
`;

const Exit = styled(Link)`
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: rgb(32, 39, 47);
    color: red;
    display: flex;
    justify-content: center;
    align-items: baseline;
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    text-decoration: none;
`;

const Contents = styled.div`
    overflow: auto;
    height: 100%;
`;

const FullLink = styled(Link)`
    text-decoration: unset;
    color: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

const DynamicPage = props => {
	const [id] = useState(uuidv4());
	const state = useContext(StateContext);
	const route = useMemo(() => `${state.route}${props.route || props.name}/`, [props.name]);
	const active = useMemo(() => state.activeRoute === route, [state.activeRoute, route]);
	const visible = useMemo(() => active || (state.activeRoute === state.route), [active, state.activeRoute]);
	const diameter = useMemo(() => {
		const radius = (state.bounds / 2);
		const diameter = Math.sqrt((radius ** 2) / state.numOfPages) * 2;
		const scalingFactor = 0.7;
		return diameter * scalingFactor;
	}, [state.bounds, state.numOfPages]);
	const distance = useMemo(() => (diameter / 2) * 1.618, [diameter]);
	const position = useMemo(() => {
		const angle = ((2 * Math.PI / state.numOfPages) * props.index) - (Math.PI / 2);
		return {
			x: state.center.x + (Math.cos(angle) * distance),
			y: state.center.y + (Math.sin(angle) * distance)
		};
	}, [state.center, props.index, distance]);
	const updateTitle = useCallback(() => window.document.title = props.name.replace(/^\w/, c => c.toUpperCase()), [props.name]);
	const resetTitle = useCallback(() => window.document.title = 'AlexBrausen.com');
    
	const Body = useMemo(() => {
		const title = <Title diameter={diameter} active={active}>{props.name}</Title>;
		return active ?
			[
				title,
				<Exit href="/" draggable={false} onClick={resetTitle}>&times;</Exit>,
				<StateContext.Provider>
					<Contents children={props.children} />
				</StateContext.Provider>
			] :
			<FullLink href={route} draggable={false} onClick={updateTitle}>
				{ title }
			</FullLink>;
	}, [props, diameter, route]);

	return useMemo(() => (
		<Root
			id={id}
			visible={visible}
			index={props.index}
			active={active}
			x={position.x}
			y={position.y}
			diameter={diameter}
		>
			{ Body }
		</Root>
	), [props, state]);
};

export default DynamicPage;
