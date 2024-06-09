// api
const BASE_URL = 'https://internlm.vansin.top/api'
// const BASE_URL = "http://mm.vansin.top:9092/api"

export const get = (url) => {
    return fetch(`${BASE_URL}${url}`)
        .then(response => response.json());
}

export const post = (url, data) => {
    return fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}