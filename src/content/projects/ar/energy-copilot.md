---
title: مساعد كفاءة الطاقة الصناعية
number: AAQ-P07
domain: energy
year: 2026
status: simulated
hardwareStatus: designed
featured: true
inProgress: true
cover: /img/en-dashboard.webp
summary: >-
  منصة لمراقبة الطاقة في عدة مواقع تحوّل القياسات الكهربائية إلى قائمة مرتبة بما يجب فحصه أولًا. قائد الفريق؛
  البرمجيات مختبرة على بيانات محاكاة.
lede: منصة تنقل مدير الطاقة من القياسات الكهربائية الخام إلى قائمة مرتبة بما يجب فحصه أولًا، عبر عدة مواقع صناعية.
tags:
  - ESP32
  - MQTT
  - RS485
  - Python
facts:
  - label: السياق
    value: هاكاثون ANGEL للابتكار 2026 · مسار الطاقة المستدامة
  - label: الفترة
    value: أكتوبر 2026 – مستمر (ينتهي البرنامج في ديسمبر 2026)
  - label: الدور
    value: قائد الفريق · تكامل النظام
  - label: الفريق
    value: فريق PowerTech · 4 طلاب ومشرف
  - label: الأدوات
    value: ESP32 · RS485 · MQTT · لوحة Python
verification:
  - label: البرمجيات
    status: simulated
    text: >-
      لوحة المتابعة والتحليلات تعمل على بيانات محاكاة. في اختبار اصطناعي (90 سجلًا، 3 آلات، 30 يومًا) اكتُشفت
      الحالات الشاذة الثلاث المُدرجة دون إنذارات كاذبة.
  - label: العتاد
    status: designed
    text: مخطط وحدة الاقتناء والبرمجيات الثابتة لـ ESP32 مكتملة. لم تُجمَّع الوحدة أو يُتحقق منها مخبريًا بعد.
  - label: هدف البرنامج
    status: planned
    text: >-
      بحلول يوم العرض (ديسمبر 2026): قراءات عدّاد متحقق منها مخبريًا وتدفق بيانات حي من ESP32 عبر MQTT إلى
      لوحة المتابعة.
shown:
  - البرمجيات تستوفي متطلب النموذج الأولي Alpha للتحدي
  - 'اختبار اصطناعي: اكتُشفت 3 من 3 حالات شاذة، دون إنذارات كاذبة'
  - مسار MQTT الحي مختبر بعدّاد محاكى
limits:
  - لا توجد بيانات قياس حقيقية بعد
  - العتاد لم يُجمَّع أو يُتحقق منه
  - لم تُجرَ مقابلات مع مديري الطاقة بعد
  - المساعد يتبع قواعد ثابتة ولا يتعلم
resources:
  - type: PDF
    label: تقرير المشروع · 10 صفحات
    host: AAQ-P07_Energy-Efficiency-Copilot_Project-Report.pdf
    url: /reports/AAQ-P07_Energy-Efficiency-Copilot_Project-Report.pdf
---

## المشكلة

كثير من المصانع لا ترى الكهرباء إلا كمجموع شهري. ومن دون بيانات على مستوى الآلة لا تستطيع معرفة أي معدة تستهلك أكثر من المتوقع، أو أي آلة تعمل خارج ساعات الإنتاج، أو متى تتراجع الكفاءة تدريجيًا. والشركات متعددة المواقع لا تعرف بسهولة أي موقع تفحصه أولًا.

طرحت التحدي شركة PT Indmira Global Energi بوصفها صاحبة المشكلة الصناعية، وهو مرتبط بالتزامات إدارة الطاقة وفق اللائحة الحكومية الإندونيسية PP 33/2023.


## المنهجية

منصة واحدة تغطي خمس خطوات. تُعرض كل نتيجة مع دليلها، ولا تدّعي المنصة وفورات لا يمكن التحقق منها.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-pipeline.svg" alt="مسار المنصة المبني على الأدلة في خمس خطوات." loading="lazy" decoding="async"><figcaption>مسار المنصة المبني على الأدلة في خمس خطوات.</figcaption></figure>
</div>


## النظام

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-arch.svg" alt="بنية النظام: طبقات العتاد والبيانات والتحليلات والتطبيق." loading="lazy" decoding="async"><figcaption>بنية النظام: طبقات العتاد والبيانات والتحليلات والتطبيق.</figcaption></figure>
</div>


## تصميم العتاد

تضم وحدة الاقتناء مدخل تيار متردد ومصهرًا، ومزود طاقة HLK-5M05 بجهد 5 فولت، وعدّاد طاقة من سلسلة PZEM، وواجهة RS485 من نوع MAX485، ومتحكم ESP32-WROOM-32D، وشاشة OLED، ووحدة microSD.

<div class="pfigs">
<figure class="pfig wide"><img src="/img/en-schematic.webp" alt="المخطط الكهربائي لوحدة الاقتناء (Cirkit Designer). تصميم فقط، لم يُتحقق منه مخبريًا بعد." loading="lazy" decoding="async"><figcaption>المخطط الكهربائي لوحدة الاقتناء (Cirkit Designer). تصميم فقط، لم يُتحقق منه مخبريًا بعد.</figcaption></figure>
</div>


## النموذج البرمجي

<div class="pfigs">
<figure class="pfig wide"><img src="/img/en-dashboard.webp" alt="مركز قيادة الطاقة، معروض ببيانات منظمة تجريبية محاكاة وليس ببيانات عدادات فعلية." loading="lazy" decoding="async"><figcaption>مركز قيادة الطاقة، معروض ببيانات منظمة تجريبية محاكاة وليس ببيانات عدادات فعلية.</figcaption></figure>
</div>


## دوري والفريق

قُدت الفريق وكنت مسؤولًا عن تكامل النظام: لوحة المتابعة، ومسار البيانات (MQTT والتخزين)، وتنسيق التحقق مع المستخدمين في القطاع الصناعي.

| الاسم | الدور |
|---|---|
| **عاصم قائد** | قائد الفريق · تكامل النظام، لوحة المتابعة، مسار البيانات |
| فواز أباكر | التصميم الكهربائي، عتاد القياس، برمجيات ESP32 |
| عبدالله الحامد | كشف الشذوذ، التنبؤ، المساعد الذكي |
| ياسمين محمد | التحقق من السوق، نموذج العمل، الملكية الفكرية |
| د. فردوس | المشرف الأكاديمي والتقني |


## النتائج والحدود

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/energy-readiness.svg" alt="جاهزية كل جزء من النظام." loading="lazy" decoding="async"><figcaption>جاهزية كل جزء من النظام.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/energy-roadmap.svg" alt="خارطة التطوير وفق مراحل البرنامج." loading="lazy" decoding="async"><figcaption>خارطة التطوير وفق مراحل البرنامج.</figcaption></figure>
</div>
