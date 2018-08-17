
function addEventListeners (eventsMap) {
  for (var [element, {eventType, handler, preventDefault}] of eventsMap) {
    element.addEventListener(eventType, (event) => {
      handler(event.target)
      if (preventDefault) {
        event.preventDefault()
      }
    }, false)
  }
}

function printButtonId (eventTarget) {
  if (!isButton) return

  const match = eventTarget.id.match(/[0-9]+$/)
  const buttonNumber = parseInt(match[0])

  if (!isNaN(buttonNumber)) {
    console.log(`Button #${buttonNumber} clicked`)
  }
}

function isButton (element) {
  return element.tagName === 'BUTTON' || element.getAttribute('role') === 'button'
}

document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('main')
  const eventsMap = new Map()

  eventsMap.set(mainContainer, {
    eventType: 'click',
    handler: printButtonId,
    preventDefault: true
  })

  addEventListeners(eventsMap)
})
