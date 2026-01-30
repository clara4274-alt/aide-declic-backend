const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialiser Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
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

// Route POST /api/avis - Soumettre un avis
app.post('/api/avis', async (req, res) => {
  try {
    const { nom, note, commentaire } = req.body;

    // Validation
    if (!nom || !note) {
      return res.status(400).json({ 
        error: 'Nom et note sont requis' 
      });
    }

    if (note < 1 || note > 5) {
      return res.status(400).json({ 
        error: 'La note doit être entre 1 et 5' 
      });
    }

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('avis')
      .insert([
        {
          nom: nom.trim(),
          note: parseInt(note),
          commentaire: commentaire ? commentaire.trim() : null,
          approuve: false,
          date_creation: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de l\'enregistrement de l\'avis' 
      });
    }

    console.log('✅ Avis enregistré:', data[0]);
    res.status(201).json({ 
      success: true, 
      message: 'Merci pour votre avis ! Il sera publié après modération.',
      avis: data[0] 
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      error: 'Erreur serveur' 
    });
  }
});

// Route GET /api/avis - Récupérer les avis approuvés
app.get('/api/avis', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('approuve', true)
      .order('date_creation', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération des avis' 
      });
    }

    res.json({ avis: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      error: 'Erreur serveur' 
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
