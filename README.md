_work in progress_

# GOALS:

## Minimal API:

 - `defineApi({...})`
 - `@load({task: (api, props) => api.getTask(props.taskId)})` possible shortcut: `@load("task")`

## Smart field loading:

`this.props.task.title` causes getter to load 'title' attribute from api (returns 'undefined' in the meantime)

## Optimistic Changes:

`api.updateTask(task, {attr})` will push **attr** to the `pending change queue`


## Todos

 - api-description-normaliser
   - tests
 - models
   - research properties
   - register calls
   - model updated data / update dependencies
 - collections
 - sketch out (mockable) api-http-layer interface
 - optimisic changes queue (associated with request)
 -



kinds of data:

- collection: `/tasks?title=hi` (contains ref to models)
- singleton-ref: `/logged-in-user` (contains ref to user) ... model needs to update once underlying user changes
- singleton: `/settings`
- model: `/task/23`

```
apiDescription = {
  task: {
    singleton: true,
    fields: ["id,name", {commentCount: {deps: ["comment.taskId"]}}, {deckId: {default: []}}]
  },
  tasks: { // used for creation, deletion
    copyFieldsFrom: "task"
  },
  tasksViaTitle: {
    // DON'T define it here!
    // we need a different layer for this (models,ids,fields) => api-call
    endpoint: (data) => `/tasks?title=${data}` // default is /{model-name}/{data},
    deps: ['task.title']
  },
  commentsViaTask: {
    modelName: "comment",
    endpoint: (data) => `/comments?taskId=${data}`
  },
  deck: {
    singleton: true,
    deps: {
      taskCount: ['task.deckId'],
      effortCount: ['task.deckId', 'task.effort']
      blockedTasks: ['task.deckId', 'task.status']
    }
  },
  loggedInUser: {
    singleton: true,
  }
}

api.createTask(task) =>
  send Data
    -> once arrived update all deps with 'task.*'

api.createCommentsViaTask({data}) =>
  send Data
    -> once arrived update all deps with '${modelName}.*'
  add (optimistic) comment to queue

api.deleteTask(taskId) => update all deps with 'task.*'

api.updateTask(oldTask,{prop1, prop2}) :
 - sendData
 - add {Task: {id, prop1, prop2}, fetchTask} to processing queue
 - check if prop1, prop2 differ from oldTask. if so update deps with 'modelName.prop1,prop2'

whenever fetching data:
  if prev data changed: update deps with 'modelName.propChange'


api.getTask(id) =>
  returns empty Object immediately, set up with es5 properties

@load({
  task: (api, props) => api.getTask(props.taskId),
})
class myComp {

  handleSubmit({data}) {
    return api.createTask({data});
  },

  render() {
    return <div>{this.task.title}</div>
  }

}

// possibly:

@load({
  task: (api, props) => api.getTask(props.taskId),
  attachment: ["task.attachmentId", (api, props, {task}) => api.getAttachment(task.attachmentId)]
})

api.getTask(props.taskId) -> {
  data,
  listeners,
  isLoading,
  error,
  name
}
```