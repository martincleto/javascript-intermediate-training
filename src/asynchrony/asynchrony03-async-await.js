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

async function getLocations () {
  try {
    const queryUrl = 'https://www.metaweather.com/api/location/search/?query=san'
    const locationsData = await getData(queryUrl)

    return locationsData
  } catch (err) {
    console.error('Error on fetching locations', err)
  }
}

function printLocations (locationsRes) {
  const locations = JSON.parse(locationsRes)
  const locationsPromises = []

  locations.forEach(location => {
    const locationHumidityAsync = getLocationHumidity(location.woeid)
    locationHumidityAsync.then(humidity => {
      printLocationItem(location.title, humidity)
    })
    locationsPromises.push(locationHumidityAsync)
  })

  return Promise.all(locationsPromises)
}

function printLocationItem (locationTitle, locationHumidity) {
  console.log(`${locationTitle} - humidity: ${locationHumidity}%`)
}

async function getLocationHumidity (woeid) {
  try {
    const locationUrl = `https://www.metaweather.com/api/location/${woeid}/`
    const locationData = await getData(locationUrl)
    const location = JSON.parse(locationData)
    const humidity = location.consolidated_weather[0].humidity

    return humidity
  } catch (err) {
    console.error('Error on fetching location humidity', err)
  }
}

function printAverageHumidity (values) {
  const accumulate = values.reduce((a, b) => a + b)
  const averageValue = (accumulate / values.length).toFixed(1)

  console.log(`\nAverage humidity is ${averageValue}%`)
}

getLocations()
  .then(locations => printLocations(locations))
  .then(humidityValues => printAverageHumidity(humidityValues))
