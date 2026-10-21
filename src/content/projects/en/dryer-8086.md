---
title: Dryer Control System on the 8086 Microprocessor
number: AAQ-P02
domain: control
year: 2026
status: simulated
featured: false
cover: /img/dr-circuit.webp
summary: >-
  Temperature control and pressure alarm for a dryer, written in 8086 assembly with an 8255 PPI and ADC0804,
  verified in Proteus.
lede: >-
  A dryer controller written in 8086 assembly: it keeps temperature at a setpoint and sounds an alarm when
  pressure goes too high.
tags:
  - '8086'
  - 8255 PPI
  - ADC0804
  - Proteus
facts:
  - label: Context
    value: Computer Systems & Microprocessors · final project
  - label: Period
    value: January 2026
  - label: Role
    value: Individual project
  - label: Hardware
    value: 8086 · 8255 PPI · ADC0804 · LM35 · MPX4115A
  - label: Tools
    value: 8086 assembly · Proteus
verification:
  - label: Design
    status: simulated
    text: Complete circuit and program run in Proteus.
  - label: Tests
    status: simulated
    text: >-
      15 simulated cases at setpoints of 30 °C and 100 kPa; heater and alarm switched as specified in each
      case.
  - label: Not built
    status: planned
    text: No physical hardware was built.
shown:
  - Heater on/off around the temperature setpoint
  - Alarm and automatic recovery for over-pressure
limits:
  - Simulation only; real sensor noise and relay timing not tested
  - On–off control only; no hysteresis or PID
resources:
  - type: PDF
    label: Project report · 10 pages
    host: AAQ-P02_8086-Dryer-Control_Project-Report.pdf
    url: /reports/AAQ-P02_8086-Dryer-Control_Project-Report.pdf
  - type: ASM
    label: Assembly source code
    host: dryer-control-8086.asm
    url: /code/dryer-control-8086.asm.txt
---

## Interfacing

An LM35 temperature sensor and an MPX4115A pressure sensor produce analog voltages that an ADC0804 converts to 8-bit values. The 8255 PPI, configured in Mode 0, handles all I/O: Port A drives the seven-segment display, Port B reads the ADC, and Port C reads the push buttons and drives the heater relay and buzzer.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/dryer-block.svg" alt="Block diagram: 8086, 8255 ports, ADC, sensors and outputs." loading="lazy" decoding="async"><figcaption>Block diagram: 8086, 8255 ports, ADC, sensors and outputs.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/dryer-cw.svg" alt="8255 control word 8AH, bit by bit." loading="lazy" decoding="async"><figcaption>8255 control word 8AH, bit by bit.</figcaption></figure>
<figure class="pfig wide"><img src="/img/dr-circuit.webp" alt="Proteus simulation circuit." loading="lazy" decoding="async"><figcaption>Proteus simulation circuit.</figcaption></figure>
</div>


## Control logic

The main loop reads the buttons, samples both sensors and compares them with the setpoints. The heater turns on while temperature is below the setpoint (CMP and JB) and the buzzer sounds while pressure is above its limit (CMP and JA). Inputs and outputs share Port C, so outputs are written through a masked copy (OUT_IMAGE) to avoid disturbing button reads.

<div class="pfigs">
<figure class="pfig"><img src="/diagrams/dryer-flow.svg" alt="Program flowchart." loading="lazy" decoding="async"><figcaption>Program flowchart.</figcaption></figure>
</div>


## Simulation results

| No. | Temperature (°C) | Pressure (kPa) | Heater | Buzzer |
|---:|---:|---:|:--:|:--:|
| 1 | 22 | 85 | ON | OFF |
| 2 | 25 | 95 | ON | OFF |
| 3 | 28 | 98 | ON | OFF |
| 4 | 29 | 102 | ON | ON |
| 5 | 30 | 90 | OFF | OFF |
| 6 | 30 | 105 | OFF | ON |
| 7 | 32 | 88 | OFF | OFF |
| 8 | 33 | 110 | OFF | ON |
| 9 | 35 | 97 | OFF | OFF |
| 10 | 36 | 115 | OFF | ON |
| 11 | 27 | 92 | ON | OFF |
| 12 | 26 | 108 | ON | ON |
| 13 | 31 | 99 | OFF | OFF |
| 14 | 34 | 101 | OFF | ON |
| 15 | 24 | 120 | ON | ON |
