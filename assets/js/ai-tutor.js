/**
 * ALGEBRIFY - CHATGPT-STYLE AI LINEAR ALGEBRA TUTOR
 * Live Generative AI (Gemini 2.0/1.5 Flash, OpenAI GPT-4o-mini, Groq Llama 3.3, OpenRouter)
 * + Dynamic Step-by-Step Symbolic Math Solver & Pedagogical Reasoning Engine
 * + Full Multi-turn Conversational Memory & Persistent Session Management
 */

const SYSTEM_PROMPT = `
You are the official Algebrify Linear Algebra AI Tutor. You are friendly, patient, encouraging, mathematically rigorous, and an exceptional teacher for Class 11-12 and undergraduate mathematics students.

CORE TUTORING PRINCIPLES:
1. STEP-BY-STEP PROBLEM SOLVING:
   - Understand and acknowledge the user's specific problem.
   - State clearly: (1) What is given, (2) The concept/method used, (3) Each calculation step with intermediate arithmetic, (4) The final answer under "**Final Answer:**".
   - Explain WHY each operation (row operation, cofactor expansion, basis substitution) is performed.

2. TEACHING & CONCEPTUAL EXPLANATIONS:
   Structure conceptual questions (e.g., "What is a matrix?", "Explain Gaussian elimination", "What is the difference between span and basis?") into clear sections:
   - **Intuition in Simple Words** (Beginner-friendly geometric or real-world insight)
   - **Formal Definition** (Textbook mathematical definition)
   - **Mathematical Formulation & KaTeX Formulas**
   - **Step-by-Step Worked Example**
   - **Key Takeaway / Summary**

3. CONVERSATIONAL MEMORY & FOLLOW-UP ADAPTATION:
   - When the user asks a follow-up (e.g., "Can you give me an example?", "Why is it zero?"), resolve "it" based on the previous turns.
   - When the user expresses confusion (e.g., "I still don't understand", "Can you explain that in simpler words?"), re-explain using simpler intuitive analogies rather than repeating the same formal text.

4. SCOPE & MATHEMATICAL NOTATION:
   - Focus on Linear Algebra (Matrices, Systems of Equations, Fields, Vectors, Vector Spaces, Linear Transformations, Transformation Matrices, Inner Product Spaces, Determinants, Eigenvalues & Diagonalization).
   - ALWAYS format equations and matrices using standard LaTeX delimiters: $...$ for inline math and $$...$$ for display math.
   - Format matrices as \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}.
`;

// =============================================================================
// DYNAMIC LINEAR ALGEBRA REASONING & PEDAGOGICAL ENGINE
// (Provides dynamic, contextual, step-by-step responses offline or without API key)
// =============================================================================

class LinearAlgebraReasoningEngine {
    constructor() {
        this.topicRegistry = {
            "matrices": {
                title: "Algebra of Matrices",
                keywords: ["matrix", "matrices", "transpose", "symmetric", "skew-symmetric", "orthogonal matrix", "identity matrix", "diagonal matrix", "trace", "matrix multiplication", "matrix addition", "order of matrix", "row matrix", "column matrix"],
                definition: {
                    what: "A **matrix** is a rectangular arrangement (or 2D grid) of numbers, symbols, or expressions arranged in horizontal **rows** and vertical **columns**.",
                    order: "If a matrix has $m$ rows and $n$ columns, its **order (or dimension)** is written as $m \\times n$ (read as '$m$ by $n$').",
                    notation: "A general matrix $A$ of order $m \\times n$ is represented as:\n$$ A = \\begin{bmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\ a_{21} & a_{22} & \\dots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\dots & a_{mn} \\end{bmatrix} = [a_{ij}]_{m \\times n} $$ where $a_{ij}$ is the entry in row $i$ and column $j$.",
                    example: "For example, $A = \\begin{bmatrix} 2 & -1 & 5 \\\\ 0 & 4 & 3 \\end{bmatrix}$ is a matrix of order $2 \\times 3$ with $2$ rows and $3$ columns.",
                    intuition: "Think of a matrix as a compact way to store and transform multiple interconnected pieces of data at once—such as the coefficients in a system of linear equations or a transformation that stretches, rotates, and scales space."
                }
            },
            "linear-systems": {
                title: "Systems of Linear Equations",
                keywords: ["system of linear equations", "linear system", "gaussian elimination", "gauss-jordan", "echelon form", "row echelon", "rref", "augmented matrix", "row operations", "homogeneous", "cramer", "consistency", "inconsistent", "free variable", "pivot"],
                definition: {
                    what: "A **system of linear equations** is a collection of one or more linear equations involving the same set of variables.",
                    form: "A system of $m$ linear equations in $n$ variables $x_1, x_2, \\dots, x_n$ is written in matrix form as:\n$$ A\\mathbf{x} = \\mathbf{b} $$ where $A_{m \\times n}$ is the coefficient matrix, $\\mathbf{x}_{n \\times 1}$ is the variable vector, and $\\mathbf{b}_{m \\times 1}$ is the constant vector.",
                    intuition: "Solving $A\\mathbf{x} = \\mathbf{b}$ means finding the intersection of hyperplanes, or finding the exact combination of the columns of $A$ that produces the target vector $\\mathbf{b}$."
                }
            },
            "fields": {
                title: "Field Axioms & Galois Fields",
                keywords: ["field", "fields", "galois field", "gf(2)", "characteristic", "abelian", "field axioms", "closure", "additive inverse", "multiplicative inverse"],
                definition: {
                    what: "A **field** $\\mathbb{F} = (F, +, \\cdot)$ is an algebraic structure consisting of a set $F$ equipped with two operations: **addition ($+$)** and **multiplication ($\\cdot$)**, satisfying 11 fundamental axioms.",
                    axioms: "1. **Closure:** $a+b \\in F$ and $a \\cdot b \\in F$\n2. **Associativity:** $(a+b)+c = a+(b+c)$ and $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$\n3. **Commutativity:** $a+b = b+a$ and $a \\cdot b = b \\cdot a$\n4. **Identities:** Additive identity $0$ and Multiplicative identity $1 \\neq 0$\n5. **Inverses:** Additive inverse $-a$ and Multiplicative inverse $a^{-1}$ (for $a \\neq 0$)\n6. **Distributivity:** $a \\cdot (b + c) = a \\cdot b + a \\cdot c$",
                    examples: "Standard fields include $\\mathbb{R}$ (Real numbers), $\\mathbb{C}$ (Complex numbers), $\\mathbb{Q}$ (Rational numbers), and the finite field $\\text{GF}(2) = \\{0, 1\\}$ where arithmetic is modulo $2$ ($1 + 1 = 0$)."
                }
            },
            "vectors": {
                title: "Vectors & Operations",
                keywords: ["vector", "vectors", "dot product", "cross product", "scalar product", "vector product", "magnitude", "norm", "unit vector", "angle between vectors", "projection"],
                definition: {
                    what: "A **vector** is a mathematical object that possesses both **magnitude (length)** and **direction**. In $\\mathbb{R}^n$, an algebraic vector is an ordered $n$-tuple of real numbers $\\mathbf{v} = (v_1, v_2, \\dots, v_n)$.",
                    dotProduct: "The **dot product (inner product)** of $\\mathbf{u} = (u_1, u_2, \\dots, u_n)$ and $\\mathbf{v} = (v_1, v_2, \\dots, v_n)$ is:\n$$ \\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta $$",
                    magnitude: "The **magnitude (Euclidean norm)** is $\\|\\mathbf{v}\\| = \\sqrt{v_1^2 + v_2^2 + \\dots + v_n^2} = \\sqrt{\\mathbf{v} \\cdot \\mathbf{v}}$."
                }
            },
            "vector-spaces": {
                title: "Vector Spaces & Subspaces",
                keywords: ["vector space", "subspace", "span", "spanning", "linear combination", "linear independence", "linearly independent", "linearly dependent", "basis", "dimension", "subspaces"],
                definition: {
                    what: "A **vector space** $V$ over a field $\\mathbb{F}$ is a non-empty set of objects (called vectors) on which two operations are defined: **vector addition** and **scalar multiplication**, satisfying the 8 vector space axioms.",
                    subspace: "A non-empty subset $W \\subseteq V$ is called a **subspace** if $W$ is itself a vector space under the same operations. This is tested using the **3-Step Subspace Test**:\n1. **Zero Vector:** $\\mathbf{0} \\in W$\n2. **Closure under Addition:** $\\mathbf{u}, \\mathbf{v} \\in W \\implies \\mathbf{u} + \\mathbf{v} \\in W$\n3. **Closure under Scalar Multiplication:** $c \\in \\mathbb{F}, \\mathbf{u} \\in W \\implies c\\mathbf{u} \\in W$."
                }
            },
            "linear-transformations": {
                title: "Linear Transformations",
                keywords: ["linear transformation", "linear map", "linear mapping", "kernel", "null space", "image", "range", "rank-nullity", "rank-nullity theorem", "dimension theorem", "injective", "surjective", "isomorphism"],
                definition: {
                    what: "A function $T: V \\to W$ between two vector spaces over the same field $\\mathbb{F}$ is called a **linear transformation** if it preserves addition and scalar multiplication for all $\\mathbf{u}, \\mathbf{v} \\in V$ and $c \\in \\mathbb{F}$:\n1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$\n2. $T(c\\mathbf{u}) = cT(\\mathbf{u})$",
                    kernelImage: "**Kernel (Null Space):** $\\ker(T) = \\{\\mathbf{v} \\in V \\mid T(\\mathbf{v}) = \\mathbf{0}_W\\}$\n**Image (Range):** $\\text{Im}(T) = \\{T(\\mathbf{v}) \\in W \\mid \\mathbf{v} \\in V\\}$",
                    rankNullity: "**Rank-Nullity Theorem:** $\\dim(V) = \\text{nullity}(T) + \\text{rank}(T) = \\dim(\\ker(T)) + \\dim(\\text{Im}(T))$."
                }
            },
            "transformation-matrices": {
                title: "Linear Transformations & Matrices",
                keywords: ["transformation matrix", "matrix representation", "change of basis", "similarity", "similar matrices", "transition matrix", "standard matrix", "basis change"],
                definition: {
                    what: "Every linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ can be represented uniquely by an $m \\times n$ matrix $A$ such that $T(\\mathbf{x}) = A\\mathbf{x}$.",
                    standardMatrix: "The **standard matrix** $[T]$ is formed by evaluating $T$ on the standard basis vectors: $[T] = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2) \\mid \\dots \\mid T(\\mathbf{e}_n)]$.",
                    similarity: "Two square matrices $A$ and $B$ are **similar** ($A \\sim B$) if there exists an invertible transition matrix $P$ such that $B = P^{-1}AP$. Similar matrices represent the same linear operator under different bases."
                }
            },
            "inner-products": {
                title: "Inner Product Spaces & Orthogonality",
                keywords: ["inner product", "inner product space", "orthogonality", "orthogonal", "orthonormal", "cauchy-schwarz", "gram-schmidt", "orthogonal projection", "orthogonal complement"],
                definition: {
                    what: "An **inner product space** is a vector space $V$ over $\\mathbb{R}$ or $\\mathbb{C}$ equipped with an inner product $\\langle \\mathbf{u}, \\mathbf{v} \\rangle$ that satisfies conjugate symmetry, linearity in the first argument, and positive-definiteness ($\n\\langle \\mathbf{v}, \\mathbf{v} \\rangle \\ge 0$ with equality iff $\\mathbf{v} = \\mathbf{0}$).",
                    gramSchmidt: "The **Gram-Schmidt Process** converts an arbitrary basis $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ into an orthogonal basis $\\{\\mathbf{u}_1, \\dots, \\mathbf{u}_k\\}$:\n$$ \\mathbf{u}_1 = \\mathbf{v}_1 $$\n$$ \\mathbf{u}_k = \\mathbf{v}_k - \\sum_{j=1}^{k-1} \\frac{\\langle \\mathbf{v}_k, \\mathbf{u}_j \\rangle}{\\langle \\mathbf{u}_j, \\mathbf{u}_j \\rangle} \\mathbf{u}_j $$"
                }
            },
            "determinants": {
                title: "Determinants",
                keywords: ["determinant", "det", "cofactor", "minor", "laplace expansion", "cramer's rule", "singular matrix", "invertible", "invertibility", "properties of determinants"],
                definition: {
                    what: "The **determinant** is a scalar-valued function $\\det: M_{n \\times n}(\\mathbb{F}) \\to \\mathbb{F}$ associated with every square matrix that characterizes its geometric scaling factor and invertibility.",
                    formula2x2: "For a $2 \\times 2$ matrix $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$:\n$$ \\det(A) = |A| = ad - bc $$",
                    properties: "1. **Invertibility Criterion:** $A$ is invertible if and only if $\\det(A) \\neq 0$.\n2. **Multiplicative:** $\\det(AB) = \\det(A)\\det(B)$.\n3. **Transpose:** $\\det(A^T) = \\det(A)$.\n4. **Scalar Multiplication:** $\\det(k A_{n \\times n}) = k^n \\det(A)$."
                }
            },
            "eigenvalues": {
                title: "Eigenvalues, Eigenvectors & Diagonalization",
                keywords: ["eigenvalue", "eigenvalues", "eigenvector", "eigenvectors", "diagonalization", "diagonalizable", "characteristic polynomial", "characteristic equation", "eigenspace", "cayley-hamilton"],
                definition: {
                    what: "Let $A$ be an $n \\times n$ square matrix. A non-zero vector $\\mathbf{v} \\neq \\mathbf{0}$ is called an **eigenvector** of $A$ if there exists a scalar $\\lambda$ (called the **eigenvalue**) such that:\n$$ A\\mathbf{v} = \\lambda \\mathbf{v} $$",
                    characteristicEquation: "To find eigenvalues, solve the **characteristic equation**:\n$$ \\det(A - \\lambda I) = 0 $$",
                    eigenspace: "For each eigenvalue $\\lambda_i$, the corresponding **eigenspace** is $E_{\\lambda_i} = \\ker(A - \\lambda_i I)$, found by solving $(A - \\lambda_i I)\\mathbf{v} = \\mathbf{0}$."
                }
            }
        };
    }

