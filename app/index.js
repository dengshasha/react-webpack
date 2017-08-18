import React, {Component} from 'react'
import ReactDOM from 'react-dom'

//样式文件
import styles from './less/index.less'


class App extends Component {
    render() {
        return(
            <div>
                <h1 className = 'title'>你好！我的第一个React项目</h1>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
