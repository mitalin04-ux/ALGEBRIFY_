/**
 * ALGEBRIFY - INTERACTIVE CALCULATORS
 * Vector Calculator, System of Equations Solver (Gauss-Jordan),
 * Determinants & Inverses, Eigenvalues & Eigenvectors, Field Arithmetic,
 * Linear Independence & Basis, Transformations, Change of Basis, Gram-Schmidt.
 *
 * All mathematical calculations are processed securely by the Python/Flask REST API backend.
 */

// ==========================================================================
// MATHEMATICAL FORMATTING & PARSING UTILITIES
// ==========================================================================

function formatNumber(val, tolerance = 1e-6) {
    if (isNaN(val) || !isFinite(val)) return "Undefined";
    if (Math.abs(val) < tolerance) return "0";

    if (Math.abs(val - Math.round(val)) < tolerance) {
        return Math.round(val).toString();
    }

    for (let denom = 2; denom <= 100; denom++) {
        const num = Math.round(val * denom);
        if (Math.abs(val - num / denom) < tolerance) {
            return `\\frac{${num}}{${denom}}`;
        }
    }

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
// 1. VECTOR CALCULATOR (MODULE 4)
// ==========================================================================

class VectorCalculator {
    constructor() {
        this.dim = 3;
        this.container = document.getElementById("vector-calc-container");
        this.resultContainer = document.getElementById("vector-calc-result");
        if (this.container) this.init();
    }

    init() {
        const dimSelect = document.getElementById("vector-dim-select");
        if (dimSelect) {
            dimSelect.addEventListener("change", (e) => {
                this.dim = parseInt(e.target.value, 10);
                this.updateDimensionUI();
            });
        }

        const addBtn = document.getElementById("vec-add-btn");
        const subBtn = document.getElementById("vec-sub-btn");
        const dotBtn = document.getElementById("vec-dot-btn");
        const crossBtn = document.getElementById("vec-cross-btn");
        const magBtn = document.getElementById("vec-mag-btn");
        const angleBtn = document.getElementById("vec-angle-btn");
        const unitBtn = document.getElementById("vec-unit-btn");

        if (addBtn) addBtn.addEventListener("click", () => this.add());
        if (subBtn) subBtn.addEventListener("click", () => this.subtract());
        if (dotBtn) dotBtn.addEventListener("click", () => this.dotProduct());
        if (crossBtn) crossBtn.addEventListener("click", () => this.crossProduct());
        if (magBtn) magBtn.addEventListener("click", () => this.magnitude());
        if (angleBtn) angleBtn.addEventListener("click", () => this.angle());
        if (unitBtn) unitBtn.addEventListener("click", () => this.unitVector());

        this.updateDimensionUI();
    }

    updateDimensionUI() {
        const zInputs = document.querySelectorAll(".vec-z-input");
        const crossBtn = document.getElementById("vec-cross-btn");

        zInputs.forEach(el => {
            el.style.display = this.dim === 3 ? "inline-block" : "none";
        });

        if (crossBtn) {
            crossBtn.style.display = this.dim === 3 ? "inline-flex" : "none";
        }
    }

    getVectorU() {
        const x = parseInputNumber(document.getElementById("u_x")?.value);
        const y = parseInputNumber(document.getElementById("u_y")?.value);
        const z = this.dim === 3 ? parseInputNumber(document.getElementById("u_z")?.value) : 0;
        return this.dim === 3 ? [x, y, z] : [x, y];
    }

    getVectorV() {
        const x = parseInputNumber(document.getElementById("v_x")?.value);
        const y = parseInputNumber(document.getElementById("v_y")?.value);
        const z = this.dim === 3 ? parseInputNumber(document.getElementById("v_z")?.value) : 0;
        return this.dim === 3 ? [x, y, z] : [x, y];
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async add() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "add", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Addition (Python Flask Backend):</strong>
                <p>Vector addition is computed entry-wise by the backend.</p>
            </div>
        `);
    }

    async subtract() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "subtract", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Subtraction (Python Flask Backend):</strong>
                <p>Vector subtraction is computed entry-wise by the backend.</p>
            </div>
        `);
    }

    async dotProduct() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "dot", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Geometric Analysis (Python Flask Backend):</strong>
                <p>${res.analysis}</p>
            </div>
        `);
    }

    async crossProduct() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "cross", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Geometric Meaning (Python Flask Backend):</strong>
                <p>The cross product produces a vector mutually perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$.</p>
                <p>Area of the parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$: $\\|\\mathbf{u} \\times \\mathbf{v}\\| = ${res.formatted_area}$.</p>
            </div>
        `);
    }

    async magnitude() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "magnitude", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math_u}
            </div>
            <div class="math-display">
                ${res.display_math_v}
            </div>
        `);
    }

    async angle() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = await algebrifyApi("/api/vectors", { operation: "angle", u, v });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Angle $\\theta$ (Python Flask Backend):</strong>
                <p>$\\theta = ${res.formatted_deg}^\\circ$ (${res.formatted_rad} radians).</p>
            </div>
        `);
    }

    async unitVector() {
        const u = this.getVectorU();
        const res = await algebrifyApi("/api/vectors", { operation: "unit", u });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <p>Unit vector has magnitude $\\|\\hat{\\mathbf{u}}\\| = 1$.</p>
            </div>
        `);
    }
}


// ==========================================================================
// 2. SYSTEM OF LINEAR EQUATIONS SOLVER (GAUSS-JORDAN WITH FLASK BACKEND)
// ==========================================================================

class LinearSystemSolver {
    constructor() {
        this.vars = 3;
        this.preset = "unique";
        this.container = document.getElementById("system-matrix-grid") || document.getElementById("system-solver-grid");
        this.previewContainer = document.getElementById("system-equation-preview");
        this.resultContainer = document.getElementById("system-calc-result") || document.getElementById("system-solver-result");
        if (this.container) this.init();
    }

    init() {
        const varSelect = document.getElementById("system-var-select") || document.getElementById("system-vars-select");
        if (varSelect) {
            varSelect.addEventListener("change", (e) => {
                this.vars = parseInt(e.target.value, 10);
                this.renderSystemInputs();
                this.loadPreset();
            });
        }

        const presetSelect = document.getElementById("system-preset-select");
        if (presetSelect) {
            presetSelect.addEventListener("change", (e) => {
                this.preset = e.target.value;
                this.loadPreset();
            });
        }

        const solveBtn = document.getElementById("solve-system-btn") || document.getElementById("system-solve-btn");
        const clearBtn = document.getElementById("system-clear-btn");
        const sampleBtn = document.getElementById("system-sample-btn") || document.getElementById("load-preset-btn");

        if (solveBtn) solveBtn.addEventListener("click", () => this.solve());
        if (clearBtn) clearBtn.addEventListener("click", () => this.clear());
        if (sampleBtn) {
            sampleBtn.addEventListener("click", () => {
                const presetSelect = document.getElementById("system-preset-select");
                if (presetSelect) {
                    this.preset = presetSelect.value;
                }
                this.loadPreset(true);
            });
        }

        this.renderSystemInputs();
        this.loadPreset(false);
    }

    renderSystemInputs() {
        if (!this.container) return;
        this.container.innerHTML = "";

        const varNames = ["x", "y", "z", "w"];
        const wrapper = document.createElement("div");
        wrapper.className = "augmented-matrix-wrapper";
        wrapper.style.cssText = "display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 620px; margin: 0 auto;";

        const headerRow = document.createElement("div");
        headerRow.style.cssText = "display: grid; grid-template-columns: repeat(" + this.vars + ", 1fr) 20px 1.2fr; gap: 8px; align-items: center; text-align: center; font-weight: 700; color: var(--clr-primary); font-size: 0.95rem; margin-bottom: 4px;";

        for (let c = 0; c < this.vars; c++) {
            const hCell = document.createElement("div");
            hCell.textContent = varNames[c];
            headerRow.appendChild(hCell);
        }

        const dividerHeader = document.createElement("div");
        dividerHeader.textContent = "┆";
        dividerHeader.style.color = "var(--clr-border)";
        headerRow.appendChild(dividerHeader);

        const bHeader = document.createElement("div");
        bHeader.textContent = "b (const)";
        bHeader.style.color = "var(--clr-accent-dark)";
        headerRow.appendChild(bHeader);

        wrapper.appendChild(headerRow);

        for (let r = 0; r < this.vars; r++) {
            const rowDiv = document.createElement("div");
            rowDiv.style.cssText = "display: grid; grid-template-columns: repeat(" + this.vars + ", 1fr) 20px 1.2fr; gap: 8px; align-items: center;";

            for (let c = 0; c < this.vars; c++) {
                const input = document.createElement("input");
                input.type = "text";
                input.id = `sys_${r}_${c}`;
                input.className = "matrix-cell-input";
                input.style.cssText = "width: 100%; height: 44px; text-align: center; font-weight: 600; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-card); color: var(--clr-text); font-size: 1rem; outline: none; transition: border-color 0.2s;";
                input.placeholder = "0";

                input.addEventListener("focus", () => input.select());
                input.addEventListener("input", () => this.updateLivePreview());
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.solve();
                });

                rowDiv.appendChild(input);
            }

            const dividerCell = document.createElement("div");
            dividerCell.textContent = "┆";
            dividerCell.style.cssText = "text-align: center; color: var(--clr-border); font-weight: bold; font-size: 1.2rem;";
            rowDiv.appendChild(dividerCell);

            const bInput = document.createElement("input");
            bInput.type = "text";
            bInput.id = `sys_${r}_b`;
            bInput.className = "matrix-cell-input matrix-b-cell";
            bInput.style.cssText = "width: 100%; height: 44px; text-align: center; font-weight: 700; border-radius: 8px; border: 2px solid var(--clr-accent); background: var(--clr-card); color: var(--clr-text); font-size: 1.05rem; outline: none;";
            bInput.placeholder = "0";

            bInput.addEventListener("focus", () => bInput.select());
            bInput.addEventListener("input", () => this.updateLivePreview());
            bInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") this.solve();
            });

            rowDiv.appendChild(bInput);
            wrapper.appendChild(rowDiv);
        }

        this.container.appendChild(wrapper);
        this.updateLivePreview();
    }

    updateLivePreview() {
        if (!this.previewContainer) return;
        const n = this.vars;
        const varNames = ["x", "y", "z", "w"];
        const eqLines = [];

        for (let r = 0; r < n; r++) {
            const terms = [];
            for (let c = 0; c < n; c++) {
                const el = document.getElementById(`sys_${r}_${c}`);
                const val = parseInputNumber(el?.value);
                const coeffStr = formatPlainNumber(val);

                if (c === 0) {
                    terms.push(`${coeffStr}${varNames[c]}`);
                } else {
                    if (val >= 0) {
                        terms.push(`+ ${coeffStr}${varNames[c]}`);
                    } else {
                        terms.push(`- ${formatPlainNumber(Math.abs(val))}${varNames[c]}`);
                    }
                }
            }
            const bVal = parseInputNumber(document.getElementById(`sys_${r}_b`)?.value);
            eqLines.push(`${terms.join(" ")} = ${formatPlainNumber(bVal)}`);
        }

        this.previewContainer.innerHTML = `
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--clr-text-light); text-transform: uppercase; margin-bottom: 6px;">Live System Preview</div>
            <div class="math-display" style="margin: 0;">
                \\[ \\begin{cases} ${eqLines.join(" \\\\ ")} \\end{cases} \\]
            </div>
        `;

        if (typeof renderAllMath === "function") renderAllMath(this.previewContainer);
    }

    loadPreset(showFeedback = false) {
        const presets = {
            2: {
                unique: [[2, 1, 5], [1, -1, 1]],
                inconsistent: [[1, 1, 2], [2, 2, 5]],
                infinite: [[1, 1, 2], [2, 2, 4]],
                homogeneous: [[2, 1, 0], [1, -1, 0]]
            },
            3: {
                unique: [[1, 2, 1, 9], [2, -1, 1, 8], [3, 1, -1, 3]],
                inconsistent: [[1, 1, 1, 2], [1, 1, 1, 5], [2, 1, -1, 1]],
                infinite: [[1, 1, 1, 6], [2, 2, 2, 12], [1, 2, 3, 14]],
                homogeneous: [[1, 2, 1, 0], [2, -1, 1, 0], [3, 1, -1, 0]]
            },
            4: {
                unique: [[1, 1, 1, 1, 10], [1, 2, 3, 4, 30], [2, 1, 1, 3, 19], [3, 1, 2, 1, 16]],
                inconsistent: [[1, 1, 1, 1, 1], [1, 1, 1, 1, 2], [1, 2, 1, 1, 3], [0, 1, 1, 1, 4]],
                infinite: [[1, 1, 1, 1, 4], [2, 2, 2, 2, 8], [1, -1, 1, -1, 0], [2, 0, 2, 0, 4]],
                homogeneous: [[1, 1, 1, 1, 0], [1, 2, 3, 4, 0], [2, 1, 1, 3, 0], [3, 1, 2, 1, 0]]
            }
        };

        const currentMap = presets[this.vars] || presets[3];
        const data = currentMap[this.preset] || currentMap.unique;

        if (data) {
            for (let r = 0; r < this.vars; r++) {
                for (let c = 0; c < this.vars; c++) {
                    const el = document.getElementById(`sys_${r}_${c}`);
                    if (el) el.value = data[r][c];
                }
                const bEl = document.getElementById(`sys_${r}_b`);
                if (bEl) bEl.value = data[r][this.vars];
            }
            this.updateLivePreview();
        }
    }

    clear() {
        for (let r = 0; r < this.vars; r++) {
            for (let c = 0; c < this.vars; c++) {
                const el = document.getElementById(`sys_${r}_${c}`);
                if (el) el.value = "";
            }
            const bEl = document.getElementById(`sys_${r}_b`);
            if (bEl) bEl.value = "";
        }
        this.updateLivePreview();
        if (this.resultContainer) {
            this.resultContainer.innerHTML = '<p class="text-center text-light">Click "Solve with Gauss-Jordan" above to compute the system solution.</p>';
        }
    }

    async solve() {
        const n = this.vars;
        const augmentedMatrix = [];

        for (let r = 0; r < n; r++) {
            const row = [];
            for (let c = 0; c < n; c++) {
                const val = parseInputNumber(document.getElementById(`sys_${r}_${c}`)?.value);
                row.push(val);
            }
            const bVal = parseInputNumber(document.getElementById(`sys_${r}_b`)?.value);
            row.push(bVal);
            augmentedMatrix.push(row);
        }

        const res = await algebrifyApi("/api/equations", { augmentedMatrix });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error || "System solving failed."}</div>`);
            return;
        }

        const steps = res.steps || [];

        if (res.solution_type === "inconsistent") {
            this.showResult(`
                <div class="alert-message alert-error" style="background: rgba(239, 83, 80, 0.1); border-left: 4px solid var(--clr-error); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong>❌ Inconsistent System (No Solution):</strong> ${res.message}
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Detailed Elimination Steps (Python Flask Backend):</h4>
                    ${steps.join("")}
                </div>
            `);
            return;
        }

        if (res.solution_type === "infinite") {
            this.showResult(`
                <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.1); border-left: 4px solid var(--clr-accent); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong>♾️ Infinitely Many Solutions:</strong> ${res.message}
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Detailed Elimination Steps (Python Flask Backend):</h4>
                    ${steps.join("")}
                </div>
            `);
            return;
        }

        // Unique solution
        this.showResult(`
            <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Solution Found (Unique Solution):</h4>
                <div class="math-display" style="font-size: 1.15rem; margin: 10px 0;">
                    ${res.solution_latex}
                </div>
            </div>
            <div class="calc-steps" style="margin-top: 20px;">
                <h4 style="margin-bottom: 12px;"><i data-lucide="list-ordered"></i> Step-by-Step Gauss-Jordan Elimination (Python Flask Backend):</h4>
                ${steps.join("")}
            </div>
        `);
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }
}


