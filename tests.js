// step 1: sort
function assert(expected, actual) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
  } else {
    console.error(expected, actual)
    throw 'Fail'
  }
}
var Event = function (start, end) { return { start: start, end: end } }
var EventGroup = function(start, end, events) { return { start: start, end: end, events: events } }

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
      given: {
        groupList: [],
        event: Event(0,1)
      },
      expected: [EventGroup(0,1, [Event(0,1)])]
    },
    {
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(1,2)
      },
      expected: [EventGroup(0, 2, [Event(0,1), Event(1,2)])]
    },
    {
      given: {
        groupList: [EventGroup(0, 1, [Event(0,1)])],
        event: Event(0,2)
      },
      expected: [EventGroup(0, 1, [Event(0,1)]), EventGroup(0,2,[Event(0,2)])]
    },
  ]

  tests.forEach(function(test) {
    assert(addOrCreateColumnGroup(test.given.groupList, test.given.event), test.expected)
  })

})()
