const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Optional config endpoint for container environments (Cloud Run / Docker)
app.get('/api/firebase-config', (req, res) => {
  if (process.env.FIREBASE_API_KEY) {
    return res.json({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.FIREBASE_APP_ID || '',
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
    });
  }
  res.status(404).json({ error: 'Config not provided via environment variables' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`   🏠 หน้าบ้าน:  http://localhost:${PORT}/`);
  console.log(`   🔧 หลังบ้าน:  http://localhost:${PORT}/admin.html`);
});
