const BASE_WIDTH = 600
const Event = (start, end) => { return { start, end } }
const EventGroup = (start, end, events) => { return { start, end, events } }
const RowGroup = (start, end, columns) => { return { start, end, columns } }
const RenderableEvent = (start, end, rowLength, columnIndex) => {
  const width = BASE_WIDTH / rowLength
  return {
    top: start,
    left: width * columnIndex,
    width: width,
    height: end - start
  }
}

const sortEvents = (eventList) => {
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

const groupEventRow = (eventList) => eventList.reduce(addOrCreateRowGroup, [])

const addOrCreateRowGroup = (listOfRowGroups, event) => {
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

const addOrCreateColumnGroup = (listOfColumnGroups, event) => {
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

const columnizeEvents = (eventGroup) => RowGroup(eventGroup.start, eventGroup.end, groupEventColumns(eventGroup.events))

const eventListToRow = (eventList) => eventList.map(columnizeEvents)

// mapCat or flatMap
// Write reduce over rowgroups that produces renderable event list

const rowGroupToRenderableList = (renderableEventsList, rowGroup) => {
  let events = []
  rowGroup.columns.map((columnGroup, i) => {
    columnGroup.events.map((event) => {
      events.push( RenderableEvent(event.start, event.end, rowGroup.columns.length, i) )
    })
  })

  return renderableEventsList.concat(events)
}

const flatRenderableList = (rowGroupList) => rowGroupList.reduce(rowGroupToRenderableList, [])

const createEventEl = (event) => {
  let node = document.createElement('div')
  node.className = 'event'
  node.style.cssText = 'top:' + event.top + 'px;'
                  + 'left:' + event.left + 'px;'
                  + 'width:' + event.width + 'px;'
                  + 'height:' + event.height + 'px;'
  return node
}

const renderEvents = (renderable) => {
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

const flow = (...fns) => (arg) => fns.reduce((memo, fn) => fn(memo), arg)


// TODO:
// Start new version to get time complexity down
// Transduce instead of reduce
// Can render row as soon as its finished
