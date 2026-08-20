"""
ALGEBRIFY BACKEND - EIGENVALUES & EIGENVECTORS ENGINE
Computes characteristic polynomials, real and complex eigenvalues,
eigenvectors, and matrix diagonalization (A = P D P^-1).
"""

import math
import numpy as np
import sympy as sp
from .utils import format_number, format_plain_number, matrix_to_latex, vector_to_latex


def solve_eigen_2x2(matrix_2x2):
    """
    Solve eigenvalues and eigenvectors for a 2x2 matrix with full algebraic steps.
    """
    A = np.array(matrix_2x2, dtype=float)
    a, b = A[0, 0], A[0, 1]
    c, d = A[1, 0], A[1, 1]

    trace = a + d
    det = a * d - b * c
    discriminant = trace * trace - 4 * det

    char_poly_latex = f"\\[ \\det(A - \\lambda I) = \\lambda^2 - ({format_plain_number(trace)})\\lambda + ({format_plain_number(det)}) = 0 \\]"

    # Complex Conjugate Eigenvalues
    if discriminant < -1e-9:
        real_part = trace / 2.0
        imag_part = math.sqrt(-discriminant) / 2.0
        scaling = math.sqrt(abs(det))

        return {
            "success": True,
            "is_complex": True,
            "char_poly_latex": char_poly_latex,
            "real_part": real_part,
            "imag_part": imag_part,
            "scaling_factor": scaling,
            "formatted_real": format_number(real_part),
            "formatted_imag": format_number(imag_part),
            "formatted_scaling": format_number(scaling),
            "display_math": f"\\[ \\lambda_1 = {format_number(real_part)} + {format_number(imag_part)}i, \\quad \\lambda_2 = {format_number(real_part)} - {format_number(imag_part)}i \\]"
        }

    # Real Eigenvalues
    sqrt_disc = math.sqrt(max(0.0, discriminant))
    lambda1 = (trace + sqrt_disc) / 2.0
    lambda2 = (trace - sqrt_disc) / 2.0

    def find_eigenvector_2x2(lam):
        m11 = a - lam
        m12 = b
        if abs(m12) > 1e-7:
            vec = [-m12, m11]
        elif abs(c) > 1e-7:
            vec = [d - lam, -c]
        else:
            vec = [1.0, 0.0]
        # Normalize simple scalar
        norm = math.sqrt(vec[0]**2 + vec[1]**2)
        if norm > 1e-7:
            return [vec[0] / norm, vec[1] / norm]
        return vec

    v1 = find_eigenvector_2x2(lambda1)
    v2 = find_eigenvector_2x2(lambda2)

    # Diagonalization Matrices
    P = [[v1[0], v2[0]], [v1[1], v2[1]]]
    D = [[lambda1, 0.0], [0.0, lambda2]]

    is_diagonalizable = bool(abs(lambda1 - lambda2) > 1e-6 or (abs(b) < 1e-7 and abs(c) < 1e-7))

    return {
        "success": True,
        "is_complex": False,
        "char_poly_latex": char_poly_latex,
        "lambda1": float(lambda1),
        "lambda2": float(lambda2),
        "formatted_lambda1": format_number(lambda1),
        "formatted_lambda2": format_number(lambda2),
        "v1": [float(x) for x in v1],
        "v2": [float(x) for x in v2],
        "latex_v1": vector_to_latex(v1),
        "latex_v2": vector_to_latex(v2),
        "matrix_p": [[float(val) for val in row] for row in P],
        "matrix_d": [[float(val) for val in row] for row in D],
        "latex_p": matrix_to_latex(P),
        "latex_d": matrix_to_latex(D),
        "is_diagonalizable": is_diagonalizable
    }


def solve_eigen_3x3(matrix_3x3):
    """
    Solve eigenvalues and trace/determinant properties for a 3x3 matrix using NumPy/SymPy.
    """
    A = np.array(matrix_3x3, dtype=float)
    trace = float(np.trace(A))
    det = float(np.linalg.det(A))

    eigenvalues, eigenvectors = np.linalg.eig(A)

    eigen_list = []
    for i in range(3):
        val = eigenvalues[i]
        vec = eigenvectors[:, i]
        eigen_list.append({
            "value": float(val.real) if abs(val.imag) < 1e-9 else complex(val),
            "formatted_value": format_number(val.real) if abs(val.imag) < 1e-9 else f"{format_number(val.real)} + {format_number(val.imag)}i",
            "vector": [float(x.real) for x in vec],
            "latex_vector": vector_to_latex([float(x.real) for x in vec])
        })

    return {
        "success": True,
        "dim": 3,
        "trace": trace,
        "determinant": det,
        "formatted_trace": format_number(trace),
        "formatted_det": format_number(det),
        "eigenvalues": eigen_list
    }
