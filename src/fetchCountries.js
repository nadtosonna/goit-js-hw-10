export function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,languages,flags`)
        .then(response => {
            if (response.satus === 404) {
                throw new Error(response.status);
            } else return response.json();
    })
} 