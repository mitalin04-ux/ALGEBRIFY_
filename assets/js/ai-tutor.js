/**
 * ALGEBRIFY - CLIENT-SIDE LINEAR ALGEBRA AI TUTOR
 * 100% Pure Frontend JavaScript • Compatible with GitHub Pages
 * Multi-turn Conversational Memory • Structured Knowledge Graph • Symbolic Math Engine
 */

// =============================================================================
// 1. STRUCTURED LINEAR ALGEBRA KNOWLEDGE BASE (10 MODULES)
// =============================================================================

const LINEAR_ALGEBRA_KB = {
    // -------------------------------------------------------------------------
    // MODULE 1: ALGEBRA OF MATRICES
    // -------------------------------------------------------------------------
    "matrices": {
        title: "Algebra of Matrices",
        keywords: ["matrix", "matrices", "transpose", "symmetric", "skew-symmetric", "orthogonal matrix", "identity matrix", "diagonal matrix", "trace", "matrix multiplication", "matrix addition", "order of matrix", "row matrix", "column matrix", "matrix operations", "algebra of matrices", "zero matrix", "null matrix", "scalar multiplication"],
        definition: {
            formal: "A **matrix** $A$ of order $m \\times n$ (read '$m$ by $n$') is a rectangular array of numbers or symbols arranged into $m$ horizontal **rows** and $n$ vertical **columns**:\n$$ A = \\begin{bmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\ a_{21} & a_{22} & \\dots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\dots & a_{mn} \\end{bmatrix} = [a_{ij}]_{m \\times n} $$",
            simple: "A **matrix** is a 2D table or grid of numbers. It acts like a compact container that can store equations, datasets, or geometric transformations (like stretching, rotating, or reflecting space).",
            example: "For example, $A = \\begin{bmatrix} 3 & -1 & 4 \\\\ 0 & 5 & 2 \\end{bmatrix}$ is a $2 \\times 3$ matrix with 2 rows and 3 columns. The entry in Row 1, Column 2 is $a_{12} = -1$."
        },
        types: [
            "**Row Matrix:** A matrix with only 1 row ($1 \\times n$), e.g. $\\begin{bmatrix} 2 & -1 & 5 \\end{bmatrix}$.",
            "**Column Matrix:** A matrix with only 1 column ($m \\times 1$), e.g. $\\begin{bmatrix} 4 \\\\ 7 \\end{bmatrix}$.",
            "**Square Matrix:** A matrix where the number of rows equals the number of columns ($m = n$).",
            "**Diagonal Matrix:** A square matrix where all off-diagonal entries are zero ($a_{ij} = 0$ for $i \\neq j$), e.g. $\\begin{bmatrix} 4 & 0 \\\\ 0 & -3 \\end{bmatrix}$.",
            "**Identity Matrix ($I$):** A diagonal matrix whose main diagonal entries are all $1$, e.g. $I_2 = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$.",
            "**Zero Matrix ($O$):** A matrix where every entry is $0$.",
            "**Symmetric Matrix:** A square matrix satisfying $A^T = A$ ($a_{ij} = a_{ji}$).",
            "**Skew-Symmetric Matrix:** A square matrix satisfying $A^T = -A$ ($a_{ij} = -a_{ji}$, with all diagonal entries $a_{ii} = 0$)."
        ],
        properties: [
            "**Matrix Addition:** $A + B = B + A$ (Commutative) and $(A + B) + C = A + (B + C)$ (Associative), defined only when $A$ and $B$ have the exact same order.",
            "**Non-Commutative Multiplication:** In general, $AB \\neq BA$. Matrix multiplication is NOT commutative!",
            "**Associativity of Multiplication:** $(AB)C = A(BC)$ whenever dimensions are compatible.",
            "**Distributivity:** $A(B + C) = AB + AC$ and $(A + B)C = AC + BC$.",
            "**Transpose Properties:** $(A^T)^T = A$, $(A + B)^T = A^T + B^T$, and the reversal rule **$(AB)^T = B^T A^T$**."
        ],
        why: {
            "multiplication_dimension": "Matrix multiplication $AB$ requires that the **number of columns in $A$ equals the number of rows in $B$** ($A_{m \\times k} \\times B_{k \\times n} = C_{m \\times n}$). This is because entry $c_{ij}$ is computed as the **dot product** of Row $i$ from matrix $A$ and Column $j$ from matrix $B$. If their lengths do not match, pairs cannot be multiplied.",
            "non_commutative": "Matrix multiplication represents the **composition of transformations**. In geometry, doing Transformation $A$ followed by Transformation $B$ (e.g. rotating then stretching) usually produces a completely different result from doing $B$ first then $A$. Hence, $AB \\neq BA$ in general."
        },
        simplerExplanation: "Think of a matrix like a spreadsheet or a photo filter: each cell stores a number, and when you multiply a vector or shape by that matrix, it adjusts every coordinate at once—stretching, turning, or shifting the entire shape.",
        misconceptions: "A common mistake is multiplying matrices element-by-element like addition. Matrix multiplication is row-by-column dot products, not element-wise multiplication."
    },

    // -------------------------------------------------------------------------
    // MODULE 2: SYSTEMS OF LINEAR EQUATIONS
    // -------------------------------------------------------------------------
    "linear-systems": {
        title: "Systems of Linear Equations",
        keywords: ["system of linear equations", "systems of equations", "linear system", "gaussian elimination", "gauss-jordan", "echelon form", "row echelon", "rref", "ref", "augmented matrix", "row operations", "homogeneous", "cramer", "consistency", "inconsistent", "free variable", "pivot", "back-substitution"],
        definition: {
            formal: "A **system of $m$ linear equations in $n$ variables** is represented in matrix notation as:\n$$ A\\mathbf{x} = \\mathbf{b} $$\nwhere $A_{m \\times n}$ is the coefficient matrix, $\\mathbf{x}_{n \\times 1}$ is the column vector of unknowns, and $\\mathbf{b}_{m \\times 1}$ is the constant vector.",
            simple: "A system of linear equations is a collection of straight-line (or flat-plane) equations involving the same variables. Solving the system means finding the point $(x, y, z)$ where all the equations meet simultaneously.",
            example: "For example:\n$$\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases} \\implies \\begin{bmatrix} 2 & 1 \\\\ 1 & -1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 1 \\end{bmatrix} \\implies (x=2, y=1)$$"
        },
        types: [
            "**Consistent System (Unique Solution):** The hyperplanes intersect at exactly one point. $\\text{rank}(A) = \\text{rank}([A|b]) = n$.",
            "**Consistent System (Infinitely Many Solutions):** The equations overlap, leaving at least one free variable. $\\text{rank}(A) = \\text{rank}([A|b]) < n$.",
            "**Inconsistent System (No Solution):** The hyperplanes are parallel and never meet. During row reduction, a contradictory row like $[0 \\ 0 \\ \\dots \\ 0 \\mid k]$ with $k \\neq 0$ appears ($0 = k$)."
        ],
        procedures: {
            "gaussian_elimination": "1. **Form the Augmented Matrix:** Write $[A \\mid \\mathbf{b}]$.\n2. **Forward Elimination:** Use elementary row operations to create zeros below each pivot, reducing to **Row Echelon Form (REF)**.\n3. **Back-Substitution:** Solve for the bottom variable directly, then substitute upwards to find the remaining variables."
        },
        properties: [
            "**3 Elementary Row Operations:** (1) Swap two rows ($R_i \\leftrightarrow R_j$), (2) Multiply a row by a non-zero scalar ($R_i \\leftarrow k R_i$), (3) Add a multiple of one row to another ($R_i \\leftarrow R_i + k R_j$).",
            "Row operations **preserve the solution set** of the system."
        ],
        why: {
            "why_row_operations_work": "Elementary row operations correspond to performing valid algebraic manipulations (multiplying an equation by a constant, adding two equations together, or reordering equations). Because each row operation is reversible, the set of solution points never changes."
        },
        simplerExplanation: "Imagine two straight roads on a map: they can either cross at exactly one intersection (unique solution), run parallel and never meet (no solution), or be the exact same road on top of each other (infinitely many solutions). Gaussian elimination is simply a systematic way of finding that intersection point without guessing.",
        misconceptions: "Students often mistake a row of zeros $[0 \\ 0 \\mid 0]$ for 'no solution'. In reality, $0 = 0$ is a valid identity meaning there are infinitely many solutions (a free variable), whereas $[0 \\ 0 \\mid 5]$ ($0=5$) indicates no solution."
    },

    // -------------------------------------------------------------------------
    // MODULE 3: FIELD
    // -------------------------------------------------------------------------
    "fields": {
        title: "Field",
        keywords: ["field", "fields", "galois field", "gf(2)", "characteristic", "abelian", "field axioms", "closure", "additive inverse", "multiplicative inverse", "f_p", "field theory"],
        definition: {
            formal: "A **field** $\\mathbb{F} = (F, +, \\cdot)$ is a set $F$ equipped with two binary operations, **addition ($+$)** and **multiplication ($\\cdot$)**, satisfying 11 fundamental axioms:\n1. Closure under $+$ and $\\cdot$\n2. Associativity of $+$ and $\\cdot$\n3. Commutativity of $+$ and $\\cdot$\n4. Additive Identity ($0$) and Multiplicative Identity ($1 \\neq 0$)\n5. Additive Inverses ($-a$) and Multiplicative Inverses ($a^{-1}$ for $a \\neq 0$)\n6. Distributivity of $\\cdot$ over $+$: $a(b+c) = ab + ac$.",
            simple: "A **field** is an algebraic number universe where the 4 basic operations of arithmetic—addition, subtraction, multiplication, and division (except by zero)—always work cleanly without breaking any rules or leaving the set.",
            example: "Standard infinite fields include the Real numbers $\\mathbb{R}$, Complex numbers $\\mathbb{C}$, and Rational numbers $\\mathbb{Q}$. The integers $\\mathbb{Z}$ are **NOT** a field because integers like $2$ lack multiplicative inverses ($1/2 \\notin \\mathbb{Z}$)."
        },
        types: [
            "**Infinite Fields:** $\\mathbb{R}$ (Reals), $\\mathbb{C}$ (Complex numbers), $\\mathbb{Q}$ (Rationals).",
            "**Galois Field $\\text{GF}(2)$:** The smallest finite field $\\{0, 1\\}$ with modulo 2 arithmetic where $1 + 1 = 0$, extensively used in cryptography and computer science.",
            "**Finite Fields $\\mathbb{F}_p$:** The set $\\{0, 1, \\dots, p-1\\}$ with arithmetic modulo a prime number $p$."
        ],
        properties: [
            "No zero divisors: If $ab = 0$ in a field $\\mathbb{F}$, then either $a = 0$ or $b = 0$.",
            "Every vector space must be defined over a specific base field $\\mathbb{F}$ (which supplies the scalars)."
        ],
        simplerExplanation: "A field is a complete arithmetic playground: you can add, subtract, multiply, and divide any numbers (except division by 0), and you will always land on another number in that same playground.",
        misconceptions: "Students often think all number sets are fields. Integers $\\mathbb{Z}$ are not a field because dividing two integers does not always yield an integer."
    },

    // -------------------------------------------------------------------------
    // MODULE 4: VECTORS
    // -------------------------------------------------------------------------
    "vectors": {
        title: "Vectors",
        keywords: ["vector", "vectors", "dot product", "cross product", "scalar product", "vector product", "magnitude", "norm", "unit vector", "angle between vectors", "projection", "orthogonal projection", "direction cosines"],
        definition: {
            formal: "In Euclidean space $\\mathbb{R}^n$, an algebraic **vector** $\\mathbf{v}$ is an ordered $n$-tuple of real numbers $\\mathbf{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\dots \\\\ v_n \\end{bmatrix}$. Geometrically, it represents a directed line segment with both **magnitude (length)** and **direction**.",
            simple: "A **vector** is an arrow pointing from one location to another. It has a length (magnitude) and a direction in space.",
            example: "For $\\mathbf{u} = \\begin{bmatrix} 1 \\\\ 3 \\end{bmatrix}$ and $\\mathbf{v} = \\begin{bmatrix} 4 \\\\ -2 \\end{bmatrix}$, the dot product is $\\mathbf{u} \\cdot \\mathbf{v} = (1)(4) + (3)(-2) = 4 - 6 = -2$."
        },
        formulas: {
            "dot_product": "$$ \\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta $$",
            "norm": "$$ \\|\\mathbf{v}\\| = \\sqrt{v_1^2 + v_2^2 + \\dots + v_n^2} = \\sqrt{\\mathbf{v} \\cdot \\mathbf{v}} $$",
            "projection": "$$ \\text{proj}_{\\mathbf{v}} \\mathbf{u} = \\left( \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}} \\right) \\mathbf{v} $$",
            "cross_product": "$$ \\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} $$"
        },
        properties: [
            "**Orthogonality Condition:** Two non-zero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular (orthogonal) if and only if **$\\mathbf{u} \\cdot \\mathbf{v} = 0$** ($\n\\cos 90^\\circ = 0$).",
            "**Cauchy-Schwarz Inequality:** $|\\mathbf{u} \\cdot \\mathbf{v}| \\le \\|\\mathbf{u}\\| \\|\\mathbf{v}\\|$, with equality if and only if vectors are linearly dependent.",
            "**Cross Product Nature:** $\\mathbf{u} \\times \\mathbf{v}$ produces a vector strictly orthogonal to both $\\mathbf{u}$ and $\\mathbf{v}$ in $\\mathbb{R}^3$, with magnitude equal to the area of the spanned parallelogram."
        ],
        why: {
            "dot_product_zero": "The geometric formula for the dot product is $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$. When two non-zero vectors meet at a $90^\\circ$ right angle, $\\cos 90^\\circ = 0$, making their dot product zero. Geometrically, neither vector has any shadow or projection onto the other."
        },
        simplerExplanation: "A vector is an arrow. The dot product measures how much two arrows point in the same direction: positive if they point together, negative if opposite, and zero if they meet at a crisp $90^\\circ$ angle.",
        misconceptions: "The dot product of two vectors produces a single scalar number, while the cross product produces a new 3D vector."
    },

    // -------------------------------------------------------------------------
    // MODULE 5: VECTOR SPACES
    // -------------------------------------------------------------------------
    "vector-spaces": {
        title: "Vector Spaces",
        keywords: ["vector space", "vector spaces", "subspace", "subspaces", "span", "spanning", "linear combination", "linear independence", "linearly independent", "linearly dependent", "basis", "dimension", "subspace test"],
        definition: {
            formal: "A **vector space** $V$ over a field $\\mathbb{F}$ is a non-empty set of vectors closed under **vector addition** and **scalar multiplication**, satisfying the 8 vector space axioms (commutativity, associativity, zero vector, additive inverses, distributivity over scalars and vectors, and scalar identity).",
            simple: "A **vector space** is an infinite mathematical universe of vectors where you can add any vectors and scale them by numbers without ever leaving the space.",
            example: "The set $\\mathbb{R}^3$ of all 3D coordinates $(x, y, z)$ is a 3-dimensional vector space over $\\mathbb{R}$. The standard basis is $\\{\\mathbf{e}_1, \\mathbf{e}_2, \\mathbf{e}_3\\}$ where $\\mathbf{e}_1 = \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}$, $\\mathbf{e}_2 = \\begin{bmatrix} 0 \\\\ 1 \\\\ 0 \\end{bmatrix}$, $\\mathbf{e}_3 = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}$."
        },
        subspaceTest: "To prove a subset $W \\subseteq V$ is a **subspace**, verify the **3-Step Subspace Test**:\n1. **Zero Vector:** $\\mathbf{0} \\in W$\n2. **Closure under Addition:** $\\mathbf{u}, \\mathbf{v} \\in W \\implies \\mathbf{u} + \\mathbf{v} \\in W$\n3. **Closure under Scalar Multiplication:** $c \\in \\mathbb{F}, \\mathbf{u} \\in W \\implies c\\mathbf{u} \\in W$",
        comparisons: {
            "span_vs_basis": "| Feature | **Span ($\n\\text{span}(S)$)** | **Basis ($\n\\mathcal{B}$)** |\n| :--- | :--- | :--- |\n| **Concept** | The *entire space* of all possible linear combinations of vectors in $S$. | The *minimal, most efficient set* of vectors needed to build the space. |\n| **Independence** | Can contain redundant, dependent vectors. | Must be strictly **linearly independent** (zero redundancy). |\n| **Analogy** | All colors you can mix from a palette (even with duplicate blue tubes). | The essential primary colors without duplicate tubes. |",
            "space_vs_subspace": "| Feature | **Vector Space ($V$)** | **Subspace ($W$)** |\n| :--- | :--- | :--- |\n| **Definition** | The entire ambient universe of vectors. | A subset $W \\subseteq V$ that is itself a self-contained vector space. |\n| **Origin Requirement** | Contains the origin $\\mathbf{0}$. | **Must pass through the origin $(0,0,0)$**. |\n| **Example in $\\mathbb{R}^3$** | The whole 3D space $\\mathbb{R}^3$. | Any plane or line passing through $(0,0,0)$ (e.g. $2x - y + z = 0$). |"
        },
        why: {
            "why_zero_vector": "A subspace must be closed under scalar multiplication. If we choose the scalar $c = 0$, then for any vector $\\mathbf{v} \\in W$, we have $0 \\cdot \\mathbf{v} = \\mathbf{0}$. Therefore, every valid subspace MUST contain the zero vector."
        },
        simplerExplanation: "Think of cooking with flour and sugar: a Linear Combination is any recipe $(2 \\times \\text{flour}) + (3 \\times \\text{sugar})$; the Span is the menu of every recipe you can possibly create; a Basis is the minimal shopping list of essential ingredients without duplicate bags; and the Vector Space is the whole kitchen.",
        misconceptions: "A flat line or plane in $\\mathbb{R}^3$ that does not pass through the origin (like $x + y + z = 1$) is NOT a subspace because it does not contain the zero vector $(0,0,0)$."
    },

    // -------------------------------------------------------------------------
    // MODULE 6: LINEAR TRANSFORMATIONS
    // -------------------------------------------------------------------------
    "linear-transformations": {
        title: "Linear Transformations",
        keywords: ["linear transformation", "linear transformations", "linear map", "linear mapping", "kernel", "null space", "image", "range", "rank-nullity", "rank-nullity theorem", "dimension theorem", "injective", "surjective", "isomorphism"],
        definition: {
            formal: "A function $T: V \\to W$ between two vector spaces over a field $\\mathbb{F}$ is a **linear transformation** if it satisfies two linearity conditions for all $\\mathbf{u}, \\mathbf{v} \\in V$ and scalars $c \\in \\mathbb{F}$:\n1. **Additivity:** $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$\n2. **Homogeneity:** $T(c\\mathbf{u}) = cT(\\mathbf{u})$",
            simple: "A **linear transformation** is a function that transforms geometric space while keeping the origin fixed at $(0,0)$ and preserving all grid lines straight and evenly spaced (no bending, curving, or shifting).",
            example: "For $T(x, y) = (2x, x+y)$, $T$ is linear because $T(\\mathbf{u}+\\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ and $T(c\\mathbf{u}) = cT(\\mathbf{u})$."
        },
        properties: [
            "**Origin Invariance:** Always maps zero to zero: $T(\\mathbf{0}_V) = \\mathbf{0}_W$.",
            "**Kernel (Null Space):** $\\ker(T) = \\{\\mathbf{v} \\in V \\mid T(\\mathbf{v}) = \\mathbf{0}_W\\}$. Measures what gets collapsed to zero.",
            "**Image (Range):** $\\text{Im}(T) = \\{T(\\mathbf{v}) \\in W \\mid \\mathbf{v} \\in V\\}$. The set of all reachable outputs.",
            "**Rank-Nullity Theorem:**\n$$ \\dim(V) = \\text{nullity}(T) + \\text{rank}(T) = \\dim(\\ker(T)) + \\dim(\\text{Im}(T)) $$"
        ],
        why: {
            "rank_nullity": "The Rank-Nullity Theorem is the conservation of dimension: the total number of dimensions in the input space $\\dim(V)$ must equal the dimensions preserved in the output $\\text{rank}(T)$ plus the dimensions flattened into zero $\\text{nullity}(T)$."
        },
        simplerExplanation: "Imagine rubber graph paper: a linear transformation lets you stretch, turn, or compress the paper, but you can never bend the grid lines into curves or move the center point $(0,0)$.",
        misconceptions: "Functions with constant offsets like $f(x) = 2x + 1$ are affine, NOT linear transformations, because $f(0) = 1 \\neq 0$."
    },

    // -------------------------------------------------------------------------
    // MODULE 7: LINEAR TRANSFORMATIONS AND MATRICES
    // -------------------------------------------------------------------------
    "transformation-matrices": {
        title: "Linear Transformations and Matrices",
        keywords: ["transformation matrix", "transformation matrices", "matrix representation", "change of basis", "similarity", "similar matrices", "transition matrix", "standard matrix", "basis change", "coordinate vector"],
        definition: {
            formal: "Every linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ can be represented uniquely by an $m \\times n$ matrix $A = [T]$ such that $T(\\mathbf{x}) = A\\mathbf{x}$. The columns of $A$ are the transformed standard basis vectors:\n$$ [T] = \\begin{bmatrix} T(\\mathbf{e}_1) & T(\\mathbf{e}_2) & \\dots & T(\\mathbf{e}_n) \\end{bmatrix} $$",
            simple: "Matrices and linear transformations are two sides of the same coin: a matrix is simply the numerical recipe that tells you where every basis vector lands after the transformation.",
            example: "A counter-clockwise rotation by angle $\\theta$ in $\\mathbb{R}^2$ has standard matrix $R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$."
        },
        properties: [
            "**Change of Basis:** If matrix $A$ represents $T$ in basis $\\mathcal{B}$, its representation $B$ in another basis $\\mathcal{C}$ is given by the similarity transformation:\n$$ B = P^{-1}AP $$ where $P$ is the invertible change-of-basis transition matrix.",
            "**Similar Matrices Invariants:** Similar matrices ($B = P^{-1}AP$) share the exact same determinant, trace, eigenvalues, and characteristic polynomial."
        ],
        simplerExplanation: "Changing a basis is like describing the exact same physical movement or dance step from a different observer's point of view: the math coordinates change, but the underlying motion is identical.",
        misconceptions: "Students often forget that the columns of a transformation matrix are determined specifically by seeing where the standard basis vectors $\\mathbf{e}_1, \\mathbf{e}_2$ land."
    },

    // -------------------------------------------------------------------------
    // MODULE 8: INNER PRODUCT SPACES & ORTHOGONALITY
    // -------------------------------------------------------------------------
    "inner-products": {
        title: "Inner Product Spaces & Orthogonality",
        keywords: ["inner product", "inner products", "inner product space", "orthogonality", "orthogonal", "orthonormal", "cauchy-schwarz", "gram-schmidt", "orthogonal projection", "orthogonal complement", "orthonormal basis"],
        definition: {
            formal: "An **inner product space** is a vector space $V$ equipped with an inner product $\\langle \\mathbf{u}, \\mathbf{v} \\rangle$ that satisfies:\n1. **Conjugate Symmetry:** $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = \\overline{\\langle \\mathbf{v}, \\mathbf{u} \\rangle}$\n2. **Linearity in first argument:** $\\langle a\\mathbf{u} + b\\mathbf{v}, \\mathbf{w} \\rangle = a\\langle \\mathbf{u}, \\mathbf{w} \\rangle + b\\langle \\mathbf{v}, \\mathbf{w} \\rangle$\n3. **Positive-Definiteness:** $\\langle \\mathbf{v}, \\mathbf{v} \\rangle \\ge 0$, with $\\langle \\mathbf{v}, \\mathbf{v} \\rangle = 0 \\iff \\mathbf{v} = \\mathbf{0}$.",
            simple: "An inner product space is a vector space equipped with a ruler and protractor—giving us the tools to measure lengths, distances, and angles between abstract vectors.",
            example: "For $\\mathbf{u} = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$ and $\\mathbf{v} = \\begin{bmatrix} -2 \\\\ 1 \\end{bmatrix}$, $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = (1)(-2) + (2)(1) = 0$, so $\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal."
        },
        procedures: {
            "gram_schmidt": "The **Gram-Schmidt Process** converts an independent basis $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ into an orthogonal basis $\\{\\mathbf{u}_1, \\dots, \\mathbf{u}_k\\}$:\n1. $\\mathbf{u}_1 = \\mathbf{v}_1$\n2. $\\mathbf{u}_2 = \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2, \\mathbf{u}_1 \\rangle}{\\langle \\mathbf{u}_1, \\mathbf{u}_1 \\rangle} \\mathbf{u}_1$\n3. $\\mathbf{u}_3 = \\mathbf{v}_3 - \\frac{\\langle \\mathbf{v}_3, \\mathbf{u}_1 \\rangle}{\\langle \\mathbf{u}_1, \\mathbf{u}_1 \\rangle} \\mathbf{u}_1 - \\frac{\\langle \\mathbf{v}_3, \\mathbf{u}_2 \\rangle}{\\langle \\mathbf{u}_2, \\mathbf{u}_2 \\rangle} \\mathbf{u}_2$"
        },
        properties: [
            "**Pythagorean Theorem:** If $\\mathbf{u} \\perp \\mathbf{v}$, then $\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2$.",
            "**Orthogonal Matrix ($Q$):** A square matrix with orthonormal columns satisfying $Q^T Q = Q Q^T = I$, so **$Q^{-1} = Q^T$**."
        ],
        simplerExplanation: "An inner product is an overlap detector: if two vectors have zero overlap (angle $= 90^\\circ$), they are orthogonal and their inner product is exactly $0$.",
        misconceptions: "Orthogonal means perpendicular (vectors meet at $90^\\circ$). Orthonormal means orthogonal AND each vector has unit length ($\\|\\mathbf{u}\\| = 1$)."
    },

    // -------------------------------------------------------------------------
    // MODULE 9: DETERMINANTS
    // -------------------------------------------------------------------------
    "determinants": {
        title: "Determinants",
        keywords: ["determinant", "determinants", "det", "cofactor", "minor", "laplace expansion", "cramer's rule", "singular matrix", "invertible", "invertibility", "properties of determinants", "adjugate", "why determinant is zero"],
        definition: {
            formal: "The **determinant** is a scalar-valued function $\\det: M_{n \\times n}(\\mathbb{F}) \\to \\mathbb{F}$ associated with square matrices that characterizes invertibility and volume scaling under the linear transformation.",
            simple: "The **determinant** is a single number calculated from a square matrix that tells you how much the matrix magnifies or squashes area (in 2D) or volume (in 3D).",
            example: "For a $2 \\times 2$ matrix $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, $\\det(A) = ad - bc$.\nFor $A = \\begin{bmatrix} 3 & 1 \\\\ 2 & 4 \\end{bmatrix}$, $\\det(A) = (3)(4) - (1)(2) = 12 - 2 = 10$."
        },
        properties: [
            "**Invertibility Criterion:** A square matrix $A$ is invertible if and only if **$\\det(A) \\neq 0$**.",
            "**Multiplicative:** $\\det(AB) = \\det(A)\\det(B)$.",
            "**Transpose:** $\\det(A^T) = \\det(A)$.",
            "**Scalar Scaling:** $\\det(k A_{n \\times n}) = k^n \\det(A)$.",
            "**Triangular Matrix:** The determinant of an upper or lower triangular matrix is simply the product of its diagonal entries: $\\det(A) = a_{11} a_{22} \\dots a_{nn}$."
        ],
        why: {
            "zero_determinant": "When $\\det(A) = 0$, four fundamental things occur simultaneously:\n1. **Geometric Squashing:** The transformation squashes 2D area (or 3D volume) down to $0$ (a 1D line or point). You cannot undo this squashing.\n2. **Linear Dependence:** The rows (and columns) of $A$ are linearly dependent.\n3. **Singularity:** $A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)$ requires dividing by zero, so **$A^{-1}$ does not exist**.\n4. **Zero Eigenvalue:** The matrix has at least one eigenvalue $\\lambda = 0$."
        },
        simplerExplanation: "Imagine drawing a square on a stretchy rubber sheet with area 1. When you apply matrix $A$, the square gets stretched into a parallelogram. The determinant is simply the area of that new parallelogram! If $\\det(A)=0$, the sheet was crushed flat into a single straight line (zero area).",
        misconceptions: "Multiplying a matrix by a scalar $k$ does NOT multiply the determinant by $k$; for an $n \\times n$ matrix, it multiplies the determinant by $k^n$."
    },

    // -------------------------------------------------------------------------
    // MODULE 10: EIGENVALUES, EIGENVECTORS & DIAGONALIZATION
    // -------------------------------------------------------------------------
    "eigenvalues": {
        title: "Diagonalization, Eigenvalues and Eigenvectors",
        keywords: ["eigenvalue", "eigenvalues", "eigenvector", "eigenvectors", "diagonalization", "diagonalizable", "characteristic polynomial", "characteristic equation", "eigenspace", "cayley-hamilton", "eigen-solver", "trace"],
        definition: {
            formal: "Let $A$ be an $n \\times n$ square matrix. A non-zero vector $\\mathbf{v} \\neq \\mathbf{0}$ is called an **eigenvector** of $A$ if there exists a scalar $\\lambda$ (the **eigenvalue**) such that:\n$$ A\\mathbf{v} = \\lambda \\mathbf{v} $$",
            simple: "When a matrix acts on space, most arrows get turned and rotated. **Eigenvectors** are the special, invariant arrows that do NOT change direction at all—they only get stretched, shrunk, or flipped by a scaling factor called the **eigenvalue ($\lambda$)**.",
            example: "For $D = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}$, the eigenvalues are $\\lambda_1 = 2$ and $\\lambda_2 = 3$, with eigenvectors $\\mathbf{v}_1 = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}$ and $\\mathbf{v}_2 = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$."
        },
        procedures: {
            "finding_eigenvalues": "1. **Characteristic Equation:** Solve $\\det(A - \\lambda I) = 0$. For a $2 \\times 2$ matrix: $\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0$.\n2. **Solve Roots:** Find eigenvalues $\\lambda_1, \\lambda_2$.\n3. **Find Eigenspaces:** For each $\\lambda_i$, solve $(A - \\lambda_i I)\\mathbf{v} = \\mathbf{0}$ via row reduction to find basis eigenvectors.\n4. **Diagonalization:** If $A$ has $n$ independent eigenvectors, $A = PDP^{-1}$ where $D$ is the diagonal matrix of eigenvalues."
        },
        properties: [
            "**Trace Check:** $\\sum \\lambda_i = \\text{tr}(A)$ (Sum of eigenvalues equals the matrix trace).",
            "**Determinant Check:** $\\prod \\lambda_i = \\det(A)$ (Product of eigenvalues equals the determinant).",
            "**Diagonal Matrix Eigenvalues:** The eigenvalues of any diagonal or triangular matrix are simply the numbers sitting on the main diagonal."
        ],
        simplerExplanation: "Imagine stretching a patterned sheet in different directions. Most lines tilt and curve, but along one special line, points only stretch outward without tilting. That unchanging line is the eigenvector, and how much it stretched is the eigenvalue.",
        misconceptions: "The zero vector $\\mathbf{0}$ is NEVER considered an eigenvector by definition (because $A\\mathbf{0} = \\lambda\\mathbf{0}$ is trivially true for all $\\lambda$), but an eigenvalue CAN be zero ($\lambda = 0$)."
    }
};

