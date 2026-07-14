"use client";

import Link from "next/link";
import {
  BookOpen,
  Target,
  Eye,
  Users,
  Award,
  Heart,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  Sparkles,
  Star,
  Check,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";

const stats = [
  { icon: ShoppingBag, value: "5000+", label: "منتج متوفر" },
  { icon: Users, value: "10000+", label: "طالب سعيد" },
  { icon: Truck, value: "24", label: "ساعة توصيل" },
  { icon: Award, value: "50+", label: "مدرسة شريكة" },
];

const values = [
  {
    icon: Target,
    title: "الجودة أولاً",
    description: "نختار منتجاتنا بعناية فائقة من أفضل الموردين لضمان أعلى معايير الجودة.",
  },
  {
    icon: Heart,
    title: "الشغف بالتعليم",
    description: "نؤمن بأن كل طالب يستحق أدوات تعليمية ممتازة لتحقيق أحلامه.",
  },
  {
    icon: Shield,
    title: "الموثوقية",
    description: "نلتزم بالمواعيد ونوفر خدمة عملاء متميزة على مدار الساعة.",
  },
  {
    icon: Sparkles,
    title: "الابتكار",
    description: "نبحث دائماً عن أحدث المنتجات والتقنيات لتسهيل عملية التعلم.",
  },
];

const team = [
  { name: "ياسين العلوي", role: "المؤسس والمدير", initial: "ي" },
  { name: "فاطمة الزهراء", role: "مديرة العمليات", initial: "ف" },
  { name: "أحمد بناني", role: "مدير التسويق", initial: "أ" },
  { name: "ليلى المراكشية", role: "خدمة العملاء", initial: "ل" },
];

const features = [
  "شحن مجاني للطلبات فوق 400 د.م.",
  "توصيل خلال 24-48 ساعة",
  "دفع عند الاستلام متاح",
  "إرجاع سهل خلال 14 يوم",
  "منتجات أصلية 100%",
  "دعم فني على مدار الساعة",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* ── Hero ── */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm font-medium border border-white/10">
              <Star className="h-4 w-4 text-amber-400" />
              <span>متجر موثوق منذ 2020</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              من نحن؟
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto">
              مكتبتي هي متجرك الموثوق للوازم المدرسية في المغرب. نؤمن بأن كل طالب يستحق أدوات تعليمية عالية الجودة بأسعار مناسبة.
            </p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80V40C240 0 480 0 720 20C960 40 1200 60 1440 40V80H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 lg:p-10 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">رسالتنا</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                تمكين كل طالب مغربي بالوصول إلى لوازم مدرسية عالية الجودة بأسعار معقولة، مع توصيل سريع وخدمة عملاء متميزة. نسعى لأن نكون الشريك الأول لكل أسرة في رحلة التعليم.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-8 lg:p-10 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">رؤيتنا</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                أن نصبح المنصة الرائدة في المغرب لتوزيع لوازم المدرسة والتعليم، نقدم تجربة تسوق سلسة وموثوقة تلبي احتياجات كل طالب وكل أستاذ في كل ركن من أركان المملكة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
                لماذا نحن؟
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                كل ما تحتاجه للنجاح في مكان واحد
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                نسعى جاهدين لتوفير تجربة تسوق استثنائية تجمع بين الجودة العالية والأسعار المنافسة والخدمة السريعة.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                    <Zap className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-slate-900">4.9</p>
                    <p className="text-xs text-slate-500 mt-1">تقييم العملاء</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                    <Clock className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-slate-900">24h</p>
                    <p className="text-xs text-slate-500 mt-1">أقصى مدة توصيل</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                    <MapPin className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-slate-900">12</p>
                    <p className="text-xs text-slate-500 mt-1">مدينة مغطاة</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                    <Star className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-slate-900">99%</p>
                    <p className="text-xs text-slate-500 mt-1">نسبة رضا العملاء</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
              قيمنا
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              المبادئ التي توجه عملنا
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              نلتزم بهذه القيم في كل ما نقوم به من أجل خدمتكم بأفضل طريقة ممكنة
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
              فريقنا
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              ناس شغوفين بخدمتكم
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              فريق متخصص يعمل بجد لضمان تقديم أفضل خدمة لكم
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                  {member.initial}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 lg:p-14 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                هل لديك سؤال؟
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-md mx-auto">
                فريقنا جاهز لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="h-5 w-5" />
                  تواصل معنا
                </Link>
                <a
                  href="tel:0629504107"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  0629504107
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
