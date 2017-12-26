import React, { Component } from 'react'
import '../css/user.css'


class User extends Component {
	componentDidMount() {
		console.log(this.props)
	}

	goHome() {
		setTimeout(() => {
			this.props.history.push('/');
		}, 2000)
	}

	render() {
		return(
			<div className="user">
				<h1 className="title" onClick={() => this.goHome()}>Hello, I am an user page!</h1>	
			</div>	
		) 
	}
}

export default User 
