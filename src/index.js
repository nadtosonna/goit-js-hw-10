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

refs.input.addEventListener('input', debounce(onInputCountrySearch, DEBOUNCE_DELAY));

function onInputCountrySearch(event) {
    clearUI();
    const name = refs.input.value.trim();

    if (name === '') return;

    fetchCountries(name)
        .then(countries => {
            if (countries.length > 10) Notify.info('Too many matches found. Please enter a more specific name.');
            else if (countries.length === 1) {
                refs.countryCard.innerHTML = renderCountryCard(countries[0]);
            }
            else {
                let countriesListMarkup = '';
                countries.map(country => {
                    countriesListMarkup += renderCountriesList(country);
                });
                refs.countryList.insertAdjacentHTML('afterbegin', countriesListMarkup);
            } 
        })
        .catch(error => Notify.failure('Oops, there is no country with that name'))
}

function clearUI() {
    refs.countryList.innerHTML = '';
    refs.countryCard.innerHTML = '';
}

function renderCountriesList(countries) {
    return `
    <li class="country-list__item">
        <img src="${countries.flags.svg}" class="country-list__flag" width="70px" height="40px">
        <h3 class="country-list__name">${countries.name.common}</h3>
    </li>`;  
}

function renderCountryCard({ name, capital, population, languages, flags }) {
    return `
    <div class="country-info__card">
    <h2 class="country-info__name">${name.common}</h2>
    <img src="${flags.svg}" class="country-info__flag" width="220px" height="140px">
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
            <p>${Object.values(languages)}</p>
        </li>
    </ul>
    </div>
    `
}