    /**
     * Main dispatcher to understand and answer any user query dynamically.
     */
    processQuery(query, session) {
        const cleanQuery = query.trim();
        const lowerQ = cleanQuery.toLowerCase();

        // 1. Resolve multi-turn context (Topic, Entities, Follow-up state)
        const context = this.extractContext(session, lowerQ);

        // 2. Check for explicit matrix math problems (e.g. [[2,0],[0,3]] or inverse, determinant, eigenvalues)
        const matrixData = this.extractMatrix(cleanQuery);
        if (matrixData) {
            return this.solveMatrixProblem(matrixData, lowerQ, cleanQuery, context);
        }

        // 3. Check for Linear Equations System
        const systemData = this.extractLinearSystem(cleanQuery);
        if (systemData) {
            return this.solveLinearSystem(systemData);
        }

        // 4. Classify Question Intent & Structure
        const questionType = this.classifyIntent(lowerQ, context);

        switch (questionType) {
            case "SIMPLIFICATION":
                return this.generateSimplerExplanation(context);

            case "EXAMPLE_REQUEST":
                return this.generateWorkedExample(context);

            case "WHY_REASONING":
                return this.generateWhyExplanation(lowerQ, context);

            case "COMPARISON":
                return this.generateComparison(lowerQ, context);

            case "HOW_TO_SOLVE":
                return this.generateHowToGuide(lowerQ, context);

            case "DEFINITION":
                return this.generateDefinitionExplanation(lowerQ, context);

            case "EXPLANATION":
                return this.generateConceptLesson(lowerQ, context);

            case "PYTHON_CODE":
                return this.generatePythonCode(lowerQ, context);

            case "QUIZ":
                return this.generatePracticeQuiz(lowerQ, context);

            case "FOLLOW_UP":
            default:
                return this.generateContextualResponse(cleanQuery, lowerQ, context);
        }
    }

    // =========================================================================
    // CONTEXT & INTENT CLASSIFICATION
    // =========================================================================

    extractContext(session, lowerQ) {
        let activeTopicKey = null;
        let lastUserMsg = "";
        let lastTutorMsg = "";

        if (session && session.messages && session.messages.length > 0) {
            // Traverse backward to find recent topics and messages
            for (let i = session.messages.length - 1; i >= 0; i--) {
                const msg = session.messages[i];
                if (msg.role === "user" && !lastUserMsg) lastUserMsg = msg.text;
                if (msg.role === "model" && !lastTutorMsg) lastTutorMsg = msg.text;
            }
        }

        // Detect topic directly in current query
        for (const [key, topic] of Object.entries(this.topicRegistry)) {
            for (const kw of topic.keywords) {
                if (lowerQ.includes(kw)) {
                    activeTopicKey = key;
                    break;
                }
            }
            if (activeTopicKey) break;
        }

        // If no topic in current query, inherit from previous context
        if (!activeTopicKey && (lastUserMsg || lastTutorMsg)) {
            const combinedHistory = (lastUserMsg + " " + lastTutorMsg).toLowerCase();
            for (const [key, topic] of Object.entries(this.topicRegistry)) {
                for (const kw of topic.keywords) {
                    if (combinedHistory.includes(kw)) {
                        activeTopicKey = key;
                        break;
                    }
                }
                if (activeTopicKey) break;
            }
        }

        // Default fallback topic
        if (!activeTopicKey) {
            activeTopicKey = "matrices";
        }

        return {
            topicKey: activeTopicKey,
            topic: this.topicRegistry[activeTopicKey],
            lastUserMsg: lastUserMsg,
            lastTutorMsg: lastTutorMsg
        };
    }

    classifyIntent(lowerQ, context) {
        // Confusion / Simplification intent
        if (
            lowerQ.includes("don't understand") ||
            lowerQ.includes("dont understand") ||
            lowerQ.includes("simpler") ||
            lowerQ.includes("simple words") ||
            lowerQ.includes("in simple") ||
            lowerQ.includes("easy way") ||
            lowerQ.includes("layman") ||
            lowerQ.includes("eli5") ||
            lowerQ.includes("confused") ||
            lowerQ.includes("explain again")
        ) {
            return "SIMPLIFICATION";
        }

        // Example request intent
        if (
            lowerQ.includes("example") ||
            lowerQ.includes("give me an example") ||
            lowerQ.includes("show me an example") ||
            lowerQ.includes("worked example") ||
            lowerQ.includes("instance of")
        ) {
            return "EXAMPLE_REQUEST";
        }

        // Comparison intent
        if (
            lowerQ.includes("difference between") ||
            lowerQ.includes("compare") ||
            lowerQ.includes(" vs ") ||
            lowerQ.includes("versus") ||
            lowerQ.includes("distinguish")
        ) {
            return "COMPARISON";
        }

        // "Why" / Reasoning intent
        if (
            lowerQ.startsWith("why ") ||
            lowerQ.includes("why is ") ||
            lowerQ.includes("why does ") ||
            lowerQ.includes("why are ") ||
            lowerQ.includes("reason for")
        ) {
            return "WHY_REASONING";
        }

        // "How to" procedure intent
        if (
            lowerQ.includes("how do i ") ||
            lowerQ.includes("how to ") ||
            lowerQ.includes("how can i ") ||
            lowerQ.includes("steps to ") ||
            lowerQ.includes("method to ")
        ) {
            return "HOW_TO_SOLVE";
        }

        // Definition intent
        if (
            lowerQ.startsWith("what is ") ||
            lowerQ.startsWith("what are ") ||
            lowerQ.startsWith("define ") ||
            lowerQ.includes("definition of") ||
            lowerQ.includes("meaning of")
        ) {
            return "DEFINITION";
        }

        // Python Code intent
        if (
            lowerQ.includes("python") ||
            lowerQ.includes("numpy") ||
            lowerQ.includes("scipy") ||
            lowerQ.includes("code") ||
            lowerQ.includes("program")
        ) {
            return "PYTHON_CODE";
        }

        // Quiz intent
        if (
            lowerQ.includes("quiz") ||
            lowerQ.includes("practice") ||
            lowerQ.includes("test me") ||
            lowerQ.includes("give me a problem") ||
            lowerQ.includes("question on")
        ) {
            return "QUIZ";
        }

        // General explanation
        if (
            lowerQ.startsWith("explain ") ||
            lowerQ.includes("tell me about") ||
            lowerQ.includes("teach me")
        ) {
            return "EXPLANATION";
        }

        return "FOLLOW_UP";
    }

    // =========================================================================
    // SYMBOLIC MATH & PROBLEM SOLVING ENGINE
    // =========================================================================

    extractMatrix(text) {
        // Match [[a, b], [c, d]] or [[a,b,c],[d,e,f],[g,h,i]] or [a b; c d]
        const clean = text.replace(/\\begin\{bmatrix\}|\\end\{bmatrix\}|\$+/g, "");

        // Match 2x2: [[a,b],[c,d]]
        const m2Regex = /\[\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*,\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*\]/;
        const match2 = clean.match(m2Regex);
        if (match2) {
            return {
                rows: 2,
                cols: 2,
                data: [
                    [parseFloat(match2[1]), parseFloat(match2[2])],
                    [parseFloat(match2[3]), parseFloat(match2[4])]
                ]
            };
        }

        // Match 3x3: [[a,b,c],[d,e,f],[g,h,i]]
        const m3Regex = /\[\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*,\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*,\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]\s*\]/;
        const match3 = clean.match(m3Regex);
        if (match3) {
            return {
                rows: 3,
                cols: 3,
                data: [
                    [parseFloat(match3[1]), parseFloat(match3[2]), parseFloat(match3[3])],
                    [parseFloat(match3[4]), parseFloat(match3[5]), parseFloat(match3[6])],
                    [parseFloat(match3[7]), parseFloat(match3[8]), parseFloat(match3[9])]
                ]
            };
        }

        // Match semicolon format: [a b; c d]
        const semiRegex = /\[\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*;\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\]/;
        const matchSemi = clean.match(semiRegex);
        if (matchSemi) {
            return {
                rows: 2,
                cols: 2,
                data: [
                    [parseFloat(matchSemi[1]), parseFloat(matchSemi[2])],
                    [parseFloat(matchSemi[3]), parseFloat(matchSemi[4])]
                ]
            };
        }

