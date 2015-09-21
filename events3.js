var sample = [
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
]
var BASE_WIDTH = 600

function createEventEl(event) {
  var top = event.start
  var height = event.end - event.start
  var width = event.width
  var left = event.offset * width
  var d = document.createElement('div')
  d.className = 'event'
  d.style.cssText = 'top:' + top + 'px;'
                  + 'height:' + height + 'px;'
                  + 'width:' + width + 'px;'
                  + 'left:' + left + 'px;'
  return d
}

function createContainers(eventList) {
  var containerEndTime = eventList[0].end
  var containers = [[]]

  eventList.forEach(function(event) {
    if (event.start <= containerEndTime) {
      // Add event to existing container
      containers[containers.length-1].push(event)
      containerEndTime = event.end
    } else {
      // Start new container
      containerEndTime = event.end
      containers.push([event])
    }
  })
  return containers
}

function doesCollide(event1, event2) {
  return (event1.start >= event2.start && event1.start <= event2.end)
          || (event1.end >= event2.start && event1.end <= event2.end)
}

function maxConcurrentEvents(eventList) {
  var event = eventList[0]
  var colliding = eventList.slice(1).filter(function(e) { return doesCollide(event, e)})
  if (colliding.length === 0) return 0

  return colliding.reduce(function(memo, currentEvent, i) {
    return memo + maxConcurrentEvents(colliding)
  }, 1)
}

function setOffset(containers) {
  return containers.map(function(eventList) {
    return eventList.map(function(event, i) {
      event.offset = i
      return event
    })
  })
}

function setWidth(containers) {
  return containers.map(function(container) {
    var width = BASE_WIDTH / (maxConcurrentEvents(container) + 1)
    return container.map(function(event) {
      event.width = width
      return event
    })
  })
}

function render(containers) {
  var calendar = document.getElementById('cal-container')
  var flatContainers = containers.reduce(function(memo, container) {
    return memo.concat(container)
  }, [])

  flatContainers.forEach(function(event) {
    var eventEl = createEventEl(event)
    calendar.appendChild(eventEl)
  })
}

function layOutDay(events) {
  var containers = createContainers(events)

  containers = setWidth(containers)
  containers = setOffset(containers)

  render(containers)
}

layOutDay(sample)


/*

PROCESS:
- Assume sorted by start time
- Split into 'containers' of colliding events (these will have same width)
- Find number of simutaneously colliding events -> Get W
- Get offset of each event

*/
