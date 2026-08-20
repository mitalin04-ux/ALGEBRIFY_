"""
ALGEBRIFY - FLASK BACKEND REST API
Main application server exposing structured calculation endpoints for:
- Expressions (/api/calculator)
- Matrix Algebra (/api/matrix)
- Linear Equations (/api/equations)
- Vector Algebra (/api/vectors)
- Eigenvalues & Eigenvectors (/api/eigen)
- Field Arithmetic (/api/fields)
- Vector Spaces & Basis (/api/vector-spaces)
- Linear Transformations (/api/transformations)
- AI Tutor Proxy (/api/chat)
- System Health (/api/health)
"""

import os
import sys
import json
import urllib.request
import urllib.error
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

try:
    from .calculator import calculate_expression
    from .matrix import (
        matrix_add, matrix_subtract, matrix_multiply, matrix_scalar_multiply,
        matrix_transpose, matrix_determinant, matrix_inverse, matrix_rank, matrix_trace
    )
    from .equations import solve_linear_system
    from .vectors import (
        vector_add, vector_subtract, vector_dot, vector_cross,
        vector_magnitude, vector_angle, vector_unit
    )
    from .eigen import solve_eigen_2x2, solve_eigen_3x3
    from .fields import (
        complex_add, complex_multiply, complex_inverse,
        gf2_add, gf2_multiply, gf2_inverse
    )
    from .vector_spaces import check_linear_independence
    from .transformations import (
        apply_2d_transformation, change_of_basis_2d, gram_schmidt_2d
    )
except (ImportError, ValueError):
    from calculator import calculate_expression
    from matrix import (
        matrix_add, matrix_subtract, matrix_multiply, matrix_scalar_multiply,
        matrix_transpose, matrix_determinant, matrix_inverse, matrix_rank, matrix_trace
    )
    from equations import solve_linear_system
    from vectors import (
        vector_add, vector_subtract, vector_dot, vector_cross,
        vector_magnitude, vector_angle, vector_unit
    )
    from eigen import solve_eigen_2x2, solve_eigen_3x3
    from fields import (
        complex_add, complex_multiply, complex_inverse,
        gf2_add, gf2_multiply, gf2_inverse
    )
    from vector_spaces import check_linear_independence
    from transformations import (
        apply_2d_transformation, change_of_basis_2d, gram_schmidt_2d
    )

# Initialize Flask App
STATIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable Cross-Origin Resource Sharing for API consumers

# AI Tutor Environment Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

SYSTEM_PROMPT = """You are "Algebrify AI Tutor", an educational AI tutor specializing in Linear Algebra.
Your primary purpose is to help undergraduate/beginner students understand Linear Algebra clearly and correctly.
Always answer according to the user's ACTUAL question and the current conversation context.
Use standard LaTeX formatting: $...$ for inline math and $$...$$ for display math."""


# ==========================================================================
# 1. HEALTH & METRIC ENDPOINT
# ==========================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend operational status."""
    return jsonify({
        "status": "healthy",
        "service": "Algebrify Calculation Engine (Flask)",
        "version": "2.0.0"
    }), 200


# ==========================================================================
# 2. CALCULATOR / EXPRESSION EVALUATION
# ==========================================================================

@app.route("/api/calculator", methods=["POST"])
def api_calculator():
    """
    POST /api/calculator
    Payload: { "expression": "25 + 15 * sqrt(4)" }
    """
    data = request.get_json() or {}
    expression = data.get("expression", "")
    res = calculate_expression(expression)
    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 3. MATRIX CALCULATOR
# ==========================================================================

@app.route("/api/matrix", methods=["POST"])
def api_matrix():
    """
    POST /api/matrix
    Payload: {
        "operation": "add" | "subtract" | "multiply" | "scalar_multiply" |
                     "transpose" | "determinant" | "inverse" | "rank" | "trace",
        "matrixA": [[1, 2], [3, 4]],
        "matrixB": [[5, 6], [7, 8]] (optional),
        "scalar": 2 (optional)
    }
    """
    data = request.get_json() or {}
    op = data.get("operation", "")
    mat_a = data.get("matrixA", [])
    mat_b = data.get("matrixB", [])
    scalar = data.get("scalar", 1)

    if not mat_a and op not in ["clear"]:
        return jsonify({"success": False, "error": "Matrix A is required."}), 400

    if op == "add":
        res = matrix_add(mat_a, mat_b)
    elif op == "subtract":
        res = matrix_subtract(mat_a, mat_b)
    elif op == "multiply":
        res = matrix_multiply(mat_a, mat_b)
    elif op == "scalar_multiply":
        res = matrix_scalar_multiply(mat_a, scalar)
    elif op == "transpose":
        res = matrix_transpose(mat_a)
    elif op == "determinant":
        res = matrix_determinant(mat_a)
    elif op == "inverse":
        res = matrix_inverse(mat_a)
    elif op == "rank":
        res = matrix_rank(mat_a)
    elif op == "trace":
        res = matrix_trace(mat_a)
    else:
        return jsonify({"success": False, "error": f"Unknown matrix operation '{op}'."}), 400

    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 4. SYSTEM OF LINEAR EQUATIONS SOLVER
