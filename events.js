// [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
var events = [
  createEvent(30, 150, 600, 0),
  createEvent(540, 600, 300, 0),
  createEvent(560, 620, 300, 300),
  createEvent(610, 670, 300, 0),
]

events.forEach(function (event) {
  document.getElementById('cal-container').appendChild(event)
})


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

function layOutDay(events) {

}
