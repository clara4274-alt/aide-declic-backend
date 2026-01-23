const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aide Déclic API - Backend fonctionnel ✅',
    version: '1.0.0',
    status: 'online'
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route d'analyse (temporaire - simulation)
app.post('/api/analyze', (req, res) => {
  const { formData } = req.body;
  
  // Simulation simple
  res.json({
    totalAmount: 4287,
    aidesCount: 6,
    aides: [
      { nom: "Prime d'activité", montant: 1800, description: "Complément de revenu" },
      { nom: "APL", montant: 2400, description: "Aide au logement" },
      { nom: "Allocations familiales", montant: 1560, description: "Aide familiale" },
      { nom: "Chèque Énergie", montant: 277, description: "Aide énergie" },
      { nom: "CSS", montant: 800, description: "Complémentaire santé" },
      { nom: "Aides régionales", montant: 450, description: "Aides locales" }
    ]
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
