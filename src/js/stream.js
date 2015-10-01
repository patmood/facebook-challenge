import {flow, sortEvents, groupEventRow, eventListToRow, flattenRenderableList, renderEvents, layOutDay} from './calendar'



layOutDay(sampleData)

// renderEvents(layOutDay([Event(0,50), Event(10,20), Event(20,30)]))

global.layOutDay = layOutDay
