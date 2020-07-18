import { Box, Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useMemo } from 'preact/hooks';
import DynamicPage from '../dynamic-page';

const Styled = {
	Card: styled(Card)({
		width: '400px',
		display: 'inline-flex',
		margin: '10px',
		textAlign: 'center'
	}),
	CardContent: styled(CardContent)({
	}),
	Media: styled(CardMedia)({
		height: '140px',
		marginLeft: 'auto'
	}),
	Root: styled(Box)({
		display: 'flex',
		flexWrap: 'wrap',
		alignContent: 'center',
		justifyContent: 'space-around',
		maxWidth: '1000px',
		margin: 'auto'
	})
};

const Videos = props => {
	const youtube = useMemo(() => [
		{
			id: 0, title: 'Kurzgesagt',
			description: 'Insightful animated teachings about a variety of topics that are always approached from a scientific perspectic',
			link: 'https://www.youtube.com/user/Kurzgesagt/featured',
			background: 'https://kurzgesagt.org/wp-content/themes/kurzgesagt/library/images/svg/about-header.svg'
		},
		{
			id: 1, title: "What I've Learned",
			description: 'Well researched deep dives into health related self improvement subjects',
			link: 'https://www.youtube.com/channel/UCqYPhGiB9tkShZorfgcL2lA',
			background: 'https://c10.patreonusercontent.com/3/eyJ3IjoyMDB9/patreon-media/p/campaign/493308/059664acb97743c5b96a6eefc87b8be1/1?token-time=2145916800&token-hash=ApQAlXl5QiLZbjbQ-RKZjLXTyfvXQ4vcuBsJ3wkCqhI%3D'
		},
		{
			id: 2, title: 'Cold Fusion',
			description: 'Technology focused overviews of cool breakthroughs, and the history of big tech companies',
			link: 'https://www.youtube.com/channel/UC4QZ_LsYcvcq7qOsOhpAX4A',
			background: 'https://yt3.ggpht.com/a-/AAuE7mBoaXsxIDEQkaAomqKD5g6C8MbA0fcupdXmKA=s288-mo-c-c0xffffffff-rj-k-no'
		},
		{
			id: 3, title: 'C.G.P. Grey',
			description: 'Logical approaches to a mosh-posh of interesting concepts',
			link: 'https://www.youtube.com/channel/UC2C_jShtL725hvbm1arSV9w',
			background: 'https://yt3.ggpht.com/a-/AAuE7mCZH_J-Vsd5-_-05hR8Ch4SfbgrbqkbaWvfpQ=s288-mo-c-c0xffffffff-rj-k-no'
		}
	], []);
	return (
		<DynamicPage index={props.index} name="videos">
			<Styled.Root>
				{ youtube.map(({ title, description, link, background }) => (
					<Styled.Card>
						<CardActionArea href={link} target="_blank">
							<CardContent>
								<image src={background} />
								<Styled.Media src={background} component="img" />
								<h3>{title}</h3>
								<p>{description}</p>
							</CardContent>
						</CardActionArea>
					</Styled.Card>
				))}
			</Styled.Root>

		</DynamicPage>
	);
};

export default Videos;
