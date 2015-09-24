"use strict";

var sampleData = [{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }];

var layOutDay = flow(sortEvents, groupEventRow, eventListToRow, flatRenderableList);

// renderEvents(layOutDay(sampleData))

// renderEvents(layOutDay([Event(0,50), Event(10,20), Event(20,30)]))

// EXPLORATION
// ===========================

var accumulateOrRenderRowGroup = function accumulateOrRenderRowGroup(listOfRowGroups, event, i) {
	var lastGroup = listOfRowGroups[listOfRowGroups.length - 1];
	if (lastGroup && event.start < lastGroup.end) {
		// Add to last group
		lastGroup.events.push(event);
		if (lastGroup.end < event.end) lastGroup.end = event.end;
		return listOfRowGroups;
	} else {
		// Render previous group, start accumulating new one
		renderRow(listOfRowGroups);
		return [EventGroup(event.start, event.end, [event])];
	}
};

var renderRow = flow(eventListToRow, flatRenderableList, renderEvents);

// renderRow(
// 	sortEvents(sampleData).reduce(accumulateOrRenderRowGroup, [])
// )

/*
This sucks because:
- Doesnt render last iteration of reduce
- Reducing function is coupled with renderRow
*/

var reduceAndProcess = function reduceAndProcess(reducer, processor) {
	return function (memo, item, i) {
		memo = reducer(memo, item);
		if (memo.length > 1) {
			processor(memo.slice(0, 1));
			return memo.slice(1);
		} else {
			return memo;
		}
	};
};

renderRow(sortEvents(sampleData).reduce(reduceAndProcess(addOrCreateRowGroup, renderRow), []));

/*
Still doesnt render last iteration of reduce but is at least decoupled
*/