/**
 * API Helper for vessel-scoped requests
 * Automatically includes vesselId header in requests
 */

export async function apiFetch(
    url: string,
    options: RequestInit & { vesselId?: number } = {}
) {
    const { vesselId, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers || {});
    
    // Add vessel ID to header if provided
    if (vesselId) {
        headers.set('X-Vessel-Id', vesselId.toString());
    }
    
    const finalOptions = {
        ...fetchOptions,
        headers
    };

    return fetch(url, finalOptions);
}

/**
 * Helper to extract vessel ID from client-side context
 */
export async function getClientVesselId(): Promise<number | null> {
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const user = await response.json();
            return user.assigned_vessels?.[0]?.vessel_id || null;
        }
    } catch (error) {
        console.error('Error getting vessel ID:', error);
    }
    return null;
}
