import { renderComponent } from '../react-dom/render'

class Component {
    constructor( props = {} ) {
        this.isReactComponent = true;

        this.state = {};
        this.props = props;
        Object.freeze(this.props);
    }

    setState( nextState ) {
        Object.assign( this.state, nextState );
        renderComponent( this );
    }
}

export default Component;