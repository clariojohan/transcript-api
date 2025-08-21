// File: index.js
// This is a simple Express server to fetch a YouTube transcript.
// Deploy this to a service like Render or Railway.

import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';

const app = express();
const PORT = process.env.PORT || 3001; // Use port from environment or default to 3001

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('Transcript Fetcher API is running.');
});

// The main endpoint to get a transcript
app.get('/api/transcript', async (req, res) => {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: 'Missing "videoId" query parameter.' });
    }

    try {
        console.log(`Fetching transcript for video ID: ${videoId}`);

        // Fetch the transcript from YouTube
        const transcriptParts = await YoutubeTranscript.fetchTranscript(videoId);

        // Combine the transcript parts into a single block of text
        const fullTranscript = transcriptParts.map(part => part.text).join(' ');

        console.log(`Successfully fetched transcript for ${videoId}. Length: ${fullTranscript.length}`);

        // Send the plain text transcript as the response
        res.status(200).header('Content-Type', 'text/plain').send(fullTranscript);

    } catch (e) {
        console.error(`Failed to fetch transcript for ${videoId}:`, e.message);
        res.status(500).json({
            error: 'Failed to retrieve transcript.',
            message: e.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
