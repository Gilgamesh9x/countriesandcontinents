const btn = document.querySelector(".submit");
const input = document.querySelector("input");
const container = document.querySelector(".container");
const countriesContainer = document.querySelector(".countries");
const resetButton = document.querySelector(".reset-button");
const section = document.querySelector("section");
const errorMessage = document.querySelector(".error");

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// the array of existing continents and formatting user input
const continents = [
  "Africa",
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Oceania",
];

// formatting string

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
// Display countries
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
            <p class="country__row"><span>👫</span>
            ${
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
// Get all countries in a certain continent
async function getCountriesInContinents(continent) {
  try {
    // this will get us all countries in the continent we want
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${continent}`
    );
    const data = await response.json();
    // let's extract the names of the countries in that continent
    const countriesNames = data.map((country) => {
      return country.name.common;
    });
    return countriesNames;
  } catch (error) {
    console.error(error);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get country data and display it
async function getCountryData(continent) {
  try {
    const response = await getCountriesInContinents(continent);
    for (let country of response) {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${country}`
      );
      const countryData = await response.json();
      displayCountry(countryData[0]);
    }
  } catch (error) {
    console.error("Can't get country");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit button to show countries
btn.addEventListener("click", async function () {
  const continent = input.value;
  let continentCorrected = correctInput(continent);
  //
  if (continents.includes(continentCorrected)) {
    getCountryData(continentCorrected);
    container.classList.toggle("hide");
    section.classList.toggle("hide");
  } else {
    errorMessage.classList.remove("hide");
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Reset button to look for another continent and delete all articles

resetButton.addEventListener("click", function () {
  const article = document.querySelectorAll("article");
  article.forEach((article) => article.remove());
  container.classList.toggle("hide");
  section.classList.toggle("hide");
  errorMessage.classList.add("hide");
  input.value = "";
});
