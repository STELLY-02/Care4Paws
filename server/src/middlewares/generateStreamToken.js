const { StreamChat } = require('stream-chat');

// createToken function
const createToken = (userId) => {
  const apiKey = process.env.STREAM_API_KEY;  // Stream API Key from env variables
  const apiSecret = process.env.STREAM_API_SECRET;  // Stream API Secret from env variables

  const chatClient = new StreamChat(apiKey, apiSecret);  // Initialize StreamChat client with API key and secret
  const token = chatClient.createToken(userId);  // Generate the token for the given userId
  return token;
};

// Endpoint to generate Stream token
const generateStreamToken = (req, res) => {
    const { userId } = req.body; // Extract userId from the request body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const token = createToken(userId); // Generate the token
        res.status(200).json({ token }); // Return the token
    } catch (error) {
        console.error('Error generating Stream token:', error);
        res.status(500).json({ message: 'Error generating token', error: error.message });
    }
};

module.exports = { generateStreamToken };
