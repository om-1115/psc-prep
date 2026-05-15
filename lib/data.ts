export type Exam = "UPSC Pre" | "CGPSC Pre";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Topic {
  id: string;
  name: string;
  short: string;
  count: number;
  color: string;
}

export interface Question {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  topic: string;
  sub: string;
  year: number;
  exam: Exam;
  diff: Difficulty;
  freq: number;
}

export interface RecentFile {
  name: string;
  kind: "bank" | "paper";
  questions: number;
  when: string;
}

export interface ExamPaper {
  title: string;
  paperCode: string;
  totalQ: number;
  totalMarks: number;
  detected: string;
  breakdown: { topic: string; count: number }[];
}

export const PQ_TOPICS: Topic[] = [
  { id: "polity",      name: "Polity & Governance", short: "Polity",     count: 234, color: "#3b5ba0" },
  { id: "history",     name: "Modern History",      short: "History",    count: 187, color: "#a04a3b" },
  { id: "geography",   name: "Geography",           short: "Geography",  count: 156, color: "#3b8a5e" },
  { id: "economy",     name: "Economy",             short: "Economy",    count: 142, color: "#a07a3b" },
  { id: "sci-tech",    name: "Science & Tech",      short: "Sci & Tech", count: 98,  color: "#7a3ba0" },
  { id: "environment", name: "Environment",         short: "Environ.",   count: 87,  color: "#3ba07a" },
  { id: "culture",     name: "Art & Culture",       short: "Culture",    count: 76,  color: "#a03b7a" },
  { id: "cg",          name: "Chhattisgarh GK",     short: "CG GK",      count: 124, color: "#8a7a3b" },
];

