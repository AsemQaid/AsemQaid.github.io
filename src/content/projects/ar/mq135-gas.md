---
title: قياس تركيز الغازات باستخدام الحساس MQ135
number: AAQ-P01
domain: measure
year: 2025
status: prototyped
featured: false
cover: /diagrams/mq-co2.svg
summary: >-
  حساس MQ135 معاير مع Arduino Nano لمقارنة ثاني أكسيد الكربون في 15 موقعًا في الحرم الجامعي، مع واجهة عرض حية
  بلغة Python.
lede: >-
  حساس غاز منخفض التكلفة ومعاير لمقارنة جودة الهواء في 15 موقعًا في الحرم الجامعي، من الأسطح المفتوحة إلى
  مختبر مزدحم.
tags:
  - MQ135
  - Arduino
  - Python
  - Calibration
facts:
  - label: السياق
    value: القياس والأجهزة · المشروع النهائي، الجزء 1
  - label: الفترة
    value: 2025 · الفصل الرابع
  - label: الدور
    value: مشروع فردي
  - label: العتاد
    value: MQ135 · Arduino Nano
  - label: البرمجيات
    value: Arduino · واجهة Python حية
verification:
  - label: النظام
    status: prototyped
    text: بُني ومُعاير بعد تسخين لمدة 24 ساعة، واستُخدم في قياسات فعلية.
  - label: مسح CO₂
    status: prototyped
    text: 15 موقعًا، من نحو 376 إلى 2,172 جزءًا في المليون، وأعلى في الأماكن المغلقة والمزدحمة.
  - label: الحدود
    status: planned
    text: >-
      لم يُقارن بجهاز مرجعي لقياس CO₂. تجاوزت قراءات الإيثانول النطاق الصالح لنموذج الحساس، لذا يُذكر نمط
      الاستجابة فقط.
shown:
  - علاقة واضحة بين التهوية والإشغال وثاني أكسيد الكربون
limits:
  - المقارنة بجهاز مرجعي لقياس CO₂
  - إضافة تعويض للحرارة والرطوبة
  - البقاء ضمن نطاق التركيز الصالح للحساس
resources:
  - type: PDF
    label: تقرير المشروع · 10 صفحات
    host: AAQ-P01_MQ135-Gas-Measurement_Project-Report.pdf
    url: /reports/AAQ-P01_MQ135-Gas-Measurement_Project-Report.pdf
---

## النظام والمعايرة

يُقرأ خرج MQ135 على المدخل التماثلي لـ Arduino Nano. سُخِّن الحساس 24 ساعة، واستُخدم مع مقاومة حمل 20 كيلو أوم، وقيست مقاومته في الهواء النظيف R₀ وأُخذ متوسطها (221.3 لثاني أكسيد الكربون و144.46 للإيثانول) قبل القياس. واستبدل تطبيق Python شاشة المنفذ التسلسلي بقيم ورسوم حية.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mq-block.svg" alt="المخطط الكتلي للنظام." loading="lazy" decoding="async"><figcaption>المخطط الكتلي للنظام.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-conv.svg" alt="سلسلة التحويل من قراءة المحوّل إلى تركيز الغاز." loading="lazy" decoding="async"><figcaption>سلسلة التحويل من قراءة المحوّل إلى تركيز الغاز.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-cal.svg" alt="إجراء المعايرة." loading="lazy" decoding="async"><figcaption>إجراء المعايرة.</figcaption></figure>
<figure class="pfig wide"><img src="/img/mq-circuit.webp" alt="توصيلات العتاد." loading="lazy" decoding="async"><figcaption>توصيلات العتاد.</figcaption></figure>
</div>


## مسح ثاني أكسيد الكربون

أُخذت القراءات في 15 موقعًا بتهوية وإشغال مختلفين. سجلت الأماكن المفتوحة جيدة التهوية قيمًا قريبة من المستوى الجوي الطبيعي (نحو 376 جزءًا في المليون)، وسجل مختبر ميكانيكي مزدحم ضعيف التهوية نحو 2,172.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mq-co2.svg" alt="ثاني أكسيد الكربون حسب الموقع، من الأعلى. الأعمدة البرتقالية تتجاوز 1000 جزء في المليون." loading="lazy" decoding="async"><figcaption>ثاني أكسيد الكربون حسب الموقع، من الأعلى. الأعمدة البرتقالية تتجاوز 1000 جزء في المليون.</figcaption></figure>
<figure class="pfig wide"><img src="/img/mq-ui.webp" alt="واجهة المراقبة الحية بلغة Python." loading="lazy" decoding="async"><figcaption>واجهة المراقبة الحية بلغة Python.</figcaption></figure>
</div>


## استجابة الإيثانول وحدّ صريح

عند تعريضه لمعقم اليدين والعطر استجاب الحساس فورًا وعاد عند إبعاد المصدر. تجاوزت قراءتان 1,000,000 جزء في المليون، وهذا مستحيل فيزيائيًا، لأن منحنى التحويل استُخدم خارج نطاقه المحدد (نحو 10–1000 جزء في المليون) بكثير. لذا تُعامل نتائج الإيثانول كمؤشر نسبي على شدة التعرض وليس كتراكيز.

<div class="pfigs">
<figure class="pfig"><img src="/img/mq-eth1.webp" alt="معقم يدين على منديل قرب الحساس." loading="lazy" decoding="async"><figcaption>معقم يدين على منديل قرب الحساس.</figcaption></figure>
<figure class="pfig"><img src="/img/mq-eth2.webp" alt="غطاء عطر فوق الحساس." loading="lazy" decoding="async"><figcaption>غطاء عطر فوق الحساس.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mq-eth.svg" alt="مخرجات اختبار الإيثانول بمقياس لوغاريتمي. القيم فوق 100% مستحيلة فيزيائيًا." loading="lazy" decoding="async"><figcaption>مخرجات اختبار الإيثانول بمقياس لوغاريتمي. القيم فوق 100% مستحيلة فيزيائيًا.</figcaption></figure>
</div>


## ما الذي سأفعله بشكل مختلف
