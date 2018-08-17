const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

function getData (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200) {
          resolve(req.responseText)
        } else {
          reject(Error('Error loading data'))
        }
      }
    }
    req.send()
  })
}

function getLocations () {
  const queryUrl = 'https://www.metaweather.com/api/location/search/?query=san'

  return getData(queryUrl)
}

function printLocations (locationsRes) {
  const locations = JSON.parse(locationsRes)
  const locationsPromises = []

  locations.forEach(location => {
    const locationHumidityPromise = getLocationHumidity(location.woeid)
    locationHumidityPromise.then(humidity => {
      console.log(`${location.title} - humidity: ${humidity}%`)
    })
    locationsPromises.push(locationHumidityPromise)
  })

  return Promise.all(locationsPromises)
}

function getLocationHumidity (woeid) {
  const locationUrl = `https://www.metaweather.com/api/location/${woeid}/`

  return new Promise((resolve, reject) => {
    getData(locationUrl)
      .then(res => {
        const location = JSON.parse(res)
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

  console.log(`\nAverage humidity is ${averageValue}%`)
}

getLocations()
  .then(locations => printLocations(locations))
  .then(humidityValues => printAverageHumidity(humidityValues))
