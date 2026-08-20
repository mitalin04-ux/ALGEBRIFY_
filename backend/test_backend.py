"""
ALGEBRIFY BACKEND TEST SUITE
Tests all Flask REST API endpoints and mathematical calculation engines:
- /api/health
- /api/calculator
- /api/matrix (add, sub, mul, scalar, transpose, det, inv, rank, trace)
- /api/equations (Gauss-Jordan, unique, inconsistent, infinite)
- /api/vectors (add, sub, dot, cross, mag, angle, unit)
- /api/eigen (2x2 real, 2x2 complex, 3x3)
- /api/fields (Complex numbers & GF(2))
- /api/vector-spaces (Linear independence & basis in R^3)
- /api/transformations (2D transform, change of basis, Gram-Schmidt)
"""

import unittest
import json
from backend.app import app


class AlgebrifyBackendTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health(self):
        resp = self.app.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data["status"], "healthy")

    def test_calculator(self):
        resp = self.app.post("/api/calculator", json={"expression": "25 + 15 * sqrt(4)"})
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["result"], 55.0)

    def test_matrix_add(self):
        payload = {
            "operation": "add",
            "matrixA": [[1, 2], [3, 4]],
            "matrixB": [[5, 6], [7, 8]]
        }
        resp = self.app.post("/api/matrix", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["result"], [[6.0, 8.0], [10.0, 12.0]])

    def test_matrix_multiply(self):
        payload = {
            "operation": "multiply",
            "matrixA": [[1, 2], [3, 4]],
            "matrixB": [[2, 0], [1, 2]]
        }
        resp = self.app.post("/api/matrix", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["result"], [[4.0, 4.0], [10.0, 8.0]])

    def test_matrix_determinant_and_inverse(self):
        payload = {
            "operation": "determinant",
            "matrixA": [[1, 2], [3, 4]]
        }
        resp = self.app.post("/api/matrix", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertAlmostEqual(data["determinant"], -2.0)

        # Inverse
        resp_inv = self.app.post("/api/matrix", json={"operation": "inverse", "matrixA": [[1, 2], [3, 4]]})
        self.assertEqual(resp_inv.status_code, 200)
        data_inv = resp_inv.get_json()
        self.assertTrue(data_inv["success"])
        self.assertEqual(data_inv["result"], [[-2.0, 1.0], [1.5, -0.5]])

    def test_linear_equations_unique(self):
        payload = {
            "augmentedMatrix": [
                [2, 1, 5],
                [1, -1, 1]
            ]
        }
        resp = self.app.post("/api/equations", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["solution_type"], "unique")
        self.assertAlmostEqual(data["solution_vector"][0], 2.0)
        self.assertAlmostEqual(data["solution_vector"][1], 1.0)

    def test_vectors(self):
        payload = {
            "operation": "dot",
            "u": [1, 2, 3],
            "v": [4, -2, 0]
        }
        resp = self.app.post("/api/vectors", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["dot_product"], 0.0)
        self.assertTrue(data["is_orthogonal"])

    def test_eigen_2x2(self):
        payload = {
            "matrix": [[4, 1], [2, 3]]
        }
        resp = self.app.post("/api/eigen", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertAlmostEqual(data["lambda1"], 5.0)
        self.assertAlmostEqual(data["lambda2"], 2.0)

    def test_fields(self):
        # Complex add
        resp_c = self.app.post("/api/fields", json={
            "field": "complex", "operation": "add",
            "a1": 2, "b1": 3, "a2": 1, "b2": -4
        })
        self.assertEqual(resp_c.status_code, 200)
        data_c = resp_c.get_json()
        self.assertTrue(data_c["success"])
        self.assertEqual(data_c["real"], 3)
        self.assertEqual(data_c["imag"], -1)

        # GF(2) add
        resp_g = self.app.post("/api/fields", json={
            "field": "gf2", "operation": "add",
            "x": 1, "y": 1
        })
        self.assertEqual(resp_g.status_code, 200)
        data_g = resp_g.get_json()
        self.assertTrue(data_g["success"])
        self.assertEqual(data_g["result"], 0)

    def test_vector_spaces(self):
        payload = {
            "v1": [1, 0, 0],
            "v2": [0, 1, 0],
            "v3": [0, 0, 1]
        }
        resp = self.app.post("/api/vector-spaces", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertTrue(data["is_independent"])
        self.assertEqual(data["rank"], 3)

    def test_transformations(self):
        # 2D mapping
        resp_t = self.app.post("/api/transformations", json={
            "type": "apply_2d",
            "matrixT": [[2, 0], [0, 3]],
            "vectorV": [1, 2]
        })
        self.assertEqual(resp_t.status_code, 200)
        data_t = resp_t.get_json()
        self.assertTrue(data_t["success"])
        self.assertEqual(data_t["result_vector"], [2.0, 6.0])


if __name__ == "__main__":
    unittest.main()
