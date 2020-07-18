import { Box, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Tab, Tabs } from '@material-ui/core';
import { Link } from 'preact-router/match';
import { ExpandMore } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';
import { Fragment } from 'preact';
import { useCallback, useState, useMemo } from 'preact/hooks';
import DynamicPage from '../dynamic-page';

const Styled = {
	TabBody: styled(Box)({
		padding: '10px',
		background: 'rgba(255, 255, 255, 0.7)'
	})
};

const FullTabs = props => {
	const [tabValue, setTabValue] = useState(0);
	const updateTab = useCallback((_, value) => setTabValue(value), []);

	return useMemo(() => (
		<Fragment>
			<Tabs value={tabValue} onChange={updateTab} variant="scrollable" indicatorColor="primary" textColor="secondary">
				{ Object.keys(props.tabs).map(tab => <Tab label={tab} />) }
			</Tabs>
			{ Object.values(props.tabs)[tabValue] }
		</Fragment>
	), [tabValue]);
};

const FullExpansion = props => {
	const [expand, setExpand] = useState([]);
	const onChange = useCallback(title => () => {
		if (expand.includes(title)) {
			setExpand(expand.filter(expandTitle => expandTitle !== title));
		}
		else {
			setExpand(expand.concat(title));
		}
	}, [expand]);

	return (
		<Fragment>
			{ Object.entries(props.panels).map(([title, details]) => (
				<ExpansionPanel expanded={expand.includes(title)} onChange={onChange(title)} >
					<ExpansionPanelSummary expandIcon={<ExpandMore />}>
						{ title }
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{ details }
					</ExpansionPanelDetails>
				</ExpansionPanel>
			))}
		</Fragment>
	);
};

const Education = () => {
	const courses = useMemo(() => [
		{ dept: 'AST', number: 1001, title: 'Exploring the Universe' },
		{ dept: 'BIOL', number: 1009, title: 'General Biology' },
		{ dept: 'CSE', number: 1001, title: 'First Year Experience' },
		{ dept: 'CSCI', number: 1113, title: 'Intro to C/C++' },
		{
			dept: 'CSCI',
			number: 1913,
			title: 'Intro to Algorithms and Program Development'
		},
		{ dept: 'CSCI', number: 2011, title: 'Discrete Structures' },
		{
			dept: 'CSCI',
			number: 2021,
			title: 'Machine Architecture and Organization'
		},
		{
			dept: 'CSCI',
			number: 2041,
			title: 'Advanced Programming Principles'
		},
		{
			dept: 'CSCI',
			number: 4011,
			title: 'Formal Languages and Automata Theory'
		},
		{
			dept: 'CSCI',
			number: 4061,
			title: 'Introduction to Operating Systems'
		},
		{
			dept: 'CSCI',
			number: 4511,
			title: 'Introduction to Artificial Intelligence'
		},
		{
			dept: 'CSCI',
			number: 4611,
			title: 'Programming Interactive Computer Graphics and Games'
		},
		{ dept: 'CSCI', number: 5512, title: 'Artificial Intelligence II' },
		{ dept: 'CSCI', number: 5523, title: 'Introduction to Data Mining' },
		{ dept: 'CSCI', number: 5607, title: 'Computer Graphics I' },
		{ dept: 'GCD', number: 3022, title: 'Genetics' },
		{ dept: 'JOUR', number: 1501, title: 'Digital Games, Sims and Apps' },
		{ dept: 'PE', number: 1014, title: 'Conditioning' },
		{ dept: 'PE', number: 1035, title: 'Karate' },
		{ dept: 'PE', number: 1074, title: 'Beginning Volleyball' },
		{
			dept: 'PHYS',
			number: 1301,
			title: 'Physics for Scientist and Engineers I'
		},
		{ dept: 'PSTL', number: 1368, title: 'Stories of Social Change' },
		{
			dept: 'STAT',
			number: 3021,
			title: 'Introduction to Probability and Statistics'
		},
		{ dept: 'WRIT', number: 1301, title: 'University Writing' }
	], []);
	
	return (<Styled.TabBody>
		<h3>University of Minnesota - Twin Cities</h3>
		<h5>
			Bachelor of Science with Distinction, Computer Science
			<br />
		</h5>
		<small>December 2017 - GPA 3.75</small>
		<h4>Courses Taken</h4>
		<table class="table table-hover">
			<tr>
				<th>Department</th>
				<th>Number</th>
				<th>Title</th>
			</tr>
			{ courses.map(course => (
				<tr>
					<td>{ course.dept }</td>
					<td>{ course.number }</td>
					<td>{ course.title }</td>
				</tr>
			))}
		</table>
	</Styled.TabBody>);
};

