export type Language = 'en' | 'ar';

export const PROFILE = {
  name: 'Mahmoud Wehaiba',
  title: { en: 'Software & AI Engineer', ar: 'مهندس برمجيات وذكاء اصطناعي' },
  summary: {
    en: 'I build backend systems, business applications, AI workflows and domain-specific software. My background in Agricultural Engineering gives me an unusual domain perspective, but software engineering is the center of my work.',
    ar: 'أبني الأنظمة الخلفية وتطبيقات الأعمال وسير عمل الذكاء الاصطناعي والبرمجيات المتخصصة. خلفيتي في الهندسة الزراعية تمنحني منظورًا مختلفًا، لكن هندسة البرمجيات هي محور عملي.'
  },
  principles: {
    en: ['Correctness before optimization', 'Build before over-planning', 'Clear ownership and documentation', 'Prefer simple systems that can be maintained'],
    ar: ['الصحة قبل تحسين الأداء', 'البناء العملي قبل التخطيط الزائد', 'ملكية وتوثيق واضحان', 'تفضيل الأنظمة البسيطة القابلة للصيانة']
  }
};

export const PROJECTS = [
  {
    name: 'OcculOS',
    status: { en: 'Internal product · Active pilot', ar: 'منتج داخلي · تجربة ميدانية' },
    role: { en: 'Founder / Software Engineer', ar: 'المؤسس / مهندس برمجيات' },
    description: { en: 'Windows POS/ERP software for optical shops covering sales, patients and prescriptions, inventory, suppliers, finance, reporting, licensing and backup workflows.', ar: 'نظام POS/ERP على Windows لمتاجر النظارات يغطي المبيعات والمرضى والوصفات والمخزون والموردين والحسابات والتقارير والترخيص والنسخ الاحتياطي.' },
    stack: 'C# · WPF · .NET · SQLite · SQL Server'
  },
  {
    name: 'Course Platform',
    status: { en: 'Product build · Active development', ar: 'منتج قيد التطوير' },
    role: { en: 'Full-stack engineer', ar: 'مهندس Full-stack' },
    description: { en: 'Learning-platform work exploring course delivery, teacher/student workflows, payments, protected media and backend services.', ar: 'منصة تعليمية تستكشف الدورات وسير عمل المعلمين والطلاب والدفع وحماية المحتوى والخدمات الخلفية.' },
    stack: 'React · Node.js · Python · PostgreSQL'
  },
  {
    name: 'HealthMaster',
    status: { en: 'Earlier project · Archived', ar: 'مشروع سابق · مؤرشف' },
    role: { en: 'Earlier backend / full-stack work', ar: 'عمل سابق في الـBackend والـFull-stack' },
    description: { en: 'An earlier healthcare-management application. It is retained as engineering history and a possible source of reusable ideas after code review, not presented as current production evidence.', ar: 'تطبيق سابق لإدارة الرعاية الصحية. أحتفظ به كتاريخ هندسي ومصدر محتمل لأفكار قابلة لإعادة الاستخدام بعد مراجعة الكود، وليس كدليل على منتج إنتاجي حالي.' },
    stack: 'Web · Backend · Database'
  },
  {
    name: 'JARVIS / AI Experiments',
    status: { en: 'Research / personal experiments', ar: 'تجارب بحثية / شخصية' },
    role: { en: 'Independent engineer', ar: 'مهندس مستقل' },
    description: { en: 'Experiments around local LLMs, agents, RAG, automation and developer tooling. These are experiments, not claims of a commercial AI platform.', ar: 'تجارب حول النماذج المحلية والوكلاء وRAG والأتمتة وأدوات المطورين. هذه تجارب وليست ادعاءً بوجود منصة ذكاء اصطناعي تجارية.' },
    stack: 'Python · Ollama · RAG · Agents · APIs'
  }
];

export const SKILLS = [
  ['Backend', 'C# / .NET · Node.js · Python · FastAPI · REST APIs'],
  ['Frontend', 'React · TypeScript · JavaScript · HTML/CSS'],
  ['Data', 'SQL Server · SQLite · PostgreSQL · EF Core'],
  ['AI', 'Local LLMs · RAG · Agents · API integrations · Automation'],
  ['Desktop', 'WPF · Electron · Windows application architecture'],
  ['Domain', 'Agricultural systems · Business software · Operational workflows']
];

export const EDUCATION = [
  { period: '2020–2024', title: { en: 'B.Agriculture — General Division', ar: 'بكالوريوس زراعة — القسم العام' }, detail: { en: 'Tanta University · Faculty of Agriculture', ar: 'جامعة طنطا · كلية الزراعة' } },
  { period: '2026', title: { en: 'Military Service — Completed', ar: 'الخدمة العسكرية — مكتملة' }, detail: { en: 'Egypt', ar: 'مصر' } }
];