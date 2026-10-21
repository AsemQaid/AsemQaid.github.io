---
title: 'EE Studio: مختبر هندسي افتراضي تفاعلي'
number: AAQ-P06
domain: software
year: 2026
status: deployed
featured: true
cover: /img/ees-landing.webp
summary: منصة ويب منشورة تضم 37 مختبرًا تفاعليًا في سبعة مجالات للهندسة الكهربائية، مدعومة بـ 485 اختبارًا آليًا.
lede: >-
  مختبر افتراضي في المتصفح يغيّر فيه الطالب معاملًا ويشاهد استجابة النظام: كتلة تستقر على نابض، أو هبوط جهد
  محول، أو شبكة تقترب من انهيار الجهد.
tags:
  - React
  - TypeScript
  - FastAPI
  - SciPy
  - pytest
facts:
  - label: السياق
    value: مشروع شخصي
  - label: الفترة
    value: 2026 · أول إصدار مكتمل في أكتوبر 2026
  - label: الدور
    value: المؤلف الوحيد · تطوير بمساعدة الذكاء الاصطناعي
  - label: النطاق
    value: 7 وحدات · 37 مختبرًا · 485 اختبارًا
  - label: الأدوات
    value: React · TypeScript · FastAPI · NumPy/SciPy
verification:
  - label: المنصة
    status: deployed
    text: 'يعمل: الواجهة على Vercel، والخادم على Railway، والشيفرة على GitHub.'
  - label: التحقق
    status: tested
    text: 485 اختبارًا آليًا ناجحًا عند أول إصدار مكتمل، مقارنة بحسابات يدوية أو بـ SciPy.
  - label: طريقة البناء
    status: note
    text: >-
      بتوجيه بشري وبمساعدة الذكاء الاصطناعي: حددت النطاق وتحققت من كل نموذج وراجعت كل مختبر؛ وولّد Claude
      وClaude Code الشيفرة واختبراها.
resources:
  - type: WEB
    label: المنصة المنشورة
    host: ee-studio-red.vercel.app
    url: https://ee-studio-red.vercel.app
  - type: CODE
    label: الشيفرة المصدرية
    host: github.com/AsemQaid/ee-studio
    url: https://github.com/AsemQaid/ee-studio
  - type: PDF
    label: تقرير المشروع · 12 صفحات
    host: AAQ-P06_EE-Studio_Project-Report.pdf
    url: /reports/AAQ-P06_EE-Studio_Project-Report.pdf
---

## لماذا بنيته

تُدرَّس الهندسة الكهربائية عادة كمعادلات ورسوم ثابتة. قد يحفظ الطالب أن النظام ذا نسبة التخميد الأقل من واحد يتذبذب دون أن يرى التذبذب يتغير. المعدات المخبرية والمحاكيات الاحترافية تساعد، لكنها تحتاج وصولًا أو تراخيص أو وقتًا للتعلم.

يقع EE Studio بين الخيارين: بلا تثبيت، وكل تجربة مختصرة إلى المعاملات المهمة، والنتيجة تظهر فورًا.

<div class="pfigs">
<figure class="pfig"><img src="/img/ees-landing.webp" alt="المنصة المنشورة، وتظهر الوحدات السبع." loading="lazy" decoding="async"><figcaption>المنصة المنشورة، وتظهر الوحدات السبع.</figcaption></figure>
</div>


## ما الذي يغطيه

| الوحدة | المختبرات | الاختبارات |
|---|---|---:|
| أنظمة القدرة | المحول، خط النقل، سريان القدرة، تحليل الأعطال، الحماية | 65 |
| الطاقة المتجددة | الخلايا الشمسية، MPPT، توربين الرياح، تخزين البطاريات، العاكس الشبكي | 58 |
| أنظمة التحكم | الاستجابة الخطوية، PID، بودي، المحل الهندسي للجذور، نايكويست، فضاء الحالة | 76 |
| معالجة الإشارات | أخذ العينات، الالتفاف، المرشحات، FFT، الطيف، مولد الإشارات | 81 |
| تصميم الأنظمة الإلكترونية | مضخم العمليات، المقوّم، انحياز BJT، مرشحات RC/RL، المنظمات | 60 |
| تعلم الآلة | الانحدار، الانحدار اللوجستي، الشبكة العصبية، k-means، PCA | 73 |
| الأنظمة الطبية الحيوية | تخطيط القلب، تخطيط الدماغ، ضغط الدم، قياس الأكسجين، الحرائك الدوائية | 72 |

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-tests.svg" alt="الاختبارات الناجحة لكل وحدة." loading="lazy" decoding="async"><figcaption>الاختبارات الناجحة لكل وحدة.</figcaption></figure>
</div>


## البنية

تقع كل الرياضيات الهندسية في دوال Python مستقلة عن الويب، لذا يمكن اختبار كل نموذج وحده. مسار FastAPI بسيط يتحقق من كل طلب ويستدعي المحرك، وتعرض صفحة المختبر في React النتيجة في رسوم بيانية وتمثيل فيزيائي.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-arch.svg" alt="الواجهة والخادم والمستودع." loading="lazy" decoding="async"><figcaption>الواجهة والخادم والمستودع.</figcaption></figure>
<figure class="pfig wide"><img src="/diagrams/ees-labpage.svg" alt="التخطيط ذو الخانات الست المشترك بين صفحات المختبرات." loading="lazy" decoding="async"><figcaption>التخطيط ذو الخانات الست المشترك بين صفحات المختبرات.</figcaption></figure>
</div>


## المنهجية: التحقق من الرياضيات أولًا

يتبع كل مختبر المسار نفسه من سبع خطوات، وأولى بواباته رياضية: يُتحقق من النموذج عدديًا قبل كتابة أي محرك. وتختبر الاختبارات السلوك الفيزيائي إلى جانب الأرقام، مثل أن جهد قضيب الحمل ينخفض كلما زاد الحمل، وأن الحمل الكبير يجعل حساب سريان القدرة يعلن عدم التقارب بدل إعطاء قيمة خاطئة.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-pipeline.svg" alt="مسار تطوير المختبر: سبع خطوات وبوابة قرار واحدة." loading="lazy" decoding="async"><figcaption>مسار تطوير المختبر: سبع خطوات وبوابة قرار واحدة.</figcaption></figure>
</div>


## دروس من الأخطاء

جاءت أهم الدروس من نتائج بدت معقولة لكنها كانت خاطئة. أظهر مختبر سريان القدرة في البداية ارتفاع الجهد مع زيادة الحمل بسبب خطأ في الإشارة في معادلات موسّعة يدويًا؛ فأُعيد بناؤه على مصفوفة السماحية، ويتحقق اختبار انحدار الآن من الاتجاه.

<div class="pfigs">
<figure class="pfig wide"><img src="/diagrams/ees-deploy.svg" alt="النشر: GitHub وVercel وRailway والمتصفح." loading="lazy" decoding="async"><figcaption>النشر: GitHub وVercel وRailway والمتصفح.</figcaption></figure>
<figure class="pfig"><img src="/img/ees-api.webp" alt="توثيق واجهة البرمجة التفاعلي من الخادم المنشور." loading="lazy" decoding="async"><figcaption>توثيق واجهة البرمجة التفاعلي من الخادم المنشور.</figcaption></figure>
</div>