# ==========================================================================

@app.route("/api/equations", methods=["POST"])
def api_equations():
    """
    POST /api/equations
    Payload: {
        "augmentedMatrix": [
            [2, 1, 5],
            [1, -1, 1]
        ]
    }
    """
    data = request.get_json() or {}
    aug_mat = data.get("augmentedMatrix", [])
    if not aug_mat:
        return jsonify({"success": False, "error": "Augmented matrix is required."}), 400

    res = solve_linear_system(aug_mat)
    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 5. VECTOR CALCULATOR
# ==========================================================================

@app.route("/api/vectors", methods=["POST"])
def api_vectors():
    """
    POST /api/vectors
    Payload: {
        "operation": "add" | "subtract" | "dot" | "cross" | "magnitude" | "angle" | "unit",
        "u": [1, 2, 3],
        "v": [4, 5, 6] (optional)
    }
    """
    data = request.get_json() or {}
    op = data.get("operation", "")
    u = data.get("u", [])
    v = data.get("v", [])

    if not u:
        return jsonify({"success": False, "error": "Vector u is required."}), 400

    if op == "add":
        res = vector_add(u, v)
    elif op == "subtract":
        res = vector_subtract(u, v)
    elif op == "dot":
        res = vector_dot(u, v)
    elif op == "cross":
        res = vector_cross(u, v)
    elif op == "magnitude":
        res = vector_magnitude(u, v)
    elif op == "angle":
        res = vector_angle(u, v)
    elif op == "unit":
        res = vector_unit(u)
    else:
        return jsonify({"success": False, "error": f"Unknown vector operation '{op}'."}), 400

    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 6. EIGENVALUES & EIGENVECTORS
# ==========================================================================

@app.route("/api/eigen", methods=["POST"])
def api_eigen():
    """
    POST /api/eigen
    Payload: {
        "matrix": [[4, 1], [2, 3]]
    }
    """
    data = request.get_json() or {}
    mat = data.get("matrix", [])
    if not mat:
        return jsonify({"success": False, "error": "Matrix is required."}), 400

    if len(mat) == 2:
        res = solve_eigen_2x2(mat)
    elif len(mat) == 3:
        res = solve_eigen_3x3(mat)
    else:
        return jsonify({"success": False, "error": "Only 2x2 and 3x3 matrices are currently supported for Eigen analysis."}), 400

    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 7. FIELD ARITHMETIC (COMPLEX & GF(2))
# ==========================================================================

@app.route("/api/fields", methods=["POST"])
def api_fields():
    """
    POST /api/fields
    Payload for Complex: { "field": "complex", "operation": "add", "a1": 2, "b1": 3, "a2": 1, "b2": -4 }
    Payload for GF(2):   { "field": "gf2", "operation": "multiply", "x": 1, "y": 1 }
    """
    data = request.get_json() or {}
    field = data.get("field", "complex")
    op = data.get("operation", "add")

    if field == "gf2":
        x = data.get("x", 0)
        y = data.get("y", 0)
        if op == "add":
            res = gf2_add(x, y)
        elif op == "multiply":
            res = gf2_multiply(x, y)
        elif op == "inverse":
            res = gf2_inverse(x)
        else:
            return jsonify({"success": False, "error": f"Unknown GF(2) operation '{op}'."}), 400
    else:
        a1 = data.get("a1", 0)
        b1 = data.get("b1", 0)
        a2 = data.get("a2", 0)
        b2 = data.get("b2", 0)
        if op == "add":
            res = complex_add(a1, b1, a2, b2)
        elif op == "multiply":
            res = complex_multiply(a1, b1, a2, b2)
        elif op == "inverse":
            res = complex_inverse(a1, b1)
        else:
            return jsonify({"success": False, "error": f"Unknown complex operation '{op}'."}), 400

    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 8. VECTOR SPACES & BASIS CHECKER
# ==========================================================================

