"""
ALGEBRIFY BACKEND - MATHEMATICAL UTILITIES
Helper functions for formatting numbers, converting to exact fractions,
and generating clean LaTeX expressions for frontend rendering.
"""

from fractions import Fraction
import math


def format_number(val, tolerance=1e-6):
    """
    Format a floating point number into a clean string.
    - If it is close to an integer, return the integer string (e.g. '3', '-2').
    - If it represents a simple rational number, return LaTeX fraction '\\frac{num}{denom}'.
    - Otherwise, return cleanly rounded decimal string (e.g. '3.1416').
    """
    if val is None:
        return "Undefined"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return "Undefined"

    if math.isnan(val) or math.isinf(val):
        return "Undefined"

    if abs(val) < tolerance:
        return "0"

    # Close to integer
    if abs(val - round(val)) < tolerance:
        return str(int(round(val)))

    # Try finding exact rational representation
    try:
        frac = Fraction(val).limit_denominator(100)
        if abs(float(frac) - val) < tolerance:
            if frac.denominator == 1:
                return str(frac.numerator)
            if frac.numerator < 0:
                return f"-\\frac{{{abs(frac.numerator)}}}{{{frac.denominator}}}"
            return f"\\frac{{{frac.numerator}}}{{{frac.denominator}}}"
    except Exception:
        pass

    # Decimal fallback
    rounded = round(val, 4)
    if rounded == int(rounded):
        return str(int(rounded))
    return str(rounded)


def format_plain_number(val, tolerance=1e-6):
    """
    Format a number without LaTeX wrapping for display in formulas or inputs.
    """
    if val is None:
        return "0"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return "0"

    if math.isnan(val) or math.isinf(val):
        return "0"

    if abs(val) < tolerance:
        return "0"

    if abs(val - round(val)) < tolerance:
        return str(int(round(val)))

    return str(round(val, 4))


def matrix_to_latex(matrix):
    """
    Convert a 2D Python list/matrix into a LaTeX bmatrix string:
    \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}
    """
    if not matrix or len(matrix) == 0:
        return "\\begin{bmatrix}\\end{bmatrix}"

    rows = []
    for row in matrix:
        formatted_row = " & ".join(format_number(v) for v in row)
        rows.append(formatted_row)

    return f"\\begin{{bmatrix}} {' \\\\ '.join(rows)} \\end{{bmatrix}}"


def vector_to_latex(vector):
    """
    Convert a 1D Python list/vector into a column LaTeX bmatrix:
    \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix}
    """
    if not vector:
        return "\\begin{bmatrix}\\end{bmatrix}"
    formatted_entries = " \\\\ ".join(format_number(v) for v in vector)
    return f"\\begin{{bmatrix}} {formatted_entries} \\end{{bmatrix}}"
