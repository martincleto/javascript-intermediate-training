const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

const url = 'https://www.metaweather.com/api/location/search/?query=san'
const humidityValues = []
let locations

function getData (url, cb) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        cb(req.responseText)
      } else {
        console.error('Error loading data')
      }
    }
  }
  req.send()
}

function printLocations (res) {
  locations = JSON.parse(res)

  locations.forEach((location) => {
    handleLocationsData(location.woeid, printAverageHumidity)
  })
}

function handleLocationsData (woeid, cb) {
  const url = `https://www.metaweather.com/api/location/${woeid}/`

  getData(url, (res) => {
    const location = JSON.parse(res)
    const locationHumidity = location.consolidated_weather[0].humidity

    humidityValues.push(locationHumidity)
    console.log(`${location.title} - humidity: ${locationHumidity}%`)

    if (humidityValues.length === locations.length) {
      cb(humidityValues)
    }
  })
}

function printAverageHumidity (values) {
  const accumulate = values.reduce((a, b) => a + b)
  const averageValue = (accumulate / values.length).toFixed(1)

  console.log(`\nAverage humidity is ${averageValue}%`)
}

getData(url, printLocations)
