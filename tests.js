function assert(expected, actual, name) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(expected, actual)
    throw 'Fail: ' + name
  }
}

// job of sort:
// - ensure events that start early come before ones that start later
// - and if events start at the same time, then the ones that finish first come first

;(function sortTests() {

  var tests = [
    {
      given: [Event(0,2), Event(0,1)],
      expected: [Event(0,1), Event(0,2)]
    },
    {
      given: [Event(1,2), Event(0,1)],
      expected: [Event(0,1), Event(1,2)]
    }
  ]

  tests.forEach(function(test) {
    assert(sortEvents(test.given), test.expected)
  })

})()

;(function addOrCreateRowGroupTests() {

  var tests = [
    {
      given: {
        groupList: [],
        event: Event(0,1)
      },
      expected: [EventGroup(0,1, [Event(0,1)])]
    },
    {
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(0,2)
      },
      expected: [EventGroup(0, 2, [Event(0,1), Event(0,2)])]
    },
    {
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(1,2)
      },
      expected: [EventGroup(0, 1, [Event(0,1)]), EventGroup(1,2,[Event(1,2)])]
    },
  ]

  tests.forEach(function(test) {
    assert(addOrCreateRowGroup(test.given.groupList, test.given.event), test.expected)
  })

})()

;(function addOrCreateColumnGroupTests() {

  var tests = [
    {
      name: 'creates a new column group',
      given: {
        groupList: [],
        event: Event(0,1)
      },
      expected: [EventGroup(0,1, [Event(0,1)])]
    },
    {
      name: 'adds to existing column group when events dont collide',
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(1,2)
      },
      expected: [EventGroup(0, 2, [Event(0,1), Event(1,2)])]
    },
    {
      name: 'adds to first column group when events dont collide and theres 2 columns',
      given: {
        groupList: [EventGroup(540, 600, [Event(540,600)]), EventGroup(560, 620, [Event(560,620)])],
        event: Event(610,670)
      },
      expected: [EventGroup(540, 600, [Event(540,600), Event(610,670)]), EventGroup(560, 620, [Event(560,620)])]
    },
    {
      name: 'creates new column group when events collide',
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(0,2)
      },
      expected: [EventGroup(0, 1, [Event(0,1)]), EventGroup(0,2,[Event(0,2)])]
    },
  ]

  tests.forEach(function(test) {
    assert(addOrCreateColumnGroup(test.given.groupList, test.given.event), test.expected, test.name)
  })

})()

;(function rowGroupToRenderableListTest() {
  var tests = [
    {
      name: 'Produces flat renderable event from nested event',
      given: {
        renderableEventsList: [],
        rowGroup: RowGroup(0, 1, [ EventGroup(0, 1, [Event(0,1)]) ])
      },
      expected: [RenderableEvent(0, 1, 1, 0)]
    },
	{
      name: 'add to existing row',
      given: {
        renderableEventsList: [RenderableEvent(0, 1, 1, 0)],
        rowGroup: RowGroup(1, 2, [ EventGroup(1, 2, [Event(1,2)]) ])
      },
      expected: [RenderableEvent(0, 1, 1, 0), RenderableEvent(1, 2, 1, 0)]
    },
	{
      name: 'row with multiple events in a column',
      given: {
        renderableEventsList: [],
        rowGroup: RowGroup(0, 2, [ EventGroup(0, 1, [Event(0,1), Event(1,2)]) ])
      },
      expected: [RenderableEvent(0, 1, 1, 0), RenderableEvent(1, 2, 1, 1)]
    },
	{
      name: 'row with multiple columns',
      given: {
        renderableEventsList: [],
        rowGroup: RowGroup(0, 2, [ EventGroup(0, 1, [Event(0,1)]), EventGroup(0, 2, [Event(0,2)]) ])
      },
      expected: [RenderableEvent(0, 1, 2, 0), RenderableEvent(0, 2, 2, 0)]
    },
  ]

  tests.forEach(function(test) {
    assert(rowGroupToRenderableList(test.given.renderableEventsList, test.given.rowGroup), test.expected, test.name)
  })
})()
