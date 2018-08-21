import { from, fromEvent } from 'rxjs'
import { combineLatest, flatMap, map, merge, startWith } from 'rxjs/operators'

(function (document) {
  const clickStreams = {}
  const suggestionsStreams = {}
  let requestStream, responseStream

  function setStreams () {
    const closeButtons = document.querySelectorAll('button')

    /* Capture DOM buttons click events and set them into clickStreams obj for reuse
        clickStreams = {
          refresh: <Observable>,
          close1: <Observable>,
          close2: <Observable>,
          ...
        }
    */
    closeButtons.forEach(button => {
      clickStreams[button.id] = fromEvent(button, 'click')
    })

    // console.log('clickStreams', clickStreams)

    // Create request and response streams
    requestStream = clickStreams.refresh
      .pipe(
        startWith('refresh startup click'),
        map(() => 'https://api.github.com/users?since=' + Math.floor(Math.random() * 500))
      )

    responseStream = requestStream
      .pipe(
        flatMap(requestUrl => from(fetch(requestUrl).then(response => response.json())))
      )

    /* Create suggestions streams and set them into suggestionsStreams obj for reuse
        suggestionsStreams = {
          suggestion1: <Observable>,
          suggestion2: <Observable>,
          ...
        }
    */
    Object.keys(clickStreams)
      .filter(key => key.indexOf('close') !== -1)
      .forEach(key => {
        const streamKey = key.replace('close', 'suggestion')

        suggestionsStreams[streamKey] = createSuggestionStream(clickStreams[key])
      })
  }

  function renderSuggestion (suggestedUser, selector) {
    const suggestionEl = document.querySelector(selector)

    if (suggestedUser === null) {
      suggestionEl.classList.add('hidden')
    } else {
      const usernameEl = suggestionEl.querySelector('a')
      const imgEl = suggestionEl.querySelector('img')

      suggestionEl.classList.remove('hidden')
      usernameEl.href = suggestedUser.html_url
      usernameEl.textContent = suggestedUser.login
      imgEl.src = ''
      imgEl.src = suggestedUser.avatar_url
    }
  }

  function createSuggestionStream (closeClickStream) {
    return closeClickStream
      .pipe(
        startWith('closeClickStream startup click'),
        combineLatest(responseStream, (click, listUsers) => listUsers[Math.floor(Math.random() * listUsers.length)]),
        merge(clickStreams.refresh.pipe(map(() => null))),
        startWith(null)
      )
  }

  function subscribeToStreams () {
    Object.keys(suggestionsStreams)
      .forEach(key => {
        const targetClassName = `.${key}`

        suggestionsStreams[key].subscribe(suggestedUser => {
          renderSuggestion(suggestedUser, targetClassName)
        })
      })
  }

  document.addEventListener('DOMContentLoaded', () => {
    setStreams()
    subscribeToStreams()
  })
})(document)
