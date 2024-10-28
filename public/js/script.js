// frontend

const socket = io();
// check navigator me geolaoction(ye device me hota h bydefault) available h ya nhi
if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
      // find latiute and longitude
      const { latitude, longitude } = position.coords;
      // frontend se event emit kr rha hu send loaction nam se and pas  them lat and long
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// leaflet hmne lga rkha h jo hme kuchh specefic cheese deta hai
// like allowance to ask location permission .....L.map[lat,long]
const map = L.map("map").setView([0, 0], 12); // 10 is zoom level

// for looking world map type location on page iska ek apecific url hai jo likna hai
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "kishan",
}).addTo(map);

//create empty locate image marker
const markers = {};

// after recieving location from backend set current view on map page
socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
   // agr marker already exist to update it with new lat and long
   if(markers[id]){
    markers[id].setLatLng([latitude,longitude])
   }
   else{
    // create new marker
    markers[id] = L.marker([latitude,longitude]).addTo(map)
   }
});

// if user disconnects then remove it from map
socket.on("user-disconnected", (id) => {
  if(markers[id]){
    map.removeLayer(markers[id])
  }
});
