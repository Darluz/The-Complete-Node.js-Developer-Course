const http = require('http');
const url = `http://api.weatherstack.com/current?access_key=01397b1f2797ec11de4828b770645e9a&query=40,-75&units=m`;

const request = http.request(url, (response) => {
    let data = '';


    response.on('data', (chunk) => { // we have to listen for the individual chunks of data in which the response could be divided, generally we'll receive a buffer
        // here we are registering an event handler for the chunk of data that we receive
        data = data + chunk.toString() // we convert the buffer to string in order to stored it in our variable
    });
    
    response.on('end', () => { // function run at the end of the process of reading the response's data
        const body = JSON.parse(data);
        console.log(body);
    });

})

request.on('error', (error) => { // setting up another listener for errors
    console.log('An error', error);
})

request.end(); // with end() we declare that we are done setting up our request and it will fire it off
