const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const systemPrompt = `
You are a healthcare assistant AI. Rules:
1. Only answer healthcare-related questions.
2. If the question is not related to healthcare, respond with:
"I can only assist with healthcare-related questions."
3. Provide safe and responsible medical information.
`;

export const sendMessage = async (messages, model = 'openai/gpt-3.5-turbo') => {
  const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key is not configured. Please add your API key to the .env file.');
  }

  const messagesWithSystem = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Chat App'
    },
    body: JSON.stringify({
      model,
      messages: messagesWithSystem
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from OpenRouter');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

export const AVAILABLE_MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'openai/gpt-4', name: 'GPT-4' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B' }
];
