import { Router } from 'express';
import { AuthClient } from './auth-client';

const router = Router();
const authClient = new AuthClient();

router.post('/login', async (req, res) => {
    try {
        const result = await authClient.login(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await authClient.register(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: 'Registration failed' });
    }
});

export default router;