# Lead Qualification Form

A multi-step form with AI-powered solution generation for lead qualification.

## Setup Instructions

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure API Key

1. Open `config.js` file
2. Replace `your_gemini_api_key_here` with your actual API key:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'your_actual_api_key_here',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent'
};
```

### 3. Run the Application

1. Open `index.html` in your web browser
2. The form should now work with AI-powered solution generation

## Features

- Multi-step form with progress tracking
- AI-powered solution generation using Google Gemini
- Responsive design for mobile and desktop
- Form validation and error handling
- High-priority lead detection
- Calendar booking interface

## Troubleshooting

### AI Response Not Working

If the AI response isn't working, check:

1. **API Key**: Make sure you've replaced the placeholder in `config.js` with your actual Google Gemini API key
2. **API Quota**: Check if you've exceeded your API quota limits
3. **Network**: Ensure you have a stable internet connection
4. **Browser Console**: Open browser developer tools and check for any error messages

### Common Issues

- **"API key not configured"**: Update the `GEMINI_API_KEY` in `config.js`
- **"HTTP error! status: 403"**: Check your API key permissions and quota
- **"HTTP error! status: 400"**: Check the API request format (should be working with current code)

## File Structure

- `index.html` - Main HTML file
- `script.js` - JavaScript functionality
- `styles.css` - CSS styling
- `config.js` - API configuration
- `README.md` - This file
