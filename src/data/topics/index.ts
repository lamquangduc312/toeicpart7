// Registry của các chuyên đề TOEIC ETS Part 7.
//
// THÊM CHUYÊN ĐỀ MỚI (3 bước):
//   1. Tạo tệp dữ liệu src/data/topics/<slug>.ts theo đúng định dạng của các
//      tệp hiện có (xuất từ landing page chuyên đề: title + labels + raw).
//   2. Thêm một dòng loader cho <slug> trong bảng `loaders` bên dưới.
//   3. Thêm một mục TopicMeta trong mảng TOPICS (tên, mô tả, số liệu).
// Không cần sửa gì khác: trang chủ, trang danh sách và trang chuyên đề tự cập nhật.

export type ToeicTable = { rows: string[][][] };
export type ToeicRawItem = string | ToeicTable;
export type ToeicRaw = ToeicRawItem[];

/** Dữ liệu thô của một chuyên đề: mảng văn bản + bảng (xuất từ landing page gốc). */
export type TopicData = { title: string; labels: string[]; raw: ToeicRaw };

export interface TopicStats {
  lessons: number;
  /** Số câu hỏi ETS gốc — bỏ qua nếu chưa thống kê. */
  questions?: number;
  /** Số thẻ từ vựng — bỏ qua nếu chưa thống kê. */
  vocab?: number;
  /** Số cặp paraphrase / thuật ngữ trong bảng tổng hợp nạp Anki. */
  pairs: number;
  /** "cặp Paraphrase" hoặc "thuật ngữ vàng". */
  pairsLabel: string;
}

export interface TopicMeta {
  slug: string;
  /** Tên ngắn hiển thị trên thẻ và menu. */
  name: string;
  /** Tên đầy đủ của chuyên đề. */
  title: string;
  /** Dòng tiếng Anh dưới tiêu đề. */
  enSub: string;
  /** Mô tả một dòng cho thẻ chuyên đề. */
  desc: string;
  stats: TopicStats;
  /** Đường dẫn tới trang landing page HTML độc lập. */
  landingUrl?: string;
}

const loaders: Record<string, () => Promise<{ default: TopicData }>> = {
  banle_tmdt_rma: () => import("./banle_tmdt_rma"),
  baotri_cosovatchat: () => import("./baotri_cosovatchat"),
  batdongsan_thuematbang: () => import("./batdongsan_thuematbang"),
  chuyendoixanh_esg: () => import("./chuyendoixanh_esg"),
  congtac_sukien: () => import("./congtac_sukien"),
  daotaonoibo: () => import("./daotaonoibo"),
  dichvukhachhang: () => import("./dichvukhachhang"),
  hopdongthuongmai_sla: () => import("./hopdongthuongmai_sla"),
  hopdong_phaply_sla_baohanh: () => import("./hopdong_phaply_sla_baohanh"),
  it_telecom: () => import("./it_telecom"),
  logistics: () => import("./logistics"),
  marketingso_pr: () => import("./marketingso_pr"),
  muasam_b2b: () => import("./muasam_b2b"),
  quantrinhansu_kpi: () => import("./quantrinhansu_kpi"),
  taichinh_nganhang: () => import("./taichinh_nganhang"),
  tuyendung_thietke: () => import("./tuyendung_thietke"),
};

