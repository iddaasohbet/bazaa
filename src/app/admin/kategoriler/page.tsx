"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Grid,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Package,
  List,
  ChevronDown,
  ChevronRight,
  Car,
  Home,
  Laptop,
  Smartphone,
  Shirt,
  Sofa,
  Tv,
  Watch,
  BookOpen,
  Briefcase,
  ShoppingCart,
  Users,
  Heart,
  Star,
  Music,
  Camera,
  Bike,
  Baby,
  Dog,
  Wrench,
  Paintbrush,
  Trophy,
  Gamepad2,
  Bed,
  UtensilsCrossed,
  LucideIcon,
  // Yeni ikonlar - 50+
  Coffee,
  Pizza,
  Apple,
  Banana,
  Beef,
  Flower2,
  Trees,
  Hammer,
  Drill,
  Scissors,
  Brush,
  Palette,
  Pencil,
  Pen,
  Ruler,
  Calculator,
  Glasses,
  Headphones,
  Speaker,
  Mic,
  Guitar,
  Piano,
  Drum,
  Bell,
  Gift,
  Cake,
  PartyPopper,
  Sparkles,
  Zap,
  Flame,
  Droplet,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Snowflake,
  Wind,
  Leaf,
  Sprout,
  TreePine,
  Mountain,
  Waves,
  Fish,
  Bird,
  Cat,
  Rabbit,
  Turtle,
  Bug,
  Footprints,
  Paw,
  Bone,
  Pill,
  Stethoscope,
  Syringe,
  Bandage,
  HeartPulse,
  Activity,
  Dumbbell,
  Bike as Bicycle,
  Plane,
  Train,
  Bus,
  Truck,
  Ship,
  Rocket,
  Fuel,
  Luggage,
  MapPin,
  Compass,
  Map,
  Globe,
  Building,
  Building2,
  Store as Shop,
  Warehouse,
  Factory,
  Church,
  School,
  GraduationCap,
  BookMarked,
  Newspaper,
  FileText,
  FolderOpen,
  Archive,
  Inbox,
  Mail,
  Phone,
  MessageCircle,
  Video,
  Image,
  Film,
  Monitor,
  Tablet,
  HardDrive,
  Cpu,
  MemoryStick,
  Battery,
  BatteryCharging,
  Plug,
  Lightbulb,
  Lamp,
  Fan,
  AirVent,
  Refrigerator,
  Microwave,
  WashingMachine,
  Shirt as TShirt,
  Crown,
  Diamond,
  Gem,
  Key,
  Lock,
  Unlock,
  Shield,
  Award,
  Medal,
  Target,
  Flag,
  Bookmark,
  Tag,
  Tags,
  DollarSign,
  CreditCard,
  Wallet,
  Banknote,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  CandlestickChart,
  CircleDollarSign,
  Receipt,
  ShoppingBag,
  Shirt as Clothes,
  Scissors as Cut,
  Brush as Paint,
  Palette as Colors
} from "lucide-react";

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  aciklama?: string;
  ikon: string;
  sira: number;
  aktif: boolean;
  ilan_sayisi?: number;
}

interface AltKategori {
  id: number;
  kategori_id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
  aciklama?: string;
  sira: number;
  aktif: boolean;
  ilan_sayisi?: number;
}

