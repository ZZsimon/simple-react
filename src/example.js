// import React from 'react'
// import ReactDOM from 'react-dom'
import React from './react/index'
import ReactDOM from './react-dom/index'

const Num=function ({num}) {
    return <h1>{num}</h1>
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

        for ( let i = 0; i < 100; i++ ) {
            this.setState( { num: this.state.num + 1 } );
            console.log( this.state.num ); 
        }

    }

    render() {
        return (
            <h1  onClick={ () => this.onClick()}>
                <span>{this.state.num}</span>
            </h1>
        //    <div>
        //        <Num num={this.state.num} />
        //        <button  onClick={ () => this.onClick()}>增加</button>
        //    </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById( 'root' )
);