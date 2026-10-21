---
title: تقدير السرعة باستخدام حساس الحركة MPU6050
number: AAQ-P03
domain: measure
year: 2026
status: tested
featured: false
cover: /diagrams/mpu-rmse.svg
summary: >-
  مقارنة طريقتين لتقدير السرعة بقياسات مرجعية: بلغ جذر متوسط مربع الخطأ 0.161 م/ث لعدّ الخطوات و1.106 م/ث
  للتكامل.
lede: >-
  طريقتان لتقدير السرعة من حساس حركة منخفض التكلفة، مختبرتان مقابل مسافة وزمن مقاسين، مع تفسير لكون إحداهما
  أدق بسبعة أضعاف.
tags:
  - MPU6050
  - Arduino
  - RMSE
  - Filtering
facts:
  - label: السياق
    value: القياس والأجهزة · المشروع النهائي، الجزء 2
  - label: الفترة
    value: 2026 · الفصل الزوجي 2025/2026
  - label: الدور
    value: مشروع ثنائي مع فواز أباكر
  - label: العتاد
    value: MPU6050 · Arduino Nano
  - label: المنهج
    value: 15 تجربة لكل طريقة · RMSE مقابل المرجع
verification:
  - label: المقارنة المرجعية
    status: tested
    text: 15 تجربة لكل طريقة مقابل سرعة مرجعية من مسافة مقاسة وزمن بساعة إيقاف.
  - label: النتيجة
    status: tested
    text: 'عدّ الخطوات: 0.161 م/ث (متوسط خطأ 9.8%). تكامل التسارع: 1.106 م/ث (متوسط خطأ 36.0%).'
  - label: ملاحظة
    status: note
    text: وُلِّدت لوحة المتابعة بمساعدة الذكاء الاصطناعي كما سمح المقرر، والطلب المستخدم مذكور في التقرير.
shown:
  - فرق واضح ومفسَّر فيزيائيًا بين الطريقتين
  - التكامل وحده غير موثوق لسرعة المركبات
limits:
  - طول خطوة ثابت؛ توقيت مرجعي بساعة يدوية
  - 'التالي: دمج الحساسات، مقياس مغناطيسي للاتجاه، طول خطوة حسب الإيقاع'
resources:
  - type: PDF
    label: تقرير المشروع · 12 صفحات
    host: AAQ-P03_MPU6050-Speed-Estimation_Project-Report.pdf
    url: /reports/AAQ-P03_MPU6050-Speed-Estimation_Project-Report.pdf
---

## السؤال

هل يستطيع مقياس تسارع وجيروسكوب منخفضا التكلفة قياس السرعة بدقة مفيدة، وأي طريقة ينبغي استخدامها؟ تكامل التسارع هو النهج البديهي، وعدّ الخطوات بديل أبسط للمشي.


## الإعداد ومعالجة الإشارة

يتصل MPU6050 عبر I2C بمتحكم Arduino Nano الذي يرسل البيانات إلى لوحة ويب عبر Web Serial. ضُبط المرشح الداخلي للحساس على 21 هرتز، ويقدّر مرشح تكميلي (α = 0.98) زاويتي الميل لإزالة الجاذبية من محاور التسارع، وتكبت منطقة ميتة بمقدار 0.20 م/ث² الضجيج المتبقي. وعند كل تشغيل يأخذ النظام متوسط نحو 600 عينة خلال 3 ثوانٍ لمعايرة المحاور الستة ذاتيًا.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mpu-arch.svg" alt="المخطط الكتلي: الحساسات وArduino Nano ولوحة الحاسوب." loading="lazy" decoding="async"><figcaption>المخطط الكتلي: الحساسات وArduino Nano ولوحة الحاسوب.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-dsp.svg" alt="سلسلة معالجة الإشارة من البيانات الخام إلى تقديري السرعة." loading="lazy" decoding="async"><figcaption>سلسلة معالجة الإشارة من البيانات الخام إلى تقديري السرعة.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-hw.webp" alt="نظام القياس المجمّع: MPU6050 وArduino Nano." loading="lazy" decoding="async"><figcaption>نظام القياس المجمّع: MPU6050 وArduino Nano.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-dash.webp" alt="لوحة المتابعة، تبويب الحركة والاتجاه." loading="lazy" decoding="async"><figcaption>لوحة المتابعة، تبويب الحركة والاتجاه.</figcaption></figure>
</div>


## التجارب

اختُبرت الطريقة 1 (التكامل) بتثبيت الحساس على عربة تنظيف في الحرم الجامعي لمسافات من 5 إلى 20 مترًا. واختُبرت الطريقة 2 (عدد الخطوات × طول الخطوة ÷ الزمن) بالمشي في ممر للمسافات نفسها.

<div class="pfigs">
<figure class="pfig"><img src="/img/mp-cart.webp" alt="تجربة المركبة على عربة تنظيف." loading="lazy" decoding="async"><figcaption>تجربة المركبة على عربة تنظيف.</figcaption></figure>
<figure class="pfig"><img src="/img/mp-walk.webp" alt="تجربة المشي في ممر." loading="lazy" decoding="async"><figcaption>تجربة المشي في ممر.</figcaption></figure>
</div>


## النتائج

كان عدّ الخطوات أدق بنحو سبعة أضعاف. فالتكامل يحوّل أي انحياز صغير متبقٍ إلى خطأ في السرعة يكبر مع الزمن، ويزيده اهتزاز المركبة وميلها. أما عدّ الخطوات المنفصلة فلا يراكم خطأ مع الزمن، وحدّه هو مدى ثبات طول الخطوة.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/mpu-vehicle.svg" alt="تجربة المركبة: السرعة المقاسة (الطريقة 1) مقابل المحسوبة." loading="lazy" decoding="async"><figcaption>تجربة المركبة: السرعة المقاسة (الطريقة 1) مقابل المحسوبة.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-walking.svg" alt="تجربة المشي: السرعة المقاسة (الطريقة 2) مقابل المحسوبة." loading="lazy" decoding="async"><figcaption>تجربة المشي: السرعة المقاسة (الطريقة 2) مقابل المحسوبة.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-rmse.svg" alt="جذر متوسط مربع الخطأ للطريقتين." loading="lazy" decoding="async"><figcaption>جذر متوسط مربع الخطأ للطريقتين.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/mpu-trials.svg" alt="الخطأ المطلق لكل تجربة، الطريقة 1 مقابل 2." loading="lazy" decoding="async"><figcaption>الخطأ المطلق لكل تجربة، الطريقة 1 مقابل 2.</figcaption></figure>
</div>


## الحدود والخطوات التالية