@app.route("/api/vector-spaces", methods=["POST"])
def api_vector_spaces():
    """
    POST /api/vector-spaces
    Payload: { "v1": [1, 0, 0], "v2": [0, 1, 0], "v3": [0, 0, 1] }
    """
    data = request.get_json() or {}
    v1 = data.get("v1", [])
    v2 = data.get("v2", [])
    v3 = data.get("v3", [])

    if len(v1) != 3 or len(v2) != 3 or len(v3) != 3:
        return jsonify({"success": False, "error": "Three 3D vectors v1, v2, v3 are required."}), 400

    res = check_linear_independence(v1, v2, v3)
    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 9. LINEAR TRANSFORMATIONS & GRAM-SCHMIDT
# ==========================================================================

@app.route("/api/transformations", methods=["POST"])
def api_transformations():
    """
    POST /api/transformations
    Payload:
    1. 2D transform: { "type": "apply_2d", "matrixT": [[a, b], [c, d]], "vectorV": [vx, vy] }
    2. Change of Basis: { "type": "change_of_basis", "matrixP": [[p11, p12], [p21, p22]], "vectorX": [x1, x2] }
    3. Gram-Schmidt: { "type": "gram_schmidt", "v1": [v1x, v1y], "v2": [v2x, v2y] }
    """
    data = request.get_json() or {}
    t_type = data.get("type", "apply_2d")

    if t_type == "apply_2d":
        mat_t = data.get("matrixT", [])
        vec_v = data.get("vectorV", [])
        res = apply_2d_transformation(mat_t, vec_v)
    elif t_type == "change_of_basis":
        mat_p = data.get("matrixP", [])
        vec_x = data.get("vectorX", [])
        res = change_of_basis_2d(mat_p, vec_x)
    elif t_type == "gram_schmidt":
        v1 = data.get("v1", [])
        v2 = data.get("v2", [])
        res = gram_schmidt_2d(v1, v2)
    else:
        return jsonify({"success": False, "error": f"Unknown transformation type '{t_type}'."}), 400

    status_code = 200 if res.get("success") else 400
    return jsonify(res), status_code


# ==========================================================================
# 10. AI TUTOR PROXY ENDPOINT
# ==========================================================================

@app.route("/api/chat", methods=["POST"])
def api_chat():
    """
    POST /api/chat
    AI Tutor conversational proxy endpoint.
    """
    body = request.get_json() or {}
    messages = body.get("messages", [])
    user_api_key = body.get("apiKey", "")
    user_provider = body.get("provider", "auto")

    api_key = user_api_key or GEMINI_API_KEY or OPENAI_API_KEY or GROQ_API_KEY
    if not api_key:
        return jsonify({
            "error": "No AI API key configured on server or in request."
        }), 400

    try:
        if user_provider == "auto":
            if api_key.startswith("AIzaSy"):
                user_provider = "gemini"
            elif api_key.startswith("gsk_"):
                user_provider = "groq"
            else:
                user_provider = "gemini" if GEMINI_API_KEY else ("openai" if OPENAI_API_KEY else "gemini")

        if user_provider == "gemini":
            resp_text = call_gemini(messages, api_key)
        elif user_provider == "groq":
            resp_text = call_groq(messages, api_key)
        else:
            resp_text = call_openai(messages, api_key)

        return jsonify({"response": resp_text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def call_gemini(messages, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    contents = []
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "model"
        text = msg.get("text", "") or msg.get("content", "")
        if text:
            contents.append({"role": role, "parts": [{"text": text}]})

    while contents and contents[0]["role"] != "user":
        contents.pop(0)

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2500}
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"]


def call_openai(messages, api_key):
    url = "https://api.openai.com/v1/chat/completions"
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "assistant"
        text = msg.get("text", "") or msg.get("content", "")
        if text:
            api_messages.append({"role": role, "content": text})

    payload = {
        "model": "gpt-4o-mini",
        "messages": api_messages,
        "temperature": 0.7,
        "max_tokens": 2500
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"]


def call_groq(messages, api_key):
    url = "https://api.groq.com/openai/v1/chat/completions"
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "assistant"
        text = msg.get("text", "") or msg.get("content", "")
        if text:
            api_messages.append({"role": role, "content": text})

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": api_messages,
        "temperature": 0.7,
        "max_tokens": 2500
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"]


# ==========================================================================
# 11. STATIC FILE SERVING FOR LOCAL FULL-STACK DEVELOPMENT
# ==========================================================================

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """
    Serve static HTML, CSS, JS, and image assets seamlessly.
    """
    if path and os.path.exists(os.path.join(STATIC_FOLDER, path)):
        return send_from_directory(STATIC_FOLDER, path)
    return send_from_directory(STATIC_FOLDER, "index.html")


if __name__ == "__main__":
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    port = int(os.environ.get("PORT", 5000))
    print(f"Algebrify Flask Backend running on http://127.0.0.1:{port} (or http://localhost:{port})")
    app.run(host="0.0.0.0", port=port, debug=True)
