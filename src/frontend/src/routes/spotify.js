import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const Styled = {
	Overview: styled(Box)({
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		maxWidth: '100%',
		padding: '5px',
		textDecoration: 'none',
		color: 'black',
		transition: 'background 1s',
		'&:hover': {
			background: 'rgba(255,255,255,0.7)'
		}
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
		<Styled.Root>
			{ upcoming && (
				<Fragment>
					<Styled.Overview fontSize="1.5rem" component="a" href={upcoming.link} title="Open on Spotify" target="_blank">
						<Box component="img" src={upcoming.imageUrl} height="100px" borderRadius="5px" marginRight="10px" />
						<Box>
							<Typography variant="h4">{upcoming.name}</Typography>
							<Typography variant="body1">{upcoming.description}</Typography>
							<Typography variant="caption">{upcoming.followers} Followers</Typography>
						</Box>
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
	);
};

export default Spotify;
