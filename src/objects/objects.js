const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

const dogBreedsArray = []

// Dog Breed class

function DogBreed ({breed, variety}) {
  this.breed = breed
  this.variety = variety || null
}

DogBreed.prototype.getPhoto = function () {
  const dogBreedPhotoQuery = `https://dog.ceo/api/breed/${this.breed}/images/random`
  const dogBreedPhotoRes = getDataSync(dogBreedPhotoQuery)
  const dogBreedPhotoUrl = JSON.parse(dogBreedPhotoRes).message

  this.photoUrl = dogBreedPhotoUrl
  return dogBreedPhotoUrl
}

DogBreed.prototype.save = function () {
  dogBreedsArray.push(this)
}

function DogBreedFactory () {}

DogBreedFactory.prototype.create = function (dogBreedInstanceData) {
  let dogBreedInstance = new DogBreed(dogBreedInstanceData)
  dogBreedInstance.getPhoto()
  dogBreedInstance.save()

  return dogBreedInstance
}

// Data retrieving

function getData (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', url)
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

function getDataSync (url) {
  console.log('getDataSync()')
  const req = new XMLHttpRequest()

  try {
    req.open('GET', url, false)
    req.onreadystatechange = function () {
      console.log('req.readyState', req.readyState)
      if (req.readyState === 4) {
        console.log('req.status', req.readyState)
        if (req.status === 200) {
          return req.responseText
        } else {
          console.error('Error loading data')
          return JSON.stringify({})
        }
      }
    }
    req.send()
  } catch (err) {
    console.log(err)
  }
}

async function getDogBreeds () {
  const allDogBreedsQuery = 'https://dog.ceo/api/breeds/list/all'
  const dogBreedsRes = await getData(allDogBreedsQuery)
  const dogBreedsObj = JSON.parse(dogBreedsRes).message
  const dogBreedFactory = new DogBreedFactory()
  const dogBreedInstanceData = {
    breed: null,
    variety: null
  }

  for (const prop in dogBreedsObj) {
    if (dogBreedsObj.hasOwnProperty(prop)) {
      const dogBreedVarieties = dogBreedsObj[prop]

      dogBreedInstanceData.breed = prop

      if (dogBreedVarieties.length) {
        for (let i = 0; i < dogBreedVarieties.length; i++) {
          dogBreedInstanceData.variety = dogBreedVarieties[i]
          dogBreedFactory.create(dogBreedInstanceData)
        }
      } else {
        dogBreedFactory.create(dogBreedInstanceData)
      }
    }
  }
}

// Init
getDogBreeds().then(() => { console.log(dogBreedsArray) })
