import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import DynamicPage from '../dynamic-page';

const Styled = {
	Overview: styled(Box)({
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		maxWidth: '100%',
		padding: '5px'
	}),
	Root: styled(Box)({
	}),
	TableCell: styled(TableCell)({
		fontWeight: 'bold'
	})
};

const Spotify = props => {
	const [upcoming, setUpcoming] = useState();
	useEffect(async () => {
		setUpcoming(await (await fetch('/api/spotify/upcoming')).json());
	}, []);

	return (
		<DynamicPage index={props.index} name="spotify">
			<Styled.Root>
				{ upcoming && (
					<Fragment>
						<Styled.Overview fontSize="1.5rem">
							<Box component="img" src={upcoming.imageUrl} height="100px" borderRadius="5px" marginRight="10px" />
							<Typography component="span" variant="body1">{upcoming.description}</Typography>
						</Styled.Overview>
						
						<Table size="small" stickyHeader>
							<TableHead>
								<TableRow>
									<Styled.TableCell>Track</Styled.TableCell>
									<Styled.TableCell align="right">Artist(s)</Styled.TableCell>
									<Styled.TableCell align="right">Popularity</Styled.TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{upcoming?.tracks?.map?.((track) => (
									<TableRow key={track.name}>
										<TableCell>{track.name}</TableCell>
										<TableCell align="right">{track.artists.join(', ')}</TableCell>
										<TableCell align="right">{track.popularity}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Fragment>)}
			</Styled.Root>
		</DynamicPage>
	);
};

export default Spotify;
