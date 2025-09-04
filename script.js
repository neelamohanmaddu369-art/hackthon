// NOTE: Replace with your own Google API Key
const API_KEY = "YOUR_GOOGLE_API_KEY";

async function findPlaces() {
  const location = document.getElementById("locationInput").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  if (!location) {
    resultsDiv.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  try {
    // 1. Convert location text into coordinates using Geocoding API
    let geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`
    );
    let geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultsDiv.innerHTML = "<p>Location not found.</p>";
      return;
    }

    let { lat, lng } = geoData.results[0].geometry.location;

    // 2. Find nearby tourist attractions using Places API
    let placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=tourist_attraction&key=${API_KEY}`
    );
    let placesData = await placesRes.json();

    resultsDiv.innerHTML = "";

    if (!placesData.results || placesData.results.length === 0) {
      resultsDiv.innerHTML = "<p>No tourist places found nearby.</p>";
      return;
    }

    // 3. Display results
    placesData.results.forEach(place => {
      let div = document.createElement("div");
      div.classList.add("place");
      div.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.vicinity || "No address available"}</p>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Error fetching places.</p>";
  }
}
