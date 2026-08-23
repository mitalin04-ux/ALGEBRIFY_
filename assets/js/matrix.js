/**
 * ALGEBRIFY - DYNAMIC MATRIX CALCULATOR
 * Calls Python/Flask backend (/api/matrix) for all matrix mathematical operations:
 * addition, subtraction, scalar mult, matrix mult, transpose, determinant,
 * inverse, rank, trace, and step-by-step breakdown.
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

function parseInputNumber(str) {
    if (typeof str === "number") return isNaN(str) ? 0 : str;
    if (!str || typeof str !== "string") return 0;
    str = str.trim();
    if (!str) return 0;
    if (str.includes("/")) {
        const parts = str.split("/");
        if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && Math.abs(den) > 1e-9) {
                return num / den;
            }
        }
    }
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
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
                const oldVals = this.getMatrixA();
                this.rowsA = parseInt(e.target.value, 10);
                this.renderGridA(oldVals);
            });
            colsASelect.addEventListener("change", (e) => {
                const oldVals = this.getMatrixA();
                this.colsA = parseInt(e.target.value, 10);
                this.renderGridA(oldVals);
            });
        }

        if (rowsBSelect && colsBSelect) {
            rowsBSelect.addEventListener("change", (e) => {
                const oldVals = this.getMatrixB();
                this.rowsB = parseInt(e.target.value, 10);
                this.renderGridB(oldVals);
            });
            colsBSelect.addEventListener("change", (e) => {
                const oldVals = this.getMatrixB();
                this.colsB = parseInt(e.target.value, 10);
                this.renderGridB(oldVals);
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
                this.populateSampleValues();
            });
        });
    }

    renderGrids() {
        this.renderGridA();
        this.renderGridB();
    }

    renderGridA(preserveVals = null) {
        if (!this.matrixAContainer) return;
        this.matrixAContainer.style.gridTemplateColumns = `repeat(${this.colsA}, 1fr)`;
        this.matrixAContainer.innerHTML = "";

        for (let r = 0; r < this.rowsA; r++) {
            for (let c = 0; c < this.colsA; c++) {
                const input = document.createElement("input");
                input.type = "number";
                input.step = "any";
                input.id = `a_${r}_${c}`;
                input.placeholder = "0";
                if (preserveVals && preserveVals[r] && preserveVals[r][c] !== undefined) {
                    input.value = preserveVals[r][c];
                }
                input.addEventListener("focus", () => input.select());
                input.addEventListener("click", () => input.select());
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.add();
                });
                this.matrixAContainer.appendChild(input);
            }
        }
    }

    renderGridB(preserveVals = null) {
        if (!this.matrixBContainer) return;
        this.matrixBContainer.style.gridTemplateColumns = `repeat(${this.colsB}, 1fr)`;
        this.matrixBContainer.innerHTML = "";

        for (let r = 0; r < this.rowsB; r++) {
            for (let c = 0; c < this.colsB; c++) {
                const input = document.createElement("input");
                input.type = "number";
                input.step = "any";
                input.id = `b_${r}_${c}`;
                input.placeholder = "0";
                if (preserveVals && preserveVals[r] && preserveVals[r][c] !== undefined) {
                    input.value = preserveVals[r][c];
                }
                input.addEventListener("focus", () => input.select());
                input.addEventListener("click", () => input.select());
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.add();
                });
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
                if (input && (!input.value || input.value === "0")) {
                    if (sampleA[r] && sampleA[r][c] !== undefined) {
                        input.value = sampleA[r][c];
                    } else {
                        input.value = r === c ? "1" : "0";
                    }
                }
            }
        }

        for (let r = 0; r < this.rowsB; r++) {
            for (let c = 0; c < this.colsB; c++) {
                const input = document.getElementById(`b_${r}_${c}`);
                if (input && (!input.value || input.value === "0")) {
                    if (sampleB[r] && sampleB[r][c] !== undefined) {
                        input.value = sampleB[r][c];
                    } else {
                        input.value = r === c ? "1" : "0";
                    }
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
                const val = parseInputNumber(el?.value);
                row.push(val);
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
                const val = parseInputNumber(el?.value);
                row.push(val);
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

    // ====== OPERATIONS DELEGATED TO FLASK BACKEND ======

    async add() {
        const A = this.getMatrixA();
        const B = this.getMatrixB();

        const response = await algebrifyApi("/api/matrix", {
            operation: "add",
            matrixA: A,
            matrixB: B
        });

        if (!response.success) {
            this.showError(response.error || "Addition failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A + B = ${response.latex_a} + ${response.latex_b} = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Addition (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
            </div>
        `);
    }

    async subtract() {
        const A = this.getMatrixA();
        const B = this.getMatrixB();

        const response = await algebrifyApi("/api/matrix", {
            operation: "subtract",
            matrixA: A,
            matrixB: B
        });

        if (!response.success) {
            this.showError(response.error || "Subtraction failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A - B = ${response.latex_a} - ${response.latex_b} = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Subtraction (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
            </div>
        `);
    }

    async multiply() {
        const A = this.getMatrixA();
        const B = this.getMatrixB();

        const response = await algebrifyApi("/api/matrix", {
            operation: "multiply",
            matrixA: A,
            matrixB: B
        });

        if (!response.success) {
            this.showError(response.error || "Multiplication failed.");
            return;
        }

        const steps = response.steps || [];
        this.showResult(`
            <div class="math-display">
                \\[ A \\cdot B = ${response.latex_a} \\cdot ${response.latex_b} = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Dot Products (Python Flask Backend):</strong>
                <ol>
                    ${steps.slice(0, 8).map(step => `<li>${step}</li>`).join("")}
                    ${steps.length > 8 ? `<li>... and so on for all ${steps.length} entries.</li>` : ""}
                </ol>
            </div>
        `);
    }

    async scalarMultiply() {
        const scalarInput = document.getElementById("scalar-k");
        const k = scalarInput && scalarInput.value !== "" ? parseFloat(scalarInput.value) : 2;
        const A = this.getMatrixA();

        const response = await algebrifyApi("/api/matrix", {
            operation: "scalar_multiply",
            matrixA: A,
            scalar: k
        });

        if (!response.success) {
            this.showError(response.error || "Scalar multiplication failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ ${k} \\cdot A = ${k} \\cdot ${response.latex_a} = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Scalar Multiplication (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
            </div>
        `);
    }

    async transposeA() {
        const A = this.getMatrixA();

        const response = await algebrifyApi("/api/matrix", {
            operation: "transpose",
            matrixA: A
        });

        if (!response.success) {
            this.showError(response.error || "Transpose failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^T = \\left( ${response.latex_a} \\right)^T = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Transpose Property (Python Flask Backend):</strong>
                <p>Swapped rows and columns. Dimensions transformed from ${this.rowsA}×${this.colsA} to ${this.colsA}×${this.rowsA}.</p>
            </div>
        `);
    }

    async determinantA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Determinant is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        const response = await algebrifyApi("/api/matrix", {
            operation: "determinant",
            matrixA: A
        });

        if (!response.success) {
            this.showError(response.error || "Determinant failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ \\det(A) = ${response.vmatrix_latex} = ${response.formatted_det} \\]
            </div>
            <div class="calc-steps">
                <strong>Interpretation (Python Flask Backend):</strong>
                <p>${response.interpretation}</p>
            </div>
        `);
    }

    async inverseA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Inverse is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        const response = await algebrifyApi("/api/matrix", {
            operation: "inverse",
            matrixA: A
        });

        if (!response.success) {
            this.showError(response.error || "Could not compute inverse for this matrix.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^{-1} = ${response.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Verification (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
            </div>
        `);
    }

    async rankA() {
        const A = this.getMatrixA();
        const response = await algebrifyApi("/api/matrix", {
            operation: "rank",
            matrixA: A
        });

        if (!response.success) {
            this.showError(response.error || "Rank computation failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ \\text{Rank}(A) = ${response.rank} \\]
            </div>
            <div class="calc-steps">
                <strong>Rank Explanation (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
            </div>
        `);
    }

    async traceA() {
        if (this.rowsA !== this.colsA) {
            this.showError(`Trace is only defined for square matrices ($n \\times n$). Matrix A is ${this.rowsA}×${this.colsA}.`);
            return;
        }

        const A = this.getMatrixA();
        const response = await algebrifyApi("/api/matrix", {
            operation: "trace",
            matrixA: A
        });

        if (!response.success) {
            this.showError(response.error || "Trace computation failed.");
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ \\text{tr}(A) = \\sum_{i=1}^{${this.rowsA}} a_{ii} = ${response.diagonal_terms} = ${response.formatted_trace} \\]
            </div>
            <div class="calc-steps">
                <strong>Trace Property (Python Flask Backend):</strong>
                <p>${response.explanation}</p>
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
