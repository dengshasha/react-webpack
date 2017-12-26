import React, { Component } from 'react'
import {
	NavLink
} from 'react-router-dom'

import '../css/header.css'

class Header extends Component {
	render() {

		return (
			<header>
				<nav>
					<ul>
						<li><NavLink exact to="/">Home</NavLink></li>
						<li><NavLink 
							to={{
								pathname: "/user",
								state: {isLogin: true}
							}}>
							User</NavLink></li>
						<li><NavLink to="/login">Login</NavLink></li>
					</ul>
				</nav>
			</header>
		)
	}
}

export default Header