"use strict";
import "./style.css";

const countriesContainer = document.querySelector(".countries");
const selectElement = document.getElementById("country-select");

// Render one country
const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className} shadow-lg rounded-lg overflow-hidden border border-gray-200 w-[300px] bg-white">
      <img class="country__img w-full h-40 object-cover" alt="${
        data.flags.alt
      }" src="${data.flags.png}" />
      <div class="country__data p-4">
        <h3 class="country__name text-xl font-bold mb-1">${
          data.name.common
        }</h3>
        <h4 class="country__region text-sm text-gray-600 mb-2">${
          data.region
        }</h4>
        <p class="country__row mb-1"><span>👫</span> ${(
          data.population / 1_000_000
        ).toFixed(1)} million</p>
        <p class="country__row mb-1"><span>🗣️</span> ${
          Object.values(data.languages || {})[0]
        }</p>
        <p class="country__row"><span>💰</span> ${
          Object.values(data.currencies || {})[0]?.name || "N/A"
        }</p>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

// Render neighboring countries
const renderNeighbour = function (borders = []) {
  borders.forEach((border) => {
    fetch(`https://restcountries.com/v3.1/alpha/${border.toLowerCase()}`)
      .then((resp) => resp.json())
      .then((data) => (Array.isArray(data) ? data[0] : data))
      .then((data) => renderCountry(data, "neighbour"))
      .catch(console.error);
  });
};

// Main logic to get country and neighbors
const getCountryAndNeighbour = function (countryName) {
  countriesContainer.innerHTML = ""; // Clear previous results

  fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((response) => response.json())
    .then((data) => (Array.isArray(data) ? data[0] : data))
    .then((data) => {
      renderCountry(data);
      if (data.borders) renderNeighbour(data.borders);
    })
    .catch((err) => console.error("Error fetching country:", err));
};

// Populate select input with all countries
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((countries) => {
    const sorted = countries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    sorted.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.name.common;
      option.textContent = country.name.common;
      selectElement.appendChild(option);
    });
  });

// Handle change event
selectElement.addEventListener("change", (event) => {
  const selectedCountry = event.target.value;
  console.log(selectedCountry);
  if (selectedCountry) getCountryAndNeighbour(selectedCountry);
});
