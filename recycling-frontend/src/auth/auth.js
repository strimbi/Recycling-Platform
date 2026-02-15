const TOKEN_KEY = 'rp_token';
const USER_KEY = 'rp_user';

export function saveAuth(authResponse) {
    // authResponse: { token, email, displayName, role, ... }
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
        email: authResponse.email,
        displayName: authResponse.displayName,
        role: authResponse.role,
    }));
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return !!getToken();
}