        return null;
    }

    extractLinearSystem(text) {
        // Match 2x2 system e.g. "2x + y = 5, x - y = 1" or "2x+y=5 and x-y=1"
        const eqRegex = /(-?\d*)\s*x\s*([+-]\s*\d*)\s*y\s*=\s*(-?\d+)[,\s]+(?:and\s+)?(-?\d*)\s*x\s*([+-]\s*\d*)\s*y\s*=\s*(-?\d+)/i;
        const match = text.match(eqRegex);
        if (match) {
            const parseCoeff = (str) => {
                const s = str.replace(/\s+/g, "");
                if (s === "" || s === "+") return 1;
                if (s === "-") return -1;
                return parseFloat(s);
            };

            return {
                a11: parseCoeff(match[1]),
                a12: parseCoeff(match[2]),
                b1: parseFloat(match[3]),
                a21: parseCoeff(match[4]),
                a22: parseCoeff(match[5]),
                b2: parseFloat(match[6])
            };
        }
        return null;
    }

    solveMatrixProblem(matrix, lowerQ, cleanQuery, context) {
        const { rows, cols, data } = matrix;

        // 1. Eigenvalues / Eigenvectors / Characteristic equation
        if (lowerQ.includes("eigen") || lowerQ.includes("characteristic") || lowerQ.includes("diagonaliz")) {
            if (rows === 2 && cols === 2) {
                return this.solve2x2Eigenvalues(data[0][0], data[0][1], data[1][0], data[1][1]);
            }
        }

        // 2. Inverse / Invertibility
        if (lowerQ.includes("inverse") || lowerQ.includes("invert") || lowerQ.includes("inv")) {
            if (rows === 2 && cols === 2) {
                return this.solve2x2Inverse(data[0][0], data[0][1], data[1][0], data[1][1]);
            }
        }

        // 3. Determinant / Singularity
        if (lowerQ.includes("det") || lowerQ.includes("determinant") || lowerQ.includes("singular")) {
            if (rows === 2 && cols === 2) {
                return this.solve2x2Determinant(data[0][0], data[0][1], data[1][0], data[1][1], lowerQ.includes("why"));
            } else if (rows === 3 && cols === 3) {
                return this.solve3x3Determinant(data);
            }
        }

        // 4. Default: Full Matrix Analysis (Determinant, Inverse, Eigenvalues, Trace, Rank)
        if (rows === 2 && cols === 2) {
            return this.solve2x2Comprehensive(data[0][0], data[0][1], data[1][0], data[1][1]);
        }

        return this.solve3x3Determinant(data);
    }

    solve2x2Eigenvalues(a, b, c, d) {
        const trace = a + d;
        const det = a * d - b * c;
        const disc = trace * trace - 4 * det;

        let solutionSteps = `### 🎯 Step-by-Step Eigenvalues & Eigenvectors

**Given Matrix:**
$$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

---

#### Step 1: Formulate the Characteristic Equation
Eigenvalues $\\lambda$ satisfy $A\\mathbf{v} = \\lambda\\mathbf{v}$, which rearranges to $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. For non-trivial solutions $(\\mathbf{v} \\neq \\mathbf{0})$, the characteristic determinant must equal zero:
$$ \\det(A - \\lambda I) = 0 $$

$$ \\det \\begin{bmatrix} ${a} - \\lambda & ${b} \\\\ ${c} & ${d} - \\lambda \\end{bmatrix} = (${a} - \\lambda)(${d} - \\lambda) - (${b})(${c}) = 0 $$

Expanding the polynomial:
$$ \\lambda^2 - (${trace})\\lambda + (${det}) = 0 $$

---

#### Step 2: Solve for Eigenvalues ($\\lambda$)
Using the quadratic formula $\\lambda = \\frac{-(-\\text{tr}(A)) \\pm \\sqrt{\\text{tr}(A)^2 - 4\\det(A)}}{2}$:
`;

        if (disc >= 0) {
            const sqrtDisc = Math.sqrt(disc);
            const lambda1 = (trace + sqrtDisc) / 2;
            const lambda2 = (trace - sqrtDisc) / 2;
            const l1Str = Number.isInteger(lambda1) ? lambda1 : lambda1.toFixed(2);
            const l2Str = Number.isInteger(lambda2) ? lambda2 : lambda2.toFixed(2);

            solutionSteps += `
$$ \\lambda = \\frac{${trace} \\pm \\sqrt{${disc}}}{2} \\implies \\lambda_1 = ${l1Str}, \\quad \\lambda_2 = ${l2Str} $$

---

#### Step 3: Find Corresponding Eigenvectors
- **For $\\lambda_1 = ${l1Str}$:** Solve $(A - ${l1Str}I)\\mathbf{v} = \\mathbf{0}$:
  $$ \\begin{bmatrix} ${a - lambda1} & ${b} \\\\ ${c} & ${d - lambda1} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} $$
`;
            let v1 = b !== 0 ? `\\begin{bmatrix} ${-b} \\\\ ${a - lambda1} \\end{bmatrix}` : (a - lambda1 === 0 ? `\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}` : `\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}`);
            let v2 = b !== 0 ? `\\begin{bmatrix} ${-b} \\\\ ${a - lambda2} \\end{bmatrix}` : (a - lambda2 === 0 ? `\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}` : `\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}`);

            solutionSteps += `  Row reduction yields the eigenvector: $\\mathbf{v}_1 = ${v1}$.

- **For $\\lambda_2 = ${l2Str}$:** Solve $(A - ${l2Str}I)\\mathbf{v} = \\mathbf{0}$:
  $$ \\begin{bmatrix} ${a - lambda2} & ${b} \\\\ ${c} & ${d - lambda2} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} $$
  Row reduction yields the eigenvector: $\\mathbf{v}_2 = ${v2}$.

---

#### Step 4: Verification
- **Trace Check:** $\\lambda_1 + \\lambda_2 = ${l1Str} + ${l2Str} = ${trace} = \\text{tr}(A)$ ✓
- **Determinant Check:** $\\lambda_1 \\cdot \\lambda_2 = (${l1Str})(${l2Str}) = ${det} = \\det(A)$ ✓

**Final Answer:**
- **Eigenvalues:** $\\lambda_1 = ${l1Str}, \\quad \\lambda_2 = ${l2Str}$
- **Eigenvectors:** $\\mathbf{v}_1 = ${v1}, \\quad \\mathbf{v}_2 = ${v2}$
`;
        } else {
            const realPart = (trace / 2).toFixed(2);
            const imagPart = (Math.sqrt(-disc) / 2).toFixed(2);
            solutionSteps += `
Since the discriminant is negative ($\n\\Delta = ${disc} < 0$), the matrix has complex conjugate eigenvalues:
$$ \\lambda = ${realPart} \\pm ${imagPart}i $$

**Final Answer:**
The matrix represents a rotation and scaling with complex eigenvalues $\\lambda = ${realPart} \\pm ${imagPart}i$.
`;
        }

        return solutionSteps;
    }

    solve2x2Inverse(a, b, c, d) {
        const det = a * d - b * c;
        const detStr = Number.isInteger(det) ? det : det.toFixed(2);

        let response = `### 🔄 Step-by-Step Matrix Inverse Calculation

**Given Matrix:**
$$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

---

#### Step 1: Calculate the Determinant
$$ \\det(A) = ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - (${b * c}) = ${detStr} $$
`;

        if (Math.abs(det) < 1e-9) {
            response += `
---

#### Step 2: Invertibility Test
Since **$\\det(A) = 0$**, the matrix is **singular (non-invertible)**. 
Geometrically, this transformation squashes 2D space into a 1D line or 0D point, so it is impossible to reverse.

**Final Answer:**
$$\\mathbf{A^{-1}\\ \\text{does NOT exist (Matrix is Singular)}}.$$
`;
            return response;
        }

        const invA = (d / det).toFixed(2);
        const invB = (-b / det).toFixed(2);
        const invC = (-c / det).toFixed(2);
        const invD = (a / det).toFixed(2);

        response += `
Since $\\det(A) = ${detStr} \\neq 0$, the inverse exists.

---

#### Step 2: Form the Adjugate Matrix
For a $2 \\times 2$ matrix, swap the main diagonal elements and negate the off-diagonal elements:
$$ \\text{adj}(A) = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix} = \\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix} $$

---

#### Step 3: Multiply by $\\frac{1}{\\det(A)}$
$$ A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A) = \\frac{1}{${detStr}} \\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix} $$

---

#### Step 4: Verification
$$ A A^{-1} = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} \\begin{bmatrix} ${invA} & ${invB} \\\\ ${invC} & ${invD} \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I $$

**Final Answer:**
$$ A^{-1} = \\begin{bmatrix} ${invA} & ${invB} \\\\ ${invC} & ${invD} \\end{bmatrix} $$
`;
        return response;
    }

    solve2x2Determinant(a, b, c, d, isWhyQuestion = false) {
        const det = a * d - b * c;
        const detStr = Number.isInteger(det) ? det : det.toFixed(2);

        let response = `### 🔍 Step-by-Step Determinant Calculation

**Given Matrix:**
$$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

---

#### Step 1: Apply the $2 \\times 2$ Determinant Formula
For any $2 \\times 2$ matrix $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, the determinant is the product of the main diagonal minus the product of the off-diagonal:
$$ \\det(A) = |A| = ad - bc $$

---

#### Step 2: Perform the Arithmetic
$$ \\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - (${b * c}) = ${detStr} $$

**Final Answer:**
$$ \\mathbf{\\det(A) = ${detStr}} $$
`;

        if (Math.abs(det) < 1e-9 || isWhyQuestion) {
            response += `
---

#### 💡 Why is the Determinant ${det === 0 ? "Zero" : detStr}?
${det === 0 ? `
1. **Linear Dependence:** The rows (or columns) of $A$ are scalar multiples of each other ($[${a}, ${b}]$ and $[${c}, ${d}]$ are linearly dependent).
2. **Geometric Squashing:** The transformation $A$ collapses 2D areas down to a 1D line or point (area scaling factor = $0$).
3. **Singularity:** Because $\\det(A) = 0$, $A$ has no inverse ($A^{-1}$ does not exist) and the system $A\\mathbf{x}=\\mathbf{0}$ has non-trivial solutions.
` : `
1. **Geometric Area Scaling:** Any 2D shape transformed by $A$ has its area multiplied by $|${detStr}| = ${Math.abs(detStr)}$.
2. **Orientation:** Since $\\det(A) ${det > 0 ? "> 0" : "< 0"}$, the geometric orientation of vectors is ${det > 0 ? "preserved" : "reversed (mirror-flipped)"}.
3. **Invertibility:** Since $\\det(A) \\neq 0$, $A$ is non-singular and has a unique inverse $A^{-1}$.
`}
`;
        }

        return response;
    }

    solve3x3Determinant(matrix) {
        const [
            [a, b, c],
            [d, e, f],
            [g, h, i]
        ] = matrix;

        const sub1 = e * i - f * h;
        const sub2 = d * i - f * g;
        const sub3 = d * h - e * g;

        const det = a * sub1 - b * sub2 + c * sub3;

        return `### 🔍 Step-by-Step $3 \\times 3$ Determinant Calculation

**Given Matrix:**
$$ A = \\begin{bmatrix} ${a} & ${b} & ${c} \\\\ ${d} & ${e} & ${f} \\\\ ${g} & ${h} & ${i} \\end{bmatrix} $$

---

#### Step 1: Laplace Cofactor Expansion (Along Row 1)
$$ \\det(A) = a_{11} C_{11} + a_{12} C_{12} + a_{13} C_{13} = a \\det \\begin{bmatrix} e & f \\\\ h & i \\end{bmatrix} - b \\det \\begin{bmatrix} d & f \\\\ g & i \\end{bmatrix} + c \\det \\begin{bmatrix} d & e \\\\ g & h \\end{bmatrix} $$

---

#### Step 2: Compute $2 \\times 2$ Minors
1. $M_{11} = (${e})(${i}) - (${f})(${h}) = ${e * i} - ${f * h} = ${sub1}$
2. $M_{12} = (${d})(${i}) - (${f})(${g}) = ${d * i} - ${f * g} = ${sub2}$
3. $M_{13} = (${d})(${h}) - (${e})(${g}) = ${d * h} - ${e * g} = ${sub3}$

---

#### Step 3: Combine with Row 1 Coefficients
$$ \\det(A) = (${a})(${sub1}) - (${b})(${sub2}) + (${c})(${sub3}) $$
$$ \\det(A) = ${a * sub1} - (${b * sub2}) + (${c * sub3}) = ${det} $$

**Final Answer:**
$$ \\mathbf{\\det(A) = ${det}} \\quad (${det === 0 ? "Singular / Non-Invertible" : "Invertible, Non-Singular"}) $$
`;
    }

    solve2x2Comprehensive(a, b, c, d) {
        const det = a * d - b * c;
        const trace = a + d;
        const disc = trace * trace - 4 * det;

        return `### 📐 Full Matrix Analysis for $A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}$

#### 1. Determinant & Invertibility
$$ \\det(A) = (${a})(${d}) - (${b})(${c}) = ${det} $$
- **Status:** ${det !== 0 ? `Invertible (Non-singular) since $\\det(A) \\neq 0$` : `Singular (Non-invertible) since $\\det(A) = 0$`}

#### 2. Matrix Trace & Rank
- **Trace:** $\\text{tr}(A) = a + d = ${a} + ${d} = ${trace}$
- **Rank:** $\\text{rank}(A) = ${det !== 0 ? "2 \\text{ (Full Rank)}" : (a === 0 && b === 0 && c === 0 && d === 0 ? "0" : "1")}$

#### 3. Characteristic Equation & Eigenvalues
$$ \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = \\lambda^2 - (${trace})\\lambda + (${det}) = 0 $$
${disc >= 0 ? `
$$ \\lambda_1 = ${((trace + Math.sqrt(disc)) / 2).toFixed(2)}, \\quad \\lambda_2 = ${((trace - Math.sqrt(disc)) / 2).toFixed(2)} $$
` : `
$$ \\lambda = ${(trace / 2).toFixed(2)} \\pm ${(Math.sqrt(-disc) / 2).toFixed(2)}i \\quad \\text{(Complex Eigenvalues)} $$
`}

${det !== 0 ? `
#### 4. Matrix Inverse
$$ A^{-1} = \\frac{1}{${det}} \\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix} = \\begin{bmatrix} ${(d / det).toFixed(2)} & ${(-b / det).toFixed(2)} \\\\ ${(-c / det).toFixed(2)} & ${(a / det).toFixed(2)} \\end{bmatrix} $$
` : ""}

*Ask me to calculate the eigenvectors or perform power iterations on this matrix!*
`;
    }

    solveLinearSystem(system) {
        const { a11, a12, b1, a21, a22, b2 } = system;
        const detA = a11 * a22 - a12 * a21;

        let response = `### 🔢 Step-by-Step Linear System Solver (Gaussian Elimination)

**Given System of Equations:**
$$\\begin{cases} ${a11}x + (${a12})y = ${b1} \\\\ ${a21}x + (${a22})y = ${b2} \\end{cases}$$

---

#### Step 1: Set up the Augmented Matrix $[A \\mid \\mathbf{b}]$
$$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ ${a21} & ${a22} & ${b2} \\end{array} \\right] $$

---

#### Step 2: Row Reduction to Row Echelon Form (REF)
`;

        if (Math.abs(a11) < 1e-9 && Math.abs(a21) < 1e-9) {
            return response + `Both $x$ coefficients are zero. System is degenerate.`;
        }

        if (Math.abs(detA) < 1e-9) {
            // Consistent vs Inconsistent
            const ratio = a11 !== 0 ? a21 / a11 : a22 / a12;
            const expectedB2 = b1 * ratio;
            const isConsistent = Math.abs(b2 - expectedB2) < 1e-9;

            if (isConsistent) {
                response += `
Applying row operation $R_2 \\leftarrow R_2 - (${ratio.toFixed(2)})R_1$:
$$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ 0 & 0 & 0 \\end{array} \\right] $$

Since the second row is $0 = 0$, the system is **consistent with infinitely many solutions (1 free variable)**.

**Final Answer:**
Let $y = t$ (free parameter). Then $x = \\frac{${b1} - (${a12})t}{${a11}}$.
`;
            } else {
                response += `
Applying row operation $R_2 \\leftarrow R_2 - (${ratio.toFixed(2)})R_1$:
$$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ 0 & 0 & ${(b2 - expectedB2).toFixed(2)} \\end{array} \\right] $$

Since the second row gives $0 = ${(b2 - expectedB2).toFixed(2)}$ (which is mathematically false), the system has **NO SOLUTION (Inconsistent)**.

**Final Answer:**
$$\\mathbf{\\text{Inconsistent System (No Solution)}}.$$
`;
            }
            return response;
        }

        // Unique solution via Gauss-Jordan
        const k = a21 / a11;
        const newA22 = a22 - k * a12;
        const newB2 = b2 - k * b1;
        const y = newB2 / newA22;
        const x = (b1 - a12 * y) / a11;

        const xStr = Number.isInteger(x) ? x : x.toFixed(2);
        const yStr = Number.isInteger(y) ? y : y.toFixed(2);

        response += `
- **Row Operation:** $R_2 \\leftarrow R_2 - \\left(\\frac{${a21}}{${a11}}\\right) R_1$:
$$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ 0 & ${newA22.toFixed(2)} & ${newB2.toFixed(2)} \\end{array} \\right] $$

---

#### Step 3: Back-Substitution
1. From Row 2: $(${newA22.toFixed(2)})y = ${newB2.toFixed(2)} \\implies y = ${yStr}$
2. Substitute $y = ${yStr}$ into Row 1:
   $$ (${a11})x + (${a12})(${yStr}) = ${b1} \\implies (${a11})x = ${b1} - (${(a12 * y).toFixed(2)}) \\implies x = ${xStr} $$

---

#### Step 4: Verification
- Equation 1: $(${a11})(${xStr}) + (${a12})(${yStr}) = ${b1}$ ✓
- Equation 2: $(${a21})(${xStr}) + (${a22})(${yStr}) = ${b2}$ ✓

**Final Answer:**
$$ \\mathbf{x = ${xStr}}, \\quad \\mathbf{y = ${yStr}} \\quad \\left( \\mathbf{x} = \\begin{bmatrix} ${xStr} \\\\ ${yStr} \\end{bmatrix} \\right) $$
`;
        return response;
    }

    // =========================================================================
    // CONCEPTUAL, COMPARATIVE & PEDAGOGICAL GENERATORS
    // =========================================================================

    generateDefinitionExplanation(lowerQ, context) {
        const { topicKey, topic } = context;
        const def = topic.definition;

        if (lowerQ.includes("matrix") || lowerQ.includes("matrices")) {
            return `### 📚 What is a Matrix?

#### 1. Intuition in Simple Words
A **matrix** is a rectangular grid or table of numbers arranged in rows (horizontal) and columns (vertical). 
Think of it as a clean way to organize multiple equations, geometric transformations (like stretching, rotating, or reflecting objects), or data tables into a single mathematical object.

---

#### 2. Formal Mathematical Definition
A matrix $A$ of **order (or dimension) $m \\times n$** (read "$m$ by $n$") consists of $m$ rows and $n$ columns:
$$ A = \\begin{bmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\ a_{21} & a_{22} & \\dots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\dots & a_{mn} \\end{bmatrix} = [a_{ij}]_{m \\times n} $$

- $a_{ij}$ denotes the element located at the intersection of **row $i$** and **column $j$**.
- If $m = n$, the matrix is called a **square matrix**.

---

#### 3. Concrete Example
Let $A = \\begin{bmatrix} 3 & -2 & 5 \\\\ 0 & 7 & 1 \\end{bmatrix}$.
- **Order:** $2 \\times 3$ ($2$ rows, $3$ columns).
- **Entries:** $a_{11} = 3$, $a_{12} = -2$, $a_{22} = 7$, etc.

---

#### 4. Common Types of Matrices
1. **Row Matrix:** Matrix with only 1 row, e.g., $\\begin{bmatrix} 1 & 4 & -2 \\end{bmatrix}_{1 \\times 3}$.
2. **Column Matrix:** Matrix with only 1 column, e.g., $\\begin{bmatrix} 5 \\\\ 2 \\end{bmatrix}_{2 \\times 1}$.
3. **Square Matrix:** Number of rows = number of columns ($m = n$).
4. **Identity Matrix ($I$):** Square matrix with $1$s on the main diagonal and $0$s elsewhere:
   $$ I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad I_3 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} $$
5. **Zero / Null Matrix ($O$):** All entries are $0$.

*Would you like to explore matrix addition, multiplication, or matrix inverses?*`;
        }

        if (lowerQ.includes("vector space") || lowerQ.includes("subspace")) {
            return `### 📦 What is a Vector Space?

#### 1. Intuition in Simple Words
A **vector space** is a mathematical "playground" (universe) containing vectors where two fundamental operations are allowed:
1. **Adding** any two vectors together gives another vector in the playground.
2. **Scaling** (multiplying) any vector by a scalar (number) keeps it in the playground.

---

#### 2. Formal Mathematical Definition
A **Vector Space** $V$ over a field $\\mathbb{F}$ is a non-empty set equipped with **vector addition ($+$)** and **scalar multiplication ($\\cdot$)** satisfying the 8 axioms:
1. **Commutativity of Addition:** $\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}$
2. **Associativity of Addition:** $(\\mathbf{u} + \\mathbf{v}) + \\mathbf{w} = \\mathbf{u} + (\\mathbf{v} + \\mathbf{w})$
3. **Zero Vector:** There exists $\\mathbf{0} \\in V$ such that $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$
4. **Additive Inverse:** For every $\\mathbf{v} \\in V$, there is $-\\mathbf{v} \\in V$ such that $\\mathbf{v} + (-\\mathbf{v}) = \\mathbf{0}$
5. **Distributivity over Vector Addition:** $c(\\mathbf{u} + \\mathbf{v}) = c\\mathbf{u} + c\\mathbf{v}$
6. **Distributivity over Scalar Addition:** $(c + d)\\mathbf{v} = c\\mathbf{v} + d\\mathbf{v}$
7. **Associativity of Scalar Multiplication:** $(cd)\\mathbf{v} = c(d\\mathbf{v})$
8. **Scalar Identity:** $1 \\cdot \\mathbf{v} = \\mathbf{v}$

---

#### 3. Standard Examples
- $\\mathbb{R}^2$: The 2D Cartesian plane (all pairs of real coordinates $(x, y)$).
- $\\mathbb{R}^n$: $n$-dimensional Euclidean space.
- $\\mathcal{P}_n(\\mathbb{R})$: The space of all polynomials of degree $\\le n$.
- $M_{m \\times n}(\\mathbb{R})$: The space of all $m \\times n$ real matrices.

*Would you like me to show the 3-step subspace test or check if a specific set is a subspace?*`;
        }

        return `### 📚 ${topic.title} - Definition & Key Concepts

#### 1. Intuition
${def.intuition || def.what}

---

#### 2. Formal Definition
${def.what}

${def.form ? `\n$$\n${def.form}\n$$` : ""}
${def.notation || ""}
${def.axioms ? `\n**Axioms & Requirements:**\n${def.axioms}` : ""}

---

#### 3. Worked Example
${def.example || def.examples || "Let $A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}$."}

*Ask me to explain any specific concept, solve a problem step-by-step, or test your knowledge!*`;
    }

    generateWhyExplanation(lowerQ, context) {
        if (lowerQ.includes("determinant") && (lowerQ.includes("zero") || lowerQ.includes("0"))) {
            return `### 💡 Why is the Determinant Zero? (Geometric & Algebraic Meaning)

When $\\det(A) = 0$, it signifies a fundamental breakdown in the matrix transformation. Here is why from 4 distinct perspectives:

---

#### 1. Geometric Perspective: Space is Flattened (Volume = 0)
The determinant measures the **scaling factor of area (in 2D) or volume (in 3D)** under the transformation $A$:
- In 2D: The transformation squashes the entire 2D plane onto a **1D straight line** or a **single 0D point**. The area of the resulting flat shape is $0$.
- In 3D: A 3D solid box is squashed onto a flat 2D plane or line (volume = $0$).

---

#### 2. Algebraic Perspective: Linearly Dependent Rows/Columns
$\\det(A) = 0$ means the rows (or columns) of $A$ are **not linearly independent**:
- One row can be written as a linear combination of the other rows.
- **Example:** For $A = \\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$, Row 2 is $2 \\times \\text{Row 1}$.
  $$ \\det(A) = (1)(4) - (2)(2) = 4 - 4 = 0 $$

---

#### 3. Invertibility Perspective: No Inverse Exists ($A^{-1}$ does not exist)
The formula for the matrix inverse is:
$$ A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A) $$
If $\\det(A) = 0$, this requires **division by zero**, which is undefined. Therefore, a matrix with $\\det(A) = 0$ is **singular (non-invertible)**.

---

#### 4. Linear Equations & Kernel Perspective
- The homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has **infinitely many non-trivial solutions** (non-zero vectors $\\mathbf{x} \\neq \\mathbf{0}$ that get mapped to zero).
- The matrix has **at least one eigenvalue equal to zero ($\lambda = 0$)** because $\\det(A) = \\lambda_1 \\lambda_2 \\dots \\lambda_n = 0$.

**Summary:** $\\det(A) = 0 \\iff$ Matrix is Singular $\\iff$ Columns are Dependent $\\iff$ Space is Flattened $\\iff$ $\\lambda = 0$ is an eigenvalue.`;
        }

        return `### 💡 Conceptual Reasoning: ${context.topic.title}

In Linear Algebra, properties are deeply interconnected across algebra and geometry:

1. **Algebraic Consistency:** Operations are governed by the linearity conditions $T(c\\mathbf{u} + \\mathbf{v}) = cT(\\mathbf{u}) + T(\\mathbf{v})$.
2. **Geometric Invariance:** Transformations manipulate coordinate frames while preserving origin ($\mathbf{0} \\mapsto \\mathbf{0}$) and parallel lines.
3. **Dimensional Balance (Rank-Nullity):** Information cannot be destroyed without leaving a trace in the null space: $\\text{dim}(V) = \\text{rank}(A) + \\text{nullity}(A)$.

*Would you like me to demonstrate this reasoning on a specific numerical matrix or equation?*`;
    }

    generateComparison(lowerQ, context) {
        // 1. Vector Space vs Subspace
        if (
            (lowerQ.includes("vector space") && lowerQ.includes("subspace")) ||
            (lowerQ.includes("space") && lowerQ.includes("subspace"))
        ) {
            return `### ⚖️ Vector Space vs. Subspace: Clear Comparison

| Feature | **Vector Space ($V$)** | **Subspace ($W$)** |
| :--- | :--- | :--- |
| **Definition** | The full, ambient mathematical "universe" of vectors. | A non-empty subset $W \\subseteq V$ that is itself a vector space. |
| **Axioms Required** | Must satisfy all **8 vector space axioms** from scratch. | Only needs to satisfy the **3-Step Subspace Test** (the other axioms inherit automatically from $V$). |
| **Origin / Zero** | Must contain the zero vector $\\mathbf{0}$. | Must contain the ambient zero vector $\\mathbf{0} \\in W$. |
| **Closure** | Closed under addition and scalar multiplication. | Must be closed: $\\mathbf{u}+\\mathbf{v} \\in W$ and $c\\mathbf{u} \\in W$. |
| **Geometric Example (in $\\mathbb{R}^3$)** | The entire 3D space $\\mathbb{R}^3$. | Any plane or line **passing through the origin $(0,0,0)$**. |
| **Counter-Example** | An arbitrary collection of coordinates without closure. | A line or plane that does **not** pass through the origin (e.g. $x + y + z = 1$). |

---

#### The 3-Step Subspace Test:
To prove a subset $W \\subseteq V$ is a subspace, verify:
1. $\\mathbf{0} \\in W$ (Contains zero vector).
2. $\\mathbf{u}, \\mathbf{v} \\in W \\implies \\mathbf{u} + \\mathbf{v} \\in W$ (Closure under addition).
3. $c \\in \\mathbb{F}, \\mathbf{u} \\in W \\implies c\\mathbf{u} \\in W$ (Closure under scalar multiplication).`;
        }

        // 2. Span vs Basis
        if (
            (lowerQ.includes("span") && lowerQ.includes("basis")) ||
            lowerQ.includes("difference between span and basis")
        ) {
            return `### ⚖️ Span vs. Basis: Clear Comparison

| Concept | **Span of a Set ($\\text{span}(S)$)** | **Basis of a Vector Space ($\mathcal{B}$)** |
| :--- | :--- | :--- |
| **What is it?** | The **entire space of all possible vectors** reachable by linear combinations of $S$. | The **minimal, most efficient set of vectors** needed to build the space. |
| **Redundancy** | Can contain redundant (dependent) vectors. | **Zero redundancy:** Must be **linearly independent**. |
| **Formula** | $\\text{span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\} = \\{c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k\\}$. | $\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ such that $\\text{span}(\mathcal{B}) = V$ AND $\\mathcal{B}$ is independent. |
| **Uniqueness of Coordinates** | A vector can be represented in multiple ways if $S$ is dependent. | Every vector $\\mathbf{v} \\in V$ has a **unique representation** in terms of basis vectors. |
| **Analogous Concept** | All colors you can mix from a paint set (even if you have 3 identical blue tubes). | The essential primary colors without duplicate tubes. |

---

#### Concrete Example in $\\mathbb{R}^2$:
- Set $S = \\left\\{ \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}, \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}, \\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} \\right\\}$:
  - **Span:** $\\text{span}(S) = \\mathbb{R}^2$ (it reaches all 2D space).
  - **Is it a Basis?** **NO**, because $\\begin{bmatrix} 2 \\\\ 3 \\end{bmatrix} = 2\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + 3\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$ (it is linearly dependent).
- Removing the redundant third vector gives the standard basis $\mathcal{B} = \\left\\{ \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}, \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} \\right\\}$.`;
        }

        return `### ⚖️ Concept Comparison in ${context.topic.title}

When comparing linear algebraic structures:
- **Linear Independence vs Dependence:** Independent sets have no wasted vectors ($c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0} \\implies c_i = 0$); dependent sets contain vectors that lie within the span of others.
- **Kernel vs Image:** The **kernel** $\\ker(T)$ is the set of inputs mapped to zero; the **image** $\\text{Im}(T)$ is the set of all reachable outputs.
- **Row Echelon Form (REF) vs Reduced Row Echelon Form (RREF):** REF has zeros below pivots; RREF has zeros both above and below pivots, with all pivot entries scaled to $1$.`;
    }

    generateHowToGuide(lowerQ, context) {
        if (lowerQ.includes("eigenvalue") || lowerQ.includes("eigen")) {
            return `### 🎯 How to Find Eigenvalues and Eigenvectors (2-Step Method)

#### Step 1: Find the Eigenvalues ($\\lambda$)
1. Write the **characteristic equation**: $\\det(A - \\lambda I) = 0$.
2. For a $2 \\times 2$ matrix $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, expand:
   $$ \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0 $$
3. Solve the quadratic equation for its roots $\\lambda_1, \\lambda_2$.

---

#### Step 2: Find the Eigenvectors ($\\mathbf{v}$) for Each $\\lambda$
1. For each eigenvalue $\\lambda_i$, substitute into the homogeneous system:
   $$ (A - \\lambda_i I)\\mathbf{v} = \\mathbf{0} $$
2. Set up the matrix $\\begin{bmatrix} a - \\lambda_i & b \\\\ c & d - \\lambda_i \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}$.
3. Perform row reduction to find the free variable and write the basis vector $\\mathbf{v}_i$.

---

#### Quick Worked Example
For $A = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}$:
1. $\\det \\begin{bmatrix} 2 - \\lambda & 0 \\\\ 0 & 3 - \\lambda \\end{bmatrix} = (2-\\lambda)(3-\\lambda) = 0 \\implies \\lambda_1 = 2, \\quad \\lambda_2 = 3$.
2. For $\\lambda_1 = 2$: $\\begin{bmatrix} 0 & 0 \\\\ 0 & 1 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\implies x_2 = 0, x_1 \\text{ free} \\implies \\mathbf{v}_1 = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$.
3. For $\\lambda_2 = 3$: $\\begin{bmatrix} -1 & 0 \\\\ 0 & 0 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\implies x_1 = 0, x_2 \\text{ free} \\implies \\mathbf{v}_2 = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$.

*Give me any matrix (e.g. \`[[4, 1], [2, 3]]\`) and I will solve its eigenvalues step-by-step!*`;
        }

        if (lowerQ.includes("gaussian") || lowerQ.includes("elimination")) {
            return `### 🔢 How to Perform Gaussian Elimination Step-by-Step

Gaussian Elimination reduces an augmented matrix $[A \\mid \\mathbf{b}]$ to **Row Echelon Form (REF)** using 3 allowed elementary row operations:

---

#### 3 Allowed Row Operations:
1. **Row Swap ($R_i \\leftrightarrow R_j$):** Swap two rows.
2. **Row Scaling ($R_i \\leftarrow k R_i, k \\neq 0$):** Multiply a row by a non-zero constant.
3. **Row Replacement ($R_i \\leftarrow R_i + k R_j$):** Add a multiple of one row to another row.

---

#### The Systematic 3-Step Procedure:
1. **Create Augmented Matrix:** Place coefficients on the left and constants on the right: $[A \\mid \\mathbf{b}]$.
2. **Forward Elimination (Top to Bottom):**
   - Use the pivot $a_{11}$ in Row 1 to eliminate the entries below it in Column 1 ($R_2 \\leftarrow R_2 - \\frac{a_{21}}{a_{11}}R_1$).
   - Move to Row 2, Column 2 and eliminate entries below it.
3. **Back-Substitution (Bottom to Top):**
   - Solve for the bottom variable directly, then substitute upwards to find the remaining variables.

*Would you like me to solve a linear system for you? Paste equations like \`2x + y = 5, x - y = 1\`!*`;
        }

        return `### 📐 Method Walkthrough: ${context.topic.title}

1. **Identify Given Information:** Write down the matrix or vector coordinates.
2. **Select the Applicable Theorem / Formula:** State the mathematical relation.
3. **Execute Row Operations or Direct Computation:** Keep careful track of signs and fractions.
4. **Verify Result:** Check by substitution or determinant/trace tests.`;
    }

    generateSimplerExplanation(context) {
        const { topicKey } = context;

        switch (topicKey) {
            case "determinants":
                return `### 💡 Determinant Explained in Super Simple Words

Imagine you have a square rubber sheet on a table with an area of **$1$ square unit**.

When you apply a matrix $A$ to this sheet:
- The matrix stretches, tilts, or squashes the rubber sheet into a slanted parallelogram.
- **The Determinant is simply the new area of that rubber sheet!**

#### What different values mean:
- If $\\det(A) = 2$: The sheet was stretched so its area is now **$2$ times bigger**.
- If $\\det(A) = 1$: The area didn't change (like rotating the sheet).
- If $\\det(A) = 0$: The sheet was crushed completely flat into a single straight line (which has **zero area**). That's why you can't reverse it—you can't un-crush a line back into a 2D sheet!

Does this mental picture make sense?`;

            case "eigenvalues":
                return `### 💡 Eigenvalues & Eigenvectors in Super Simple Words

Imagine you are stretching a piece of stretchy fabric in various directions.

Most arrows drawn on the fabric will **change their angle and rotate** as you stretch.

However, there are a few special, magical arrows that **do not change their direction at all**—they only get longer or shorter along their original line.

- **Eigenvector:** The special arrow that points in that unwavering direction.
- **Eigenvalue ($\lambda$):** The number telling you how much that arrow got stretched (e.g. $\\lambda = 3$ means it became $3$ times longer; $\\lambda = -1$ means it flipped backwards).

Does this help clarify what $A\\mathbf{v} = \\lambda\\mathbf{v}$ means?`;

            case "vector-spaces":
                return `### 💡 Vector Spaces & Span Explained in Super Simple Words

Think of vector spaces like cooking with ingredients:
- Suppose your only ingredients are **flour** and **sugar**.
- A **Linear Combination** is any recipe you can make by mixing different amounts: $(2 \\times \\text{flour}) + (3 \\times \\text{sugar})$.
- The **Span** is the giant menu of *every possible recipe* you could ever make using those two ingredients.
- A **Basis** is your minimal shopping list: having 1 bag of flour and 1 bag of sugar gives you everything you need without buying redundant duplicate bags.
- The **Vector Space** is the entire kitchen filled with all possible dishes!

How does this sound to you?`;

            case "linear-systems":
            default:
                return `### 💡 Linear Systems Explained in Super Simple Words

Think of solving a system of equations like finding where two straight roads cross on a map:
1. **One Crossing Point (Unique Solution):** The two roads cross at exactly one intersection point $(x, y)$.
2. **Parallel Roads (No Solution):** The two roads run in the same direction and never touch each other.
3. **Same Road (Infinite Solutions):** Both equations describe the exact same road sitting directly on top of each other.

Gaussian elimination is just a systematic way of untangling the equations so you can read the intersection point directly!`;
        }
    }

    generateWorkedExample(context) {
        const { topicKey } = context;

        switch (topicKey) {
            case "determinants":
                return `### 📝 Worked Example: Computing a $2 \\times 2$ Determinant

Let $A = \\begin{bmatrix} 3 & 4 \\\\ 1 & 2 \\end{bmatrix}$.

#### Step-by-Step Calculation:
1. **Formula:** $\\det(A) = ad - bc$
2. **Identify Elements:** $a = 3, b = 4, c = 1, d = 2$
3. **Compute Product:**
   $$ \\det(A) = (3)(2) - (4)(1) = 6 - 4 = 2 $$

**Final Answer:** $\\det(A) = 2$ (Since $2 \\neq 0$, matrix $A$ is invertible).`;

            case "eigenvalues":
                return `### 📝 Worked Example: Finding Eigenvalues of $\\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}$

#### Step 1: Characteristic Equation
$$ \\det(A - \\lambda I) = \\det \\begin{bmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{bmatrix} = (4 - \\lambda)(3 - \\lambda) - (1)(2) = 0 $$
$$ \\lambda^2 - 7\\lambda + 12 - 2 = \\lambda^2 - 7\\lambda + 10 = 0 $$

#### Step 2: Factor the Quadratic
$$ (\\lambda - 5)(\\lambda - 2) = 0 \\implies \\lambda_1 = 5, \\quad \\lambda_2 = 2 $$

**Final Answer:** Eigenvalues are $\\lambda_1 = 5$ and $\\lambda_2 = 2$.`;

            case "vector-spaces":
            default:
                return `### 📝 Worked Example: 3-Step Subspace Test

**Problem:** Determine if $W = \\{(x, y) \\in \\mathbb{R}^2 \\mid y = 2x\\}$ is a subspace of $\\mathbb{R}^2$.

#### Step 1: Check Zero Vector
Does $(0, 0) \\in W$?
$y = 2(0) = 0$ ✓ Yes, the zero vector is in $W$.

#### Step 2: Check Closure under Addition
Let $\\mathbf{u} = (x_1, 2x_1)$ and $\\mathbf{v} = (x_2, 2x_2)$ be vectors in $W$.
$$ \\mathbf{u} + \\mathbf{v} = (x_1 + x_2, 2x_1 + 2x_2) = (x_1 + x_2, 2(x_1 + x_2)) $$
The second component is exactly twice the first component, so $\\mathbf{u} + \\mathbf{v} \\in W$ ✓.

#### Step 3: Check Closure under Scalar Multiplication
For any scalar $c \\in \\mathbb{R}$:
$$ c\\mathbf{u} = c(x_1, 2x_1) = (cx_1, 2(cx_1)) \\in W \\text{ ✓} $$

**Final Answer:** $W$ is a valid subspace of $\\mathbb{R}^2$.`;
        }
    }

    generateConceptLesson(lowerQ, context) {
        return this.generateDefinitionExplanation(lowerQ, context);
    }

    generatePythonCode(lowerQ, context) {
        return `### 🐍 Python NumPy Code for Linear Algebra

Here is clean, production-ready Python code using **NumPy**:

\`\`\`python
import numpy as np

# 1. Define Matrices
A = np.array([[4, 1],
              [2, 3]], dtype=float)

B = np.array([[1, 2],
              [3, 4]], dtype=float)

b = np.array([5, 4], dtype=float)

# 2. Matrix Multiplication
product = A @ B  # or np.matmul(A, B)
print("A @ B:\\n", product)

# 3. Determinant & Matrix Inverse
det_A = np.linalg.det(A)
inv_A = np.linalg.inv(A)
print(f"\\nDeterminant: {det_A:.2f}")
print("Inverse A^-1:\\n", inv_A)

# 4. Solve Linear System A * x = b
x = np.linalg.solve(A, b)
print("\\nSolution to Ax = b:", x)

# 5. Eigenvalues and Eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)
print("\\nEigenvalues:", eigenvalues)
print("Eigenvectors (column-wise):\\n", eigenvectors)
\`\`\`

#### Key Function Breakdown:
- \`np.linalg.det(A)\`: Computes $\\det(A)$.
- \`np.linalg.inv(A)\`: Computes inverse $A^{-1}$.
- \`np.linalg.solve(A, b)\`: Solves $A\\mathbf{x} = \\mathbf{b}$ via LU decomposition.
- \`np.linalg.eig(A)\`: Computes eigenvalues $\\lambda$ and eigenvectors $\\mathbf{v}$.`;
    }

    generatePracticeQuiz(lowerQ, context) {
        const { topicKey } = context;

        switch (topicKey) {
            case "determinants":
                return `### ❓ Practice Quiz Question: Determinants

> **Question:** Let matrix $A = \\begin{bmatrix} 2 & k \\\\ 4 & 6 \\end{bmatrix}$. 
> For what value of $k$ is the matrix $A$ **singular (non-invertible)**?

Take a minute to calculate your answer and type it below!

*(Hint: Recall that a matrix is singular when its determinant is zero: $\\det(A) = 0$.)*`;

            case "eigenvalues":
                return `### ❓ Practice Quiz Question: Eigenvalues

> **Question:** What are the eigenvalues of the diagonal matrix $D = \\begin{bmatrix} 5 & 0 \\\\ 0 & -2 \\end{bmatrix}$?

Type your answer below! 

*(Hint: For a diagonal or triangular matrix, what do the diagonal entries represent?)*`;

            default:
                return `### ❓ Practice Quiz Question: Matrix Operations

> **Question:** If matrix $A$ has order $3 \\times 2$ and matrix $B$ has order $2 \\times 4$, what will be the order (dimension) of the product matrix $AB$?

Reply with your answer and I will check it for you!`;
        }
    }

    generateContextualResponse(cleanQuery, lowerQ, context) {
        return this.generateDefinitionExplanation(lowerQ, context);
    }
}

