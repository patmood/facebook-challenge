var sampleData = [
	{start: 30, end: 150},
	{start: 540, end: 600},
	{start: 560, end: 620},
	{start: 610, end: 670}
]

function createEventEl(event) {
  var node = document.createElement('div')
  node.className = 'event'
  node.style.cssText = 'top:' + event.top + 'px;'
                  + 'left:' + event.left + 'px;'
                  + 'width:' + event.width + 'px;'
                  + 'height:' + event.height + 'px;'
  return node
}

function render(renderable) {
  var calendar = document.getElementById('cal-container')

  renderable.forEach(function(renderableEvent) {
    var eventEl = createEventEl(renderableEvent)
    calendar.appendChild(eventEl)
  })
}

render(
  flatRenderableList(
    groupToRow(
      groupEventRow(
        sortEvents(sampleData)
      )
    )
  )
)
