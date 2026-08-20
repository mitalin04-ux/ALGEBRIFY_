"""
ALGEBRIFY BACKEND - MATRIX ENGINE
Implements core matrix algebra: Addition, Subtraction, Multiplication,
Scalar Multiplication, Transpose, Determinant, Inverse, Rank, and Trace.
Includes detailed mathematical step-by-step explanations and LaTeX outputs.
"""

import numpy as np
import sympy as sp

try:
    from .utils import format_number, format_plain_number, matrix_to_latex
except (ImportError, ValueError):
    from utils import format_number, format_plain_number, matrix_to_latex


def matrix_add(matrix_a, matrix_b):
    """
    Compute Matrix Addition: C = A + B
    """
    A = np.array(matrix_a, dtype=float)
    B = np.array(matrix_b, dtype=float)

    if A.shape != B.shape:
        return {
            "success": False,
            "error": f"Addition requires identical dimensions. Matrix A is {A.shape[0]}×{A.shape[1]} but Matrix B is {B.shape[0]}×{B.shape[1]}."
        }

    C = A + B
    res_list = C.tolist()

    return {
        "success": True,
        "operation": "add",
        "result": res_list,
        "latex_a": matrix_to_latex(matrix_a),
        "latex_b": matrix_to_latex(matrix_b),
        "latex_result": matrix_to_latex(res_list),
        "explanation": "Add corresponding entries: $C_{ij} = A_{ij} + B_{ij}$."
    }


def matrix_subtract(matrix_a, matrix_b):
    """
    Compute Matrix Subtraction: C = A - B
    """
    A = np.array(matrix_a, dtype=float)
    B = np.array(matrix_b, dtype=float)

    if A.shape != B.shape:
        return {
            "success": False,
            "error": f"Subtraction requires identical dimensions. Matrix A is {A.shape[0]}×{A.shape[1]} but Matrix B is {B.shape[0]}×{B.shape[1]}."
        }

    C = A - B
    res_list = C.tolist()

    return {
        "success": True,
        "operation": "subtract",
        "result": res_list,
        "latex_a": matrix_to_latex(matrix_a),
        "latex_b": matrix_to_latex(matrix_b),
        "latex_result": matrix_to_latex(res_list),
        "explanation": "Subtract corresponding entries: $C_{ij} = A_{ij} - B_{ij}$."
    }


def matrix_multiply(matrix_a, matrix_b):
    """
    Compute Matrix Multiplication: C = A * B
    """
    A = np.array(matrix_a, dtype=float)
    B = np.array(matrix_b, dtype=float)

    rows_a, cols_a = A.shape
    rows_b, cols_b = B.shape

    if cols_a != rows_b:
        return {
            "success": False,
            "error": f"Matrix multiplication $A \\times B$ is only defined when columns of $A$ equal rows of $B$. Here, columns of $A$ = {cols_a} and rows of $B$ = {rows_b}."
        }

    C = np.matmul(A, B)
    res_list = C.tolist()

    # Generate step-by-step dot product breakdown
    steps = []
    for i in range(rows_a):
        for j in range(cols_b):
            terms = [f"({format_plain_number(A[i, k])} \\cdot {format_plain_number(B[k, j])})" for k in range(cols_a)]
            steps.append(f"$c_{{{i+1}{j+1}}} = {' + '.join(terms)} = {format_number(C[i, j])}$")

    return {
        "success": True,
        "operation": "multiply",
        "result": res_list,
        "latex_a": matrix_to_latex(matrix_a),
        "latex_b": matrix_to_latex(matrix_b),
        "latex_result": matrix_to_latex(res_list),
        "steps": steps,
        "explanation": "Compute the dot product of each row in $A$ with each column in $B$."
    }


def matrix_scalar_multiply(matrix_a, scalar_k):
    """
    Compute Scalar Multiplication: C = k * A
    """
    A = np.array(matrix_a, dtype=float)
    try:
        k = float(scalar_k)
    except (ValueError, TypeError):
        k = 1.0

    C = k * A
    res_list = C.tolist()

    return {
        "success": True,
        "operation": "scalar_multiply",
        "scalar": k,
        "result": res_list,
        "latex_a": matrix_to_latex(matrix_a),
        "latex_result": matrix_to_latex(res_list),
        "explanation": f"Multiply every entry of Matrix A by $k = {format_plain_number(k)}$."
    }


def matrix_transpose(matrix_a):
    """
    Compute Matrix Transpose: A^T
    """
    A = np.array(matrix_a, dtype=float)
    AT = A.T
    res_list = AT.tolist()

    return {
        "success": True,
        "operation": "transpose",
        "result": res_list,
        "latex_a": matrix_to_latex(matrix_a),
        "latex_result": matrix_to_latex(res_list),
        "explanation": "Swap rows and columns: $(A^T)_{ij} = A_{ji}$."
    }


