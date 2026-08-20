"""
ALGEBRIFY BACKEND - SYSTEM OF LINEAR EQUATIONS SOLVER
Implements step-by-step Gauss-Jordan elimination with partial pivoting.
Detects unique solutions, inconsistent systems (no solution), and
underdetermined systems (infinitely many solutions with free variables).
Generates detailed LaTeX row reduction steps for educational display.
"""

try:
    from .utils import format_number, format_plain_number
except (ImportError, ValueError):
    from utils import format_number, format_plain_number


def solve_linear_system(augmented_matrix):
    """
    Solve an n x (n+1) augmented matrix [A | b] using Gauss-Jordan Elimination.
    
    Args:
        augmented_matrix (list of list of float): The augmented matrix [A | b]
        
    Returns:
        dict: {
            "success": bool,
            "solution_type": "unique" | "inconsistent" | "infinite",
            "solution_vector": list of float (if unique),
            "solution_latex": str,
            "rank": int,
            "free_variables": int,
            "steps": list of str (LaTeX step descriptions),
            "rref_matrix": list of list of float,
            "rref_latex": str
        }
    """
    if not augmented_matrix or not isinstance(augmented_matrix, list):
        return {
            "success": False,
            "error": "Invalid augmented matrix input."
        }

    n = len(augmented_matrix)
    # Deep copy matrix
    matrix = [[float(val) for val in row] for row in augmented_matrix]

    def format_augmented_latex(m):
        lines = []
        for r in m:
            coeff = " & ".join(format_number(v) for v in r[:n])
            lines.append(f"{coeff} & {format_number(r[n])}")
        col_align = "c" * n + "|c"
        return f"\\left[\\begin{{array}}{{{col_align}}} {' \\\\ '.join(lines)} \\end{{array}}\\right]"

    steps = []
    steps.append(f"<strong>Initial Augmented Matrix $[A \\mid \\mathbf{{b}}]$:</strong><div class=\"math-display\">\\[ {format_augmented_latex(matrix)} \\]</div>")

    lead = 0
    for r in range(n):
        if lead >= n:
            break
        i = r

        # Partial pivoting for numerical stability
        max_val = abs(matrix[i][lead])
        for k in range(r + 1, n):
            if abs(matrix[k][lead]) > max_val:
                max_val = abs(matrix[k][lead])
                i = k

        if max_val < 1e-9:
            lead += 1
            # Retry current row with next column
            continue

        if i != r:
            # Swap rows
            matrix[i], matrix[r] = matrix[r], matrix[i]
            steps.append(f"<strong>Step: Swap Rows</strong> $R_{{{r+1}}} \\longleftrightarrow R_{{{i+1}}}$:<div class=\"math-display\">\\[ {format_augmented_latex(matrix)} \\]</div>")

        pivot = matrix[r][lead]
        if abs(pivot - 1.0) > 1e-9 and abs(pivot) > 1e-9:
            # Scale pivot row to 1
            for j in range(n + 1):
                matrix[r][j] /= pivot
            steps.append(f"<strong>Step: Scale Pivot Row</strong> $R_{{{r+1}}} \\longleftarrow \\frac{{1}}{{{format_plain_number(pivot)}}} R_{{{r+1}}}$:<div class=\"math-display\">\\[ {format_augmented_latex(matrix)} \\]</div>")

        # Eliminate entries in all other rows for column lead
        for k in range(n):
            if k != r:
                factor = matrix[k][lead]
                if abs(factor) > 1e-9:
                    for j in range(n + 1):
                        matrix[k][j] -= factor * matrix[r][j]
                    sign_str = f"- {format_plain_number(factor)}" if factor > 0 else f"+ {format_plain_number(abs(factor))}"
                    steps.append(f"<strong>Step: Eliminate Entry in Row {k+1}</strong> $R_{{{k+1}}} \\longleftarrow R_{{{k+1}}} {sign_str} R_{{{r+1}}}$:<div class=\"math-display\">\\[ {format_augmented_latex(matrix)} \\]</div>")

        lead += 1

    # Zero out floating point residues
    for r in range(n):
        for c in range(n + 1):
            if abs(matrix[r][c]) < 1e-9:
                matrix[r][c] = 0.0

    rref_latex = format_augmented_latex(matrix)
    steps.append(f"<strong>Final Reduced Row Echelon Form (RREF):</strong><div class=\"math-display\">\\[ {rref_latex} \\]</div>")

    # Check for Inconsistency (Row of form [0 0 ... 0 | c] where c != 0)
    inconsistent = False
    false_row_idx = -1
    for r in range(n):
        all_zero_coeffs = all(abs(matrix[r][c]) < 1e-9 for c in range(n))
        if all_zero_coeffs and abs(matrix[r][n]) > 1e-9:
            inconsistent = True
            false_row_idx = r
            break

    if inconsistent:
        return {
            "success": True,
            "solution_type": "inconsistent",
            "message": f"Inconsistent System (No Solution): Row {false_row_idx + 1} reduces to the contradiction $0 = {format_plain_number(matrix[false_row_idx][n])}$, which is mathematically impossible. The planes/lines have no common intersection.",
            "steps": steps,
            "rref_matrix": matrix,
            "rref_latex": rref_latex
        }

    # Calculate Rank of coefficient matrix
    rank = 0
    for r in range(n):
        if not all(abs(matrix[r][c]) < 1e-9 for c in range(n)):
            rank += 1

    if rank < n:
        free_vars = n - rank
        return {
            "success": True,
            "solution_type": "infinite",
            "rank": rank,
            "free_variables": free_vars,
            "message": f"Infinitely Many Solutions: The system is consistent with $\\text{{Rank}}(A) = {rank} < n = {n}$. There are {free_vars} free variable(s) (parameters).",
            "steps": steps,
            "rref_matrix": matrix,
            "rref_latex": rref_latex
        }

    # Unique Solution
    var_symbols = ["x", "y", "z", "w", "v", "u"]
    sol_breakdown = ", \\quad ".join(
        f"{var_symbols[i] if i < len(var_symbols) else f'x_{i+1}'} = {format_number(matrix[i][n])}"
        for i in range(n)
    )
    sol_vector = [matrix[i][n] for i in range(n)]
    sol_vector_entries = " \\\\ ".join(format_number(v) for v in sol_vector)
    sol_vector_latex = f"\\mathbf{{x}} = \\begin{{bmatrix}} {sol_vector_entries} \\end{{bmatrix}}"

    return {
        "success": True,
        "solution_type": "unique",
        "solution_vector": sol_vector,
        "solution_latex": f"\\[ {sol_vector_latex} \\implies {sol_breakdown} \\]",
        "rank": rank,
        "free_variables": 0,
        "steps": steps,
        "rref_matrix": matrix,
        "rref_latex": rref_latex
    }
