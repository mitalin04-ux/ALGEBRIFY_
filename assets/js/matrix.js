/**
 * ALGEBRIFY - DYNAMIC MATRIX CALCULATOR
 * Supports 1x1 up to 5x5 dynamic dimensions, presets, addition, subtraction,
 * scalar mult, matrix mult (with compatibility checks), transpose, determinant,
 * inverse, rank, trace, and step-by-step mathematical breakdown.
 */

// ==========================================================================
// FRACTION & NUMBER FORMATTING UTILS
// ==========================================================================

function formatNumber(val, tolerance = 1e-6) {
    if (isNaN(val) || !isFinite(val)) return "Undefined";
    if (Math.abs(val) < tolerance) return "0";

    // Check if close to integer
    if (Math.abs(val - Math.round(val)) < tolerance) {
        return Math.round(val).toString();
    }

    // Try finding a clean fraction for denominators up to 100
    for (let denom = 2; denom <= 100; denom++) {
        const num = Math.round(val * denom);
        if (Math.abs(val - num / denom) < tolerance) {
            return `\\frac{${num}}{${denom}}`;
        }
    }

    // Otherwise round to 4 decimals cleanly without trailing zeros
    const rounded = parseFloat(val.toFixed(4));
    return rounded.toString();
}

function formatPlainNumber(val, tolerance = 1e-6) {
    if (isNaN(val) || !isFinite(val)) return "Undefined";
    if (Math.abs(val) < tolerance) return "0";
    if (Math.abs(val - Math.round(val)) < tolerance) return Math.round(val).toString();
    return parseFloat(val.toFixed(4)).toString();
}

// ==========================================================================
// DYNAMIC MATRIX CALCULATOR CLASS
// ==========================================================================

class DynamicMatrixCalculator {
    constructor() {
        this.rowsA = 2;
        this.colsA = 2;
        this.rowsB = 2;
        this.colsB = 2;

        this.matrixAContainer = document.getElementById("matrix-a-grid");
        this.matrixBContainer = document.getElementById("matrix-b-grid");
        this.resultContainer = document.getElementById("matrix-calc-result");

        this.init();
    }

    init() {
        this.renderGrids();
        this.bindDimensionControls();
        this.bindOperationButtons();
        this.populateSampleValues();
    }

