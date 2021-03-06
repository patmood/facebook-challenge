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
    var BASE_WIDTH = 600;
    var Event = function Event(start, end) {
      return { start: start, end: end };
    };
    var EventGroup = function EventGroup(start, end, events) {
      return { start: start, end: end, events: events };
    };
    var RowGroup = function RowGroup(start, end, columns) {
      return { start: start, end: end, columns: columns };
    };
    var RenderableEvent = function RenderableEvent(start, end, rowLength, columnIndex) {
      var width = BASE_WIDTH / rowLength;
      return {
        top: start,
        left: width * columnIndex,
        width: width,
        height: end - start
      };
    };

    var sortEvents = function sortEvents(eventList) {
      return eventList.sort(function (eventA, eventB) {
        var startDelta = eventA.start - eventB.start;
        if (startDelta === 0) {
          var endDelta = eventA.end - eventB.end;
          return endDelta === 0 ? 0 : endDelta;
        } else {
          return startDelta;
        }
      });
    };

    var groupEventRow = function groupEventRow(eventList) {
      return eventList.reduce(addOrCreateRowGroup, []);
    };

    var addOrCreateRowGroup = function addOrCreateRowGroup(listOfRowGroups, event) {
      // Group by overlapping events
      var lastGroup = listOfRowGroups[listOfRowGroups.length - 1];
      if (lastGroup && event.start < lastGroup.end) {
        // Add to last group
        lastGroup.events.push(event);
        if (lastGroup.end < event.end) lastGroup.end = event.end;
        return listOfRowGroups;
      } else {
        // Create new group
        return listOfRowGroups.concat([EventGroup(event.start, event.end, [event])]);
      }
    };

    var groupEventColumns = function groupEventColumns(eventList) {
      return eventList.reduce(addOrCreateColumnGroup, []);
    };

    var addOrCreateColumnGroup = function addOrCreateColumnGroup(listOfColumnGroups, event) {
      // Group by non-overlapping events
      var lastGroup = listOfColumnGroups.find(function (columnGroup) {
        return columnGroup.end <= event.start;
      });
      if (lastGroup && event.start >= lastGroup.end) {
        // Add to existing colunm
        lastGroup.events.push(event);
        lastGroup.end = event.end;
        return listOfColumnGroups;
      } else {
        return listOfColumnGroups.concat([EventGroup(event.start, event.end, [event])]);
      }
    };

    var columnizeEvents = function columnizeEvents(eventGroup) {
      return RowGroup(eventGroup.start, eventGroup.end, groupEventColumns(eventGroup.events));
    };

    var eventListToRow = function eventListToRow(eventList) {
      return eventList.map(columnizeEvents);
    };

    // mapCat or flatMap
    // Write reduce over rowgroups that produces renderable event list

    var rowGroupToRenderableList = function rowGroupToRenderableList(renderableEventsList, rowGroup) {
      var events = [];
      rowGroup.columns.map(function (columnGroup, i) {
        columnGroup.events.map(function (event) {
          events.push(RenderableEvent(event.start, event.end, rowGroup.columns.length, i));
        });
      });

      return renderableEventsList.concat(events);
    };

    var flattenRenderableList = function flattenRenderableList(rowGroupList) {
      return rowGroupList.reduce(rowGroupToRenderableList, []);
    };

    var createEventEl = function createEventEl(event) {
      var node = document.createElement('div');
      node.className = 'event';
      node.style.cssText = 'top:' + event.top + 'px;' + 'left:' + event.left + 'px;' + 'width:' + event.width + 'px;' + 'height:' + event.height + 'px;';
      return node;
    };

    var renderEvents = function renderEvents(renderable) {
      var calendar = document.getElementById('cal-container');

      renderable.forEach(function (renderableEvent) {
        var eventEl = createEventEl(renderableEvent);
        calendar.appendChild(eventEl);
      });
    };

    var clearCal = function clearCal() {
      var calendar = document.getElementById('cal-container');
      calendar.innerHTML = '';
    };

    var flow = function flow() {
      for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
      }

      return function (arg) {
        return fns.reduce(function (memo, fn) {
          return fn(memo);
        }, arg);
      };
    };

    // TODO:
    // Start new version to get time complexity down
    // Transduce instead of reduce
    // Can render row as soon as its finished
  }, {}] }, {}, [1]);