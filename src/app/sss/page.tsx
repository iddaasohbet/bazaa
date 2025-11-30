"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function SSS() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  const categories = [
    "همه",
    "حساب کاربری",
    "آگهی دادن",
    "پرداخت",
    "امنیت",
    "مغازه",
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "چگونه می‌توانم ثبت نام کنم؟",
      answer: "برای ثبت نام، روی دکمه 'ورود/ثبت نام' در بالای صفحه کلیک کنید. نام، ایمیل و شماره تلفن خود را وارد کنید. یک کد تایید به شماره شما ارسال می‌شود که باید وارد کنید. پس از تایید، حساب شما ایجاد می‌شود.",
      category: "حساب کاربری",
    },
    {
      id: 2,
      question: "آیا ثبت نام و استفاده از سایت رایگان است؟",
      answer: "بله، ثبت نام و استفاده اساسی از پلتفرم کاملاً رایگان است. شما می‌توانید آگهی‌های رایگان ثبت کنید. برای ویژگی‌های پیشرفته مانند آگهی‌های ویژه یا افتتاح مغازه، پکت‌های پولی در دسترس هستند.",
      category: "حساب کاربری",
    },
    {
      id: 3,
      question: "چگونه می‌توانم آگهی ثبت کنم؟",
      answer: "پس از ورود به حساب خود، روی 'آگهی دادن' کلیک کنید. دسته بندی مناسب را انتخاب کنید، اطلاعات محصول یا خدمات خود را وارد کنید، عکس‌ها را آپلود کنید و قیمت را مشخص کنید. پس از بررسی، روی 'ثبت آگهی' کلیک کنید.",
      category: "آگهی دادن",
    },
    {
      id: 4,
      question: "چند عکس می‌توانم در آگهی خود آپلود کنم؟",
      answer: "شما می‌توانید تا ۸ عکس برای هر آگهی آپلود کنید. توصیه می‌کنیم از تصاویر واضح و با کیفیت بالا استفاده کنید تا شانس فروش شما بیشتر شود.",
      category: "آگهی دادن",
    },
    {
      id: 5,
      question: "چقدر طول می‌کشد تا آگهی من تایید شود؟",
      answer: "معمولاً آگهی‌ها ظرف ۲۴ ساعت بررسی و تایید می‌شوند. اگر آگهی شما با استانداردهای ما مطابقت داشته باشد، زودتر تایید خواهد شد.",
      category: "آگهی دادن",
    },
    {
      id: 6,
      question: "روش‌های پرداخت چیست؟",
      answer: "ما روش‌های مختلف پرداخت را قبول می‌کنیم از جمله کارت‌های بانکی افغانستان، پرداخت آنلاین و در برخی موارد پرداخت نقدی. تمام تراکنش‌ها ایمن و رمزگذاری شده هستند.",
      category: "پرداخت",
    },
    {
      id: 7,
      question: "آیا می‌توانم بازپرداخت دریافت کنم؟",
      answer: "بله، اگر به هر دلیلی با خدمات راضی نیستید، می‌توانید ظرف ۷ روز درخواست بازپرداخت دهید. بازپرداخت‌ها معمولاً ظرف ۵-۱۰ روز کاری پردازش می‌شوند.",
      category: "پرداخت",
    },
    {
      id: 8,
      question: "چگونه از کلاهبرداری جلوگیری کنم؟",
      answer: "همیشه در مکان‌های عمومی با فروشنده ملاقات کنید. هرگز پیش از دیدن محصول پرداخت نکنید. از روش‌های پرداخت ایمن استفاده کنید. به آگهی‌هایی که قیمت‌های خیلی پایین دارند مشکوک باشید. به هر فعالیت مشکوک گزارش دهید.",
      category: "امنیت",
    },
    {
      id: 9,
      question: "اطلاعات شخصی من چقدر ایمن است؟",
      answer: "ما امنیت اطلاعات شما را بسیار جدی می‌گیریم. تمام داده‌ها رمزگذاری شده و در سرورهای امن ذخیره می‌شوند. ما هرگز اطلاعات شخصی شما را بدون رضایت شما به اشتراک نمی‌گذاریم.",
      category: "امنیت",
    },
    {
      id: 10,
      question: "مغازه چیست و چگونه می‌توانم یکی افتتاح کنم؟",
      answer: "مغازه یک ویژگی حرفه‌ای است که به شما اجازه می‌دهد یک صفحه اختصاصی برای کسب و کار خود داشته باشید. شما می‌توانید آگهی‌های نامحدود، لوگوی سفارشی و صفحه برند داشته باشید. برای افتتاح مغازه، به بخش 'مغازه افتتاح کنید' بروید و یک پکت انتخاب کنید.",
      category: "مغازه",
    },
    {
      id: 11,
      question: "تفاوت بین پکت‌های مغازه چیست؟",
      answer: "ما سه پکت داریم: پایه (۱ماه - ۱۰ آگهی)، پرو (۳ماه - ۵۰ آگهی، ۲۵٪ نمایش بیشتر) و الیت (۶ماه - آگهی نامحدود، ۱۰۰٪ نمایش بیشتر، پشتیبانی اولویت‌دار). پکت‌های بالاتر دید و ویژگی‌های بیشتری دارند.",
      category: "مغازه",
    },
    {
      id: 12,
      question: "چگونه می‌توانم آگهی خود را ویرایش یا حذف کنم؟",
      answer: "به پنل کاربری خود بروید، 'آگهی‌های من' را انتخاب کنید. آگهی‌ای که می‌خواهید ویرایش کنید پیدا کنید و روی دکمه 'ویرایش' کلیک کنید. تغییرات را اعمال کرده و ذخیره کنید. برای حذف، روی 'حذف' کلیک کنید و تایید کنید.",
      category: "آگهی دادن",
    },
    {
      id: 13,
      question: "می‌توانم برای کاربران دیگر پیام بگذارم؟",
      answer: "بله، سیستم پیام‌رسانی ایمنی داریم. هنگامی که علاقه‌مند به یک آگهی هستید، می‌توانید روی 'پیام' کلیک کنید تا با فروشنده تماس بگیرید. اطلاعات تماس شما تا زمانی که انتخاب نکنید به اشتراک گذاشته نمی‌شود.",
      category: "امنیت",
    },
    {
      id: 14,
      question: "چگونه می‌توانم آگهی‌ها را جستجو کنم؟",
      answer: "از نوار جستجوی بالای صفحه استفاده کنید. می‌توانید بر اساس دسته بندی، محل، محدوده قیمت و کلمات کلیدی فیلتر کنید. همچنین می‌توانید نتایج را بر اساس تاریخ، قیمت یا مرتبط بودن مرتب کنید.",
      category: "حساب کاربری",
    },
    {
      id: 15,
      question: "اگر مشکلی داشته باشم چه کنم؟",
      answer: "اگر با هر مشکلی مواجه شدید، می‌توانید از طریق صفحه 'تماس با ما' با ما تماس بگیرید. تیم پشتیبانی ما ۷/۲۴ در دسترس است تا به شما کمک کند. همچنین می‌توانید به بخش راهنما مراجعه کنید یا برای ما ایمیل بفرستید.",
      category: "حساب کاربری",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "همه" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <HelpCircle className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">سوالات متداول</h1>
            <p className="text-lg text-gray-600">
              پاسخ سوالات رایج شما در اینجا است
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی سوالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-right"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <span className="text-sm text-blue-600 mt-1 inline-block">
                        {faq.category}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-400 flex-shrink-0 transition-transform ${
                        openId === faq.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {openId === faq.id && (
                    <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-right">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  متاسفانه هیچ نتیجه‌ای یافت نشد
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("همه");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">سوال شما پاسخ داده نشد؟</h2>
            <p className="text-blue-100 mb-6">
              تیم پشتیبانی ما آماده کمک به شماست
            </p>
            <a
              href="/iletisim"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              با ما تماس بگیرید
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

