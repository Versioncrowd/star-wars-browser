var mainElement = document.querySelector('main');
mainElement.innerHTML = 'Wait a second ...'
var renderers = {
};

// THE MODAL
function createModal() {
  var element = document.createElement('div');
  element.classList.add('modal');
  element.innerHTML = `
          <div class="body">
            <div class="controls">
              <button>close</button>
            </div>
            <div class="content"></div>
          </div>
          <div class="underlay"></div>`;
  return element;
}

// add class open and height 100% is applied
function showModal(contentElement) {
  modalContentElement.innerHTML = '';
  modalContentElement.appendChild(contentElement);
  modalElement.classList.add('open');
}
// removes class open 
function hideModal() {
  modalElement.classList.remove('open');
}

var modalElement = createModal();
var modalContentElement = modalElement.querySelector('.content');
var modalCloseButton = modalElement.querySelector('.controls button');
modalCloseButton.addEventListener('click', hideModal);
document.body.appendChild(modalElement);

// API CALL
// Load the data
loadData = (url, done) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var response = JSON.parse(xhr.responseText);
    done(response);
  };
  xhr.open('get', url);
  xhr.send();
}

loadPeople = (done) => {
  loadData('https://swapi.co/api/people', done);
}

loadPlanet = (url, done) => {
  loadData(url, done);
}

renderCards = (data) => {
  console.log('Hi from RenderCards', data);
  mainElement.innerHTML = ''; // Empty Main
  // Make the Next/Previous buttons
  var navElement = document.createElement('nav');
  if (data.previous) {
    const previousElement = document.createElement('button');
    previousElement.classList.add('previous');
    previousElement.textContent = 'Previous';
    navElement.appendChild(previousElement);
    previousElement.addEventListener('click', () => {
      loadData(data.previous, renderCards)
    });
  }
  if (data.next) {
    const nextElement = document.createElement('button');
    nextElement.textContent = 'Next';
    nextElement.classList.add('previous');
    navElement.appendChild(nextElement);
    nextElement.addEventListener('click', () => {
      loadData(data.next, renderCards)
    });
  }
  // Make the Cards Container
  var divElement = document.createElement('div');
  divElement.classList.add('cards');
  mainElement.appendChild(divElement);
  mainElement.appendChild(navElement);

  // Render the Cards Content
  data.results.forEach((dataset) => {
    var sectionElement = document.createElement('section');
    sectionElement.classList.add('person');

    let listElements = "";
    Object.keys(dataset).forEach(key => {
      if (typeof (dataset[key]) === 'string' && (dataset[key]).includes('//') === false && key !== 'title' && key !== 'name') {
        return listElements += `<li> 
          <span class="label">${key}:</span>
          <span class="value">${dataset[key]}</span>
        </li>`}
    });

    let homeworld;
    if (dataset.homeworld) {
      homeworld = `<button>HOMEWORLD</button>`
    } else {
      homeworld = ''
    };

    let genderSymbol;
    switch (dataset.gender) {
      case 'male':
        genderSymbol = '♂';
        break;
      case 'female':
        genderSymbol = '♀';
        break;
      default:
        genderSymbol = '?';
    }
    
    // Creating a gender Element if the dataset contains gender
    let genderElement;
    if(dataset.gender) {
         genderElement = `<span class="gender" title="Gender: ${dataset.gender}">${genderSymbol}</span>
         `} else {
          genderElement = ''  
         } 

    let title = dataset.name || dataset.title;     

    // Rendering all the cards
    sectionElement.innerHTML = `
    <header>
      <h1>${title} ${genderElement}</h1>
    </header>
    <div>
      ${homeworld}
      <ul>${listElements}</ul>
    </div>`;

    if (dataset.homeworld) {
      sectionElement
        .querySelector('button')
        .addEventListener('click', () => {
          loadPlanet(dataset.homeworld, renderHomeworld);
        });
    }

    divElement.appendChild(sectionElement);
  });
}

// Make the Navigation Bar Menu
// Attach the RenderFunction for Each Site
function renderMenu(data) {
  console.log('Hi From Rendermenu', data);
  var menuElement = document.querySelector('body > header ul');

  Object.keys(data).forEach((key) => {
    var liElement = document.createElement('li');
    menuElement.appendChild(liElement);
    var aElement = document.createElement('a');

    aElement.addEventListener('click', () => {
      //if (!renderers[key]) return renderUnimplemented();
      loadData(data[key], renderCards)
    });

    liElement.appendChild(aElement);
    aElement.textContent = key;
  })
}
loadData('https://swapi.co/api/', renderMenu);

// Homeworld Button
function renderHomeworld(homeworld) {
  var sectionElement = document.createElement('section');
  sectionElement.classList.add('homeworld');
  let listElements = "";
  Object.keys(homeworld).forEach(key => {
    if (!homeworld[key].includes("http") && typeof (homeworld[key]) === 'string') {
      return listElements += `<li> 
          <span class="label">${key}:</span>
          <span class="value">${homeworld[key]}</span>
        </li>`}
  });
  sectionElement.innerHTML = `<header>
    <h1>${homeworld.name}</h1>
  </header>
  <div>
    <ul>
      ${listElements}
    </ul>
  </div>`;
  showModal(sectionElement);
}

loadPeople(renderCards);