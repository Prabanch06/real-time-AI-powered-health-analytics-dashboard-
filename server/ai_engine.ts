import express from 'express';
import { authenticateToken } from './auth';
import db from './database';
import { broadcastUpdate } from './websocket_manager';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

let ai: any = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('✅ Gemini AI Engine initialized successfully');
} else {
  console.log('⚠️  Gemini API Key missing or default. Using Mock AI Model.');
}

// Real ML Model via Google GenAI or fallback to mock
async function predictDisease(symptoms: string[]) {
  if (!ai) {
    // Mock ML Model Fallback
    const diseases = [
      { name: 'Dengue', risk: 'High', prob: 0.85 },
      { name: 'Common Cold', risk: 'Low', prob: 0.92 },
      { name: 'COVID-19', risk: 'High', prob: 0.78 },
      { name: 'Flu', risk: 'Medium', prob: 0.88 },
      { name: 'Typhoid', risk: 'High', prob: 0.75 },
      { name: 'Malaria', risk: 'High', prob: 0.82 },
      { name: 'Allergy', risk: 'Low', prob: 0.95 },
    ];

    const index = symptoms.length % diseases.length;
    const basePrediction = diseases[index];

    const probability = Math.min(0.99, basePrediction.prob + (Math.random() * 0.1 - 0.05));
    const confidenceScore = probability * 100;

    return {
      predicted_disease: basePrediction.name,
      probability: probability,
      risk_level: basePrediction.risk,
      confidence_score: confidenceScore
    };
  }

  const prompt = `Based on the following symptoms: ${symptoms.join(', ')}. What is the most likely single predicted disease? 
Output strictly as JSON with exactly these fields:
- predicted_disease (string)
- probability (number between 0 and 1)
- risk_level (string, one of: "Low", "Medium", "High")
- confidence_score (number between 0 and 100)`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text);
}

router.post('/predict', authenticateToken, async (req: any, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const prediction = await predictDisease(symptoms);

    // Save to DB
    const stmt = db.prepare(`
      INSERT INTO predictions (user_id, symptoms, predicted_disease, probability, risk_level, confidence_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      req.user.id,
      JSON.stringify(symptoms),
      prediction.predicted_disease,
      prediction.probability,
      prediction.risk_level,
      prediction.confidence_score
    );

    const newPrediction = {
      id: info.lastInsertRowid,
      user_id: req.user.id,
      symptoms: JSON.stringify(symptoms),
      predicted_disease: prediction.predicted_disease,
      probability: prediction.probability,
      risk_level: prediction.risk_level,
      confidence_score: prediction.confidence_score,
      created_at: new Date().toISOString()
    };

    // Broadcast update
    broadcastUpdate('NEW_PREDICTION', newPrediction);

    res.json(newPrediction);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

export default router;
