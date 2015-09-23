const sampleData = [
	{start: 30, end: 150},
	{start: 540, end: 600},
	{start: 560, end: 620},
	{start: 610, end: 670}
]

const createEventEl = (event) => {
  let node = document.createElement('div')
  node.className = 'event'
  node.style.cssText = 'top:' + event.top + 'px;'
                  + 'left:' + event.left + 'px;'
                  + 'width:' + event.width + 'px;'
                  + 'height:' + event.height + 'px;'
  return node
}

const render = (renderable) => {
  const calendar = document.getElementById('cal-container')

  renderable.forEach(function(renderableEvent) {
    const eventEl = createEventEl(renderableEvent)
    calendar.appendChild(eventEl)
  })
}

const renderable = flowEvents(sampleData, [sortEvents, groupEventRow, eventListToRow, flatRenderableList])

render(renderable)
