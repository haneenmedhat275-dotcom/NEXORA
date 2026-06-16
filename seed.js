const mongoose = require('mongoose');
const Question = require('./models/question');
require('dotenv').config();

const questions = [
  // Technical Questions
  {
    text: "ما هو الـ Array وما الفرق بينه وبين الـ Object؟",
    category: "technical",
    level: "beginner",
    modelAnswer: "Array هو هيكل بيانات بيخزن مجموعة من العناصر مرتبة بـ index رقمي. Object بيخزن البيانات في شكل key-value pairs. Array بنستخدمه لقوائم متشابهة، Object بنستخدمه لبيانات مختلفة عن نفس الشيء."
  },
  {
    text: "اشرح مفهوم الـ OOP وما هي مبادئه الأساسية؟",
    category: "technical",
    level: "intermediate",
    modelAnswer: "OOP هو أسلوب برمجة بيعتمد على الكلاسات والأوبجكتس. مبادئه: Encapsulation تغليف البيانات، Inheritance الوراثة، Polymorphism تعدد الأشكال، Abstraction التجريد."
  },
  {
    text: "ما الفرق بين الـ SQL والـ NoSQL؟",
    category: "technical",
    level: "intermediate",
    modelAnswer: "SQL قواعد بيانات علائقية بتخزن البيانات في جداول. NoSQL بتخزن البيانات في شكل documents أو key-value. SQL أحسن للبيانات المنظمة، NoSQL أحسن للبيانات الكبيرة وغير المنظمة."
  },
  {
    text: "ما هو الـ API وإزاي بيشتغل؟",
    category: "technical",
    level: "beginner",
    modelAnswer: "API هو واجهة بتسمح لتطبيقين يتكلموا مع بعض. بيشتغل عن طريق HTTP requests زي GET و POST و PUT و DELETE. الكلاينت بيبعت request والسيرفر بيرد بـ response في شكل JSON."
  },
  {
    text: "ما هو الـ Git وليه بنستخدمه؟",
    category: "technical",
    level: "beginner",
    modelAnswer: "Git هو نظام تحكم في الإصدارات بيسمح نتتبع التغييرات في الكود ونرجع لأي نسخة قديمة. بنستخدمه عشان نشتغل في تيم من غير ما نبوظ على بعض."
  },
  {
    text: "اشرح مفهوم الـ Recursion مع مثال.",
    category: "technical",
    level: "advanced",
    modelAnswer: "Recursion هي لما function بتنادي نفسها. مثال حساب الـ Factorial: factorial(5) = 5 * factorial(4). لازم يكون فيه base case عشان نوقف الـ recursion."
  },
  {
    text: "ما الفرق بين الـ var و let و const في JavaScript؟",
    category: "technical",
    level: "beginner",
    modelAnswer: "var قديمة وليها function scope وممكن تتعرف تاني. let بيها block scope وممكن تتغير قيمتها. const بيها block scope وقيمتها مش بتتغير بعد التعريف."
  },
  {
    text: "ما هو الـ HTTP وما الفرق بين GET و POST؟",
    category: "technical",
    level: "beginner",
    modelAnswer: "HTTP هو بروتوكول نقل البيانات على الإنترنت. GET بيجيب بيانات من السيرفر وبيبعت البيانات في الـ URL. POST بيبعت بيانات للسيرفر في الـ body وبيستخدم لإنشاء بيانات جديدة."
  },
  {
    text: "اشرح مفهوم الـ Async و Await في JavaScript.",
    category: "technical",
    level: "intermediate",
    modelAnswer: "Async و Await طريقة للتعامل مع العمليات غير المتزامنة. async بتحط قبل الـ function عشان تقول إنها هترجع Promise. await بتستخدمها جوا async function عشان تستنى نتيجة Promise قبل ما تكمل."
  },
  {
    text: "ما هو الـ Design Pattern وما أشهر أنواعه؟",
    category: "technical",
    level: "advanced",
    modelAnswer: "Design Pattern هو حل جاهز لمشكلة متكررة في البرمجة. أشهر الأنواع: Singleton بيضمن instance واحدة فقط، Factory بيعمل objects بدون تحديد الكلاس، Observer لما object يحتاج يبلغ objects تانية بالتغييرات."
  },

  // Personal Questions
  {
    text: "إزاي بتتعامل مع الضغط والمواعيد النهائية في الشغل؟",
    category: "personal",
    level: "beginner",
    modelAnswer: "برتب أولوياتي وبقسم الشغل لمهام صغيرة وبحدد وقت لكل مهمة. بتواصل مع التيم لو في مشكلة وبطلب مساعدة لو محتاج."
  },
  {
    text: "إزاي بتتعامل مع النقد والملاحظات السلبية؟",
    category: "personal",
    level: "beginner",
    modelAnswer: "بسمع كويس وبحاول أفهم وجهة نظر الشخص التاني. بشوف النقد كفرصة للتحسين مش هجوم شخصي. وبطبق الملاحظات المفيدة في شغلي."
  },
  {
    text: "اتكلم عن نفسك وعن أهدافك المهنية.",
    category: "personal",
    level: "beginner",
    modelAnswer: "إجابة كويسة بتشمل: مقدمة عن نفسك ومجالك، مهاراتك الأساسية، إنجازاتك، وهدفك المهني على المدى القريب والبعيد."
  },
  {
    text: "إيه أكبر تحدي واجهته في مشروع وإزاي تغلبت عليه؟",
    category: "personal",
    level: "intermediate",
    modelAnswer: "إجابة كويسة بتوصف المشكلة بوضوح، الخطوات اللي اتخدت لحلها، والنتيجة النهائية. المهم توضح طريقة تفكيرك وقدرتك على حل المشاكل."
  },
  {
    text: "إزاي بتتعلم تكنولوجيا أو مهارة جديدة؟",
    category: "personal",
    level: "beginner",
    modelAnswer: "بابدأ بالأساسيات من الدوكيومنتيشن أو كورسات. بعدين بطبق على مشاريع صغيرة. وبستخدم مجتمعات زي Stack Overflow وGitHub عشان أتعلم من تجارب الناس."
  },
  {
    text: "إيه نقاط قوتك ونقاط ضعفك؟",
    category: "personal",
    level: "beginner",
    modelAnswer: "إجابة كويسة بتذكر نقاط قوة حقيقية ومتعلقة بالشغل. ونقاط الضعف بتذكرها مع خطة لتحسينها عشان تبين إنك واعي بنفسك وبتطور."
  },
  {
    text: "إزاي بتشتغل في تيم وإيه دورك فيه؟",
    category: "personal",
    level: "intermediate",
    modelAnswer: "بتواصل بوضوح مع أعضاء التيم وبشارك في الاجتماعات. بعمل اللي عليّ في الوقت المحدد وببلغ لو في أي مشكلة. وبساعد زملائي لو محتاجين مساعدة."
  },
  {
    text: "فين شايف نفسك بعد 5 سنين؟",
    category: "personal",
    level: "intermediate",
    modelAnswer: "إجابة كويسة بتبين طموح واقعي ومتعلق بالمجال. زي إنك تبقى Senior Developer أو Tech Lead. وبتوضح الخطوات اللي هتاخدها للوصول لهدفك."
  },
  {
    text: "إزاي بتتعامل مع خلاف مع زميل في الشغل؟",
    category: "personal",
    level: "intermediate",
    modelAnswer: "بحاول أفهم وجهة نظره الأول. وبتكلم معاه بشكل مباشر وهادي. لو الخلاف كبير بنرجع للمدير أو التيم ليد. الهدف دايماً نوصل لحل يفيد الشغل."
  },
  {
    text: "ليه اخترت مجال البرمجة؟",
    category: "personal",
    level: "beginner",
    modelAnswer: "إجابة كويسة بتبين شغفك الحقيقي بالمجال وتذكر تجربة أو موقف خلاك تحب البرمجة. وتوضح إزاي ده بيتوافق مع أهدافك المهنية."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('✅ 20 Questions added successfully');
    process.exit();
  })
  .catch((err) => {
    console.log('❌ Error:', err);
    process.exit();
  });