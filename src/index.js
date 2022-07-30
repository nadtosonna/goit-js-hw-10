import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 500;
const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryCard: document.querySelector('.country-info')
}
let countryPull = '';

refs.input.addEventListener('input', debounce(onInputCountrySearch, DEBOUNCE_DELAY));

function onInputCountrySearch(event) {
    clearUI();
    const name = refs.input.value.trim();

    if (name === '') return;

    fetchCountries(name)
        .then(countries => {
            if (countries.length >= 10) Notify.info('Too many matches found. Please enter a more specific name.');
            else if (countries.length === 1) {
                refs.countryCard.innerHTML = renderCountryCard(countries[0]);
            }
            else renderCountriesList(countries);
        })
        .catch(error => Notify.failure('Oops, there is no country with that name'))
}

function clearUI() {
    refs.countryList.innerHTML = '';
    refs.countryCard.innerHTML = '';
}

function renderCountriesList(countries) {
    countries.forEach(country => {
    countryPull += `<li class="country-list__item">
                        <img src="${country.flags.svg}" class="country-list__flag" width="70px" height="40px">
                        <p class="country-list__name">${country.name.common}</p>
                    </li>`;  
    });
    refs.countryList.innerHTML = countryPull;
}

function renderCountryCard( {name, capital, population, languages, flags} ) {
    return `
    <div class="country-info__card">
    <h2 class="country-info__name">${name.common}</h2>
    <img src="${flags.svg}" class="country-info__flag" width="240px" height="160px">
    <ul class="country-info__features">
        <li>
            <h3>Capital:&nbsp;</h3>
            <p>${capital}</p>
        </li>
        <li>
            <h3>Population:&nbsp;</h3>
            <p>${population}</p>
        </li>
        <li>
            <h3>Languages:&nbsp;</h3>
            <p>${languages}</p>
        </li>
    </ul>
    </div>
    `
}