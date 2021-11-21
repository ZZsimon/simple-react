import React from 'react'
import ReactDOM from 'react-dom'

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

    componentDidMount(){
        // 默认setState在生命周期函数中是表现为“异步”的
        // 也就是说会合并所有的state值

        // 执行 componentDidMount 方法的时候，React会将isBatchingUpdates设为true
        // 执行完毕后，会触发 事务的 close方法的， isBatchingUpdates =false
        // 因此在这个方法里面执行setState，只会发现isBatchingUpdates的值是true
        // 于是传入的state全部被合并
        // 此时，这两个this.state.num都是1，因此传入的num值都是2
        this.setState( { num: this.state.num + 1 } );
        this.setState( { num: this.state.num + 1 } );


        // 当执行这里的setState的时候，「是否需要批量更新的值」已经是false了
        setTimeout(() => {
            // 第一个执行，将「是否需要批量更新的值」设true
            // 执行完毕，设为false
            // 下一个执行的时候，还是false
            // 因为默认setState执行完毕就是会设为false
            this.setState( { num: this.state.num + 1 } );
            this.setState( { num: this.state.num + 1 } );
        }, 0);
    }


    onClick() {
        // setState本质上就是去调用当前实例的render方法，重新渲染
        // 由于调用这个方法的时候，当前实例已经存在
        // 因此会直接拿返回的新DOM来替换旧DOM

        for ( let i = 0; i < 100; i++ ) {
            // 第一次setState的时候 isBatchingUpdates 就是true
            // 因为它在合成事件中
            // 除非这个事件绑定的onClick方法执行完毕，否则isBatchingUpdates一只都是true

            // 也就是说在 componentDidMount 和合成事件中 setState只会进入队列，而不会触发批量更新方法

            this.setState( { num: this.state.num + 1 } );
            console.log( this.state.num ); 
        }
        
        // setTimeout(() => {
            // for ( let i = 0; i < 100; i++ ) {
            //     this.setState( { num: this.state.num + 1 } );
            //     console.log( this.state.num ); 
            // }
        // },0)

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