"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    var assert = function assert(actual, expected, name) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.error(actual, expected);
        throw 'Fail: ' + name;
      }
    }

    // job of sort:
    // - ensure events that start early come before ones that start later
    // - and if events start at the same time, then the ones that finish first come first

    // sort Tests
    ;(function () {
      var tests = [{
        given: [Event(0, 2), Event(0, 1)],
        expected: [Event(0, 1), Event(0, 2)]
      }, {
        given: [Event(1, 2), Event(0, 1)],
        expected: [Event(0, 1), Event(1, 2)]
      }];

      tests.forEach(function (test) {
        assert(sortEvents(test.given), test.expected);
      });
    })();

    // addOrCreateRowGroup Tests
    (function () {

      var tests = [{
        given: {
          groupList: [],
          event: Event(0, 1)
        },
        expected: [EventGroup(0, 1, [Event(0, 1)])]
      }, {
        given: {
          groupList: [EventGroup(0, 1, [Event(0, 1)])],
          event: Event(0, 2)
        },
        expected: [EventGroup(0, 2, [Event(0, 1), Event(0, 2)])]
      }, {
        given: {
          groupList: [EventGroup(0, 1, [Event(0, 1)])],
          event: Event(1, 2)
        },
        expected: [EventGroup(0, 1, [Event(0, 1)]), EventGroup(1, 2, [Event(1, 2)])]
      }, {
        name: 'add to existing row when large first event',
        given: {
          groupList: [EventGroup(0, 50, [Event(0, 50), Event(10, 20)])],
          event: Event(20, 30)
        },
        expected: [EventGroup(0, 50, [Event(0, 50), Event(10, 20), Event(20, 30)])]
      }];

      tests.forEach(function (test) {
        assert(addOrCreateRowGroup(test.given.groupList, test.given.event), test.expected, test.name);
      });
    })();

    // addOrCreateColumnGroup Tests
    (function () {

      var tests = [{
        name: 'creates a new column group',
        given: {
          groupList: [],
          event: Event(0, 1)
        },
        expected: [EventGroup(0, 1, [Event(0, 1)])]
      }, {
        name: 'adds to existing column group when events dont collide',
        given: {
          groupList: [EventGroup(0, 1, [Event(0, 1)])],
          event: Event(1, 2)
        },
        expected: [EventGroup(0, 2, [Event(0, 1), Event(1, 2)])]
      }, {
        name: 'adds to first column group when events dont collide and theres 2 columns',
        given: {
          groupList: [EventGroup(540, 600, [Event(540, 600)]), EventGroup(560, 620, [Event(560, 620)])],
          event: Event(610, 670)
        },
        expected: [EventGroup(540, 670, [Event(540, 600), Event(610, 670)]), EventGroup(560, 620, [Event(560, 620)])]
      }, {
        name: 'creates new column group when events collide',
        given: {
          groupList: [EventGroup(0, 1, [Event(0, 1)])],
          event: Event(0, 2)
        },
        expected: [EventGroup(0, 1, [Event(0, 1)]), EventGroup(0, 2, [Event(0, 2)])]
      }, {
        name: 'multiple existing columns',
        given: {
          groupList: [EventGroup(0, 50, [Event(0, 50)]), EventGroup(10, 20, [Event(10, 20)])],
          event: Event(20, 30)
        },
        expected: [EventGroup(0, 50, [Event(0, 50)]), EventGroup(10, 30, [Event(10, 20), Event(20, 30)])]
      }];

      tests.forEach(function (test) {
        assert(addOrCreateColumnGroup(test.given.groupList, test.given.event), test.expected, test.name);
      });
    })();

    // rowGroupToRenderableList Test
    (function () {
      var tests = [{
        name: 'Produces flat renderable event from nested event',
        given: {
          renderableEventsList: [],
          rowGroup: RowGroup(0, 1, [EventGroup(0, 1, [Event(0, 1)])])
        },
        expected: [RenderableEvent(0, 1, 1, 0)]
      }, {
        name: 'add to existing row',
        given: {
          renderableEventsList: [RenderableEvent(0, 1, 1, 0)],
          rowGroup: RowGroup(1, 2, [EventGroup(1, 2, [Event(1, 2)])])
        },
        expected: [RenderableEvent(0, 1, 1, 0), RenderableEvent(1, 2, 1, 0)]
      }, {
        name: 'row with multiple events in a column',
        given: {
          renderableEventsList: [],
          rowGroup: RowGroup(0, 2, [EventGroup(0, 1, [Event(0, 1), Event(1, 2)])])
        },
        expected: [RenderableEvent(0, 1, 1, 0), RenderableEvent(1, 2, 1, 0)]
      }, {
        name: 'row with multiple columns',
        given: {
          renderableEventsList: [],
          rowGroup: RowGroup(0, 2, [EventGroup(0, 1, [Event(0, 1)]), EventGroup(0, 2, [Event(0, 2)])])
        },
        expected: [RenderableEvent(0, 1, 2, 0), RenderableEvent(0, 2, 2, 1)]
      }, {
        name: 'row with multiple columns real example',
        given: {
          renderableEventsList: [],
          rowGroup: RowGroup(540, 670, [EventGroup(540, 670, [Event(540, 600), Event(610, 670)]), EventGroup(560, 620, [Event(560, 620)])])
        },
        expected: [RenderableEvent(540, 600, 2, 0), RenderableEvent(610, 670, 2, 0), RenderableEvent(560, 620, 2, 1)]
      }, {
        name: 'large first column',
        given: {
          renderableEventsList: [],
          rowGroup: RowGroup(0, 50, [EventGroup(0, 50, [Event(0, 50)]), EventGroup(10, 30, [Event(10, 20), Event(20, 30)])])
        },
        expected: [RenderableEvent(0, 50, 2, 0), RenderableEvent(10, 20, 2, 1), RenderableEvent(20, 30, 2, 1)]
      }];

      tests.forEach(function (test) {
        assert(rowGroupToRenderableList(test.given.renderableEventsList, test.given.rowGroup), test.expected, test.name);
      });
    })();

    // layOutDay Test
    (function () {
      var tests = [{
        name: 'Renders sample events',
        given: sampleData,
        expected: [RenderableEvent(30, 150, 1, 0), RenderableEvent(540, 600, 2, 0), RenderableEvent(610, 670, 2, 0), RenderableEvent(560, 620, 2, 1)]
      }, {
        name: 'Handles events starting at same time',
        given: [Event(0, 1), Event(0, 1), Event(0, 1)],
        expected: [RenderableEvent(0, 1, 3, 0), RenderableEvent(0, 1, 3, 1), RenderableEvent(0, 1, 3, 2)]
      }, {
        name: 'Large first column',
        given: [Event(0, 50), Event(10, 20), Event(20, 30)],
        expected: [RenderableEvent(0, 50, 2, 0), RenderableEvent(10, 20, 2, 1), RenderableEvent(20, 30, 2, 1)]
      }];

      tests.forEach(function (test) {
        assert(layOutDay(test.given), test.expected, test.name);
      });
    })();
  }, {}] }, {}, [1]);