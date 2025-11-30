// شهرها و ولسوالی های افغانستان
const afghanistanCities = {
    "kabul": {
        name: "کابل",
        districts: ["دشت برچی", "پغمان", "چهار آسیاب", "ده سبز", "قره باغ", "میر Bacha Kot", "موسهی", "استالف", "کلکان", "بگرامی", "سروبی", "شکردره", "خیرخانه", "علی آباد", "پل چرخی", "فرزه", "قاضی آباد", "ایبک", "میدان شهر", "شهرستان"]
    },
    "kandahar": {
        name: "قندهار", 
        districts: ["دند", "ارغستان", "ارغنداب", "شاه ولی کوت", "پنجوائی", "زاری", "میانشین", "خاکریز", "نیش", "مایان", "چپرهار", "گیزاب", "سپین بولدک", "ماروف", "ریگستان", "شورابک", "آرغسان"]
    },
    "herat": {
        name: "هرات",
        districts: ["انجیل", "گوهران", "گذره", "کرخ", "کوشک", "کوشک کهنه", "گذره", "زنده جان", "پشتون زرغون", "فارسی", "شین دند", "اوبه", "غوریان", "چشت شریف", "کوهسان", "اوجله باغ"]
    },
    "balkh": {
        name: "بلخ",
        districts: ["مزارشریف", "دولت آباد", "چاربولک", "چمتال", "خلم", "کشنده", "مارمل", "نهر شاهی", "شبرغان", "آقچه", "بالا حصار", "زاری", "Shortepa"]
    },
    "nangarhar": {
        name: "ننگرهار",
        districts: ["جلال آباد", "دره نور", "حصارک", "بهمن", "کاما", "کوز کونر", "لالپور", "مومندره", "پچیر اوغام", "رودات", "شیرزاد", "سورخ رود", "شینوار", "کوت", " Nazyan", "Achin"]
    },
    "kunduz": {
        name: "کندز",
        districts: ["کندز", "علی آباد", "چاه دروزه", "امام صاحب", "خان آباد", "قلعه زال", "داشت آرچی", "Archi"]
    },
    "baghlan": {
        name: "بغلان",
        districts: ["پل خمری", "بغلان", "دوشی", "دهلک", "خنجان", "نهرین"]
    },
    "helmand": {
        name: "هلمند",
        districts: ["لشکرگاه", "گرمسیر", "نوزاد", "ناهور", " Musa Qala", "Kajaki", "Baghrin", "Dishu", "Nawa-I-Barakzayi"]
    }
    // سایر ولایات...
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