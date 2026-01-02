
export interface KeyResult {
    id: string;
    title: string;
    target: number;
    currentValue: number;
    achievement: number;
}

export interface Objective {
    id: string;
    title: string;
    keyResults: KeyResult[];
}

export const fetchOKRs = async () => {
    const apiUrl = import.meta.env.VITE_OKR_API_URL;
    const apiKey = import.meta.env.VITE_EMPLOYEE_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error("Missing API URL or Key");
        throw new Error("Configuration error: Missing API URL or Key");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            // Note: The URL parameters are already in the string provided by the user, 
            // but in a real app might need better construction.
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched OKRs:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch OKRs:", error);
        throw error;
    }
};

export const fetchReviewForm = async () => {
    const apiUrl = import.meta.env.VITE_REVIEW_FORM_API_URL;
    const apiKey = import.meta.env.VITE_EMPLOYEE_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error("Missing API URL or Key");
        throw new Error("Configuration error: Missing API URL or Key");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Review Form:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch Review Form:", error);
        throw error;
    }
};

export const updateKeyResult = async (keyResultId: string, value: number) => {
    const apiUrl = import.meta.env.VITE_UPDATE_KEY_RESULT_API_URL;
    const apiKey = import.meta.env.VITE_EMPLOYEE_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error("Missing Update API URL or Key");
        throw new Error("Configuration error: Missing Update API URL or Key");
    }

    try {
        console.log("📡 OUTGOING API REQUEST:", apiUrl);
        console.log("📦 PAYLOAD:", { id: keyResultId, currentValue: value });

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: keyResultId,
                currentValue: value,
            }),
        });

        console.log("📩 API RESPONSE STATUS:", response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Updated KeyResult ${keyResultId} to ${value}:`, data);
        return data;
    } catch (error) {
        console.error("Failed to update Key Result:", error);
        throw error;
    }
};

export const submitCompetencyReview = async (reviewData: any) => {
    // Placeholder for submission logic
    console.log("Submitting review:", reviewData);
    return Promise.resolve({ success: true });
}

