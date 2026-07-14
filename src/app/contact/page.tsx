"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Check,
  Facebook,
  Instagram,
  ArrowLeft,
  Headphones,
  BookOpen,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "العنوان",
      lines: ["وزان، المغرب"],
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Phone,
      title: "الهاتف",
      lines: ["0629504107"],
      href: "tel:0629504107",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      lines: ["contact@maktabati.ma"],
      href: "mailto:contact@maktabati.ma",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Clock,
      title: "أوقات العمل",
      lines: ["السبت - الخميس: 9:00 - 18:00", "الجمعة: مغلق"],
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* ── Hero ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/20">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              اتصل بنا
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              نحن هنا لمساعدتك. أرسل لنا رسالة أو اتصل بنا مباشرة وسنرد عليك في أقرب وقت.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <div className="space-y-1">
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-sm text-slate-500">{line}</p>
                    ))}
                  </div>
                </div>
              );
              return item.href ? (
                <a key={i} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Quick Links ── */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Check className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      تم إرسال رسالتك بنجاح!
                    </h2>
                    <p className="text-slate-500 mb-6">
                      شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
                    >
                      <Send className="h-4 w-4" />
                      إرسال رسالة جديدة
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <MessageCircle className="h-5 w-5 text-slate-500" />
                      <h2 className="text-lg font-bold text-slate-900">أرسل لنا رسالة</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            الاسم
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                            placeholder="اسمك الكامل"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            البريد الإلكتروني
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                            placeholder="example@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          الموضوع
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                          placeholder="موضوع الرسالة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          الرسالة
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all resize-none"
                          placeholder="اكتب رسالتك هنا..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            إرسال الرسالة
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-2 space-y-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/212629504107"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-500 rounded-2xl p-6 text-white hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">واتساب</h3>
                    <p className="text-sm text-emerald-100">رد سريع خلال دقائق</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-100">تواصل معنا مباشرة عبر واتساب للحصول على مساعدة فورية.</p>
              </a>

              {/* Social */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="font-bold text-slate-900 mb-4">تابعنا</h3>
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="text-sm font-medium">فيسبوك</span>
                  </a>
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm font-medium">إنستغرام</span>
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">أسئلة شائعة</h3>
                    <p className="text-sm text-slate-500">اجابات على استفساراتك</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    "كيف أطلب منتج؟",
                    "ما هي طرق الدفع؟",
                    "كم مدة التوصيل؟",
                    "هل يمكنني الإرجاع؟",
                  ].map((q, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 py-2 border-b border-slate-50 last:border-0">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
