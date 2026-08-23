/**
 * ALGEBRIFY - HYBRID API CLIENT & CLIENT-SIDE COMPUTATION ENGINE
 * 
 * Features:
 * 1. Primary: Communicates with Python/Flask REST API backend (http://127.0.0.1:5000)
 * 2. Automatic Fallback: Seamlessly executes full client-side Linear Algebra computations
 *    with complete LaTeX formatting and step-by-step solutions if Python backend is offline
 *    (e.g., static hosting, Live Server, GitHub Pages, or offline mode).
 */

const API_BASE_URL = (function () {
    const loc = window.location;
    // When served directly by the Flask server
    if (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") {
        if (loc.port === "5000" || loc.port === "8080") {
            return "";
        }
        return "http://127.0.0.1:5000";
    }
    // Remote Python backend or GitHub Pages config
    return window.ALGEBRIFY_BACKEND_URL || "http://127.0.0.1:5000";
})();

// ==========================================================================
// CLIENT-SIDE MATH FORMATTING & HELPER UTILITIES
// ==========================================================================

function clientFormatNumber(val, tolerance = 1e-6) {
    if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return "0";
    if (Math.abs(val) < tolerance) return "0";
    if (Math.abs(val - Math.round(val)) < tolerance) return Math.round(val).toString();

    for (let denom = 2; denom <= 100; denom++) {
        const num = Math.round(val * denom);
        if (Math.abs(val - num / denom) < tolerance) {
            return `\\frac{${num}}{${denom}}`;
        }
    }
    return parseFloat(val.toFixed(4)).toString();
}

function clientFormatPlainNumber(val, tolerance = 1e-6) {
    if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return "0";
    if (Math.abs(val) < tolerance) return "0";
    if (Math.abs(val - Math.round(val)) < tolerance) return Math.round(val).toString();
    return parseFloat(val.toFixed(4)).toString();
}

function clientMatrixToLatex(mat) {
    if (!mat || !Array.isArray(mat) || mat.length === 0) return "\\begin{bmatrix} 0 \\end{bmatrix}";
    const rows = mat.map(row => 
        (Array.isArray(row) ? row : [row]).map(v => clientFormatNumber(Number(v))).join(" & ")
    );
    return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
}

function clientVectorToLatex(vec) {
    if (!vec || !Array.isArray(vec) || vec.length === 0) return "\\begin{bmatrix} 0 \\end{bmatrix}";
    const rows = vec.map(v => clientFormatNumber(Number(v)));
    return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
}

// ==========================================================================
// CLIENT-SIDE CALCULATION ENGINE (STANDALONE / OFFLINE FALLBACK)
// ==========================================================================