// =============================================================================
// 2. SYMBOLIC MATHEMATICAL & NUMERICAL SOLVER ENGINE
// =============================================================================

class SymbolicMathEngine {
    extractMatrix(text) {
        if (!text) return null;
        const clean = text.replace(/\\begin\{bmatrix\}|\\end\{bmatrix\}|\$+/g, "");

        // 2x2 bracket format: [[a, b], [c, d]] or [[a,b],[c,d]]
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

        // 3x3 bracket format: [[a,b,c],[d,e,f],[g,h,i]]
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

        // Semicolon format: [a b; c d] or [a, b; c, d]
        const semiRegex = /\[\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)\s*;\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)\s*\]/;
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
        if (!text) return null;
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

    solve2x2Eigenvalues(a, b, c, d) {
        const trace = a + d;
        const det = a * d - b * c;
        const disc = trace * trace - 4 * det;

        let response = `### 🎯 Step-by-Step Eigenvalues & Eigenvectors

1. **Given Matrix:**
   $$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

2. **Concept & Method:**
   Eigenvalues satisfy the characteristic equation $\\det(A - \\lambda I) = 0$.
   For a $2 \\times 2$ matrix:
   $$ \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0 $$

3. **Step-by-Step Calculation:**
   - **Trace:** $\\text{tr}(A) = a + d = ${a} + ${d} = ${trace}$
   - **Determinant:** $\\det(A) = ad - bc = (${a})(${d}) - (${b})(${c}) = ${det}$
   - **Characteristic Polynomial:**
     $$ \\lambda^2 - (${trace})\\lambda + (${det}) = 0 $$
`;

        if (disc >= 0) {
            const sqrtDisc = Math.sqrt(disc);
            const lambda1 = (trace + sqrtDisc) / 2;
            const lambda2 = (trace - sqrtDisc) / 2;
            const l1Str = Number.isInteger(lambda1) ? lambda1 : lambda1.toFixed(2);
            const l2Str = Number.isInteger(lambda2) ? lambda2 : lambda2.toFixed(2);

            let v1 = b !== 0 ? `\\begin{bmatrix} ${-b} \\\\ ${(a - lambda1).toFixed(2)} \\end{bmatrix}` : (a - lambda1 === 0 ? `\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}` : `\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}`);
            let v2 = b !== 0 ? `\\begin{bmatrix} ${-b} \\\\ ${(a - lambda2).toFixed(2)} \\end{bmatrix}` : (a - lambda2 === 0 ? `\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}` : `\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}`);

            response += `
   Using the quadratic formula $\\lambda = \\frac{${trace} \\pm \\sqrt{${disc}}}{2}$:
   - $\\lambda_1 = ${l1Str}$
   - $\\lambda_2 = ${l2Str}$

4. **Finding Eigenvectors:**
   - For $\\lambda_1 = ${l1Str}$: Solve $(A - ${l1Str}I)\\mathbf{v} = \\mathbf{0} \\implies \\mathbf{v}_1 = ${v1}$
   - For $\\lambda_2 = ${l2Str}$: Solve $(A - ${l2Str}I)\\mathbf{v} = \\mathbf{0} \\implies \\mathbf{v}_2 = ${v2}$

5. **Verification Check:**
   - $\\lambda_1 + \\lambda_2 = ${l1Str} + ${l2Str} = ${trace} = \\text{tr}(A)$ ✓
   - $\\lambda_1 \\cdot \\lambda_2 = (${l1Str})(${l2Str}) = ${det} = \\det(A)$ ✓

**Final Answer:**
- **Eigenvalues:** $\\lambda_1 = ${l1Str}, \\quad \\lambda_2 = ${l2Str}$
- **Eigenvectors:** $\\mathbf{v}_1 = ${v1}, \\quad \\mathbf{v}_2 = ${v2}$`;
        } else {
            const realPart = (trace / 2).toFixed(2);
            const imagPart = (Math.sqrt(-disc) / 2).toFixed(2);
            response += `
   Since discriminant $\\Delta = ${disc} < 0$, the eigenvalues are complex conjugates:
   $$ \\lambda = ${realPart} \\pm ${imagPart}i $$

**Final Answer:**
The matrix represents a rotation and scaling with complex eigenvalues $\\lambda = ${realPart} \\pm ${imagPart}i$.`;
        }

        return response;
    }

    solve2x2Inverse(a, b, c, d) {
        const det = a * d - b * c;
        const detStr = Number.isInteger(det) ? det : det.toFixed(2);

        let response = `### 🔄 Step-by-Step Matrix Inverse Calculation

1. **Given Matrix:**
   $$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

2. **Concept & Method:**
   The inverse of a $2 \\times 2$ matrix is given by:
   $$ A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A) = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix} $$

3. **Calculation Steps:**
   - **Determinant:** $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${detStr}$
`;

        if (Math.abs(det) < 1e-9) {
            response += `
   - Since $\\det(A) = 0$, dividing by zero is undefined.

**Final Answer:**
$$\\mathbf{A^{-1}\\ \\text{does NOT exist (Matrix is Singular / Non-Invertible)}}.$$`;
            return response;
        }

        const invA = (d / det).toFixed(2);
        const invB = (-b / det).toFixed(2);
        const invC = (-c / det).toFixed(2);
        const invD = (a / det).toFixed(2);

        response += `   - **Adjugate Matrix:** $\\text{adj}(A) = \\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix}$
   - **Multiply by $\\frac{1}{\\det(A)}$:**
     $$ A^{-1} = \\frac{1}{${detStr}} \\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix} = \\begin{bmatrix} ${invA} & ${invB} \\\\ ${invC} & ${invD} \\end{bmatrix} $$

4. **Verification:**
   $$ A A^{-1} = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} \\begin{bmatrix} ${invA} & ${invB} \\\\ ${invC} & ${invD} \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = I $$

**Final Answer:**
$$ A^{-1} = \\begin{bmatrix} ${invA} & ${invB} \\\\ ${invC} & ${invD} \\end{bmatrix} $$`;
        return response;
    }

    solve2x2Determinant(a, b, c, d, isWhyQuestion = false) {
        const det = a * d - b * c;
        const detStr = Number.isInteger(det) ? det : det.toFixed(2);

        let response = `### 🔍 Step-by-Step Determinant Calculation

1. **Given Matrix:**
   $$ A = \\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix} $$

2. **Concept & Method:**
   For any $2 \\times 2$ matrix, the determinant is the product of the main diagonal minus the product of the off-diagonal:
   $$ \\det(A) = ad - bc $$

3. **Step-by-Step Arithmetic:**
   $$ \\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - (${b * c}) = ${detStr} $$

**Final Answer:**
$$ \\mathbf{\\det(A) = ${detStr}} $$
`;

        if (Math.abs(det) < 1e-9 || isWhyQuestion) {
            response += `
---
#### 💡 Why is the Determinant ${det === 0 ? "Zero" : detStr}?
${det === 0 ? `
- **Linear Dependence:** The rows $[${a}, ${b}]$ and $[${c}, ${d}]$ are scalar multiples of each other.
- **Area Collapse:** The matrix flattens 2D space onto a 1D line or point (area scaling factor $= 0$).
- **Non-Invertibility:** Because $\\det(A)=0$, the inverse $A^{-1}$ does not exist.
` : `
- **Area Scaling:** The matrix multiplies the area of any transformed shape by $|${detStr}|$.
- **Invertibility:** Since $\\det(A) \\neq 0$, the transformation is non-singular and reversible.
`}`;
        }

        return response;
    }

    solveLinearSystem(system) {
        const { a11, a12, b1, a21, a22, b2 } = system;
        const detA = a11 * a22 - a12 * a21;

        let response = `### 🔢 Step-by-Step Linear System Solver (Gaussian Elimination)

1. **Given System of Equations:**
   $$\\begin{cases} ${a11}x + (${a12})y = ${b1} \\\\ ${a21}x + (${a22})y = ${b2} \\end{cases}$$

2. **Augmented Matrix $[A \\mid \\mathbf{b}]$:**
   $$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ ${a21} & ${a22} & ${b2} \\end{array} \\right] $$

3. **Row Reduction Steps:**
`;

        if (Math.abs(detA) < 1e-9) {
            const ratio = a11 !== 0 ? a21 / a11 : a22 / a12;
            const expectedB2 = b1 * ratio;
            const isConsistent = Math.abs(b2 - expectedB2) < 1e-9;

            if (isConsistent) {
                response += `   Row operation $R_2 \\leftarrow R_2 - (${ratio.toFixed(2)})R_1$ yields $[0 \\ 0 \\mid 0]$ ($0 = 0$).\n\n**Final Answer:** Consistent with **infinitely many solutions** (1 free parameter). Let $y = t$, then $x = \\frac{${b1} - (${a12})t}{${a11}}$.`;
            } else {
                response += `   Row operation yields $[0 \\ 0 \\mid ${(b2 - expectedB2).toFixed(2)}]$ ($0 = ${(b2 - expectedB2).toFixed(2)}$), which is false.\n\n**Final Answer:** **Inconsistent System (No Solution)**.`;
            }
            return response;
        }

        const k = a21 / a11;
        const newA22 = a22 - k * a12;
        const newB2 = b2 - k * b1;
        const y = newB2 / newA22;
        const x = (b1 - a12 * y) / a11;

        const xStr = Number.isInteger(x) ? x : x.toFixed(2);
        const yStr = Number.isInteger(y) ? y : y.toFixed(2);

        response += `   - $R_2 \\leftarrow R_2 - \\left(\\frac{${a21}}{${a11}}\\right) R_1$:
     $$ \\left[ \\begin{array}{cc|c} ${a11} & ${a12} & ${b1} \\\\ 0 & ${newA22.toFixed(2)} & ${newB2.toFixed(2)} \\end{array} \\right] $$

4. **Back-Substitution:**
   - From Row 2: $(${newA22.toFixed(2)})y = ${newB2.toFixed(2)} \\implies y = ${yStr}$
   - From Row 1: $(${a11})x + (${a12})(${yStr}) = ${b1} \\implies x = ${xStr}$

**Final Answer:**
$$ \\mathbf{x = ${xStr}}, \\quad \\mathbf{y = ${yStr}} \\quad \\left( \\mathbf{x} = \\begin{bmatrix} ${xStr} \\\\ ${yStr} \\end{bmatrix} \\right) $$`;
        return response;
    }
}

