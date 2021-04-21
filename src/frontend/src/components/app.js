import { route, Router } from 'preact-router';
import { useCallback, useLayoutEffect, useMemo, useState } from 'preact/hooks';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import { StateContext } from '../utilities/storage';
import DynamicPage from './dynamic-page';
import GameOfLife from '../routes/game-of-life';
import Professional from '../routes/professional';
import Youtube from '../routes/youtube';
import Spotify from '../routes/spotify';
import GiftIdeas from '../routes/gift-ideas';
import { Fragment } from 'preact';

const theme = createMuiTheme({
	palette: {
	  primary: {
			main: 'rgb(255,0,255)'
	  },
	  secondary: {
			main: 'rgb(0,0,0)'
	  }
	}
});

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

	if (typeof window !== 'undefined') {
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
	}

	return useMemo(() => (
		<Root>
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poiret+One" />
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
			<ThemeProvider theme={theme}>
				<StateContext.Provider value={state} id="app">
					<Router onChange={handleRoute}>
						<GiftIdeas path="/gift-ideas" />
						<Fragment path="/:page*" >
							<Logo src="/favicon.ico" />
							<DynamicPage index={1} name="youtube">
								<Youtube />
							</DynamicPage>
							<DynamicPage index={2} name="Game of Life" route="gol">
								<GameOfLife />
							</DynamicPage>
							<DynamicPage index={3} name="professional">
								<Professional />
							</DynamicPage>
							<DynamicPage index={4} name="spotify">
								<Spotify />
							</DynamicPage>
						</Fragment>
					</Router>
				</StateContext.Provider>
			</ThemeProvider>
		</Root>
	), [state]);
};
export default App;