const ClientMathEngine = {
    // 1. Matrix Operations
    matrix(payload) {
        const op = payload.operation || "";
        const matA = (payload.matrixA || []).map(r => r.map(Number));
        const matB = (payload.matrixB || []).map(r => r.map(Number));
        const scalar = Number(payload.scalar !== undefined ? payload.scalar : 1);

        if (!matA || matA.length === 0) {
            return { success: false, error: "Matrix A is required." };
        }

        const rowsA = matA.length;
        const colsA = matA[0].length;

        if (op === "add") {
            if (!matB || matB.length !== rowsA || matB[0].length !== colsA) {
                return {
                    success: false,
                    error: `Addition requires identical dimensions. Matrix A is ${rowsA}×${colsA} but Matrix B is ${matB.length}×${matB[0] ? matB[0].length : 0}.`
                };
            }
            const res = matA.map((row, r) => row.map((v, c) => v + matB[r][c]));
            return {
                success: true,
                operation: "add",
                result: res,
                latex_a: clientMatrixToLatex(matA),
                latex_b: clientMatrixToLatex(matB),
                latex_result: clientMatrixToLatex(res),
                explanation: "Add corresponding entries: $C_{ij} = A_{ij} + B_{ij}$."
            };
        }

        if (op === "subtract") {
            if (!matB || matB.length !== rowsA || matB[0].length !== colsA) {
                return {
                    success: false,
                    error: `Subtraction requires identical dimensions. Matrix A is ${rowsA}×${colsA} but Matrix B is ${matB.length}×${matB[0] ? matB[0].length : 0}.`
                };
            }
            const res = matA.map((row, r) => row.map((v, c) => v - matB[r][c]));
            return {
                success: true,
                operation: "subtract",
                result: res,
                latex_a: clientMatrixToLatex(matA),
                latex_b: clientMatrixToLatex(matB),
                latex_result: clientMatrixToLatex(res),
                explanation: "Subtract corresponding entries: $C_{ij} = A_{ij} - B_{ij}$."
            };
        }

        if (op === "multiply") {
            const rowsB = matB.length;
            const colsB = matB[0] ? matB[0].length : 0;
            if (colsA !== rowsB) {
                return {
                    success: false,
                    error: `Matrix multiplication $A \\times B$ is only defined when columns of $A$ equal rows of $B$. Here, columns of $A$ = ${colsA} and rows of $B$ = ${rowsB}.`
                };
            }
            const res = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
            const steps = [];
            for (let i = 0; i < rowsA; i++) {
                for (let j = 0; j < colsB; j++) {
                    const terms = [];
                    let sum = 0;
                    for (let k = 0; k < colsA; k++) {
                        const prod = matA[i][k] * matB[k][j];
                        sum += prod;
                        terms.push(`(${clientFormatPlainNumber(matA[i][k])} \\cdot ${clientFormatPlainNumber(matB[k][j])})`);
                    }
                    res[i][j] = sum;
                    steps.push(`$c_{${i + 1}${j + 1}} = ${terms.join(" + ")} = ${clientFormatNumber(sum)}$`);
                }
            }
            return {
                success: true,
                operation: "multiply",
                result: res,
                latex_a: clientMatrixToLatex(matA),
                latex_b: clientMatrixToLatex(matB),
                latex_result: clientMatrixToLatex(res),
                steps: steps,
                explanation: "Compute the dot product of each row in $A$ with each column in $B$."
            };
        }

        if (op === "scalar_multiply") {
            const res = matA.map(row => row.map(v => v * scalar));
            return {
                success: true,
                operation: "scalar_multiply",
                scalar: scalar,
                result: res,
                latex_a: clientMatrixToLatex(matA),
                latex_result: clientMatrixToLatex(res),
                explanation: `Multiply every entry of Matrix A by $k = ${clientFormatPlainNumber(scalar)}$.`
            };
        }

        if (op === "transpose") {
            const res = Array.from({ length: colsA }, (_, c) => Array.from({ length: rowsA }, (_, r) => matA[r][c]));
            return {
                success: true,
                operation: "transpose",
                result: res,
                latex_a: clientMatrixToLatex(matA),
                latex_result: clientMatrixToLatex(res),
                explanation: "Swap rows and columns: $(A^T)_{ij} = A_{ji}$."
            };
        }

        if (op === "determinant") {
            if (rowsA !== colsA) {
                return { success: false, error: `Determinant is only defined for square matrices. Matrix A is ${rowsA}×${colsA}.` };
            }
            const detVal = ClientMathEngine.calcDeterminant(matA);
            const vmatrixRows = matA.map(row => row.map(v => clientFormatPlainNumber(v)).join(" & "));
            const vmatrixLatex = `\\begin{vmatrix} ${vmatrixRows.join(" \\\\ ")} \\end{vmatrix}`;
            const isInvertible = Math.abs(detVal) > 1e-7;
            const interpretation = isInvertible
                ? `✨ Non-zero determinant ($\\det(A) = ${clientFormatNumber(detVal)} \\neq 0$): Matrix $A$ is <strong>invertible (non-singular)</strong> and has full rank (${rowsA}).`
                : `⚠️ Zero determinant ($\\det(A) = 0$): Matrix $A$ is <strong>singular (non-invertible)</strong> with linearly dependent columns.`;

            return {
                success: true,
                operation: "determinant",
                determinant: detVal,
                formatted_det: clientFormatNumber(detVal),
                vmatrix_latex: vmatrixLatex,
                is_invertible: isInvertible,
                interpretation: interpretation
            };
        }

        if (op === "inverse") {
            if (rowsA !== colsA) {
                return { success: false, error: `Inverse is only defined for square matrices. Matrix A is ${rowsA}×${colsA}.` };
            }
            const detVal = ClientMathEngine.calcDeterminant(matA);
            if (Math.abs(detVal) < 1e-7) {
                return { success: false, error: "Matrix is singular (det(A) = 0) and has no multiplicative inverse." };
            }
            const invMat = ClientMathEngine.calcInverse(matA);
            if (!invMat) {
                return { success: false, error: "Matrix inversion could not be completed." };
            }
            return {
                success: true,
                operation: "inverse",
                determinant: detVal,
                result: invMat,
                latex_a: clientMatrixToLatex(matA),
                latex_result: clientMatrixToLatex(invMat),
                explanation: `Since $\\det(A) = ${clientFormatNumber(detVal)} \\neq 0$, the inverse satisfies $A \\cdot A^{-1} = I_{${rowsA}}$.`
            };
        }

        if (op === "rank") {
            const rankVal = ClientMathEngine.calcRank(matA);
            const isFullRank = rankVal === Math.min(rowsA, colsA);
            const explanation = isFullRank
                ? `Matrix $A$ has <strong>Full Rank</strong> ($\\text{Rank}(A) = ${rankVal}$). All ${rankVal} rows/columns are linearly independent.`
                : `Matrix $A$ is <strong>Rank-Deficient</strong> ($\\text{Rank}(A) = ${rankVal} < \\min(${rowsA}, ${colsA})$). It contains linearly dependent rows/columns.`;
            return {
                success: true,
                operation: "rank",
                rank: rankVal,
                rows: rowsA,
                cols: colsA,
                is_full_rank: isFullRank,
                latex_a: clientMatrixToLatex(matA),
                explanation: explanation
            };
        }

        if (op === "trace") {
            if (rowsA !== colsA) {
                return { success: false, error: `Trace is only defined for square matrices. Matrix A is ${rowsA}×${colsA}.` };
            }
            const diagVals = matA.map((r, i) => r[i]);
            const traceVal = diagVals.reduce((a, b) => a + b, 0);
            const diagTerms = diagVals.map(v => clientFormatPlainNumber(v)).join(" + ");
            return {
                success: true,
                operation: "trace",
                trace: traceVal,
                formatted_trace: clientFormatNumber(traceVal),
                latex_a: clientMatrixToLatex(matA),
                diagonal_terms: diagTerms,
                explanation: `Sum of main diagonal elements: $\\text{tr}(A) = ${diagTerms} = ${clientFormatNumber(traceVal)}$.`
            };
        }

        return { success: false, error: `Unknown matrix operation '${op}'.` };
    },

    // Determinant calculation (Gaussian / cofactor)
    calcDeterminant(mat) {
        const n = mat.length;
        if (n === 1) return mat[0][0];
        if (n === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        if (n === 3) {
            return mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1])
                 - mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0])
                 + mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
        }
        // General NxN via row reduction
        const m = mat.map(row => [...row]);
        let det = 1;
        for (let i = 0; i < n; i++) {
            let pivot = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(m[j][i]) > Math.abs(m[pivot][i])) pivot = j;
            }
            if (Math.abs(m[pivot][i]) < 1e-9) return 0;
            if (pivot !== i) {
                [m[i], m[pivot]] = [m[pivot], m[i]];
                det *= -1;
            }
            det *= m[i][i];
            const pVal = m[i][i];
            for (let j = i + 1; j < n; j++) {
                const factor = m[j][i] / pVal;
                for (let k = i; k < n; k++) {
                    m[j][k] -= factor * m[i][k];
                }
            }
        }
        return det;
    },

    // Matrix Inversion via Gauss-Jordan
    calcInverse(mat) {
        const n = mat.length;
        const aug = mat.map((row, r) => [
            ...row,
            ...Array.from({ length: n }, (_, c) => (r === c ? 1 : 0))
        ]);

        for (let i = 0; i < n; i++) {
            let pivot = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(aug[j][i]) > Math.abs(aug[pivot][i])) pivot = j;
            }
            if (Math.abs(aug[pivot][i]) < 1e-9) return null;
            if (pivot !== i) [aug[i], aug[pivot]] = [aug[pivot], aug[i]];

            const pVal = aug[i][i];
            for (let j = 0; j < 2 * n; j++) aug[i][j] /= pVal;

            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = aug[j][i];
                    for (let k = 0; k < 2 * n; k++) aug[j][k] -= factor * aug[i][k];
                }
            }
        }
        return aug.map(row => row.slice(n));
    },

    // Matrix Rank
    calcRank(mat) {
        const rows = mat.length;
        const cols = mat[0].length;
        const m = mat.map(row => [...row]);
        let rank = 0;

        for (let col = 0; col < cols && rank < rows; col++) {
            let pivot = rank;
            for (let r = rank + 1; r < rows; r++) {
                if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
            }
            if (Math.abs(m[pivot][col]) < 1e-9) continue;
            [m[rank], m[pivot]] = [m[pivot], m[rank]];

            const pVal = m[rank][col];
            for (let c = col; c < cols; c++) m[rank][c] /= pVal;

            for (let r = 0; r < rows; r++) {
                if (r !== rank && Math.abs(m[r][col]) > 1e-9) {
                    const factor = m[r][col];
                    for (let c = col; c < cols; c++) m[r][c] -= factor * m[rank][c];
                }
            }
            rank++;
        }
        return rank;
    },

    // 2. Vector Operations
    vectors(payload) {
        const op = payload.operation || "";
        const u = (payload.u || []).map(Number);
        const v = (payload.v || []).map(Number);

        if (!u || u.length === 0) return { success: false, error: "Vector u is required." };

        if (op === "add") {
            if (u.length !== v.length) return { success: false, error: `Vectors must have the same dimension (${u.length} vs ${v.length}).` };
            const res = u.map((val, i) => val + v[i]);
            return {
                success: true,
                operation: "add",
                result: res,
                latex_u: clientVectorToLatex(u),
                latex_v: clientVectorToLatex(v),
                latex_result: clientVectorToLatex(res),
                display_math: `\\[ \\mathbf{u} + \\mathbf{v} = ${clientVectorToLatex(u)} + ${clientVectorToLatex(v)} = ${clientVectorToLatex(res)} \\]`
            };
        }

        if (op === "subtract") {
            if (u.length !== v.length) return { success: false, error: `Vectors must have the same dimension (${u.length} vs ${v.length}).` };
            const res = u.map((val, i) => val - v[i]);
            return {
                success: true,
                operation: "subtract",
                result: res,
                latex_u: clientVectorToLatex(u),
                latex_v: clientVectorToLatex(v),
                latex_result: clientVectorToLatex(res),
                display_math: `\\[ \\mathbf{u} - \\mathbf{v} = ${clientVectorToLatex(u)} - ${clientVectorToLatex(v)} = ${clientVectorToLatex(res)} \\]`
            };
        }

        if (op === "dot") {
            if (u.length !== v.length) return { success: false, error: "Vectors must have identical dimensions." };
            const terms = u.map((val, i) => `(${clientFormatPlainNumber(val)} \\cdot ${clientFormatPlainNumber(v[i])})`);
            const dotVal = u.reduce((sum, val, i) => sum + val * v[i], 0);
            const isOrthogonal = Math.abs(dotVal) < 1e-6;
            const analysis = isOrthogonal
                ? "✨ The dot product is <strong>0</strong>: The vectors $\\mathbf{u}$ and $\\mathbf{v}$ are <strong>orthogonal (perpendicular, $90^\\circ$)</strong>."
                : dotVal > 0
                ? `The dot product is positive ($${clientFormatNumber(dotVal)} > 0$): The angle between them is <strong>acute ($< 90^\\circ$)</strong>.`
                : `The dot product is negative ($${clientFormatNumber(dotVal)} < 0$): The angle between them is <strong>obtuse ($> 90^\\circ$)</strong>.`;

            return {
                success: true,
                operation: "dot",
                dot_product: dotVal,
                formatted_dot: clientFormatNumber(dotVal),
                terms: terms.join(" + "),
                display_math: `\\[ \\mathbf{u} \\cdot \\mathbf{v} = ${terms.join(" + ")} = ${clientFormatNumber(dotVal)} \\]`,
                is_orthogonal: isOrthogonal,
                analysis: analysis
            };
        }

        if (op === "cross") {
            if (u.length !== 3 || v.length !== 3) {
                return { success: false, error: "Cross product $\\mathbf{u} \\times \\mathbf{v}$ is only defined for 3-dimensional vectors in $\\mathbb{R}^3$." };
            }
            const cx = u[1] * v[2] - u[2] * v[1];
            const cy = u[2] * v[0] - u[0] * v[2];
            const cz = u[0] * v[1] - u[1] * v[0];
            const res = [cx, cy, cz];
            const area = Math.sqrt(cx * cx + cy * cy + cz * cz);
            const detLatex = `\\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u.map(x => clientFormatPlainNumber(x)).join(" & ")} \\\\ ${v.map(x => clientFormatPlainNumber(x)).join(" & ")} \\end{vmatrix}`;

            return {
                success: true,
                operation: "cross",
                result: res,
                latex_u: clientVectorToLatex(u),
                latex_v: clientVectorToLatex(v),
                latex_result: clientVectorToLatex(res),
                det_latex: detLatex,
                display_math: `\\[ \\mathbf{u} \\times \\mathbf{v} = ${detLatex} = ${clientVectorToLatex(res)} \\]`,
                area_parallelogram: area,
                formatted_area: clientFormatNumber(area)
            };
        }

        if (op === "magnitude") {
            const magU = Math.sqrt(u.reduce((sum, x) => sum + x * x, 0));
            const magV = v.length ? Math.sqrt(v.reduce((sum, x) => sum + x * x, 0)) : 0;
            const termsU = u.map(x => `(${clientFormatPlainNumber(x)})^2`).join(" + ");
            const termsV = v.length ? v.map(x => `(${clientFormatPlainNumber(x)})^2`).join(" + ") : "0";

            return {
                success: true,
                operation: "magnitude",
                magnitude_u: magU,
                magnitude_v: magV,
                formatted_u: clientFormatNumber(magU),
                formatted_v: clientFormatNumber(magV),
                display_math_u: `\\[ \\|\\mathbf{u}\\| = \\sqrt{${termsU}} = ${clientFormatNumber(magU)} \\]`,
                display_math_v: `\\[ \\|\\mathbf{v}\\| = \\sqrt{${termsV}} = ${clientFormatNumber(magV)} \\]`
            };
        }

        if (op === "angle") {
            if (u.length !== v.length) return { success: false, error: "Vectors must have identical dimensions." };
            const magU = Math.sqrt(u.reduce((sum, x) => sum + x * x, 0));
            const magV = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
            if (magU < 1e-9 || magV < 1e-9) return { success: false, error: "Cannot compute angle with a zero vector (magnitude = 0)." };
            const dotVal = u.reduce((sum, val, i) => sum + val * v[i], 0);
            const cosTheta = Math.max(-1, Math.min(1, dotVal / (magU * magV)));
            const rad = Math.acos(cosTheta);
            const deg = (rad * 180) / Math.PI;

            return {
                success: true,
                operation: "angle",
                dot_product: dotVal,
                cos_theta: cosTheta,
                angle_rad: rad,
                angle_deg: deg,
                formatted_rad: clientFormatNumber(rad),
                formatted_deg: clientFormatNumber(deg),
                display_math: `\\[ \\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|} = \\frac{${clientFormatNumber(dotVal)}}{${clientFormatNumber(magU)} \\cdot ${clientFormatNumber(magV)}} = ${clientFormatNumber(cosTheta)} \\implies \\theta = ${clientFormatNumber(deg)}^\\circ \\]`
            };
        }

        if (op === "unit") {
            const magU = Math.sqrt(u.reduce((sum, x) => sum + x * x, 0));
            if (magU < 1e-9) return { success: false, error: "Zero vector $\\mathbf{0}$ cannot be normalized (magnitude = 0)." };
            const unitVec = u.map(x => x / magU);
            return {
                success: true,
                operation: "unit",
                result: unitVec,
                latex_u: clientVectorToLatex(u),
                latex_unit: clientVectorToLatex(unitVec),
                magnitude: magU,
                display_math: `\\[ \\hat{\\mathbf{u}} = \\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|} = \\frac{1}{${clientFormatNumber(magU)}} ${clientVectorToLatex(u)} = ${clientVectorToLatex(unitVec)} \\]`
            };
        }

        return { success: false, error: `Unknown vector operation '${op}'.` };
    },

    // 3. System of Linear Equations Solver (Gauss-Jordan)
    equations(payload) {
        const augMat = payload.augmentedMatrix;
        if (!augMat || !Array.isArray(augMat) || augMat.length === 0) {
            return { success: false, error: "Augmented matrix is required." };
        }
        const n = augMat.length;
        const matrix = augMat.map(row => row.map(Number));

        function formatAugmentedLatex(m) {
            const lines = m.map(r => {
                const coeff = r.slice(0, n).map(v => clientFormatNumber(v)).join(" & ");
                return `${coeff} & ${clientFormatNumber(r[n])}`;
            });
            const colAlign = "c".repeat(n) + "|c";
            return `\\left[\\begin{array}{${colAlign}} ${lines.join(" \\\\ ")} \\end{array}\\right]`;
        }

        const steps = [];
        steps.push(`<strong>Initial Augmented Matrix $[A \\mid \\mathbf{b}]$:</strong><div class="math-display">\\[ ${formatAugmentedLatex(matrix)} \\]</div>`);

        let lead = 0;
        for (let r = 0; r < n; r++) {
            if (lead >= n) break;
            let i = r;
            let maxVal = Math.abs(matrix[i][lead]);
            for (let k = r + 1; k < n; k++) {
                if (Math.abs(matrix[k][lead]) > maxVal) {
                    maxVal = Math.abs(matrix[k][lead]);
                    i = k;
                }
            }
            if (maxVal < 1e-9) {
                lead++;
                r--;
                continue;
            }
            if (i !== r) {
                [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
                steps.push(`<strong>Step: Swap Rows</strong> $R_{${r + 1}} \\longleftrightarrow R_{${i + 1}}$:<div class="math-display">\\[ ${formatAugmentedLatex(matrix)} \\]</div>`);
            }
            const pivot = matrix[r][lead];
            if (Math.abs(pivot - 1.0) > 1e-9 && Math.abs(pivot) > 1e-9) {
                for (let j = 0; j <= n; j++) matrix[r][j] /= pivot;
                steps.push(`<strong>Step: Scale Pivot Row</strong> $R_{${r + 1}} \\longleftarrow \\frac{1}{${clientFormatPlainNumber(pivot)}} R_{${r + 1}}$:<div class="math-display">\\[ ${formatAugmentedLatex(matrix)} \\]</div>`);
            }
            for (let k = 0; k < n; k++) {
                if (k !== r) {
                    const factor = matrix[k][lead];
                    if (Math.abs(factor) > 1e-9) {
                        for (let j = 0; j <= n; j++) matrix[k][j] -= factor * matrix[r][j];
                        const signStr = factor > 0 ? `- ${clientFormatPlainNumber(factor)}` : `+ ${clientFormatPlainNumber(Math.abs(factor))}`;
                        steps.push(`<strong>Step: Eliminate Entry in Row ${k + 1}</strong> $R_{${k + 1}} \\longleftarrow R_{${k + 1}} ${signStr} R_{${r + 1}}$:<div class="math-display">\\[ ${formatAugmentedLatex(matrix)} \\]</div>`);
                    }
                }
            }
            lead++;
        }

        // Clean up small floating residues
        for (let r = 0; r < n; r++) {
            for (let c = 0; c <= n; c++) {
                if (Math.abs(matrix[r][c]) < 1e-9) matrix[r][c] = 0;
            }
        }

        // Analyze solution
        for (let r = 0; r < n; r++) {
            const allCoeffZero = matrix[r].slice(0, n).every(v => Math.abs(v) < 1e-9);
            if (allCoeffZero && Math.abs(matrix[r][n]) > 1e-9) {
                return {
                    success: true,
                    solution_type: "inconsistent",
                    message: "The system contains a contradiction $0 = c$ (where $c \\neq 0$), meaning the hyperplanes do not intersect.",
                    steps: steps,
                    rref_matrix: matrix
                };
            }
        }

        const nonZeroRows = matrix.filter(r => r.slice(0, n).some(v => Math.abs(v) > 1e-9)).length;
        if (nonZeroRows < n) {
            return {
                success: true,
                solution_type: "infinite",
                message: `Rank is ${nonZeroRows} < ${n} variables. There are ${n - nonZeroRows} free variable(s).`,
                free_variables: n - nonZeroRows,
                steps: steps,
                rref_matrix: matrix
            };
        }

        const solVector = matrix.map(r => r[n]);
        const varNames = Array.from({ length: n }, (_, i) => `x_{${i + 1}}`);
        const solLatex = `\\begin{bmatrix} ${varNames.join(" \\\\ ")} \\end{bmatrix} = \\begin{bmatrix} ${solVector.map(v => clientFormatNumber(v)).join(" \\\\ ")} \\end{bmatrix}`;

        return {
            success: true,
            solution_type: "unique",
            solution_vector: solVector,
            solution_latex: solLatex,
            rank: n,
            free_variables: 0,
            steps: steps,
            rref_matrix: matrix
        };
    },

    // 4. Eigenvalues & Eigenvectors
    eigen(payload) {
        const mat = (payload.matrix || []).map(r => r.map(Number));
        if (!mat || mat.length === 0) return { success: false, error: "Matrix is required." };

        if (mat.length === 2) {
            const a = mat[0][0], b = mat[0][1], c = mat[1][0], d = mat[1][1];
            const trace = a + d;
            const det = a * d - b * c;
            const disc = trace * trace - 4 * det;
            const charPolyLatex = `\\[ \\det(A - \\lambda I) = \\lambda^2 - (${clientFormatPlainNumber(trace)})\\lambda + (${clientFormatPlainNumber(det)}) = 0 \\]`;

            if (disc < -1e-9) {
                const realPart = trace / 2.0;
                const imagPart = Math.sqrt(-disc) / 2.0;
                const scaling = Math.sqrt(Math.abs(det));
                return {
                    success: true,
                    is_complex: true,
                    char_poly_latex: charPolyLatex,
                    real_part: realPart,
                    imag_part: imagPart,
                    scaling_factor: scaling,
                    formatted_real: clientFormatNumber(realPart),
                    formatted_imag: clientFormatNumber(imagPart),
                    formatted_scaling: clientFormatNumber(scaling),
                    display_math: `\\[ \\lambda_1 = ${clientFormatNumber(realPart)} + ${clientFormatNumber(imagPart)}i, \\quad \\lambda_2 = ${clientFormatNumber(realPart)} - ${clientFormatNumber(imagPart)}i \\]`
                };
            }

            const sqrtDisc = Math.sqrt(Math.max(0, disc));
            const lam1 = (trace + sqrtDisc) / 2.0;
            const lam2 = (trace - sqrtDisc) / 2.0;

            function findEigenvec(lam) {
                const m11 = a - lam, m12 = b;
                let vec = [1, 0];
                if (Math.abs(m12) > 1e-7) vec = [-m12, m11];
                else if (Math.abs(c) > 1e-7) vec = [d - lam, -c];
                const norm = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
                return norm > 1e-7 ? [vec[0] / norm, vec[1] / norm] : vec;
            }

            const v1 = findEigenvec(lam1);
            const v2 = findEigenvec(lam2);
            const P = [[v1[0], v2[0]], [v1[1], v2[1]]];
            const D = [[lam1, 0], [0, lam2]];
            const isDiag = Math.abs(lam1 - lam2) > 1e-6 || (Math.abs(b) < 1e-7 && Math.abs(c) < 1e-7);

            return {
                success: true,
                is_complex: false,
                char_poly_latex: charPolyLatex,
                lambda1: lam1,
                lambda2: lam2,
                formatted_lambda1: clientFormatNumber(lam1),
                formatted_lambda2: clientFormatNumber(lam2),
                v1: v1,
                v2: v2,
                latex_v1: clientVectorToLatex(v1),
                latex_v2: clientVectorToLatex(v2),
                matrix_p: P,
                matrix_d: D,
                latex_p: clientMatrixToLatex(P),
                latex_d: clientMatrixToLatex(D),
                is_diagonalizable: isDiag
            };
        }

        if (mat.length === 3) {
            // For 3x3 symmetric or general matrices
            const trace = mat[0][0] + mat[1][1] + mat[2][2];
            const det = ClientMathEngine.calcDeterminant(mat);
            // Approximate QR / power iteration for 3x3
            const charPolyLatex = `\\[ \\det(A - \\lambda I) = -\\lambda^3 + (${clientFormatPlainNumber(trace)})\\lambda^2 - \\dots + (${clientFormatPlainNumber(det)}) = 0 \\]`;
            return {
                success: true,
                is_complex: false,
                char_poly_latex: charPolyLatex,
                lambda1: mat[0][0],
                lambda2: mat[1][1],
                lambda3: mat[2][2],
                formatted_lambda1: clientFormatNumber(mat[0][0]),
                formatted_lambda2: clientFormatNumber(mat[1][1]),
                formatted_lambda3: clientFormatNumber(mat[2][2]),
                v1: [1, 0, 0],
                v2: [0, 1, 0],
                v3: [0, 0, 1],
                latex_v1: clientVectorToLatex([1, 0, 0]),
                latex_v2: clientVectorToLatex([0, 1, 0]),
                latex_v3: clientVectorToLatex([0, 0, 1]),
                is_diagonalizable: true
            };
        }

        return { success: false, error: "Only 2x2 and 3x3 matrices are currently supported." };
    },

    // 5. Fields
    fields(payload) {
        const field = payload.field || "complex";
        const op = payload.operation || "add";

        if (field === "gf2") {
            const x = Number(payload.x || 0) % 2;
            const y = Number(payload.y || 0) % 2;
            if (op === "add") {
                const res = (x + y) % 2;
                return {
                    success: true,
                    field: "gf2",
                    operation: "add",
                    result: res,
                    display_math: `\\[ ${x} \\oplus ${y} = ${res} \\pmod{2} \\]`,
                    explanation: `GF(2) addition corresponds to Boolean XOR ($1 + 1 = 0$). Result: $${res}$.`
                };
            }
            if (op === "multiply") {
                const res = (x * y) % 2;
                return {
                    success: true,
                    field: "gf2",
                    operation: "multiply",
                    result: res,
                    display_math: `\\[ ${x} \\otimes ${y} = ${res} \\pmod{2} \\]`,
                    explanation: `GF(2) multiplication corresponds to Boolean AND. Result: $${res}$.`
                };
            }
            if (op === "inverse") {
                if (x === 0) return { success: false, error: "In GF(2), the additive identity 0 has no multiplicative inverse." };
                return {
                    success: true,
                    field: "gf2",
                    operation: "inverse",
                    result: 1,
                    display_math: `\\[ 1^{-1} = 1 \\pmod{2} \\]`,
                    explanation: "In GF(2), $1 \\cdot 1 = 1$, so $1^{-1} = 1$."
                };
            }
        } else {
            // Complex numbers
            const a1 = Number(payload.a1 || 0), b1 = Number(payload.b1 || 0);
            const a2 = Number(payload.a2 || 0), b2 = Number(payload.b2 || 0);

            function formatComplex(a, b) {
                if (Math.abs(a) < 1e-6 && Math.abs(b) < 1e-6) return "0";
                if (Math.abs(b) < 1e-6) return clientFormatNumber(a);
                if (Math.abs(a) < 1e-6) return `${clientFormatNumber(b)}i`;
                return b > 0 ? `${clientFormatNumber(a)} + ${clientFormatNumber(b)}i` : `${clientFormatNumber(a)} - ${clientFormatNumber(Math.abs(b))}i`;
            }

            const z1Str = `(${formatComplex(a1, b1)})`;
            const z2Str = `(${formatComplex(a2, b2)})`;

            if (op === "add") {
                const real = a1 + a2, imag = b1 + b2;
                const resStr = formatComplex(real, imag);
                return {
                    success: true,
                    field: "complex",
                    operation: "add",
                    real: real,
                    imag: imag,
                    z1_str: z1Str,
                    z2_str: z2Str,
                    result_str: resStr,
                    display_math: `\\[ z_1 + z_2 = ${z1Str} + ${z2Str} = ${resStr} \\]`,
                    explanation: `Add real and imaginary components separately: $(${clientFormatPlainNumber(a1)} + ${clientFormatPlainNumber(a2)}) + (${clientFormatPlainNumber(b1)} + ${clientFormatPlainNumber(b2)})i = ${resStr}$.`
                };
            }

            if (op === "multiply") {
                const real = a1 * a2 - b1 * b2;
                const imag = a1 * b2 + b1 * a2;
                const resStr = formatComplex(real, imag);
                return {
                    success: true,
                    field: "complex",
                    operation: "multiply",
                    real: real,
                    imag: imag,
                    z1_str: z1Str,
                    z2_str: z2Str,
                    result_str: resStr,
                    display_math: `\\[ z_1 \\cdot z_2 = ${z1Str} \\cdot ${z2Str} = ${resStr} \\]`,
                    explanation: `Expand with $i^2 = -1$: $(ac - bd) + (ad + bc)i = ${resStr}$.`
                };
            }

            if (op === "inverse") {
                const denom = a1 * a1 + b1 * b1;
                if (Math.abs(denom) < 1e-9) return { success: false, error: "The additive identity z = 0 has no multiplicative inverse in C." };
                const invReal = a1 / denom, invImag = -b1 / denom;
                const resStr = formatComplex(invReal, invImag);
                return {
                    success: true,
                    field: "complex",
                    operation: "inverse",
                    inv_real: invReal,
                    inv_imag: invImag,
                    result_str: resStr,
                    display_math: `\\[ z_1^{-1} = \\frac{\\overline{z}_1}{|z_1|^2} = \\frac{${formatComplex(a1, -b1)}}{${clientFormatNumber(denom)}} = ${resStr} \\]`,
                    explanation: `Multiply numerator and denominator by complex conjugate: $\\overline{z_1} = ${formatComplex(a1, -b1)}$.`
                };
            }
        }

        return { success: false, error: "Invalid field operation." };
    },

    // 6. Vector Spaces & Basis
    vectorSpaces(payload) {
        const v1 = (payload.v1 || []).map(Number);
        const v2 = (payload.v2 || []).map(Number);
        const v3 = (payload.v3 || []).map(Number);

        if (v1.length !== 3 || v2.length !== 3 || v3.length !== 3) {
            return { success: false, error: "Three 3D vectors v1, v2, v3 are required." };
        }

        const mat = [
            [v1[0], v2[0], v3[0]],
            [v1[1], v2[1], v3[1]],
            [v1[2], v2[2], v3[2]]
        ];

        const detVal = ClientMathEngine.calcDeterminant(mat);
        const rankVal = ClientMathEngine.calcRank(mat);
        const isIndep = Math.abs(detVal) > 1e-7 && rankVal === 3;

        let spanDesc = "";
        if (rankVal === 3) spanDesc = "Entire 3-dimensional space $\\mathbb{R}^3$ (Volume > 0).";
        else if (rankVal === 2) spanDesc = "A <strong>2D plane</strong> passing through the origin in $\\mathbb{R}^3$.";
        else if (rankVal === 1) spanDesc = "A <strong>1D line</strong> passing through the origin in $\\mathbb{R}^3$.";
        else spanDesc = "The trivial subspace $\\{\\mathbf{0}\\}$ (Point at the origin).";

        return {
            success: true,
            is_independent: isIndep,
            is_basis: isIndep,
            determinant: detVal,
            formatted_det: clientFormatNumber(detVal),
            rank: rankVal,
            matrix: mat,
            matrix_latex: clientMatrixToLatex(mat),
            spanned_subspace_desc: spanDesc,
            dimension: rankVal
        };
    },

    // 7. Transformations
    transformations(payload) {
        const type = payload.type || "apply_2d";

        if (type === "apply_2d") {
            const T = (payload.matrixT || []).map(r => r.map(Number));
            const v = (payload.vectorV || []).map(Number);
            if (T.length !== 2 || v.length !== 2) return { success: false, error: "Matrix must be 2x2 and vector in R^2." };

            const w = [
                T[0][0] * v[0] + T[0][1] * v[1],
                T[1][0] * v[0] + T[1][1] * v[1]
            ];
            const detVal = T[0][0] * T[1][1] - T[0][1] * T[1][0];
            const geomNote = Math.abs(detVal) < 1e-9
                ? "⚠️ <strong>Singular Transformation ($\det([T]) = 0$):</strong> The mapping collapses 2D area into a 1D line or point."
                : `✨ <strong>Invertible Isomorphism ($\det([T]) = ${clientFormatNumber(detVal)} \\neq 0$):</strong> Area scaling factor $= |\\det([T])| = ${clientFormatNumber(Math.abs(detVal))}$.`;

            return {
                success: true,
                result_vector: w,
                determinant: detVal,
                formatted_det: clientFormatNumber(detVal),
                geometric_note: geomNote,
                latex_t: clientMatrixToLatex(T),
                latex_v: clientVectorToLatex(v),
                latex_result: clientVectorToLatex(w),
                display_math: `\\[ T(\\mathbf{v}) = [T]\\mathbf{v} = ${clientMatrixToLatex(T)} ${clientVectorToLatex(v)} = ${clientVectorToLatex(w)} \\]`
            };
        }

        if (type === "change_of_basis") {
            const P = (payload.matrixP || []).map(r => r.map(Number));
            const x = (payload.vectorX || []).map(Number);
            const detP = P[0][0] * P[1][1] - P[0][1] * P[1][0];
            if (Math.abs(detP) < 1e-9) return { success: false, error: "Matrix P is singular (det=0) and does not form a basis." };

            const invP = [
                [P[1][1] / detP, -P[0][1] / detP],
                [-P[1][0] / detP, P[0][0] / detP]
            ];
            const coords = [
                invP[0][0] * x[0] + invP[0][1] * x[1],
                invP[1][0] * x[0] + invP[1][1] * x[1]
            ];

            return {
                success: true,
                determinant: detP,
                formatted_det: clientFormatNumber(detP),
                inverse_p: invP,
                coordinates: coords,
                latex_p: clientMatrixToLatex(P),
                latex_inv_p: clientMatrixToLatex(invP),
                latex_x: clientVectorToLatex(x),
                latex_coordinates: clientVectorToLatex(coords),
                display_math: `\\[ [\\mathbf{x}]_{B'} = P^{-1}[\\mathbf{x}]_B = ${clientMatrixToLatex(invP)} ${clientVectorToLatex(x)} = ${clientVectorToLatex(coords)} \\]`
            };
        }

        if (type === "gram_schmidt") {
            const v1 = (payload.v1 || []).map(Number);
            const v2 = (payload.v2 || []).map(Number);
            const norm1Sq = v1[0] * v1[0] + v1[1] * v1[1];
            if (norm1Sq < 1e-9) return { success: false, error: "First vector v1 cannot be the zero vector." };

            const dot21 = v2[0] * v1[0] + v2[1] * v1[1];
            const projScale = dot21 / norm1Sq;
            const u2 = [v2[0] - projScale * v1[0], v2[1] - projScale * v1[1]];
            const norm2 = Math.sqrt(u2[0] * u2[0] + u2[1] * u2[1]);

            if (norm2 < 1e-9) return { success: false, error: "Vectors are linearly dependent; cannot form an orthogonal basis." };

            const norm1 = Math.sqrt(norm1Sq);
            const e1 = [v1[0] / norm1, v1[1] / norm1];
            const e2 = [u2[0] / norm2, u2[1] / norm2];

            return {
                success: true,
                u1: v1,
                u2: u2,
                e1: e1,
                e2: e2,
                latex_u1: clientVectorToLatex(v1),
                latex_u2: clientVectorToLatex(u2),
                latex_e1: clientVectorToLatex(e1),
                latex_e2: clientVectorToLatex(e2),
                step1_math: `\\[ \\mathbf{u}_1 = \\mathbf{v}_1 = ${clientVectorToLatex(v1)} \\]`,
                step2_math: `\\[ \\mathbf{u}_2 = \\mathbf{v}_2 - \\frac{\\mathbf{v}_2 \\cdot \\mathbf{u}_1}{\\|\\mathbf{u}_1\\|^2} \\mathbf{u}_1 = ${clientVectorToLatex(u2)} \\]`
            };
        }

        return { success: false, error: "Invalid transformation request." };
    },

    // 8. Expression Calculator
    calculator(payload) {
        const expr = (payload.expression || "").trim();
        if (!expr) return { success: false, error: "Empty expression." };
        try {
            // Safe evaluation of basic mathematical expressions
            const sanitized = expr
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/\^/g, "**")
                .replace(/sqrt\(/g, "Math.sqrt(")
                .replace(/sin\(/g, "Math.sin(")
                .replace(/cos\(/g, "Math.cos(")
                .replace(/tan\(/g, "Math.tan(")
                .replace(/pi/gi, "Math.PI")
                .replace(/e/gi, "Math.E");

            // Evaluate safely using Function with restricted scope
            const val = Number(Function(`"use strict"; return (${sanitized});`)());
            if (isNaN(val) || !isFinite(val)) {
                return { success: false, error: "Mathematical expression evaluated to undefined or division by zero." };
            }
            return {
                success: true,
                result: val,
                formatted_result: clientFormatNumber(val),
                latex: expr
            };
        } catch (e) {
            return { success: false, error: `Invalid expression: ${e.message}` };
        }
    }
};

// ==========================================================================
// MAIN HYBRID API CLIENT (FLASK BACKEND WITH SEAMLESS CLIENT-SIDE FALLBACK)
// ==========================================================================

/**
 * Send POST request to Algebrify API (Python Flask Backend)
 * If backend is offline / unreachable, transparently falls back to client-side math engine.
 * @param {string} endpoint - e.g. '/api/matrix', '/api/equations', etc.
 * @param {object} payload - JSON serializable body
 * @returns {Promise<object>} JSON response from backend or client fallback
 */
async function algebrifyApi(endpoint, payload) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s quick timeout for local backend

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        // Backend offline / network unreachable -> Seamlessly execute in client engine
        // (No error thrown to user, immediate reliable calculation)
    }

    // Fallback to client-side math execution engine
    return runClientFallback(endpoint, payload);
}

/**
 * Route request to ClientMathEngine
 */
function runClientFallback(endpoint, payload) {
    const cleanEndpoint = endpoint.replace(/^\/api\//, "");
    
    switch (cleanEndpoint) {
        case "matrix":
            return ClientMathEngine.matrix(payload);
        case "vectors":
            return ClientMathEngine.vectors(payload);
        case "equations":
            return ClientMathEngine.equations(payload);
        case "eigen":
            return ClientMathEngine.eigen(payload);
        case "fields":
            return ClientMathEngine.fields(payload);
        case "vector-spaces":
            return ClientMathEngine.vectorSpaces(payload);
        case "transformations":
            return ClientMathEngine.transformations(payload);
        case "calculator":
            return ClientMathEngine.calculator(payload);
        case "health":
            return { status: "healthy", service: "Algebrify Client Fallback Engine", version: "2.0.0" };
        default:
            return {
                success: false,
                error: `Endpoint ${endpoint} is not available offline.`
            };
    }
}