// =============================================================================
// 3. CONVERSATIONAL REASONING & RESPONSE SYNTHESIZER
// =============================================================================

class ConversationalTutorEngine {
    constructor() {
        this.kb = LINEAR_ALGEBRA_KB;
        this.mathSolver = new SymbolicMathEngine();
    }

    processQuery(query, session) {
        const cleanQuery = query.trim();
        const lowerQ = cleanQuery.toLowerCase();

        // 1. Resolve Multi-turn Context (Topic, Entity, Pronouns)
        const context = this.extractContext(session, lowerQ);

        // 2. Check for explicit numerical matrix problems
        const matrixData = this.mathSolver.extractMatrix(cleanQuery) || (this.isMatrixFollowUp(lowerQ) ? context.lastMatrix : null);
        if (matrixData) {
            return this.solveMatrixProblem(matrixData, lowerQ, cleanQuery, context);
        }

        // 3. Check for linear system of equations
        const systemData = this.mathSolver.extractLinearSystem(cleanQuery);
        if (systemData) {
            return this.mathSolver.solveLinearSystem(systemData);
        }

        // 4. Classify Question Intent
        const intent = this.classifyIntent(lowerQ, context);

        // 5. Synthesize Contextual Pedagogical Response
        return this.synthesizeResponse(intent, lowerQ, cleanQuery, context);
    }

