"use strict";
import "./style.css";

const countriesContainer = document.querySelector(".countries");

//////////////////////////////////////////////

const renderCountry = function(data, className) {
  const html = `
    <article class="country ${className}">
      <img class="country__img" alt="${data.flags.alt}" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h3>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.entries(data.languages)[0][1]
        }</p>
        <p class="country__row"><span>💰</span>${Object.entries(data.currencies)[0][1].name}</p>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
}

function renderNeighbour(borders) {
  borders.forEach(border => {
    fetch(`https://restcountries.com/v3.1/alpha/${border.toLowerCase()}`)
    .then(resp => resp.json())
    .then(data => {
      if (data.length > 0) {
        if (Array.isArray(data)) {
          return renderCountry(data[0], 'neighbour')
        }
        return renderCountry(data, 'neighbour')
      }
    });
  });
}

const getCountryAndNeighbour = function (country_name) {
  fetch(
    `https://restcountries.com/v3.1/name/${country_name}`
  ).then(response => {
    return response.json()
  }).then(data => {
    if (Array.isArray(data)) data = data[0];

    // Render country and neibours
    renderCountry(data)
    renderNeighbour(data.borders)
  })
};

getCountryAndNeighbour("iran")
