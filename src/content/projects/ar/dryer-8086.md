---
title: نظام تحكم في مجفف باستخدام المعالج 8086
number: AAQ-P02
domain: control
year: 2026
status: simulated
featured: false
cover: /img/dr-circuit.webp
summary: >-
  تحكم في الحرارة وإنذار للضغط في مجفف، مكتوب بلغة تجميع 8086 مع واجهة 8255 ومحوّل ADC0804، ومتحقق منه في
  Proteus.
lede: 'متحكم في مجفف مكتوب بلغة تجميع 8086: يحافظ على الحرارة عند قيمة محددة ويطلق إنذارًا عند ارتفاع الضغط.'
tags:
  - '8086'
  - 8255 PPI
  - ADC0804
  - Proteus
facts:
  - label: السياق
    value: أنظمة الحاسوب والمعالجات الدقيقة · مشروع نهائي
  - label: الفترة
    value: يناير 2026
  - label: الدور
    value: مشروع فردي
  - label: العتاد
    value: 8086 · 8255 PPI · ADC0804 · LM35 · MPX4115A
  - label: الأدوات
    value: لغة تجميع 8086 · Proteus
verification:
  - label: التصميم
    status: simulated
    text: الدائرة والبرنامج كاملان ويعملان في Proteus.
  - label: الاختبارات
    status: simulated
    text: 15 حالة محاكاة عند 30 °م و100 كيلوباسكال؛ وعمل السخان والإنذار كما هو محدد في كل حالة.
  - label: غير مبني
    status: planned
    text: لم يُبنَ عتاد فعلي.
shown:
  - تشغيل السخان وإيقافه حول القيمة المحددة
  - إنذار وعودة تلقائية عند الضغط الزائد
limits:
  - محاكاة فقط؛ لم يُختبر ضجيج الحساسات الفعلي وتوقيت المرحّل
  - تحكم تشغيل/إيقاف فقط؛ بلا هسترة أو PID
resources:
  - type: PDF
    label: تقرير المشروع · 10 صفحات
    host: AAQ-P02_8086-Dryer-Control_Project-Report.pdf
    url: /reports/AAQ-P02_8086-Dryer-Control_Project-Report.pdf
  - type: ASM
    label: شيفرة لغة التجميع
    host: dryer-control-8086.asm
    url: /code/dryer-control-8086.asm.txt
---

## الربط

ينتج حساس الحرارة LM35 وحساس الضغط MPX4115A جهودًا تماثلية يحوّلها ADC0804 إلى قيم من 8 بتات. وتتولى واجهة 8255 في الوضع 0 كل المداخل والمخارج: المنفذ A يشغّل شاشة السبع قطع، والمنفذ B يقرأ المحوّل، والمنفذ C يقرأ الأزرار ويشغّل مرحّل السخان والجرس.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/dryer-block.svg" alt="المخطط الكتلي: 8086 ومنافذ 8255 والمحوّل والحساسات والمخارج." loading="lazy" decoding="async"><figcaption>المخطط الكتلي: 8086 ومنافذ 8255 والمحوّل والحساسات والمخارج.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/dryer-cw.svg" alt="كلمة التحكم 8AH للواجهة 8255 بتًا بتًا." loading="lazy" decoding="async"><figcaption>كلمة التحكم 8AH للواجهة 8255 بتًا بتًا.</figcaption></figure>
<figure class="pfig wide"><img src="/img/dr-circuit.webp" alt="دائرة المحاكاة في Proteus." loading="lazy" decoding="async"><figcaption>دائرة المحاكاة في Proteus.</figcaption></figure>
</div>


## منطق التحكم

تقرأ الحلقة الرئيسية الأزرار، وتأخذ عينات من الحساسين وتقارنهما بالقيم المحددة. يعمل السخان ما دامت الحرارة أقل من القيمة المحددة (CMP وJB)، ويعمل الجرس ما دام الضغط أعلى من حده (CMP وJA). وبما أن المداخل والمخارج تتشارك المنفذ C، تُكتب المخرجات عبر نسخة مقنّعة (OUT_IMAGE) لتجنب التأثير على قراءة الأزرار.

<div class="pfigs">
<figure class="pfig"><img src="/diagrams/dryer-flow.svg" alt="مخطط سير البرنامج." loading="lazy" decoding="async"><figcaption>مخطط سير البرنامج.</figcaption></figure>
</div>


## نتائج المحاكاة

| رقم | الحرارة (°م) | الضغط (kPa) | السخان | الجرس |
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
