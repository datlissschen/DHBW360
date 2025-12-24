export async function checkLogin(token: string): Promise<string | undefined> {
    const res = await fetch(`${process.env.LOGIN_BASE_URL}/verify?token=${token}`,
            {
                method: 'GET'
            });
    const json: {valid: boolean, user: string | undefined} = await res.json();
    return json.valid ? json.user : undefined;
}