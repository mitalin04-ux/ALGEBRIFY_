"""
ALGEBRIFY - ROOT FLASK LAUNCHER
Allows running: python app.py directly from root directory.
"""

import os
from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Algebrify Flask Server running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
