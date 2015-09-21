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

function collidingWithFirst(event, eventList) {
  eventList = eventList.slice(1)
  var colliding = eventList.filter(function(e) { return doesCollide(event, e) })

  if (colliding.length === 0) return 0
  return 1 + collidingWithFirst(colliding[0], colliding)
}

console.log('test collidingWithFirst');
console.log(collidingWithFirst({start: 30, end: 150}, sample), 0);
console.log(collidingWithFirst({start: 540, end: 600}, sample.slice(1)), 1);
console.log(collidingWithFirst({start: 560, end: 620}, sample.slice(2)), 1);


function layOutDay(events) {
  events.forEach(function(event) {
    
  })
}

// layOutDay(sample)
