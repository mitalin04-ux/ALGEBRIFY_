"""
ALGEBRIFY BACKEND - LINEAR TRANSFORMATIONS & INNER PRODUCTS
Implements 2D Linear Transformations, Change of Basis Coordinate Mapping,
and Gram-Schmidt Orthogonalization with step-by-step LaTeX construction.
"""

import math
import numpy as np
from .utils import format_number, format_plain_number, matrix_to_latex, vector_to_latex


def apply_2d_transformation(matrix_t, vector_v):
    """
    Apply a 2D linear transformation: w = [T] * v
    """
    T = np.array(matrix_t, dtype=float)
    v = np.array(vector_v, dtype=float)

    if T.shape != (2, 2) or len(v) != 2:
        return {
            "success": False,
            "error": "Transformation matrix must be 2x2 and vector must be in R^2."
        }

    w = np.matmul(T, v)
    w_list = w.tolist()
    det_val = float(np.linalg.det(T))

    a, b = T[0, 0], T[0, 1]
    c, d = T[1, 0], T[1, 1]
    vx, vy = v[0], v[1]

    if abs(det_val) < 1e-9:
        geometric_note = r"⚠️ <strong>Singular Transformation ($\det([T]) = 0$):</strong> The mapping collapses 2D area into a 1D line or point. $\text{Nullity}(T) \ge 1$, so $T$ is non-invertible."
    else:
        orientation = "Preserves orientation" if det_val > 0 else "Reverses orientation (Reflection component)"
        geometric_note = rf"✨ <strong>Invertible Isomorphism ($\det([T]) = {format_number(det_val)} \neq 0$):</strong> Area scaling factor $= |\det([T])| = {format_number(abs(det_val))}$. {orientation}."

    return {
        "success": True,
        "result_vector": w_list,
        "determinant": det_val,
        "formatted_det": format_number(det_val),
        "geometric_note": geometric_note,
        "latex_t": matrix_to_latex(matrix_t),
        "latex_v": vector_to_latex(vector_v),
        "latex_result": vector_to_latex(w_list),
        "step_top": f"Top entry: $({format_plain_number(a)} \\cdot {format_plain_number(vx)}) + ({format_plain_number(b)} \\cdot {format_plain_number(vy)}) = {format_number(w[0])}$",
        "step_bottom": f"Bottom entry: $({format_plain_number(c)} \\cdot {format_plain_number(vx)}) + ({format_plain_number(d)} \\cdot {format_plain_number(vy)}) = {format_number(w[1])}$",
        "display_math": f"\\[ T(\\mathbf{{v}}) = [T]\\mathbf{{v}} = {matrix_to_latex(matrix_t)} {vector_to_latex(vector_v)} = {vector_to_latex(w_list)} \\]"
    }


def change_of_basis_2d(matrix_p, vector_x):
    """
    Compute coordinate vector [x]_{B'} = P^-1 * [x]_B
    """
    P = np.array(matrix_p, dtype=float)
    x = np.array(vector_x, dtype=float)

    if P.shape != (2, 2) or len(x) != 2:
        return {
            "success": False,
            "error": "Transition matrix P must be 2x2 and vector x must be in R^2."
        }

    det_p = float(np.linalg.det(P))
    if abs(det_p) < 1e-9:
        return {
            "success": False,
            "error": f"The matrix P has det(P) = 0. The columns are linearly dependent and do not form a basis for R^2."
        }

    inv_p = np.linalg.inv(P)
    coords = np.matmul(inv_p, x)
    coords_list = coords.tolist()

    p11, p12 = P[0, 0], P[0, 1]
    p21, p22 = P[1, 0], P[1, 1]
    x1, x2 = x[0], x[1]
    c1, c2 = coords[0], coords[1]

    inv_p_list = inv_p.tolist()

    return {
        "success": True,
        "determinant": det_p,
        "formatted_det": format_number(det_p),
        "inverse_p": inv_p_list,
        "coordinates": coords_list,
        "latex_p": matrix_to_latex(matrix_p),
        "latex_inv_p": matrix_to_latex(inv_p_list),
        "latex_x": vector_to_latex(vector_x),
        "latex_coordinates": vector_to_latex(coords_list),
        "display_math": f"\\[ [\\mathbf{{x}}]_{{B'}} = P^{{-1}}[\\mathbf{{x}}]_B = {matrix_to_latex(inv_p_list)} {vector_to_latex(vector_x)} = {vector_to_latex(coords_list)} \\]",
        "verification_math": f"\\[ {format_number(c1)} \\begin{{bmatrix}} {format_plain_number(p11)} \\\\ {format_plain_number(p21)} \\end{{bmatrix}} + {format_number(c2)} \\begin{{bmatrix}} {format_plain_number(p12)} \\\\ {format_plain_number(p22)} \\end{{bmatrix}} = {vector_to_latex(vector_x)} = \\mathbf{{x}} \\]"
    }


def gram_schmidt_2d(v1, v2):
    """
    Perform Gram-Schmidt Orthogonalization on two 2D vectors v1 and v2.
    """
    v1_arr = np.array(v1, dtype=float)
    v2_arr = np.array(v2, dtype=float)

    norm_sq_v1 = float(np.dot(v1_arr, v1_arr))
    if norm_sq_v1 < 1e-9:
        return {
            "success": False,
            "error": "Vector v1 cannot be the zero vector."
        }

    det_val = v1_arr[0] * v2_arr[1] - v1_arr[1] * v2_arr[0]
    if abs(det_val) < 1e-9:
        return {
            "success": False,
            "error": "The vectors v1 and v2 are linearly dependent. Gram-Schmidt requires a linearly independent set."
        }

    # Step 1: w1 = v1
    w1 = v1_arr
    norm_w1 = math.sqrt(norm_sq_v1)
    u1 = w1 / norm_w1

    # Step 2: w2 = v2 - proj_{w1}(v2)
    dot_v2_w1 = float(np.dot(v2_arr, w1))
    proj_factor = dot_v2_w1 / norm_sq_v1
    proj_vec = proj_factor * w1
    w2 = v2_arr - proj_vec
    norm_w2 = float(np.linalg.norm(w2))
    u2 = w2 / norm_w2

    return {
        "success": True,
        "u1": u1.tolist(),
        "u2": u2.tolist(),
        "w1": w1.tolist(),
        "w2": w2.tolist(),
        "proj_vec": proj_vec.tolist(),
        "dot_v2_w1": dot_v2_w1,
        "norm_sq_v1": norm_sq_v1,
        "norm_w1": norm_w1,
        "norm_w2": norm_w2,
        "latex_u1": vector_to_latex(u1.tolist()),
        "latex_u2": vector_to_latex(u2.tolist()),
        "latex_w1": vector_to_latex(w1.tolist()),
        "latex_w2": vector_to_latex(w2.tolist()),
        "latex_proj": vector_to_latex(proj_vec.tolist())
    }
