var sample = [
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
]
var baseWidth = 600

function createEventEl(event) {
  var top = event.start
  var height = event.end - event.start
  var width = event.width
  var left = 0
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

function setWidth(containers) {
  return containers.map(function(container) {
    return container.map(function(event) {
      event.width = baseWidth / container.length
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

  var containers = setWidth(containers)

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
