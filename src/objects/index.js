(function (document) {
  const domNodes = {
    breedList: null,
    messageContainer: null
  }

  function Breed (name, varieties) {
    this.name = name
    this.varieties = varieties
  }

  Breed.prototype.getPhoto = async function () {
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${this.name}/images/random`)
      const data = await response.json()

      return data.message
    } catch (err) {
      console.log(err)
      return null
    }
  }

  function createBreed (name, varieties) {
    return new Breed(name, varieties)
  }

  function getBreedsData () {
    return fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => data.message)
      .catch(err => {
        console.error(err)
      })
  }

  function createBreeds (breeds) {
    Object.keys(breeds)
      .sort((a, b) => a.localeCompare(b))
      .forEach(async key => {
        const breed = createBreed(key, breeds[key])

        await printBreed(breed)
      })
  }

  async function printBreed (item) {
    const listItem = document.createElement('li')
    const itemName = capitalize(item.name)
    const itemVarieties = item.varieties.length ? ` (${item.varieties.map(variety => capitalize(variety)).join(', ')})` : ''
    const listItemContent = `<p class="ellipsis">${itemName}${itemVarieties}</p>`

    item.photo = await item.getPhoto()

    listItem.style.backgroundImage = `url(${item.photo})`
    listItem.innerHTML = listItemContent
    if (domNodes.messageContainer) domNodes.messageContainer.remove()
    domNodes.breedList.appendChild(listItem)
  }

  function capitalize (str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
  }

  function setDomNodes () {
    domNodes.breedList = document.querySelector('main > ul')
    domNodes.messageContainer = document.querySelector('#message')
  }

  function init () {
    document.addEventListener('DOMContentLoaded', () => {
      setDomNodes()
      getBreedsData()
        .then(createBreeds)
    })
  }

  init()
})(document)
