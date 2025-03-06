const express = require('express');
const path = require('path');
const fs = require('fs'); // Required for file existence check
const generatePdf = require('./generatePdf');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static files from both 'public' (English) and 'public_chinese' (chinese)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/chinese', express.static(path.join(__dirname, 'public_chinese'))); // Ensure correct path

// Explicitly serve favicon
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

// ✅ Serve English home page when accessing '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'), (err) => {
        if (err) {
            res.status(500).send('Error loading homepage');
        }
    });
});
// Serve the public folder (English)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the public_chinese folder
app.use('/public_chinese', express.static(path.join(__dirname, 'public_chinese')));

// ✅ Serve chinese home page when accessing '/chinese'
app.get('/chinese', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_chinese', 'home.html'), (err) => {
        if (err) {
            res.status(500).send('Error loading chinese homepage');
        }
    });
});

// ✅ Serve all English pages dynamically
app.get('/:page', (req, res) => {
    const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page Not Found');
    }
});

// ✅ Serve all chinese pages dynamically
app.get('/chinese/:page', (req, res) => {
    const filePath = path.join(__dirname, 'public_chinese', `${req.params.page}.html`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page Not Found');
    }
});

// Route to dynamically generate PDFs
app.get('/download-pdf/:productName', async (req, res) => {
    const productName = req.params.productName;
    try {
        console.log(`Generating PDF for ${productName}...`);
        await generatePdf(res, productName);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Failed to generate PDF");
    }
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://10.165.35.93:${PORT}/`);
});