export const PQ_QUESTIONS: Question[] = [
  {
    id: "q1",
    q: "Consider the following statements regarding the office of the Vice-President of India:\n1. The Vice-President is the ex-officio Chairman of the Rajya Sabha.\n2. The Vice-President is elected by an electoral college consisting of members of both Houses of Parliament and the elected members of State Legislative Assemblies.\nWhich of the statements given above is/are correct?",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 0,
    explain: "The electoral college for the Vice-President consists only of members of both Houses of Parliament (elected and nominated). State Legislative Assemblies do not participate — Statement 2 is incorrect.",
    topic: "polity", sub: "Executive", year: 2023, exam: "UPSC Pre", diff: "Medium", freq: 4,
  },
  {
    id: "q2",
    q: "The \"Doctrine of Lapse\" associated with British expansion in India was introduced by which Governor-General?",
    options: ["Lord Wellesley", "Lord Dalhousie", "Lord Curzon", "Lord Bentinck"],
    answer: 1,
    explain: "Lord Dalhousie (1848–1856) introduced the Doctrine of Lapse, by which states without a natural heir would lapse to the British. Satara was the first state annexed under this doctrine in 1848.",
    topic: "history", sub: "British Expansion", year: 2022, exam: "CGPSC Pre", diff: "Easy", freq: 6,
  },
  {
    id: "q3",
    q: "Which of the following rivers does NOT originate in Chhattisgarh?",
    options: ["Mahanadi", "Indravati", "Narmada", "Shivnath"],
    answer: 2,
    explain: "The Narmada originates at Amarkantak in Madhya Pradesh. The Mahanadi, Indravati and Shivnath all originate within Chhattisgarh.",
    topic: "cg", sub: "Physical Geography", year: 2023, exam: "CGPSC Pre", diff: "Easy", freq: 5,
  },
  {
    id: "q4",
    q: "With reference to the \"Repo Rate\" in India, which of the following statements is correct?",
    options: [
      "It is the rate at which commercial banks lend to the RBI.",
      "It is the rate at which the RBI lends short-term funds to commercial banks against government securities.",
      "It is the rate at which commercial banks lend to one another in the call money market.",
      "It is the rate at which the RBI buys government bonds from the open market.",
    ],
    answer: 1,
    explain: "The repo rate is the rate at which the RBI lends short-term funds to commercial banks against the collateral of government securities. The reverse direction is the reverse repo rate.",
    topic: "economy", sub: "Monetary Policy", year: 2021, exam: "UPSC Pre", diff: "Medium", freq: 7,
  },
  {
    id: "q5",
    q: "The \"Achanakmar-Amarkantak\" Biosphere Reserve is spread across which of the following states?",
    options: ["Chhattisgarh and Odisha", "Chhattisgarh and Madhya Pradesh", "Chhattisgarh, Madhya Pradesh and Maharashtra", "Madhya Pradesh and Jharkhand"],
    answer: 1,
    explain: "The Achanakmar-Amarkantak Biosphere Reserve, notified in 2005, lies in Chhattisgarh and Madhya Pradesh. It covers parts of Bilaspur, Anuppur and Dindori districts.",
    topic: "environment", sub: "Biosphere Reserves", year: 2023, exam: "CGPSC Pre", diff: "Hard", freq: 3,
  },
  {
    id: "q6",
    q: "Article 32 of the Indian Constitution, which Dr. B.R. Ambedkar described as the \"heart and soul\" of the Constitution, deals with:",
    options: ["Right to Property", "Right to Constitutional Remedies", "Right to Education", "Cultural and Educational Rights"],
    answer: 1,
    explain: "Article 32 provides the Right to Constitutional Remedies — the right to move the Supreme Court for enforcement of Fundamental Rights through writs.",
    topic: "polity", sub: "Fundamental Rights", year: 2020, exam: "UPSC Pre", diff: "Easy", freq: 8,
  },
  {
    id: "q7",
    q: "CRISPR-Cas9, frequently in the news, is a:",
    options: ["Type of vaccine", "Gene-editing technology", "Quantum computing algorithm", "Satellite imaging system"],
    answer: 1,
    explain: "CRISPR-Cas9 is a gene-editing tool that allows precise modification of DNA in living organisms. Emmanuelle Charpentier and Jennifer Doudna received the 2020 Nobel in Chemistry for its development.",
    topic: "sci-tech", sub: "Biotechnology", year: 2022, exam: "UPSC Pre", diff: "Easy", freq: 5,
  },
  {
    id: "q8",
    q: "The Bastar region of Chhattisgarh is famous for which of the following tribal art forms?",
    options: ["Madhubani painting", "Dhokra metal craft", "Phad painting", "Pattachitra"],
    answer: 1,
    explain: "Dhokra (or Dokra) is a non-ferrous metal casting technique using the lost-wax process, practised for over 4,000 years by the artisans of Bastar.",
    topic: "culture", sub: "Tribal Crafts", year: 2022, exam: "CGPSC Pre", diff: "Medium", freq: 4,
  },
  {
    id: "q9",
    q: "The Tropic of Cancer passes through how many Indian states?",
    options: ["Six", "Seven", "Eight", "Nine"],
    answer: 2,
    explain: "The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.",
    topic: "geography", sub: "Indian Geography", year: 2021, exam: "CGPSC Pre", diff: "Medium", freq: 5,
  },
  {
    id: "q10",
    q: "Who was the founder of the \"Brahmo Samaj\" in 1828?",
    options: ["Swami Vivekananda", "Raja Ram Mohan Roy", "Dayanand Saraswati", "Ishwar Chandra Vidyasagar"],
    answer: 1,
    explain: "Raja Ram Mohan Roy founded the Brahmo Sabha in 1828, which was later reorganised as the Brahmo Samaj. He is regarded as the father of the Indian Renaissance.",
    topic: "history", sub: "Socio-Religious Reform", year: 2023, exam: "UPSC Pre", diff: "Easy", freq: 8,
  },
  {
    id: "q11",
    q: "Under the Indian Constitution, the \"Money Bill\" is defined in which Article?",
    options: ["Article 109", "Article 110", "Article 111", "Article 112"],
    answer: 1,
    explain: "Article 110 defines a Money Bill. It can be introduced only in the Lok Sabha on the recommendation of the President, and the Speaker certifies whether a bill is a Money Bill.",
    topic: "polity", sub: "Parliament", year: 2023, exam: "CGPSC Pre", diff: "Medium", freq: 5,
  },
  {
    id: "q12",
    q: "The \"Hasdeo Arand\" coalfield, often in the news regarding mining vs. forest rights, is located in which district of Chhattisgarh?",
    options: ["Korba", "Sarguja", "Raigarh", "Surajpur"],
    answer: 1,
    explain: "The Hasdeo Arand forest, one of central India's largest contiguous stretches of dense forest, lies primarily in Sarguja district (with parts in Korba and Surajpur).",
    topic: "cg", sub: "Current CG Affairs", year: 2024, exam: "CGPSC Pre", diff: "Hard", freq: 4,
  },
];

export const PQ_EXAM_PAPER: ExamPaper = {
  title: "CGPSC State Service Pre · 2023",
  paperCode: "Paper I · General Studies",
  totalQ: 100,
  totalMarks: 200,
  detected: "12 May 2026, 4:18 pm",
  breakdown: [
    { topic: "polity",      count: 18 },
    { topic: "history",     count: 14 },
    { topic: "geography",   count: 12 },
    { topic: "cg",          count: 22 },
    { topic: "economy",     count: 10 },
    { topic: "environment", count: 8 },
    { topic: "sci-tech",    count: 9 },
    { topic: "culture",     count: 7 },
  ],
};

export const PQ_RECENT: RecentFile[] = [
  { name: "UPSC Pre GS 2023.pdf",       kind: "paper", questions: 100,  when: "2 days ago" },
  { name: "CGPSC PYQ Bank 2010-22.pdf", kind: "bank",  questions: 1247, when: "5 days ago" },
  { name: "CGPSC Pre 2022.pdf",         kind: "paper", questions: 100,  when: "2 weeks ago" },
];