// =============================================================================
// MAIN CHAT APPLICATION CONTROLLER
// =============================================================================

class AlgebrifyAITutor {
    constructor() {
        // UI References
        this.appContainer = document.querySelector(".tutor-chat-app");
        this.sidebar = document.getElementById("tutor-sidebar");
        this.sidebarBackdrop = document.getElementById("sidebar-backdrop");
        this.sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
        this.sidebarCloseBtn = document.getElementById("sidebar-close-btn");
        this.sessionsListEl = document.getElementById("chat-sessions-list");
        this.newChatBtn = document.getElementById("new-chat-btn");
        this.clearAllSessionsBtn = document.getElementById("clear-all-sessions-btn");

        this.messagesContainer = document.getElementById("tutor-messages");
        this.inputField = document.getElementById("tutor-user-input");
        this.sendBtn = document.getElementById("tutor-send-btn");
        this.statusText = document.getElementById("tutor-status-text");
        this.activeChatTitle = document.getElementById("active-chat-title");
        this.clearChatBtn = document.getElementById("clear-chat-btn");

        // API Key modal elements
        this.apiKeyBtn = document.getElementById("tutor-api-key-btn");
        this.apiKeyModal = document.getElementById("api-key-modal");
        this.closeModalBtn = document.getElementById("close-modal-btn");
        this.saveApiKeyBtn = document.getElementById("save-api-key-btn");
        this.testApiKeyBtn = document.getElementById("test-api-key-btn");
        this.apiKeyInput = document.getElementById("api-key-input");
        this.apiProviderSelect = document.getElementById("api-provider-select");
        this.apiTestFeedback = document.getElementById("api-test-feedback");
        this.toggleKeyVisibilityBtn = document.getElementById("toggle-key-visibility-btn");

        // State Management
        this.apiKey = localStorage.getItem("algebrify_ai_key") || sessionStorage.getItem("algebrify_gemini_key") || "";
        this.apiProvider = localStorage.getItem("algebrify_ai_provider") || "auto";
        this.sessions = this.loadSessions();
        this.currentSessionId = localStorage.getItem("algebrify_active_session_id") || "";
        this.isGenerating = false;

        // Dynamic Mathematical & Pedagogical Reasoning Engine
        this.reasoningEngine = new LinearAlgebraReasoningEngine();

        this.init();
    }

