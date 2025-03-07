// src/frontend/src/lib/stores/documents.js
import { writable, derived } from 'svelte/store';
import { Actor } from '@dfinity/agent';
import { httpAgent, isAuthenticated } from './auth';
import { idlFactory } from '../../../../../declarations/document_manager';
import { canisterId } from '../../../../../declarations/document_manager/index';

// Create stores for document state
export const documentManager = writable(null);
export const documents = writable([]);
export const userEmail = writable('');
export const loading = writable(false);
export const error = writable(null);

// Create the actor when httpAgent changes
export function initDocumentManager(agent) {
    if (!agent) return null;

    try {
        const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });

        documentManager.set(actor);
        return actor;
    } catch (err) {
        console.error('Failed to create actor:', err);
        error.set('Failed to initialize document manager');
        return null;
    }
}

// Subscribe to httpAgent changes to initialize the actor
let unsubscribe;
export function setupDocumentManager() {
    if (unsubscribe) unsubscribe();

    unsubscribe = httpAgent.subscribe(($httpAgent) => {
        if ($httpAgent) {
            initDocumentManager($httpAgent);
        } else {
            documentManager.set(null);
        }
    });
}

// Load user profile including documents and email
export async function loadUserProfile() {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        const profile = await actor.getMyProfile();
        documents.set(profile.documents || []);
        userEmail.set(profile.email?.[0] || '');
    } catch (err) {
        console.error('Failed to load profile:', err);
        error.set('Failed to load your profile');
    } finally {
        loading.set(false);
    }
}

// Upload a document
export async function uploadDocument(file) {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Uint8Array(arrayBuffer);

        // Upload document
        await actor.uploadDocument(
            file.name,
            blob,
            file.type
        );

        // Reload documents
        await loadUserProfile();

        return true;
    } catch (err) {
        console.error('Failed to upload document:', err);
        error.set('Failed to upload document');
        return false;
    } finally {
        loading.set(false);
    }
}

// Delete a document
export async function deleteDocument(docId) {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        const result = await actor.deleteDocument(Number(docId));

        if (result) {
            // Reload documents
            await loadUserProfile();
            return true;
        } else {
            error.set('Document not found');
            return false;
        }
    } catch (err) {
        console.error('Failed to delete document:', err);
        error.set('Failed to delete document');
        return false;
    } finally {
        loading.set(false);
    }
}

// View a document
export async function getDocument(docId) {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        const doc = await actor.getDocument(Number(docId));

        if (!doc[0]) {
            error.set('Document not found');
            return null;
        }

        return doc[0];
    } catch (err) {
        console.error('Failed to get document:', err);
        error.set('Failed to retrieve document');
        return null;
    } finally {
        loading.set(false);
    }
}

// Update email
export async function updateEmail(email) {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        await actor.updateEmail(email);
        userEmail.set(email);

        return true;
    } catch (err) {
        console.error('Failed to update email:', err);
        error.set('Failed to update email');
        return false;
    } finally {
        loading.set(false);
    }
}

// Send documents to email
export async function sendDocumentsToEmail() {
    loading.set(true);
    error.set(null);

    try {
        const actor = await documentManager.get();

        if (!actor) {
            throw new Error('Document manager not initialized');
        }

        const result = await actor.sendDocumentsToEmail();

        if (!result) {
            error.set('Failed to send documents. Please check your email and document list.');
        }

        return result;
    } catch (err) {
        console.error('Failed to send documents:', err);
        error.set('Failed to send documents');
        return false;
    } finally {
        loading.set(false);
    }
}

// Combine isAuthenticated and documentManager to determine if ready
export const isReady = derived(
    [isAuthenticated, documentManager],
    ([$isAuthenticated, $documentManager]) => {
        return $isAuthenticated && $documentManager !== null;
    }
);
