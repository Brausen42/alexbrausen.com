import { route, Router } from 'preact-router';
import { useCallback, useLayoutEffect, useMemo, useState } from 'preact/hooks';
import styled from 'styled-components';
import { StateContext } from '../utilities/storage';
import DynamicPage from './dynamic-page';
import GameOfLife from './pages/game-of-life';
import Professional from './pages/professional';
import Youtube from './pages/youtube';
import Spotify from './pages/spotify';

/*
// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';
*/
const Root = styled.div`
	box-sizing: border-box;
	height: 100%;
	width: 100%;
	background: url('../assets/images/crystalized-cliffs.png') center/cover;
	font-family: "Roboto", sans-serif;
`;

const Logo = styled.img`
	width: 10%;
`;

const App = () => {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	const [state, setState] = useState({
		center: { x: 0, y: 0 },
		numOfPages: 4,
		route: '/'
	});
	const handleRoute = useCallback(e => {
		if (state.activeRoute !== e.url) {
			route(e.url);
			setState(state => ({ ...state, activeRoute: e.url }));
		}
	}, [state]);

	useLayoutEffect(() => {
		const calculateWindowState = () => {
			const [width, height] = [window.innerWidth, window.innerHeight];
			const bounds = width > height ? height: width;
			setState(state => ({
				...state,
				center: {
					x: width / 2,
					y: height / 2
				},
				bounds
			}));
		};

		calculateWindowState();
		window.addEventListener('resize', calculateWindowState);
	}, []);

	return useMemo(() => (
		<Root>
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poiret+One" />
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
			<StateContext.Provider value={state} id="app">
				<Logo src="/favicon.ico" />
				<Youtube index={1} />
				<DynamicPage index={2} name="Game of Life" route="gol">
					<GameOfLife />
				</DynamicPage>
				<Professional index={3} />
				<Spotify index={4} />
				<Router onChange={handleRoute}>
					<span path="/" />
					<span path="/professional" />
					<span path="/youtube" />
					<span path="/gol" />
					<span path="/spotify" />
				</Router>
			</StateContext.Provider>
		</Root>
	), [state]);
};
export default App;
