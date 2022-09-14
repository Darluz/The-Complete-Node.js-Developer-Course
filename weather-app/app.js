const request = require("postman-request");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const address = process.argv[2]; // third argument in the command line

if (!address){
  console.log('Please provide an address')
}
else{
  geocode(address, (error, data) => {
    if (error){
      return console.log(error);
    }
  
    forecast(data.latitude, data.longitude, (error, forecastData) => {
          if(error){
            return console.log(error);
          }
  
          console.log(data.location);
          console.log(forecastData);
        });
  });
}




