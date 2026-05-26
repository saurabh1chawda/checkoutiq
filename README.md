# CheckoutIQ - Strategic Monetization Orchestrator

**CheckoutIQ** is a high-fidelity live prototype demonstrating the next generation of enterprise monetization platforms. It was designed to solve the friction between immediate revenue growth and long-term retention using AI-driven orchestration.

---

## 🚀 The Strategic Core: "Build Brains, Buy Muscles"

In a modern payments landscape, the competitive advantage is no longer just "integrating a gateway." It is the **Intelligence Layer** that dictates *how* that gateway is used. CheckoutIQ enforces this by:
1.  **Building Brains (Native):** Thompson Sampling AI, Bayesian decision engines, and real-time proxy-LTV guardrails.
2.  **Buying Muscles (Headless):** Seamlessly orchestrating global leaders like Stripe, Adyen, and regional LPMs (Pix, iDEAL).

---

## ✨ Key Features & Technical Highlights

### 🤖 Multi-Armed Bandit (MAB) Engine
*   **Algorithm:** Real-time Thompson Sampling using Gamma distribution approximations.
*   **Composite Reward:** Balances Checkout Conversion (Revenue) with Day-1 Engagement (Retention).
*   **Auditability:** Every AI decision is logged in an **Immutable Audit Ledger** for compliance.

### 🌎 Global Regional Routing
*   **Dynamic Localization:** Simulates edge-side geo-routing for US, BR, EU, and DE.
*   **Regional P&L:** Real-time currency conversion and region-specific Monthly Recurring Revenue (MRR) projections.

### 🎨 Brand & UX Orchestration
*   **Dual-Theme Architecture:** High-performance **Vibrant Pro** (Dark) vs. High-Contrast **Calm Wellness** (Light).
*   **Insight Expansion Cards:** A "No-Fail" tooltip pattern that expands inline to ensure readability without viewport clipping.
*   **Accessible Design:** Built with Tailwind CSS v4 and semantic CSS tokens for WCAG 2.1 compliance.

### 🛡️ Enterprise Engineering
*   **Safe Mode Kill Switch:** A global override to default traffic to the Control variant during system outages.
*   **Atomic State Machine:** Deterministic payment transitions (`idle` ➔ `verifying` ➔ `success/fail`).
*   **Immutable Receipt Anchor:** Anchors the primary purchase before presenting the 1-click upsell to protect state integrity.

---

## 🛠️ Tech Stack
*   **Framework:** React 19 + TypeScript + Vite
*   **Styling:** Tailwind CSS v4 (CSS-first architecture)
*   **Charts:** Recharts (Bayesian probability visualizations)
*   **Icons:** Lucide React
*   **State:** Functional Hooks with memoized sampling logic

---

## 📖 How to Run the Prototype

1.  **Clone the Repository**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Run Development Server**
    ```bash
    npm run dev
    ```
4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 📄 Strategic Documentation
This project includes a **[Strategic PRD](./PRD.md)** structured using the **STEP Framework** (Segments, Targets, Execution, Prioritization) as used by senior PMs at Google/Meta. It demonstrates how to translate business constraints into AI-native technical features.

---

## 👤 Author
**Saurabh Chawda**  
*Lead Product Manager, Payments & Monetization*

This project serves as a proof of work for the **Head of Product** role, demonstrating the intersection of technical depth, strategic vision (via the STEP framework), and data-driven execution.
