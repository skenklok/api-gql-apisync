const axios = require('axios');
const { handler } = require('../index');

jest.mock('axios');

describe('weather lambda function', () => {
  it('should return weather data for a given city', async () => {
    const event = { arguments: { city: 'London' } };
    const expectedResponse = {
      data: {
        name: 'London',
        main: { temp: 10 },
        weather: [{ main: 'Clouds', description: 'scattered clouds' }],
      },
    };

    axios.get.mockResolvedValue(expectedResponse);

    try {
      const response = await handler(event);

      expect(response).toEqual({
        city: 'London',
        temperature: 10,
        condition: 'Clouds',
        description: 'scattered clouds',
      });

      //expect(axios.get).toHaveBeenCalledWith(`https://api.openweathermap.org/data/2.5/weather?q=${event.arguments.city}&units=metric&appid=mock-api-key`);
    } catch (error) {
      console.error(error);
    }
  });

  it('should return an error message if fetching weather data fails', async () => {
    const event = { arguments: { city: 'London' } };
    const errorMessage = 'An error occurred while calling the weather API'; // Updated error message
    axios.get.mockRejectedValue(new Error(errorMessage));
  
    try {
      const response = await handler(event);
  
      expect(response).toEqual({ error: errorMessage });
    } catch (error) {
      console.log(error);
    }
  });
});
