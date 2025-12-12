// شهرها و ولسوالی های افغانستان
const afghanistanCities = {
    "kabul": {
        name: "کابل",
        districts: [
            "دشت برچی", "پغمان", "چهار آسیاب", "ده سبز", "قره باغ", 
            "میر bacha kot", "موسهی", "استالف", "کلکان", "بگرامی", 
            "سروبی", "شکردره", "خیرخانه", "علی آباد", "پل چرخی", 
            "فرزه", "قاضی آباد", "ایبک", "میدان شهر", "شار نو"
        ]
    },
    "kandahar": {
        name: "قندهار", 
        districts: [
            "دند", "ارغستان", "ارغنداب", "شاه ولی کوت", "پنجوائی", 
            "زاری", "میانشین", "خاکریز", "نیش", "مایان", 
            "چپرهار", "گیزاب", "سپین بولدک", "ماروف", "ریگستان", 
            "شورابک", "آرغسان", "قلعه خاص", "تخته پل"
        ]
    },
    "herat": {
        name: "هرات",
        districts: [
            "انجیل", "گوهران", "گذره", "کرخ", "کوشک", 
            "کوشک کهنه", "زنده جان", "پشتون زرغون", "فارسی", 
            "شین دند", "اوبه", "غوریان", "چشت شریف", "کوهسان", 
            "اوجله باغ", "پشتون کوته", "رباط پریانی"
        ]
    },
    "balkh": {
        name: "بلخ",
        districts: [
            "مزارشریف", "دولت آباد", "چاربولک", "چمتال", "خلم", 
            "کشنده", "مارمل", "نهر شاهی", "شبرغان", "آقچه", 
            "بالا حصار", "زاری", "دهدادی", "شیبرغان"
        ]
    },
    "nangarhar": {
        name: "ننگرهار",
        districts: [
            "جلال آباد", "دره نور", "حصارک", "بهمن", "کاما", 
            "کوز کونر", "لالپور", "مومندره", "پچیر اوغام", 
            "رودات", "شیرزاد", "سورخ رود", "شینوار", "کوت", 
            "نازيان", "اچین", "بتی کوت", "حصارک"
        ]
    },
    "kunduz": {
        name: "کندز",
        districts: [
            "کندز", "علی آباد", "چاه دروزه", "امام صاحب", 
            "خان آباد", "قلعه زال", "داشت آرچی", "قلعه تپه", "آق تپه"
        ]
    },
    "baghlan": {
        name: "بغلان",
        districts: [
            "پل خمری", "بغلان", "دوشی", "دهلک", "خنجان", 
            "نهرین", "تاله و برفک", "خینجان", "اندراب"
        ]
    },
    "helmand": {
        name: "هلمند",
        districts: [
            "لشکرگاه", "گرمسیر", "نوزاد", "ناهور", "Musa Qala", 
            "Kajaki", "Baghrin", "Dishu", "Sangin", "Nad Ali"
        ]
    },
    "khost": {
        name: "خوست",
        districts: [
            "خوست", "تانی", "باک", "مندوزی", "Musa Khel", 
            "Nadir Shah Kot", "Qalandar", "Sabari", "Spera", "Mandozai"
        ]
    },
    "paktya": {
        name: "پکتیا",
        districts: [
            "گردیز", "Ahmadabad", "Chamkani", "Dand Wa Patan", 
            "Jaji", "Jani Khel", "Laja Ahmad Khel", "Sayed Karam", 
            "Zadran", "Zormat", "Shwak"
        ]
    },
    "badakhshan": {
        name: "بدخشان",
        districts: [
            "فیض آباد", "بحارک", "ارگو", "اشکاشم", "بهارک", 
            "درایم", "فیض آباد", "شغنان", "شهدا", "تگاب", 
            "تیشکان", "واخان", "وردوج", "یفتل سفلی", "یمگان", 
            "خاش", "کوف آب", "کستان", "مایمی", "نسی"
        ]
    },
    "badghis": {
        name: "بادغیس",
        districts: [
            "قلعه نو", "آب کمری", "غورماچ", "جویان", "مورچاق", 
            "مقور", "قلعه زال", "بالا مرغاب"
        ]
    },
    "bamyan": {
        name: "بامیان",
        districts: [
            "بامیان", "کهمرد", "پنجاب", "شیبر", "ورس", 
            "یکاولنگ", "سیغان", "شیبر"
        ]
    },
    "daykundi": {
        name: "دایکندی",
        districts: [
            "نیلی", "اشترلی", "خدیر", "کیتی", "میرامور", 
            "کجران", "شهرستان", "پتو"
        ]
    },
    "farah": {
        name: "فراه",
        districts: [
            "فراه", "انار دره", "بکواه", "بالا بلوک", "پشت کوه", 
            "قلعه کاه", "لاش و جوین", "پورچمن", "شیب کوه"
        ]
    },
    "faryab": {
        name: "فاریاب",
        districts: [
            "میمنه", "المار", "اندخوی", "بلچراغ", "دولت آباد", 
            "غورماچ", "خان چارباغ", "قیسار", "پشتون کوت", 
            "قرغان", "شیرین تگاب"
        ]
    },
    "ghazni": {
        name: "غزنی",
        districts: [
            "غزنی", "آب بند", "اجرستان", "اندار", "ده یک", 
            "گیلان", "جغتو", "خواجه عمری", "مالستان", "ناور", 
            "وقز", "زرغون شهر", "رشیدان", "قره باغ"
        ]
    },
    "ghor": {
        name: "غور",
        districts: [
            "چغچران", "شهرک", "دولت یار", "du layna", "پسابند", 
            "ساغر", "تایواره", "تولک", "لعل و سرجنگل"
        ]
    },
    "jowzjan": {
        name: "جوزجان",
        districts: [
            "شبرغان", "آقچه", "درزاب", "فیض آباد", "خماب", 
            "خانقاه", "خواجه دوکوه", "مردیان", "مینجک"
        ]
    },
    "kapisa": {
        name: "کاپیسا",
        districts: [
            "محمود راقی", "السی", "حصارک", "کوه بند", "کوهستان", 
            "نجراب", "تگاب"
        ]
    },
    "kunar": {
        name: "کنر",
        districts: [
            "اسدآباد", "برکون", "چپه دره", "دانگام", "دره پیچ", 
            "غازی آباد", "کامه", "مروچ", "ناری", "نورگل", 
            "شیگل و شلتان", "سرکانی", "اسمار"
        ]
    },
    "laghman": {
        name: "لغمان",
        districts: [
            "مهترلام", "علینگار", "دولتشاه", "قرغه یی", "الیشنگ"
        ]
    },
    "logar": {
        name: "لوگر",
        districts: [
            "پل علم", "عزیر", "برکی برک", "چرخ", "خروار", 
            "خوشی", "محمد آغه", "خواجه عمری"
        ]
    },
    "nimruz": {
        name: "نیمروز",
        districts: [
            "زرنج", "چار بورجک", "چخانسور", "کانگر", "خاش رود"
        ]
    },
    "nuristan": {
        name: "نورستان",
        districts: [
            "پارون", "برگ متال", "دو آب", "کامدیش", "مندول", 
            "نورگرام", "واما", "وایگل"
        ]
    },
    "paktika": {
        name: "پکتیکا",
        districts: [
            "شرن", "اورگون", "زرغون شهر", "یوسف خیل", "گیان", 
            "مته خان", "نیکه", "اومنه", "سروبی", "تری"
        ]
    },
    "panjshir": {
        name: "پنجشیر",
        districts: [
            "بازارک", "انابه", "دره", "خنج", "پریان", "روخه", "شوتل"
        ]
    },
    "parwan": {
        name: "پروان",
        districts: [
            "چاریکار", "بگرام", "جبل السراج", "سیاه گرد", "شक्तان", 
            "سلمان", "کوه صافی", "سالنگ"
        ]
    },
    "samangan": {
        name: "سمنگان",
        districts: [
            "ایبک", "حضرت سلطان", "خرم و سارباغ", "روی دو آب", "فیروز نخچیر"
        ]
    },
    "sar-e-pol": {
        name: "سرپل",
        districts: [
            "سرپل", "بلخاب", "گوسفندی", "کوهستانات", "سنگ چرق", 
            "صیاد", "سوزمه قلعه"
        ]
    },
    "takhar": {
        name: "تخار",
        districts: [
            "تالقان", "بنگی", "درقد", "چال", "فرخار", "هزارسم", 
            "ایشکمش", "کلفگان", "رستاق", "ورسج", "بهارک", "نمک آب"
        ]
    },
    "urozgan": {
        name: "ارزگان",
        districts: [
            "ترین کوت", "چوره", "دهراود", "خاس", "شهرستان", "کجکی"
        ]
    },
    "wardak": {
        name: "وردک",
        districts: [
            "میدان شهر", "جغتو", "حصار", "دوله سلام", "مرکز بهسود", 
            "نرخ", "چک"
        ]
    },
    "zabul": {
        name: "زابل",
        districts: [
            "قلات", "ارغنداب", "اطغان", "شامولزایی", "شینکی", 
            "تarnak و جلدک", "میزان"
        ]
    }
};

// بارگذاری شهرها در dropdown
function loadCities(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">ولایت انتخاب کنید</option>';
    
    Object.keys(afghanistanCities).forEach(cityId => {
        const option = document.createElement('option');
        option.value = cityId;
        option.textContent = afghanistanCities[cityId].name;
        select.appendChild(option);
    });
}

// بارگذاری ولسوالی ها
function loadDistricts(cityId, districtSelectId) {
    const districtSelect = document.getElementById(districtSelectId);
    if (!districtSelect) return;
    
    districtSelect.innerHTML = '<option value="">اول ولایت انتخاب کنید</option>';
    
    if (cityId && afghanistanCities[cityId]) {
        districtSelect.disabled = false;
        afghanistanCities[cityId].districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    } else {
        districtSelect.disabled = true;
    }
}

// گرفتن نام شهر بر اساس ID
function getCityName(cityId) {
    return afghanistanCities[cityId] ? afghanistanCities[cityId].name : 'نامشخص';
}