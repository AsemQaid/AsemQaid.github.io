---
title: Gas Concentration Measurement with the MQ135 Sensor
number: AAQ-P01
domain: measure
year: 2025
status: prototyped
featured: false
cover: /diagrams/mq-co2.svg
summary: >-
  Calibrated MQ135 and Arduino Nano used to compare CO₂ across 15 campus locations, with a custom Python live
  display.
lede: >-
  A calibrated low-cost gas sensor used to compare air quality across 15 locations on campus, from open
  rooftops to a crowded lab.
tags:
  - MQ135
  - Arduino
  - Python
  - Calibration
facts:
  - label: Context
    value: Measurement & Instrumentation · final project, part 1
  - label: Period
    value: 2025 · 4th semester
  - label: Role
    value: Individual project
  - label: Hardware
    value: MQ135 · Arduino Nano
  - label: Software
    value: Arduino · Python live display
verification:
  - label: System
    status: prototyped
    text: Built, calibrated after a 24-hour preheat, and used for real measurements.
  - label: CO₂ survey
    status: prototyped
    text: 15 locations, about 376 to 2,172 ppm, higher in enclosed and crowded spaces.
  - label: Limits
    status: planned
    text: >-
      Not checked against a reference CO₂ meter. Ethanol readings went beyond the sensor model's valid range,
      so only the response pattern is reported.
shown:
  - Clear link between ventilation, occupancy and CO₂
limits:
  - Compare against a reference CO₂ instrument
  - Add temperature and humidity compensation
  - Stay within the sensor's valid concentration range
resources:
  - type: PDF
    label: Project report · 10 pages
    host: AAQ-P01_MQ135-Gas-Measurement_Project-Report.pdf
    url: /reports/AAQ-P01_MQ135-Gas-Measurement_Project-Report.pdf
---

## System and calibration

The MQ135 output is read on the Arduino Nano's analog input. The sensor was preheated for 24 hours, used with a 20 kΩ load resistor, and its clean-air resistance R₀ was measured and averaged (221.3 for CO₂, 144.46 for ethanol) before measurements. A Python application replaced the serial monitor with live values and graphs.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mq-block.svg" alt="System block diagram." loading="lazy" decoding="async"><figcaption>System block diagram.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-conv.svg" alt="Conversion chain from the ADC reading to gas concentration." loading="lazy" decoding="async"><figcaption>Conversion chain from the ADC reading to gas concentration.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-cal.svg" alt="Calibration procedure." loading="lazy" decoding="async"><figcaption>Calibration procedure.</figcaption></figure>
<figure class="pfig wide"><img src="/img/mq-circuit.webp" alt="Hardware connections." loading="lazy" decoding="async"><figcaption>Hardware connections.</figcaption></figure>
</div>


## CO₂ survey

Readings were taken at 15 locations with different ventilation and occupancy. Well-ventilated outdoor spots read close to normal atmospheric levels (about 376 ppm); a mechanical lab with several people and limited ventilation read about 2,172 ppm.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mq-co2.svg" alt="CO₂ by location, highest first. Orange bars exceed 1,000 ppm." loading="lazy" decoding="async"><figcaption>CO₂ by location, highest first. Orange bars exceed 1,000 ppm.</figcaption></figure>
<figure class="pfig wide"><img src="/img/mq-ui.webp" alt="Python live monitoring interface." loading="lazy" decoding="async"><figcaption>Python live monitoring interface.</figcaption></figure>
</div>


## Ethanol response and an honest limit

Exposed to hand sanitiser and perfume, the sensor responded immediately and recovered when the source was removed. Two readings exceeded 1,000,000 ppm, which is physically impossible, because the sensor's conversion curve was being used far outside its specified range of roughly 10–1,000 ppm. The ethanol results are therefore treated as a relative indicator of exposure, not as concentrations.

<div class="pfigs">
<figure class="pfig"><img src="/img/mq-eth1.webp" alt="Hand sanitiser on tissue near the sensor." loading="lazy" decoding="async"><figcaption>Hand sanitiser on tissue near the sensor.</figcaption></figure>
<figure class="pfig"><img src="/img/mq-eth2.webp" alt="Perfume cap placed over the sensor." loading="lazy" decoding="async"><figcaption>Perfume cap placed over the sensor.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-eth.svg" alt="Ethanol test outputs on a logarithmic scale. Values above 100 % are physically impossible." loading="lazy" decoding="async"><figcaption>Ethanol test outputs on a logarithmic scale. Values above 100 % are physically impossible.</figcaption></figure>
</div>


## What I would do differently