    isMatrixFollowUp(lowerQ) {
        return (
            lowerQ.includes("this matrix") ||
            lowerQ.includes("it") ||
            lowerQ.includes("its determinant") ||
            lowerQ.includes("its eigenvalues") ||
            lowerQ.includes("its inverse") ||
            lowerQ.includes("why is it zero") ||
            lowerQ.includes("why is the determinant zero")
        );
    }

    extractContext(session, lowerQ) {
        let activeTopicKey = null;
        let lastUserMsg = "";
        let lastTutorMsg = "";
        let lastMatrix = null;

        if (session && session.messages && session.messages.length > 0) {
            for (let i = session.messages.length - 1; i >= 0; i--) {
                const msg = session.messages[i];
                if (msg.role === "user" && !lastUserMsg) lastUserMsg = msg.text;
                if (msg.role === "model" && !lastTutorMsg) lastTutorMsg = msg.text;
                if (!lastMatrix) {
                    lastMatrix = this.mathSolver.extractMatrix(msg.text);
                }
            }
        }

        // 1. Match topic keywords in current query
        for (const [key, topic] of Object.entries(this.kb)) {
            for (const kw of topic.keywords) {
                if (lowerQ.includes(kw)) {
                    activeTopicKey = key;
                    break;
                }
            }
            if (activeTopicKey) break;
        }

        // 2. Inherit from recent history if follow-up
        if (!activeTopicKey && (lastUserMsg || lastTutorMsg)) {
            const combinedHistory = (lastUserMsg + " " + lastTutorMsg).toLowerCase();
            for (const [key, topic] of Object.entries(this.kb)) {
                for (const kw of topic.keywords) {
                    if (combinedHistory.includes(kw)) {
                        activeTopicKey = key;
                        break;
                    }
                }
                if (activeTopicKey) break;
            }
        }

        return {
            topicKey: activeTopicKey || "matrices",
            topic: this.kb[activeTopicKey || "matrices"],
            hasExplicitTopic: Boolean(activeTopicKey),
            lastUserMsg: lastUserMsg,
            lastTutorMsg: lastTutorMsg,
            lastMatrix: lastMatrix
        };
    }

