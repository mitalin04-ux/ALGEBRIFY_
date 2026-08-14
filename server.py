"""
ALGEBRIFY - SECURE LOCAL SERVER & AI BACKEND PROXY
Serves static website files and provides a secure /api/chat endpoint
for dynamic AI Linear Algebra tutoring without exposing API keys in frontend code.
"""

import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8080))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

SYSTEM_PROMPT = """You are "Algebrify AI Tutor", an educational AI tutor specializing in Linear Algebra.
Your primary purpose is to help undergraduate/beginner students understand Linear Algebra clearly and correctly.

CORE RULE:
Always answer according to the user's ACTUAL question and the current conversation context.
Never return the same generic/predefined answer for different questions.

SCOPE:
Primarily answer questions related to:
• Algebra of Matrices (Order, Types, Equality, Operations, Transpose, Properties)
• Systems of Linear Equations (Gaussian & Gauss-Jordan Elimination, Echelon forms, Consistency)
• Fields (Field Axioms, Real ℝ, Complex ℂ, Galois Field GF(2))
• Vectors (Geometric & Algebraic vectors, Dot & Cross Products, Norm, Projections)
• Vector Spaces (Axioms, Subspaces, Span, Linear Independence, Basis & Dimension)
• Linear Transformations (Kernel, Image, Rank, Nullity, Rank-Nullity Theorem)
• Linear Transformations and Matrices (Matrix representation, Change of Basis, Similarity)
• Inner Product Spaces and Orthogonality (Inner products, Cauchy-Schwarz, Gram-Schmidt process)
• Determinants (Properties, 2x2 & 3x3 formulas, Cofactor expansion, Invertibility, Cramer's rule)
• Eigenvalues and Eigenvectors (Characteristic polynomial, Eigenspaces)
• Diagonalization (A = PDP⁻¹, Algebraic vs Geometric multiplicity)
• Closely related Linear Algebra concepts

If the user asks something outside Linear Algebra, politely explain that Algebrify AI Tutor is designed specifically for Linear Algebra and redirect them toward the relevant topic when appropriate.

TEACHING STYLE:
• Beginner-friendly and encouraging
• Clear, formal, and mathematically accurate
• Simple wording; explain terminology before using it
• Avoid unnecessarily advanced or convoluted language
• Do not sound robotic or mechanical
• Teach concepts rather than simply giving raw answers
• Use examples when they improve understanding
• Use standard LaTeX formatting: $...$ for inline math and $$...$$ for display math. Format matrices as \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}.

QUESTION HANDLING:
1. Definition Question:
   → Give the precise mathematical definition.
   → Explain it in simple, intuitive language.
   → Give a small illustrative example.

2. "Explain..." Question:
   → Explain the concept step-by-step.
   → Provide geometric/algebraic intuition and a clear example.

3. "Why..." Question:
   → Explain the reasoning/proof/geometric intuition behind the concept rather than just stating the result.

4. Comparison Question:
   → Clearly explain the difference between the concepts.
   → Use a comparison table or concrete example.

5. Numerical / Mathematical Problem:
   → Identify what is given.
   → Identify the relevant concept / method being used.
   → Solve step-by-step showing important calculations and intermediate arithmetic.
   → State the final answer clearly under "**Final Answer:**".
   → Do not provide only the final answer without steps.

6. Example Request:
   → Generate a fresh, relevant example based on the concept currently being discussed.

7. Confusion / Simplification ("I don't understand", "I still don't understand", "Explain again", "Make it simpler"):
   → Understand what was previously being discussed in the conversation.
   → Re-explain the SAME concept using simpler words, analogies, or alternative perspectives.
   → Do not start an unrelated explanation or repeat the identical text.

CONVERSATIONAL MEMORY:
Maintain context throughout the current chat session. Resolve pronouns like "it", "this matrix", "that theorem" based on earlier turns in the conversation.

ADAPTIVE RESPONSES:
The response length should match the question:
• Simple question → concise answer.
• Conceptual question → clear explanation + example.
• Mathematical problem → detailed step-by-step solution.
• Follow-up → concise contextual answer unless more explanation is requested."""


class AlgebrifyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_POST(self):
        if self.path == "/api/chat":
            self.handle_api_chat()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_api_chat(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode("utf-8"))
            messages = body.get("messages", [])
            user_api_key = body.get("apiKey", "")
            user_provider = body.get("provider", "auto")

            api_key = user_api_key or GEMINI_API_KEY or OPENAI_API_KEY or GROQ_API_KEY
            if not api_key:
                self.send_json_response(400, {
                    "error": "No AI API key configured on server or in request."
                })
                return

            response_text = self.query_ai_model(messages, api_key, user_provider)
            self.send_json_response(200, {"response": response_text})

        except Exception as e:
            self.send_json_response(500, {"error": str(e)})

    def query_ai_model(self, messages, api_key, provider="auto"):
        # Auto detect provider from key pattern
        if provider == "auto":
            if api_key.startswith("AIzaSy"):
                provider = "gemini"
            elif api_key.startswith("gsk_"):
                provider = "groq"
            else:
                provider = "gemini" if GEMINI_API_KEY else ("openai" if OPENAI_API_KEY else "gemini")

        if provider == "gemini":
            return self.call_gemini(messages, api_key)
        elif provider == "groq":
            return self.call_groq(messages, api_key)
        else:
            return self.call_openai(messages, api_key)

    def call_gemini(self, messages, api_key):
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
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 2500
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def call_openai(self, messages, api_key):
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

    def call_groq(self, messages, api_key):
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

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))


def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, AlgebrifyHandler)
    print(f"Algebrify server running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()


if __name__ == "__main__":
    run()
