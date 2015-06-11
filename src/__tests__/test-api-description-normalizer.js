/*eslint-env mocha*/

import expect from "expect";
import builder from "../api-description-normalizer";

describe("apiDescriptionNormalizer", function() {

  it("should work for a simple example", function() {
    expect(builder({
      task: {
        fields: ["id"]
      }
    })).toEqual({
      task: {
        name: "task",
        singleton: false,
        deps: {},
        fields: {
          id: {
            isId: true,
            deps: {},
            default: undefined
          }
        }
      }
    });
  });

  it("should work for fields as a comma-separated string", function() {
    expect(builder({
      task: {
        singleton: true,
        fields: "id,name"
      }
    })).toEqual({
      task: {
        name: "task",
        singleton: true,
        deps: {},
        fields: {
          id: {
            isId: true,
            deps: {},
            default: undefined
          },
          name: {
            isId: false,
            deps: {},
            default: undefined
          }
        }
      }
    });
  });

  it("should work for fields as a comma-separated string within an array", function() {
    expect(builder({
      task: {
        singleton: true,
        fields: ["id,name", "foo"]
        // fields: ["id,name", {commentCount: {deps: ["comment.taskId"]}}, {deckIds: {default: []}}]
      }
    })).toEqual({
      task: {
        name: "task",
        singleton: true,
        deps: {},
        fields: {
          id: {
            isId: true,
            deps: {},
            default: undefined
          },
          name: {
            isId: false,
            deps: {},
            default: undefined
          },
          foo: {
            isId: false,
            deps: {},
            default: undefined
          }
        }
      }
    });
  });

  it("should work for fields as an object", function() {
    expect(builder({
      task: {
        singleton: true,
        fields: [
          {id: {}, name: {default: "depends"}},
          {commentCount: {deps: ["comment.taskId"], default: 0}}
        ]
      }
    })).toEqual({
      task: {
        name: "task",
        singleton: true,
        deps: {},
        fields: {
          id: {
            isId: true,
            deps: {},
            default: undefined
          },
          name: {
            isId: false,
            deps: {},
            default: "depends"
          },
          commentCount: {
            isId: false,
            deps: {comment: {taskId: true}},
            default: 0
          }
        }
      }
    });
  });

  it("should throw for bad deps", function() {
    expect(() => builder({
      task: {
        fields: "id",
        deps: {}
      }
    })).toThrow();

    expect(() => builder({
      task: {
        fields: "id",
        deps: "bla.foo"
      }
    })).toThrow();


    expect(() => builder({
      task: {
        fields: "id",
        deps: ["bla.foo", "bla"]
      }
    })).toThrow();
  });

  it("should throw for bad fields", function() {
    expect(() => builder({
      task: {
        fields: "id,"
      }
    })).toThrow();

    expect(() => builder({
      task: {
        fields: ["id", null]
      }
    })).toThrow();
  });

  it("should throw for bad deps in fields", function() {
    expect(() => builder({
      task: {
        fields: "id,"
      }
    })).toThrow();

    expect(() => builder({
      task: {
        fields: [{id: {deps: {}}}]
      }
    })).toThrow();

    expect(() => builder({
      task: {
        fields: [{id: {deps: ["bla"]}}]
      }
    })).toThrow();
  });


});
