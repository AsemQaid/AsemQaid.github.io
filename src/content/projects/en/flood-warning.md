---
title: Smart Flood Detection and Early Warning System
number: AAQ-P04
domain: iot
year: 2026
status: prototyped
featured: false
cover: /img/fl-photo.webp
summary: >-
  ESP32 node that reads rainfall and water level, warns locally with lights and a buzzer, and reports over
  MQTT to a Node-RED dashboard.
lede: >-
  A low-cost IoT node that watches rainfall and water level, classifies the risk, and warns both on site and
  on a remote dashboard.
tags:
  - ESP32
  - MQTT
  - Node-RED
  - Sensors
facts:
  - label: Context
    value: Disaster Mitigation course
  - label: Period
    value: '2026'
  - label: Role
    value: Individual project
  - label: Controller
    value: ESP32
  - label: Stack
    value: MQTT · Mosquitto · Node-RED
verification:
  - label: Hardware
    status: prototyped
    text: >-
      Built on a breadboard with an ESP32, rain sensor and water-level sensor; all three alert states
      demonstrated.
  - label: Data link
    status: prototyped
    text: >-
      The ESP32 publishes over MQTT to a Mosquitto broker; Node-RED shows live status and water-level history
      on the same network.
  - label: Not yet shown
    status: planned
    text: No field deployment and no measured accuracy for the warning thresholds.
shown:
  - Three-level classification with local and remote alerts working together
  - Live readings and history on Node-RED
limits:
  - Dashboard works only on the same local network
  - Thresholds not calibrated against real flood data
  - 'Next: cloud storage, mobile notifications, forecast integration'
resources:
  - type: PDF
    label: Project report · 8 pages
    host: AAQ-P04_Flood-Early-Warning_Project-Report.pdf
    url: /reports/AAQ-P04_Flood-Early-Warning_Project-Report.pdf
---

## Problem

Heavy rainfall and rising water can become dangerous quickly if they are not detected early. A low-cost device that warns people nearby and reports to a remote screen can buy time for a response.


## System

The ESP32 reads both sensors continuously and compares them with set thresholds. At the same time it publishes the readings to a Mosquitto broker, and a Node-RED dashboard subscribes to show the latest values and flood status.

| Level | Local alert |
|---|---|
| SAFE | Green LED, no alarm |
| WARNING | Yellow LED, intermittent buzzer |
| DANGER | Red LED, continuous buzzer |

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/flood-arch.svg" alt="Block diagram: sensors, ESP32, local alerts and remote monitoring." loading="lazy" decoding="async"><figcaption>Block diagram: sensors, ESP32, local alerts and remote monitoring.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/flood-levels.svg" alt="Risk levels and their local alerts." loading="lazy" decoding="async"><figcaption>Risk levels and their local alerts.</figcaption></figure>
<figure class="pfig"><img src="/diagrams/flood-flow.svg" alt="Operating flowchart of the ESP32 firmware." loading="lazy" decoding="async"><figcaption>Operating flowchart of the ESP32 firmware.</figcaption></figure>
</div>


## Prototype and dashboard

<div class="pfigs">
<figure class="pfig"><img src="/img/fl-photo.webp" alt="Breadboard prototype with the ESP32, rain and water-level sensors, LEDs and buzzer." loading="lazy" decoding="async"><figcaption>Breadboard prototype with the ESP32, rain and water-level sensors, LEDs and buzzer.</figcaption></figure>
<figure class="pfig"><img src="/img/fl-nodered.webp" alt="Node-RED dashboard: flood status, rain status and water-level history." loading="lazy" decoding="async"><figcaption>Node-RED dashboard: flood status, rain status and water-level history.</figcaption></figure>
</div>


## Results and limits
