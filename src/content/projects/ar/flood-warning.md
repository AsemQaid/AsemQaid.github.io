---
title: نظام ذكي لكشف الفيضانات والإنذار المبكر
number: AAQ-P04
domain: iot
year: 2026
status: prototyped
featured: false
cover: /img/fl-photo.webp
summary: وحدة ESP32 تقرأ هطول الأمطار ومستوى المياه، وتنذر محليًا بالأضواء والجرس، وترسل عبر MQTT إلى لوحة Node-RED.
lede: >-
  وحدة إنترنت أشياء منخفضة التكلفة تراقب الأمطار ومستوى المياه، وتصنّف مستوى الخطر، وتنذر في الموقع وعلى لوحة
  متابعة عن بُعد.
tags:
  - ESP32
  - MQTT
  - Node-RED
  - Sensors
facts:
  - label: السياق
    value: مقرر التخفيف من الكوارث
  - label: الفترة
    value: '2026'
  - label: الدور
    value: مشروع فردي
  - label: المتحكم
    value: ESP32
  - label: الأدوات
    value: MQTT · Mosquitto · Node-RED
verification:
  - label: العتاد
    status: prototyped
    text: بُني على لوحة تجارب مع ESP32 وحساس مطر وحساس مستوى مياه؛ وعُرضت حالات التنبيه الثلاث.
  - label: ربط البيانات
    status: prototyped
    text: ينشر ESP32 عبر MQTT إلى وسيط Mosquitto، وتعرض Node-RED الحالة الحية وسجل مستوى المياه على الشبكة نفسها.
  - label: لم يُثبت بعد
    status: planned
    text: لا يوجد نشر ميداني ولا دقة مقاسة لحدود الإنذار.
shown:
  - تصنيف ثلاثي المستويات مع تنبيهات محلية وعن بُعد معًا
  - قراءات حية وسجل على Node-RED
limits:
  - لوحة المتابعة تعمل على الشبكة المحلية نفسها فقط
  - الحدود غير معايرة على بيانات فيضانات حقيقية
  - 'التالي: تخزين سحابي، إشعارات للهاتف، دمج التنبؤ بالطقس'
resources:
  - type: PDF
    label: تقرير المشروع · 8 صفحات
    host: AAQ-P04_Flood-Early-Warning_Project-Report.pdf
    url: /reports/AAQ-P04_Flood-Early-Warning_Project-Report.pdf
---

## المشكلة

قد تتحول الأمطار الغزيرة وارتفاع المياه إلى خطر بسرعة إن لم تُكتشف مبكرًا. جهاز منخفض التكلفة ينذر من حوله ويُبلغ شاشة بعيدة يمكن أن يمنح وقتًا للاستجابة.


## النظام

يقرأ ESP32 الحساسين باستمرار ويقارنهما بحدود محددة. وفي الوقت نفسه ينشر القراءات إلى وسيط Mosquitto، وتشترك لوحة Node-RED لعرض أحدث القيم وحالة الفيضان.

| المستوى | التنبيه المحلي |
|---|---|
| آمن | ضوء أخضر، بلا إنذار |
| تحذير | ضوء أصفر، جرس متقطع |
| خطر | ضوء أحمر، جرس مستمر |

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/flood-arch.svg" alt="المخطط الكتلي: الحساسات وESP32 والتنبيهات المحلية والمراقبة عن بُعد." loading="lazy" decoding="async"><figcaption>المخطط الكتلي: الحساسات وESP32 والتنبيهات المحلية والمراقبة عن بُعد.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/flood-levels.svg" alt="مستويات الخطر وتنبيهاتها المحلية." loading="lazy" decoding="async"><figcaption>مستويات الخطر وتنبيهاتها المحلية.</figcaption></figure>
<figure class="pfig"><img src="/diagrams/flood-flow.svg" alt="مخطط تشغيل البرمجيات الثابتة لـ ESP32." loading="lazy" decoding="async"><figcaption>مخطط تشغيل البرمجيات الثابتة لـ ESP32.</figcaption></figure>
</div>


## النموذج ولوحة المتابعة

<div class="pfigs">
<figure class="pfig"><img src="/img/fl-photo.webp" alt="نموذج لوحة التجارب مع ESP32 وحساسي المطر ومستوى المياه والأضواء والجرس." loading="lazy" decoding="async"><figcaption>نموذج لوحة التجارب مع ESP32 وحساسي المطر ومستوى المياه والأضواء والجرس.</figcaption></figure>
<figure class="pfig"><img src="/img/fl-nodered.webp" alt="لوحة Node-RED: حالة الفيضان وحالة المطر وسجل مستوى المياه." loading="lazy" decoding="async"><figcaption>لوحة Node-RED: حالة الفيضان وحالة المطر وسجل مستوى المياه.</figcaption></figure>
</div>


## النتائج والحدود
