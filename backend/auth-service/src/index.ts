import app from './api/express-app';

const PORT = 8007;

app.listen(PORT, () => {
    console.log(`Auth Service running on http://localhost:${PORT}`);
});