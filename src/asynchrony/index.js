const req = new XMLHttpRequest()
const url = 'https://www.metaweather.com/api/location/search/?query=san'

req.open('GET', url, true)
req.onreadystatechange = function () {
  if (req.readyState === 4) {
    if (req.status === 200) {
      console.log(req.responseText)
    } else {
      console.log('Error loading data')
    }
  }
}
req.send(null)
/*
// Using JSONP
function requestJSONP(url) {
  // create script with passed in URL
  var script = document.createElement('script');
  script.src = url;

  // after the script is loaded (and executed), remove it
  script.onload = function () {
    this.remove();
  };

  // insert script tag into the DOM (append to <head>)
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

function processWeather(data) {
  // do something with weather data
  console.log(data);
}

// get the weather data for Aldeburgh, GB via JSONP
var url = 'https://www.metaweather.com/api/location/search/?query=san&format=json&callback=processWeather';

requestJSONP(url);
*/
