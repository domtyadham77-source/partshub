import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Truck, PackageCheck, MessageCircle } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useLanguage } from "../contexts/LanguageContext";

type InfoKind = "about" | "shipping" | "returns" | "contact";
type Block = { heading: string; paragraphs?: string[]; bullets?: string[] };
const copy: Record<InfoKind, { title: string; intro: string; blocks: Block[] }> = {
 about: {
  title: "Parts Hub — parts, people, and confidence",
  intro: "Parts Hub brings customers, independent parts sellers, traders, and workshops together in one automotive marketplace.",
  blocks: [
   { heading: "A marketplace that connects you", paragraphs: ["Find car and motorcycle parts from participating sellers in one place. Compare listings, check product details, and contact the seller or our support team when you need help choosing the right part."] },
   { heading: "We connect — the seller supplies", paragraphs: ["Parts Hub operates as a marketplace and intermediary. The product is offered and supplied by the independent seller shown on its listing or order documents; Parts Hub does not manufacture or own the listed parts and is not the seller of record unless an order or invoice clearly states otherwise.", "The seller is responsible for the product description, compatibility information, condition, authenticity, applicable warranty, and fulfilling the sale. Parts Hub works to make the marketplace clearer and to help customers and sellers communicate and resolve order issues."] },
   { heading: "Quality starts with clear information", paragraphs: ["We encourage sellers to provide accurate photos, part numbers, vehicle fitment, condition, and warranty details. Review the listing and seller information before ordering, and ask questions if compatibility is uncertain.", "Your confidence matters. If a product arrives damaged, defective, or different from the agreed description, contact support promptly so the order can be reviewed under the applicable law and policy."] }
  ]
 },
 shipping: {
  title: "Shipping & delivery",
  intro: "We coordinate delivery through third-party shipping providers and participating sellers. The available delivery method, fee, and expected date will be shown or confirmed before an order is finalized.",
  blocks: [
   { heading: "How delivery works", bullets: ["The seller prepares and packs the ordered item.", "The shipment is handed to a delivery provider and tracked when tracking is available.", "The courier delivers to the address and contact details provided with the order.", "Please keep your order number and delivery updates until the order is complete."] },
   { heading: "Delivery estimates and fees", paragraphs: ["Delivery times and fees depend on the seller, destination, parcel size, and courier service. The estimated delivery date and applicable shipping charges should be displayed or confirmed before you place the order. We will not promise a fixed delivery time where the courier service has not confirmed it.", "Parts Hub is currently in preview. Live delivery coverage, shipping prices, and estimated delivery windows will be published and shown at checkout when shipping operations are enabled."] },
   { heading: "At delivery", bullets: ["Check the package and the item as soon as reasonably possible.", "If the parcel is visibly damaged or the item is incorrect, record the issue with photos and contact support promptly.", "Do not discard the packaging until any delivery issue has been reviewed."] },
   { heading: "Delayed or undelivered orders", paragraphs: ["If a shipment is delayed, contact support with your order number. If delivery is delayed beyond the agreed date, or the statutory conditions for withdrawal due to delay apply, your rights under Egyptian consumer protection law remain unaffected."] }
  ]
 },
 returns: {
  title: "Returns, cancellations & refunds",
  intro: "We want every order to be clear and fair. Return and cancellation requests are handled with the seller and, where applicable, the delivery provider, while preserving your rights under Egyptian law.",
  blocks: [
   { heading: "Cancel before dispatch", paragraphs: ["If you need to cancel, contact the seller or Parts Hub support as soon as possible and include your order number. A cancellation may be stopped before dispatch. If the parcel has already been handed to the courier, the return process and applicable shipping costs may apply, subject to law."] },
   { heading: "Change of mind", paragraphs: ["Egyptian Consumer Protection Law No. 181 of 2018 provides a 14-day right to exchange or return goods without stating a reason, subject to the legal exceptions and procedures. The right and any return-shipping cost are applied in accordance with the law and the circumstances of the order."] },
   { heading: "Defective or non-conforming item", paragraphs: ["Under Article 21 of Law No. 181 of 2018, a consumer may request replacement or return with a refund within 30 days of receiving a good if it is defective, does not match its specifications, or is not fit for the agreed purpose, subject to the law. The supplier must handle qualifying cases without additional cost to the consumer.", "Article 20 requires the supplier to guarantee product quality and safety throughout the warranty period and conformity with the agreed specifications."] },
   { heading: "How to request a return", bullets: ["Open a support request and provide your order number, reason for return, and clear photos where relevant.", "Keep the item, parts, accessories, and packaging together while the request is reviewed.", "Do not install or use a part if you believe it is incorrect or defective, except as needed to safely identify the issue.", "Follow the return instructions and keep the courier receipt or tracking number."] },
   { heading: "Inspection and refunds", paragraphs: ["The seller or an authorized party may inspect the returned item to determine its condition and whether the request meets the applicable return grounds. This review does not limit statutory consumer rights.", "Approved refunds are made through the original payment method where possible, within the time required by applicable law and payment-provider procedures. The seller remains responsible for the sale and statutory product obligations; Parts Hub facilitates communication and the marketplace process."] },
   { heading: "Legal note", paragraphs: ["This page is a practical summary, not legal advice, and does not replace Law No. 181 of 2018, its Executive Regulations, or any more favorable consumer right. If this policy conflicts with applicable law, the law prevails."] }
  ]
 },
 contact: {
  title: "Contact Parts Hub",
  intro: "Need help finding a part, checking an order, or raising a delivery or return issue? Our support channel is the place to start.",
  blocks: [
   { heading: "Customer support", paragraphs: ["Sign in to your Parts Hub account and open a support request. Include your order number (if applicable), a short description, and any photos that help explain the issue."] },
   { heading: "For sellers and workshops", paragraphs: ["For marketplace participation, seller onboarding, or workshop directory questions, use the support channel and choose the relevant topic so your request can be routed correctly."] }
  ]
 }
};
export default function MarketplaceInfoPage({ kind }: { kind: InfoKind }) {
 const { language } = useLanguage();
 const page = copy[kind];
 const isArabic = language === "ar";
 const ar: Record<InfoKind, { title: string; intro: string; blocks: Block[] }> = {
  about: { title: "بارتس هَب — قطع غيار، وشركاء، وثقة", intro: "بارتس هَب بيجمع العملاء وتجار قطع الغيار والورش في سوق إلكتروني واحد متخصص في السيارات والموتوسيكلات.", blocks: [
   { heading: "سوق واحد يوصلك بالبائعين", paragraphs: ["اكتشف قطع غيار السيارات والموتوسيكلات من البائعين المشاركين في مكان واحد. قارن المنتجات، وراجع تفاصيل القطعة، واسأل البائع أو فريق الدعم لو محتاج مساعدة في اختيار القطعة المناسبة."] },
   { heading: "إحنا بنوصّل الأطراف ببعض — والتاجر هو اللي بيبيع", paragraphs: ["بارتس هَب منصة سوق إلكتروني ووسيط بين العميل والبائع المستقل. المنتج بيقدمه وبيورّده التاجر الموضح في صفحة المنتج أو مستندات الطلب؛ بارتس هَب مش مصنع أو مالك للقطع المعروضة، ومش هو البائع في العملية إلا لو الطلب أو الفاتورة وضّحوا غير كده.", "التاجر مسؤول عن وصف المنتج، ومعلومات التوافق مع المركبة، وحالة القطعة وأصالتها والضمان المطبق وتنفيذ البيع. دور بارتس هَب هو تنظيم عرض المنتجات وتسهيل التواصل ومساعدة الطرفين في متابعة الطلب وحل المشكلات."] },
   { heading: "الجودة تبدأ بالمعلومات الواضحة", paragraphs: ["بنحث التجار على تقديم صور دقيقة ورقم القطعة وموديلات المركبات المناسبة وحالة المنتج وتفاصيل الضمان. راجع بيانات المنتج والبائع قبل الطلب، واسأل لو التوافق مش واضح.", "ثقتك مهمة. لو المنتج وصل تالف أو معيب أو مختلف عن الوصف المتفق عليه، تواصل مع الدعم بسرعة عشان نراجع الطلب وفقًا للقانون والسياسة المطبقة."] }
  ] },
  shipping: { title: "الشحن والتوصيل", intro: "بننسّق التوصيل من خلال شركات شحن مستقلة والتجار المشاركين. طريقة التوصيل المتاحة وتكلفتها والموعد المتوقع هيتعرضوا أو يتم تأكيدهم قبل إتمام الطلب.", blocks: [
   { heading: "الطلب بيوصل إزاي؟", bullets: ["التاجر بيجهّز القطعة ويغلفها.", "الشحنة بتتسلم لشركة الشحن، وبيكون لها تتبع لما الخدمة توفره.", "مندوب الشحن بيوصل للعنوان وبيانات التواصل المسجلة في الطلب.", "احتفظ برقم الطلب وتحديثات الشحن لحد ما الطلب يكتمل."] },
   { heading: "مدة التوصيل والتكلفة", paragraphs: ["مدة التوصيل والتكلفة بتختلف حسب التاجر والمحافظة وحجم الطرد وخدمة شركة الشحن. الموعد المتوقع ورسوم الشحن لازم يظهروا أو يتم تأكيدهم قبل الطلب. مش هنحدد مدة ثابتة من غير تأكيد من شركة الشحن.", "Parts Hub حاليًا في مرحلة Preview. التغطية الفعلية والأسعار ومواعيد التوصيل هتظهر عند تفعيل الشحن والطلبات الفعلية."] },
   { heading: "وقت استلام الشحنة", bullets: ["افحص الطرد والقطعة في أقرب وقت مناسب.", "لو الطرد واضح إنه متضرر أو القطعة غير صحيحة، صوّر المشكلة وتواصل مع الدعم بسرعة.", "احتفظ بالتغليف لحد ما يتم مراجعة أي مشكلة في التوصيل."] },
   { heading: "التأخير أو عدم وصول الطلب", paragraphs: ["لو الشحنة اتأخرت، تواصل مع الدعم برقم الطلب. لو التوصيل اتأخر عن الموعد المتفق عليه أو انطبقت شروط العدول القانونية بسبب التأخير، حقوقك بموجب قانون حماية المستهلك المصري تظل محفوظة."] }
  ] },
  returns: { title: "سياسة الإرجاع والإلغاء واسترداد الأموال", intro: "هدفنا إن كل طلب يكون واضح وعادل. بننسّق طلبات الإرجاع والإلغاء مع التاجر وشركة الشحن عند الحاجة، مع الحفاظ على حقوقك بموجب القانون المصري.", blocks: [
   { heading: "إلغاء الطلب قبل الشحن", paragraphs: ["لو محتاج تلغي الطلب، تواصل مع التاجر أو دعم Parts Hub بأسرع وقت واذكر رقم الطلب. ممكن نوقف الإلغاء قبل تسليم الشحنة لشركة الشحن. لو الشحنة اتسلمت بالفعل، ممكن تنطبق إجراءات الإرجاع وتكاليف الشحن وفقًا للقانون."] },
   { heading: "العدول عن الشراء", paragraphs: ["قانون حماية المستهلك رقم 181 لسنة 2018 بيقرر حقًا في استبدال أو إرجاع السلعة خلال 14 يومًا دون إبداء سبب، مع مراعاة الاستثناءات والإجراءات القانونية. تطبيق الحق وتكلفة شحن المرتجع بيكون وفقًا للقانون وظروف الطلب."] },
   { heading: "القطعة المعيبة أو غير المطابقة", paragraphs: ["وفقًا للمادة 21 من القانون رقم 181 لسنة 2018، يحق للمستهلك طلب استبدال أو إرجاع السلعة واسترداد قيمتها خلال 30 يومًا من استلامها إذا كان بها عيب أو غير مطابقة للمواصفات أو للغرض المتفق عليه، وفقًا للقانون. وفي الحالات المستحقة، يلتزم المورد بمعالجة الطلب دون تكلفة إضافية على المستهلك.", "المادة 20 بتلزم المورد بضمان جودة المنتج وسلامته طوال فترة الضمان، وضمان مطابقته للمواصفات المتفق عليها."] },
   { heading: "إزاي تطلب إرجاع؟", bullets: ["افتح طلب دعم واذكر رقم الطلب وسبب الإرجاع، وارفق صور واضحة لو المشكلة محتاجة توضيح.", "احتفظ بالقطعة ومكوناتها وإكسسواراتها وتغليفها مع بعض أثناء مراجعة الطلب.", "ما تركّبش أو تستخدم القطعة لو شايف إنها غير مناسبة أو معيبة، إلا بالقدر اللازم لتحديد المشكلة بشكل آمن.", "اتبع تعليمات الإرجاع واحتفظ بإيصال أو رقم تتبع الشحنة المرتجعة."] },
   { heading: "الفحص واسترداد المبلغ", paragraphs: ["قد يقوم التاجر أو جهة معتمدة بفحص القطعة المرتجعة لتحديد حالتها ومدى انطباق سبب الإرجاع. الفحص لا ينتقص من أي حق قانوني للمستهلك.", "المبالغ المستحقة يتم ردها بوسيلة الدفع الأصلية قدر الإمكان، وفي المواعيد التي يحددها القانون وإجراءات مزود الدفع. التاجر مسؤول عن البيع والتزاماته القانونية تجاه المنتج، وParts Hub بتسهّل التواصل وإجراءات السوق."] },
   { heading: "تنويه قانوني", paragraphs: ["الصفحة دي ملخص عملي وليست استشارة قانونية، ولا تغني عن قانون رقم 181 لسنة 2018 ولائحته التنفيذية أو أي حق أفضل للمستهلك. لو حصل تعارض بين السياسة والقانون، القانون هو اللي يسري."] }
  ] },
  contact: { title: "تواصل مع Parts Hub", intro: "محتاج مساعدة في اختيار قطعة، أو متابعة طلب، أو تقديم مشكلة تخص الشحن أو الإرجاع؟ ابدأ من قناة الدعم.", blocks: [
   { heading: "دعم العملاء", paragraphs: ["سجّل الدخول لحسابك على Parts Hub وافتح طلب دعم. اكتب رقم الطلب لو موجود، ووصف مختصر للمشكلة، وارفق صور تساعد في توضيحها."] },
   { heading: "للتجار والورش", paragraphs: ["للاشتراك في السوق أو التسجيل كتاجر أو الاستفسار عن دليل الورش، استخدم قناة الدعم وحدد موضوع طلبك عشان نقدر نوجّهه بشكل صحيح."] }
  ] }
 };
 const content = isArabic ? ar[kind] : page;
 return <MainLayout><article className="marketplace-info-page"><div className="info-page-kicker"><ShieldCheck size={15}/><span>{isArabic ? "PARTS HUB MARKETPLACE" : "PARTS HUB MARKETPLACE"}</span></div><h1>{content.title}</h1><p className="info-page-intro">{content.intro}</p><div className="info-page-blocks">{content.blocks.map((block,index)=><section className="info-page-block" key={index}><h2>{block.heading}</h2>{block.paragraphs?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}{block.bullets&&<ul>{block.bullets.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul>}</section>)}</div><div className="info-page-quicklinks"><Link to="/support"><MessageCircle size={16}/>{isArabic?"تواصل مع الدعم":"Contact support"}<ArrowUpRight size={15}/></Link><Link to="/cars"><PackageCheck size={16}/>{isArabic?"تصفح قطع الغيار":"Browse parts"}<ArrowUpRight size={15}/></Link><Link to="/shipping-policy"><Truck size={16}/>{isArabic?"سياسة الشحن":"Shipping policy"}<ArrowUpRight size={15}/></Link></div></article></MainLayout>;
}