    classifyIntent(lowerQ, context) {
        // Confusion / Simplification
        if (
            lowerQ.includes("don't understand") ||
            lowerQ.includes("dont understand") ||
            lowerQ.includes("simpler") ||
            lowerQ.includes("simple words") ||
            lowerQ.includes("in simple") ||
            lowerQ.includes("explain again") ||
            lowerQ.includes("make it simpler") ||
            lowerQ.includes("confused")
        ) {
            return "SIMPLIFICATION";
        }

        // Comparisons
        if (
            lowerQ.includes("difference between") ||
            lowerQ.includes("compare") ||
            lowerQ.includes(" vs ") ||
            lowerQ.includes("versus") ||
            lowerQ.includes("distinguish")
        ) {
            return "COMPARISON";
        }

        // Examples
        if (
            lowerQ.includes("give me an example") ||
            lowerQ.includes("show me an example") ||
            lowerQ.includes("worked example") ||
            lowerQ === "give me an example." ||
            lowerQ === "example" ||
            lowerQ.startsWith("example of") ||
            (lowerQ.includes("example") && !lowerQ.includes("solve"))
        ) {
            return "EXAMPLE";
        }

        // Types / Categorization
        if (
            lowerQ.includes("types of") ||
            lowerQ.includes("kinds of") ||
            lowerQ.includes("classification")
        ) {
            return "TYPES";
        }

        // Properties / Rules
        if (
            lowerQ.includes("properties of") ||
            lowerQ.includes("rules of") ||
            lowerQ.includes("laws of")
        ) {
            return "PROPERTIES";
        }

        // "Why" Reasoning
        if (
            lowerQ.startsWith("why ") ||
            lowerQ.includes("why is ") ||
            lowerQ.includes("why does ") ||
            lowerQ.includes("why can ") ||
            lowerQ.includes("why are ") ||
            lowerQ.includes("reason for")
        ) {
            return "WHY";
        }

        // "How" / Method
        if (
            lowerQ.includes("how do i ") ||
            lowerQ.includes("how to ") ||
            lowerQ.includes("how can i ") ||
            lowerQ.includes("steps to ") ||
            lowerQ.includes("method to ")
        ) {
            return "HOW";
        }

        // Definition
        if (
            lowerQ.startsWith("what is ") ||
            lowerQ.startsWith("what are ") ||
            lowerQ.startsWith("define ") ||
            lowerQ.includes("definition of")
        ) {
            return "DEFINITION";
        }

        // General Explanation
        if (
            lowerQ.startsWith("explain ") ||
            lowerQ.includes("tell me about") ||
            lowerQ.includes("teach me")
        ) {
            return "EXPLANATION";
        }

        return "GENERAL";
    }

