const btn = document.querySelector(".submit");
const input = document.querySelector("input");
const container = document.querySelector(".container");
const countriesContainer = document.querySelector(".countries");
const resetButton = document.querySelector(".reset-button");
const section = document.querySelector("section");
const neighbourCountriesBtn = document.querySelector(".neighbour-countries");
const errorMessage = document.querySelector(".error");

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to correct the string: this puts the country name entered in the correct form so that we can compare it to the countries that are in the list to see if the country actually exists or not
function correctInput(string) {
  const correctString = string
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word !== "and" && word !== "of") {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
  return correctString;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Let's get all the countries in one array:

async function allCountries() {
  const countries = await fetch("https://restcountries.com/v3.1/all");
  const data = await countries.json();
  const countriesNames = data.map((country) => country.name.common);
  return countriesNames;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Let's get country data

async function getCountryData(country) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  );
  const data = await response.json();
  return data[0];
}

// let's get country data by code

async function getCountryDataCode(code) {
  const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const data = await response.json();
  return data[0];
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Let's display the country

function displayCountry(data, className = "") {
  // Let's get the languages //
  let myStr = "";

  Object.keys(data).forEach((key) => {
    if (key === "languages") {
      const languageKeys = Object.keys(data[key]);
      languageKeys.forEach((key2) => {
        myStr += data[key][key2] + " ";
      });
    }
  });

  const languages = myStr.trim().replace(" ", ", ");

  // Let's get the currency
  let currency = "";

  Object.keys(data).forEach((key) => {
    if (key === "currencies") {
      Object.keys(data[key]).forEach((key2) => {
        if (typeof key2 === "string") {
          currency += data[key][key2].name + " ";
        }
      });
    }
  });
  /////////////////////////////////////////////
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${
          data.population < 1000000
            ? data.population + " people"
            : (data.population / 1000000).toFixed(1) + " M"
        }</p>
        <p class="country__row"><span>🗣️</span>${languages}</p>
        <p class="country__row"><span>💰</span>${currency}</p>
    </div>
    </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit
let countryData;
btn.addEventListener("click", async function () {
  const country = input.value;
  let countryCorrected = correctInput(country);
  //
  const countries = await allCountries();
  if (countries.includes(countryCorrected)) {
    countryData = await getCountryData(countryCorrected.toLowerCase());
    displayCountry(countryData);
    container.classList.toggle("hide");
    section.classList.toggle("hide");
    neighbourCountriesBtn.addEventListener("click", getNeighbourCountries);
  } else {
    errorMessage.classList.remove("hide");
  }
});

// Go back and look for another country

resetButton.addEventListener("click", function () {
  const article = document.querySelectorAll("article");
  article.forEach((article) => article.remove());
  container.classList.toggle("hide");
  section.classList.toggle("hide");
  errorMessage.classList.add("hide");
  input.value = "";
  neighbourCountriesBtn.classList.remove("not-allowed");
});

// Neighbour countries

async function getNeighbourCountries() {
  // let's get the country data that we are already working on and get the neighbour countries of it
  const data = await countryData;
  const neighbors = data.borders;
  if (!neighbors) return;

  for (let neighborCountry of neighbors) {
    const neighborData = await getCountryDataCode(neighborCountry);
    displayCountry(neighborData, "neighbour");
  }
  neighbourCountriesBtn.classList.add("not-allowed");
  neighbourCountriesBtn.removeEventListener("click", getNeighbourCountries);
}
