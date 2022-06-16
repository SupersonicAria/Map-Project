let theMap = {
    location: [],
    buisnesses: [],
    map: {},
    markers: {},

    buildMap() {
        this.map = L.map('map').setView(this.location, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '© OpenStreetMap'
        }).addTo(this.map)

        let marker = L.marker(this.location).addTo(this.map)
        marker.bindPopup("Current Location").openPopup();
    },

    addMarkers() {
        for (var i = 0; i < this.buisnesses.length; i++) {
            this.markers = L.marker([
                this.buisnesses[i].lat,
                this.buisnesses[i].long
            ])
                .bindPopup(`<p1>${this.buisnesses[i].name}</p1>`)
                .addTo(this.map)
        }
    },

}


async function getLocation() {
    const local = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    console.log(local.coords.latitude, local.coords.longitude)
    return [local.coords.latitude, local.coords.longitude]
}

async function getFoursquare(landmarks) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = theMap.location[0]
	let lon = theMap.location[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${landmarks}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let buisness = await response.text()
	let parsedData = JSON.parse(buisness)
	let businesses = parsedData.results
	return businesses
}

function processBusinesses(buisness) {
	let shops = buisness.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return shops
}

window.onload = async () => {
	const coords = await getLocation()
	theMap.location = coords
    theMap.buildMap()
}

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let landmarks = document.getElementById('landmarks').value
    let buisness = await getFoursquare(landmarks)
    theMap.buisnesses = processBusinesses(buisness)
    theMap.addMarkers()
})

