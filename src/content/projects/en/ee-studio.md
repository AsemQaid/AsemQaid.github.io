---
title: 'EE Studio: Interactive Virtual Engineering Laboratory'
number: AAQ-P06
domain: software
year: 2026
status: deployed
featured: true
cover: /img/ees-landing.webp
summary: >-
  Live web platform with 37 interactive labs across seven electrical engineering subjects, backed by 485
  automated tests.
lede: >-
  A browser-based virtual laboratory where a student changes a parameter and watches the system respond: a
  mass settling on a spring, a transformer's voltage sagging, a grid approaching voltage collapse.
tags:
  - React
  - TypeScript
  - FastAPI
  - SciPy
  - pytest
facts:
  - label: Context
    value: Personal project
  - label: Period
    value: 2026 · first complete milestone Oct 2026
  - label: Role
    value: Sole author · AI-assisted development
  - label: Scope
    value: 7 modules · 37 labs · 485 backend tests
  - label: Stack
    value: React · TypeScript · FastAPI · NumPy/SciPy
verification:
  - label: Platform
    status: deployed
    text: 'Live: frontend on Vercel, backend on Railway, source on GitHub.'
  - label: Verification
    status: tested
    text: >-
      485 automated backend tests passing at the first complete milestone, checked against hand or SciPy
      calculations.
  - label: How it was built
    status: note
    text: >-
      Human-directed, AI-assisted: I set the scope, verified each model and reviewed every lab; Claude and
      Claude Code generated and tested the code.
resources:
  - type: WEB
    label: Live platform
    host: ee-studio-red.vercel.app
    url: https://ee-studio-red.vercel.app
  - type: CODE
    label: Source code
    host: github.com/AsemQaid/ee-studio
    url: https://github.com/AsemQaid/ee-studio
  - type: PDF
    label: Project report · 12 pages
    host: AAQ-P06_EE-Studio_Project-Report.pdf
    url: /reports/AAQ-P06_EE-Studio_Project-Report.pdf
---

## Why I built it

Electrical engineering is usually taught as equations and static plots. A student can recite that a system with a damping ratio below one oscillates without ever seeing the oscillation change. Lab equipment and professional simulators help, but both need access, licences or a learning curve.

EE Studio sits between the two: no installation, each experiment reduced to the parameters that matter, and the result shown immediately.

<div class="pfigs">
<figure class="pfig"><img src="/img/ees-landing.webp" alt="The live platform, showing the seven modules." loading="lazy" decoding="async"><figcaption>The live platform, showing the seven modules.</figcaption></figure>
</div>


## What it covers

| Module | Labs | Tests |
|---|---|---:|
| Power Systems | Transformer, transmission line, power flow, fault analysis, protection | 65 |
| Renewable Energy | Solar PV, MPPT, wind turbine, battery storage, grid inverter | 58 |
| Control Systems | Step response, PID, Bode, root locus, Nyquist, state space | 76 |
| Signal Processing | Sampling, convolution, filters, FFT, spectrum, signal generator | 81 |
| Electronic System Design | Op-amp, rectifier, BJT biasing, RC/RL filters, regulators | 60 |
| Machine Learning | Regression, logistic regression, neural network, k-means, PCA | 73 |
| Biomedical Systems | ECG, EEG, blood pressure, pulse oximetry, pharmacokinetics | 72 |

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-tests.svg" alt="Passing backend tests per module." loading="lazy" decoding="async"><figcaption>Passing backend tests per module.</figcaption></figure>
</div>


## Architecture

All engineering mathematics lives in pure Python functions with no web code, so each model can be tested on its own. A thin FastAPI route validates each request and calls the engine; the React lab page renders the result in charts and in a physical visualisation.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-arch.svg" alt="Frontend, backend and repository." loading="lazy" decoding="async"><figcaption>Frontend, backend and repository.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/ees-labpage.svg" alt="The six-slot layout shared by every lab page." loading="lazy" decoding="async"><figcaption>The six-slot layout shared by every lab page.</figcaption></figure>
</div>


## Method: verify the maths first

Every lab follows the same seven-step pipeline, and its first gate is mathematical: the model is checked numerically before any engine is written. Tests encode physical behaviour as well as numbers, for example that load-bus voltage falls as load rises, and that a heavy enough load makes power flow report non-convergence instead of a false value.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-pipeline.svg" alt="Lab development pipeline: seven steps, one decision gate." loading="lazy" decoding="async"><figcaption>Lab development pipeline: seven steps, one decision gate.</figcaption></figure>
</div>


## Lessons from bugs

The most useful lessons came from results that looked plausible but were wrong. The power-flow lab first showed voltage rising as load increased, caused by a sign error in hand-expanded equations; it was rebuilt on the admittance matrix and a regression test now checks the direction.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-deploy.svg" alt="Deployment: GitHub, Vercel, Railway and the browser." loading="lazy" decoding="async"><figcaption>Deployment: GitHub, Vercel, Railway and the browser.</figcaption></figure>
<figure class="pfig"><img src="/img/ees-api.webp" alt="Interactive API documentation served by the deployed backend." loading="lazy" decoding="async"><figcaption>Interactive API documentation served by the deployed backend.</figcaption></figure>
</div>
