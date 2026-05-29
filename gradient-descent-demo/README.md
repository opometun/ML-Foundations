# Gradient Descent: Interactive Teaching Demo

A 9-step interactive web app for teaching linear regression and gradient descent. Built for the Foundations of ML lecture — each step creates a problem that the next step solves.

**Live demo:** https://opometun.github.io/ML-Foundations

## Setup

```bash
git clone git@github.com:opometun/ML-Foundations.git
cd ML-Foundations/gradient-descent-demo
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

## Steps

| # | Title | What it shows |
|---|-------|---------------|
| 1 | We have data | House price scatter plot |
| 2 | We need a model | Draggable prediction line (θ₀, θ₁ sliders) |
| 3 | The model is wrong | Residual lines between predictions and actuals |
| 4 | We need a number for wrongness | MSE cost with squared-error visualization |
| 5 | Find the bottom of this curve | Cost curve J(θ₁) — a parabola with a minimum |
| 6 | Why not just guess? | Random guessing vs. the gradient arrow |
| 7 | The gradient tells us how much to move | One gradient descent step, tangent line |
| 8 | Training is repeated correction | Live animation — line converges toward best fit |
| 9 | How do we know it's done? | Loss-vs-iteration curve flattening to a plateau |

## Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the app and pushes `dist/` to the `gh-pages` branch. GitHub serves it at the live demo URL above. Run once after any change you want published.

## Stack

Vite · React 19 · Recharts 3 · plain CSS — no other dependencies.
