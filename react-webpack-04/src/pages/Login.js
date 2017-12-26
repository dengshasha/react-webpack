import React, { Component } from 'react'
import {
	NavLink,
	Route,
	HashRouter as Router
} from 'react-router-dom'

import '../css/user.css'


class Login extends Component {
	componentDidMount() {

		console.log('login', this.props)
	}
	render() {
		return(
			<div className="user">
				<h1 className="title">Hello, I am a Login page!</h1>
				<NavLink to={`${this.props.match.url}/loginOne`}>登录1</NavLink>
				<NavLink to={`${this.props.match.url}/loginTwo`}>登录2</NavLink>
				<Router>
					<Route path={`${this.props.match.path}/:name`}
				  		render= {({match}) =>( <div> <h3> {match.params.name} </h3></div>)}/>
				</Router>
				
			</div>	
		) 
	}
}



export default Login 