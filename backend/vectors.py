"""
ALGEBRIFY BACKEND - VECTOR ALGEBRA ENGINE
Implements geometric and algebraic vector operations in R^2 and R^3:
Addition, Subtraction, Dot Product, Cross Product, Magnitude,
Angle between vectors, and Unit Vector Normalization.
"""

import math
import numpy as np
from .utils import format_number, format_plain_number, vector_to_latex


def vector_add(u, v):
    """
    Compute Vector Addition: u + v
    """
    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    if len(u_arr) != len(v_arr):
        return {
            "success": False,
            "error": f"Vectors must have the same dimension ({len(u_arr)} vs {len(v_arr)})."
        }

    res = u_arr + v_arr
    res_list = res.tolist()

    return {
        "success": True,
        "operation": "add",
        "result": res_list,
        "latex_u": vector_to_latex(u),
        "latex_v": vector_to_latex(v),
        "latex_result": vector_to_latex(res_list),
        "display_math": f"\\[ \\mathbf{{u}} + \\mathbf{{v}} = {vector_to_latex(u)} + {vector_to_latex(v)} = {vector_to_latex(res_list)} \\]"
    }


def vector_subtract(u, v):
    """
    Compute Vector Subtraction: u - v
    """
    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    if len(u_arr) != len(v_arr):
        return {
            "success": False,
            "error": f"Vectors must have the same dimension ({len(u_arr)} vs {len(v_arr)})."
        }

    res = u_arr - v_arr
    res_list = res.tolist()

    return {
        "success": True,
        "operation": "subtract",
        "result": res_list,
        "latex_u": vector_to_latex(u),
        "latex_v": vector_to_latex(v),
        "latex_result": vector_to_latex(res_list),
        "display_math": f"\\[ \\mathbf{{u}} - \\mathbf{{v}} = {vector_to_latex(u)} - {vector_to_latex(v)} = {vector_to_latex(res_list)} \\]"
    }


def vector_dot(u, v):
    """
    Compute Dot Product: u . v with geometric angle interpretation
    """
    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    if len(u_arr) != len(v_arr):
        return {
            "success": False,
            "error": "Vectors must have identical dimensions."
        }

    dot_val = float(np.dot(u_arr, v_arr))
    terms = [f"({format_plain_number(u_arr[i])} \\cdot {format_plain_number(v_arr[i])})" for i in range(len(u_arr))]

    is_orthogonal = abs(dot_val) < 1e-6
    if is_orthogonal:
        analysis = "✨ The dot product is <strong>0</strong>: The vectors $\\mathbf{u}$ and $\\mathbf{v}$ are <strong>orthogonal (perpendicular, $90^\\circ$)</strong>."
    elif dot_val > 0:
        analysis = f"The dot product is positive (${format_number(dot_val)} > 0$): The angle between them is <strong>acute ($< 90^\\circ$)</strong>."
    else:
        analysis = f"The dot product is negative (${format_number(dot_val)} < 0$): The angle between them is <strong>obtuse ($> 90^\\circ$)</strong>."

    return {
        "success": True,
        "operation": "dot",
        "dot_product": dot_val,
        "formatted_dot": format_number(dot_val),
        "terms": " + ".join(terms),
        "is_orthogonal": is_orthogonal,
        "analysis": analysis,
        "display_math": f"\\[ \\mathbf{{u}} \\cdot \\mathbf{{v}} = {' + '.join(terms)} = {format_number(dot_val)} \\]"
    }


