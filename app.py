import os
import sys
from backend.app import app

if __name__ == "__main__":
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    port = int(os.environ.get("PORT", 5000))
    print(f"Algebrify Flask Server running on http://127.0.0.1:{port} (or http://localhost:{port})")
    app.run(host="0.0.0.0", port=port, debug=True)
