"""
ALGEBRIFY BACKEND - FIELD ARITHMETIC ENGINE
Implements algebraic field arithmetic over the Complex Field (C)
and the Finite Galois Field GF(2) (Binary field with characteristic 2).
"""

import math
from .utils import format_number, format_plain_number


def format_complex_str(a, b, tolerance=1e-6):
    """
    Format a complex number (a + bi) cleanly.
    """
    if abs(a) < tolerance and abs(b) < tolerance:
        return "0"
    if abs(b) < tolerance:
        return format_number(a)
    if abs(a) < tolerance:
        if abs(b - 1) < tolerance:
            return "i"
        if abs(b + 1) < tolerance:
            return "-i"
        return f"{format_number(b)}i"

    a_str = format_number(a)
    if b > 0:
        b_str = "i" if abs(b - 1) < tolerance else f"{format_number(b)}i"
        return f"{a_str} + {b_str}"
    else:
        b_str = "i" if abs(b + 1) < tolerance else f"{format_number(abs(b))}i"
        return f"{a_str} - {b_str}"


def complex_add(a1, b1, a2, b2):
    """
    Complex Addition: (a1 + b1*i) + (a2 + b2*i)
    """
    real = a1 + a2
    imag = b1 + b2
    z1_str = f"({format_complex_str(a1, b1)})"
    z2_str = f"({format_complex_str(a2, b2)})"
    res_str = format_complex_str(real, imag)

    return {
        "success": True,
        "field": "complex",
        "operation": "add",
        "real": real,
        "imag": imag,
        "z1_str": z1_str,
        "z2_str": z2_str,
        "result_str": res_str,
        "display_math": f"\\[ z_1 + z_2 = {z1_str} + {z2_str} = {res_str} \\]",
        "explanation": f"Add real and imaginary parts separately: $({format_plain_number(a1)} + {format_plain_number(a2)}) + ({format_plain_number(b1)} + {format_plain_number(b2)})i = {res_str}$."
    }


def complex_multiply(a1, b1, a2, b2):
    """
    Complex Multiplication: (a1 + b1*i) * (a2 + b2*i)
    """
    real = a1 * a2 - b1 * b2
    imag = a1 * b2 + b1 * a2
    z1_str = f"({format_complex_str(a1, b1)})"
    z2_str = f"({format_complex_str(a2, b2)})"
    res_str = format_complex_str(real, imag)

    return {
        "success": True,
        "field": "complex",
        "operation": "multiply",
        "real": real,
        "imag": imag,
        "z1_str": z1_str,
        "z2_str": z2_str,
        "result_str": res_str,
        "display_math": f"\\[ z_1 \\cdot z_2 = {z1_str} \\cdot {z2_str} = {res_str} \\]",
        "explanation": f"Use distributive expansion with $i^2 = -1$: $(ac - bd) + (ad + bc)i = {res_str}$."
    }


def complex_inverse(a1, b1):
    """
    Complex Multiplicative Inverse: z1^-1 = conj(z1) / |z1|^2
    """
    denom = a1 * a1 + b1 * b1
    if abs(denom) < 1e-9:
        return {
            "success": False,
            "error": "The additive identity z1 = 0 has no multiplicative inverse in C (division by zero is undefined)."
        }

    inv_real = a1 / denom
    inv_imag = -b1 / denom
    z1_str = format_complex_str(a1, b1)
    res_str = format_complex_str(inv_real, inv_imag)

    return {
        "success": True,
        "field": "complex",
        "operation": "inverse",
        "inv_real": inv_real,
        "inv_imag": inv_imag,
        "modulus_sq": denom,
        "z1_str": z1_str,
        "result_str": res_str,
        "display_math": f"\\[ z_1^{{-1}} = \\frac{{\\bar{{z}}_1}}{{|z_1|^2}} = \\frac{{{format_plain_number(a1)} - ({format_plain_number(b1)})i}}{{{format_plain_number(a1)}^2 + ({format_plain_number(b1)})^2}} = {res_str} \\]",
        "explanation": f"Modulus squared $|z_1|^2 = a^2 + b^2 = {format_number(denom)}$. Verification: $z_1 \\cdot z_1^{{-1}} = 1$."
    }


def gf2_add(x, y):
    """
    Galois Field GF(2) Addition (XOR): x (+) y
    """
    x = int(x) % 2
    y = int(y) % 2
    res = (x + y) % 2

    return {
        "success": True,
        "field": "gf2",
        "operation": "add",
        "x": x,
        "y": y,
        "result": res,
        "display_math": f"\\[ x \\oplus y = {x} + {y} \\equiv {res} \\pmod{{2}} \\]",
        "explanation": "In GF(2), addition is modulo 2 arithmetic (XOR): 1 + 1 = 0, so every element is its own additive inverse."
    }


def gf2_multiply(x, y):
    """
    Galois Field GF(2) Multiplication (AND): x * y
    """
    x = int(x) % 2
    y = int(y) % 2
    res = (x * y) % 2

    return {
        "success": True,
        "field": "gf2",
        "operation": "multiply",
        "x": x,
        "y": y,
        "result": res,
        "display_math": f"\\[ x \\cdot y = {x} \\cdot {y} \\equiv {res} \\pmod{{2}} \\]",
        "explanation": "In GF(2), multiplication is standard binary modulo 2 (AND): 1 is identity, 0 is absorbing."
    }


def gf2_inverse(x):
    """
    Galois Field GF(2) Multiplicative Inverse: x^-1
    """
    x = int(x) % 2
    if x == 0:
        return {
            "success": False,
            "error": "The additive identity 0 has no multiplicative inverse in GF(2) (division by zero is undefined)."
        }

    return {
        "success": True,
        "field": "gf2",
        "operation": "inverse",
        "x": 1,
        "result": 1,
        "display_math": "\\[ x^{-1} = 1^{-1} = 1 \\quad (\\text{since } 1 \\cdot 1 = 1) \\]",
        "explanation": "The non-zero element 1 is its own multiplicative inverse in GF(2)."
    }
