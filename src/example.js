import React from './react/index'
import ReactDOM from './react-dom/index'

const Num=function () {
    return <h1>22</h1>
}

class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            num: 1
        }
    }

    onClick() {
        // setState本质上就是去调用当前实例的render方法，重新渲染
        // 由于调用这个方法的时候，当前实例已经存在
        // 因此会直接拿返回的新DOM来替换旧DOM
        this.setState( { num: this.state.num + 1 } );
    }

    render() {
        return (
           <Num />
                // <span  onClick={ () => this.onClick()}>{this.state.num}</span>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById( 'root' )
);