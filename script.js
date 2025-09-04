async function findPlaces() {
  const location = document.getElementById("locationInput").value;
  const resultsDiv = document.getElementById("results");
  const mapDiv = document.getElementById("mapContainer");
  resultsDiv.innerHTML = "<p>Loading...</p>";
  mapDiv.innerHTML = "";

  if (!location) {
    resultsDiv.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  try {
    // 1. Get coordinates using OpenStreetMap Nominatim API
    let geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    let geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      resultsDiv.innerHTML = "<p>Location not found.</p>";
      return;
    }

    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

    // 2. Show Google Map of the location
    mapDiv.innerHTML = `
      <iframe 
        src="https://www.google.com/maps?q=${lat},${lon}&z=12&output=embed">
      </iframe>
    `;

    // 3. Get nearby tourist places from Wikipedia API (within 10km)
    let wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lon}&gslimit=10&format=json&origin=*`
    );
    let wikiData = await wikiRes.json();

    resultsDiv.innerHTML = "";

    if (!wikiData.query || wikiData.query.geosearch.length === 0) {
      resultsDiv.innerHTML = "<p>No tourist places found nearby.</p>";
      return;
    }

    // 4. Display results
    wikiData.query.geosearch.forEach(place => {
      let div = document.createElement("div");
      div.classList.add("place");
      div.innerHTML = `
        <h3>${place.title}</h3>
        <p>Distance: ${(place.dist/1000).toFixed(2)} km</p>
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(place.title)}" target="_blank">Read more</a>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
  }
}