def matrix_determinant(matrix_a):
    """
    Compute Matrix Determinant: det(A)
    """
    A = np.array(matrix_a, dtype=float)
    rows, cols = A.shape

    if rows != cols:
        return {
            "success": False,
            "error": f"Determinant is only defined for square matrices. Matrix A is {rows}×{cols}."
        }

    det_val = float(np.linalg.det(A))
    if abs(det_val) < 1e-9:
        det_val = 0.0

    vmatrix_rows = [" & ".join(format_plain_number(v) for v in row) for row in matrix_a]
    vmatrix_latex = f"\\begin{{vmatrix}} {' \\\\ '.join(vmatrix_rows)} \\end{{vmatrix}}"

    is_invertible = abs(det_val) > 1e-9
    interpretation = (
        f"✨ Non-zero determinant ($\\det(A) = {format_number(det_val)} \\neq 0$): Matrix $A$ is <strong>invertible (non-singular)</strong> and has full rank ({rows})."
        if is_invertible
        else f"⚠️ Zero determinant ($\\det(A) = 0$): Matrix $A$ is <strong>singular (non-invertible)</strong> with linearly dependent columns."
    )

    return {
        "success": True,
        "operation": "determinant",
        "determinant": det_val,
        "formatted_det": format_number(det_val),
        "vmatrix_latex": vmatrix_latex,
        "is_invertible": is_invertible,
        "interpretation": interpretation
    }


def matrix_inverse(matrix_a):
    """
    Compute Matrix Multiplicative Inverse: A^-1
    """
    A = np.array(matrix_a, dtype=float)
    rows, cols = A.shape

    if rows != cols:
        return {
            "success": False,
            "error": f"Inverse is only defined for square matrices. Matrix A is {rows}×{cols}."
        }

    det_val = float(np.linalg.det(A))
    if abs(det_val) < 1e-9:
        return {
            "success": False,
            "error": "Matrix is singular (det(A) = 0) and has no multiplicative inverse."
        }

    try:
        sp_mat = sp.Matrix(matrix_a)
        inv_mat = sp_mat.inv()
        inv_list = [[float(v.evalf()) for v in inv_mat.row(r)] for r in range(rows)]
        
        return {
            "success": True,
            "operation": "inverse",
            "determinant": det_val,
            "result": inv_list,
            "latex_a": matrix_to_latex(matrix_a),
            "latex_result": matrix_to_latex(inv_list),
            "explanation": f"Since $\\det(A) = {format_number(det_val)} \\neq 0$, the inverse satisfies $A \\cdot A^{{-1}} = I_{{{rows}}}$."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Could not invert matrix: {str(e)}"
        }


def matrix_rank(matrix_a):
    """
    Compute Matrix Rank: Rank(A)
    """
    A = np.array(matrix_a, dtype=float)
    rank_val = int(np.linalg.matrix_rank(A))
    rows, cols = A.shape

    is_full_rank = (rank_val == min(rows, cols))
    explanation = (
        f"Matrix $A$ has <strong>Full Rank</strong> ($\\text{{Rank}}(A) = {rank_val}$). All {rank_val} rows/columns are linearly independent."
        if is_full_rank
        else f"Matrix $A$ is <strong>Rank-Deficient</strong> ($\\text{{Rank}}(A) = {rank_val} < \\min({rows}, {cols})$). It contains linearly dependent rows/columns."
    )

    return {
        "success": True,
        "operation": "rank",
        "rank": rank_val,
        "rows": rows,
        "cols": cols,
        "is_full_rank": is_full_rank,
        "latex_a": matrix_to_latex(matrix_a),
        "explanation": explanation
    }


def matrix_trace(matrix_a):
    """
    Compute Matrix Trace: tr(A) = sum(A_ii)
    """
    A = np.array(matrix_a, dtype=float)
    rows, cols = A.shape

    if rows != cols:
        return {
            "success": False,
            "error": f"Trace is only defined for square matrices. Matrix A is {rows}×{cols}."
        }

    diag_vals = [A[i, i] for i in range(rows)]
    trace_val = float(sum(diag_vals))
    diag_terms = " + ".join(format_plain_number(v) for v in diag_vals)

    return {
        "success": True,
        "operation": "trace",
        "trace": trace_val,
        "formatted_trace": format_number(trace_val),
        "latex_a": matrix_to_latex(matrix_a),
        "diagonal_terms": diag_terms,
        "explanation": f"Sum of main diagonal elements: $\\text{{tr}}(A) = {diag_terms} = {format_number(trace_val)}$."
    }
