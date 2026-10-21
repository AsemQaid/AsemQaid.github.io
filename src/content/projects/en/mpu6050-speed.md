---
title: Speed Estimation with an MPU6050 Motion Sensor
number: AAQ-P03
domain: measure
year: 2026
status: tested
featured: false
cover: /diagrams/mpu-rmse.svg
summary: >-
  Two speed-estimation methods benchmarked against measured ground truth: step counting reached an RMSE of
  0.161 m/s, integration 1.106 m/s.
lede: >-
  Two ways to estimate speed from a low-cost motion sensor, tested against measured distance and time, and an
  explanation of why one is seven times more accurate.
tags:
  - MPU6050
  - Arduino
  - RMSE
  - Filtering
facts:
  - label: Context
    value: Measurement & Instrumentation · final project, part 2
  - label: Period
    value: 2026 · even semester 2025/2026
  - label: Role
    value: Pair project with Fawaz Abbaker
  - label: Hardware
    value: MPU6050 · Arduino Nano
  - label: Method
    value: 15 trials per method · RMSE vs reference
verification:
  - label: Benchmark
    status: tested
    text: 15 trials per method against a reference speed from measured distance and stopwatch time.
  - label: Result
    status: tested
    text: >-
      Step counting: RMSE 0.161 m/s (mean error 9.8%). Acceleration integration: RMSE 1.106 m/s (mean error
      36.0%).
  - label: Note
    status: note
    text: >-
      The PC dashboard was generated with AI assistance, as the course allowed; the prompt is disclosed in the
      report.
shown:
  - Clear, physically explained difference between methods
  - Integration alone is not reliable for vehicle speed
limits:
  - Fixed stride length; reference timing by hand stopwatch
  - 'Next: sensor fusion, a magnetometer for heading, cadence-based stride length'
resources:
  - type: PDF
    label: Project report · 12 pages
    host: AAQ-P03_MPU6050-Speed-Estimation_Project-Report.pdf
    url: /reports/AAQ-P03_MPU6050-Speed-Estimation_Project-Report.pdf
---

## Question

Can a low-cost accelerometer and gyroscope measure speed well enough to be useful, and which method should be used? Integrating acceleration is the obvious approach; counting steps is a simpler alternative for walking.


## Set-up and signal processing

The MPU6050 connects over I2C to an Arduino Nano, which streams data to a web dashboard over Web Serial. The sensor's internal low-pass filter is set to 21 Hz; a complementary filter (α = 0.98) estimates roll and pitch to remove gravity from the acceleration axes; and a 0.20 m/s² dead zone suppresses residual noise. On every start-up the system averages about 600 samples over 3 seconds to self-calibrate all six axes.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mpu-arch.svg" alt="System block diagram: sensors, Arduino Nano and PC dashboard." loading="lazy" decoding="async"><figcaption>System block diagram: sensors, Arduino Nano and PC dashboard.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-dsp.svg" alt="Signal-processing chain from raw data to the two speed estimates." loading="lazy" decoding="async"><figcaption>Signal-processing chain from raw data to the two speed estimates.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-hw.webp" alt="Assembled measurement system: MPU6050 and Arduino Nano." loading="lazy" decoding="async"><figcaption>Assembled measurement system: MPU6050 and Arduino Nano.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-dash.webp" alt="Dashboard, motion and orientation tab." loading="lazy" decoding="async"><figcaption>Dashboard, motion and orientation tab.</figcaption></figure>
</div>


## Experiments

Method 1 (integration) was tested with the sensor mounted on a campus cleaning cart over 5–20 m runs. Method 2 (step counting × stride length ÷ time) was tested by walking a corridor over the same distances.

<div class="pfigs">
<figure class="pfig"><img src="/img/mp-cart.webp" alt="Vehicle experiment on a campus cleaning cart." loading="lazy" decoding="async"><figcaption>Vehicle experiment on a campus cleaning cart.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-walk.webp" alt="Walking experiment along a corridor." loading="lazy" decoding="async"><figcaption>Walking experiment along a corridor.</figcaption></figure>
</div>


## Results

Step counting was about seven times more accurate. Integration turns any small leftover bias into a velocity error that grows with time, and vehicle vibration and tilt add to it. Counting discrete footsteps does not accumulate error over time; its limit is how consistent the stride length is.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mpu-vehicle.svg" alt="Vehicle experiment: measured (method 1) vs calculated speed." loading="lazy" decoding="async"><figcaption>Vehicle experiment: measured (method 1) vs calculated speed.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-walking.svg" alt="Walking experiment: measured (method 2) vs calculated speed." loading="lazy" decoding="async"><figcaption>Walking experiment: measured (method 2) vs calculated speed.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-rmse.svg" alt="RMS error of the two methods." loading="lazy" decoding="async"><figcaption>RMS error of the two methods.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-trials.svg" alt="Per-trial absolute error, method 1 vs method 2." loading="lazy" decoding="async"><figcaption>Per-trial absolute error, method 1 vs method 2.</figcaption></figure>
</div>


## Limits and next steps
