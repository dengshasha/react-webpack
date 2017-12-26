import React from 'react'
import ReactDom from 'react-dom'

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'

import Home from './pages/Home'
import User from './pages/User'
import Login from './pages/Login'
import Header from './components/Header'
// import createBrowserHistory from 'history/createBrowserHistory';

// const history = createBrowserHistory();

const App = () => (
	<Router>
		<div>
			<Header />
			<Switch>
				<Route exact path="/" component={Home}/>
				<Route strict path="/login" component={Login} />
				<Route path="/user" component={User}/>
				<Route path="/:name" render={() => <h2>你能看到我吗？</h2>}/>
			</Switch>
		</div>
	</Router>
)

if (module.hot) {
	module.hot.accept(() => {
		ReactDom.render(
			<App />,
			document.getElementById('root')
		)
	})
}


ReactDom.render(
	<App />,
	document.getElementById('root')
)