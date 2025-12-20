export class AuthClient {
    private readonly EXTERNAL_API = 'https://vsv-research.volkmann-webservices.de/auth';

    async login(payload: any) {
        const response = await fetch(`${this.EXTERNAL_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        return await response.json();
    }

    async register(payload: any) {
        const response = await fetch(`${this.EXTERNAL_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    }
}