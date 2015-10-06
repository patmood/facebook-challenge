import {
	Event,
	flow,
	sortEvents,
	groupEventRow,
	eventListToRow,
	columnizeEvents,
	flattenRenderableList,
	rowGroupToRenderableList,
	renderEvents,
	layOutDay,
	eventStream,
	streamToRows,
} from './calendar'

const sampleData = [
	{start: 30, end: 150},
	{start: 540, end: 600},
	{start: 560, end: 620},
	{start: 610, end: 670}
]

// Calculate everything then render
// ===================================
// layOutDay(sampleData)
// layOutDay([Event(0,50), Event(10,20), Event(20,30)])

global.layOutDay = layOutDay

// Stream render
// ===================================
// Sort events and push into stream

eventStream(sortEvents(sampleData))
	.pipe(streamToRows)
	.on('data', (data) => {
		// Render here
		const rowGroup = columnizeEvents(data)
		const flatList = rowGroupToRenderableList([], rowGroup)
		renderEvents(flatList)
	})