    init() {
        if (!this.sessions || this.sessions.length === 0) {
            this.createNewSession("New Conversation");
        } else if (!this.getSession(this.currentSessionId)) {
            this.currentSessionId = this.sessions[0].id;
            this.saveActiveSessionId();
        }

        this.renderSessionsList();
        this.renderActiveSessionMessages();
        this.bindEvents();
        this.updateStatusBadge();
    }

    updateStatusBadge() {
        if (!this.statusText) return;
        if (this.apiKey) {
            const provider = this.detectProvider(this.apiKey, this.apiProvider);
            const label = provider === "gemini" ? "Gemini AI (Live)" 
                        : provider === "openai" ? "ChatGPT (Live)"
                        : provider === "groq" ? "Groq Llama 3 (Live)" 
                        : "Live AI Connected";
            this.statusText.textContent = label;
        } else {
            this.statusText.textContent = "ChatGPT AI Tutor • Online";
        }
    }

    bindEvents() {
        // Send Button Click
        if (this.sendBtn) {
            this.sendBtn.addEventListener("click", () => this.handleSendMessage());
        }

        // Input Field Events (Enter to send, Shift+Enter for new line, Auto-expand)
        if (this.inputField) {
            this.inputField.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });

            this.inputField.addEventListener("input", () => {
                this.inputField.style.height = "auto";
                this.inputField.style.height = Math.min(this.inputField.scrollHeight, 160) + "px";
            });
        }

        // Sidebar Toggle for Mobile & Desktop
        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener("click", () => {
                this.sidebar.classList.toggle("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.toggle("active");
            });
        }

        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener("click", () => {
                this.sidebar.classList.remove("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
            });
        }

        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener("click", () => {
                this.sidebar.classList.remove("open");
                this.sidebarBackdrop.classList.remove("active");
            });
        }

        // New Chat Button
        if (this.newChatBtn) {
            this.newChatBtn.addEventListener("click", () => {
                this.createNewSession("New Conversation");
                if (window.innerWidth <= 768 && this.sidebar) {
                    this.sidebar.classList.remove("open");
                    if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
                }
            });
        }

        // Clear Current Chat Button
        if (this.clearChatBtn) {
            this.clearChatBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear messages in this chat?")) {
                    const session = this.getActiveSession();
                    if (session) {
                        session.messages = [];
                        this.saveSessions();
                        this.renderActiveSessionMessages();
                    }
                }
            });
        }

        // Clear All Sessions Button
        if (this.clearAllSessionsBtn) {
            this.clearAllSessionsBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to delete ALL chat history?")) {
                    this.sessions = [];
                    this.createNewSession("New Conversation");
                }
            });
        }

        // Prompt Chips
        const chipsContainer = document.getElementById("tutor-prompt-chips");
        if (chipsContainer) {
            chipsContainer.addEventListener("click", (e) => {
                const chip = e.target.closest(".tutor-chip");
                if (chip) {
                    const prompt = chip.getAttribute("data-prompt");
                    if (prompt && this.inputField) {
                        this.inputField.value = prompt;
                        this.handleSendMessage();
                    }
                }
            });
        }

        // API Key Modal Open
        if (this.apiKeyBtn) {
            this.apiKeyBtn.addEventListener("click", () => {
                if (this.apiKeyInput) this.apiKeyInput.value = this.apiKey;
                if (this.apiProviderSelect) this.apiProviderSelect.value = this.apiProvider;
                if (this.apiTestFeedback) this.apiTestFeedback.style.display = "none";
                if (this.apiKeyModal) this.apiKeyModal.classList.add("active");
            });
        }

        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener("click", () => {
                if (this.apiKeyModal) this.apiKeyModal.classList.remove("active");
            });
        }

        // Toggle Key Visibility
        if (this.toggleKeyVisibilityBtn && this.apiKeyInput) {
            this.toggleKeyVisibilityBtn.addEventListener("click", () => {
                const isPassword = this.apiKeyInput.type === "password";
                this.apiKeyInput.type = isPassword ? "text" : "password";
                this.toggleKeyVisibilityBtn.innerHTML = isPassword 
                    ? `<i data-lucide="eye-off"></i>` 
                    : `<i data-lucide="eye"></i>`;
                if (window.lucide) lucide.createIcons();
            });
        }

        // Save Key
        if (this.saveApiKeyBtn) {
            this.saveApiKeyBtn.addEventListener("click", () => {
                const val = this.apiKeyInput.value.trim();
                const provider = this.apiProviderSelect ? this.apiProviderSelect.value : "auto";
                this.apiKey = val;
                this.apiProvider = provider;

                if (val) {
                    localStorage.setItem("algebrify_ai_key", val);
                    localStorage.setItem("algebrify_ai_provider", provider);
                    sessionStorage.setItem("algebrify_gemini_key", val);
                } else {
                    localStorage.removeItem("algebrify_ai_key");
                    localStorage.removeItem("algebrify_ai_provider");
                    sessionStorage.removeItem("algebrify_gemini_key");
                }

                this.updateStatusBadge();
                if (this.apiKeyModal) this.apiKeyModal.classList.remove("active");
            });
        }

        // Test API Key
        if (this.testApiKeyBtn) {
            this.testApiKeyBtn.addEventListener("click", async () => {
                const val = this.apiKeyInput.value.trim();
                const provider = this.apiProviderSelect ? this.apiProviderSelect.value : "auto";
                if (!val) {
                    this.showTestFeedback("Please paste an API key first.", false);
                    return;
                }

                this.testApiKeyBtn.disabled = true;
                this.testApiKeyBtn.innerHTML = `<i data-lucide="loader"></i> Testing...`;
                if (window.lucide) lucide.createIcons();

                try {
                    const result = await this.testAPIConnection(val, provider);
                    this.showTestFeedback(`✓ Success! Connected to ${result.name}.`, true);
                } catch (err) {
                    this.showTestFeedback(`✗ Connection failed: ${err.message}`, false);
                } finally {
                    this.testApiKeyBtn.disabled = false;
                    this.testApiKeyBtn.innerHTML = `<i data-lucide="zap"></i> Test Connection`;
                    if (window.lucide) lucide.createIcons();
                }
            });
        }
    }

    showTestFeedback(msg, isSuccess) {
        if (!this.apiTestFeedback) return;
        this.apiTestFeedback.style.display = "block";
        this.apiTestFeedback.style.background = isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
        this.apiTestFeedback.style.color = isSuccess ? "#10b981" : "#ef4444";
        this.apiTestFeedback.style.border = `1px solid ${isSuccess ? "#10b981" : "#ef4444"}`;
        this.apiTestFeedback.textContent = msg;
    }

    detectProvider(key, selectedProvider = "auto") {
        if (selectedProvider && selectedProvider !== "auto") return selectedProvider;
        const k = key.trim();
        if (k.startsWith("AIzaSy")) return "gemini";
        if (k.startsWith("gsk_")) return "groq";
        if (k.startsWith("sk-or-")) return "openrouter";
        if (k.startsWith("sk-")) return "openai";
        return "gemini";
    }

    async testAPIConnection(key, providerSetting) {
        const provider = this.detectProvider(key, providerSetting);

        if (provider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: "ping" }] }],
                    generationConfig: { maxOutputTokens: 5 }
                })
            });
            if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
            return { name: "Google Gemini Flash" };
        } else if (provider === "groq") {
            const url = "https://api.groq.com/openai/v1/chat/completions";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: "ping" }],
                    max_tokens: 5
                })
            });
            if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
            return { name: "Groq Llama 3.3" };
        } else {
            const url = "https://api.openai.com/v1/chat/completions";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: "ping" }],
                    max_tokens: 5
                })
            });
            if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
            return { name: "OpenAI ChatGPT" };
        }
    }

    // =========================================================================
    // SESSION & LOCALSTORAGE MANAGEMENT
    // =========================================================================

    loadSessions() {
        try {
            const raw = localStorage.getItem("algebrify_chat_sessions");
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error loading chat sessions:", e);
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem("algebrify_chat_sessions", JSON.stringify(this.sessions));
        } catch (e) {
            console.error("Error saving chat sessions:", e);
        }
    }

    saveActiveSessionId() {
        try {
            localStorage.setItem("algebrify_active_session_id", this.currentSessionId);
        } catch (e) {
            console.error("Error saving active session ID:", e);
        }
    }

    getActiveSession() {
        return this.sessions.find(s => s.id === this.currentSessionId);
    }

    getSession(id) {
        return this.sessions.find(s => s.id === id);
    }

    createNewSession(title = "New Conversation") {
        const newSession = {
            id: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
            title: title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: []
        };

        this.sessions.unshift(newSession);
        this.currentSessionId = newSession.id;
        this.saveSessions();
        this.saveActiveSessionId();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    switchSession(sessionId) {
        if (this.isGenerating) return;
        this.currentSessionId = sessionId;
        this.saveActiveSessionId();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    deleteSession(sessionId, event) {
        if (event) event.stopPropagation();
        if (this.sessions.length <= 1) {
            this.sessions = [];
            this.createNewSession("New Conversation");
            return;
        }

        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        if (this.currentSessionId === sessionId) {
            this.currentSessionId = this.sessions[0].id;
            this.saveActiveSessionId();
        }

        this.saveSessions();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    renameSession(sessionId, newTitle, event) {
        if (event) event.stopPropagation();
        const session = this.getSession(sessionId);
        if (session && newTitle.trim()) {
            session.title = newTitle.trim();
            session.updatedAt = Date.now();
            this.saveSessions();
            this.renderSessionsList();
            if (this.currentSessionId === sessionId && this.activeChatTitle) {
                this.activeChatTitle.textContent = session.title;
            }
        }
    }

    renderSessionsList() {
        if (!this.sessionsListEl) return;
        this.sessionsListEl.innerHTML = "";

        this.sessions.forEach((session) => {
            const isActive = session.id === this.currentSessionId;
            const item = document.createElement("div");
            item.className = `session-item ${isActive ? "active" : ""}`;
            item.setAttribute("data-session-id", session.id);

            const titleSpan = document.createElement("span");
            titleSpan.className = "session-title";
            titleSpan.textContent = session.title || "Conversation";

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "session-actions";

            // Rename button
            const renameBtn = document.createElement("button");
            renameBtn.className = "session-action-btn";
            renameBtn.title = "Rename";
            renameBtn.innerHTML = `<i data-lucide="edit-3"></i>`;
            renameBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const updatedTitle = prompt("Enter conversation title:", session.title);
                if (updatedTitle) this.renameSession(session.id, updatedTitle, e);
            });

            // Delete button
            const delBtn = document.createElement("button");
            delBtn.className = "session-action-btn delete";
            delBtn.title = "Delete";
            delBtn.innerHTML = `<i data-lucide="trash"></i>`;
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${session.title}"?`)) {
                    this.deleteSession(session.id, e);
                }
            });

            actionsDiv.appendChild(renameBtn);
            actionsDiv.appendChild(delBtn);

            item.appendChild(titleSpan);
            item.appendChild(actionsDiv);

            item.addEventListener("click", () => {
                this.switchSession(session.id);
                if (window.innerWidth <= 768 && this.sidebar) {
                    this.sidebar.classList.remove("open");
                    if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
                }
            });

            this.sessionsListEl.appendChild(item);
        });

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    // =========================================================================
    // CHAT MESSAGE RENDERING & ACTIONS
    // =========================================================================

    renderActiveSessionMessages() {
        if (!this.messagesContainer) return;
        this.messagesContainer.innerHTML = "";

        const session = this.getActiveSession();
        if (!session) return;

        if (this.activeChatTitle) {
            this.activeChatTitle.textContent = session.title || "New Conversation";
        }

        if (session.messages.length === 0) {
            this.renderEmptyState();
        } else {
            session.messages.forEach((msg, idx) => {
                this.renderMessageElement(msg, idx);
            });
            this.scrollToBottom();
        }
    }

    renderEmptyState() {
        const emptyState = document.createElement("div");
        emptyState.className = "tutor-empty-state";
        emptyState.innerHTML = `
            <div class="empty-state-icon">
                <i data-lucide="sparkles"></i>
            </div>
            <h2>ChatGPT Linear Algebra Tutor</h2>
            <p class="empty-state-subtitle">Your AI learning companion for Matrices, Vectors, Systems of Equations, Determinants, and Eigenvalues. Ask anything or choose a starting prompt below:</p>
            
            <div class="starter-cards-grid">
                <div class="starter-card" data-prompt="Explain Eigenvalues and Eigenvectors step by step with geometric intuition">
                    <div class="starter-card-icon"><i data-lucide="lightbulb"></i></div>
                    <h4>Concept & Intuition</h4>
                    <p>"Explain Eigenvalues and Eigenvectors using geometric intuition"</p>
                </div>
                <div class="starter-card" data-prompt="Find the inverse of [[1, 2], [3, 4]] with step-by-step Gauss-Jordan elimination">
                    <div class="starter-card-icon"><i data-lucide="calculator"></i></div>
                    <h4>Step-by-Step Solver</h4>
                    <p>"Find the inverse of a 2x2 matrix showing intermediate steps"</p>
                </div>
                <div class="starter-card" data-prompt="What is the difference between a vector space and a subspace?">
                    <div class="starter-card-icon"><i data-lucide="help-circle"></i></div>
                    <h4>Concept Comparison</h4>
                    <p>"What is the difference between a vector space and a subspace?"</p>
                </div>
                <div class="starter-card" data-prompt="Show Python NumPy code to compute matrix multiplication, determinant, and eigenvalues">
                    <div class="starter-card-icon"><i data-lucide="code"></i></div>
                    <h4>Python & NumPy</h4>
                    <p>"How to perform matrix operations and eigen-decomposition in Python"</p>
                </div>
            </div>
        `;

        emptyState.querySelectorAll(".starter-card").forEach(card => {
            card.addEventListener("click", () => {
                const prompt = card.getAttribute("data-prompt");
                if (prompt && this.inputField) {
                    this.inputField.value = prompt;
                    this.handleSendMessage();
                }
            });
        });

        this.messagesContainer.appendChild(emptyState);
        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    renderMessageElement(msg, index) {
        const isUser = msg.role === "user";
        const row = document.createElement("div");
        row.className = `chat-message ${isUser ? "user-row" : "tutor-row"}`;
        row.setAttribute("data-msg-index", index);

        // Avatar
        const avatar = document.createElement("div");
        avatar.className = `chat-avatar ${isUser ? "user-avatar" : "tutor-avatar"}`;
        avatar.innerHTML = isUser 
            ? `<i data-lucide="user"></i>` 
            : `<i data-lucide="sparkles"></i>`;

        // Content
        const contentBox = document.createElement("div");
        contentBox.className = `chat-content ${isUser ? "user-content" : "tutor-content"}`;

        const textEl = document.createElement("div");
        textEl.className = "message-body";
        textEl.innerHTML = isUser ? this.escapeHtml(msg.text) : this.formatMarkdownToHtml(msg.text);
        contentBox.appendChild(textEl);

        // Actions toolbar for Tutor responses
        if (!isUser) {
            const actionsBar = document.createElement("div");
            actionsBar.className = "message-actions";

            // Copy Action
            const copyBtn = document.createElement("button");
            copyBtn.className = "msg-action-btn";
            copyBtn.title = "Copy response";
            copyBtn.innerHTML = `<i data-lucide="copy"></i> <span>Copy</span>`;
            copyBtn.addEventListener("click", () => this.copyToClipboard(msg.text, copyBtn));

            // Regenerate Action
            const regenBtn = document.createElement("button");
            regenBtn.className = "msg-action-btn";
            regenBtn.title = "Regenerate response";
            regenBtn.innerHTML = `<i data-lucide="rotate-cw"></i> <span>Regenerate</span>`;
            regenBtn.addEventListener("click", () => this.regenerateResponse(index));

            // Helpful feedback buttons
            const thumbsUp = document.createElement("button");
            thumbsUp.className = `msg-action-btn feedback ${msg.feedback === 'up' ? 'active' : ''}`;
            thumbsUp.title = "Helpful";
            thumbsUp.innerHTML = `<i data-lucide="thumbs-up"></i>`;
            thumbsUp.addEventListener("click", () => {
                msg.feedback = msg.feedback === 'up' ? null : 'up';
                this.saveSessions();
                this.renderActiveSessionMessages();
            });

            const thumbsDown = document.createElement("button");
            thumbsDown.className = `msg-action-btn feedback ${msg.feedback === 'down' ? 'active' : ''}`;
            thumbsDown.title = "Not helpful";
            thumbsDown.innerHTML = `<i data-lucide="thumbs-down"></i>`;
            thumbsDown.addEventListener("click", () => {
                msg.feedback = msg.feedback === 'down' ? null : 'down';
                this.saveSessions();
                this.renderActiveSessionMessages();
            });

            actionsBar.appendChild(copyBtn);
            actionsBar.appendChild(regenBtn);
            actionsBar.appendChild(thumbsUp);
            actionsBar.appendChild(thumbsDown);
            contentBox.appendChild(actionsBar);
        }

        row.appendChild(avatar);
        row.appendChild(contentBox);
        this.messagesContainer.appendChild(row);

        // Render KaTeX Math
        if (window.renderAllMath) {
            renderAllMath(textEl);
        } else if (window.renderMathInElement) {
            renderMathInElement(textEl, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            });
        }

        // Attach Code Copy Listeners
        textEl.querySelectorAll(".copy-code-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const codeBlock = btn.closest(".code-block-wrapper").querySelector("code");
                if (codeBlock) {
                    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = `<i data-lucide="check"></i> Copied!`;
                        if (window.lucide) lucide.createIcons();
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            if (window.lucide) lucide.createIcons();
                        }, 2000);
                    });
                }
            });
        });

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    copyToClipboard(text, buttonEl) {
        navigator.clipboard.writeText(text).then(() => {
            const span = buttonEl.querySelector("span");
            const original = span ? span.textContent : "";
            if (span) span.textContent = "Copied!";
            buttonEl.classList.add("copied");
            setTimeout(() => {
                if (span) span.textContent = original;
                buttonEl.classList.remove("copied");
            }, 2000);
        }).catch(err => {
            console.error("Copy error:", err);
        });
    }

    scrollToBottom() {
        if (!this.messagesContainer) return;
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        requestAnimationFrame(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        });

        setTimeout(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        }, 120);
    }

    // =========================================================================
    // MESSAGE SENDING & GENERATION PIPELINE
    // =========================================================================

    async handleSendMessage() {
        if (this.isGenerating) return;
        const text = this.inputField.value.trim();
        if (!text) return;

        const session = this.getActiveSession();
        if (!session) return;

        // Auto title from first prompt
        if (session.messages.length === 0) {
            session.title = this.generateSessionTitle(text);
            this.saveSessions();
            this.renderSessionsList();
            if (this.activeChatTitle) this.activeChatTitle.textContent = session.title;
        }

        // Add user message to session
        session.messages.push({
            role: "user",
            text: text,
            timestamp: Date.now()
        });
        session.updatedAt = Date.now();
        this.saveSessions();

        // Clear input and adjust height
        this.inputField.value = "";
        this.inputField.style.height = "auto";

        // Render user message immediately
        this.renderActiveSessionMessages();

        // Set generating UI state
        this.setGeneratingState(true);

        try {
            let responseText = "";
            if (this.apiKey) {
                try {
                    responseText = await this.queryLiveAI(session);
                } catch (liveAiErr) {
                    console.warn("Live AI failed, falling back to dynamic math engine:", liveAiErr);
                    responseText = this.reasoningEngine.processQuery(text, session);
                }
            } else {
                // Generative dynamic solver + pedagogical reasoning engine
                await new Promise(r => setTimeout(r, 400));
                responseText = this.reasoningEngine.processQuery(text, session);
            }

            // Append AI response
            session.messages.push({
                role: "model",
                text: responseText,
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();

            this.setGeneratingState(false);
            this.renderActiveSessionMessages();
        } catch (err) {
            console.error("AI Generation Error:", err);
            this.setGeneratingState(false);

            session.messages.push({
                role: "model",
                text: "Sorry, I couldn't process that question right now. Please try again.",
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();
            this.renderActiveSessionMessages();
        }
    }

    async regenerateResponse(msgIndex) {
        if (this.isGenerating) return;
        const session = this.getActiveSession();
        if (!session || msgIndex < 0 || msgIndex >= session.messages.length) return;

        // Remove starting from msgIndex
        session.messages.splice(msgIndex, session.messages.length - msgIndex);
        this.saveSessions();
        this.renderActiveSessionMessages();

        this.setGeneratingState(true);

        try {
            let responseText = "";
            const lastUserMsg = session.messages[session.messages.length - 1];
            const textToQuery = lastUserMsg ? lastUserMsg.text : "Linear Algebra";

            if (this.apiKey) {
                try {
                    responseText = await this.queryLiveAI(session);
                } catch (e) {
                    responseText = this.reasoningEngine.processQuery(textToQuery, session);
                }
            } else {
                await new Promise(r => setTimeout(r, 400));
                responseText = this.reasoningEngine.processQuery(textToQuery, session);
            }

            session.messages.push({
                role: "model",
                text: responseText,
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();

            this.setGeneratingState(false);
            this.renderActiveSessionMessages();
        } catch (err) {
            this.setGeneratingState(false);
            session.messages.push({
                role: "model",
                text: "Sorry, I couldn't process that question right now. Please try again.",
                timestamp: Date.now(),
                feedback: null
            });
            this.saveSessions();
            this.renderActiveSessionMessages();
        }
    }

    setGeneratingState(isGenerating) {
        this.isGenerating = isGenerating;
        if (this.sendBtn) {
            this.sendBtn.disabled = isGenerating;
            this.sendBtn.innerHTML = isGenerating 
                ? `<div class="btn-spinner"></div>` 
                : `<i data-lucide="arrow-up"></i>`;
            if (window.lucide) lucide.createIcons();
        }

        if (isGenerating) {
            const typingRow = document.createElement("div");
            typingRow.className = "chat-message tutor-row typing-row";
            typingRow.id = "tutor-typing-indicator";
            typingRow.innerHTML = `
                <div class="chat-avatar tutor-avatar"><i data-lucide="sparkles"></i></div>
                <div class="chat-content tutor-content">
                    <div class="typing-bubble">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-label">Solving & Verifying Step-by-Step...</span>
                    </div>
                </div>
            `;
            this.messagesContainer.appendChild(typingRow);
            this.scrollToBottom();
            if (window.lucide) lucide.createIcons();
        } else {
            const el = document.getElementById("tutor-typing-indicator");
            if (el) el.remove();
        }
    }

    generateSessionTitle(firstPrompt) {
        const clean = firstPrompt.replace(/[\n\r]/g, " ").trim();
        if (clean.length <= 32) return clean;
        return clean.substring(0, 30) + "...";
    }

    // =========================================================================
    // MULTI-PROVIDER LIVE AI (GEMINI, OPENAI, GROQ, OPENROUTER)
    // =========================================================================

    async queryLiveAI(session) {
        const provider = this.detectProvider(this.apiKey, this.apiProvider);

        if (provider === "gemini") {
            return this.queryGeminiAPI(session);
        } else if (provider === "groq") {
            return this.queryGroqAPI(session);
        } else {
            return this.queryOpenAIAPI(session);
        }
    }

    async queryGeminiAPI(session) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        const contents = [];
        session.messages.forEach(msg => {
            contents.push({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            });
        });

        while (contents.length > 0 && contents[0].role !== "user") {
            contents.shift();
        }

        const payload = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2500
            }
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `Gemini API error (Status ${response.status})`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Empty response from Gemini API");
        return rawText;
    }

    async queryOpenAIAPI(session) {
        const endpoint = "https://api.openai.com/v1/chat/completions";
        const messages = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        session.messages.forEach(msg => {
            messages.push({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.text
            });
        });

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `OpenAI API error (Status ${response.status})`);
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response generated.";
    }

    async queryGroqAPI(session) {
        const endpoint = "https://api.groq.com/openai/v1/chat/completions";
        const messages = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        session.messages.forEach(msg => {
            messages.push({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.text
            });
        });

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `Groq API error (Status ${response.status})`);
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response generated.";
    }

    // =========================================================================
    // MARKDOWN & HTML FORMATTING
    // =========================================================================

    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    formatMarkdownToHtml(text) {
        if (!text) return "";

        let html = text;

        // 1. Code blocks (```python ... ```)
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang.trim() || "text";
            return `
                <div class="code-block-wrapper">
                    <div class="code-header">
                        <span class="code-lang">${language}</span>
                        <button class="copy-code-btn" type="button"><i data-lucide="copy"></i> Copy Code</button>
                    </div>
                    <pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>
                </div>
            `;
        });

        // 2. Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // 3. Tables (| Col 1 | Col 2 | ...)
        html = html.replace(/^\|(.+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|.+\|\r?\n?)+)/gm, (match, header, body) => {
            const headers = header.split('|').filter(c => c.trim().length > 0).map(c => `<th>${c.trim()}</th>`).join('');
            const rows = body.trim().split('\n').map(row => {
                const cells = row.split('|').filter(c => c.trim().length > 0).map(c => `<td>${c.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            return `<div class="table-responsive"><table class="tutor-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
        });

        // 4. Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // 5. Bold & Italic
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 6. Blockquotes (> ...)
        html = html.replace(/^\> (.*$)/gim, '<blockquote class="tutor-quote">$1</blockquote>');

        // 7. Horizontal rules (---)
        html = html.replace(/^---$/gim, '<hr class="tutor-divider">');

        // 8. Bullet points & Lists
        html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // 9. Numbered lists (1. ...)
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="num-item">$1</li>');

        // 10. Paragraph linebreaks
        html = html.replace(/\n\n/g, '<p></p>');

        return html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.algebrifyTutor = new AlgebrifyAITutor();
});
