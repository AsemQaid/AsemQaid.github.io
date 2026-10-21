---
title: Smart Electrical Panel Protection & Emergency Alert System
number: AAQ-P05
domain: iot
year: 2026
status: tested
featured: true
cover: /img/pn-photo.webp
summary: >-
  Arduino Nano system that detects heat, smoke, gas and flame in an electrical panel, disconnects the load and
  sends SMS alerts. Built on a soldered PCB and bench-tested.
lede: >-
  An embedded system that watches an electrical panel for heat, smoke, gas and flame, then responds in stages:
  cooling, an alarm, disconnecting the load and an SMS to a responsible person.
tags:
  - Arduino Nano
  - SIM800L
  - MQ-2
  - State machine
facts:
  - label: Context
    value: Embedded Systems · final project
  - label: Period
    value: '2026'
  - label: Role
    value: Individual project
  - label: Controller
    value: Arduino Nano
  - label: Stack
    value: DHT11 · MQ-2 · IR flame · SIM800L · relay
verification:
  - label: Hardware
    status: tested
    text: >-
      Debugged on a breadboard, then built on a soldered PCB. Six test scenarios passed under simulated hazard
      conditions.
  - label: Response
    status: tested
    text: >-
      The relay disconnected the load within one 2-second polling cycle of an emergency, and SMS alerts were
      delivered.
  - label: Not yet shown
    status: planned
    text: Gas readings are raw values, not calibrated concentrations. Not tested inside a real panel.
shown:
  - Correct state transitions in all trials
  - Load disconnected within one 2 s cycle
  - A false flame trigger traced to relay noise and fixed by separating power rails
limits:
  - MQ-2 needs on-site threshold calibration; readings drift with warm-up and humidity
  - SMS delay depends on the GSM network, from seconds to under a minute
  - 'Next: calibrated gas readings, per-circuit isolation, local logging'
resources:
  - type: PDF
    label: Project report · 12 pages
    host: AAQ-P05_Smart-Panel-Protection_Project-Report.pdf
    url: /reports/AAQ-P05_Smart-Panel-Protection_Project-Report.pdf
---

## Problem

Electrical panels are a common starting point for fires caused by overheating connections, insulation breakdown or short circuits. These faults can develop long before anyone notices. Automatic monitoring lets a hazard be contained within seconds and lets a responsible person be told even when nobody is on site.


## System

Three sensors feed the Arduino Nano, which evaluates them every two seconds and drives a three-state machine. Flame and gas are separate alert sources with their own SMS cooldown, so one hazard can never silence a notification about another.

| State | Trigger | Response |
|---|---|---|
| Normal | All readings in range | Green light; load connected |
| Warning | Temperature above threshold | Yellow light; fan on; warning SMS |
| Emergency | Smoke or gas high, or flame | Red light; buzzer; fan; load disconnected; emergency SMS |

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/panel-arch.svg" alt="System block diagram: sensors, controller, outputs and communication paths." loading="lazy" decoding="async"><figcaption>System block diagram: sensors, controller, outputs and communication paths.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/panel-states.svg" alt="State transitions of the protection logic." loading="lazy" decoding="async"><figcaption>State transitions of the protection logic.</figcaption></figure>
</div>


## Hardware

Two isolated power domains keep actuator switching from corrupting sensor readings. The Nano's regulated 5 V rail powers the sensors, buzzer and lights; a separate 5 V / 2 A supply powers the relay, fan and SIM800L, whose transmit bursts draw about 2 A. A 1000 µF capacitor near the SIM800L absorbs those spikes.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/panel-power.svg" alt="Two isolated power domains with a shared ground." loading="lazy" decoding="async"><figcaption>Two isolated power domains with a shared ground.</figcaption></figure>
<figure class="pfig"><img src="/img/pn-photo.webp" alt="The final build on a soldered PCB." loading="lazy" decoding="async"><figcaption>The final build on a soldered PCB.</figcaption></figure>
</div>


## Firmware

All outputs are driven from one sensor snapshot per cycle, and the relay and fan return to a safe default on every reset, so a reset never leaves the panel unprotected. Two bugs were found and fixed: the AVR snprintf() cannot format floats, so temperatures are converted with dtostrf(); and the SMS cooldown blocked any alert in the first 60 seconds after boot until the timer was initialised to a time in the past.

<div class="pfigs">
<figure class="pfig"><img src="/diagrams/panel-flow.svg" alt="Firmware flowchart of the main control loop." loading="lazy" decoding="async"><figcaption>Firmware flowchart of the main control loop.</figcaption></figure>
</div>


## Testing

Six scenarios were tested: power-on self-check, GSM registration, temperature warning, gas/smoke emergency, flame emergency and automatic recovery. A browser dashboard using the Web Serial API showed live readings and the state log during the tests.

<div class="pfigs">
<figure class="pfig"><img src="/img/pn-dash.webp" alt="Live dashboard over Web Serial, with the state and SMS log." loading="lazy" decoding="async"><figcaption>Live dashboard over Web Serial, with the state and SMS log.</figcaption></figure>
<figure class="pfig"><img src="/img/pn-sms.webp" alt="SMS alerts received during flame and gas tests." loading="lazy" decoding="async"><figcaption>SMS alerts received during flame and gas tests.</figcaption></figure>
</div>


## Results and limits
