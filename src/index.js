import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryCard: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onInputCountrySearch, DEBOUNCE_DELAY));

function onInputCountrySearch(event) {
    const name = refs.input.value.trim();
    
    if (name === '') return;

    fetchCountries(name)
        .then(response => {
            console.log(response);
            if (response.length > 10) Notify.info('Too many matches found. Please enter a more specific name.');
            if (response.length > 1 && response.length < 10) {
                renderCountriesList();
            }
            if (response.length === 1) {
                renderCountryCard();
            }
        })
        .catch((error) => Notify.failure('Oops, there is no country with that name'))
}
    
function renderCountriesList(response) {
    return `<li>
    <p>${response.name.common}</p>
    </li>`;
}

function renderCountryCard(response) {

}