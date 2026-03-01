import express from 'express';
import { authenticateToken } from './auth';
import db from './database';

const router = express.Router();

router.get('/dashboard', authenticateToken, (req: any, res) => {
  try {
    // 1. Total Predictions
    const totalPredictions = db.prepare('SELECT COUNT(*) as count FROM predictions').get() as { count: number };

    // 2. High Risk Alerts
    const highRiskCount = db.prepare('SELECT COUNT(*) as count FROM predictions WHERE risk_level = ?').get('High') as { count: number };

    // 3. Average Confidence Score
    const avgConfidence = db.prepare('SELECT AVG(confidence_score) as avg FROM predictions').get() as { avg: number };

    // 4. Most Frequent Disease
    const mostFrequent = db.prepare(`
      SELECT predicted_disease, COUNT(*) as count 
      FROM predictions 
      GROUP BY predicted_disease 
      ORDER BY count DESC 
      LIMIT 1
    `).get() as { predicted_disease: string, count: number };

    // 5. Last Prediction Time
    const lastPrediction = db.prepare('SELECT created_at FROM predictions ORDER BY created_at DESC LIMIT 1').get() as { created_at: string };

    // 6. Risk Distribution
    const riskDistribution = db.prepare(`
      SELECT risk_level as name, COUNT(*) as value 
      FROM predictions 
      GROUP BY risk_level
    `).all();

    // 7. Prediction Trend (Last 7 days)
    const predictionTrend = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count 
      FROM predictions 
      GROUP BY date(created_at) 
      ORDER BY date(created_at) DESC 
      LIMIT 7
    `).all().reverse();

    // 8. Disease Frequency
    const diseaseFrequency = db.prepare(`
      SELECT predicted_disease as name, COUNT(*) as value 
      FROM predictions 
      GROUP BY predicted_disease 
      ORDER BY value DESC 
      LIMIT 5
    `).all();

    // 9. AI Confidence Trend
    const confidenceTrend = db.prepare(`
      SELECT date(created_at) as date, AVG(confidence_score) as avg_confidence 
      FROM predictions 
      GROUP BY date(created_at) 
      ORDER BY date(created_at) DESC 
      LIMIT 7
    `).all().reverse();

    // 10. Generate Insights
    const insights = [];
    if (highRiskCount.count > 0) {
      insights.push(`High-risk cases detected: ${highRiskCount.count} total.`);
    }
    if (mostFrequent) {
      insights.push(`Most frequently predicted disease: ${mostFrequent.predicted_disease}.`);
    }
    if (avgConfidence.avg) {
      insights.push(`Average confidence score: ${avgConfidence.avg.toFixed(1)}%.`);
    }
    
    // Anomaly detection (basic)
    if (predictionTrend.length >= 2) {
      const last = predictionTrend[predictionTrend.length - 1] as any;
      const prev = predictionTrend[predictionTrend.length - 2] as any;
      if (last.count > prev.count * 1.5) {
        insights.push(`Recent spike in predictions detected on ${last.date}.`);
      }
    }

    res.json({
      cards: {
        totalPredictions: totalPredictions.count,
        highRiskAlerts: highRiskCount.count,
        avgConfidence: avgConfidence.avg || 0,
        mostFrequentDisease: mostFrequent ? mostFrequent.predicted_disease : 'N/A',
        lastPredictionTime: lastPrediction ? lastPrediction.created_at : null
      },
      charts: {
        riskDistribution,
        predictionTrend,
        diseaseFrequency,
        confidenceTrend
      },
      insights
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/history', authenticateToken, (req: any, res) => {
  try {
    const history = db.prepare('SELECT * FROM predictions ORDER BY created_at DESC LIMIT 50').all();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
