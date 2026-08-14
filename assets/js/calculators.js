/**
 * ALGEBRIFY - INTERACTIVE CALCULATORS
 * Vector Calculator, System of Equations Solver (Gauss-Jordan),
 * Determinants & Inverses, Eigenvalues & Eigenvectors.
 */

// ==========================================================================
// MATHEMATICAL FORMATTING & PARSING UTILITIES
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
// 1. VECTOR CALCULATOR
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

    vecToLatex(v) {
        return `\\begin{bmatrix} ${v.map(formatNumber).join(" \\\\ ")} \\end{bmatrix}`;
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    add() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = u.map((val, idx) => val + v[idx]);

        this.showResult(`
            <div class="math-display">
                \\[ \\mathbf{u} + \\mathbf{v} = ${this.vecToLatex(u)} + ${this.vecToLatex(v)} = ${this.vecToLatex(res)} \\]
            </div>
        `);
    }

    subtract() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        const res = u.map((val, idx) => val - v[idx]);

        this.showResult(`
            <div class="math-display">
                \\[ \\mathbf{u} - \\mathbf{v} = ${this.vecToLatex(u)} - ${this.vecToLatex(v)} = ${this.vecToLatex(res)} \\]
            </div>
        `);
    }

    dotProduct() {
        const u = this.getVectorU();
        const v = this.getVectorV();
        let dot = 0;
        const terms = [];

        for (let i = 0; i < u.length; i++) {
            dot += u[i] * v[i];
            terms.push(`(${formatPlainNumber(u[i])} \\cdot ${formatPlainNumber(v[i])})`);
        }

        const isOrthogonal = Math.abs(dot) < 1e-6;

        this.showResult(`
            <div class="math-display">
                \\[ \\mathbf{u} \\cdot \\mathbf{v} = ${terms.join(" + ")} = ${formatNumber(dot)} \\]
            </div>
            <div class="calc-steps">
                <strong>Geometric Analysis:</strong>
                <p>${isOrthogonal 
                    ? "✨ The dot product is <strong>0</strong>: The vectors $\\mathbf{u}$ and $\\mathbf{v}$ are <strong>orthogonal (perpendicular, $90^\\circ$)</strong>." 
                    : (dot > 0 
                        ? `The dot product is positive ($${formatNumber(dot)} > 0$): The angle between them is <strong>acute ($< 90^\\circ$)</strong>.` 
                        : `The dot product is negative ($${formatNumber(dot)} < 0$): The angle between them is <strong>obtuse ($> 90^\\circ$)</strong>.`)}</p>
            </div>
        `);
    }

    crossProduct() {
        if (this.dim !== 3) {
            this.showResult("<div class='alert-message alert-error'>Cross product is only defined in 3-dimensional space (R³).</div>");
            return;
        }

        const u = this.getVectorU();
        const v = this.getVectorV();

        const cx = u[1] * v[2] - u[2] * v[1];
        const cy = u[2] * v[0] - u[0] * v[2];
        const cz = u[0] * v[1] - u[1] * v[0];
        const cross = [cx, cy, cz];
        const area = Math.sqrt(cx*cx + cy*cy + cz*cz);

        this.showResult(`
            <div class="math-display">
                \\[ \\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u.join(" & ")} \\\\ ${v.join(" & ")} \\end{vmatrix} = ${this.vecToLatex(cross)} \\]
            </div>
            <div class="calc-steps">
                <strong>Geometric Meaning:</strong>
                <p>The cross product produces a vector mutually perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$.</p>
                <p>Area of the parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$: $\\|\\mathbf{u} \\times \\mathbf{v}\\| = ${formatNumber(area)}$.</p>
            </div>
        `);
    }

    magnitude() {
        const u = this.getVectorU();
        const v = this.getVectorV();

        const magU = Math.sqrt(u.reduce((acc, val) => acc + val*val, 0));
        const magV = Math.sqrt(v.reduce((acc, val) => acc + val*val, 0));

        this.showResult(`
            <div class="math-display">
                \\[ \\|\\mathbf{u}\\| = \\sqrt{${u.map(x => `(${x})^2`).join(" + ")}} = ${formatNumber(magU)} \\]
            </div>
            <div class="math-display">
                \\[ \\|\\mathbf{v}\\| = \\sqrt{${v.map(x => `(${x})^2`).join(" + ")}} = ${formatNumber(magV)} \\]
            </div>
        `);
    }

    angle() {
        const u = this.getVectorU();
        const v = this.getVectorV();

        const magU = Math.sqrt(u.reduce((acc, val) => acc + val*val, 0));
        const magV = Math.sqrt(v.reduce((acc, val) => acc + val*val, 0));

        if (magU < 1e-7 || magV < 1e-7) {
            this.showResult("<div class='alert-message alert-error'>Cannot compute angle with a zero vector (magnitude = 0).</div>");
            return;
        }

        const dot = u.reduce((acc, val, i) => acc + val * v[i], 0);
        const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
        const rad = Math.acos(cosTheta);
        const deg = (rad * 180) / Math.PI;

        this.showResult(`
            <div class="math-display">
                \\[ \\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = \\frac{${formatNumber(dot)}}{${formatNumber(magU)} \\cdot ${formatNumber(magV)}} = ${formatNumber(cosTheta)} \\]
            </div>
            <div class="calc-steps">
                <strong>Angle $\\theta$:</strong>
                <p>$\\theta = ${formatNumber(deg)}^\\circ$ (${formatNumber(rad)} radians).</p>
            </div>
        `);
    }

    unitVector() {
        const u = this.getVectorU();
        const magU = Math.sqrt(u.reduce((acc, val) => acc + val*val, 0));

        if (magU < 1e-7) {
            this.showResult("<div class='alert-message alert-error'>The zero vector has no defined unit vector.</div>");
            return;
        }

        const unitU = u.map(x => x / magU);

        this.showResult(`
            <div class="math-display">
                \\[ \\hat{\\mathbf{u}} = \\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|} = ${this.vecToLatex(unitU)} \\]
            </div>
            <div class="calc-steps">
                <p>Unit vector has magnitude $\\|\\hat{\\mathbf{u}}\\| = 1$.</p>
            </div>
        `);
    }
}

