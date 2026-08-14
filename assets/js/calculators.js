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

// Auto instantiate
document.addEventListener("DOMContentLoaded", () => {
    window.vectorCalculatorInstance = new VectorCalculator();
    window.linearSystemSolverInstance = new LinearSystemSolver();
    window.eigenSolverInstance = new EigenSolver();
});
