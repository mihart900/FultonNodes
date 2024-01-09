const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

require('dotenv').config(); // Ensure you have this line to use environment variables

app.post('/ask', async (req, res) => {
    try {
        // Extracting 'prompt' from the request body
        const { prompt } = req.body;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            messages: [{
                role: "system",
                content: "You are a helpful assistant."
            }, {
                role: "user",
                content: prompt
            }],
            max_tokens: 150,
            model: "gpt-3.5-turbo"
        }, {
            headers: {                
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use environment variable
                'Content-Type': 'application/json' // Explicitly setting Content-Type
            }
        });
        res.json(response.data);
    } catch (error) {        
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error(error.config);
            res.status(500).json({ message: 'Error communicating with ChatGPT API', error: error.message });
        }        
    }
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
