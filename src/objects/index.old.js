(function () {
  // DOM Nodes
  const domNodes = {
    breedsList: null,
    messageContainer: null
  }

  // Dog Breed class

  function DogBreed ({breed, variety}) {
    this.breed = breed
    this.variety = variety || null
  }

  DogBreed.prototype.getPhoto = function () {
    const dogBreedPhotoQuery = `https://dog.ceo/api/breed/${this.breed}/images/random`

    getData(dogBreedPhotoQuery).then(dogBreedPhotoRes => {
      const dogBreedPhotoUrl = JSON.parse(dogBreedPhotoRes).message

      this.photoUrl = dogBreedPhotoUrl
      this.print()
    })
  }

  DogBreed.prototype.print = function () {
    const listItemElement = document.createElement('li')

    listItemElement.innerHTML = `${this.variety ? this.variety : ''} ${this.breed} <img src="${this.photoUrl}" />`
    domNodes.breedsList.append(listItemElement)
  }

  function DogBreedFactory () {}

  DogBreedFactory.prototype.create = function (dogBreedInstanceData) {
    let dogBreedInstance = new DogBreed(dogBreedInstanceData)

    dogBreedInstance.getPhoto()

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
    try {
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
    } catch (err) {
      throw new Error(err.message)
    }
  }

  function setDomNodes () {
    domNodes.breedsList = document.querySelector('main > ul')
    domNodes.messageContainer = document.querySelector('#message')
  }

  function clearLoadingMessage () {
    domNodes.messageContainer.remove()
  }

  function init () {
    document.addEventListener('DOMContentLoaded', () => {
      setDomNodes()
      getDogBreeds().then(clearLoadingMessage)
    })
  }

  init()
})(document)
