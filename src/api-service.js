const API_KEY = "27639427-70597f5ebc7133bee1f081188";
const BASE_URL = "https://pixabay.com/api";


export default class ApiService {
    constructor(page) {
        this.querySearch = "";
        this.page = 1;
    }

    fetchImages() {
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.querySearch,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            per_page: 40,
            page: this.page,
        });
        return fetch(`${BASE_URL}/?${searchParams}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }).then(({hits, totalHits}) => { 
            this.incrementPage();
            return {hits, totalHits};
        })
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.querySearch;
    }

    set query(newQuery) {
        this.querySearch = newQuery;
    }
}




