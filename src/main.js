"use strict";

const countriesContainer = document.querySelector(".countries");
const selectElement = document.getElementById("country-select");
const warning = document.getElementById("warning");

// Render one country
const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className} shadow-lg rounded-lg overflow-hidden border border-gray-200 w-[300px] bg-white">
      <img class="country__img w-full h-40 object-cover" alt="${data.flags?.alt || ''}" src="${data.flags?.png}" />
      <div class="country__data p-4">
        <h3 class="country__name text-xl font-bold mb-1">${data.name.common}</h3>
        <h4 class="country__region text-sm text-gray-600 mb-2">${data.region}</h4>
        <p class="country__row mb-1"><span>👫</span> ${(data.population / 1_000_000).toFixed(1)} million</p>
        <p class="country__row mb-1"><span>🗣️</span> ${Object.values(data.languages || {})[0] || "N/A"}</p>
        <p class="country__row"><span>💰</span> ${Object.values(data.currencies || {})[0]?.name || "N/A"}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

// Fetch and display selected country and its neighbors
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then((response) => {
      if (!response.ok) throw new Error("Country not found");
      return response.json();
    })
    .then((data) => {
      countriesContainer.innerHTML = ""; // clear previous
      const countryData = data[0];
      renderCountry(countryData);

      const neighbours = countryData.borders;
      if (!neighbours || neighbours.length === 0) {
        countriesContainer.insertAdjacentHTML("beforeend", `<p class="text-gray-600 text-center mt-4">کشوری هم‌مرز پیدا نشد.</p>`);
        return;
      }

      // Fetch neighbors by country codes
      return Promise.all(
        neighbours.map((code) =>
          fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((res) => res.json())
        )
      );
    })
    .then((neighboursData) => {
      if (!neighboursData) return;
      neighboursData.forEach((n) => renderCountry(n[0], "neighbour"));
    })
    .catch((err) => {
      warning.classList.remove("hidden");
      console.error(err);
    });
};

// Event listener
selectElement.addEventListener("change", function () {
  const selectedCountry = selectElement.value;
  if (!selectedCountry) {
    warning.classList.remove("hidden");
    return;
  }
  warning.classList.add("hidden");
  getCountryData(selectedCountry);
});
