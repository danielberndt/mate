/*eslint-env mocha*/

import expect from "expect";
import SimpleLoadComp from "./fixtures/simple-load-component";
import jsdom from "jsdom";
import ReactWithAddons from "react/addons";
import React from "react";

const {TestUtils} = ReactWithAddons.addons;

describe("basics", function() {

  global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
  global.window = document.parentWindow;
  global.navigator = {userAgent: "node.js"};

  it("should work", function() {
    expect(true).toBe(true);
    const c = TestUtils.renderIntoDocument(<SimpleLoadComp taskId={5}/>);

    // api.done(function() {
    //   console.log(React.findDOMNode(c).outerHTML);

    // })

  });
});
