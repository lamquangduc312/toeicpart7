// Chuyển dữ liệu thô của một chuyên đề (mảng dòng văn bản + bảng) thành cấu trúc bài học.
// Logic tách bài/phần/đáp án được port từ renderer của landing page gốc, nên mọi
// chuyên đề mới cùng định dạng sẽ hiển thị đúng mà không cần sửa code.
import type { ToeicRaw, ToeicRawItem, ToeicTable, TopicData } from "@/data/topics";

export type Item = ToeicRawItem;
export interface SubSection { id: string; title: string; items: Item[] }
export interface Part { n: number; title: string; items: Item[]; subs: SubSection[] }
export interface WrongOption { k: string; t: string; why: string; trap: string }
export interface Answer {
  no: string; k: string; t: string; stem: string;
  trace: string; expl: string; para: string[]; wrong: WrongOption[];
}
export interface Question { no: string; stem: string; options: { k: string; t: string }[] }
export interface Lesson {
  n: number; label: string; vi: string; en: string; src: string; qr: string;
  parts: Part[]; answers: Answer[]; questions: Question[];
}
export interface ParsedTopic {
  intro: string[]; lessons: Lesson[]; finalTitle: string; finalTable: ToeicTable | null;
}

const VI_RE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const isStr = (x: unknown): x is string => typeof x === "string";

export function parseTopic(data: TopicData): ParsedTopic {
  const RAW: ToeicRaw = data.raw;
  const intro = RAW.slice(0, 3).filter(isStr);
  const raws: Item[][] = [];
  let cur: Item[] | null = null;
  let finalTable: ToeicTable | null = null;
  let finalTitle = "";
  for (let i = 3; i < RAW.length; i++) {
    const it = RAW[i];
    if (isStr(it) && /^[=\-]{10,}$/.test(it)) continue;
    if (isStr(it) && /^BÀI THỰC HÀNH SỐ\s*\d+/.test(it)) {
      const t = it.replace(/^BÀI THỰC HÀNH SỐ\s*\d+\s*:?\s*/, "");
      cur = t ? [t] : []; raws.push(cur); continue;
    }
    if (isStr(it) && /^BÀI\s+\d+\s*:/.test(it)) {
      cur = [it.replace(/^BÀI\s+\d+\s*:\s*/, "")]; raws.push(cur); continue;
    }
    if (isStr(it) && /^(BẢNG TỔNG HỢP|PHẦN TỔNG KẾT|PHAN TONG KET)/.test(it)) {
      cur = null; finalTitle = it; continue;
    }
    if (!cur) { if (!isStr(it)) finalTable = it; continue; }
    cur.push(it);
  }
  if (!finalTable && raws.length) {
    const last = raws[raws.length - 1];
    const tail = last[last.length - 1];
    if (tail && !isStr(tail)) { finalTable = tail; last.pop(); }
  }
  const lessons = raws.map((items, idx) => buildLesson(items, idx, data.labels[idx]));
  return { intro, lessons, finalTitle, finalTable };
}

function buildLesson(items: Item[], idx: number, short?: string): Lesson {
  let t = String(items[0] ?? "");
  const tq = t.match(/\s*\((Questions?\s*\d+\s*-\s*\d+[^()]*)\)\s*$/);
  if (tq) t = t.slice(0, tq.index);
  const m = t.match(/^(.*)\s\(([^()]*)\)\s*$/);
  const nw = m ? m[2].split(/\s+/).length : 0;
  const isEn = !!m && !VI_RE.test(m[2]) &&
    (nw >= 4 || (nw >= 2 && m[2] === m[2].toUpperCase() && /[A-Z]/.test(m[2])));
  const vi = isEn && m ? m[1] : t;
  const en = isEn && m ? m[2] : "";
  const src = String(items[1] ?? "").replace(/^Nguồn( bài học)?:\s*/, "");
  const q = (src + " " + String(items[0])).match(/Questions?\s*(\d+)\s*-\s*(\d+)/);
  const qr = q ? `Q${q[1]}–${q[2]}` : "";
  let label = short ?? "";
  if (!label) {
    const w = vi.split(/\s+/).slice(0, 4).join(" ").toLowerCase();
    label = w.charAt(0).toUpperCase() + w.slice(1);
  }

  const parts: Part[] = [];
  let P: Part | null = null;
  let S: SubSection | null = null;
  for (const it of items.slice(2)) {
    if (isStr(it)) {
      const pm = it.match(/^PHẦN\s*(\d)\s*:\s*(.*)$/i);
      if (pm) { P = { n: +pm[1], title: pm[2], subs: [], items: [] }; parts.push(P); S = null; continue; }
      const sm = it.match(/^(\d\.\d)\.\s+(.*)$/);
      if (sm && P && +sm[1][0] === P.n) { S = { id: sm[1], title: sm[2], items: [] }; P.subs.push(S); continue; }
    }
    if (S) S.items.push(it); else if (P) P.items.push(it);
  }

  if (!parts.length) {
    // Định dạng khác: các mục "1. ĐỀ BÀI GỐC", "2. CHIẾN LƯỢC ..." thay cho "PHẦN N:"
    let Q: Part | null = null;
    for (const it of items.slice(2)) {
      const hm = isStr(it) ? it.match(/^(\d{1,2})\.\s+([A-ZĐÀ-Ỹ].*)$/) : null;
      if (hm && isStr(it) && hm[2].slice(0, 6) === hm[2].slice(0, 6).toUpperCase()) {
        Q = { n: +hm[1], title: hm[2], subs: [], items: [] }; parts.push(Q); continue;
      }
      if (!Q) { Q = { n: 0, title: "Giới thiệu", subs: [], items: [] }; parts.push(Q); }
      Q.items.push(it);
    }
  }
  const flat = items.slice(2);
  const questions = parseQuestions(flat);
  const answers = parseAnswers(flat, questions);
  for (const q of questions) if (!q.stem) q.stem = answers.find((a) => a.no === q.no)?.stem ?? `Câu ${q.no}`;
  return { n: idx + 1, label, vi, en, src, qr, parts, answers, questions };
}

