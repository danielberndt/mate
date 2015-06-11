import React from "react";
import api from "./api";

export default function(deps) {
  return function(Comp) {
    return class extends React.Component {

      constructor(props) {
        super(props);
        this.depListeners = {};
        this.state = this.loadData();
      }

      componentWillReceiveProps(nextProps) {
        this.setState(this.loadData(null, nextProps));
      }

      apiDidUpdate(propName) {
        this.setState(this.loadData(propName));
      }

      loadData(depName, props=this.props) {
        const updateData = function(data, dep) {
          if (this.depListeners[dep]) this.depListeners[dep].unlisten();
          const val = deps[dep](api, props);
          this.depListeners[dep] = val.listener.listen(this.apiDidUpdate);
          data[dep] = val;
          return data;
        };
        if (depName) {
          return updateData(this.state, depName);
        } else {
          return Object.keys(deps).reduce(this::updateData, {});
        }
      }

      render() {
        const isLoadingNames = Object.keys(this.state).filter(dep => this.state[dep].isLoading).map(dep => this.state[dep].name);
        if (isLoadingNames.length > 0) return <div>is loading {isLoadingNames.join(", ")}</div>;

        const errorNames = Object.keys(this.state).filter(dep => this.state[dep].error).map(dep => this.state[dep].name);
        if (errorNames.length > 0) return <div>couldn't load {errorNames.join(", ")}</div>;

        const data = Object.keys(this.state).reduce((memo, dep) => {memo[dep] = this.state[dep].data; return memo; }, {});

        const comp = <Comp {...this.props} {...data}/>;

        const requiredUndefinedNames = Object.keys(this.state).filter(dep => this.state[dep].requiredUndefined).map(dep => this.state[dep].name);
        if (requiredUndefinedNames.length > 0) return <div>is loading {requiredUndefinedNames.join(", ")}</div>;

        return comp;
      }
    };

  };
}