// ==========================================================================
// 3. EIGENVALUES & EIGENVECTORS SOLVER (MODULE 10)
// ==========================================================================

class EigenSolver {
    constructor() {
        this.dim = 2;
        this.container = document.getElementById("eigen-calc-container");
        this.resultContainer = document.getElementById("eigen-calc-result");
        if (this.container) this.init();
    }

    init() {
        const dimSelect = document.getElementById("eigen-dim-select");
        if (dimSelect) {
            dimSelect.addEventListener("change", (e) => {
                this.dim = parseInt(e.target.value, 10);
                this.renderGrid();
            });
        }

        const solveBtn = document.getElementById("eigen-solve-btn");
        if (solveBtn) solveBtn.addEventListener("click", () => this.solve());

        this.renderGrid();
    }

    renderGrid() {
        const grid = document.getElementById("eigen-matrix-grid");
        if (!grid) return;

        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${this.dim}, 60px)`;

        const defaultVals = this.dim === 2 
            ? [[4, 1], [2, 3]]
            : [[2, 0, 0], [0, 3, 4], [0, 4, 9]];

        for (let r = 0; r < this.dim; r++) {
            for (let c = 0; c < this.dim; c++) {
                const input = document.createElement("input");
                input.type = "text";
                input.id = `eigen_${r}_${c}`;
                input.value = defaultVals[r][c];
                input.style.cssText = "width: 55px; height: 48px; text-align: center; font-weight: 600; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-card); color: var(--clr-text); font-size: 1.05rem;";
                input.addEventListener("focus", () => input.select());
                grid.appendChild(input);
            }
        }
    }

    getMatrix() {
        const mat = [];
        for (let r = 0; r < this.dim; r++) {
            const row = [];
            for (let c = 0; c < this.dim; c++) {
                const val = parseInputNumber(document.getElementById(`eigen_${r}_${c}`)?.value);
                row.push(val);
            }
            mat.push(row);
        }
        return mat;
    }

    async solve() {
        const A = this.getMatrix();
        const res = await algebrifyApi("/api/eigen", { matrix: A });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error || "Eigen solver failed."}</div>`);
            return;
        }

        if (this.dim === 2) {
            if (res.is_complex) {
                this.showResult(`
                    <div class="math-display">
                        ${res.char_poly_latex}
                    </div>
                    <div class="alert-message alert-info">
                        <strong>Complex Conjugate Eigenvalues (Python Flask Backend):</strong>
                        ${res.display_math}
                        (Represents rotation in the real plane with scaling factor $\\sqrt{\\det(A)} = ${res.formatted_scaling}$).
                    </div>
                `);
            } else {
                this.showResult(`
                    <div class="math-display">
                        \\text{Characteristic Equation:} \\quad ${res.char_poly_latex}
                    </div>
                    <div class="math-display">
                        \\[ \\lambda_1 = ${res.formatted_lambda1}, \\quad \\mathbf{v}_1 = ${res.latex_v1} \\]
                    </div>
                    <div class="math-display">
                        \\[ \\lambda_2 = ${res.formatted_lambda2}, \\quad \\mathbf{v}_2 = ${res.latex_v2} \\]
                    </div>
                    <div class="calc-steps">
                        <strong>Diagonalization (Python Flask Backend):</strong>
                        <p>Since $\\lambda_1 \\neq \\lambda_2$, Matrix $A$ is diagonalizable: $A = PDP^{-1}$ where:</p>
                        \\[ P = ${res.latex_p}, \\quad D = ${res.latex_d} \\]
                    </div>
                `);
            }
        } else {
            this.showResult(`
                <div class="math-display">
                    \\[ \\det(A - \\lambda I) = 0 \\]
                </div>
                <div class="calc-steps">
                    <p><strong>Trace:</strong> $\\text{tr}(A) = \\lambda_1 + \\lambda_2 + \\lambda_3 = ${res.formatted_trace}$</p>
                    <p><strong>Determinant:</strong> $\\det(A) = \\lambda_1 \\cdot \\lambda_2 \\cdot \\lambda_3 = ${res.formatted_det}$</p>
                    <p>Spectral property computed by Python NumPy eigensolver.</p>
                </div>
            `);
        }
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }
}


