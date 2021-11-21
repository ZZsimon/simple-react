import Component from '../react/component'
import { setAttribute } from './dom'
import { diff } from './diff'

/**
 * 
 * @returns 返回一个Component类的实例
 */
function createComponent( component, props ) {
    let inst;

    if ( component.prototype && component.prototype.render ) {
            inst = new component( props );
      } else {
            inst = new Component( props );
            inst.constructor = component;
            inst.render = function() {
            return this.constructor( props );
        }
      }

    return inst;
}


function unmountComponent( component ) {
    if ( component.componentWillUnmount ) component.componentWillUnmount();
    removeNode( component.base);
}

function setComponentProps( component, props ) {
    if ( !component.base ) {
            if ( component.componentWillMount ) component.componentWillMount();
      } else if ( component.componentWillReceiveProps ) {
            component.componentWillReceiveProps( props );
      }

    component.props = props;

    renderComponent( component );

}

/**
 * 没有base属性的时候，给实例添加base属性，base是一个真实DOM节点
 * 最终需要把base属性添加到DOM中
 * 
 * 有base的话，替换当前base所在的元素节点
 */
export function renderComponent( component ) {
    let base;
    const renderer = component.render();
    if ( component.base && component.componentWillUpdate ) {
        component.componentWillUpdate();
    }

    // base = _render( renderer );

    base = diff( component.base, renderer );

    if ( component.base ) {
        if ( component.componentDidUpdate ) component.componentDidUpdate();
    } else if ( component.componentDidMount ) {
        component.componentDidMount();
    }

    // if ( component.base && component.base.parentNode ) {
        // 此时 component.base 是<h1>1</h2>
        // base是 <h1>2</h2>

        // 没替换前DOM中存在的是<h1>1</h1>
        // 因此 component.base.parentNode 是有值的
        // 替换完后 DOM中存在的是<h1>2</h1>
        // 因此这个时候 component.base.parentNode 是没有值的
        // 因为 component.base 是 h1>1</h2> 它的父元素已经不存在了

        // component.base.parentNode.replaceChild( base, component.base );
    // }

    component.base = base;
    base._component = component;

}

/**
 * 
 * @param {虚拟DOM节点} vnode 
 * @returns 返回一个真实DOM节点
 * 
 */
function _render( vnode ) {
    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

    if ( typeof vnode === 'number' ) vnode = String( vnode );

    if ( typeof vnode === 'string' ) {
        let textNode = document.createTextNode( vnode );
        return textNode;
    }

    // 当vnode是一个方法的时候，说明传进来了一个react组件
    // babel会将组件转换为一个 方法
    if ( typeof vnode.tag === 'function' ) {

        // 创建react Component类的实例
        const component = createComponent( vnode.tag, vnode.attrs );
        // 给实例添加属性，并按照顺序执行componentWillMount、componentWillReceiveProps
        // 执行 renderComponent() 方法，做了这些事情：
        //  1.执行componentWillUpdate、componentDidUpdate、componentDidMount
        //  2.递归执行_render方法，最终返回一个DOM元素，赋值给component.base属性
        //  这样子，外层_render方法中可以通过获取 component.base 来返回DOM元素
        setComponentProps( component, vnode.attrs );

        // component.base肯定是一个DOM元素
        return component.base;
    }

    const dom = document.createElement( vnode.tag );

    if ( vnode.attrs ) {
        Object.keys( vnode.attrs ).forEach( key => {

            const value = vnode.attrs[ key ];

            setAttribute( dom, key, value );

        } );
    }

    // 有children的话，先向子元素添加children
    if ( vnode.children ) {
        vnode.children.forEach( child => render( child, dom ) );
    }
    // 最后再把子元素返回出去，添加到父元素中
    return dom;
}

/**
 * 往container添加子元素
 * @param {子元素} 虚拟DOM节点
 * @param {父元素} container 
 * _render( vnode ) 返回一个真实DOM节点
 * @returns 
 */
export function render( vnode, container ) {
    return container.appendChild( _render( vnode ) );
}