export async function checkLogin(token: string): Promise<boolean> {
    const res = await fetch(`${process.env.LOGIN_BASE_URL}/verify?token=${token}`,
            {
                method: 'GET'
            });
    const json = await res.json();
    return json.valid;
}