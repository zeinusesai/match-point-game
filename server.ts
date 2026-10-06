import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Server-side Gemini client initialization with mandatory User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Structured schema for a football trivia question (2020-present)
const triviaQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    id: {
      type: Type.STRING,
      description: 'A unique identifier string or UUID for the question',
    },
    question: {
      type: Type.STRING,
      description: 'The trivia question text targeting a football event strictly from 2020 to present',
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Array of exactly 4 distinct multiple choice options',
    },
    answer: {
      type: Type.STRING,
      description: 'The correct answer string, which must match one of the 4 options exactly',
    },
    difficulty: {
      type: Type.STRING,
      description: 'Difficulty tier: Easy, Medium, Hard, or Very Hard',
    },
    category: {
      type: Type.STRING,
      description: 'Category: Champions League, Premier League, World Cup, Transfers, Domestic Leagues, or Individual Awards',
    },
    year: {
      type: Type.INTEGER,
      description: 'The year of the event (strictly an integer between 2020 and 2026)',
    },
    context: {
      type: Type.STRING,
      description: 'A brief 1-sentence trivia detail explaining the answer and historical context',
    },
  },
  required: ['id', 'question', 'options', 'answer', 'difficulty', 'category', 'year', 'context'],
};

const batchQuestionsSchema = {
  type: Type.ARRAY,
  items: triviaQuestionSchema,
  description: 'Array of football trivia questions strictly from 2020 to present',
};

// API Route: Generate single AI trivia question
app.post('/api/questions/generate', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to local database.',
      });
    }

    const {
      difficulty = 'Medium',
      category = 'Champions League',
      eraFocus = 'all',
      excludedTopics = [],
    } = req.body || {};

    let eraInstruction = 'Events can span any season from January 2020 to present.';
    if (eraFocus === '2020_2022') {
      eraInstruction = 'Focus strictly on events from 2020 through December 2022 (e.g. 2020/21 Champions League, 2022 Qatar World Cup, Euro 2020).';
    } else if (eraFocus === '2023_present') {
      eraInstruction = 'Focus strictly on events from 2023 through present (e.g. 2023 Man City Treble, Euro 2024 in Germany, 2023/24/25 Champions League, recent blockbuster transfers).';
    }

    const excludeText = excludedTopics.length > 0
      ? `DO NOT generate questions about these recently played topics or players: ${excludedTopics.slice(-25).join(', ')}.`
      : '';

    const prompt = `Generate 1 fresh, highly accurate football (soccer) trivia question.
Target Category: ${category}.
Target Difficulty: ${difficulty}.
Era/Year Requirement: ${eraInstruction}
${excludeText}
Make sure all 4 options are plausible, distinct modern footballers or clubs, and the answer is verified fact.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert football (soccer) trivia master specializing strictly in modern football events from January 2020 to present. Generate a trivia question based on the requested difficulty tier and category. Never generate questions prior to 2020.',
        responseMimeType: 'application/json',
        responseSchema: triviaQuestionSchema,
        temperature: 0.85,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response received from Gemini model.');
    }

    const question = JSON.parse(text);
    return res.json({ question, success: true });
  } catch (error: any) {
    console.error('Error generating AI question:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate question',
      fallbackRequired: true,
    });
  }
});

// API Route: Batch pre-fetch 5-10 AI trivia questions
app.post('/api/questions/batch', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to local database.',
      });
    }

    const {
      count = 5,
      selectedDifficulties = ['Easy', 'Medium', 'Hard'],
      selectedCategories = ['Champions League', 'Premier League', 'World Cup', 'Transfers'],
      eraFocus = 'all',
      difficultyCurve = 'progressive',
      excludedTopics = [],
    } = req.body || {};

    const safeCount = Math.min(10, Math.max(2, Number(count) || 5));

    let eraInstruction = 'Events can span any season from January 2020 to present.';
    if (eraFocus === '2020_2022') {
      eraInstruction = 'Focus strictly on events from 2020 through December 2022.';
    } else if (eraFocus === '2023_present') {
      eraInstruction = 'Focus strictly on events from 2023 through present.';
    }

    const curveInstruction = difficultyCurve === 'progressive'
      ? 'Scale question difficulties progressively: start with Easy questions first, then Medium, then Hard and Very Hard.'
      : `Select difficulties randomly from: ${selectedDifficulties.join(', ')}.`;

    const excludeText = excludedTopics.length > 0
      ? `DO NOT generate questions about these recently played topics or players: ${excludedTopics.slice(-30).join(', ')}.`
      : '';

    const prompt = `Generate a batch of ${safeCount} unique, non-repetitive modern football (soccer) trivia questions strictly from 2020 to present.
Categories to draw from: ${selectedCategories.join(', ')}.
Difficulty rules: ${curveInstruction}
Era rules: ${eraInstruction}
${excludeText}
Ensure every question has exactly 4 options, a verified answer, historical context note, and a year between 2020 and 2026.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert football (soccer) trivia master specializing strictly in modern football events from January 2020 to present. Generate trivia questions based on the requested difficulty tier and category. Return only JSON.',
        responseMimeType: 'application/json',
        responseSchema: batchQuestionsSchema,
        temperature: 0.85,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response received from Gemini model.');
    }

    const questions = JSON.parse(text);
    return res.json({ questions, success: true, count: questions.length });
  } catch (error: any) {
    console.error('Error generating AI questions batch:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate batch',
      fallbackRequired: true,
    });
  }
});

// Mount Vite or serve static production build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MatchPoint server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
