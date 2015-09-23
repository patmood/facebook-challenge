"use strict";

var BASE_WIDTH = 600;
var Event = function Event(start, end) {
  return { start: start, end: end };
};
var EventGroup = function EventGroup(start, end, events) {
  return { start: start, end: end, events: events };
};
var RowGroup = function RowGroup(start, end, columns) {
  return { start: start, end: end, columns: columns, columns: columns };
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

function sortEvents(eventList) {
  return eventList.sort(function (eventA, eventB) {
    var startDelta = eventA.start - eventB.start;
    if (startDelta === 0) {
      var endDelta = eventA.end - eventB.end;
      return endDelta === 0 ? 0 : endDelta;
    } else {
      return startDelta;
    }
  });
}

function groupEventRow(eventList) {
  return eventList.reduce(addOrCreateRowGroup, []);
}

function groupEventColumns(eventList) {
  return eventList.reduce(addOrCreateColumnGroup, []);
}

function addOrCreateRowGroup(listOfRowGroups, event) {
  // Group by overlapping events
  var lastGroup = listOfRowGroups[listOfRowGroups.length - 1];
  if (lastGroup && event.start < lastGroup.end) {
    // Add to last group
    lastGroup.events.push(event);
    lastGroup.end = event.end;
    return listOfRowGroups;
  } else {
    // Create new group
    return listOfRowGroups.concat([EventGroup(event.start, event.end, [event])]);
  }
}

function addOrCreateColumnGroup(listOfColumnGroups, event) {
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
}

function eventColumn(eventGroup) {
  return RowGroup(eventGroup.start, eventGroup.end, groupEventColumns(eventGroup.events));
}

function eventListToRow(eventList) {
  return eventList.map(eventColumn);
}

// mapCat or flatMap
// Write reduce over rowgroups that produces renderable event list

function rowGroupToRenderableList(renderableEventsList, rowGroup) {
  var events = [];
  rowGroup.columns.map(function (columnGroup, i) {
    columnGroup.events.map(function (event) {
      events.push(RenderableEvent(event.start, event.end, rowGroup.columns.length, i));
    });
  });

  return renderableEventsList.concat(events);
}

function flatRenderableList(rowGroupList) {
  return rowGroupList.reduce(rowGroupToRenderableList, []);
}

function flowEvents(eventList, fns) {
  return fns.reduce(function (prevResult, currentFn) {
    return currentFn(prevResult);
  }, eventList);
}

// TODO: implement flow function
// FInish reducing
// Start with unsorted event list
// flow through to list of dom nodes
// Render

// Start new version to get time complexity down
// Transduce instead of reduce
// Can render row as soon as its finished

// ES6
// https://web-design-weekly.com/2015/03/19/barebones-es6-project-using-gulp/