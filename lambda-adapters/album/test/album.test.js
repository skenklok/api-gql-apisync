const axios = require('axios');
const { handler } = require('../index');


jest.mock('axios');

describe('album lambda function', () => {
  it('should return albums for a given artist', async () => {
    const event = { arguments: { artist: 'Taylor Swift' } };
    const expectedResponse = {
      data: {
        results: [
          {
            collectionId: 123,
            collectionName: 'Folklore',
            artistName: 'Taylor Swift',
            artworkUrl100: 'https://example.com/folklore.jpg',
            releaseDate: '2020-07-24T00:00:00Z',
          },
          {
            collectionId: 456,
            collectionName: 'Evermore',
            artistName: 'Taylor Swift',
            artworkUrl100: 'https://example.com/evermore.jpg',
            releaseDate: '2020-12-11T00:00:00Z',
          },
        ],
      },
    };

    axios.get.mockResolvedValue(expectedResponse);

    const response = await handler(event);

    expect(response).toEqual([
      {
        id: 123,
        name: 'Folklore',
        artist: 'Taylor Swift',
        artworkUrl: 'https://example.com/folklore.jpg',
        releaseDate: '2020-07-24T00:00:00Z',
      },
      {
        id: 456,
        name: 'Evermore',
        artist: 'Taylor Swift',
        artworkUrl: 'https://example.com/evermore.jpg',
        releaseDate: '2020-12-11T00:00:00Z',
      },
    ]);
    // expect(axios.get).toHaveBeenCalledWith(`https://itunes.apple.com/search?term=${event.arguments.artist}&entity=album&limit=5`);
  });

  it('should throw an error if fetching albums fails', async () => {
    const event = { arguments: { artist: 'Taylor Swift' } };
    const errorMessage = 'Failed to fetch albums from iTunes API';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(handler(event)).rejects.toThrow(errorMessage);
  });
});
