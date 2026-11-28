import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
type Language="en"|"ar";
const translations:Record<string,{en:string;ar:string}>={
 "Car parts":{en:"Car parts",ar:"قطع غيار السيارات"},"Menu":{en:"Menu",ar:"القائمة"},"Settings":{en:"Settings",ar:"الإعدادات"},"My orders":{en:"My orders",ar:"طلباتي"},"Create account":{en:"Create account",ar:"إنشاء حساب"},"Sign in to add items to your cart and place an order.":{en:"Sign in to add items to your cart and place an order.",ar:"سجّل الدخول لإضافة المنتجات إلى السلة وإتمام الطلب."},"Manage your Parts Hub display preferences.":{en:"Manage your Parts Hub display preferences.",ar:"إدارة تفضيلات عرض موقع بارتس هَب."},"Website language":{en:"Website language",ar:"لغة الموقع"},"Choose the language used across the marketplace.":{en:"Choose the language used across the marketplace.",ar:"اختر اللغة المستخدمة في جميع صفحات الموقع."},"Motorcycles":{en:"Motorcycles",ar:"الموتوسيكلات"},"Workshops":{en:"Workshops",ar:"الورش"},"Sell with us":{en:"Sell with us",ar:"اعرض منتجاتك معنا"},"Account":{en:"Account",ar:"حسابي"},"Sign in":{en:"Sign in",ar:"تسجيل الدخول"},"Cart":{en:"Cart",ar:"السلة"},"Explore parts":{en:"Explore parts",ar:"اكتشف قطع الغيار"},"Categories":{en:"Categories",ar:"التصنيفات"},"THE AUTOMOTIVE MARKETPLACE":{en:"THE AUTOMOTIVE MARKETPLACE",ar:"سوق قطع غيار السيارات"},"Find the right part.":{en:"Find the right part.",ar:"اعثر على قطعة الغيار المناسبة."},"Drive with confidence.":{en:"Drive with confidence.",ar:"وقُد بثقة."},"Discover car and motorcycle parts from Egyptian sellers, all in one place.":{en:"Discover car and motorcycle parts from Egyptian sellers, all in one place.",ar:"اكتشف قطع غيار السيارات والموتوسيكلات من البائعين في مصر، في مكان واحد."},"Search parts, brands or vehicle model…":{en:"Search parts, brands or vehicle model…",ar:"ابحث عن قطعة غيار أو ماركة أو موديل السيارة…"},"Search":{en:"Search",ar:"بحث"},"Seller transparency":{en:"Seller transparency",ar:"شفافية البائعين"},"Delivery choices":{en:"Delivery choices",ar:"خيارات التوصيل"},"Local support":{en:"Local support",ar:"دعم محلي"},"Know who you're buying from":{en:"Know who you're buying from",ar:"اعرف البائع الذي تشتري منه"},"Options that suit your order":{en:"Options that suit your order",ar:"خيارات تناسب طلبك"},"Parts & workshops":{en:"Parts & workshops",ar:"قطع غيار وورش"},"Everything automotive":{en:"Everything automotive",ar:"كل ما يخص السيارات"},"Support when needed":{en:"Support when needed",ar:"دعم وقت الحاجة"},"Help through your journey":{en:"Help through your journey",ar:"نساعدك في كل خطوة"},"THE RIGHT GEAR":{en:"THE RIGHT GEAR",ar:"اختيارك الصح"},"Explore the marketplace":{en:"Explore the marketplace",ar:"اكتشف السوق"},"Browse current listings from approved sellers.":{en:"Browse current listings from approved sellers.",ar:"تصفح المنتجات المعروضة من البائعين المعتمدين."},"Browse catalog":{en:"Browse catalog",ar:"تصفح المنتجات"},"Loading listings…":{en:"Loading listings…",ar:"جارٍ تحميل المنتجات…"},"Live marketplace catalog":{en:"Live marketplace catalog",ar:"منتجات السوق"},"Loading products…":{en:"Loading products…",ar:"جارٍ تحميل المنتجات…"},"Try again":{en:"Try again",ar:"حاول مرة أخرى"},"GROW WITH PARTS HUB":{en:"GROW WITH PARTS HUB",ar:"كبّر تجارتك مع بارتس هَب"},"Your business.":{en:"Your business.",ar:"تجارتك."},"More customers.":{en:"More customers.",ar:"عملاء أكتر."},"Connect your inventory with drivers and workshops looking for the right parts.":{en:"Connect your inventory with drivers and workshops looking for the right parts.",ar:"اعرض مخزونك للسائقين والورش الباحثين عن قطع الغيار المناسبة."},"Become a seller":{en:"Become a seller",ar:"ابدأ البيع"},"Need a trusted workshop?":{en:"Need a trusted workshop?",ar:"بتدور على ورشة موثوقة؟"},"We're building a network of garages and maintenance centers to make your next repair easier.":{en:"We're building a network of garages and maintenance centers to make your next repair easier.",ar:"نعمل على تكوين شبكة من الجراجات ومراكز الصيانة لتسهيل إصلاح سيارتك."},"COMING SOON":{en:"COMING SOON",ar:"قريبًا"},"Parts for the road ahead.":{en:"Parts for the road ahead.",ar:"قطع غيار لكل طريق."},"Marketplace preview.":{en:"Marketplace preview.",ar:"نسخة تجريبية للسوق."},"Back to marketplace":{en:"Back to marketplace",ar:"العودة إلى السوق"},"JOIN THE MARKETPLACE":{en:"JOIN THE MARKETPLACE",ar:"انضم إلى السوق"},"Make it yours.":{en:"Make it yours.",ar:"ابدأ رحلتك معنا."},"Create one account to get started with Parts Hub.":{en:"Create one account to get started with Parts Hub.",ar:"أنشئ حسابًا واحدًا للبدء مع بارتس هَب."},"Full name":{en:"Full name",ar:"الاسم بالكامل"},"Email address":{en:"Email address",ar:"البريد الإلكتروني"},"Phone number (optional)":{en:"Phone number (optional)",ar:"رقم الهاتف (اختياري)"},"Account type":{en:"Account type",ar:"نوع الحساب"},"I want to buy":{en:"I want to buy",ar:"أريد الشراء"},"I want to sell":{en:"I want to sell",ar:"أريد البيع"},"Business type":{en:"Business type",ar:"نوع النشاط"},"Parts store / trader":{en:"Parts store / trader",ar:"متجر قطع غيار / تاجر"},"Garage / workshop":{en:"Garage / workshop",ar:"جراج / ورشة"},"Maintenance center":{en:"Maintenance center",ar:"مركز صيانة"},"Motorcycle workshop":{en:"Motorcycle workshop",ar:"ورشة موتوسيكلات"},"Password":{en:"Password",ar:"كلمة المرور"},"At least 10 characters.":{en:"At least 10 characters.",ar:"10 أحرف على الأقل."},"SHOW":{en:"SHOW",ar:"إظهار"},"HIDE":{en:"HIDE",ar:"إخفاء"},"Creating account…":{en:"Creating account…",ar:"جارٍ إنشاء الحساب…"},"Already registered?":{en:"Already registered?",ar:"لديك حساب بالفعل؟"},"Merchant accounts may require review before selling features are enabled.":{en:"Merchant accounts may require review before selling features are enabled.",ar:"قد تحتاج حسابات التجار إلى المراجعة قبل تفعيل البيع."},"YOUR PARTS HUB ACCOUNT":{en:"YOUR PARTS HUB ACCOUNT",ar:"حسابك في بارتس هَب"},"Welcome back.":{en:"Welcome back.",ar:"مرحبًا بعودتك."},"Sign in to manage your parts, orders, and saved items.":{en:"Sign in to manage your parts, orders, and saved items.",ar:"سجّل الدخول لإدارة قطع الغيار وطلباتك والعناصر المحفوظة."},"Enter your password":{en:"Enter your password",ar:"أدخل كلمة المرور"},"Forgot password?":{en:"Forgot password?",ar:"نسيت كلمة المرور؟"},"New to Parts Hub?":{en:"New to Parts Hub?",ar:"جديد في بارتس هَب؟"},"Find your next part.":{en:"Find your next part.",ar:"اعثر على قطعة الغيار التالية."},"Explore current listings from approved Parts Hub sellers.":{en:"Explore current listings from approved Parts Hub sellers.",ar:"استكشف المنتجات المعروضة من بائعي بارتس هَب المعتمدين."},"Search name, vehicle or seller":{en:"Search name, vehicle or seller",ar:"ابحث بالاسم أو السيارة أو البائع"},"All":{en:"All",ar:"الكل"},"Motorcycle parts":{en:"Motorcycle parts",ar:"قطع غيار الموتوسيكلات"},"Workshop":{en:"Workshop",ar:"الورش"},"No matching parts found":{en:"No matching parts found",ar:"لم نعثر على قطع غيار مطابقة"},"Try another search or clear your filters.":{en:"Try another search or clear your filters.",ar:"جرّب البحث بكلمات أخرى أو امسح عوامل التصفية."},"Shopping cart":{en:"Shopping cart",ar:"سلة التسوق"},"YOUR SELECTION":{en:"YOUR SELECTION",ar:"اختياراتك"},"Order summary":{en:"Order summary",ar:"ملخص الطلب"},"Subtotal":{en:"Subtotal",ar:"المجموع الفرعي"},"Delivery":{en:"Delivery",ar:"التوصيل"},"Estimated total":{en:"Estimated total",ar:"الإجمالي التقديري"},"Continue to checkout":{en:"Continue to checkout",ar:"متابعة لإتمام الطلب"}
, "FIND YOUR RIDE":{en:"FIND YOUR RIDE",ar:"اختار مركبتك"}, "Explore by vehicle style":{en:"Explore by vehicle style",ar:"اكتشف حسب نوع المركبة"}, "From everyday commutes to weekend performance.":{en:"From everyday commutes to weekend performance.",ar:"من مشاويرك اليومية إلى أداء عطلة نهاية الأسبوع."}, "Explore vehicles":{en:"Explore vehicles",ar:"استكشف المركبات"}, "Sports cars":{en:"Sports cars",ar:"سيارات رياضية"}, "Performance parts and upgrades":{en:"Performance parts and upgrades",ar:"قطع أداء وتعديلات رياضية"}, "Economy cars":{en:"Economy cars",ar:"سيارات اقتصادية"}, "Reliable parts for daily driving":{en:"Reliable parts for daily driving",ar:"قطع موثوقة للاستخدام اليومي"}, "Luxury cars":{en:"Luxury cars",ar:"سيارات فاخرة"}, "Premium components and accessories":{en:"Premium components and accessories",ar:"مكونات وإكسسوارات فاخرة"}, "SUV & 4×4":{en:"SUV & 4×4",ar:"دفع رباعي وSUV"}, "Parts built for every road":{en:"Parts built for every road",ar:"قطع مناسبة لمختلف الطرق"}, "Sedan cars":{en:"Sedan cars",ar:"سيارات سيدان"}, "Hatchback cars":{en:"Hatchback cars",ar:"سيارات هاتشباك"}, "Coupe & convertible":{en:"Coupe & convertible",ar:"كوبيه وكابورليه"}, "Pickup trucks":{en:"Pickup trucks",ar:"سيارات بيك أب"}, "Vans & minibuses":{en:"Vans & minibuses",ar:"فان وميكروباص"}, "Electric & hybrid":{en:"Electric & hybrid",ar:"سيارات كهربائية وهايبرد"}, "Comfortable everyday family cars":{en:"Comfortable everyday family cars",ar:"سيارات عائلية مريحة للاستخدام اليومي"}, "Compact cars for city driving":{en:"Compact cars for city driving",ar:"سيارات صغيرة ومناسبة للمدينة"}, "Two-door and open-top models":{en:"Two-door and open-top models",ar:"سيارات ببابين أو سقف مكشوف"}, "Work, cargo and off-road utility":{en:"Work, cargo and off-road utility",ar:"للاستخدام العملي ونقل الأغراض والطرق الوعرة"}, "Space for passengers and cargo":{en:"Space for passengers and cargo",ar:"مساحة أكبر للركاب والأمتعة"}, "Parts for electric and hybrid vehicles":{en:"Parts for electric and hybrid vehicles",ar:"قطع غيار السيارات الكهربائية والهايبرد"}, "TWO WHEELS. BIG ENERGY.":{en:"TWO WHEELS. BIG ENERGY.",ar:"عجلتين وطاقة كبيرة"}, "Made for motorcycle enthusiasts.":{en:"Made for motorcycle enthusiasts.",ar:"مصممة لعشاق الموتوسيكلات."}, "Explore parts and accessories for your next ride.":{en:"Explore parts and accessories for your next ride.",ar:"اكتشف قطع الغيار والإكسسوارات لمغامرتك القادمة."},
 "PARTS HUB CONTROL CENTER":{en:"PARTS HUB CONTROL CENTER",ar:"مركز تحكم بارتس هَب"},
 "Administrator sign in":{en:"Administrator sign in",ar:"دخول الأدمن"},
 "Enter your administrator password to continue to the control panel.":{en:"Enter your administrator password to continue to the control panel.",ar:"اكتب كلمة مرور الأدمن للدخول إلى لوحة التحكم."},
 "Unable to sign in. Please try again.":{en:"Unable to sign in. Please try again.",ar:"تعذر تسجيل الدخول. حاول مرة أخرى."},
 "Hide password":{en:"Hide password",ar:"إخفاء كلمة المرور"},
 "Show password":{en:"Show password",ar:"إظهار كلمة المرور"},
 "Enter administrator password":{en:"Enter administrator password",ar:"اكتب كلمة مرور الأدمن"},
 "Checking password…":{en:"Checking password…",ar:"جارٍ التحقق من كلمة المرور…"},
 "Enter control panel":{en:"Enter control panel",ar:"دخول لوحة التحكم"},
 "Secure administrator access":{en:"Secure administrator access",ar:"دخول آمن للأدمن"},


 "About us":{en:"About us",ar:"معلومات عنا"},
 "Shipping":{en:"Shipping",ar:"الشحن"},
 "Returns & cancellations":{en:"Returns & cancellations",ar:"الإرجاع والإلغاء"},
 "Contact":{en:"Contact",ar:"تواصل معنا"},
 "Information and policies":{en:"Information and policies",ar:"المعلومات والسياسات"},
 "Developed by Adham":{en:"Developed by Adham",ar:"تطوير أدهم"},

 "BUILT FOR THE ROAD":{en:"BUILT FOR THE ROAD",ar:"مصممة للطريق"},
 "PARTS · PEOPLE · PERFORMANCE":{en:"PARTS · PEOPLE · PERFORMANCE",ar:"قطع غيار · ناس · أداء"},
 "QUALITY FIRST":{en:"QUALITY FIRST",ar:"الجودة أولًا"},
 "01 / PERFORMANCE":{en:"01 / PERFORMANCE",ar:"01 / الأداء"},
 "02 / EVERYDAY":{en:"02 / EVERYDAY",ar:"02 / الاستخدام اليومي"},
 "03 / PREMIUM":{en:"03 / PREMIUM",ar:"03 / الفخامة"},
 "04 / ADVENTURE":{en:"04 / ADVENTURE",ar:"04 / المغامرة"},
 "05 / COMFORT":{en:"05 / COMFORT",ar:"05 / الراحة"},
 "06 / COMPACT":{en:"06 / COMPACT",ar:"06 / السيارات الصغيرة"},
 "07 / STYLE":{en:"07 / STYLE",ar:"07 / التصميم"},
 "08 / UTILITY":{en:"08 / UTILITY",ar:"08 / الاستخدام العملي"},
 "09 / FAMILY":{en:"09 / FAMILY",ar:"09 / العائلة"},
 "10 / NEXT GENERATION":{en:"10 / NEXT GENERATION",ar:"10 / الجيل الجديد"},
 "PARTNER NETWORK / EG":{en:"PARTNER NETWORK / EG",ar:"شبكة الشركاء / مصر"},
 "PARTS HUB PREVIEW":{en:"PARTS HUB PREVIEW",ar:"نسخة بارتس هَب التجريبية"},
 "This section is being built. No orders, payments, or account changes are processed here yet.":{en:"This section is being built. No orders, payments, or account changes are processed here yet.",ar:"نعمل على تجهيز هذا القسم. لا تتم معالجة الطلبات أو المدفوعات أو تغييرات الحساب حاليًا."},
 "Sell with Parts Hub":{en:"Sell with Parts Hub",ar:"بيع مع بارتس هَب"},
 "A dedicated seller workspace is planned for merchant onboarding, inventory, pricing, and order management.":{en:"A dedicated seller workspace is planned for merchant onboarding, inventory, pricing, and order management.",ar:"نعمل على تجهيز مساحة خاصة بالتجار للتسجيل وإدارة المخزون والأسعار والطلبات."},

 "PARTS HUB VEHICLE FINDER":{en:"PARTS HUB VEHICLE FINDER",ar:"محدد المركبة من بارتس هَب"},
 "Choose your vehicle.":{en:"Choose your vehicle.",ar:"اختار عربيتك."},
 "Select make, model, year and engine to narrow down parts.":{en:"Select make, model, year and engine to narrow down parts.",ar:"اختار الماركة والموديل والسنة والمحرك لتحديد قطع الغيار."},
 "Make":{en:"Make",ar:"الماركة"},
 "Model":{en:"Model",ar:"الموديل"},
 "Model year":{en:"Model year",ar:"سنة الصنع"},
 "Engine":{en:"Engine",ar:"المحرك"},
 "Engine code":{en:"Engine code",ar:"كود المحرك"},
 "Fitment is market- and variant-specific. Listings without engine code or exact displacement require confirmation before purchase.":{en:"Fitment is market- and variant-specific. Listings without engine code or exact displacement require confirmation before purchase.",ar:"التوافق يختلف حسب السوق والفئة. المنتجات التي لا توضح كود المحرك أو السعة الدقيقة تحتاج إلى تأكيد قبل الشراء."},
 "Search parts in this vehicle":{en:"Search parts in this vehicle",ar:"ابحث عن قطع غيار لهذه السيارة"},
 "matching listings":{en:"matching listings",ar:"عرض مطابق"},
 "Price comparison · lowest first":{en:"Price comparison · lowest first",ar:"مقارنة الأسعار · الأقل أولًا"},
 "Engine specifications source":{en:"Engine specifications source",ar:"مصدر مواصفات المحرك"},
 "Open reference":{en:"Open reference",ar:"فتح المصدر"},
 "Catalog coverage is being expanded using regional vehicle data. Do not assume compatibility from displacement alone; compare part number, engine code, transmission and production variant.":{en:"Catalog coverage is being expanded using regional vehicle data. Do not assume compatibility from displacement alone; compare part number, engine code, transmission and production variant.",ar:"نعمل على توسيع الكتالوج ببيانات المركبات حسب السوق. لا تعتمد على السعة وحدها؛ راجع رقم القطعة وكود المحرك وناقل الحركة والفئة."},
 "Parts Hub":{en:"Parts Hub",ar:"بارتس هَب"},
 "Compare offers":{en:"Compare offers",ar:"قارن العروض"},
 "Seller identity hidden":{en:"Seller identity hidden",ar:"هوية البائع مخفية"},
 "Offers for this part":{en:"Offers for this part",ar:"عروض هذه القطعة"},
 "Compare prices from different approved sellers. Seller identity and pickup address stay private.":{en:"Compare prices from different approved sellers. Seller identity and pickup address stay private.",ar:"قارن الأسعار من تجار معتمدين. اسم التاجر وعنوان الاستلام يظلان مخفيين."},
 "Selected offer":{en:"Selected offer",ar:"العرض المحدد"},
 "Available offer":{en:"Available offer",ar:"عرض متاح"},
 "In stock":{en:"In stock",ar:"متوفر"},
 "Compatibility is not guaranteed by engine capacity alone. Confirm part number, engine code, year, transmission and trim before purchase.":{en:"Compatibility is not guaranteed by engine capacity alone. Confirm part number, engine code, year, transmission and trim before purchase.",ar:"السعة وحدها لا تضمن التوافق. تأكد من رقم القطعة وكود المحرك والسنة وناقل الحركة والفئة قبل الشراء."},
 "Buy now":{en:"Buy now",ar:"اشترِ الآن"},
 "Loading product details…":{en:"Loading product details…",ar:"جارٍ تحميل تفاصيل المنتج…"},
 "Listing unavailable":{en:"Listing unavailable",ar:"العرض غير متاح"},
 "This product may have been removed.":{en:"This product may have been removed.",ar:"ربما تم حذف هذا المنتج."},
 "Browse parts":{en:"Browse parts",ar:"تصفح قطع الغيار"},
 "Seller":{en:"Seller",ar:"البائع"},
 "Parts Hub seller":{en:"Parts Hub seller",ar:"بائع عبر بارتس هَب"}

 "Transmission":{en:"Transmission",ar:"ناقل الحركة"},
 "Trim":{en:"Trim",ar:"الفئة"},
 "Product reviews":{en:"Product reviews",ar:"تقييمات المنتج"},
 "No reviews yet. Verified purchases can leave a review after delivery.":{en:"No reviews yet. Verified purchases can leave a review after delivery.",ar:"لا توجد تقييمات بعد. يمكن للمشترين الذين استلموا المنتج تقييمه بعد التسليم."},
 "No written comment":{en:"No written comment",ar:"لا يوجد تعليق مكتوب"}

 "Generation":{en:"Generation",ar:"الجيل"},
 "Chevrolet":{en:"Chevrolet",ar:"شيفروليه"},
 "Aveo":{en:"Aveo",ar:"أفيو"},
 "Hyundai":{en:"Hyundai",ar:"هيونداي"},
 "Elantra AD":{en:"Elantra AD",ar:"إلنترا AD"},
 "Mercedes-Benz":{en:"Mercedes-Benz",ar:"مرسيدس-بنز"},
 "C-Class W205 · C180":{en:"C-Class W205 · C180",ar:"الفئة C W205 · C180"},
 "Aveo · Egypt 2018–2020":{en:"Aveo · Egypt 2018–2020",ar:"أفيو · مواصفات مصر 2018–2020"},
 "AD":{en:"AD",ar:"AD"},
 "W205":{en:"W205",ar:"W205"},
 "1.5L Petrol · 1498 cc":{en:"1.5L Petrol · 1498 cc",ar:"1.5 لتر بنزين · 1498 سم³"},
 "1.6 MPI Petrol · 1600 cc (nominal)":{en:"1.6 MPI Petrol · 1600 cc (nominal)",ar:"1.6 MPI بنزين · 1600 سم³ (تقريبية)"},
 "1.595L Petrol · 1595 cc":{en:"1.595L Petrol · 1595 cc",ar:"1.595 لتر بنزين · 1595 سم³"},
 "Petrol":{en:"Petrol",ar:"بنزين"},
 "Manual 5-speed":{en:"Manual 5-speed",ar:"مانيوال 5 سرعات"},
 "Automatic 4-speed":{en:"Automatic 4-speed",ar:"أوتوماتيك 4 سرعات"},
 "Automatic 6-speed":{en:"Automatic 6-speed",ar:"أوتوماتيك 6 سرعات"},
 "Market-specific · verify":{en:"Market-specific · verify",ar:"يختلف حسب السوق · يلزم التأكد"},
 "Trim not specified in brochure":{en:"Trim not specified in brochure",ar:"الفئة غير محددة في الكتيب"},
 "Baseline":{en:"Baseline",ar:"Baseline"},
 "Modern":{en:"Modern",ar:"Modern"},
 "Topline":{en:"Topline",ar:"Topline"},
 "C180":{en:"C180",ar:"C180"}
};
type LanguageContextValue={language:Language;direction:"ltr"|"rtl";setLanguage:(language:Language)=>void;t:(value:string)=>string};
const LanguageContext=createContext<LanguageContextValue|null>(null);
export function LanguageProvider({children}:{children:ReactNode}){
 const [language,setLanguageState]=useState<Language>(()=>{try{return localStorage.getItem("partshub-language")==="ar"?"ar":"en"}catch{return"en"}});
 const setLanguage=(value:Language)=>{setLanguageState(value);try{localStorage.setItem("partshub-language",value)}catch{}};
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";document.body.dataset.language=language},[language]);
 const value=useMemo(()=>({language,direction:language==="ar"?"rtl" as const:"ltr" as const,setLanguage,t:(key:string)=>translations[key]?.[language]??key}),[language]);
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const value=useContext(LanguageContext);if(!value)throw new Error("useLanguage must be used within LanguageProvider");return value}
