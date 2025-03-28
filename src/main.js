"use strict";
import "./style.css";

const btn = document.querySelector(".btn-country");
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

const getCountryAndNeighbour = function (country_name) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v3.1/name/${country_name}`);
  request.send();

  request.addEventListener("load", function () {
    let data = JSON.parse(this.responseText);

    if (Array.isArray(data)) data = data[0];
    console.log(data);

    // Render country
    renderCountry(data)

    // Get neighbour country
    const [neighbour] = data.borders;
    
    if (!neighbour) return;

    // AJAX Call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour.toLowerCase()}`)
    request2.send();

    request2.addEventListener('load', function() {
      const [data2] = JSON.parse(this.responseText)
      console.log(data2);
      renderCountry(data2, 'neighbour')
    })
  });
};

// constgetCountryAndNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', 'https://restcountries.com/v3.1/)
// }

getCountryAndNeighbour("germany")
