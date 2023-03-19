const axios = require('axios');

exports.handler = async (event) => {
  try {
    
  const artist = event.arguments.artist;
  const url = `https://itunes.apple.com/search?term=${artist}&entity=album&limit=5`;


    const response = await axios.get(url);
    const albums = response.data.results.map(result => ({
      id: result.collectionId,
      name: result.collectionName,
      artist: result.artistName,
      artworkUrl: result.artworkUrl100,
      releaseDate: result.releaseDate,
    }));

    return albums;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch albums from iTunes API');
  }
};
