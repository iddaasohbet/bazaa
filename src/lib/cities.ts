// شهرها و ولسوالی های افغانستان
export interface City {
  name: string;
  districts: string[];
}

export const afghanistanCities: Record<string, City> = {
  kabul: {
    name: "کابل",
    districts: [
      "دشت برچی",
      "پغمان",
      "چهار آسیاب",
      "ده سبز",
      "قره باغ",
      "موسهی",
      "استالف",
      "کلکان",
      "بگرامی",
      "سروبی",
      "شکردره",
      "خیرخانه",
      "علی آباد",
      "پل چرخی",
      "قاضی آباد",
      "میدان شهر",
      "شهرستان"
    ]
  },
  kandahar: {
    name: "قندهار",
    districts: [
      "دند",
      "ارغستان",
      "ارغنداب",
      "شاه ولی کوت",
      "پنجوائی",
      "زاری",
      "میانشین",
      "خاکریز",
      "نیش",
      "مایان",
      "گیزاب",
      "سپین بولدک",
      "ماروف",
      "ریگستان",
      "شورابک"
    ]
  },
  herat: {
    name: "هرات",
    districts: [
      "انجیل",
      "گوهران",
      "گذره",
      "کرخ",
      "کوشک",
      "کوشک کهنه",
      "زنده جان",
      "پشتون زرغون",
      "فارسی",
      "شین دند",
      "اوبه",
      "غوریان",
      "چشت شریف",
      "کوهسان"
    ]
  },
  balkh: {
    name: "بلخ",
    districts: [
      "مزارشریف",
      "دولت آباد",
      "چاربولک",
      "چمتال",
      "خلم",
      "کشنده",
      "مارمل",
      "نهر شاهی",
      "شبرغان",
      "آقچه",
      "بالا حصار",
      "زاری"
    ]
  },
  nangarhar: {
    name: "ننگرهار",
    districts: [
      "جلال آباد",
      "دره نور",
      "حصارک",
      "بهمن",
      "کاما",
      "کوز کونر",
      "لالپور",
      "مومندره",
      "رودات",
      "شیرزاد",
      "سورخ رود",
      "شینوار",
      "کوت"
    ]
  },
  kunduz: {
    name: "کندز",
    districts: [
      "کندز",
      "علی آباد",
      "چاه دروزه",
      "امام صاحب",
      "خان آباد",
      "قلعه زال",
      "داشت آرچی"
    ]
  },
  baghlan: {
    name: "بغلان",
    districts: [
      "پل خمری",
      "بغلان",
      "دوشی",
      "دهلک",
      "خنجان",
      "نهرین"
    ]
  },
  helmand: {
    name: "هلمند",
    districts: [
      "لشکرگاه",
      "گرمسیر",
      "نوزاد",
      "ناهور",
      "موسی قلعه",
      "کجکی",
      "نوه باراکزئی"
    ]
  }
};

// شهر ID از نام گرفتن
export function getCityIdByName(name: string): string | null {
  const entry = Object.entries(afghanistanCities).find(([_, city]) => city.name === name);
  return entry ? entry[0] : null;
}

// نام شهر از ID گرفتن
export function getCityName(cityId: string): string {
  return afghanistanCities[cityId]?.name || 'نامشخص';
}

// لیست شهرها برای dropdown
export function getCitiesList(): Array<{ id: string; name: string }> {
  return Object.entries(afghanistanCities).map(([id, city]) => ({
    id,
    name: city.name
  }));
}

// لیست ولسوالی ها برای یک شهر
export function getDistrictsList(cityId: string): string[] {
  return afghanistanCities[cityId]?.districts || [];
}