// Icon listesi - 80+ ikon!
const AVAILABLE_ICONS: { name: string; icon: LucideIcon; label: string }[] = [
  // Araçlar & Ulaşım
  { name: 'car', icon: Car, label: 'خودرو' },
  { name: 'bike', icon: Bike, label: 'دوچرخه' },
  { name: 'bicycle', icon: Bicycle, label: 'موتور' },
  { name: 'plane', icon: Plane, label: 'هواپیما' },
  { name: 'train', icon: Train, label: 'قطار' },
  { name: 'bus', icon: Bus, label: 'اتوبوس' },
  { name: 'truck', icon: Truck, label: 'کامیون' },
  { name: 'ship', icon: Ship, label: 'کشتی' },
  { name: 'rocket', icon: Rocket, label: 'موشک' },
  
  // Emlak & Binalar
  { name: 'home', icon: Home, label: 'خانه' },
  { name: 'building', icon: Building, label: 'ساختمان' },
  { name: 'building2', icon: Building2, label: 'آپارتمان' },
  { name: 'shop', icon: Shop, label: 'مغازه' },
  { name: 'warehouse', icon: Warehouse, label: 'انبار' },
  { name: 'factory', icon: Factory, label: 'کارخانه' },
  { name: 'church', icon: Church, label: 'مسجد' },
  { name: 'school', icon: School, label: 'مدرسه' },
  
  // Elektronik
  { name: 'laptop', icon: Laptop, label: 'لپ‌تاپ' },
  { name: 'smartphone', icon: Smartphone, label: 'موبایل' },
  { name: 'tv', icon: Tv, label: 'تلویزیون' },
  { name: 'monitor', icon: Monitor, label: 'مانیتور' },
  { name: 'tablet', icon: Tablet, label: 'تبلت' },
  { name: 'camera', icon: Camera, label: 'دوربین' },
  { name: 'headphones', icon: Headphones, label: 'هدفون' },
  { name: 'speaker', icon: Speaker, label: 'بلندگو' },
  { name: 'mic', icon: Mic, label: 'میکروفون' },
  { name: 'watch', icon: Watch, label: 'ساعت هوشمند' },
  { name: 'harddrive', icon: HardDrive, label: 'هارد' },
  { name: 'cpu', icon: Cpu, label: 'پردازنده' },
  { name: 'memory', icon: MemoryStick, label: 'رم' },
  { name: 'battery', icon: Battery, label: 'باتری' },
  { name: 'plug', icon: Plug, label: 'شارژر' },
  
  // Ev Eşyaları
  { name: 'sofa', icon: Sofa, label: 'مبل' },
  { name: 'bed', icon: Bed, label: 'تخت' },
  { name: 'refrigerator', icon: Refrigerator, label: 'یخچال' },
  { name: 'microwave', icon: Microwave, label: 'مایکروویو' },
  { name: 'washingmachine', icon: WashingMachine, label: 'ماشین لباسشویی' },
  { name: 'lamp', icon: Lamp, label: 'لامپ' },
  { name: 'lightbulb', icon: Lightbulb, label: 'چراغ' },
  { name: 'fan', icon: Fan, label: 'پنکه' },
  { name: 'airvent', icon: AirVent, label: 'کولر' },
  
  // Giyim & Aksesuar
  { name: 'shirt', icon: Shirt, label: 'لباس' },
  { name: 'tshirt', icon: TShirt, label: 'تی‌شرت' },
  { name: 'clothes', icon: Clothes, label: 'پوشاک' },
  { name: 'crown', icon: Crown, label: 'تاج' },
  { name: 'diamond', icon: Diamond, label: 'الماس' },
  { name: 'gem', icon: Gem, label: 'جواهر' },
  
  // Eğitim & Kırtasiye
  { name: 'book', icon: BookOpen, label: 'کتاب' },
  { name: 'bookmarked', icon: BookMarked, label: 'کتاب نشان' },
  { name: 'graduation', icon: GraduationCap, label: 'تحصیلات' },
  { name: 'pencil', icon: Pencil, label: 'مداد' },
  { name: 'pen', icon: Pen, label: 'خودکار' },
  { name: 'ruler', icon: Ruler, label: 'خط‌کش' },
  { name: 'calculator', icon: Calculator, label: 'ماشین حساب' },
  { name: 'newspaper', icon: Newspaper, label: 'روزنامه' },
  
  // İş & Finans
  { name: 'briefcase', icon: Briefcase, label: 'کیف کار' },
  { name: 'dollar', icon: DollarSign, label: 'دلار' },
  { name: 'circledollar', icon: CircleDollarSign, label: 'پول' },
  { name: 'creditcard', icon: CreditCard, label: 'کارت' },
  { name: 'wallet', icon: Wallet, label: 'کیف پول' },
  { name: 'banknote', icon: Banknote, label: 'اسکناس' },
  { name: 'receipt', icon: Receipt, label: 'رسید' },
  { name: 'barchart', icon: BarChart3, label: 'نمودار' },
  { name: 'piechart', icon: PieChart, label: 'نمودار دایره' },
  { name: 'candlestick', icon: CandlestickChart, label: 'بورس' },
  { name: 'trendingup', icon: TrendingUp, label: 'رشد' },
  { name: 'trendingdown', icon: TrendingDown, label: 'کاهش' },
  
  // Alışveriş
  { name: 'cart', icon: ShoppingCart, label: 'سبد خرید' },
  { name: 'shoppingbag', icon: ShoppingBag, label: 'کیسه خرید' },
  { name: 'package', icon: Package, label: 'بسته' },
  { name: 'gift', icon: Gift, label: 'هدیه' },
  { name: 'tag', icon: Tag, label: 'برچسب' },
  { name: 'tags', icon: Tags, label: 'برچسب‌ها' },
  { name: 'bookmark', icon: Bookmark, label: 'نشان' },
  
  // Spor & Sağlık
  { name: 'dumbbell', icon: Dumbbell, label: 'دمبل' },
  { name: 'activity', icon: Activity, label: 'فعالیت' },
  { name: 'heartpulse', icon: HeartPulse, label: 'ضربان قلب' },
  { name: 'pill', icon: Pill, label: 'قرص' },
  { name: 'stethoscope', icon: Stethoscope, label: 'گوشی پزشکی' },
  { name: 'syringe', icon: Syringe, label: 'سرنگ' },
  { name: 'bandage', icon: Bandage, label: 'باند' },
  { name: 'trophy', icon: Trophy, label: 'جام' },
  { name: 'medal', icon: Medal, label: 'مدال' },
  { name: 'award', icon: Award, label: 'جایزه' },
  { name: 'target', icon: Target, label: 'هدف' },
  
  // Hobiler & Eğlence
  { name: 'game', icon: Gamepad2, label: 'بازی' },
  { name: 'music', icon: Music, label: 'موسیقی' },
  { name: 'guitar', icon: Guitar, label: 'گیتار' },
  { name: 'piano', icon: Piano, label: 'پیانو' },
  { name: 'drum', icon: Drum, label: 'طبل' },
  { name: 'film', icon: Film, label: 'فیلم' },
  { name: 'video', icon: Video, label: 'ویدیو' },
  { name: 'image', icon: Image, label: 'تصویر' },
  { name: 'paint', icon: Paintbrush, label: 'نقاشی' },
  { name: 'palette', icon: Palette, label: 'پالت' },
  { name: 'brush', icon: Brush, label: 'قلم‌مو' },
  { name: 'colors', icon: Colors, label: 'رنگ‌ها' },
  
  // Hayvanlar
  { name: 'dog', icon: Dog, label: 'سگ' },
  { name: 'cat', icon: Cat, label: 'گربه' },
  { name: 'rabbit', icon: Rabbit, label: 'خرگوش' },
  { name: 'bird', icon: Bird, label: 'پرنده' },
  { name: 'fish', icon: Fish, label: 'ماهی' },
  { name: 'turtle', icon: Turtle, label: 'لاک‌پشت' },
  { name: 'bug', icon: Bug, label: 'حشره' },
  { name: 'paw', icon: Paw, label: 'پنجه' },
  { name: 'bone', icon: Bone, label: 'استخوان' },
  
  // Yiyecek & İçecek
  { name: 'food', icon: UtensilsCrossed, label: 'غذا' },
  { name: 'coffee', icon: Coffee, label: 'قهوه' },
  { name: 'pizza', icon: Pizza, label: 'پیتزا' },
  { name: 'apple', icon: Apple, label: 'سیب' },
  { name: 'banana', icon: Banana, label: 'موز' },
  { name: 'beef', icon: Beef, label: 'گوشت' },
  { name: 'cake', icon: Cake, label: 'کیک' },
  
  // Doğa & Hava
  { name: 'flower', icon: Flower2, label: 'گل' },
  { name: 'trees', icon: Trees, label: 'درخت‌ها' },
  { name: 'treepine', icon: TreePine, label: 'کاج' },
  { name: 'leaf', icon: Leaf, label: 'برگ' },
  { name: 'sprout', icon: Sprout, label: 'جوانه' },
  { name: 'mountain', icon: Mountain, label: 'کوه' },
  { name: 'waves', icon: Waves, label: 'امواج' },
  { name: 'sun', icon: Sun, label: 'خورشید' },
  { name: 'moon', icon: Moon, label: 'ماه' },
  { name: 'cloud', icon: Cloud, label: 'ابر' },
  { name: 'umbrella', icon: Umbrella, label: 'چتر' },
  { name: 'snowflake', icon: Snowflake, label: 'برف' },
  { name: 'wind', icon: Wind, label: 'باد' },
  { name: 'droplet', icon: Droplet, label: 'قطره' },
  { name: 'flame', icon: Flame, label: 'آتش' },
  { name: 'zap', icon: Zap, label: 'برق' },
  { name: 'sparkles', icon: Sparkles, label: 'جرقه' },
  
  // Aletler & Tamir
  { name: 'wrench', icon: Wrench, label: 'آچار' },
  { name: 'hammer', icon: Hammer, label: 'چکش' },
  { name: 'drill', icon: Drill, label: 'مته' },
  { name: 'scissors', icon: Scissors, label: 'قیچی' },
  { name: 'cut', icon: Cut, label: 'برش' },
  
  // Ofis & Dosyalar
  { name: 'filetext', icon: FileText, label: 'فایل' },
  { name: 'folder', icon: FolderOpen, label: 'پوشه' },
  { name: 'archive', icon: Archive, label: 'آرشیو' },
  { name: 'inbox', icon: Inbox, label: 'صندوق' },
  { name: 'mail', icon: Mail, label: 'ایمیل' },
  { name: 'phone', icon: Phone, label: 'تلفن' },
  { name: 'message', icon: MessageCircle, label: 'پیام' },
  
  // Güvenlik & Değerli Eşya
  { name: 'key', icon: Key, label: 'کلید' },
  { name: 'lock', icon: Lock, label: 'قفل' },
  { name: 'unlock', icon: Unlock, label: 'باز' },
  { name: 'shield', icon: Shield, label: 'سپر' },
  { name: 'crown', icon: Crown, label: 'تاج' },
  { name: 'diamond', icon: Diamond, label: 'الماس' },
  { name: 'gem', icon: Gem, label: 'جواهر' },
  
  // Eğlence
  { name: 'star', icon: Star, label: 'ستاره' },
  { name: 'heart', icon: Heart, label: 'قلب' },
  { name: 'party', icon: PartyPopper, label: 'جشن' },
  { name: 'bell', icon: Bell, label: 'زنگ' },
  { name: 'flag', icon: Flag, label: 'پرچم' },
  
  // Diğer
  { name: 'users', icon: Users, label: 'کاربران' },
  { name: 'baby', icon: Baby, label: 'کودک' },
  { name: 'footprints', icon: Footprints, label: 'ردپا' },
  { name: 'glasses', icon: Glasses, label: 'عینک' },
  { name: 'compass', icon: Compass, label: 'قطب‌نما' },
  { name: 'map', icon: Map, label: 'نقشه' },
  { name: 'mappin', icon: MapPin, label: 'مکان' },
  { name: 'globe', icon: Globe, label: 'کره زمین' },
  { name: 'luggage', icon: Luggage, label: 'چمدان' },
  { name: 'fuel', icon: Fuel, label: 'سوخت' },
  { name: 'grid', icon: Grid, label: 'عمومی' }
];

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<{ [key: number]: AltKategori[] }>({});
  const [expandedKategori, setExpandedKategori] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Alt kategori modal
  const [showAltKategoriModal, setShowAltKategoriModal] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [editingAltKategoriId, setEditingAltKategoriId] = useState<number | null>(null);
  
  // Icon picker modal
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    ad: "",
    ad_dari: "",
    slug: "",
    aciklama: "",
    ikon: "grid",
    aktif: true
  });

  const [altKategoriFormData, setAltKategoriFormData] = useState({
    ad: "",
    ad_dari: "",
    slug: "",
    aciklama: "",
    aktif: true
  });

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const fetchKategoriler = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/kategoriler');
      const data = await response.json();
      
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAltKategoriler = async (kategoriId: number) => {
    try {
      const response = await fetch(`/api/alt-kategoriler?kategori_id=${kategoriId}`);
      const data = await response.json();
      
      if (data.success) {
        setAltKategoriler(prev => ({
          ...prev,
          [kategoriId]: data.data
        }));
      }
    } catch (error) {
      console.error('Alt kategoriler yüklenemedi:', error);
    }
  };

  const toggleKategori = (kategoriId: number) => {
    if (expandedKategori === kategoriId) {
      setExpandedKategori(null);
    } else {
      setExpandedKategori(kategoriId);
      if (!altKategoriler[kategoriId]) {
        fetchAltKategoriler(kategoriId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // İsim kontrolü
    if (!formData.ad_dari || !formData.ad_dari.trim()) {
      alert('لطفاً نام دسته‌بندی را وارد کنید');
      return;
    }
    
    // Slug otomatik oluştur
    const finalSlug = formData.slug || generateSlug(formData.ad_dari);
    
    // ad alanı boşsa ad_dari'yi kopyala
    const finalData = {
      ...formData,
      ad: formData.ad || formData.ad_dari,
      slug: finalSlug
    };

    try {
      const url = '/api/admin/kategoriler';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...finalData } : finalData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingId ? 'دسته‌بندی به‌روزرسانی شد' : 'دسته‌بندی جدید ایجاد شد');
        fetchKategoriler();
        resetForm();
      } else {
        alert(data.message || 'خطا در عملیات');
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('خطا در عملیات');
    }
  };

  const handleAltKategoriSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kategori kontrolü
    if (!selectedKategoriId) {
      alert('خطا: دسته‌بندی انتخاب نشده است');
      return;
    }
    
    // İsim kontrolü
    if (!altKategoriFormData.ad_dari || !altKategoriFormData.ad_dari.trim()) {
      alert('لطفاً نام زیر دسته را وارد کنید');
      return;
    }
    
    // Slug otomatik oluştur
    const finalSlug = altKategoriFormData.slug || generateSlug(altKategoriFormData.ad_dari);
    
    // ad alanı boşsa ad_dari'yi kopyala
    const finalData = {
      ...altKategoriFormData,
      ad: altKategoriFormData.ad || altKategoriFormData.ad_dari,
      slug: finalSlug
    };

    try {
      const url = '/api/alt-kategoriler';
      const method = editingAltKategoriId ? 'PUT' : 'POST';
      
      const body = editingAltKategoriId 
        ? { id: editingAltKategoriId, ...finalData }
        : { kategori_id: selectedKategoriId, ...finalData };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingAltKategoriId ? 'زیر دسته‌بندی به‌روزرسانی شد' : 'زیر دسته‌بندی جدید ایجاد شد');
        fetchAltKategoriler(selectedKategoriId);
        resetAltKategoriForm();
      } else {
        alert(data.message || 'خطا در عملیات');
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('خطا در عملیات');
    }
  };

  const handleEdit = (kategori: Kategori) => {
    setEditingId(kategori.id);
    setFormData({
      ad: kategori.ad,
      ad_dari: kategori.ad_dari || "",
      slug: kategori.slug,
      aciklama: kategori.aciklama || "",
      ikon: kategori.ikon,
      aktif: kategori.aktif
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    const kategori = kategoriler.find(k => k.id === id);
    if (kategori && kategori.ilan_sayisi && kategori.ilan_sayisi > 0) {
      if (!confirm(`این دسته‌بندی ${kategori.ilan_sayisi} آگهی دارد. آیا مطمئن هستید؟`)) {
        return;
      }
    } else if (!confirm('این دسته‌بندی را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/kategoriler?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('دسته‌بندی حذف شد');
        fetchKategoriler();
      } else {
        alert(data.message || 'خطا در حذف');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف');
    }
  };

  const handleDeleteAltKategori = async (id: number) => {
    if (!confirm('این زیر دسته‌بندی را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/alt-kategoriler?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('زیر دسته‌بندی حذف شد');
        if (selectedKategoriId) {
          fetchAltKategoriler(selectedKategoriId);
        }
      } else {
        alert(data.message || 'خطا در حذف');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف');
    }
  };

  const handleToggleAktif = async (id: number, aktif: boolean) => {
    try {
      const response = await fetch('/api/admin/kategoriler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, aktif: !aktif })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKategoriler();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const handleSiraChange = async (id: number, direction: 'up' | 'down') => {
    const index = kategoriler.findIndex(k => k.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === kategoriler.length - 1) return;

    const newSira = direction === 'up' ? kategoriler[index].sira - 1 : kategoriler[index].sira + 1;
    
    try {
      const response = await fetch('/api/admin/kategoriler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sira: newSira })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKategoriler();
      }
    } catch (error) {
      console.error('Sıra değiştirme hatası:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      ad: "",
      ad_dari: "",
      slug: "",
      aciklama: "",
      ikon: "grid",
      aktif: true
    });
  };

  const resetAltKategoriForm = () => {
    setEditingAltKategoriId(null);
    setShowAltKategoriModal(false);
    setAltKategoriFormData({
      ad: "",
      ad_dari: "",
      slug: "",
      aciklama: "",
      aktif: true
    });
  };

  const generateSlug = (text: string) => {
    // Dari/Farsça karakterleri Latin harflere çevir
    const persianToLatin: { [key: string]: string } = {
      'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h',
      'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh',
      'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
      'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'w', 'ه': 'h', 'ی': 'y',
      'ئ': 'y', 'ء': '', 'آ': 'a', 'أ': 'a', 'ؤ': 'o', 'إ': 'i', 'ة': 'h',
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      // Arapça sayılar
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      // Özel karakterler
      'ً': '', 'ٌ': '', 'ٍ': '', 'َ': '', 'ُ': '', 'ِ': '', 'ّ': '', 'ْ': '', 'ٰ': ''
    };

    let slug = text.toLowerCase();
    
    // Dari/Farsça karakterleri çevir
    for (const [persian, latin] of Object.entries(persianToLatin)) {
      slug = slug.replace(new RegExp(persian, 'g'), latin);
    }
    
    // Türkçe karakterleri çevir
    slug = slug
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
    
    // Temizlik
    slug = slug
      .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire
      .replace(/\s+/g, '-') // Boşlukları tire yap
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .replace(/^-+|-+$/g, ''); // Baştaki ve sondaki tireleri kaldır
    
    return slug || 'kategori-' + Date.now(); // Boşsa timestamp ekle
  };

  const handleAdDariChange = (value: string) => {
    setFormData({
      ...formData,
      ad: value, // Backend için ad alanını da doldur
      ad_dari: value,
      slug: generateSlug(value)
    });
  };

  const handleAltKategoriAdDariChange = (value: string) => {
    setAltKategoriFormData({
      ...altKategoriFormData,
      ad: value, // Backend için ad alanını da doldur
      ad_dari: value,
      slug: generateSlug(value)
    });
  };

  const openAltKategoriModal = (kategoriId: number) => {
    setSelectedKategoriId(kategoriId);
    setEditingAltKategoriId(null);
    setAltKategoriFormData({
      ad: "",
      ad_dari: "",
      slug: "",
      aciklama: "",
      aktif: true
    });
    setShowAltKategoriModal(true);
  };

  const handleEditAltKategori = (altKategori: AltKategori) => {
    setEditingAltKategoriId(altKategori.id);
    setAltKategoriFormData({
      ad: altKategori.ad,
      ad_dari: altKategori.ad_dari || "",
      slug: altKategori.slug,
      aciklama: altKategori.aciklama || "",
      aktif: altKategori.aktif
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت دسته‌بندی‌ها</h1>
            <p className="text-gray-600 mt-1">
              مجموع {kategoriler.length} دسته‌بندی
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{isAdding ? 'لغو' : 'دسته‌بندی جدید'}</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نام دسته‌بندی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ad_dari}
                    onChange={(e) => handleAdDariChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: الکترونیک، وسایط نقلیه، لوازم خانه"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug <span className="text-xs text-gray-500">(خودکار)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="otomatik oluşturulur..."
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    آیکون
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(true)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const selectedIcon = AVAILABLE_ICONS.find(i => i.name === formData.ikon);
                        const IconComponent = selectedIcon?.icon || Grid;
                        return (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{selectedIcon?.label || 'انتخاب آیکون'}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="توضیحات دسته‌بندی..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="aktif"
                  checked={formData.aktif}
                  onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="aktif" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  دسته‌بندی فعال باشد
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'به‌روزرسانی' : 'ایجاد'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Kategoriler Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : kategoriler.length === 0 ? (
            <div className="text-center py-20">
              <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">دسته‌بندی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ترتیب
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      آگهی‌ها
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kategoriler.map((kategori, index) => (
                    <>
                      <tr key={kategori.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSiraChange(kategori.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-gray-900">{kategori.sira}</span>
                            <button
                              onClick={() => handleSiraChange(kategori.id, 'down')}
                              disabled={index === kategoriler.length - 1}
                              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleKategori(kategori.id)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              {expandedKategori === kategori.id ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                              {(() => {
                                const iconData = AVAILABLE_ICONS.find(i => i.name === kategori.ikon);
                                const IconComponent = iconData?.icon || Grid;
                                return <IconComponent className="w-5 h-5 text-blue-600" />;
                              })()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{kategori.ad}</div>
                              {kategori.ad_dari && (
                                <div className="text-xs text-gray-500">{kategori.ad_dari}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded" dir="ltr">
                            {kategori.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {kategori.ilan_sayisi || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleAktif(kategori.id, kategori.aktif)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              kategori.aktif 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {kategori.aktif ? (
                              <>
                                <Eye className="w-3 h-3" />
                                فعال
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                غیرفعال
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAltKategoriModal(kategori.id)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="زیر دسته‌بندی‌ها"
                            >
                              <List className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(kategori)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="ویرایش"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(kategori.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Alt Kategoriler Satırı */}
                      {expandedKategori === kategori.id && altKategoriler[kategori.id] && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-gray-700">زیر دسته‌بندی‌ها</h4>
                                <button
                                  onClick={() => openAltKategoriModal(kategori.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                                >
                                  <Plus className="w-3 h-3" />
                                  افزودن زیر دسته
                                </button>
                              </div>
                              
                              {altKategoriler[kategori.id].length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">هیچ زیر دسته‌بندی یافت نشد</p>
                              ) : (
                                <div className="grid md:grid-cols-2 gap-2">
                                  {altKategoriler[kategori.id].map((altKat) => (
                                    <div key={altKat.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                      <div className="flex items-center gap-2">
                                        <List className="w-4 h-4 text-purple-600" />
                                        <div>
                                          <div className="text-sm font-semibold text-gray-900">{altKat.ad}</div>
                                          {altKat.ad_dari && (
                                            <div className="text-xs text-gray-500">{altKat.ad_dari}</div>
                                          )}
                                        </div>
                                        <span className="text-xs text-gray-500">({altKat.ilan_sayisi || 0})</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setSelectedKategoriId(kategori.id);
                                            handleEditAltKategori(altKat);
                                            setShowAltKategoriModal(true);
                                          }}
                                          className="p-1 text-gray-600 hover:text-blue-600"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteAltKategori(altKat.id)}
                                          className="p-1 text-gray-600 hover:text-red-600"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Alt Kategori Modal */}
      {showAltKategoriModal && selectedKategoriId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAltKategoriId ? 'ویرایش زیر دسته‌بندی' : 'زیر دسته‌بندی جدید'}
              </h2>
              <button
                onClick={resetAltKategoriForm}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAltKategoriSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام زیر دسته <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={altKategoriFormData.ad_dari}
                  onChange={(e) => handleAltKategoriAdDariChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="مثال: موبایل‌ها، کامپیوتر، تبلت"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug <span className="text-xs text-gray-500">(خودکار)</span>
                </label>
                <input
                  type="text"
                  value={altKategoriFormData.slug}
                  onChange={(e) => setAltKategoriFormData({ ...altKategoriFormData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                  placeholder="otomatik oluşturulur..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={altKategoriFormData.aciklama}
                  onChange={(e) => setAltKategoriFormData({ ...altKategoriFormData, aciklama: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="توضیحات زیر دسته‌بندی..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="alt_aktif"
                  checked={altKategoriFormData.aktif}
                  onChange={(e) => setAltKategoriFormData({ ...altKategoriFormData, aktif: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="alt_aktif" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  زیر دسته‌بندی فعال باشد
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingAltKategoriId ? 'به‌روزرسانی' : 'ایجاد'}
                </button>
                <button
                  type="button"
                  onClick={resetAltKategoriForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  لغو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">انتخاب آیکون</h2>
              <button
                onClick={() => setShowIconPicker(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto">
              {AVAILABLE_ICONS.map((iconItem) => {
                const IconComponent = iconItem.icon;
                const isSelected = formData.ikon === iconItem.name;
                
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, ikon: iconItem.name });
                      setShowIconPicker(false);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    title={iconItem.label}
                  >
                    <IconComponent className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className="text-[10px] text-center text-gray-600 font-medium">{iconItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
