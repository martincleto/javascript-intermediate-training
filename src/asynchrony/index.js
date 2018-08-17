(function () {
  // DOM Nodes
  const domNodes = {
    messageContainer: null,
    locationsList: null
  }

  // As Metawheater API is CORS-enabled any longer, following thight-coupled function mimics reponse
  function getData (url) {
    const localDataPath = 'asynchrony/data'
    const locationId = /([0-9])+/.exec(url)
    const delay = Math.random() * 100
    let mappedUrl = locationId ? `${localDataPath}/${locationId[0]}.json` : `${localDataPath}/locations.json`

    return new Promise((resolve, reject) => {
      fetch(mappedUrl)
        .then(response => {
          setTimeout(() => {
            return resolve(response.json())
          }, delay)
        })
        .catch(err => reject(err))
    })
  }

  function getLocations () {
    const queryUrl = 'https://www.metaweather.com/api/location/search/?query=san'

    return getData(queryUrl)
  }

  function printLocations (locations) {
    const locationsPromises = []

    locations.forEach(location => {
      const locationHumidityPromise = getLocationHumidity(location.woeid)
      locationHumidityPromise.then(humidity => {
        const textContent = `${location.title} - humidity: ${humidity}%`

        addListItem.call(document.createElement('li'), textContent)
        console.log(textContent)
      })
      locationsPromises.push(locationHumidityPromise)
    })

    return Promise.all(locationsPromises)
  }

  function getLocationHumidity (woeid) {
    const locationUrl = `https://www.metaweather.com/api/location/${woeid}/`

    return new Promise((resolve, reject) => {
      getData(locationUrl)
        .then(location => {
          const humidity = location.consolidated_weather[0].humidity
          resolve(humidity)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function printAverageHumidity (values) {
    const accumulate = values.reduce((a, b) => a + b)
    const averageValue = (accumulate / values.length).toFixed(1)
    const message = `Average humidity is ${averageValue}%`

    domNodes.messageContainer.textContent = message
    console.log(`\n${message}`)
  }

  function setDomNodes () {
    domNodes.locationsList = document.querySelector('main > ul')
    domNodes.messageContainer = document.querySelector('#message')
  }

  function addListItem (content) {
    this.textContent = content
    domNodes.locationsList.append(this)
  }

  function init () {
    document.addEventListener('DOMContentLoaded', () => {
      setDomNodes()
      getLocations()
        .then(locations => printLocations(locations))
        .then(humidityValues => printAverageHumidity(humidityValues))
    })
  }

  init()
})(document)

// Approach using JSONP to workaround Metawheater CORS issue, no success
/*
function requestJSONP(url) {
  const script = document.createElement('script');

  script.src = url;
  script.onload = function () {
    this.remove();
  };

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

function processResponse(data) {
  console.log(data);
}

var url = 'https://www.metaweather.com/api/location/search/?query=san&format=json&callback=processData';

requestJSONP(url);
*/
