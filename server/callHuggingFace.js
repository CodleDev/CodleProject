require('dotenv').config();
const axios = require('axios');

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL_ID = process.env.HF_MODEL_ID;

async function callHuggingFace({ title, content }) {
  const prompt = `Solve this LeetCode problem step-by-step:\nTitle: ${title}\n${content}`;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60_000 // 60 seconds
      }
    );

    // Varies depending on the model, adjust accordingly
    const generatedText = response.data?.[0]?.generated_text || '';
    return generatedText;

  } catch (error) {
    console.error('Hugging Face API call failed:', error.message);

    if (error.code === 'ECONNABORTED') {
      console.error('⚠️ Request timed out');
    }

    // Retry logic (basic)
    try {
      console.log('Retrying...');
      const retryResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 60_000
        }
      );

      return retryResponse.data?.[0]?.generated_text || '';

    } catch (retryError) {
      console.error('Retry also failed:', retryError.message);
      throw retryError;
    }
  }
}

module.exports = callHuggingFace;