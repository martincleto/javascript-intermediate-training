(function (document) {
  const domNodes = {
    mainContainer: null,
    messagePlaceholder: null
  }

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

  function printMessage (eventTarget) {
    if (!isButton(eventTarget)) return

    const which = eventTarget.textContent || eventTarget.id

    // eslint-disable-next-line no-extra-boolean-cast
    domNodes.messagePlaceholder.textContent = (!!which) ? `${which} was clicked` : ''
  }

  function isButton (element) {
    return element.tagName === 'BUTTON' || element.getAttribute('role') === 'button'
  }

  document.addEventListener('DOMContentLoaded', () => {
    domNodes.mainContainer = document.querySelector('main')
    domNodes.messagePlaceholder = document.querySelector('#message')

    const eventsMap = new Map()

    eventsMap.set(domNodes.mainContainer, {
      eventType: 'click',
      handler: printMessage,
      preventDefault: true
    })

    addEventListeners(eventsMap)
  })
})(document)
