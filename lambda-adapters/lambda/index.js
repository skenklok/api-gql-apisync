const axios = require('axios');

exports.handler = async (event) => {
  try {
    const city = event.arguments.city;

    // Replace the URL with the actual REST API endpoint you want to call and add your API key
    //TODO add env var
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=01b69463bdd55408c436d42cfc06e010`;
    const response = await axios.get(apiUrl);

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
    };

    return weatherData;
  } catch (error) {
    console.error(error);

    return {
      error: 'An error occurred while calling the weather API',
    };
  }
};
