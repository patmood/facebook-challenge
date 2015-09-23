const sampleData = [
	{start: 30, end: 150},
	{start: 540, end: 600},
	{start: 560, end: 620},
	{start: 610, end: 670}
]

const layOutDay = (events) => {
	flow(events, [sortEvents, groupEventRow, eventListToRow, flatRenderableList, renderEvents])
}

layOutDay(sampleData)