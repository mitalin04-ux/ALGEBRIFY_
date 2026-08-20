"""
ALGEBRIFY BACKEND - VECTOR SPACES & BASIS ENGINE
Tests linear independence and spanning sets for vectors in R^3.
Computes matrix rank, determinant, and classifies the spanned geometric subspace.
"""

import numpy as np
from .utils import format_number, format_plain_number, matrix_to_latex


def check_linear_independence(v1, v2, v3):
    """
    Check if vectors v1, v2, v3 form a basis for R^3.
    Constructs matrix A = [v1 | v2 | v3] and evaluates rank and determinant.
    """
    v1_arr = [float(x) for x in v1]
    v2_arr = [float(x) for x in v2]
    v3_arr = [float(x) for x in v3]

    # Form column matrix A = [v1 | v2 | v3]
    matrix = [
        [v1_arr[0], v2_arr[0], v3_arr[0]],
        [v1_arr[1], v2_arr[1], v3_arr[1]],
        [v1_arr[2], v2_arr[2], v3_arr[2]]
    ]

    A = np.array(matrix, dtype=float)
    det_val = float(np.linalg.det(A))
    rank_val = int(np.linalg.matrix_rank(A))

    if abs(det_val) < 1e-7:
        det_val = 0.0

    is_independent = (abs(det_val) > 1e-7) and (rank_val == 3)

    if rank_val == 3:
        span_description = "Entire 3-dimensional space $\\mathbb{R}^3$ (Volume > 0)."
    elif rank_val == 2:
        span_description = "A <strong>2D plane</strong> passing through the origin in $\\mathbb{R}^3$."
    elif rank_val == 1:
        span_description = "A <strong>1D line</strong> passing through the origin in $\\mathbb{R}^3$."
    else:
        span_description = "The trivial subspace $\\{\\mathbf{0}\\}$ (Point at the origin)."

    matrix_latex = matrix_to_latex(matrix)

    return {
        "success": True,
        "is_independent": is_independent,
        "is_basis": is_independent,
        "determinant": det_val,
        "formatted_det": format_number(det_val),
        "rank": rank_val,
        "matrix": matrix,
        "matrix_latex": matrix_latex,
        "spanned_subspace_desc": span_description,
        "dimension": rank_val
    }
