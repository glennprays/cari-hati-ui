export function jwtDecode(token: string): any {
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    if (encodedPayload !== undefined) {
        const rawPayload = atob(encodedPayload);

        return JSON.parse(rawPayload);
    }
    return null
}
