export default {
  getTask(id) {
    return {
      listener: {
        listen() { }
      },
      data: {
        title: "bla " + id
      },
      isLoading: false,
      error: false,
      name: "task"
    };
  }
};
