const API_KEY = "27639427-70597f5ebc7133bee1f081188";
const BASE_URL = "https://pixabay.com/api";

const searchParams = new URLSearchParams({
    key: API_KEY,
    // q: "",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
});

export function fetchImages(querySearch) {
 
    return fetch(`${BASE_URL}/?${searchParams}&q=${querySearch}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
};
