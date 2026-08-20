import urllib.request
import json

def test_endpoint(url, payload=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8') if payload else None,
        headers={'Content-Type': 'application/json'} if payload else {}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return resp.status, data

print("--- Testing Live Running Flask Server ---")

# 1. Health
s, d = test_endpoint('http://localhost:5000/api/health')
print(f"1. Health Check: Status {s} -> {d['status']}")

# 2. Matrix Add
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'add', 'matrixA': [[1, 2], [3, 4]], 'matrixB': [[5, 6], [7, 8]]})
print(f"2. Matrix Add: Status {s} -> Result: {d['result']}")

# 3. Matrix Subtract
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'subtract', 'matrixA': [[5, 6], [7, 8]], 'matrixB': [[1, 2], [3, 4]]})
print(f"3. Matrix Subtract: Status {s} -> Result: {d['result']}")

# 4. Matrix Multiply
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'multiply', 'matrixA': [[1, 2], [3, 4]], 'matrixB': [[2, 0], [1, 2]]})
print(f"4. Matrix Multiply: Status {s} -> Result: {d['result']}")

# 5. Matrix Scalar Multiply
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'scalar_multiply', 'matrixA': [[1, 2], [3, 4]], 'scalar': 3})
print(f"5. Matrix Scalar: Status {s} -> Result: {d['result']}")

# 6. Matrix Transpose
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'transpose', 'matrixA': [[1, 2, 3], [4, 5, 6]]})
print(f"6. Matrix Transpose: Status {s} -> Result: {d['result']}")

# 7. Matrix Determinant
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'determinant', 'matrixA': [[1, 2], [3, 4]]})
print(f"7. Matrix Determinant: Status {s} -> Result: {d['formatted_det']}")

# 8. Matrix Inverse
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'inverse', 'matrixA': [[1, 2], [3, 4]]})
print(f"8. Matrix Inverse: Status {s} -> Result: {d['result']}")

# 9. Matrix Rank
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'rank', 'matrixA': [[1, 2], [2, 4]]})
print(f"9. Matrix Rank: Status {s} -> Result: {d['rank']}")

# 10. Matrix Trace
s, d = test_endpoint('http://localhost:5000/api/matrix', {'operation': 'trace', 'matrixA': [[1, 2], [3, 4]]})
print(f"10. Matrix Trace: Status {s} -> Result: {d['formatted_trace']}")

print("\nAll live endpoints verified successfully!")
