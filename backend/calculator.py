"""
ALGEBRIFY BACKEND - SAFE ARITHMETIC & EXPRESSION CALCULATOR
Evaluates algebraic and numerical expressions safely using SymPy.
Handles addition, subtraction, multiplication, division, powers,
square roots, fractions, and trigonometric functions without unsafe eval().
"""

import sympy as sp

try:
    from .utils import format_number
except (ImportError, ValueError):
    from utils import format_number


def calculate_expression(expression_str):
    """
    Safely evaluate a mathematical expression string using SymPy.
    
    Args:
        expression_str (str): Input string e.g. "25 + 15 * sqrt(4)" or "(3/4)^2"
        
    Returns:
        dict: {
            "success": bool,
            "result": float/str,
            "latex": str,
            "error": str (optional)
        }
    """
    if not expression_str or not isinstance(expression_str, str):
        return {
            "success": False,
            "error": "Empty or invalid mathematical expression."
        }

    cleaned = expression_str.strip()
    # Normalize common operators
    cleaned = cleaned.replace("×", "*").replace("÷", "/").replace("^", "**")

    try:
        # Define allowed transformations and symbols for safety
        transformations = sp.parsing.sympy_parser.standard_transformations + (
            sp.parsing.sympy_parser.implicit_multiplication_application,
        )
        
        # Parse expression securely with SymPy
        parsed_expr = sp.parse_expr(
            cleaned,
            transformations=transformations,
            evaluate=True
        )

        # Compute numerical value
        numerical_val = float(parsed_expr.evalf())
        latex_str = sp.latex(parsed_expr)

        return {
            "success": True,
            "result": numerical_val,
            "formatted_result": format_number(numerical_val),
            "latex": latex_str
        }

    except ZeroDivisionError:
        return {
            "success": False,
            "error": "Division by zero is undefined."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Invalid mathematical expression: {str(e)}"
        }
