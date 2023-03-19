const axios = require('axios');

exports.handler = async (event) => {
  const artist = event.arguments.artist;
  
  // Build the API request URL
  const apiUrl = `https://itunes.apple.com/search?term=${artist}&entity=album&limit=5`;
  
  try {
    // Send the request to the API
    const response = await axios.get(apiUrl);
    
    // Extract the relevant data from the API response and return it in the expected format
    const albums = response.data.results.map(result => ({
      id: result.collectionId,
      name: result.collectionName,
      artist: result.artistName,
      imageUrl: result.artworkUrl100.replace(/100x100bb/g, '400x400bb'),
      releaseDate: result.releaseDate
    }));
    
    return albums;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching album data from the iTunes API');
  }
};