    solveMatrixProblem(matrix, lowerQ, cleanQuery, context) {
        const { rows, cols, data } = matrix;

        if (lowerQ.includes("eigen") || lowerQ.includes("characteristic") || lowerQ.includes("diagonaliz")) {
            if (rows === 2 && cols === 2) {
                return this.mathSolver.solve2x2Eigenvalues(data[0][0], data[0][1], data[1][0], data[1][1]);
            }
        }

        if (lowerQ.includes("inverse") || lowerQ.includes("invert") || lowerQ.includes("inv")) {
            if (rows === 2 && cols === 2) {
                return this.mathSolver.solve2x2Inverse(data[0][0], data[0][1], data[1][0], data[1][1]);
            }
        }

        if (lowerQ.includes("det") || lowerQ.includes("determinant") || lowerQ.includes("zero")) {
            if (rows === 2 && cols === 2) {
                return this.mathSolver.solve2x2Determinant(data[0][0], data[0][1], data[1][0], data[1][1], lowerQ.includes("why"));
            }
        }

        // Default 2x2 comprehensive
        if (rows === 2 && cols === 2) {
            return this.mathSolver.solve2x2Eigenvalues(data[0][0], data[0][1], data[1][0], data[1][1]);
        }

        return this.mathSolver.solve2x2Determinant(data[0][0], data[0][1], data[1][0], data[1][1]);
    }

