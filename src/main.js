"use strict";
import "./style.css";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

//////////////////////////////////////////////
const getCountryData = function (country_name) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v3.1/name/${country_name}`);
  request.send();
  request.addEventListener("load", function () {
    let data = JSON.parse(this.responseText);

    if (Array.isArray(data)) {
      data = data[0];
    }
    console.log(data);

    const country_coin = Object.entries(data.currencies)[0];

    const html = `
      <article class="country">
        <img class="country__img" alt="${data.flags.alt}" src="${
      data.flags.png
    }" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h3>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)} people</p>
          <p class="country__row"><span>🗣️</span>${
            Object.entries(data.languages)[0][1]
          }</p>
          <p class="country__row"><span>💰</span>${country_coin[1].name}</p>
        </div>
      </article>
    `;

    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData("iran")
getCountryData("usa")
getCountryData("germany")
