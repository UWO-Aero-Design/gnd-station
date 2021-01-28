const access_token = 'pk.eyJ1IjoiamVmZnN0amVhbiIsImEiOiJja2tkaTU0bDMwc2hlMnJreDhndGlvbzBzIn0.UAVRTtxDRFmmxb1KKWfcGg'

const map = L.map('map').setView([51.505, -0.09], 13);

const plane_icon = L.icon({
    iconUrl: 'images/plane.png',
    shadowUrl: 'images/plane-shadow.png',

    iconSize:     [64, 64], // size of the icon
    shadowSize:   [64, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: access_token
}).addTo(map);

L.marker([51.5, -0.09], {icon: plane_icon}).addTo(map);