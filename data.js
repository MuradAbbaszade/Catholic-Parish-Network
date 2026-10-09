/* Sample content used to populate the prototype screens */
window.DATA = {
  me: {
    name: "Fr. Thomas Whitfield", initials: "TW", color: "a1",
    role: "Parish Priest", parish: "St. Mary's, Harrogate", diocese: "Diocese of Leeds",
  },

  communities: [
    { id: "priests", name: "Priests", icon: "church", cls: "c-priests", members: 1840, desc: "A confidential space for clergy to share pastoral and practical experience.", restricted: "Verified clergy only", joined: true },
    { id: "leadership", name: "Parish Leadership", icon: "users-round", cls: "c-lead", members: 2310, desc: "Pastoral councils, parish teams and strategic planning.", joined: true },
    { id: "finance", name: "Parish Finance", icon: "landmark", cls: "c-fin", members: 1265, desc: "Budgets, Gift Aid, fundraising, audits and stewardship.", joined: true },
    { id: "admin", name: "Parish Administration", icon: "clipboard-list", cls: "c-admin", members: 1702, desc: "Office systems, registers, bookings, GDPR and communications." },
    { id: "rcia", name: "RCIA / OCIA", icon: "flame", cls: "c-rcia", members: 980, desc: "Accompanying enquirers and catechumens through Christian initiation.", joined: true },
    { id: "catechesis", name: "Catechesis", icon: "book-open", cls: "c-cat", members: 1534, desc: "Sacramental preparation, faith formation and catechist training." },
    { id: "youth", name: "Youth Ministry", icon: "sparkles", cls: "c-youth", members: 870, desc: "Engaging young people, confirmation groups and youth events." },
    { id: "evangelisation", name: "Evangelisation", icon: "megaphone", cls: "c-evan", members: 1120, desc: "Mission, outreach to the lapsed and welcoming newcomers." },
    { id: "safeguarding", name: "Safeguarding", icon: "shield-check", cls: "c-safe", members: 1410, desc: "Policy, training and good practice. No case details may be shared.", restricted: "Safeguarding reps & clergy" },
    { id: "outreach", name: "Social Outreach", icon: "hand-heart", cls: "c-out", members: 760, desc: "Food banks, SVP, refugee support and care for the vulnerable." },
  ],

  people: [
    { name: "Margaret O'Connell", initials: "MO", color: "a2", role: "Parish Administrator", parish: "St. Joseph's, Salford", diocese: "Diocese of Salford", tags: ["Administration", "GDPR"], mentor: true },
    { name: "Fr. Daniel Okafor", initials: "DO", color: "a3", role: "Parish Priest", parish: "Holy Family, Croydon", diocese: "Archdiocese of Southwark", tags: ["Evangelisation", "Multi-parish"], mentor: true },
    { name: "Helen Barrett", initials: "HB", color: "a4", role: "Finance Committee Chair", parish: "Our Lady of Lourdes, York", diocese: "Diocese of Middlesbrough", tags: ["Finance", "Gift Aid"] },
    { name: "Deacon Paul Mensah", initials: "PM", color: "a5", role: "OCIA Coordinator", parish: "St. Anne's, Leicester", diocese: "Diocese of Nottingham", tags: ["OCIA", "Catechesis"], mentor: true },
    { name: "Sr. Catherine Hale", initials: "CH", color: "a6", role: "Diocesan Formation Officer", parish: "Diocesan Curia", diocese: "Diocese of Leeds", tags: ["Catechesis", "Training"], diocesan: true },
    { name: "James Fitzgerald", initials: "JF", color: "a1", role: "Youth Ministry Leader", parish: "Sacred Heart, Liverpool", diocese: "Archdiocese of Liverpool", tags: ["Youth", "Confirmation"] },
  ],

  posts: [
    {
      id: 1, type: "Question", author: 2, community: "Parish Finance",
      title: "How are other parishes handling the move to contactless giving at Mass?",
      body: "We're a parish of around 450 Mass-goers and our weekly offertory has dropped about 18% since 2022. The finance committee is considering contactless terminals at the back of church. Has anyone found a provider that works well with Gift Aid declarations?",
      tags: ["Finance", "Gift Aid", "Medium parish"], reactions: 34, comments: 12, helpful: 9, time: "2h",
    },
    {
      id: 2, type: "Resource", author: 0, community: "Parish Administration",
      title: "Shared: Parish volunteer rota template (Excel) — with DBS tracking",
      body: "After years of paper rotas, we built this spreadsheet to manage 120 volunteers across readers, EMHCs, welcomers and counters. It tracks safeguarding training and DBS renewal dates automatically.",
      tags: ["Volunteers", "Administration", "Templates"], reactions: 88, comments: 21, helpful: 41, time: "5h",
      file: { name: "Volunteer-Rota-Template.xlsx", type: "XLS", cls: "f-xls", size: "184 KB" },
    },
    {
      id: 3, type: "Announcement", author: 4, community: "Diocese of Leeds",
      title: "Catechist formation day — Saturday 14 November, Leeds Cathedral Hall",
      body: "All parish catechists and sacramental preparation teams are warmly invited. Sessions on the new Directory for Catechesis, working with families, and safeguarding refreshers. Lunch provided.",
      tags: ["Training", "Catechesis"], reactions: 52, comments: 6, helpful: 0, time: "1d", diocesan: true,
    },
    {
      id: 4, type: "Discussion", author: 3, community: "RCIA / OCIA",
      title: "What has worked for keeping neophytes engaged after Easter?",
      body: "Mystagogy is always where we lose people. This year we tried pairing each neophyte with a parish 'companion' for 12 months. Early signs are encouraging — happy to share our companion handbook.",
      tags: ["OCIA", "Mystagogy", "Retention"], reactions: 47, comments: 18, helpful: 15, time: "1d",
    },
  ],

  resources: [
    { title: "Annual Parish Budget Template", type: "XLS", cls: "f-xls", ministry: "Finance", size: "Any size", rating: 4.8, reviews: 126, downloads: "2.1k", author: "Helen Barrett", verified: true },
    { title: "Volunteer Recruitment Playbook", type: "PDF", cls: "f-pdf", ministry: "Leadership", size: "Medium", rating: 4.7, reviews: 84, downloads: "1.4k", author: "Margaret O'Connell" },
    { title: "OCIA Companion Handbook", type: "DOC", cls: "f-doc", ministry: "OCIA", size: "Any size", rating: 4.9, reviews: 61, downloads: "980", author: "Deacon Paul Mensah", verified: true },
    { title: "Lenten Appeal Fundraising Plan", type: "PPT", cls: "f-ppt", ministry: "Finance", size: "Large", rating: 4.5, reviews: 39, downloads: "720", author: "Fr. Daniel Okafor" },
    { title: "First Communion Parent Sessions (6 weeks)", type: "PDF", cls: "f-pdf", ministry: "Catechesis", size: "Any size", rating: 4.6, reviews: 102, downloads: "1.9k", author: "Sr. Catherine Hale", verified: true },
    { title: "Parish Data Protection Checklist (UK GDPR)", type: "DOC", cls: "f-doc", ministry: "Administration", size: "Any size", rating: 4.8, reviews: 143, downloads: "3.2k", author: "Margaret O'Connell", verified: true },
  ],

  threads: [
    { who: 0, preview: "Thank you Father — I'll send the rota template over now.", time: "10:42", unread: 2 },
    { who: 1, preview: "Would you be open to a call about merging Mass schedules?", time: "Yesterday", unread: 0 },
    { who: 3, preview: "The companion handbook is attached. Let me know your thoughts.", time: "Tue", unread: 0 },
    { who: 4, preview: "Formation day registration is now open for your catechists.", time: "Mon", unread: 0 },
    { who: 2, preview: "Our Gift Aid claim went through in 3 weeks using the new portal.", time: "Oct 2", unread: 0 },
  ],

  notifications: [
    { icon: "message-circle", color: "a1", text: "<b>Margaret O'Connell</b> sent you a message", sub: "\"Thank you Father — I'll send the rota template over now.\"", time: "10 min", unread: true },
    { icon: "badge-check", color: "a3", text: "Your answer was marked <b>helpful</b> by <b>Helen Barrett</b>", sub: "How are other parishes handling contactless giving?", time: "1h", unread: true },
    { icon: "megaphone", color: "a6", text: "<b>Diocese of Leeds</b> posted an announcement", sub: "Catechist formation day — Saturday 14 November", time: "1d", unread: true },
    { icon: "file-text", color: "a4", text: "New resource in <b>Parish Finance</b>", sub: "Annual Parish Budget Template v3 — 4.8 ★", time: "2d" },
    { icon: "user-plus", color: "a5", text: "<b>Deacon Paul Mensah</b> accepted your connection request", sub: "St. Anne's, Leicester · Diocese of Nottingham", time: "3d" },
    { icon: "users", color: "a2", text: "You were invited to the private group <b>Harrogate Deanery Clergy</b>", sub: "Invited by Fr. Michael Dunn", time: "4d" },
  ],
};
