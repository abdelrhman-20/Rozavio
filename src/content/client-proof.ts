import { type ClientProofData } from "./types";
import { withBase } from "@/lib/base-path";

export const clientProof: ClientProofData = {
  eyebrow: "أعمالنا",
  heading: "اشتغلنا مع أنشطة زي نشاطك.",
  description:
    "لكل مشروع طبيعة مختلفة، لذلك نصمم كل موقع بما يناسب هوية النشاط واحتياجاته. استعرض نماذج من أعمالنا في مجالات متنوعة، واكتشف كيف نحول الأفكار إلى تجارب رقمية متكاملة.",
  primaryCtaLabel: "ناقش مشروعك",
  primaryCtaHref: "/#book",
  works: [
    {
      id: "wida",
      name: "wida",
      category: "حلول اتصالية · السعودية",
      url: "https://wida.sa/",
      host: "wida.sa",
      imageSrc: withBase("/images/works/wida-full.jpg"),
      thumb: withBase("/images/works/wida-thumb.jpg"),
      imageAlt: "الصفحة الرئيسية لموقع wida.sa",
      linkLabel: "زيارة موقع wida",
      brandColor: "#6E4FDB",
      brandColorEnd: "#D68ADB",
    },
    {
      id: "brwaz1",
      name: "بـرواز",
      category: "تطوير عقاري · السعودية",
      url: "https://brwaz1.sa/",
      host: "brwaz1.sa",
      imageSrc: withBase("/images/works/brwaz1-full.jpg"),
      thumb: withBase("/images/works/brwaz1-thumb.jpg"),
      imageAlt: "الصفحة الرئيسية لموقع brwaz1.sa",
      linkLabel: "زيارة موقع برواز",
      brandColor: "#C09B66",
      brandColorEnd: "#8A6A4A",
    },
    {
      id: "melton",
      name: "Melton Physio",
      category: "علاج طبيعي · أستراليا",
      url: "https://meltonphysio.com.au/",
      host: "meltonphysio.com.au",
      imageSrc: withBase("/images/works/melton-full.jpg"),
      thumb: withBase("/images/works/melton-thumb.jpg"),
      imageAlt: "الصفحة الرئيسية لموقع meltonphysio.com.au",
      linkLabel: "زيارة موقع Melton Physio",
      brandColor: "#00A8E8",
      brandColorEnd: "#0B4F9E",
    },
  ],
  labels: {
    live: "موقع حي",
    visit: "تصفّح الموقع",
    close: "إغلاق",
    newTab: "فتح في تبويب جديد",
    picker: "اختر موقعًا",
  },
};