export const TOPICS: TopicMeta[] = [
  {
    slug: "banle_tmdt_rma",
    name: "Bán lẻ & TMĐT (RMA)",
    title: "Bán lẻ đa kênh, thương mại điện tử, đổi trả hàng hóa (RMA) & chính sách hoàn tiền",
    enSub: "Omnichannel Retail, E-Commerce, RMA & Refund Policies",
    desc: "Mua online nhận tại shop (BOPIS), đổi trả đa kênh BORIS, cấp mã RMA, xử lý hàng vỡ và logistics ngược.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/banle_tmdt_rma.html",
  },
  {
    slug: "baotri_cosovatchat",
    name: "Bảo trì & Cơ sở vật chất",
    title: "Bảo trì thiết bị kỹ thuật, quản lý cơ sở vật chất & an toàn lao động",
    enSub: "Facility Management, Equipment Maintenance & Workplace Safety",
    desc: "Bảo trì hệ thống HVAC, sự cố thang máy theo SLA, diễn tập PCCC, quản lý tòa nhà và an toàn lao động PPE.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/baotri_cosovatchat.html",
  },
  {
    slug: "batdongsan_thuematbang",
    name: "Bất động sản & Thuê mặt bằng",
    title: "Bất động sản thương mại, thuê mặt bằng & quản lý tòa nhà",
    enSub: "Commercial Real Estate, Lease Negotiation & Property Management",
    desc: "Hợp đồng thuê mặt bằng bán lẻ TI, phí quản lý CAM, cải tạo giấy phép, gia hạn và thẩm định bất động sản.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/batdongsan_thuematbang.html",
  },
  {
    slug: "chuyendoixanh_esg",
    name: "Chuyển đổi xanh & ESG",
    title: "Chuyển đổi xanh, môi trường & báo cáo phát triển bền vững ESG",
    enSub: "Green Transformation, Environmental Compliance & ESG Sustainability",
    desc: "Kiểm toán carbon, điện tái tạo PPA, chứng chỉ công trình xanh LEED, kinh tế tuần hoàn và báo cáo Net-Zero.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/chuyendoixanh_esg.html",
  },
  {
    slug: "congtac_sukien",
    name: "Công tác & Sự kiện",
    title: "Công tác doanh nghiệp, tổ chức sự kiện & hội nghị quốc tế",
    enSub: "Corporate Travel, Event Planning & International Conferences",
    desc: "Đặt phòng đoàn, công tác phí hoàn ứng, sự cố thời tiết đổi vé máy bay, thuê địa điểm hội nghị và Gala doanh nghiệp.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/congtac_sukien.html",
  },
  {
    slug: "daotaonoibo",
    name: "Đào tạo nội bộ & Văn hóa",
    title: "Đào tạo kỹ năng nội bộ & phát triển văn hóa doanh nghiệp",
    enSub: "Internal Training, Corporate Culture & Workforce Upskilling",
    desc: "Quy trình onboarding nhân viên mới, đào tạo an ninh mạng bắt buộc, chuyển đổi hệ thống LMS và khảo sát gắn kết eNPS.",
    stats: { lessons: 9, questions: 45, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/daotaonoibo.html",
  },
  {
    slug: "dichvukhachhang",
    name: "Dịch vụ khách hàng",
    title: "Dịch vụ khách hàng, xử lý sự cố kỹ thuật & khiếu nại cước phí",
    enSub: "Customer Service, Technical Incident Handling & Billing Disputes",
    desc: "Ticket sự cố kỹ thuật, hoàn cước bị trừ đúp, khiếu nại nhà cung cấp — tình huống chăm sóc khách hàng gặp hằng ngày.",
    stats: { lessons: 9, questions: 45, pairs: 45, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/dichvukhachhang.html",
  },
  {
    slug: "hopdongthuongmai_sla",
    name: "Hợp đồng & SLA",
    title: "Hợp đồng thương mại, điều khoản SLA & pháp lý doanh nghiệp",
    enSub: "Commercial Contracts, SLA Clauses & Corporate Legal Affairs",
    desc: "Điều khoản SLA, phạt chậm tiến độ, đặt cọc, bảo hành và tranh chấp hợp đồng thương mại.",
    stats: { lessons: 10, questions: 50, pairs: 60, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/hopdongthuongmai_sla.html",
  },
  {
    slug: "hopdong_phaply_sla_baohanh",
    name: "Hợp đồng, pháp lý & bảo hành",
    title: "Hợp đồng thương mại, đàm phán SLA, tuân thủ pháp lý, bảo hành & giải quyết tranh chấp",
    enSub: "Contracts, SLA Negotiation, Legal Compliance, Warranty & Dispute Resolution",
    desc: "Đàm phán SLA, tuân thủ pháp lý, bảo hành sản xuất và giải quyết tranh chấp giữa các bên.",
    stats: { lessons: 10, questions: 50, vocab: 70, pairs: 60, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/hopdong_phaply_sla_baohanh.html",
  },
  {
    slug: "it_telecom",
    name: "IT & Viễn thông",
    title: "Hạ tầng CNTT, viễn thông, đám mây SaaS, SLA & tự động hóa RPA",
    enSub: "IT Infrastructure, Telecom, Cloud SaaS, SLA & RPA Automation",
    desc: "ERP lên đám mây, hotfix & UAT, đứt cáp quang, RPA & chatbot AI, an ninh MFA, data center & DR.",
    stats: { lessons: 9, questions: 45, vocab: 72, pairs: 50, pairsLabel: "cặp Paraphrase" },
    landingUrl: "/landing/it_telecom.html",
  },
  {
    slug: "logistics",
    name: "Logistics & chuỗi cung ứng",
    title: "Logistics & quản lý chuỗi cung ứng",
    enSub: "Logistics, Supply Chain Management, Freight Forwarding & Warehousing",
    desc: "Vận tải biển 3PL, hàng không khẩn cấp, kho tự động WMS/AGV, giao trễ & phạt SLA, khủng hoảng container.",
    stats: { lessons: 9, questions: 45, vocab: 56, pairs: 50, pairsLabel: "cặp Paraphrase" },
    landingUrl: "/landing/logistics.html",
  },
  {
    slug: "marketingso_pr",
    name: "Marketing số & PR",
    title: "Marketing số, PR, quảng bá thương hiệu & ra mắt sản phẩm",
    enSub: "Digital Marketing, PR, Brand Promotion & Product Launch",
    desc: "Thông cáo báo chí, chiến dịch đa kênh, ROAS, ra mắt sản phẩm và xử lý khủng hoảng truyền thông.",
    stats: { lessons: 10, questions: 50, pairs: 50, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/marketingso_pr.html",
  },
  {
    slug: "muasam_b2b",
    name: "Mua sắm B2B",
    title: "Mua sắm doanh nghiệp B2B, đấu thầu, hóa đơn, đối soát công nợ & thanh toán ngân hàng",
    enSub: "B2B Procurement, Tendering, Invoicing, Reconciliation & Bank Payments",
    desc: "Đấu thầu, yêu cầu báo giá RFQ, hóa đơn EDI, đối soát công nợ và thanh toán ngân hàng quốc tế.",
    stats: { lessons: 10, questions: 50, vocab: 80, pairs: 50, pairsLabel: "cặp Paraphrase" },
    landingUrl: "/landing/muasam_b2b.html",
  },
  {
    slug: "quantrinhansu_kpi",
    name: "Quản trị nhân sự & KPI",
    title: "Quản trị nhân sự toàn diện, tuyển dụng, đãi ngộ phúc lợi & đánh giá hiệu suất KPI",
    enSub: "HR Management, Recruiting, Compensation & KPI Performance Review",
    desc: "Kế nhiệm lãnh đạo, đánh giá KPI, đãi ngộ phúc lợi và tuyển dụng nhân sự cấp cao.",
    stats: { lessons: 9, questions: 45, pairs: 54, pairsLabel: "thuật ngữ vàng" },
    landingUrl: "/landing/quantrinhansu_kpi.html",
  },
  {
    slug: "taichinh_nganhang",
    name: "Tài chính & Ngân hàng",
    title: "Tài chính doanh nghiệp, phân tích đầu tư, công cụ ngân hàng & báo cáo thường niên",
    enSub: "Corporate Finance, Investment Analysis, Banking Instruments & Annual Reports",
    desc: "Báo cáo thường niên, phân tích đầu tư, tín dụng chứng từ và các công cụ ngân hàng doanh nghiệp.",
    stats: { lessons: 10, questions: 50, vocab: 80, pairs: 50, pairsLabel: "cặp Paraphrase" },
    landingUrl: "/landing/taichinh_nganhang.html",
  },
  {
    slug: "tuyendung_thietke",
    name: "Tuyển dụng & Thiết kế",
    title: "Tuyển dụng nhân sự, thiết kế công nghiệp & quản trị R&D",
    enSub: "Recruiting, Industrial Design & R&D Management",
    desc: "Tin tuyển dụng, phỏng vấn, đề án R&D và thiết kế công nghiệp sản phẩm mới.",
    stats: { lessons: 9, questions: 45, vocab: 58, pairs: 50, pairsLabel: "cặp Paraphrase" },
    landingUrl: "/landing/tuyendung_thietke.html",
  },
];

export function hasTopic(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(loaders, slug);
}

export function getTopicMeta(slug: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/** Nạp dữ liệu thô của một chuyên đề (dynamic import → mỗi chuyên đề một bundle riêng). */
export async function loadTopic(slug: string): Promise<TopicData> {
  const loader = loaders[slug];
  if (!loader) throw new Error(`Không có chuyên đề: ${slug}`);
  return (await loader()).default;
}