    synthesizeResponse(intent, lowerQ, cleanQuery, context) {
        const topic = context.topic;

        switch (intent) {
            case "SIMPLIFICATION":
                return `### 💡 ${topic.title} in Simple Words\n\n${topic.simplerExplanation}\n\n*Does this intuitive picture make sense, or would you like a concrete example?*`;

            case "EXAMPLE":
                return `### 📝 Concrete Example: ${topic.title}\n\n${topic.definition.example}\n\n*Would you like me to walk through the step-by-step math for this example?*`;

            case "TYPES":
                if (topic.types && topic.types.length > 0) {
                    return `### 📋 Types of ${topic.title}\n\n${topic.types.map(t => `- ${t}`).join("\n\n")}\n\n*Which specific type would you like to explore in detail?*`;
                }
                return `### 📋 Key Categories in ${topic.title}\n\n${topic.definition.formal}\n\n*Example:* ${topic.definition.example}`;

            case "PROPERTIES":
                if (topic.properties && topic.properties.length > 0) {
                    return `### ⚙️ Fundamental Properties of ${topic.title}\n\n${topic.properties.map(p => `- ${p}`).join("\n\n")}`;
                }
                return `### ⚙️ Properties of ${topic.title}\n\n${topic.definition.formal}`;

            case "WHY":
                if (lowerQ.includes("determinant") || (context.topicKey === "determinants" && lowerQ.includes("zero"))) {
                    return `### 💡 Why is the Determinant Zero?\n\n${this.kb.determinants.why.zero_determinant}`;
                }
                if (lowerQ.includes("multiplication") || lowerQ.includes("dimension")) {
                    return `### 💡 Why Must Matrix Inner Dimensions Match?\n\n${this.kb.matrices.why.multiplication_dimension}`;
                }
                if (lowerQ.includes("subspace") || lowerQ.includes("zero vector")) {
                    return `### 💡 Why Must a Subspace Contain the Zero Vector?\n\n${this.kb["vector-spaces"].why.why_zero_vector}`;
                }
                if (lowerQ.includes("orthogonal") || lowerQ.includes("dot product")) {
                    return `### 💡 Why is the Dot Product of Orthogonal Vectors Zero?\n\n${this.kb.vectors.why.dot_product_zero}`;
                }
                return `### 💡 Mathematical Reasoning: ${topic.title}\n\n${topic.simplerExplanation}\n\n**Key Insight:** ${topic.definition.formal}`;

            case "COMPARISON":
                if ((lowerQ.includes("span") && lowerQ.includes("basis")) || (context.topicKey === "vector-spaces" && lowerQ.includes("basis"))) {
                    return `### ⚖️ Span vs. Basis: Clear Comparison\n\n${this.kb["vector-spaces"].comparisons.span_vs_basis}`;
                }
                if (lowerQ.includes("space") && lowerQ.includes("subspace")) {
                    return `### ⚖️ Vector Space vs. Subspace: Clear Comparison\n\n${this.kb["vector-spaces"].comparisons.space_vs_subspace}`;
                }
                return `### ⚖️ Concept Comparison in ${topic.title}\n\n${topic.definition.formal}\n\n*Example:* ${topic.definition.example}`;

            case "HOW":
                if (lowerQ.includes("eigen") || context.topicKey === "eigenvalues") {
                    return `### 🎯 How to Find Eigenvalues & Eigenvectors\n\n${this.kb.eigenvalues.procedures.finding_eigenvalues}`;
                }
                if (lowerQ.includes("gaussian") || lowerQ.includes("system") || context.topicKey === "linear-systems") {
                    return `### 🔢 How to Perform Gaussian Elimination\n\n${this.kb["linear-systems"].procedures.gaussian_elimination}`;
                }
                if (lowerQ.includes("gram") || lowerQ.includes("schmidt") || context.topicKey === "inner-products") {
                    return `### 🧭 How to Apply the Gram-Schmidt Process\n\n${this.kb["inner-products"].procedures.gram_schmidt}`;
                }
                return `### 📐 Step-by-Step Method: ${topic.title}\n\n1. State what is given.\n2. Apply the mathematical definition:\n   ${topic.definition.formal}\n3. Check with a worked example:\n   ${topic.definition.example}`;

            case "DEFINITION":
            case "EXPLANATION":
            default:
                return `### 📚 ${topic.title}

#### 1. Intuition in Simple Words
${topic.definition.simple}

---

#### 2. Formal Mathematical Definition
${topic.definition.formal}

---

#### 3. Concrete Example
${topic.definition.example}

${topic.misconceptions ? `> **Common Pitfall:** ${topic.misconceptions}` : ""}

*Would you like to see a step-by-step problem, explore properties, or see this explained with a simpler analogy?*`;
        }
    }
}