// ==========================================================================
// 2. SYSTEM OF LINEAR EQUATIONS SOLVER (GAUSS-JORDAN WITH STEPS)
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

        // Header Row (Column Variables + Divider + Constants b)
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

        // Equation Rows
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

    loadPreset() {
        const presets = {
            2: {
                unique: [
                    [2, 1, 5],
                    [1, -1, 1]
                ],
                inconsistent: [
                    [1, 1, 2],
                    [2, 2, 5]
                ],
                infinite: [
                    [1, 1, 2],
                    [2, 2, 4]
                ],
                homogeneous: [
                    [2, 1, 0],
                    [1, -1, 0]
                ]
            },
            3: {
                unique: [
                    [1, 2, 1, 9],
                    [2, -1, 1, 8],
                    [3, 1, -1, 3]
                ],
                inconsistent: [
                    [1, 1, 1, 2],
                    [1, 1, 1, 5],
                    [2, 1, -1, 1]
                ],
                infinite: [
                    [1, 1, 1, 6],
                    [2, 2, 2, 12],
                    [1, 2, 3, 14]
                ],
                homogeneous: [
                    [1, 2, 1, 0],
                    [2, -1, 1, 0],
                    [3, 1, -1, 0]
                ]
            },
            4: {
                unique: [
                    [1, 1, 1, 1, 10],
                    [1, 2, 3, 4, 30],
                    [2, 1, 1, 3, 19],
                    [3, 1, 2, 1, 16]
                ],
                inconsistent: [
                    [1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 2],
                    [1, 2, 1, 1, 3],
                    [0, 1, 1, 1, 4]
                ],
                infinite: [
                    [1, 1, 1, 1, 4],
                    [2, 2, 2, 2, 8],
                    [1, -1, 1, -1, 0],
                    [2, 0, 2, 0, 4]
                ],
                homogeneous: [
                    [1, 1, 1, 1, 0],
                    [1, 2, 3, 4, 0],
                    [2, 1, 1, 3, 0],
                    [3, 1, 2, 1, 0]
                ]
            }
        };

        const currentMap = presets[this.vars] || presets[3];
        const data = currentMap[this.preset] || currentMap.unique;

        const presetLabels = {
            unique: "Preset 1 — Unique Solution",
            inconsistent: "Preset 2 — No Solution (Inconsistent)",
            infinite: "Preset 3 — Infinitely Many Solutions",
            homogeneous: "Preset 4 — Homogeneous System (Ax = 0)"
        };

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

            // Visual feedback pulse on input cells
            const inputs = this.container ? this.container.querySelectorAll(".matrix-cell-input") : [];
            inputs.forEach(input => {
                input.style.borderColor = "var(--clr-accent)";
                input.style.background = "var(--clr-card-alt)";
                setTimeout(() => {
                    input.style.borderColor = "";
                    input.style.background = "";
                }, 350);
            });

            if (showFeedback && this.resultContainer) {
                const label = presetLabels[this.preset] || "Example System";
                this.resultContainer.innerHTML = `
                    <div style="background: rgba(38, 166, 154, 0.1); border-left: 4px solid var(--clr-accent); padding: 14px 18px; border-radius: 8px; margin-bottom: 8px;">
                        <p style="margin: 0; color: var(--clr-text); font-size: 0.95rem;">
                            ✨ <strong>${label}</strong> loaded into the matrix (${this.vars} variables). Click <strong>"Solve with Gauss-Jordan"</strong> below to view the step-by-step row operations.
                        </p>
                    </div>
                `;
            }
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

    solve() {
        const n = this.vars;
        const matrix = [];

        for (let r = 0; r < n; r++) {
            const row = [];
            for (let c = 0; c < n; c++) {
                const val = parseInputNumber(document.getElementById(`sys_${r}_${c}`)?.value);
                row.push(val);
            }
            const bVal = parseInputNumber(document.getElementById(`sys_${r}_b`)?.value);
            row.push(bVal);
            matrix.push(row);
        }

        const steps = [];

        // Format Augmented Matrix to LaTeX with continuous array bracket delimiters
        const formatAugmented = (m) => {
            const lines = m.map(r => {
                const coeff = r.slice(0, n).map(v => formatNumber(v)).join(" & ");
                return `${coeff} & ${formatNumber(r[n])}`;
            });
            const colAlign = "c".repeat(n) + "|c";
            return `\\left[\\begin{array}{${colAlign}} ${lines.join(" \\\\ ")} \\end{array}\\right]`;
        };

        steps.push(`<strong>Initial Augmented Matrix $[A \\mid \\mathbf{b}]$:</strong><div class="math-display">\\[ ${formatAugmented(matrix)} \\]</div>`);

        // Gauss-Jordan Elimination with partial pivoting
        let lead = 0;
        for (let r = 0; r < n; r++) {
            if (lead >= n) break;
            let i = r;

            // Find pivot with largest absolute value for numerical stability
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
                // Swap rows
                const temp = matrix[i];
                matrix[i] = matrix[r];
                matrix[r] = temp;
                steps.push(`<strong>Step: Swap Rows</strong> $R_{${r+1}} \\longleftrightarrow R_{${i+1}}$:<div class="math-display">\\[ ${formatAugmented(matrix)} \\]</div>`);
            }

            const pivot = matrix[r][lead];
            if (Math.abs(pivot - 1) > 1e-9 && Math.abs(pivot) > 1e-9) {
                // Scale pivot row
                for (let j = 0; j <= n; j++) {
                    matrix[r][j] /= pivot;
                }
                steps.push(`<strong>Step: Scale Pivot Row</strong> $R_{${r+1}} \\longleftarrow \\frac{1}{${formatPlainNumber(pivot)}} R_{${r+1}}$:<div class="math-display">\\[ ${formatAugmented(matrix)} \\]</div>`);
            }

            // Eliminate all other entries in column lead
            for (let k = 0; k < n; k++) {
                if (k !== r) {
                    const factor = matrix[k][lead];
                    if (Math.abs(factor) > 1e-9) {
                        for (let j = 0; j <= n; j++) {
                            matrix[k][j] -= factor * matrix[r][j];
                        }
                        const signStr = factor > 0 ? `- ${formatPlainNumber(factor)}` : `+ ${formatPlainNumber(Math.abs(factor))}`;
                        steps.push(`<strong>Step: Eliminate Entry in Row ${k+1}</strong> $R_{${k+1}} \\longleftarrow R_{${k+1}} ${signStr} R_{${r+1}}$:<div class="math-display">\\[ ${formatAugmented(matrix)} \\]</div>`);
                    }
                }
            }
            lead++;
        }

        // Clean small floating point precision residues (< 1e-9 -> 0)
        for (let r = 0; r < n; r++) {
            for (let c = 0; c <= n; c++) {
                if (Math.abs(matrix[r][c]) < 1e-9) matrix[r][c] = 0;
            }
        }

        steps.push(`<strong>Final Reduced Row Echelon Form (RREF):</strong><div class="math-display">\\[ ${formatAugmented(matrix)} \\]</div>`);

        // Check for inconsistency (0 = c where c != 0)
        let inconsistent = false;
        let falseRowIdx = -1;
        for (let r = 0; r < n; r++) {
            const allZeroCoeffs = matrix[r].slice(0, n).every(v => Math.abs(v) < 1e-9);
            if (allZeroCoeffs && Math.abs(matrix[r][n]) > 1e-9) {
                inconsistent = true;
                falseRowIdx = r;
                break;
            }
        }

        if (inconsistent) {
            this.showResult(`
                <div class="alert-message alert-error" style="background: rgba(239, 83, 80, 0.1); border-left: 4px solid var(--clr-error); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong>❌ Inconsistent System (No Solution):</strong> Row ${falseRowIdx + 1} reduces to the contradiction $0 = ${formatPlainNumber(matrix[falseRowIdx][n])}$, which is mathematically impossible. The lines/planes have no common intersection.
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Detailed Elimination Steps:</h4>
                    ${steps.join("")}
                </div>
            `);
            return;
        }

        // Calculate rank of coefficient matrix
        let rank = 0;
        for (let r = 0; r < n; r++) {
            if (!matrix[r].slice(0, n).every(v => Math.abs(v) < 1e-9)) {
                rank++;
            }
        }

        if (rank < n) {
            const freeVars = n - rank;
            this.showResult(`
                <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.1); border-left: 4px solid var(--clr-accent); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                    <strong>♾️ Infinitely Many Solutions:</strong> The system is consistent with $\\text{Rank}(A) = ${rank} < n = ${n}$. There are <strong>${freeVars} free variable(s)</strong> (parameters).
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Detailed Elimination Steps:</h4>
                    ${steps.join("")}
                </div>
            `);
            return;
        }

        // Unique solution
        const varSymbols = ["x", "y", "z", "w"];
        const solBreakdown = matrix.map((row, i) => `${varSymbols[i]} = ${formatNumber(row[n])}`).join(", \\quad ");
        const solVectorLatex = `\\mathbf{x} = \\begin{bmatrix} ${matrix.map(row => formatNumber(row[n])).join(" \\\\ ")} \\end{bmatrix}`;

        this.showResult(`
            <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Solution Found (Unique Solution):</h4>
                <div class="math-display" style="font-size: 1.15rem; margin: 10px 0;">
                    \\[ ${solVectorLatex} \\implies ${solBreakdown} \\]
                </div>
            </div>
            <div class="calc-steps" style="margin-top: 20px;">
                <h4 style="margin-bottom: 12px;"><i data-lucide="list-ordered"></i> Step-by-Step Gauss-Jordan Elimination:</h4>
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
// 3. EIGENVALUES & EIGENVECTORS SOLVER
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

    solve() {
        const A = this.getMatrix();

        if (this.dim === 2) {
            this.solve2x2(A);
        } else {
            this.solve3x3(A);
        }
    }

    solve2x2(A) {
        const a = A[0][0];
        const b = A[0][1];
        const c = A[1][0];
        const d = A[1][1];

        // Characteristic equation: lambda^2 - tr(A)*lambda + det(A) = 0
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;

        if (discriminant < -1e-9) {
            const real = trace / 2;
            const imag = Math.sqrt(-discriminant) / 2;
            this.showResult(`
                <div class="math-display">
                    \\[ \\det(A - \\lambda I) = \\lambda^2 - (${formatPlainNumber(trace)})\\lambda + (${formatPlainNumber(det)}) = 0 \\]
                </div>
                <div class="alert-message alert-info">
                    <strong>Complex Conjugate Eigenvalues:</strong>
                    \\[ \\lambda_1 = ${formatNumber(real)} + ${formatNumber(imag)}i, \\quad \\lambda_2 = ${formatNumber(real)} - ${formatNumber(imag)}i \\]
                    (Represents rotation in the real plane with scaling factor $\\sqrt{\\det(A)} = ${formatNumber(Math.sqrt(det))}$).
                </div>
            `);
            return;
        }

        const sqrtDisc = Math.sqrt(Math.max(0, discriminant));
        const lambda1 = (trace + sqrtDisc) / 2;
        const lambda2 = (trace - sqrtDisc) / 2;

        // Find eigenvectors for lambda1
        const findEigenvector2x2 = (lam) => {
            const m11 = a - lam;
            const m12 = b;
            if (Math.abs(m12) > 1e-7) {
                return [-m12, m11];
            } else if (Math.abs(c) > 1e-7) {
                return [d - lam, -c];
            } else {
                return [1, 0];
            }
        };

        const v1 = findEigenvector2x2(lambda1);
        const v2 = findEigenvector2x2(lambda2);

        this.showResult(`
            <div class="math-display">
                \\[ \\text{Characteristic Equation:} \\quad \\det(A - \\lambda I) = \\lambda^2 - (${formatPlainNumber(trace)})\\lambda + (${formatPlainNumber(det)}) = 0 \\]
            </div>
            <div class="math-display">
                \\[ \\lambda_1 = ${formatNumber(lambda1)}, \\quad \\mathbf{v}_1 = \\begin{bmatrix} ${formatNumber(v1[0])} \\\\ ${formatNumber(v1[1])} \\end{bmatrix} \\]
            </div>
            <div class="math-display">
                \\[ \\lambda_2 = ${formatNumber(lambda2)}, \\quad \\mathbf{v}_2 = \\begin{bmatrix} ${formatNumber(v2[0])} \\\\ ${formatNumber(v2[1])} \\end{bmatrix} \\]
            </div>
            <div class="calc-steps">
                <strong>Diagonalization:</strong>
                <p>Since $\\lambda_1 \\neq \\lambda_2$, Matrix $A$ is diagonalizable: $A = PDP^{-1}$ where:</p>
                \\[ P = \\begin{bmatrix} ${formatNumber(v1[0])} & ${formatNumber(v2[0])} \\\\ ${formatNumber(v1[1])} & ${formatNumber(v2[1])} \\end{bmatrix}, \\quad D = \\begin{bmatrix} ${formatNumber(lambda1)} & 0 \\\\ 0 & ${formatNumber(lambda2)} \\end{bmatrix} \\]
            </div>
        `);
    }

    solve3x3(A) {
        // Trace and determinant for 3x3
        const trace = A[0][0] + A[1][1] + A[2][2];
        const det = (
            A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
            A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
            A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
        );

        this.showResult(`
            <div class="math-display">
                \\[ \\det(A - \\lambda I) = 0 \\]
            </div>
            <div class="calc-steps">
                <p><strong>Trace:</strong> $\\text{tr}(A) = \\lambda_1 + \\lambda_2 + \\lambda_3 = ${formatNumber(trace)}$</p>
                <p><strong>Determinant:</strong> $\\det(A) = \\lambda_1 \\cdot \\lambda_2 \\cdot \\lambda_3 = ${formatNumber(det)}$</p>
                <p>For $3\\times 3$ symmetric matrices, all eigenvalues are guaranteed real (Spectral Theorem).</p>
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
// 4. FIELD ARITHMETIC EXPLORER (COMPLEX NUMBERS & GF(2))
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

    formatComplex(a, b) {
        const tol = 1e-6;
        if (Math.abs(a) < tol && Math.abs(b) < tol) return "0";
        if (Math.abs(b) < tol) return formatNumber(a);
        if (Math.abs(a) < tol) {
            if (Math.abs(b - 1) < tol) return "i";
            if (Math.abs(b + 1) < tol) return "-i";
            return `${formatNumber(b)}i`;
        }
        const aStr = formatNumber(a);
        if (b > 0) {
            const bStr = Math.abs(b - 1) < tol ? "i" : `${formatNumber(b)}i`;
            return `${aStr} + ${bStr}`;
        } else {
            const bStr = Math.abs(b + 1) < tol ? "i" : `${formatNumber(Math.abs(b))}i`;
            return `${aStr} - ${bStr}`;
        }
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    add() {
        const type = this.getFieldType();
        if (type === "gf2") {
            const { x, y } = this.getGF2Inputs();
            const sum = (x + y) % 2;
            this.showResult(`
                <div class="math-display">
                    \\[ x \\oplus y = ${x} + ${y} \\equiv ${sum} \\pmod{2} \\]
                </div>
                <div class="calc-steps">
                    <strong>Galois Field $\\text{GF}(2)$ Addition (XOR):</strong>
                    <p>In $\\text{GF}(2)$, addition is modulo 2 arithmetic: $1 + 1 = 0$, meaning every element is its own additive inverse ($\\text{char}(\\text{GF}(2)) = 2$).</p>
                </div>
            `);
        } else {
            const { a1, b1, a2, b2 } = this.getComplexInputs();
            const real = a1 + a2;
            const imag = b1 + b2;
            const z1Str = `(${this.formatComplex(a1, b1)})`;
            const z2Str = `(${this.formatComplex(a2, b2)})`;
            const resStr = this.formatComplex(real, imag);

            this.showResult(`
                <div class="math-display">
                    \\[ z_1 + z_2 = ${z1Str} + ${z2Str} = ${resStr} \\]
                </div>
                <div class="calc-steps">
                    <strong>Complex Addition Rule:</strong>
                    <p>Add real parts and imaginary parts separately: $(a + c) + (b + d)i = (${formatPlainNumber(a1)} + ${formatPlainNumber(a2)}) + (${formatPlainNumber(b1)} + ${formatPlainNumber(b2)})i = ${resStr}$.</p>
                </div>
            `);
        }
    }

    multiply() {
        const type = this.getFieldType();
        if (type === "gf2") {
            const { x, y } = this.getGF2Inputs();
            const prod = (x * y) % 2;
            this.showResult(`
                <div class="math-display">
                    \\[ x \\cdot y = ${x} \\cdot ${y} \\equiv ${prod} \\pmod{2} \\]
                </div>
                <div class="calc-steps">
                    <strong>Galois Field $\\text{GF}(2)$ Multiplication (AND):</strong>
                    <p>In $\\text{GF}(2)$, multiplication is standard modulo 2 multiplication. $1$ is the multiplicative identity, and $0$ is the absorbing element.</p>
                </div>
            `);
        } else {
            const { a1, b1, a2, b2 } = this.getComplexInputs();
            const real = a1 * a2 - b1 * b2;
            const imag = a1 * b2 + b1 * a2;
            const z1Str = `(${this.formatComplex(a1, b1)})`;
            const z2Str = `(${this.formatComplex(a2, b2)})`;
            const resStr = this.formatComplex(real, imag);

            this.showResult(`
                <div class="math-display">
                    \\[ z_1 \\cdot z_2 = ${z1Str} \\cdot ${z2Str} = ${resStr} \\]
                </div>
                <div class="calc-steps">
                    <strong>Complex Multiplication Breakdown ($i^2 = -1$):</strong>
                    <p>$(ac - bd) + (ad + bc)i = (${formatPlainNumber(a1)}\\cdot${formatPlainNumber(a2)} - (${formatPlainNumber(b1)})(${formatPlainNumber(b2)})) + (${formatPlainNumber(a1)}\\cdot(${formatPlainNumber(b2)}) + (${formatPlainNumber(b1)})\\cdot${formatPlainNumber(a2)})i = ${resStr}$.</p>
                </div>
            `);
        }
    }

    inverse() {
        const type = this.getFieldType();
        if (type === "gf2") {
            const { x } = this.getGF2Inputs();
            if (x === 0) {
                this.showResult(`
                    <div class="alert-message alert-error">
                        <strong>❌ Arithmetic Error:</strong> The additive identity $0$ has no multiplicative inverse in $\\text{GF}(2)$ (division by zero is undefined).
                    </div>
                `);
                return;
            }
            this.showResult(`
                <div class="math-display">
                    \\[ x^{-1} = 1^{-1} = 1 \\quad (\\text{since } 1 \\cdot 1 = 1) \\]
                </div>
                <div class="calc-steps">
                    <strong>Multiplicative Inverse in $\\text{GF}(2)$:</strong>
                    <p>The non-zero element $1$ is its own multiplicative inverse in $\\text{GF}(2)$.</p>
                </div>
            `);
        } else {
            const { a1, b1 } = this.getComplexInputs();
            const denom = a1 * a1 + b1 * b1;
            if (Math.abs(denom) < 1e-9) {
                this.showResult(`
                    <div class="alert-message alert-error">
                        <strong>❌ Arithmetic Error:</strong> The additive identity $z_1 = 0$ has no multiplicative inverse in $\\mathbb{C}$ (division by zero is undefined).
                    </div>
                `);
                return;
            }

            const invReal = a1 / denom;
            const invImag = -b1 / denom;
            const z1Str = this.formatComplex(a1, b1);
            const resStr = this.formatComplex(invReal, invImag);

            this.showResult(`
                <div class="math-display">
                    \\[ z_1^{-1} = \\frac{\\bar{z}_1}{|z_1|^2} = \\frac{${formatPlainNumber(a1)} - (${formatPlainNumber(b1)})i}{${formatPlainNumber(a1)}^2 + (${formatPlainNumber(b1)})^2} = ${resStr} \\]
                </div>
                <div class="calc-steps">
                    <strong>Complex Multiplicative Inverse:</strong>
                    <p>Modulus squared $|z_1|^2 = a^2 + b^2 = ${formatNumber(denom)}$. Complex conjugate $\\bar{z}_1 = ${formatPlainNumber(a1)} ${b1 >= 0 ? '-' : '+'} ${formatPlainNumber(Math.abs(b1))}i$.</p>
                    <p>Verification: $z_1 \\cdot z_1^{-1} = (${z1Str})(${resStr}) = 1$.</p>
                </div>
            `);
        }
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

    computeRank(matrix) {
        const mat = matrix.map(r => [...r]);
        const R = mat.length;
        const C = mat[0].length;
        let rank = C;

        for (let row = 0; row < rank; row++) {
            if (Math.abs(mat[row][row]) > 1e-9) {
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
                    if (Math.abs(mat[i][row]) > 1e-9) {
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

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    check() {
        const { v1, v2, v3 } = this.getVectors();

        // Form matrix with vectors as columns
        const matrix = [
            [v1[0], v2[0], v3[0]],
            [v1[1], v2[1], v3[1]],
            [v1[2], v2[2], v3[2]]
        ];

        // 3x3 Determinant
        const det = (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );

        const rank = this.computeRank(matrix);
        const isIndependent = Math.abs(det) > 1e-7 && rank === 3;

        const matLatex = `\\begin{bmatrix} ${formatPlainNumber(v1[0])} & ${formatPlainNumber(v2[0])} & ${formatPlainNumber(v3[0])} \\\\ ${formatPlainNumber(v1[1])} & ${formatPlainNumber(v2[1])} & ${formatPlainNumber(v3[1])} \\\\ ${formatPlainNumber(v1[2])} & ${formatPlainNumber(v2[2])} & ${formatPlainNumber(v3[2])} \\end{bmatrix}`;

        let spanDescription = "";
        if (rank === 3) {
            spanDescription = "Entire 3-dimensional space $\\mathbb{R}^3$ (Volume > 0).";
        } else if (rank === 2) {
            spanDescription = "A <strong>2D plane</strong> passing through the origin in $\\mathbb{R}^3$.";
        } else if (rank === 1) {
            spanDescription = "A <strong>1D line</strong> passing through the origin in $\\mathbb{R}^3$.";
        } else {
            spanDescription = "The trivial subspace $\\{\\mathbf{0}\\}$ (Point at the origin).";
        }

        if (isIndependent) {
            this.showResult(`
                <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Result: Linearly Independent & Forms a Basis for $\\mathbb{R}^3$</h4>
                    <p style="margin: 0; font-size: 0.95rem;">
                        The vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ are <strong>linearly independent</strong> and span $\\mathbb{R}^3$. Since $\\dim(\\mathbb{R}^3) = 3$ and we have 3 linearly independent vectors, they form a <strong>valid Basis for $\\mathbb{R}^3$</strong>.
                    </p>
                </div>
                <div class="math-display">
                    \\[ A = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\mathbf{v}_3] = ${matLatex}, \\quad \\det(A) = ${formatNumber(det)} \\neq 0 \\]
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Analysis Summary:</h4>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li><strong>Matrix Rank:</strong> $\\text{Rank}(A) = 3$ (Full Rank).</li>
                        <li><strong>Spanned Subspace:</strong> ${spanDescription}</li>
                        <li><strong>Linear Combination:</strong> $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 + c_3 \\mathbf{v}_3 = \\mathbf{0} \\implies c_1 = c_2 = c_3 = 0$ (Only the trivial solution exists).</li>
                    </ul>
                </div>
            `);
        } else {
            this.showResult(`
                <div class="alert-message alert-error" style="background: rgba(239, 83, 80, 0.1); border-left: 4px solid var(--clr-error); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="margin-bottom: 8px; color: var(--clr-error);"><i data-lucide="alert-triangle"></i> Result: Linearly Dependent (Does NOT Form a Basis for $\\mathbb{R}^3$)</h4>
                    <p style="margin: 0; font-size: 0.95rem;">
                        The vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ are <strong>linearly dependent</strong> (redundant). At least one vector can be written as a linear combination of the others.
                    </p>
                </div>
                <div class="math-display">
                    \\[ A = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\mathbf{v}_3] = ${matLatex}, \\quad \\det(A) = 0 \\]
                </div>
                <div class="calc-steps" style="margin-top: 16px;">
                    <h4>Analysis Summary:</h4>
                    <ul style="line-height: 1.8; margin-left: 20px;">
                        <li><strong>Matrix Rank:</strong> $\\text{Rank}(A) = ${rank} < 3$ (Rank-deficient).</li>
                        <li><strong>Dimension of Spanned Subspace:</strong> $\\dim(\\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}) = ${rank}$.</li>
                        <li><strong>Geometric Subspace:</strong> ${spanDescription}</li>
                        <li><strong>Basis Status:</strong> Cannot form a basis for $\\mathbb{R}^3$ because $\\text{Rank} < 3$.</li>
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

        // Presets
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

        const inputIds = ["t_11", "t_12", "t_21", "t_22", "t_vx", "t_vy"];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("focus", () => el.select());
                el.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.applyTransformation();
                });
            }
        });
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    applyTransformation() {
        const a = parseInputNumber(document.getElementById("t_11")?.value);
        const b = parseInputNumber(document.getElementById("t_12")?.value);
        const c = parseInputNumber(document.getElementById("t_21")?.value);
        const d = parseInputNumber(document.getElementById("t_22")?.value);

        const vx = parseInputNumber(document.getElementById("t_vx")?.value);
        const vy = parseInputNumber(document.getElementById("t_vy")?.value);

        const wx = a * vx + b * vy;
        const wy = c * vx + d * vy;

        const det = a * d - b * c;

        let geometricNote = "";
        if (Math.abs(det) < 1e-9) {
            geometricNote = "⚠️ <strong>Singular Transformation ($\det([T]) = 0$):</strong> The mapping collapses 2D area into a 1D line or point. $\\text{Nullity}(T) \\ge 1$, so $T$ is non-invertible.";
        } else {
            const orientation = det > 0 ? "Preserves orientation" : "Reverses orientation (Reflection component)";
            geometricNote = `✨ <strong>Invertible Isomorphism ($\det([T]) = ${formatNumber(det)} \\neq 0$):</strong> Area scaling factor $= |\\det([T])| = ${formatNumber(Math.abs(det))}$. ${orientation}.`;
        }

        this.showResult(`
            <div class="math-display">
                \\[ T(\\mathbf{v}) = [T]\\mathbf{v} = \\begin{bmatrix} ${formatPlainNumber(a)} & ${formatPlainNumber(b)} \\\\ ${formatPlainNumber(c)} & ${formatPlainNumber(d)} \\end{bmatrix} \\begin{bmatrix} ${formatPlainNumber(vx)} \\\\ ${formatPlainNumber(vy)} \\end{bmatrix} = \\begin{bmatrix} ${formatNumber(wx)} \\\\ ${formatNumber(wy)} \\end{bmatrix} \\]
            </div>
            <div class="calc-steps">
                <strong>Step-by-Step Matrix-Vector Mapping:</strong>
                <p>Top entry: $(${formatPlainNumber(a)} \\cdot ${formatPlainNumber(vx)}) + (${formatPlainNumber(b)} \\cdot ${formatPlainNumber(vy)}) = ${formatNumber(wx)}$</p>
                <p>Bottom entry: $(${formatPlainNumber(c)} \\cdot ${formatPlainNumber(vx)}) + (${formatPlainNumber(d)} \\cdot ${formatPlainNumber(vy)}) = ${formatNumber(wy)}$</p>
                <p style="margin-top: 8px;">${geometricNote}</p>
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

        const inputIds = ["cob_p11", "cob_p12", "cob_p21", "cob_p22", "cob_x1", "cob_x2"];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("focus", () => el.select());
                el.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.computeCoordinates();
                });
            }
        });
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    computeCoordinates() {
        const p11 = parseInputNumber(document.getElementById("cob_p11")?.value);
        const p12 = parseInputNumber(document.getElementById("cob_p12")?.value);
        const p21 = parseInputNumber(document.getElementById("cob_p21")?.value);
        const p22 = parseInputNumber(document.getElementById("cob_p22")?.value);

        const x1 = parseInputNumber(document.getElementById("cob_x1")?.value);
        const x2 = parseInputNumber(document.getElementById("cob_x2")?.value);

        const det = p11 * p22 - p12 * p21;

        if (Math.abs(det) < 1e-9) {
            this.showResult(`
                <div class="alert-message alert-error">
                    <strong>❌ Invalid Basis:</strong> The matrix $P = \\begin{bmatrix} ${formatPlainNumber(p11)} & ${formatPlainNumber(p12)} \\\\ ${formatPlainNumber(p21)} & ${formatPlainNumber(p22)} \\end{bmatrix}$ has $\\det(P) = 0$. The vectors $\\mathbf{u}_1, \\mathbf{u}_2$ are linearly dependent and do not form a basis for $\\mathbb{R}^2$.
                </div>
            `);
            return;
        }

        // P^-1 = (1/det) * [[p22, -p12], [-p21, p11]]
        const inv11 = p22 / det;
        const inv12 = -p12 / det;
        const inv21 = -p21 / det;
        const inv22 = p11 / det;

        // [x]_{B'} = P^-1 * [x]_B
        const c1 = inv11 * x1 + inv12 * x2;
        const c2 = inv21 * x1 + inv22 * x2;

        this.showResult(`
            <div class="math-display">
                \\[ [\\mathbf{x}]_{B'} = P^{-1}[\\mathbf{x}]_B = \\begin{bmatrix} ${formatNumber(inv11)} & ${formatNumber(inv12)} \\\\ ${formatNumber(inv21)} & ${formatNumber(inv22)} \\end{bmatrix} \\begin{bmatrix} ${formatPlainNumber(x1)} \\\\ ${formatPlainNumber(x2)} \\end{bmatrix} = \\begin{bmatrix} ${formatNumber(c1)} \\\\ ${formatNumber(c2)} \\end{bmatrix} \\]
            </div>
            <div class="calc-steps">
                <strong>Change of Basis Breakdown:</strong>
                <p>Transition matrix $P = [\\mathbf{u}_1 \\mid \\mathbf{u}_2] = \\begin{bmatrix} ${formatPlainNumber(p11)} & ${formatPlainNumber(p12)} \\\\ ${formatPlainNumber(p21)} & ${formatPlainNumber(p22)} \\end{bmatrix}$ with $\\det(P) = ${formatNumber(det)}$.</p>
                <p><strong>Linear Combination Verification:</strong></p>
                \\[ ${formatNumber(c1)} \\begin{bmatrix} ${formatPlainNumber(p11)} \\\\ ${formatPlainNumber(p21)} \\end{bmatrix} + ${formatNumber(c2)} \\begin{bmatrix} ${formatPlainNumber(p12)} \\\\ ${formatPlainNumber(p22)} \\end{bmatrix} = \\begin{bmatrix} ${formatPlainNumber(x1)} \\\\ ${formatPlainNumber(x2)} \\end{bmatrix} = \\mathbf{x} \\]
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

        const inputIds = ["gs_v1x", "gs_v1y", "gs_v2x", "gs_v2y"];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("focus", () => el.select());
                el.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.orthogonalize();
                });
            }
        });
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    orthogonalize() {
        const v1x = parseInputNumber(document.getElementById("gs_v1x")?.value);
        const v1y = parseInputNumber(document.getElementById("gs_v1y")?.value);
        const v2x = parseInputNumber(document.getElementById("gs_v2x")?.value);
        const v2y = parseInputNumber(document.getElementById("gs_v2y")?.value);

        const normSqV1 = v1x * v1x + v1y * v1y;
        if (normSqV1 < 1e-9) {
            this.showResult(`<div class="alert-message alert-error"><strong>❌ Error:</strong> $\\mathbf{v}_1$ cannot be the zero vector.</div>`);
            return;
        }

        const det = v1x * v2y - v1y * v2x;
        if (Math.abs(det) < 1e-9) {
            this.showResult(`<div class="alert-message alert-error"><strong>❌ Error:</strong> The vectors $\\mathbf{v}_1$ and $\\mathbf{v}_2$ are linearly dependent. Gram-Schmidt requires a linearly independent set.</div>`);
            return;
        }

        // Step 1: w1 = v1
        const w1x = v1x;
        const w1y = v1y;
        const normW1 = Math.sqrt(w1x * w1x + w1y * w1y);
        const u1x = w1x / normW1;
        const u1y = w1y / normW1;

        // Step 2: w2 = v2 - ( <v2, w1> / ||w1||^2 ) * w1
        const dotV2W1 = v2x * w1x + v2y * w1y;
        const projFactor = dotV2W1 / normSqV1;
        const projX = projFactor * w1x;
        const projY = projFactor * w1y;

        const w2x = v2x - projX;
        const w2y = v2y - projY;
        const normW2 = Math.sqrt(w2x * w2x + w2y * w2y);
        const u2x = w2x / normW2;
        const u2y = w2y / normW2;

        this.showResult(`
            <div class="alert-message alert-info" style="background: rgba(38, 166, 154, 0.12); border-left: 4px solid var(--clr-accent); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="margin-bottom: 8px; color: var(--clr-accent-dark);"><i data-lucide="check-circle-2"></i> Orthonormal Basis $\{\\mathbf{u}_1, \\mathbf{u}_2\}$ Computed:</h4>
                <div class="math-display">
                    \\[ \\mathbf{u}_1 = \\begin{bmatrix} ${formatNumber(u1x)} \\\\ ${formatNumber(u1y)} \\end{bmatrix}, \\quad \\mathbf{u}_2 = \\begin{bmatrix} ${formatNumber(u2x)} \\\\ ${formatNumber(u2y)} \\end{bmatrix} \\]
                </div>
            </div>
            <div class="calc-steps">
                <h4>Step-by-Step Construction:</h4>
                <p><strong>Step 1:</strong> Set $\\mathbf{w}_1 = \\mathbf{v}_1 = \\begin{bmatrix} ${formatPlainNumber(v1x)} \\\\ ${formatPlainNumber(v1y)} \\end{bmatrix}$.</p>
                <p>Normalize: $\\mathbf{u}_1 = \\frac{\\mathbf{w}_1}{\\|\\mathbf{w}_1\\|} = \\frac{1}{${formatNumber(normW1)}} \\begin{bmatrix} ${formatPlainNumber(w1x)} \\\\ ${formatPlainNumber(w1y)} \\end{bmatrix} = \\begin{bmatrix} ${formatNumber(u1x)} \\\\ ${formatNumber(u1y)} \\end{bmatrix}$.</p>
                <p style="margin-top: 10px;"><strong>Step 2:</strong> Orthogonal projection of $\\mathbf{v}_2$ onto $\\mathbf{w}_1$:</p>
                \\[ \\text{proj}_{\\mathbf{w}_1}(\\mathbf{v}_2) = \\frac{\\langle \\mathbf{v}_2, \\mathbf{w}_1 \\rangle}{\\|\\mathbf{w}_1\\|^2} \\mathbf{w}_1 = \\frac{${formatNumber(dotV2W1)}}{${formatNumber(normSqV1)}} \\begin{bmatrix} ${formatPlainNumber(w1x)} \\\\ ${formatPlainNumber(w1y)} \\end{bmatrix} = \\begin{bmatrix} ${formatNumber(projX)} \\\\ ${formatNumber(projY)} \\end{bmatrix} \\]
                <p>Orthogonal vector $\\mathbf{w}_2 = \\mathbf{v}_2 - \\text{proj}_{\\mathbf{w}_1}(\\mathbf{v}_2) = \\begin{bmatrix} ${formatNumber(w2x)} \\\\ ${formatNumber(w2y)} \\end{bmatrix}$.</p>
                <p>Normalize: $\\mathbf{u}_2 = \\frac{\\mathbf{w}_2}{\\|\\mathbf{w}_2\\|} = \\frac{1}{${formatNumber(normW2)}} \\begin{bmatrix} ${formatNumber(w2x)} \\\\ ${formatNumber(w2y)} \\end{bmatrix} = \\begin{bmatrix} ${formatNumber(u2x)} \\\\ ${formatNumber(u2y)} \\end{bmatrix}$.</p>
                <p style="margin-top: 10px;"><strong>Orthogonality Verification:</strong> $\\langle \\mathbf{u}_1, \\mathbf{u}_2 \\rangle = (${formatNumber(u1x)})(${formatNumber(u2x)}) + (${formatNumber(u1y)})(${formatNumber(u2y)}) = 0$.</p>
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

    calculateDet(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let j = 0; j < n; j++) {
            const sub = matrix.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
            const cofactor = (j % 2 === 0 ? 1 : -1) * matrix[0][j] * this.calculateDet(sub);
            det += cofactor;
        }
        return det;
    }

    matrixToLatex(matrix) {
        const rows = matrix.map(r => r.map(v => formatNumber(v)).join(" & "));
        return `\\begin{bmatrix} ${rows.join(" \\\\ ")} \\end{bmatrix}`;
    }

    showResult(html) {
        if (!this.resultContainer) return;
        this.resultContainer.innerHTML = html;
        if (typeof renderAllMath === "function") renderAllMath(this.resultContainer);
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    computeDet() {
        const A = this.getMatrix();
        const det = this.calculateDet(A);

        const vmatrixLatex = `\\begin{vmatrix} ${A.map(r => r.map(v => formatPlainNumber(v)).join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;

        this.showResult(`
            <div class="math-display">
                \\[ \\det(A) = ${vmatrixLatex} = ${formatNumber(det)} \\]
            </div>
            <div class="calc-steps">
                <strong>Determinant Interpretation:</strong>
                <p>${Math.abs(det) > 1e-9 
                    ? `✨ Non-zero determinant ($\\det(A) = ${formatNumber(det)} \\neq 0$): Matrix $A$ is <strong>invertible (non-singular)</strong> and has full rank ($${this.dim}$).` 
                    : `⚠️ Zero determinant ($\\det(A) = 0$): Matrix $A$ is <strong>singular (non-invertible)</strong> with linearly dependent columns.`}</p>
            </div>
        `);
    }

    computeInv() {
        const A = this.getMatrix();
        const det = this.calculateDet(A);

        if (Math.abs(det) < 1e-9) {
            this.showResult(`
                <div class="alert-message alert-error">
                    <strong>❌ Matrix is Singular:</strong> $\\det(A) = 0$. Non-invertible matrices have no multiplicative inverse ($A^{-1}$ does not exist).
                </div>
            `);
            return;
        }

        const inv = this.calculateInverse(A);
        if (!inv) {
            this.showResult(`<div class="alert-message alert-error">Could not compute inverse for this matrix.</div>`);
            return;
        }

        this.showResult(`
            <div class="math-display">
                \\[ A^{-1} = ${this.matrixToLatex(inv)} \\]
            </div>
            <div class="calc-steps">
                <strong>Inverse Verification:</strong>
                <p>Since $\\det(A) = ${formatNumber(det)} \\neq 0$, the inverse satisfies $A \\cdot A^{-1} = I_{${this.dim}}$.</p>
            </div>
        `);
    }

    calculateInverse(matrix) {
        const n = matrix.length;
        const aug = [];
        for (let i = 0; i < n; i++) {
            const row = [...matrix[i]];
            for (let j = 0; j < n; j++) aug.push(i === j ? 1 : 0);
            aug.push(row);
        }

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
            }
            if (Math.abs(aug[maxRow][i]) < 1e-9) return null;

            const temp = aug[i];
            aug[i] = aug[maxRow];
            aug[maxRow] = temp;

            const pivot = aug[i][i];
            for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;

            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = aug[k][i];
                    for (let j = 0; j < 2 * n; j++) aug[k][j] -= factor * aug[i][j];
                }
            }
        }

        const inv = [];
        for (let i = 0; i < n; i++) inv.push(aug[i].slice(n));
        return inv;
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
