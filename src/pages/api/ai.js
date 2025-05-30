import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, input } = req.body;

    if (!prompt || !input) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare the messages for the API call
    const messages = [
      {
        role: 'system',
        content: `You are an AI assistant specialized in improving resumes and analyzing job descriptions. 
                 You provide concise, professional, and actionable suggestions.
                 Format your responses according to the specific prompt type.`
      },
      {
        role: 'user',
        content: `${prompt}\n\nInput: ${input}`
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse the response based on the prompt type
    const response = completion.choices[0].message.content;
    let result;

    if (prompt.includes('Format: Original -> Improved')) {
      // For achievement and description improvements
      const [_, improved] = response.split('->').map(s => s.trim());
      result = { improvement: improved };
    } else if (prompt.includes('comma-separated list')) {
      // For skill suggestions
      result = { skills: response.trim() };
    } else if (prompt.includes('Format as JSON')) {
      // For job analysis
      try {
        result = JSON.parse(response);
      } catch {
        // If JSON parsing fails, return the raw response
        result = { error: 'Failed to parse JSON response', raw: response };
      }
    } else {
      // Default case
      result = { response };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI API Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
} 