// ==========================================================================
// 4. FIELD ARITHMETIC EXPLORER (MODULE 3)
// ==========================================================================

class FieldCalculator {
    constructor() {
        this.resultContainer = document.getElementById("field-result-box");
        const typeSelect = document.getElementById("field-type-select");
        if (typeSelect || this.resultContainer) this.init();
    }

    init() {
        const typeSelect = document.getElementById("field-type-select");
        if (typeSelect) {
            typeSelect.addEventListener("change", (e) => {
                this.updateFieldType(e.target.value);
            });
        }

        const addBtn = document.getElementById("field-add-btn");
        const mulBtn = document.getElementById("field-mul-btn");
        const invBtn = document.getElementById("field-inv-btn");

        if (addBtn) addBtn.addEventListener("click", () => this.add());
        if (mulBtn) mulBtn.addEventListener("click", () => this.multiply());
        if (invBtn) invBtn.addEventListener("click", () => this.inverse());
    }

    updateFieldType(type) {
        const complexWs = document.getElementById("complex-workspace");
        const gf2Ws = document.getElementById("gf2-workspace");
        const invBtn = document.getElementById("field-inv-btn");

        if (type === "gf2") {
            if (complexWs) complexWs.style.display = "none";
            if (gf2Ws) gf2Ws.style.display = "flex";
            if (invBtn) invBtn.innerHTML = '<i data-lucide="divide"></i> Inverse (x⁻¹)';
        } else {
            if (complexWs) complexWs.style.display = "flex";
            if (gf2Ws) gf2Ws.style.display = "none";
            if (invBtn) invBtn.innerHTML = '<i data-lucide="divide"></i> Inverse (z₁⁻¹)';
        }
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    getFieldType() {
        const typeSelect = document.getElementById("field-type-select");
        return typeSelect ? typeSelect.value : "complex";
    }

    getComplexInputs() {
        const a1 = parseInputNumber(document.getElementById("c_a1")?.value);
        const b1 = parseInputNumber(document.getElementById("c_b1")?.value);
        const a2 = parseInputNumber(document.getElementById("c_a2")?.value);
        const b2 = parseInputNumber(document.getElementById("c_b2")?.value);
        return { a1, b1, a2, b2 };
    }

    getGF2Inputs() {
        const x = parseInt(document.getElementById("gf2_x")?.value || "0", 10);
        const y = parseInt(document.getElementById("gf2_y")?.value || "0", 10);
        return { x, y };
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async add() {
        const type = this.getFieldType();
        const payload = type === "gf2"
            ? { field: "gf2", operation: "add", ...this.getGF2Inputs() }
            : { field: "complex", operation: "add", ...this.getComplexInputs() };

        const res = await algebrifyApi("/api/fields", payload);
        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Field Addition (Python Flask Backend):</strong>
                <p>${res.explanation}</p>
            </div>
        `);
    }

    async multiply() {
        const type = this.getFieldType();
        const payload = type === "gf2"
            ? { field: "gf2", operation: "multiply", ...this.getGF2Inputs() }
            : { field: "complex", operation: "multiply", ...this.getComplexInputs() };

        const res = await algebrifyApi("/api/fields", payload);
        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Field Multiplication (Python Flask Backend):</strong>
                <p>${res.explanation}</p>
            </div>
        `);
    }

    async inverse() {
        const type = this.getFieldType();
        const payload = type === "gf2"
            ? { field: "gf2", operation: "inverse", ...this.getGF2Inputs() }
            : { field: "complex", operation: "inverse", ...this.getComplexInputs() };

        const res = await algebrifyApi("/api/fields", payload);
        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Multiplicative Inverse (Python Flask Backend):</strong>
                <p>${res.explanation}</p>
            </div>
        `);
    }
}


// ==========================================================================
// 5. LINEAR INDEPENDENCE & BASIS CHECKER (MODULE 5)
// ==========================================================================

class IndependenceChecker {
    constructor() {
        this.resultContainer = document.getElementById("lic-result-box");
        const btn = document.getElementById("lic-check-btn");
        if (btn || this.resultContainer) this.init();
    }

    init() {
        const btn = document.getElementById("lic-check-btn");
        if (btn) {
            btn.addEventListener("click", () => this.check());
        }

        const inputIds = [
            "lic_v1x", "lic_v1y", "lic_v1z",
            "lic_v2x", "lic_v2y", "lic_v2z",
            "lic_v3x", "lic_v3y", "lic_v3z"
        ];

        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("focus", () => el.select());
                el.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.check();
                });
            }
        });
    }

    getVectors() {
        const v1 = [
            parseInputNumber(document.getElementById("lic_v1x")?.value),
            parseInputNumber(document.getElementById("lic_v1y")?.value),
            parseInputNumber(document.getElementById("lic_v1z")?.value)
        ];
        const v2 = [
            parseInputNumber(document.getElementById("lic_v2x")?.value),
            parseInputNumber(document.getElementById("lic_v2y")?.value),
            parseInputNumber(document.getElementById("lic_v2z")?.value)
        ];
        const v3 = [
            parseInputNumber(document.getElementById("lic_v3x")?.value),
            parseInputNumber(document.getElementById("lic_v3y")?.value),
            parseInputNumber(document.getElementById("lic_v3z")?.value)
        ];
        return { v1, v2, v3 };
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async check() {
        const { v1, v2, v3 } = this.getVectors();
        const res = await algebrifyApi("/api/vector-spaces", { v1, v2, v3 });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        if (res.is_independent) {
            this.showResult(`
                <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Result: Linearly Independent & Forms a Basis for $\\mathbb{R}^3$</h4>
                    <p style="margin: 0; font-size: 0.95rem;">
                        The vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ are <strong>linearly independent</strong> and span $\\mathbb{R}^3$. Since $\\dim(\\mathbb{R}^3) = 3$ and we have 3 linearly independent vectors, they form a <strong>valid Basis for $\\mathbb{R}^3$</strong>.
                    </p>
                </div>
                <div class="math-display">
                    \\[ A = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\mathbf{v}_3] = ${res.matrix_latex}, \\quad \\det(A) = ${res.formatted_det} \\neq 0 \\]
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Analysis Summary (Python Flask Backend):</h4>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li><strong>Matrix Rank:</strong> $\\text{Rank}(A) = 3$ (Full Rank).</li>
                        <li><strong>Spanned Subspace:</strong> ${res.spanned_subspace_desc}</li>
                        <li><strong>Linear Combination:</strong> $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 + c_3 \\mathbf{v}_3 = \\mathbf{0} \\implies c_1 = c_2 = c_3 = 0$.</li>
                    </ul>
                </div>
            `);
        } else {
            this.showResult(`
                <div class="alert-message alert-error" style="background: rgba(239, 83, 80, 0.1); border-left: 4px solid var(--clr-error); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; color: var(--clr-error);"><i data-lucide="alert-triangle"></i> Result: Linearly Dependent (Does NOT Form a Basis for $\\mathbb{R}^3$)</h4>
                    <p style="margin: 0; font-size: 0.95rem;">
                        The vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ are <strong>linearly dependent</strong> (redundant).
                    </p>
                </div>
                <div class="math-display">
                    \\[ A = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\mathbf{v}_3] = ${res.matrix_latex}, \\quad \\det(A) = 0 \\]
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Analysis Summary (Python Flask Backend):</h4>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li><strong>Matrix Rank:</strong> $\\text{Rank}(A) = ${res.rank} < 3$ (Rank-deficient).</li>
                        <li><strong>Dimension of Spanned Subspace:</strong> $\\dim(\\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}) = ${res.rank}$.</li>
                        <li><strong>Geometric Subspace:</strong> ${res.spanned_subspace_desc}</li>
                    </ul>
                </div>
            `);
        }
    }
}


// ==========================================================================
// 6. 2D LINEAR TRANSFORMATION EXPLORER (MODULE 6)
// ==========================================================================

class TransformationExplorer {
    constructor() {
        this.container = document.getElementById("visualizer");
        this.resultContainer = document.getElementById("trans-result-box");
        const btn = document.getElementById("trans-calc-btn");
        if (btn || this.resultContainer) this.init();
    }

    init() {
        const btn = document.getElementById("trans-calc-btn");
        if (btn) btn.addEventListener("click", () => this.applyTransformation());

        const presetBtns = document.querySelectorAll(".trans-preset-btn");
        presetBtns.forEach(pBtn => {
            pBtn.addEventListener("click", () => {
                presetBtns.forEach(b => b.classList.remove("active"));
                pBtn.classList.add("active");

                const a = pBtn.getAttribute("data-a") || "0";
                const b = pBtn.getAttribute("data-b") || "0";
                const c = pBtn.getAttribute("data-c") || "0";
                const d = pBtn.getAttribute("data-d") || "0";

                const t11 = document.getElementById("t_11");
                const t12 = document.getElementById("t_12");
                const t21 = document.getElementById("t_21");
                const t22 = document.getElementById("t_22");

                if (t11) t11.value = a;
                if (t12) t12.value = b;
                if (t21) t21.value = c;
                if (t22) t22.value = d;

                this.applyTransformation();
            });
        });
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async applyTransformation() {
        const a = parseInputNumber(document.getElementById("t_11")?.value);
        const b = parseInputNumber(document.getElementById("t_12")?.value);
        const c = parseInputNumber(document.getElementById("t_21")?.value);
        const d = parseInputNumber(document.getElementById("t_22")?.value);
        const vx = parseInputNumber(document.getElementById("t_vx")?.value);
        const vy = parseInputNumber(document.getElementById("t_vy")?.value);

        const res = await algebrifyApi("/api/transformations", {
            type: "apply_2d",
            matrixT: [[a, b], [c, d]],
            vectorV: [vx, vy]
        });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Matrix-Vector Mapping (Python Flask Backend):</strong>
                <p>${res.step_top}</p>
                <p>${res.step_bottom}</p>
                <p style="margin-top: 8px;">${res.geometric_note}</p>
            </div>
        `);
    }
}


