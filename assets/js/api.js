/**
 * ALGEBRIFY - API CONFIGURATION & HTTP CLIENT
 * Centralized client for communicating with the Python/Flask calculation backend.
 */

const API_BASE_URL = (function () {
    const loc = window.location;
    // When served directly by the Flask server
    if (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") {
        if (loc.port === "5000" || loc.port === "8080") {
            return "";
        }
        return "http://localhost:5000";
    }
    // Remote Python backend or GitHub Pages config
    return window.ALGEBRIFY_BACKEND_URL || "http://localhost:5000";
})();

/**
 * Send POST request to Algebrify Flask REST API
 * @param {string} endpoint - e.g. '/api/matrix', '/api/equations', etc.
 * @param {object} payload - JSON serializable body
 * @returns {Promise<object>} JSON response from Python backend
 */
async function algebrifyApi(endpoint, payload) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (err) {
        console.warn(`[Algebrify API] Network error connecting to ${url}:`, err);
        return {
            success: false,
            error: `Could not connect to Python Flask backend at ${API_BASE_URL}. Ensure 'python app.py' is running.`
        };
    }
}