function parseAnswers(items: Item[], qs: Question[]): Answer[] {
  const out: Answer[] = [];
  let a: Answer | null = null;
  let sec = "";
  let prev = "";
  const newA = (no: string, stem: string) => {
    a = { no, k: "", t: "", stem, trace: "", expl: "", para: [], wrong: [] };
    out.push(a); sec = "";
    return a;
  };
  for (const s of items) {
    if (!isStr(s)) { a = null; continue; }
    const p = prev; prev = s;
    if (/^PHẦN\s*\d|^\d\.\d\.\s|^\d\.\s+[A-ZĐ]{2}/.test(s)) { a = null; continue; }
    let m = s.match(/^(\d{3})\.\s*\(([A-D])\)\s*(.*)$/);
    if (m) { const A = newA(m[1], qs.find((q) => q.no === m![1])?.stem ?? ""); A.k = m[2]; A.t = m[3]; continue; }
    m = s.match(/^(?:Dap an dung|Đáp án đúng)\s*:\s*\(([A-D])\)\s*(.*)$/i);
    if (m) {
      const nm = p.match(/^(\d{3})\.?\s+(.*)$/);
      const no = nm ? nm[1] : qs[out.length]?.no ?? String(out.length + 1);
      const A = newA(no, nm ? nm[2] : p);
      A.k = m[1]; A.t = m[2]; continue;
    }
    const A = a as Answer | null;
    if (!A) continue;
    m = s.match(/^\[([^\]]+)\]:?\s*(.*)$/);
    if (m) {
      const lab = m[1], rest = m[2];
      if (/^Dau vet|^Dấu vết/i.test(lab)) { sec = "trace"; A.trace = rest; }
      else if (/Paraphrase|Dien dat|Diễn đạt/i.test(lab)) { sec = "para"; rest.split(/\s*•\s*/).filter(Boolean).forEach((x) => A.para.push(x)); }
      else if (/Phuong an Sai|Bay|Bẫy/i.test(lab)) { sec = "wrong"; }
      else { sec = "expl"; A.expl += (A.expl ? " " : "") + rest; }
      continue;
    }
    if (sec === "wrong") {
      m = s.match(/^\(([A-D])\)\s*(.*)$/);
      if (m) { A.wrong.push({ k: m[1], t: m[2], why: "", trap: "" }); continue; }
      const w = A.wrong[A.wrong.length - 1];
      m = s.match(/^-\s*(Ly do sai|Lý do sai|Bay ETS|Bẫy ETS)\s*:\s*(.*)$/i);
      if (w && m) { if (/^L/i.test(m[1])) w.why = m[2]; else w.trap = m[2]; continue; }
      // dòng tiếp theo là câu hỏi mới (không đánh số) → dừng
      continue;
    }
    if (sec === "para" && /^•/.test(s)) { A.para.push(s.replace(/^•\s*/, "")); continue; }
    if (sec === "trace") { A.trace += " " + s; continue; }
    if (sec === "expl") A.expl += " " + s;
  }
  return out.filter((x) => x.k);
}

/** Câu hỏi tiếng Anh gốc (sau dòng "[ORIGINAL ETS QUESTIONS ...]"). */
function parseQuestions(items: Item[]): Question[] {
  const qs: Question[] = [];
  const start = items.findIndex((x) => isStr(x) && /QUESTIONS/i.test(x) && /^\[/.test(x));
  if (start < 0) return qs;
  let q: Question | null = null;
  for (const x of items.slice(start + 1)) {
    if (!isStr(x)) break;
    if (/^\d\.\d\.\s|^PHẦN|^\d\.\s+[A-ZĐ]{2}/.test(x)) break;
    const m = x.match(/^(?:Question\s*)?(\d{3})\.?(?:\s+(.*))?$/);
    if (m) { q = { no: m[1], stem: m[2] ?? "", options: [] }; qs.push(q); continue; }
    const o = x.match(/^\(([A-D])\)\s*(.*)$/);
    if (o && q) { q.options.push({ k: o[1], t: o[2] }); continue; }
    if (q && !q.options.length) q.stem += (q.stem ? " " : "") + x;
  }
  return qs.filter((x) => x.options.length >= 2);
}

/** Đoạn văn bài đọc của mục 1.1, bỏ phần câu hỏi (đã hiển thị dạng trắc nghiệm). */
export function passageItems(items: Item[]): Item[] {
  const i = items.findIndex((x) => isStr(x) && /QUESTIONS/i.test(x) && /^\[/.test(x));
  return i < 0 ? items : items.slice(0, i);
}
