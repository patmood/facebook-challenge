import through from 'through2'
import { Readable } from 'stream'

const BASE_WIDTH = 600
export const Event = (start, end) => { return { start, end } }
export const EventGroup = (start, end, events) => { return { start, end, events } }
export const RowGroup = (start, end, columns) => { return { start, end, columns } }
export const RenderableEvent = (start, end, rowLength, columnIndex) => {
  const width = BASE_WIDTH / rowLength
  return {
    top: start,
    left: width * columnIndex,
    width: width,
    height: end - start
  }
}

export const sortEvents = (eventList) => {
  return eventList.sort((eventA, eventB) => {
    const startDelta = eventA.start - eventB.start
    if (startDelta === 0) {
      const endDelta = eventA.end - eventB.end
      return endDelta === 0 ? 0 : endDelta
    } else {
      return startDelta
    }
  })
}

export const groupEventRow = (eventList) => eventList.reduce(addOrCreateRowGroup, [])

export const addOrCreateRowGroup = (listOfRowGroups, event) => {
  // Group by overlapping events
  const lastGroup = listOfRowGroups[listOfRowGroups.length - 1]
  if (lastGroup && event.start < lastGroup.end) {
    // Add to last group
    lastGroup.events.push(event)
    if (lastGroup.end < event.end) lastGroup.end = event.end
    return listOfRowGroups
  } else {
    // Create new group
    return listOfRowGroups.concat([ EventGroup(event.start, event.end, [event]) ])
  }
}

const groupEventColumns = (eventList) => eventList.reduce(addOrCreateColumnGroup, [])

export const addOrCreateColumnGroup = (listOfColumnGroups, event) => {
  // Group by non-overlapping events
  const lastGroup = listOfColumnGroups.find((columnGroup) => columnGroup.end <= event.start)
  if (lastGroup && event.start >= lastGroup.end) {
    // Add to existing colunm
    lastGroup.events.push(event)
    lastGroup.end = event.end
    return listOfColumnGroups
  } else {
    return listOfColumnGroups.concat([ EventGroup(event.start, event.end, [event]) ])
  }
}

export const columnizeEvents = (eventGroup) => RowGroup(eventGroup.start, eventGroup.end, groupEventColumns(eventGroup.events))

export const eventListToRow = (eventList) => eventList.map(columnizeEvents)

// mapCat or flatMap
// Write reduce over rowgroups that produces renderable event list

export const rowGroupToRenderableList = (renderableEventsList, rowGroup) => {
  let events = []
  rowGroup.columns.map((columnGroup, i) => {
    columnGroup.events.map((event) => {
      events.push( RenderableEvent(event.start, event.end, rowGroup.columns.length, i) )
    })
  })

  return renderableEventsList.concat(events)
}

export const flattenRenderableList = (rowGroupList) => rowGroupList.reduce(rowGroupToRenderableList, [])

const createEventEl = (event) => {
  let node = document.createElement('div')
  node.className = 'event'
  node.style.cssText = 'top:' + event.top + 'px;'
                  + 'left:' + event.left + 'px;'
                  + 'width:' + event.width + 'px;'
                  + 'height:' + event.height + 'px;'
  return node
}

export const renderEvents = (renderable) => {
  const calendar = document.getElementById('cal-container')
  renderable.forEach(function(renderableEvent) {
    const eventEl = createEventEl(renderableEvent)
    calendar.appendChild(eventEl)
  })
}

const clearCal = () => {
  const calendar = document.getElementById('cal-container')
  calendar.innerHTML = ''
}

export const flow = (...fns) => (arg) => fns.reduce((memo, fn) => fn(memo), arg)

export const layOutDayAlgorithm = flow(
	sortEvents,
	groupEventRow,
	eventListToRow,
	flattenRenderableList
)

export const layOutDay = flow(
	layOutDayAlgorithm,
  renderEvents
)

// TODO:
// Start new version to get time complexity down
// Transduce instead of reduce
// Can render row as soon as its finished

// create Readable stream
export const rowStream = new Readable

export const streamToRows = through(
  function(chunk, enc, callback) {
    // Right now chunk is always complete object - May not always be the case
    const [row, unfinishedRow] = processChunk(this._unfinishedRow, JSON.parse(chunk.toString()))
    this._unfinishedRow = unfinishedRow
    if (row) this.push(JSON.stringify(row)) // Must push string, not obj
    callback()
  },
  function(callback) {
    if (this._unfinishedRow) this.push(JSON.stringify(this._unfinishedRow))
    callback()
  }
)

// unfinished row, event -> row, unfinished row
const processChunk = (unfinishedRow, event) => {
  if (unfinishedRow && event.start < unfinishedRow.end) {
    // Add to last group
    unfinishedRow.events.push(event)
    if (unfinishedRow.end < event.end) unfinishedRow.end = event.end
    return [ null, unfinishedRow ]
  } else {
    // Create new group
    const finishedRow = unfinishedRow
    return [ finishedRow, EventGroup(event.start, event.end, [event]) ]
  }
}
