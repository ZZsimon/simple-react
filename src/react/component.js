import { enqueueSetState } from './set-state-queue'
class Component {
    constructor(props = {}) {
        this.isReactComponent = true;

        this.state = {};
        this.props = props;
        Object.freeze(this.props);
    }

    setState(nextState) {
        enqueueSetState(nextState, this);
    }
}

export default Component;