// ==========================================================================
// 7. CHANGE OF BASIS COORDINATE CONVERTER (MODULE 7)
// ==========================================================================

class ChangeOfBasisCalculator {
    constructor() {
        this.container = document.getElementById("calculator");
        this.resultContainer = document.getElementById("cob-result-box");
        const btn = document.getElementById("cob-calc-btn");
        if (btn || this.resultContainer) this.init();
    }

    init() {
        const btn = document.getElementById("cob-calc-btn");
        if (btn) btn.addEventListener("click", () => this.computeCoordinates());
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async computeCoordinates() {
        const p11 = parseInputNumber(document.getElementById("cob_p11")?.value);
        const p12 = parseInputNumber(document.getElementById("cob_p12")?.value);
        const p21 = parseInputNumber(document.getElementById("cob_p21")?.value);
        const p22 = parseInputNumber(document.getElementById("cob_p22")?.value);
        const x1 = parseInputNumber(document.getElementById("cob_x1")?.value);
        const x2 = parseInputNumber(document.getElementById("cob_x2")?.value);

        const res = await algebrifyApi("/api/transformations", {
            type: "change_of_basis",
            matrixP: [[p11, p12], [p21, p22]],
            vectorX: [x1, x2]
        });

        if (!res.success) {
            this.showResult(`
                <div class="alert-message alert-error">
                    <strong>❌ Invalid Basis:</strong> ${res.error}
                </div>
            `);
            return;
        }

        this.showResult(`
            <div class="math-display">
                ${res.display_math}
            </div>
            <div class="calc-steps">
                <strong>Change of Basis Breakdown (Python Flask Backend):</strong>
                <p>Transition matrix $P = [\\mathbf{u}_1 \\mid \\mathbf{u}_2] = ${res.latex_p}$ with $\\det(P) = ${res.formatted_det}$.</p>
                <p><strong>Linear Combination Verification:</strong></p>
                ${res.verification_math}
            </div>
        `);
    }
}


// ==========================================================================
// 8. GRAM-SCHMIDT ORTHOGONALIZATION CALCULATOR (MODULE 8)
// ==========================================================================

class GramSchmidtCalculator {
    constructor() {
        this.container = document.getElementById("calculator");
        this.resultContainer = document.getElementById("gs-result-box");
        const btn = document.getElementById("gs-calc-btn");
        if (btn || this.resultContainer) this.init();
    }