const Professional = props => {
	const projects = useMemo(() => ({
		'AlexBrausen.com': <div>
			<p>This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.</p>
	
			<h4>Stack</h4>
			<h5>Frontend</h5>
			<p>A Preact.js client is built using functional components and a few MaterialUI components. The `preact-cli` is used for building into production assets.</p>
			<p>A simple Node.js server built with express is used to serve these static files, and also allows a path for the client to gain dynamic data through REST calls.</p>
	
			<h4>Depoloyment</h4>
			<p>I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the Stack above into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.</p>
	
			<h4>Future</h4>
			<p>There's a lot that I would hope to do with this site, but it's hard to find time do so. Here's a list of potential improvements in a roughly priority-based order:</p>
			<ul>
				<li>Add the ability to interact with the playlist in intuitive or meaningful ways (sorting, voting on the songs that are in the playlist, etc.)</li>
				<li>Overall, include more content on the site so it's less of a tech demo</li>
			</ul>
		</div>,
		Snake: <div>
			<p class="col-lg-4">
			This is the first large personal project I ever made and the inspiration for it came from the fact
			that I had never been able to program anything that had a visual aspect yet in my courses.
				<br />
				<br />Snake is a
			game based on the well known version where the user is an ever growing 'snake' trying to grow as large
			as possible while avoiding obstacles in a confined world. My version has added the ability to play a
			local 2 player mode where the goal is to survive longer than the opponent. This adds a more competitive
			nature to the originally solo gameplay. In addition, my version allows a slightly more interesting solo
			gameplay where, as you grow, mines are placed in the world to add more obstacles.
				<br />
				<br />The source code for this can be found on
				<a href="https://github.com/Brausen42/Snake">my github</a>
			</p>
		</div>,
		'Game of Life': <div>
			<p class="col-lg-8">
		  My interest in Cellular Automata lead me to recreate the
		  <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Game of Life</a> introduced by John Conway in 1970.
		  The idea is that you can create a simple world that advances from one time step to the next by applying a few
		  simple rules to the current state of the world, and out of it there precipitates complex interactions.
		  <br />
		  <br />I am currently working on a <Link href="/gol/">web-based implementation</Link>.
		  This version is still in very early development so it's possible that there's some bugs.
		  <br />
			</p>
	
		</div>
	}), []);
	
	const interests = useMemo(() => ({
		'Artificial Intelligence/Machine learning': <div>
			Making computers act intelligently has always been an interest of mine.
			I find automation to be a very useful tool, and Artificial Intelligence opens the door for
			automation of complex tasks. Machine learning is a powerful tool for aiding in the
			progression of Artificial Intelligenece as it allows for complex patterns to be found
			and leveraged.
		</div>,
		'Data Visualization': <div>
			Often times it seems that there's a lot of data that could tell us something
			extemely useful, but looking at the raw data isn't useful for grasping these concepts. Data visualization
			can tell the story behind data in a fun and intuitive manner and I think this is an area that
			will become more and more useful as data gets bigger and bigger.
		</div>,
		'Cellular Automata': <div>
			Cellular Automata are extremely interesting for me, and largely so
			because we don't seem to know much about them. Hobbyists have played around with them with things such as
			Conway's Game of Life (myself included), but there hasn't been much in the terms of practicul use. I
			think that Cellular Automata have the potential to open some doors that we can't see yet. Specifically,
			file compression could possibly be improved by storing states and then decompressing by running those
			states to receive the original data back.
		</div>,
		Blockchain: <div>
			With the rise of Bitcoin and other cryptocurrencies it's hard to ignore the
			potential that blockchain technologies have to change the way our technological world works. They
			offer decentralized control at a massive scale and possibly many more benefits as we understand
			the capabilites of blockchains better.
		</div>
	}), []);

	const employment = useMemo(() => ({
		'Best Buy': <div>
			<h3>JavaScript Engineer @ Best Buy - DAI (Digital Analytics implementation)</h3>
			<small>July 2019 - Now</small>
			<p>
				DAI is responsible for most of the 3rd party integrations on <a href="https://www.bestbuy.com">BestBuy.com</a>, as well as analytics related first party integrations.
				I've worked the most on the client-side analytics framework that other teams building the UI components can use to meet the analytics requirements that reporting and
				recommendations teams have set forth. Although pretty much all of the code that goes onto the website from DAI is non-visual, we have been building a tool that makes
				it much easier to verify what data is being sent on any given Best Buy page. The main technologies we work with are ES6+ JavaScript, Babel, Webpack, Preact, MaterialUI,
				and WebdriverIO for automated regression testing.
			</p>
		</div>,
		'Epic Systems': <div>
			<h3>
				Software Developer @ Epic Systems - Cognitive Computing Platform
			</h3>
			<small>June 2018 - May 2019</small>
			<div>
				The goal of the team I was a part of was to maintain and improve the predictive model pipeline, which turned clinical data into actionable insights. Also, we started to build out the cloud infrastructure to improve efficiency, and generalize for use cases outside the scope of predictive analytics.
				A few specific projects I worked on were:
				<ul>
					<li>Create a path for customers to use an existing clinical predictive modeling workflow using their own platform</li>
					<li>Take a NodeJS library that was being used by many services in a Kubernetes Cluster, and turn it into its own service offering the same functionality via a RESTful API</li>
					<li>Integrate multiple pieces of new functionality created by other developers into the existing predictive modeling pipeline</li>
				</ul>
			</div>
			<h3> Software Developer Intern @ Epic Systems - Genomics</h3>
			<small>Summer of 2017</small>
			<div>
				For my internship at Epic I had a single project for the summer which was to create a
				web application that genetic specialists (Bioinformaticians, Genetic Analysts, etc.) could use to aid
				in the process of interpreting VCF files. In the process, I worked with experienced developers,
				quality assurance individuals, and UX designers to create the final web application which was called the
				Variant Explorer. The list of features is as follows:
				<ul>
					<li >Import VCF file and perform checks to ensure proper formatting</li>
					<li >Search and Filter variants based on any associated field</li>
					<li >Dig into any information associated with a variant</li>
					<li >Annotate individaul variants to aid in clinical decisions down the road</li>
					<li >Save out subsets of the file</li>
				</ul>
			</div>
		</div>,
		'Thomson Reuters': <div>
			<h3>
				Software Developer Intern @ Thomson Reuters
			</h3>
			<small>Summer of 2016</small>
			<p>
				At Thomson Reuters I worked with a small team of developers to maintain and upgrade an internal web application. The
				application was used by an expanding group of Thomson Reuters employees to take a database of internal information and
				generate reports in the form of excel documents that represented some useful subset of the data that could be used to
				improve their workflows.
			</p>
			<p>
				There were also a few interactive, real-time tools for visualizing the internal information,
				one of which I created during the ladder portion of the summer. The tool I made allowed the user to visualize and interact
				with data through the use of interactive pie charts. I used the Google Visualization JavaScript API to help create the tool.
			</p>
			<p>
				Other tasks included creating templates for SQL queries that users could change specific parameters to customize and receive
				the results in an excel document, and creating Python scripts that helped connect the SQL database with a sharepoint site.
			</p>
		</div>,
		'University of Minnesota': <div>
			<h3>
				Teaching Assistant @ University of Minnesota
			</h3>
			<small>Each Fall and Spring semester from 2015 through 2017</small>
			<p>
				As a TA I was tasked with working with students at labs and office hours to help them learn the concepts presented in class,
				assist in the grading process, and help advise the professor in how to help the students the most.
			</p>
			<p>
				For the 2015-2016 school year I was a TA for the CSCI 1113 course titled
				<em>Intro to C/C++ Programming</em>. This was an
				introductory course to computer programming so it covered the basics such as types, control flow, and loops. Slightly more
				advanced topics were also looked into such as pointers and OOP basics.
			</p>
			<p>
				For the 2016-2017 school year I was a TA for the CSCI 2041 course titled
				<em>Advanced Programming Principles</em>. This course
				was an intermediate level course taught through the medium of functional programming. One semester used Clojure, and the other
				used Ocaml. Topics such as inferred vs. hard typing, higher-order functions, and closures were covered.
			</p>
		</div>
	}), []);

	const tabs = useMemo(() => ({
		Employment: <FullExpansion panels={employment} />,
		Education: <Education />,
		Projects: <FullExpansion panels={projects} />,
		Interests: <FullExpansion panels={interests} />
	}), [projects, employment, interests]);
	return (
		<DynamicPage index={props.index} name="professional">
			<FullTabs tabs={tabs} />
		</DynamicPage>
	);
};

export default Professional;
