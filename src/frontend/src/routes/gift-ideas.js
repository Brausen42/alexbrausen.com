import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useEffect, useState } from 'preact/hooks';

const Styled = {
	Gift: styled(Card)({
		margin: 'auto',
		maxWidth: '500px',
		marginTop: '10px'
	}),
	Root: styled(Box)({
		width: '100%',
		height: '100%',
		padding: '10px',
		background: 'rgba(255,255,255, 0.6)',
		textAlign: 'center'
	})
};

const GiftIdeas = props => {
	const [giftIdeas, setGiftIdeas] = useState([]);
	useEffect(async () => {
		setGiftIdeas(await (await fetch('/api/gift-ideas')).json());
	}, []);

	return (
		<Styled.Root>
			<Typography variant="h3">Gift Ideas</Typography>
			{ giftIdeas.map(idea => (
				<Styled.Gift raised>
					<CardContent>
						<Typography variant="h5">{ idea.title }</Typography>
						<Typography variant="caption">{ idea.comments }</Typography>
					</CardContent>
					<CardActions>
						<Button href={idea.url} target="_blank" fullWidth color="primary" variant="outlined">See example</Button>
					</CardActions>
				</Styled.Gift>
			)) }
		</Styled.Root>
	);
};

export default GiftIdeas;
