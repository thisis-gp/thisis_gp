// Work at Nova Benefits. Wording follows the owner's resume. Update with PROFILE.md.
// These are the owner's own figures from his work, not measured by this site.
export const WORK = {
  role: "Software Development Engineer I",
  company: "Nova Benefits, Bangalore",
  note: "Joined as an SDE intern and converted to full-time.",
  items: [
    { title: "Quarterly review decks", text: "Cut client quarterly-review deck preparation from 3 hours to 20 minutes across 160 decks, with a Python KPI engine over insurer and TPA claims data and an async export queue." },
    { title: "Claro, a conversational assistant", text: "Cut hallucinated answers by 60% and latency by 29% in a production conversational AI assistant, by owning its retrieval and safety layers: cross-encoder reranking and fail-closed PHI masking." },
    { title: "Insurer and TPA integrations", text: "Brought 4 new insurer and TPA claim systems onto an 82K-claim platform and maintain 2 more, with one-click claim intimation, automatic status sync and batch ingestion that keeps running when a partner API fails." },
    { title: "Document extraction", text: "Auto-filled 2,782 claim forms by extending an OCR system that reads identity documents, with GPT plus regex address extraction and better failure handling." },
    { title: "Customer feedback", text: "Collected 9,461 customer-satisfaction responses (8.38 out of 10) with outreach over email, WhatsApp and a voice agent that calls customers, with scheduling, delivery tracking and Slack alerts." },
  ],
} as const;