def vector_cross(u, v):
    """
    Compute Cross Product: u x v (Only defined in R^3)
    """
    if len(u) != 3 or len(v) != 3:
        return {
            "success": False,
            "error": "Cross product is only defined in 3-dimensional space (R³)."
        }

    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    cross_arr = np.cross(u_arr, v_arr)
    cross_list = cross_arr.tolist()
    area = float(np.linalg.norm(cross_arr))

    return {
        "success": True,
        "operation": "cross",
        "result": cross_list,
        "latex_u": vector_to_latex(u),
        "latex_v": vector_to_latex(v),
        "latex_result": vector_to_latex(cross_list),
        "parallelogram_area": area,
        "formatted_area": format_number(area),
        "display_math": f"\\[ \\mathbf{{u}} \\times \\mathbf{{v}} = \\begin{{vmatrix}} \\mathbf{{i}} & \\mathbf{{j}} & \\mathbf{{k}} \\\\ {u[0]} & {u[1]} & {u[2]} \\\\ {v[0]} & {v[1]} & {v[2]} \\end{{vmatrix}} = {vector_to_latex(cross_list)} \\]"
    }


def vector_magnitude(u, v):
    """
    Compute vector Euclidean Norms: ||u|| and ||v||
    """
    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    mag_u = float(np.linalg.norm(u_arr))
    mag_v = float(np.linalg.norm(v_arr))

    u_terms = " + ".join(f"({format_plain_number(x)})^2" for x in u)
    v_terms = " + ".join(f"({format_plain_number(x)})^2" for x in v)

    return {
        "success": True,
        "operation": "magnitude",
        "magnitude_u": mag_u,
        "magnitude_v": mag_v,
        "formatted_u": format_number(mag_u),
        "formatted_v": format_number(mag_v),
        "display_math_u": f"\\[ \\|\\mathbf{{u}}\\| = \\sqrt{{{u_terms}}} = {format_number(mag_u)} \\]",
        "display_math_v": f"\\[ \\|\\mathbf{{v}}\\| = \\sqrt{{{v_terms}}} = {format_number(mag_v)} \\]"
    }


def vector_angle(u, v):
    """
    Compute angle theta between vectors u and v using cos(theta) = (u . v) / (||u|| * ||v||)
    """
    u_arr = np.array(u, dtype=float)
    v_arr = np.array(v, dtype=float)

    mag_u = float(np.linalg.norm(u_arr))
    mag_v = float(np.linalg.norm(v_arr))

    if mag_u < 1e-7 or mag_v < 1e-7:
        return {
            "success": False,
            "error": "Cannot compute angle with a zero vector (magnitude = 0)."
        }

    dot_val = float(np.dot(u_arr, v_arr))
    cos_theta = max(-1.0, min(1.0, dot_val / (mag_u * mag_v)))
    rad = math.acos(cos_theta)
    deg = math.degrees(rad)

    return {
        "success": True,
        "operation": "angle",
        "cos_theta": cos_theta,
        "angle_radians": rad,
        "angle_degrees": deg,
        "formatted_deg": format_number(deg),
        "formatted_rad": format_number(rad),
        "display_math": f"\\[ \\cos\\theta = \\frac{{\\mathbf{{u}} \\cdot \\mathbf{{v}}}}{{\\|\\mathbf{{u}}\\|\\|\\mathbf{{v}}\\|}} = \\frac{{{format_number(dot_val)}}}{{{format_number(mag_u)} \\cdot {format_number(mag_v)}}} = {format_number(cos_theta)} \\]"
    }


def vector_unit(u):
    """
    Compute Unit Vector: u_hat = u / ||u||
    """
    u_arr = np.array(u, dtype=float)
    mag_u = float(np.linalg.norm(u_arr))

    if mag_u < 1e-7:
        return {
            "success": False,
            "error": "The zero vector has no defined unit vector (magnitude = 0)."
        }

    unit_arr = u_arr / mag_u
    unit_list = unit_arr.tolist()

    return {
        "success": True,
        "operation": "unit",
        "magnitude": mag_u,
        "result": unit_list,
        "latex_result": vector_to_latex(unit_list),
        "display_math": f"\\[ \\hat{{\\mathbf{{u}}}} = \\frac{{\\mathbf{{u}}}}{{\\|\\mathbf{{u}}\\|}} = {vector_to_latex(unit_list)} \\]"
    }
