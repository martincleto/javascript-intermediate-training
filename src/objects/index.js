
const dogBreedsArray = []

// Dog Breed class

function DogBreed ({breed, variety}) {
  this.breed = breed
  this.variety = variety || null
}

DogBreed.prototype.getPhoto = async function () {
  const dogBreedPhotoQuery = `https://dog.ceo/api/breed/${this.breed}/images/random`
  const dogBreedPhotoRes = await getData(dogBreedPhotoQuery)
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
// Synchronous XMLHttpRequest is deprecated in browser environment
// see: https://xhr.spec.whatwg.org/#synchronous-flag
/*
function getDataSync (url) {
  const req = new XMLHttpRequest()
  req.open('GET', url, false)
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        return req.responseText
      } else {
        console.error('Error loading data')
      }
    }
  }
  req.send()
}
*/

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
      // console.log(prop)
      // console.log(dogBreedsObj[prop].length)
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

// DOM

function printDogBreeds () {
  console.log(dogBreedsArray)
}

// Init
getDogBreeds().then(printDogBreeds())
