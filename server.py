"""
ALGEBRIFY - UNIFIED LOCAL SERVER & BACKEND REST API
Serves static website files and all calculation & AI endpoints:
- Matrices (/api/matrix)
- Equations (/api/equations)
- Vectors (/api/vectors)
- Eigenvalues (/api/eigen)
- Fields (/api/fields)
- Vector Spaces (/api/vector-spaces)
- Transformations (/api/transformations)
- AI Tutor Proxy (/api/chat)
"""

import os
import sys

# Ensure backend package is on path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from backend.app import app
except ImportError:
    # Fallback to local import if run from within backend
    from app import app

if __name__ == "__main__":
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    port = int(os.environ.get("PORT", 5000))
    print(f"Algebrify Unified Server running on http://127.0.0.1:{port} (or http://localhost:{port})")
    app.run(host="0.0.0.0", port=port, debug=True)
