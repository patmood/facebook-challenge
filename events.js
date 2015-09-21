var sample = [
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
]
var baseWidth = 600

function createEvent(start, end, width, left) {
  var top = start
  var height = end - start
  var d = document.createElement('div')
  d.className = 'event'
  d.style.cssText = 'top:' + top + 'px;'
                  + 'height:' + height + 'px;'
                  + 'width:' + width + 'px;'
                  + 'left:' + left + 'px;'
  return d
}

function doesCollide(event1, event2) {
  return (event1.start >= event2.start && event1.start <= event2.end)
          || (event1.end >= event2.start && event1.end <= event2.end)
}

function maxConcurrent(event, index, eventList) {
  eventList.splice(index, 1)
  var colliding = eventList.filter(function(e) { return doesCollide(event, e)})
  if (colliding.length === 0) return 0
  // if (colliding.length === 1) return 1

  return colliding.reduce(function(memo, currentEvent, i) {
    return memo + maxConcurrent(currentEvent, i, colliding)
  }, 1)
}


console.log('maxConcurrent tests')
// console.log(maxConcurrent({start: 30, end: 150}, 0, sample), 0);
// console.log(maxConcurrent({start: 540, end: 600}, 1, sample), 1);
console.log(maxConcurrent({start: 560, end: 620}, 3, sample), 1);

function layOutDay(events) {
  events.forEach(function(event, i) {
    var width = baseWidth / collidingEvents(event, events).length
    var eventEl = createEvent(event.start, event.end, width, 0)
    document.getElementById('cal-container').appendChild(eventEl)
  })
}

// layOutDay(sample)
