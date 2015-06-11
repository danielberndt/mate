import React from "react";
import load from "../../load";

@load({
  task: (api, props) => api.getTask(props.taskId)
})
export default class {
  displayName: "myComp"

  render() {
    return <div>Title: {this.props.task.title}</div>;
  }
}
