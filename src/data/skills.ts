// Skills on the About page, in two positions of the selector switch.
//
// USED: tools used in a project. `p` lists project numbers without "AAQ-" (they become links to the project);
//       use `note` instead of `p` for things used only in coursework.
// LEARNING: what I am studying now and have not yet shown in a project. Move an item to USED once a project proves it.

type T = { en: string; ar: string };
export type UsedSkill = { n: string | T; p?: string[]; note?: T };

const coursework: T = { en: "Coursework", ar: "مقرر" };

export const USED: { k: T; items: UsedSkill[] }[] = [
  { k: { en: "Programming and firmware", ar: "البرمجة والبرمجيات الثابتة" }, items: [
    { n: "C / C++", p: ["P01", "P02", "P03", "P04", "P05"] },
    { n: "Python", p: ["P01", "P06", "P07"] },
    { n: "Intel 8086 assembly", p: ["P02"] },
    { n: "Arduino IDE", p: ["P01", "P03", "P04", "P05"] },
  ] },
  { k: { en: "Microcontrollers and digital hardware", ar: "المتحكمات الدقيقة والعتاد الرقمي" }, items: [
    { n: "ESP32", p: ["P04", "P07"] },
    { n: "Arduino Nano", p: ["P01", "P03", "P05"] },
    { n: "Intel 8086 · 8255 PPI · ADC0804", p: ["P02"] },
    { n: { en: "Digital logic in Quartus Prime (FPGA)", ar: "المنطق الرقمي في Quartus Prime (FPGA)" }, note: coursework },
    { n: { en: "PCB assembly and soldering", ar: "تجميع ولحام PCB" }, p: ["P05"] },
  ] },
  { k: { en: "Electronics, instrumentation and interfaces", ar: "الإلكترونيات والقياس والواجهات" }, items: [
    { n: { en: "Sensor interfacing", ar: "ربط الحساسات" }, p: ["P01", "P02", "P03", "P04", "P05"] },
    { n: { en: "Analog-to-digital conversion", ar: "التحويل التماثلي الرقمي" }, p: ["P01", "P02"] },
    { n: "I2C · UART", p: ["P03", "P05"] },
    { n: "RS485 / Modbus", p: ["P07"] },
    { n: "MQTT", p: ["P04", "P07"] },
    { n: "GSM (AT commands)", p: ["P05"] },
    { n: { en: "Isolated power-domain design", ar: "تصميم مجالات طاقة معزولة" }, p: ["P05"] },
  ] },
  { k: { en: "Engineering software and simulation", ar: "البرمجيات الهندسية والمحاكاة" }, items: [
    { n: "Proteus", p: ["P02"] },
    { n: "MATLAB · Simulink", note: coursework },
    { n: "Quartus Prime", note: coursework },
    { n: "Node-RED", p: ["P04"] },
  ] },
  { k: { en: "Testing and engineering analysis", ar: "الاختبار والتحليل الهندسي" }, items: [
    { n: { en: "Structured test scenarios", ar: "سيناريوهات اختبار منظمة" }, p: ["P05"] },
    { n: { en: "Sensor calibration", ar: "معايرة الحساسات" }, p: ["P01", "P03"] },
    { n: { en: "Digital filtering", ar: "الترشيح الرقمي" }, p: ["P03"] },
    { n: { en: "Error analysis (RMSE)", ar: "تحليل الخطأ (RMSE)" }, p: ["P03"] },
    { n: { en: "Simulation-based verification", ar: "التحقق بالمحاكاة" }, p: ["P02"] },
    { n: { en: "Numerical model verification", ar: "التحقق العددي من النماذج" }, p: ["P06"] },
  ] },
];

export const LEARNING: { n: T; where: T }[] = [
  { n: { en: "Power systems analysis", ar: "تحليل أنظمة القدرة" }, where: { en: "Self-study, alongside coursework", ar: "دراسة ذاتية إلى جانب المقررات" } },
  { n: { en: "Control system design", ar: "تصميم أنظمة التحكم" }, where: { en: "Control Systems course, 2026", ar: "مقرر أنظمة التحكم، 2026" } },
  { n: { en: "Machine learning for sensor data", ar: "تعلم الآلة لبيانات الحساسات" }, where: { en: "Machine Learning course, 2026", ar: "مقرر تعلم الآلة، 2026" } },
  { n: { en: "AI fundamentals", ar: "أساسيات الذكاء الاصطناعي" }, where: { en: "Huawei ICT Academy material, 2026", ar: "مواد أكاديمية Huawei ICT، 2026" } },
];
