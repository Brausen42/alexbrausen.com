import { Accordion, AccordionDetails, AccordionSummary, Box, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import { Fragment } from 'preact';
import { Link } from 'preact-router/match';
import { useCallback, useMemo, useState } from 'preact/hooks';

const Styled = {
	TabBody: styled(Box)({
		padding: '10px',
		background: 'rgba(255, 255, 255, 0.7)'
	}),
	TableCell: styled(TableCell)({
		fontWeight: 'bold'
	})
};

const Overview = () => (
	<Styled.TabBody>
		<Typography variant="h3">Story so far</Typography>
		<br />
		<Typography variant="body1">
			While attending the University of Minnesota - Twin Cities, I worked part time as a Teaching Assistant in entry to intermediate
			level Computer Science courses. I had to really nail down programming basics, both Object-oriented and functional, since I would
			otherwise not be a very helpful Teaching Assistant.
		</Typography>
		<br />
		<Typography variant="body1">
			During the summer between my Sophomore and Junior year of university, I was
			lucky enough to land an internship with Thomson Reuters. There I got my first taste of what working as a software engineer in the
			industry was like. I worked on multiple projects that exposed me to scripting, web applications, database queries, and a little bit
			of backend.
		</Typography>
		<br />
		<Typography variant="body1">
			The following summer, I took an opportunity to live outside my hometown for a bit and intern at Epic Systems in the Madison
			WI area. There I worked on a single project which was to build a web application for Genetic Analysts. The environment and tooling
			requirements were hard to nail down, and with my mentor team wanting to leave things as open ended as possible for me, I ended up
			writing a Pure JS web application built with IE support in mind. In hindsight, a framework such as React would've made things a lot
			easier, but I also appreciate the depth of knowledge I gained of JavaScript and DOM manipulation basics that I use from time to time
			still.
		</Typography>
		<br />
		<Typography variant="body1">
			After graduating from the U of M, I ended up taking my first full time position at Epic Systems based on my great experience as an intern.
			I was placed on the Cognitive Computing Platform team. My team dealt with
			connecting healthcare workflows within the EMR (Electronic Medical Record) system to predictive models so that time-sensitive patient outcomes,
			such as the risk of Sepsis, could be given attention as fast as possible. During the year I spent at Epic Systems, I worked on two different sub-teams.
			The first sub-team was responsible for the User-facing workflow that healthcare analysts would use to configure charts that frontline workers
			used daily to include the outputs of the predictive models on a per-patient basis. The work I did was mostly on the backend, and revolved around
			managing data I/O from the old NoSQL-style database that was used throughout Epic's EMR system. The second sub-team I worked on was much more interesting
			to me. On that team, we were working directly on the pipeline that would collect patient data, run the appropriate predictive model, and feed the data
			back into the EMR system, all from an external Kubernetes cluster hosted in Microsoft's Azure. Working with microservices with NodeJS and Go was
			an entirely new world to me, but it only took a month or so before I started to cognize all the advantages of the architecture style. Unfortunately,
			having the entirety of my family and social circle being a 4 hour drive away ended up pushing me away from Epic and the interesting work I was doing.
		</Typography>
		<br />
		<Typography variant="body1">
			In my transition back to the Twin Cities area, I found myself working at the corporate office of one of my favorite retailers, Best Buy, where I still
			am to this day. The team I work on, DAI (Digital Analytics Implementation), deals with technology that is right on par with my experience coming into the job.
			It's largely systems and api building, but it all lives on the client of bestbuy.com. My experience of using JavaScript and NodeJS in a browser environment
			has paired nicely with the data-oriented backend systems I worked with at Epic.
		</Typography>
	</Styled.TabBody>
);

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
				<Accordion expanded={expand.includes(title)} onChange={onChange(title)} >
					<AccordionSummary expandIcon={<ExpandMore />}>
						{ title }
					</AccordionSummary>
					<AccordionDetails>
						{ details }
					</AccordionDetails>
				</Accordion>
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
		<Table size="small" stickyHeader>
			<TableHead>
				<TableRow>
					<Styled.TableCell>Title</Styled.TableCell>
					<Styled.TableCell align="right">Department</Styled.TableCell>
					<Styled.TableCell align="right">Number</Styled.TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{courses?.map?.(course => (
					<TableRow key={course.title}>
						<TableCell>{course.title}</TableCell>
						<TableCell align="right">{course.dept}</TableCell>
						<TableCell align="right">{course.number}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</Styled.TabBody>);
};

const Professional = props => {
	const projects = useMemo(() => ({
		'AlexBrausen.com': <div>
			<p>This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.</p>
	
			<h4>Stack</h4>
			<h5>Frontend</h5>
			<p>A Preact.js client is built using functional components and a few MaterialUI components (which I hope to transition to use `styled-components` soon). The `preact-cli` is used for building into production assets.</p>
			<h5>Backend</h5>
			<p>A simple Node.js server built with express is used to serve these static files, and also exposes an api for the client to fetch info via REST calls.</p>
	
			<h4>Deployment</h4>
			<p>I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the above Stack into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.</p>
	
			<h4>Future</h4>
			<p>There's a lot that I would hope to do with this site, but it's hard to find time do so. Here's a list of potential improvements in a roughly priority-based order:</p>
			<ul>
				<li>Add the ability to interact with the playlist in intuitive or meaningful ways (sorting, voting on the songs that are in the playlist, etc.)</li>
				<li>Add features to the Game of Life app such as Toggling cells, changing the rate of time, and using a seed for sharing starting configs</li>
				<li>Review the youtube channels listed, giving links to specific videos that have content I find interesting.</li>
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
				<br />The source code for this can be found on <a href="https://github.com/Brausen42/Snake">my github</a>
			</p>
		</div>,
		'Game of Life': <div>
			<p class="col-lg-8">
		  My interest in Cellular Automata lead me to recreate the <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Game of Life</a> introduced by John Conway in 1970.
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
			<h3>Associate Digital Engineer II @ Best Buy - DAI (Digital Analytics implementation)</h3>
			<small>July 2019 - Now (July 2019 - July 2020 was Contractor via Randstad)</small>
			<p>
				DAI is responsible for most of the 3rd party integrations, as well as analytics related to user interactions with the core <a href="https://www.bestbuy.com">BestBuy.com</a> experience.
				I've worked the most on the client-side analytics framework that connects data gathered by UI components with reporting and recommendations systems on the backend.
				Although pretty much all of the code that goes onto the website from DAI is non-visual, we have built an internal tool as a chrome
				extension to visualize the data being processed by our team on any given Best Buy page.
				The main technologies we work with are ES6+ JavaScript, npm/yarn, Babel, Webpack, Preact, MaterialUI, and WebdriverIO.
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
		Overview: <Overview />,
		Employment: <FullExpansion panels={employment} />,
		Education: <Education />,
		Projects: <FullExpansion panels={projects} />,
		Interests: <FullExpansion panels={interests} />
	}), [projects, employment, interests]);
	return <FullTabs tabs={tabs} />;
};

export default Professional;
