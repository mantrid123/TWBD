// src/frontend/src/lib/stores/auth.js
import { writable, derived } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

// Create stores for auth state
export const authClient = writable(null);
export const identity = writable(null);
export const principal = writable(null);
export const isAuthenticated = writable(false);
export const authLoading = writable(true);

// Create an actor store that depends on identity
export const httpAgent = derived(identity, ($identity) => {
    if (!$identity) return null;

    const agent = new HttpAgent({
        identity: $identity,
    });

    // In development, we need to fetch the root key
    if (process.env.NODE_ENV !== "production") {
        agent.fetchRootKey();
    }

    return agent;
});

// Initialize auth
export async function initAuth() {
    authLoading.set(true);

    try {
        const client = await AuthClient.create();
        authClient.set(client);

        if (await client.isAuthenticated()) {
            const userIdentity = await client.getIdentity();
            identity.set(userIdentity);
            principal.set(userIdentity.getPrincipal());
            isAuthenticated.set(true);
        }
    } catch (error) {
        console.error('Authentication error:', error);
    } finally {
        authLoading.set(false);
    }
}

// Login with Internet Identity
export async function login() {
    let auth;
    authLoading.set(true);

    try {
        auth = await authClient.get();

        if (!auth) {
            throw new Error('Auth client not initialized');
        }

        const days = 30;
        await auth.login({
            identityProvider: 'https://identity.ic0.app',
            maxTimeToLive: BigInt(days * 24 * 60 * 60 * 1000 * 1000 * 1000),
                         onSuccess: async () => {
                             const userIdentity = await auth.getIdentity();
                             identity.set(userIdentity);
                             principal.set(userIdentity.getPrincipal());
                             isAuthenticated.set(true);
                         },
        });
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        authLoading.set(false);
    }
}

// Logout
export async function logout() {
    authLoading.set(true);

    try {
        const auth = await authClient.get();

        if (auth) {
            await auth.logout();
        }

        identity.set(null);
        principal.set(null);
        isAuthenticated.set(false);

        // Redirect to home page will be handled by the route
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        authLoading.set(false);
    }
}

// Check if authenticated (useful for protected routes)
export function checkAuth() {
    return derived(
        [isAuthenticated, authLoading],
        ([$isAuthenticated, $authLoading]) => {
            return {
                authenticated: $isAuthenticated,
                loading: $authLoading,
            };
        }
    );
}