    init() {
        const btn = document.getElementById("gs-calc-btn");
        if (btn) btn.addEventListener("click", () => this.orthogonalize());
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async orthogonalize() {
        const v1x = parseInputNumber(document.getElementById("gs_v1x")?.value);
        const v1y = parseInputNumber(document.getElementById("gs_v1y")?.value);
        const v2x = parseInputNumber(document.getElementById("gs_v2x")?.value);
        const v2y = parseInputNumber(document.getElementById("gs_v2y")?.value);

        const res = await algebrifyApi("/api/transformations", {
            type: "gram_schmidt",
            v1: [v1x, v1y],
            v2: [v2x, v2y]
        });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error"><strong>❌ Error:</strong> ${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Orthonormal Basis $\{\\mathbf{u}_1, \\mathbf{u}_2\}$ Computed (Python Flask Backend):</h4>
                <div class="math-display">
                    \\[ \\mathbf{u}_1 = ${res.latex_u1}, \\quad \\mathbf{u}_2 = ${res.latex_u2} \\]
                </div>
            </div>
            <div class="calc-steps">
                <h4>Step-by-Step Construction:</h4>
                <p><strong>Step 1:</strong> Set $\\mathbf{w}_1 = \\mathbf{v}_1 = ${res.latex_w1}$.</p>
                <p>Normalize: $\\mathbf{u}_1 = \\frac{\\mathbf{w}_1}{\\|\\mathbf{w}_1\\|} = ${res.latex_u1}$.</p>
                <p style="margin-top: 10px;"><strong>Step 2:</strong> Orthogonal projection of $\\mathbf{v}_2$ onto $\\mathbf{w}_1$:</p>
                \\[ \\text{proj}_{\\mathbf{w}_1}(\\mathbf{v}_2) = ${res.latex_proj} \\]
                <p>Orthogonal vector $\\mathbf{w}_2 = \\mathbf{v}_2 - \\text{proj}_{\\mathbf{w}_1}(\\mathbf{v}_2) = ${res.latex_w2}$.</p>
                <p>Normalize: $\\mathbf{u}_2 = \\frac{\\mathbf{w}_2}{\\|\\mathbf{w}_2\\|} = ${res.latex_u2}$.</p>
            </div>
        `);
    }
}


// ==========================================================================
// 9. DETERMINANT & MATRIX INVERSE TOOL (MODULE 9)
// ==========================================================================

class DeterminantCalculator {
    constructor() {
        this.dim = 3;
        this.grid = document.getElementById("det-matrix-grid");
        this.resultContainer = document.getElementById("det-calc-result");
        if (this.grid || this.resultContainer) this.init();
    }

    init() {
        const dimSelect = document.getElementById("det-dim-select");
        if (dimSelect) {
            dimSelect.addEventListener("change", (e) => {
                this.dim = parseInt(e.target.value, 10);
                this.renderGrid();
            });
        }

        const detBtn = document.getElementById("det-compute-btn");
        const invBtn = document.getElementById("inv-compute-btn");

        if (detBtn) detBtn.addEventListener("click", () => this.computeDet());
        if (invBtn) invBtn.addEventListener("click", () => this.computeInv());

        this.renderGrid();
    }

    renderGrid() {
        if (!this.grid) return;
        this.grid.innerHTML = "";
        this.grid.style.gridTemplateColumns = `repeat(${this.dim}, 55px)`;

        const sampleVals = {
            2: [[3, 8], [4, 6]],
            3: [[1, 2, 3], [0, 1, 4], [5, 6, 0]],
            4: [[1, 0, 2, -1], [3, 0, 0, 5], [2, 1, 4, -3], [1, 0, 5, 0]]
        };

        const currentSample = sampleVals[this.dim] || sampleVals[3];

        for (let r = 0; r < this.dim; r++) {
            for (let c = 0; c < this.dim; c++) {
                const input = document.createElement("input");
                input.type = "number";
                input.id = `det_${r}_${c}`;
                input.value = currentSample[r] && currentSample[r][c] !== undefined ? currentSample[r][c] : (r === c ? 1 : 0);
                input.step = "any";
                input.style.cssText = "width: 52px; height: 44px; text-align: center; font-weight: 700; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-card); color: var(--clr-text); font-size: 1rem;";
                input.addEventListener("focus", () => input.select());
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.computeDet();
                });
                this.grid.appendChild(input);
            }
        }
    }

    getMatrix() {
        const mat = [];
        for (let r = 0; r < this.dim; r++) {
            const row = [];
            for (let c = 0; c < this.dim; c++) {
                const val = parseInputNumber(document.getElementById(`det_${r}_${c}`)?.value);
                row.push(val);
            }
            mat.push(row);
        }
        return mat;
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    async computeDet() {
        const A = this.getMatrix();
        const res = await algebrifyApi("/api/matrix", {
            operation: "determinant",
            matrixA: A
        });

        if (!res.success) {
            this.showResult(`<div class="alert-message alert-error">${res.error}</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ \\det(A) = ${res.vmatrix_latex} = ${res.formatted_det} \\]
            </div>
            <div class="calc-steps">
                <strong>Determinant Interpretation (Python Flask Backend):</strong>
                <p>${res.interpretation}</p>
            </div>
        `);
    }

    async computeInv() {
        const A = this.getMatrix();
        const res = await algebrifyApi("/api/matrix", {
            operation: "inverse",
            matrixA: A
        });

        if (!res.success) {
            this.showResult(`
                <div class="alert-message alert-error">
                    <strong>❌ Matrix is Singular:</strong> ${res.error}
                </div>
            `);
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^{-1} = ${res.latex_result} \\]
            </div>
            <div class="calc-steps">
                <strong>Inverse Verification (Python Flask Backend):</strong>
                <p>${res.explanation}</p>
            </div>
        `);
    }
}

// Auto instantiate
document.addEventListener("DOMContentLoaded", () => {
    window.vectorCalculatorInstance = new VectorCalculator();
    window.linearSystemSolverInstance = new LinearSystemSolver();
    window.eigenSolverInstance = new EigenSolver();
    window.fieldCalculatorInstance = new FieldCalculator();
    window.independenceCheckerInstance = new IndependenceChecker();
    window.transformationExplorerInstance = new TransformationExplorer();
    window.changeOfBasisCalculatorInstance = new ChangeOfBasisCalculator();
    window.gramSchmidtCalculatorInstance = new GramSchmidtCalculator();
    window.determinantCalculatorInstance = new DeterminantCalculator();
});
