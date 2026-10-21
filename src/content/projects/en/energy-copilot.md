---
title: Industrial Energy Efficiency Copilot
number: AAQ-P07
domain: energy
year: 2026
status: simulated
hardwareStatus: designed
featured: true
inProgress: true
cover: /img/en-dashboard.webp
summary: >-
  Multi-site energy monitoring platform that turns electrical measurements into a ranked list of what to
  inspect first. Team leader; software tested on simulated data.
lede: >-
  A platform that takes an energy manager from raw electrical measurements to a ranked list of what to inspect
  first, across several factory sites.
tags:
  - ESP32
  - MQTT
  - RS485
  - Python
facts:
  - label: Context
    value: ANGEL Innovation Hackathon 2026 · Sustainable Energy track
  - label: Period
    value: Oct 2026 – ongoing (programme ends Dec 2026)
  - label: Role
    value: Team leader · system integration
  - label: Team
    value: Team PowerTech · 4 students + 1 supervisor
  - label: Stack
    value: ESP32 · RS485 · MQTT · Python dashboard
verification:
  - label: Software
    status: simulated
    text: >-
      Dashboard and analytics work on simulated data. In a synthetic test (90 records, 3 machines, 30 days)
      all 3 inserted anomalies were found with no false alarms.
  - label: Hardware
    status: designed
    text: >-
      Acquisition-unit schematic and ESP32 firmware are complete. The unit has not yet been assembled or
      bench-validated.
  - label: Programme target
    status: planned
    text: 'By Demo Day (Dec 2026): bench-validated meter readings and a live ESP32 → MQTT → dashboard data flow.'
shown:
  - Software meets the challenge's Prototype Alpha requirement
  - 'Synthetic test: 3 of 3 inserted anomalies detected, 0 false alarms'
  - Live MQTT path tested with a simulated meter
limits:
  - No real measurement data yet
  - Hardware not assembled or validated
  - Interviews with energy managers not yet conducted
  - The assistant follows fixed rules; it does not learn
resources:
  - type: PDF
    label: Project report · 10 pages
    host: AAQ-P07_Energy-Efficiency-Copilot_Project-Report.pdf
    url: /reports/AAQ-P07_Energy-Efficiency-Copilot_Project-Report.pdf
---

## Problem

Many factories see electricity only as a monthly total. Without machine-level data they cannot tell which equipment uses more than expected, which machines run outside production hours, or when efficiency slowly degrades. Companies with several sites cannot easily decide which one to investigate first.

The challenge was set by PT Indmira Global Energi as industry problem owner, and relates to energy-management obligations under Indonesian Government Regulation PP 33/2023.


## Approach

One platform covers five steps. Each finding is shown with its evidence, and the platform does not claim savings it cannot verify.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-pipeline.svg" alt="The five-step evidence-based pipeline of the platform." loading="lazy" decoding="async"><figcaption>The five-step evidence-based pipeline of the platform.</figcaption></figure>
</div>


## System

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-arch.svg" alt="System architecture: hardware, data and analytics, and application layers." loading="lazy" decoding="async"><figcaption>System architecture: hardware, data and analytics, and application layers.</figcaption></figure>
</div>


## Hardware design

The acquisition unit combines an AC inlet and fuse, an HLK-5M05 5 V supply, a PZEM-series energy meter, a MAX485 RS485 interface, an ESP32-WROOM-32D, an OLED display and a microSD module.

<div class="pfigs">
<figure class="pfig wide"><img src="/img/en-schematic.webp" alt="Electrical schematic of the acquisition unit (Cirkit Designer). Design only, not yet bench-validated." loading="lazy" decoding="async"><figcaption>Electrical schematic of the acquisition unit (Cirkit Designer). Design only, not yet bench-validated.</figcaption></figure>
</div>


## Software prototype

<div class="pfigs">
<figure class="pfig wide"><img src="/img/en-dashboard.webp" alt="Energy Command Center, shown with a simulated demonstration organisation, not data from physical meters." loading="lazy" decoding="async"><figcaption>Energy Command Center, shown with a simulated demonstration organisation, not data from physical meters.</figcaption></figure>
</div>


## My role and the team

I led the team and was responsible for system integration: the dashboard, the data pipeline (MQTT and storage), and coordinating user validation with industry users.

| Member | Role |
|---|---|
| **Asem Qaid** | Team leader · system integration, dashboard, data pipeline |
| Fawaz Abbaker | Electrical design, metering hardware, ESP32 firmware |
| Abdullah Al-Hamid | Anomaly detection, forecasting, AI assistant |
| Yasmin Mohamed | Market validation, business model, IP preparation |
| Ir. Firdaus, Ph.D. | Academic and technical supervisor |


## Results and limits

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-readiness.svg" alt="Readiness of each part of the system." loading="lazy" decoding="async"><figcaption>Readiness of each part of the system.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/energy-roadmap.svg" alt="Development roadmap aligned with the programme stages." loading="lazy" decoding="async"><figcaption>Development roadmap aligned with the programme stages.</figcaption></figure>
</div>