    bindDimensionControls() {
        const rowsASelect = document.getElementById("rows-a");
        const colsASelect = document.getElementById("cols-a");
        const rowsBSelect = document.getElementById("rows-b");
        const colsBSelect = document.getElementById("cols-b");

        if (rowsASelect && colsASelect) {
            rowsASelect.addEventListener("change", (e) => {
                this.rowsA = parseInt(e.target.value, 10);
                this.renderGridA();
            });
            colsASelect.addEventListener("change", (e) => {
                this.colsA = parseInt(e.target.value, 10);
                this.renderGridA();
            });
        }

        if (rowsBSelect && colsBSelect) {
            rowsBSelect.addEventListener("change", (e) => {
                this.rowsB = parseInt(e.target.value, 10);
                this.renderGridB();
            });
            colsBSelect.addEventListener("change", (e) => {
                this.colsB = parseInt(e.target.value, 10);
                this.renderGridB();
            });
        }

        // Preset Dimension Buttons
        const presetBtns = document.querySelectorAll(".matrix-preset-btn");
        presetBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                presetBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const rA = parseInt(btn.getAttribute("data-ra"), 10) || 2;
                const cA = parseInt(btn.getAttribute("data-ca"), 10) || 2;
                const rB = parseInt(btn.getAttribute("data-rb"), 10) || rA;
                const cB = parseInt(btn.getAttribute("data-cb"), 10) || cA;

                this.rowsA = rA;
                this.colsA = cA;
                this.rowsB = rB;
                this.colsB = cB;

                if (rowsASelect) rowsASelect.value = rA;
                if (colsASelect) colsASelect.value = cA;
                if (rowsBSelect) rowsBSelect.value = rB;
                if (colsBSelect) colsBSelect.value = cB;

                this.renderGrids();
            });
        });
    }

    renderGrids() {
        this.renderGridA();
        this.renderGridB();
    }

    renderGridA() {
        if (!this.matrixAContainer) return;
        this.matrixAContainer.style.gridTemplateColumns = `repeat(${this.colsA}, 1fr)`;
        this.matrixAContainer.innerHTML = "";

        for (let r = 0; r < this.rowsA; r++) {
            for (let c = 0; c < this.colsA; c++) {
                const input = document.createElement("input");
                input.type = "number";
                input.id = `a_${r}_${c}`;
                input.step = "any";
                input.placeholder = "0";
                this.matrixAContainer.appendChild(input);
            }
        }
    }

    renderGridB() {
        if (!this.matrixBContainer) return;
        this.matrixBContainer.style.gridTemplateColumns = `repeat(${this.colsB}, 1fr)`;
        this.matrixBContainer.innerHTML = "";

        for (let r = 0; r < this.rowsB; r++) {
            for (let c = 0; c < this.colsB; c++) {
                const input = document.createElement("input");
                input.type = "number";
                input.id = `b_${r}_${c}`;
                input.step = "any";
                input.placeholder = "0";
                this.matrixBContainer.appendChild(input);
            }
        }
    }

    populateSampleValues() {
        const sampleA = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        const sampleB = [
            [9, 8, 7],
            [6, 5, 4],
            [3, 2, 1]
        ];

        for (let r = 0; r < this.rowsA; r++) {
            for (let c = 0; c < this.colsA; c++) {
                const input = document.getElementById(`a_${r}_${c}`);
                if (input && sampleA[r] && sampleA[r][c] !== undefined) {
                    input.value = sampleA[r][c];
                } else if (input) {
                    input.value = r === c ? "1" : "0";
                }
            }
        }

        for (let r = 0; r < this.rowsB; r++) {
            for (let c = 0; c < this.colsB; c++) {
                const input = document.getElementById(`b_${r}_${c}`);
                if (input && sampleB[r] && sampleB[r][c] !== undefined) {
                    input.value = sampleB[r][c];
                } else if (input) {
                    input.value = r === c ? "1" : "0";
                }
            }
        }
    }

    getMatrixA() {
        const matrix = [];
        for (let r = 0; r < this.rowsA; r++) {
            const row = [];
            for (let c = 0; c < this.colsA; c++) {
                const el = document.getElementById(`a_${r}_${c}`);
                const val = el && el.value !== "" ? parseFloat(el.value) : 0;
                row.push(isNaN(val) ? 0 : val);
            }
            matrix.push(row);
        }
        return matrix;
    }

    getMatrixB() {
        const matrix = [];
        for (let r = 0; r < this.rowsB; r++) {
            const row = [];
            for (let c = 0; c < this.colsB; c++) {
                const el = document.getElementById(`b_${r}_${c}`);
                const val = el && el.value !== "" ? parseFloat(el.value) : 0;
                row.push(isNaN(val) ? 0 : val);
            }
            matrix.push(row);
        }
        return matrix;
    }

    matrixToLatex(matrix) {
        if (!matrix || matrix.length === 0) return "\\begin{bmatrix}\\end{bmatrix}";
        const rows = matrix.map(row => row.map(val => formatNumber(val)).join(" & "));
        return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
    }

    showResult(htmlContent) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = htmlContent;
        if (typeof renderAllMath === "function") {
            renderAllMath(this.resultContainer);
        }
    }

    showError(message) {
        this.showResult(`
            <div class="alert-message alert-error">
                <strong>⚠️ Dimension / Compatibility Error:</strong> ${message}
            </div>
        `);
    }

    bindOperationButtons() {
        const addBtn = document.getElementById("op-add-btn");
        const subBtn = document.getElementById("op-sub-btn");
        const mulBtn = document.getElementById("op-mul-btn");
        const scalarBtn = document.getElementById("op-scalar-btn");
        const transABtn = document.getElementById("op-trans-a-btn");
        const detABtn = document.getElementById("op-det-a-btn");
        const invABtn = document.getElementById("op-inv-a-btn");
        const rankABtn = document.getElementById("op-rank-a-btn");
        const traceABtn = document.getElementById("op-trace-a-btn");
        const clearBtn = document.getElementById("op-clear-btn");

        if (addBtn) addBtn.addEventListener("click", () => this.add());
        if (subBtn) subBtn.addEventListener("click", () => this.subtract());
        if (mulBtn) mulBtn.addEventListener("click", () => this.multiply());
        if (scalarBtn) scalarBtn.addEventListener("click", () => this.scalarMultiply());
        if (transABtn) transABtn.addEventListener("click", () => this.transposeA());
        if (detABtn) detABtn.addEventListener("click", () => this.determinantA());
        if (invABtn) invABtn.addEventListener("click", () => this.inverseA());
        if (rankABtn) rankABtn.addEventListener("click", () => this.rankA());
        if (traceABtn) traceABtn.addEventListener("click", () => this.traceA());
        if (clearBtn) clearBtn.addEventListener("click", () => this.clear());
    }

    // ====== OPERATIONS ======

    add() {
        if (this.rowsA !== this.rowsB || this.colsA !== this.colsB) {
            this.showError(`Addition requires identical dimensions. Matrix A is ${this.rowsA}×${this.colsA} but Matrix B is ${this.rowsB}×${this.colsB}.`);
            return;
        }

        const A = this.getMatrixA();
        const B = this.getMatrixB();
        const C = [];

        for (let r = 0; r < this.rowsA; r++) {
            const row = [];
            for (let c = 0; c < this.colsA; c++) {
                row.push(A[r][c] + B[r][c]);
            }
            C.push(row);
        }

        this.showResult(`
            <div class="math-display">
                \\[ A + B = ${this.matrixToLatex(A)} + ${this.matrixToLatex(B)} = ${this.matrixToLatex(C)} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Addition:</strong>
                <p>Add corresponding entries: $C_{ij} = A_{ij} + B_{ij}$.</p>
            </div>
        `);
    }

    subtract() {
        if (this.rowsA !== this.rowsB || this.colsA !== this.colsB) {
            this.showError(`Subtraction requires identical dimensions. Matrix A is ${this.rowsA}×${this.colsA} but Matrix B is ${this.rowsB}×${this.colsB}.`);
            return;
        }

        const A = this.getMatrixA();
        const B = this.getMatrixB();
        const C = [];

        for (let r = 0; r < this.rowsA; r++) {
            const row = [];
            for (let c = 0; c < this.colsA; c++) {
                row.push(A[r][c] - B[r][c]);
            }
            C.push(row);
        }

        this.showResult(`
            <div class="math-display">
                \\[ A - B = ${this.matrixToLatex(A)} - ${this.matrixToLatex(B)} = ${this.matrixToLatex(C)} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Subtraction:</strong>
                <p>Subtract corresponding entries: $C_{ij} = A_{ij} - B_{ij}$.</p>
            </div>
        `);
    }

    multiply() {
        if (this.colsA !== this.rowsB) {
            this.showError(`Matrix multiplication $A \\times B$ is only defined when columns of $A$ equal rows of $B$. Here, columns of $A$ = ${this.colsA} and rows of $B$ = ${this.rowsB}.`);
            return;
        }

        const A = this.getMatrixA();
        const B = this.getMatrixB();
        const C = [];
        const steps = [];

        for (let i = 0; i < this.rowsA; i++) {
            const row = [];
            for (let j = 0; j < this.colsB; j++) {
                let sum = 0;
                const terms = [];
                for (let k = 0; k < this.colsA; k++) {
                    sum += A[i][k] * B[k][j];
                    terms.push(`(${formatPlainNumber(A[i][k])} \\cdot ${formatPlainNumber(B[k][j])})`);
                }
                row.push(sum);
                steps.push(`$c_{${i+1}${j+1}} = ${terms.join(" + ")} = ${formatNumber(sum)}$`);
            }
            C.push(row);
        }

        this.showResult(`
            <div class="math-display">
                \\[ A \\cdot B = ${this.matrixToLatex(A)} \\cdot ${this.matrixToLatex(B)} = ${this.matrixToLatex(C)} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Dot Products:</strong>
                <ol>
                    ${steps.slice(0, 8).map(step => `<li>${step}</li>`).join("")}
                    ${steps.length > 8 ? `<li>... and so on for all ${steps.length} entries.</li>` : ""}
                </ol>
            </div>
        `);
    }

    scalarMultiply() {
        const scalarInput = document.getElementById("scalar-k");
        const k = scalarInput && scalarInput.value !== "" ? parseFloat(scalarInput.value) : 2;
        const A = this.getMatrixA();
        const C = A.map(row => row.map(val => val * k));

        this.showResult(`
            <div class="math-display">
                \\[ ${k} \\cdot A = ${k} \\cdot ${this.matrixToLatex(A)} = ${this.matrixToLatex(C)} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Scalar Multiplication:</strong>
                <p>Multiply every entry of Matrix A by $k = ${k}$.</p>
            </div>
        `);
    }

    transposeA() {
        const A = this.getMatrixA();
        const AT = [];
        for (let c = 0; c < this.colsA; c++) {
            const row = [];
            for (let r = 0; r < this.rowsA; r++) {
                row.push(A[r][c]);
            }
            AT.push(row);
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^T = \\left( ${this.matrixToLatex(A)} \\right)^T = ${this.matrixToLatex(AT)} \\]
            </div>
            <div class="calc-steps">
                <strong>Transpose Property:</strong>
                <p>Swapped rows and columns. Dimensions transformed from ${this.rowsA}×${this.colsA} to ${this.colsA}×${this.rowsA}.</p>
            </div>
        `);
    }

    determinantA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Determinant is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        const det = this.computeDeterminant(A);

        this.showResult(`
            <div class="math-display">
                \\[ \\det(A) = \\begin{vmatrix} ${A.map(r => r.map(v => formatNumber(v)).join(" & ")).join(" \\\\ ")} \\end{vmatrix} = ${formatNumber(det)} \\]
            </div>
            <div class="calc-steps">
                <strong>Interpretation:</strong>
                <p>${det === 0 
                    ? "The determinant is <strong>0</strong>. Matrix A is <strong>singular (non-invertible)</strong>; its columns are linearly dependent." 
                    : `The determinant is non-zero (<strong>${formatNumber(det)}</strong>). Matrix A is <strong>invertible (non-singular)</strong>.`}</p>
            </div>
        `);
    }

    computeDeterminant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let j = 0; j < n; j++) {
            const sub = matrix.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
            const cofactor = (j % 2 === 0 ? 1 : -1) * matrix[0][j] * this.computeDeterminant(sub);
            det += cofactor;
        }
        return det;
    }

    inverseA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Inverse is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        const det = this.computeDeterminant(A);

        if (Math.abs(det) < 1e-7) {
            this.showError(`Matrix A is <strong>singular</strong> because $\\det(A) = 0$. A singular matrix has linearly dependent columns and therefore has no inverse.`);
            return;
        }

        const inv = this.computeInverse(A);
        if (!inv) {
            this.showError(`Could not compute inverse for this matrix.`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^{-1} = ${this.matrixToLatex(inv)} \\]
            </div>
            <div class="calc-steps">
                <strong>Verification:</strong>
                <p>Since $\\det(A) = ${formatNumber(det)} \\neq 0$, $A^{-1}$ exists and satisfies $A \\cdot A^{-1} = I$.</p>
            </div>
        `);
    }

    computeInverse(matrix) {
        const n = matrix.length;
        // Create augmented matrix [A | I]
        const aug = [];
        for (let i = 0; i < n; i++) {
            const row = [...matrix[i]];
            for (let j = 0; j < n; j++) {
                row.push(i === j ? 1 : 0);
            }
            aug.push(row);
        }

        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Pivot search
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            if (Math.abs(aug[maxRow][i]) < 1e-9) return null; // Singular

            // Swap rows
            const temp = aug[i];
            aug[i] = aug[maxRow];
            aug[maxRow] = temp;

            // Normalize pivot row
            const pivot = aug[i][i];
            for (let j = 0; j < 2 * n; j++) {
                aug[i][j] /= pivot;
            }

            // Eliminate column entries
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = aug[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        aug[k][j] -= factor * aug[i][j];
                    }
                }
            }
        }

        // Extract inverse
        const inv = [];
        for (let i = 0; i < n; i++) {
            inv.push(aug[i].slice(n));
        }
        return inv;
    }

    rankA() {
        const A = this.getMatrixA();
        const rank = this.computeRank(A);

        this.showResult(`
            <div class="math-display">
                \\[ \\text{Rank}(A) = ${rank} \\]
            </div>
            <div class="calc-steps">
                <strong>Rank Explanation:</strong>
                <p>The rank is the maximum number of linearly independent rows or columns. For a ${this.rowsA}×${this.colsA} matrix, maximum possible rank is $\\min(${this.rowsA}, ${this.colsA}) = ${Math.min(this.rowsA, this.colsA)}$.</p>
                <p>${rank === Math.min(this.rowsA, this.colsA) ? "Matrix A has <strong>full rank</strong>." : "Matrix A is <strong>rank-deficient</strong>."}</p>
            </div>
        `);
    }

    computeRank(matrix) {
        const mat = matrix.map(r => [...r]);
        const R = mat.length;
        const C = mat[0].length;
        let rank = C;

        for (let row = 0; row < rank; row++) {
            if (mat[row][row] !== 0) {
                for (let col = 0; col < R; col++) {
                    if (col !== row) {
                        const mult = mat[col][row] / mat[row][row];
                        for (let i = 0; i < rank; i++) {
                            mat[col][i] -= mult * mat[row][i];
                        }
                    }
                }
            } else {
                let reduce = true;
                for (let i = row + 1; i < R; i++) {
                    if (mat[i][row] !== 0) {
                        const temp = mat[row];
                        mat[row] = mat[i];
                        mat[i] = temp;
                        reduce = false;
                        break;
                    }
                }
                if (reduce) {
                    rank--;
                    for (let i = 0; i < R; i++) {
                        mat[i][row] = mat[i][rank];
                    }
                }
                row--;
            }
        }
        return rank;
    }

    traceA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Trace is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        let tr = 0;
        const terms = [];
        for (let i = 0; i < this.rowsA; i++) {
            tr += A[i][i];
            terms.push(formatPlainNumber(A[i][i]));
        }

        this.showResult(`
            <div class="math-display">
                \\[ \\text{tr}(A) = \\sum_{i=1}^{${this.rowsA}} a_{ii} = ${terms.join(" + ")} = ${formatNumber(tr)} \\]
            </div>
            <div class="calc-steps">
                <strong>Trace Property:</strong>
                <p>The trace equals the sum of the principal diagonal elements (which is also equal to the sum of its eigenvalues).</p>
            </div>
        `);
    }

    clear() {
        for (let r = 0; r < this.rowsA; r++) {
            for (let c = 0; c < this.colsA; c++) {
                const el = document.getElementById(`a_${r}_${c}`);
                if (el) el.value = "";
            }
        }
        for (let r = 0; r < this.rowsB; r++) {
            for (let c = 0; c < this.colsB; c++) {
                const el = document.getElementById(`b_${r}_${c}`);
                if (el) el.value = "";
            }
        }
        this.showResult("<p class='text-center text-light'>Cleared all inputs. Select an operation to calculate.</p>");
    }
}

// Auto-instantiate if on a page with matrix calculator
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("matrix-a-grid")) {
        window.matrixCalculatorInstance = new DynamicMatrixCalculator();
    }
});