// =============================================================================
// 4. MAIN CHAT APPLICATION CONTROLLER
// =============================================================================

class AlgebrifyAITutor {
    constructor() {
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

        this.sessions = this.loadSessions();
        this.currentSessionId = localStorage.getItem("algebrify_active_session_id") || "";
        this.isGenerating = false;

        this.engine = new ConversationalTutorEngine();

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
    }

    bindEvents() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener("click", () => this.handleSendMessage());
        }

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

        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.toggle("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.toggle("active");
            });
        }

        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.remove("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
            });
        }

        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.remove("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
            });
        }

        if (this.newChatBtn) {
            this.newChatBtn.addEventListener("click", () => {
                this.createNewSession("New Conversation");
                if (window.innerWidth <= 768 && this.sidebar) {
                    this.sidebar.classList.remove("open");
                    if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
                }
            });
        }

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

        if (this.clearAllSessionsBtn) {
            this.clearAllSessionsBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to delete ALL chat history?")) {
                    this.sessions = [];
                    this.createNewSession("New Conversation");
                }
            });
        }

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
    }

    loadSessions() {
        try {
            const raw = localStorage.getItem("algebrify_chat_sessions");
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem("algebrify_chat_sessions", JSON.stringify(this.sessions));
        } catch (e) {}
    }

    saveActiveSessionId() {
        try {
            localStorage.setItem("algebrify_active_session_id", this.currentSessionId);
        } catch (e) {}
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

            const renameBtn = document.createElement("button");
            renameBtn.className = "session-action-btn";
            renameBtn.title = "Rename";
            renameBtn.innerHTML = `<i data-lucide="edit-3"></i>`;
            renameBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const updatedTitle = prompt("Enter conversation title:", session.title);
                if (updatedTitle) this.renameSession(session.id, updatedTitle, e);
            });

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
            <h2>Algebrify Linear Algebra AI Tutor</h2>
            <p class="empty-state-subtitle">Your interactive companion for Matrices, Vectors, Systems of Equations, Determinants, and Eigenvalues. Ask anything or choose a starting prompt below:</p>
            
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
                <div class="starter-card" data-prompt="What are the fundamental properties of determinants?">
                    <div class="starter-card-icon"><i data-lucide="layers"></i></div>
                    <h4>Properties & Rules</h4>
                    <p>"What are the fundamental properties of determinants?"</p>
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

        const avatar = document.createElement("div");
        avatar.className = `chat-avatar ${isUser ? "user-avatar" : "tutor-avatar"}`;
        avatar.innerHTML = isUser 
            ? `<i data-lucide="user"></i>` 
            : `<i data-lucide="sparkles"></i>`;

        const contentBox = document.createElement("div");
        contentBox.className = `chat-content ${isUser ? "user-content" : "tutor-content"}`;

        const textEl = document.createElement("div");
        textEl.className = "message-body";
        textEl.innerHTML = isUser ? this.escapeHtml(msg.text) : this.formatMarkdownToHtml(msg.text);
        contentBox.appendChild(textEl);

        if (!isUser) {
            const actionsBar = document.createElement("div");
            actionsBar.className = "message-actions";

            const copyBtn = document.createElement("button");
            copyBtn.className = "msg-action-btn";
            copyBtn.title = "Copy response";
            copyBtn.innerHTML = `<i data-lucide="copy"></i> <span>Copy</span>`;
            copyBtn.addEventListener("click", () => this.copyToClipboard(msg.text, copyBtn));

            const regenBtn = document.createElement("button");
            regenBtn.className = "msg-action-btn";
            regenBtn.title = "Regenerate response";
            regenBtn.innerHTML = `<i data-lucide="rotate-cw"></i> <span>Regenerate</span>`;
            regenBtn.addEventListener("click", () => this.regenerateResponse(index));

            actionsBar.appendChild(copyBtn);
            actionsBar.appendChild(regenBtn);
            contentBox.appendChild(actionsBar);
        }

        row.appendChild(avatar);
        row.appendChild(contentBox);
        this.messagesContainer.appendChild(row);

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

    async handleSendMessage() {
        if (this.isGenerating) return;
        const text = this.inputField.value.trim();
        if (!text) return;

        const session = this.getActiveSession();
        if (!session) return;

        if (session.messages.length === 0) {
            session.title = this.generateSessionTitle(text);
            this.saveSessions();
            this.renderSessionsList();
            if (this.activeChatTitle) this.activeChatTitle.textContent = session.title;
        }

        session.messages.push({
            role: "user",
            text: text,
            timestamp: Date.now()
        });
        session.updatedAt = Date.now();
        this.saveSessions();

        this.inputField.value = "";
        this.inputField.style.height = "auto";

        this.renderActiveSessionMessages();
        this.setGeneratingState(true);

        try {
            // Natural thinking delay for smooth user experience
            await new Promise(r => setTimeout(r, 450));
            const responseText = this.engine.processQuery(text, session);

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
                text: "I can help with Linear Algebra, but I don't have enough information to answer that confidently. Try asking the question in a little more detail.",
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

        session.messages.splice(msgIndex, session.messages.length - msgIndex);
        this.saveSessions();
        this.renderActiveSessionMessages();

        this.setGeneratingState(true);

        try {
            await new Promise(r => setTimeout(r, 450));
            const lastUserMsg = session.messages[session.messages.length - 1];
            const textToQuery = lastUserMsg ? lastUserMsg.text : "Linear Algebra";
            const responseText = this.engine.processQuery(textToQuery, session);

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
                text: "I can help with Linear Algebra, but I don't have enough information to answer that confidently. Try asking the question in a little more detail.",
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
                        <span class="typing-label">Thinking & Formulating Step-by-Step...</span>
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
