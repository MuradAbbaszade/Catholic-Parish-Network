(function () {
  const D = window.DATA;
  const root = document.getElementById("root");

  /* ---------------- Helpers ---------------- */
  const icon = (name, size = 20, extra = "") =>
    `<i data-lucide="${name}" width="${size}" height="${size}" ${extra}></i>`;
  const verified = () => `<span class="verified" title="Verified">${icon("badge-check", 17)}</span>`;
  const avatar = (p, size = "") => `<div class="avatar ${size} ${p.color}">${p.initials}</div>`;
  const stars = (r) => {
    let s = "";
    for (let i = 1; i <= 5; i++) s += icon("star", 15, i <= Math.round(r) ? "" : 'style="opacity:.3"');
    return `<span class="stars">${s}</span>`;
  };
  const brand = (dark = true) => `
    <div class="brand" style="${dark ? "" : "color:var(--navy-900)"}">
      <div class="brand-mark">${icon("cross", 22)}</div>
      <div><div class="brand-name">Parish Network</div><div class="brand-sub">Catholic · Verified</div></div>
    </div>`;
  const pagehead = (eyebrow, title, sub, actions = "") => `
    <div class="page-head">
      <div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<p class="muted" style="margin:0">${sub}</p>` : ""}</div>
      <div class="row wrap">${actions}</div>
    </div>`;

  const NAV = [
    { id: "feed", label: "Home", icon: "home" },
    { id: "communities", label: "Communities", icon: "users" },
    { id: "library", label: "Resource Library", icon: "library" },
    { id: "discover", label: "Discover", icon: "compass" },
    { id: "messages", label: "Messages", icon: "message-circle", count: 2 },
    { id: "notifications", label: "Notifications", icon: "bell", count: 3 },
  ];
  const TABS = [
    { id: "feed", label: "Home", icon: "home" },
    { id: "communities", label: "Communities", icon: "users" },
    { id: "library", label: "Library", icon: "library" },
    { id: "messages", label: "Messages", icon: "message-circle" },
    { id: "profile", label: "Me", icon: "circle-user-round" },
  ];

  function shell(active, content) {
    const me = D.me;
    return `
    <div class="app">
      <aside class="sidebar" aria-label="Main navigation">
        ${brand()}
        <nav class="nav">
          ${NAV.map((n) => `<a href="#/${n.id}" class="${active === n.id ? "active" : ""}">${icon(n.icon)}${n.label}${n.count ? `<span class="count">${n.count}</span>` : ""}</a>`).join("")}
          <div class="nav-section">My spaces</div>
          <a href="#/parish" class="${active === "parish" ? "active" : ""}">${icon("church")}St. Mary's, Harrogate</a>
          <a href="#/diocese" class="${active === "diocese" ? "active" : ""}">${icon("landmark")}Diocese of Leeds</a>
          <div class="nav-section">Account</div>
          <a href="#/profile" class="${active === "profile" ? "active" : ""}">${icon("circle-user-round")}Profile</a>
          <a href="#/settings" class="${active === "settings" ? "active" : ""}">${icon("settings")}Settings</a>
          <a href="#/admin" class="${active === "admin" ? "active" : ""}">${icon("shield")}Moderation</a>
          <a href="#/design" class="${active === "design" ? "active" : ""}">${icon("palette")}Design system</a>
        </nav>
        <div class="sidebar-foot">
          <div class="me">${avatar(me, "sm")}<div><div style="font-weight:600">${me.name}</div><div class="xs" style="color:#9fb0cf">${me.role}</div></div></div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="mobile-brand"><div class="brand-mark">${icon("cross", 18)}</div>Parish Network</div>
          <label class="search">${icon("search", 18)}<input placeholder="Search discussions, resources, parishes and people…" aria-label="Search" /></label>
          <div class="topbar-actions">
            <a class="icon-btn" href="#/notifications" aria-label="Notifications">${icon("bell", 20)}<span class="dot"></span></a>
            <a class="icon-btn" href="#/messages" aria-label="Messages">${icon("message-circle", 20)}</a>
            <a href="#/profile" aria-label="My profile">${avatar(me, "sm")}</a>
          </div>
        </header>
        ${content}
      </div>
      <nav class="tabbar" aria-label="Mobile navigation">
        ${TABS.map((t) => `<a href="#/${t.id}" class="${active === t.id ? "active" : ""}">${icon(t.icon, 22)}${t.label}</a>`).join("")}
      </nav>
    </div>`;
  }

  /* ---------------- Reusable blocks ---------------- */
  function postCard(p, opts = {}) {
    const a = D.people[p.author];
    const typeChip = { Question: "chip", Resource: "chip green", Announcement: "chip gold", Discussion: "chip plain" }[p.type];
    return `
    <article class="card">
      <div class="post-meta">
        ${avatar(a)}
        <div>
          <div><span class="who">${a.name}</span> ${verified()}</div>
          <div class="role">${a.role} · ${a.parish}</div>
          <div class="xs muted">${p.time} · in <a href="#/community/finance">${p.community}</a></div>
        </div>
        <span class="${typeChip} post-type">${p.type === "Announcement" ? icon("megaphone", 13) : ""}${p.type}</span>
      </div>
      <div class="post-body">
        <h3><a href="#/post/${p.id}" style="color:inherit">${p.title}</a></h3>
        <p class="muted" style="margin:0">${p.body}</p>
      </div>
      ${p.file ? `<div class="attachment" style="margin-bottom:12px"><div class="file-ico ${p.file.cls}">${p.file.type}</div><div style="flex:1"><div style="font-weight:600">${p.file.name}</div><div class="xs muted">${p.file.size} · Scanned & approved</div></div><button class="btn btn-outline btn-sm">${icon("download", 16)}Download</button></div>` : ""}
      <div class="post-tags">${p.tags.map((t) => `<span class="chip plain">#${t}</span>`).join("")}</div>
      <div class="post-stats"><span>${p.reactions} reactions</span><span>${p.comments} replies</span>${p.helpful ? `<span style="color:var(--green-600)">${icon("check-circle-2", 14)} ${p.helpful} found helpful</span>` : ""}</div>
      <div class="post-actions">
        <button>${icon("heart-handshake", 18)}<span>React</span></button>
        <button onclick="location.hash='#/post/${p.id}'">${icon("message-square", 18)}<span>Reply</span></button>
        <button class="${opts.saved ? "on" : ""}" data-toggle="on">${icon("bookmark", 18)}<span>Save</span></button>
        <button>${icon("share-2", 18)}<span>Share</span></button>
      </div>
    </article>`;
  }

  function personRow(p, action = "Connect") {
    return `
    <div class="list-item">
      ${avatar(p)}
      <div style="flex:1;min-width:0">
        <div style="font-weight:600">${p.name} ${verified()}</div>
        <div class="small muted">${p.role}</div>
        <div class="xs muted">${p.parish}</div>
      </div>
      <button class="btn btn-outline btn-sm">${action === "Connect" ? icon("user-plus", 15) : ""}${action}</button>
    </div>`;
  }

  function railDefault() {
    return `
    <aside class="rail">
      <div class="card gold">
        <div class="row" style="margin-bottom:8px">${icon("calendar-days", 20)}<h3 style="margin:0">This week</h3></div>
        <div class="list-item"><div class="chip gold">14 Nov</div><div><div style="font-weight:600">Catechist formation day</div><div class="xs muted">Diocese of Leeds · In person</div></div></div>
        <div class="list-item"><div class="chip gold">19 Nov</div><div><div style="font-weight:600">Gift Aid webinar</div><div class="xs muted">Parish Finance · Online</div></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Suggested connections</h3><a href="#/discover" class="small">See all</a></div>
        ${D.people.slice(0, 3).map((p) => personRow(p)).join("")}
      </div>
      <div class="card">
        <div class="card-head"><h3>Trending topics</h3></div>
        <div class="row wrap">${["Gift Aid", "Volunteer rotas", "OCIA", "Parish mergers", "Safeguarding training", "Energy costs", "Livestreaming"].map((t) => `<span class="chip plain">#${t}</span>`).join("")}</div>
      </div>
      <p class="xs muted" style="text-align:center">Privacy · Community guidelines · Help<br/>© 2026 Parish Network</p>
    </aside>`;
  }

  /* ================================================================
     SCREENS
     ================================================================ */

  /* ---------- Public landing + pricing ---------- */
  function welcome() {
    const features = [
      ["badge-check", "Verified members only", "Every parish and member is verified, so you always know who you are speaking with."],
      ["users", "Role-based communities", "Priests, finance, administration, OCIA, catechesis, youth, safeguarding and more."],
      ["library", "Shared resource library", "Templates, budgets, programmes and training materials — rated by people who use them."],
      ["compass", "Find your peers", "Connect with similar parishes and experienced mentors, within and beyond your diocese."],
      ["landmark", "Diocesan spaces", "Announcements, training and initiatives shared with the right parish teams."],
      ["lock", "Private & secure", "UK GDPR compliant, with safeguards against sharing confidential pastoral information."],
    ];
    return `
    <div class="app no-shell">
      <div class="hero">
        <div class="public-nav">
          ${brand()}
          <div class="row">
            <a href="#/welcome" class="hide-sm" style="color:#d3dcee">Features</a>
            <a href="#pricing" class="hide-sm" style="color:#d3dcee;margin:0 12px" onclick="document.getElementById('pricing').scrollIntoView({behavior:'smooth'});return false;">Pricing</a>
            <a href="#/feed" class="btn btn-outline btn-sm" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)">Sign in</a>
          </div>
        </div>
        <div class="hero-inner">
          <div>
            <div class="eyebrow" style="color:var(--gold-500)">For parish priests, staff & leadership teams</div>
            <h1>The trusted professional network for the Catholic Church</h1>
            <p class="lead">Connect with the people who run and support parishes. Share what works, learn from one another and stop reinventing the wheel.</p>
            <div class="row wrap" style="margin-top:28px">
              <a href="#/join/1" class="btn btn-gold">Join your parish network ${icon("arrow-right", 18)}</a>
              <a href="#/feed" class="btn btn-ghost" style="color:#fff">${icon("play-circle", 18)}Take a tour</a>
            </div>
            <div class="row" style="margin-top:28px;color:#b8c5de;font-size:.9rem">${icon("shield-check", 18)} 4,200+ verified members across 22 dioceses</div>
          </div>
          <div class="hero-art">
            <div class="float-1">${postCard(D.posts[3])}</div>
            <div class="card float-2">
              <div class="row">${icon("file-spreadsheet", 22)}<div><div style="font-weight:600">Annual Parish Budget Template</div><div class="xs muted">Downloaded 2,100 times</div></div></div>
              <div class="row" style="margin-top:8px">${stars(4.8)}<span class="xs muted">4.8 · 126 reviews</span></div>
            </div>
          </div>
        </div>
      </div>

      <section class="section">
        <div style="text-align:center;max-width:640px;margin:0 auto 40px">
          <div class="eyebrow">Built for those who serve the parish</div>
          <h2 style="font-size:2.2rem">Everything your parish team needs to collaborate</h2>
          <p class="muted">Not a social network for the congregation — a professional space for the people responsible for leading, managing and supporting parish life.</p>
        </div>
        <div class="grid-3">
          ${features.map(([i, t, d]) => `<div class="card feature"><div class="ico">${icon(i, 24)}</div><h3>${t}</h3><p class="muted" style="margin:0">${d}</p></div>`).join("")}
        </div>
      </section>

      <section class="section" id="pricing" style="padding-top:0">
        <div style="text-align:center;margin-bottom:32px">
          <div class="eyebrow">Simple, transparent pricing</div>
          <h2 style="font-size:2.2rem">One membership. Every feature.</h2>
          <p class="muted">No tiers, no premium upgrades. Every member has exactly the same access.</p>
        </div>
        <div class="card price-card">
          <div class="chip gold" style="margin-bottom:14px">${icon("star", 13)} Standard Membership</div>
          <div class="price">£8<span style="font-size:1.2rem;color:var(--ink-500);font-family:var(--font-sans);font-weight:500"> / month</span></div>
          <p class="muted" style="margin-top:8px">or £80 per year — two months free</p>
          <ul class="ticks">
            ${["Verified professional & parish profile", "All role-based communities and discussions", "Full resource library — upload & download", "Direct messaging with verified members", "Diocesan spaces and announcements", "Cancel anytime, no lock-in"].map((t) => `<li>${icon("check", 20)}${t}</li>`).join("")}
          </ul>
          <a href="#/join/1" class="btn btn-primary btn-block">Start membership</a>
          <p class="xs muted" style="margin:12px 0 0">Secure payment by card or Direct Debit. VAT included. Parish-funded memberships coming soon.</p>
        </div>
      </section>

      <footer class="footer">
        <div class="row" style="justify-content:center;margin-bottom:10px;color:#fff">${icon("cross", 18)}<span class="serif" style="color:#fff;font-size:1.2rem">Parish Network</span></div>
        Privacy policy · Terms · Community guidelines · Data protection (UK GDPR) · Contact
      </footer>
    </div>`;
  }

  /* ---------- Onboarding (4 steps) ---------- */
  function join(step) {
    step = Math.min(Math.max(+step || 1, 1), 4);
    const steps = ["Create your account", "Your role & parish", "Verification", "Membership & payment"];
    const body = {
      1: `
        <h1>Create your account</h1>
        <p class="muted">It takes about five minutes. You'll see the full price before you pay anything.</p>
        <div class="field"><label class="lbl">Full name and title</label><input class="input" value="Fr. Thomas Whitfield" /></div>
        <div class="field"><label class="lbl">Email address</label><input class="input" type="email" value="t.whitfield@stmarysharrogate.org.uk" /><div class="hint">Using your parish or diocesan email speeds up verification.</div></div>
        <div class="field"><label class="lbl">Password</label><input class="input" type="password" value="••••••••••••" /><div class="hint">At least 12 characters. We'll also offer two-step verification.</div></div>
        <label class="check"><input type="checkbox" checked /> I agree to the Terms, Privacy Policy and Community Guidelines</label>`,
      2: `
        <h1>Your role & parish</h1>
        <p class="muted">This helps us connect you with the right communities and colleagues.</p>
        <label class="lbl">What is your role?</label>
        <div class="role-grid" style="margin-bottom:20px">
          ${[["church", "Priest / Deacon"], ["clipboard-list", "Parish Administrator"], ["landmark", "Finance Committee"], ["flame", "RCIA / OCIA Coordinator"], ["book-open", "Catechist"], ["hand-heart", "Ministry Leader"], ["users-round", "Pastoral Council"], ["building-2", "Diocesan Staff"]]
            .map(([i, r], idx) => `<button class="role-opt ${idx === 0 ? "on" : ""}" data-radio="role">${icon(i, 22)}<span style="font-weight:600">${r}</span></button>`).join("")}
        </div>
        <div class="field"><label class="lbl">Diocese</label><select class="input"><option>Diocese of Leeds</option><option>Archdiocese of Westminster</option><option>Archdiocese of Liverpool</option></select></div>
        <div class="field"><label class="lbl">Parish</label><input class="input" value="St. Mary's, Harrogate" /><div class="hint">Can't find your parish? <a href="#">Register a new parish profile</a></div></div>`,
      3: `
        <h1>Verify your identity</h1>
        <p class="muted">Verification keeps the network trusted. Choose one option — most members are verified within one working day.</p>
        <div class="stack">
          ${[
            ["mail-check", "Parish or diocesan email", "We'll send a code to your official email address.", true],
            ["user-check", "Confirmation by your parish priest or administrator", "A verified member of your parish confirms your role."],
            ["file-badge", "Letter of appointment or celebret", "Upload a document. Reviewed by our team and deleted after checking."],
          ].map(([i, t, d, on]) => `<button class="role-opt ${on ? "on" : ""}" data-radio="verify" style="width:100%;align-items:flex-start">${icon(i, 24)}<span><span style="font-weight:600;display:block">${t}</span><span class="small muted">${d}</span></span></button>`).join("")}
        </div>
        <div class="notice blue" style="margin-top:18px">${icon("lock", 18)}<div>Verification documents are encrypted, used only to confirm your role, and deleted within 30 days in line with UK GDPR.</div></div>`,
      4: `
        <h1>Your membership</h1>
        <p class="muted">One simple membership — the same features for every member.</p>
        <div class="grid-2" style="margin-bottom:18px">
          <button class="role-opt on" data-radio="plan" style="flex-direction:column;align-items:flex-start"><span class="chip gold">Save £16</span><span class="serif" style="font-size:1.8rem;font-weight:700;color:var(--navy-900)">£80 / year</span><span class="small muted">Billed annually</span></button>
          <button class="role-opt" data-radio="plan" style="flex-direction:column;align-items:flex-start"><span class="chip plain">Flexible</span><span class="serif" style="font-size:1.8rem;font-weight:700;color:var(--navy-900)">£8 / month</span><span class="small muted">Billed monthly</span></button>
        </div>
        <div class="field"><label class="lbl">Card number</label><input class="input" value="4242 4242 4242 4242" /></div>
        <div class="grid-2"><div class="field"><label class="lbl">Expiry</label><input class="input" value="08 / 29" /></div><div class="field"><label class="lbl">CVC</label><input class="input" value="•••" /></div></div>
        <div class="card" style="background:var(--ivory)">
          <div class="row between"><span>Standard Membership (annual)</span><b>£80.00</b></div>
          <div class="row between small muted"><span>Includes VAT</span><span>£13.33</span></div>
          <div class="divider"></div>
          <div class="row between"><b>Due today</b><b>£80.00</b></div>
          <p class="xs muted" style="margin:8px 0 0">Renews 9 October 2027. We'll remind you 14 days before. Cancel anytime in Settings.</p>
        </div>
        <div class="row small muted" style="margin-top:12px">${icon("lock", 15)} Payments processed securely by Stripe. We never store your card details.</div>`,
    }[step];

    return `
    <div class="onb">
      <aside class="onb-side">
        ${brand()}
        <h2 style="color:#fff;font-size:2rem">Welcome to the network</h2>
        <p style="color:#aebbd4">Join thousands of priests, parish staff and volunteers sharing what works.</p>
        <ul class="steps" style="margin-top:28px">
          ${steps.map((s, i) => `<li class="${i + 1 < step ? "done" : i + 1 === step ? "cur" : ""}"><span class="n">${i + 1 < step ? icon("check", 16) : i + 1}</span><span style="padding-top:4px">${s}</span></li>`).join("")}
        </ul>
        <div class="card" style="margin-top:auto;background:rgba(255,255,255,.06);border:0;color:#d8e0ef">
          <p style="font-style:italic;margin-bottom:10px">"I found a budgeting template and a mentor in my first week. It saved our finance committee months of work."</p>
          <div class="small" style="color:var(--gold-500)">Helen Barrett · Finance Chair, York</div>
        </div>
      </aside>
      <main class="onb-main">
        <div class="row between" style="margin-bottom:8px"><a href="#/welcome" class="small">${icon("arrow-left", 15)} Back to home</a><span class="small muted">Step ${step} of 4</span></div>
        <div class="progress" style="margin-bottom:32px"><span style="width:${step * 25}%"></span></div>
        ${body}
        <div class="row between" style="margin-top:28px">
          ${step > 1 ? `<a href="#/join/${step - 1}" class="btn btn-outline">Back</a>` : "<span></span>"}
          <a href="${step < 4 ? `#/join/${step + 1}` : "#/feed"}" class="btn btn-primary">${step < 4 ? "Continue" : "Pay £80 and join"} ${icon("arrow-right", 18)}</a>
        </div>
      </main>
    </div>`;
  }

  /* ---------- Home feed ---------- */
  function feed() {
    return shell("feed", `
    <div class="page">
      <div class="stack">
        <div class="card">
          <div class="composer">${avatar(D.me)}<div class="fake-input" data-modal="compose">Ask a question or share something useful, Father…</div></div>
          <div class="composer-actions">
            <button class="btn btn-ghost btn-sm" data-modal="compose">${icon("help-circle", 17)}Ask a question</button>
            <button class="btn btn-ghost btn-sm" data-modal="compose">${icon("message-square-text", 17)}Start a discussion</button>
            <button class="btn btn-ghost btn-sm" data-modal="compose">${icon("upload", 17)}Share a resource</button>
          </div>
        </div>
        <div class="row wrap">
          ${["For you", "My communities", "Questions", "Resources", "Diocese of Leeds", "Following"].map((c, i) => `<button class="chip ${i === 0 ? "on" : "plain"}" data-chipgroup="feed">${c}</button>`).join("")}
        </div>
        ${D.posts.map((p) => postCard(p)).join("")}
      </div>
      ${railDefault()}
    </div>`);
  }

  /* ---------- Communities ---------- */
  function communities() {
    const c = D.communities;
    const card = (x) => `
      <a class="card comm-card" href="#/community/${x.id}" style="text-decoration:none;color:inherit">
        <div class="row between"><div class="comm-icon ${x.cls}">${icon(x.icon, 26)}</div>${x.joined ? `<span class="chip green">${icon("check", 13)}Joined</span>` : `<span class="btn btn-outline btn-sm">Join</span>`}</div>
        <h3 style="margin-top:4px">${x.name}</h3>
        <p class="small muted" style="margin:0;flex:1">${x.desc}</p>
        <div class="row xs muted">${icon("users", 14)} ${x.members.toLocaleString()} members ${x.restricted ? `· ${icon("lock", 13)} ${x.restricted}` : ""}</div>
      </a>`;
    return shell("communities", `
    <div class="page wide">
      ${pagehead("Professional communities", "Communities", "Join communities for your role and ministry. Start discussions, ask questions and share experience.", `<button class="btn btn-primary" data-modal="group">${icon("plus", 18)}Create private group</button>`)}
      <div class="tabs"><button class="on">All communities</button><button>My communities (4)</button><button>Private groups (3)</button><button>Diocesan spaces</button></div>
      <div class="grid-3">${c.map(card).join("")}</div>
      <h2 style="margin-top:36px">Your private groups</h2>
      <div class="grid-3">
        ${[["Harrogate Deanery Clergy", "8 members · Invite only", "a1"], ["St. Mary's Parish Team", "14 members · Parish only", "a3"], ["Yorkshire Parish Mergers Project", "26 members · Cross-diocesan", "a4"]]
          .map(([n, m, col]) => `<div class="card row"><div class="avatar sq ${col}">${icon("lock", 18)}</div><div><div style="font-weight:600">${n}</div><div class="xs muted">${m}</div></div></div>`).join("")}
      </div>
    </div>`);
  }

  function community(id) {
    const c = D.communities.find((x) => x.id === id) || D.communities[2];
    return shell("communities", `
    <div class="page">
      <div class="stack">
        <div class="card flush">
          <div class="cover ${c.id === "finance" ? "green" : ""}"><div class="cover-pattern"></div></div>
          <div style="padding:0 24px 22px">
            <div class="comm-icon ${c.cls}" style="width:84px;height:84px;margin-top:-42px;border:4px solid #fff;border-radius:20px">${icon(c.icon, 38)}</div>
            <div class="row between wrap" style="margin-top:12px">
              <div><h1 style="margin:0">${c.name}</h1><div class="muted small">${c.members.toLocaleString()} verified members · 42 new discussions this week</div></div>
              <div class="row"><button class="btn btn-outline">${icon("bell", 17)}Following</button><button class="btn btn-primary" data-modal="compose">${icon("plus", 17)}New post</button></div>
            </div>
            <p style="margin-top:12px">${c.desc}</p>
          </div>
        </div>
        <div class="tabs" style="margin:0"><button class="on">Discussions</button><button>Questions</button><button>Resources</button><button>Members</button><button>About & rules</button></div>
        <div class="row wrap">
          <span class="small muted">Filter:</span>
          ${["All topics", "Gift Aid", "Budgeting", "Fundraising", "Audit", "Unanswered"].map((t, i) => `<button class="chip ${i === 0 ? "on" : "plain"}" data-chipgroup="ctopic">${t}</button>`).join("")}
        </div>
        ${postCard(D.posts[0])}${postCard(D.posts[1])}
      </div>
      <aside class="rail">
        <div class="card">
          <h3>Community guidelines</h3>
          <ul class="small" style="padding-left:18px;margin:0">
            <li>Be charitable and constructive.</li>
            <li>Never share donors' or parishioners' personal details.</li>
            <li>Mark answers that helped you as <b>helpful</b>.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-head"><h3>Top contributors</h3></div>
          ${D.people.slice(1, 4).map((p) => personRow(p, "View")).join("")}
        </div>
        <div class="card gold">
          <h3>Most helpful resources</h3>
          ${D.resources.filter((r) => r.ministry === "Finance").map((r) => `<div class="list-item"><div class="file-ico ${r.cls}" style="width:36px;height:42px">${r.type}</div><div><div class="small" style="font-weight:600">${r.title}</div><div class="xs muted">${r.rating} ★ · ${r.downloads} downloads</div></div></div>`).join("")}
        </div>
      </aside>
    </div>`);
  }

  /* ---------- Discussion thread ---------- */
  function post(id) {
    const p = D.posts.find((x) => x.id === +id) || D.posts[0];
    const ans = (who, text, helpful, n, isReply) => {
      const a = D.people[who];
      return `
      <div class="card answer ${helpful ? "helpful" : ""} ${isReply ? "reply" : ""}" style="${isReply ? "border-radius:0 14px 14px 0" : ""}">
        ${helpful ? `<div class="chip green" style="margin-bottom:12px">${icon("check-circle-2", 14)}Marked helpful by the author · ${n} members agree</div>` : ""}
        <div class="post-meta">${avatar(a, "sm")}<div><div><span class="who">${a.name}</span> ${verified()}</div><div class="role">${a.role} · ${a.parish}</div></div><span class="xs muted post-type">1h</span></div>
        <p style="margin:12px 0">${text}</p>
        <div class="row small">
          <button class="btn btn-ghost btn-sm">${icon("heart-handshake", 16)}React</button>
          <button class="btn btn-ghost btn-sm">${icon("corner-down-right", 16)}Reply</button>
          <button class="btn btn-ghost btn-sm" data-toggle="on">${icon("check-circle-2", 16)}Helpful</button>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto" data-modal="report" aria-label="Report">${icon("flag", 16)}</button>
        </div>
      </div>`;
    };
    return shell("feed", `
    <div class="page">
      <div class="stack">
        <a href="#/feed" class="small">${icon("arrow-left", 15)} Back to feed</a>
        ${postCard(p)}
        <div class="row between"><h3 style="margin:0">${p.comments} replies</h3><select class="input" style="width:auto;min-height:40px"><option>Most helpful first</option><option>Newest</option></select></div>
        ${ans(2, "We installed two SumUp terminals last Advent. The key for Gift Aid was a simple QR code beside each one linking to a 30-second online declaration. Our contactless income is now 31% of the total offertory. Happy to share our sign wording and committee paper.", true, 9)}
        ${ans(0, "Thank you Helen — could you share the committee paper in the Resource Library? Several of us in Salford diocese are looking at the same question.", false, 0, true)}
        ${ans(3, "Worth checking with your diocesan finance office first — ours has negotiated a group rate with a provider, which brought the fees right down.", false, 0)}
        <div class="card">
          <div class="composer">${avatar(D.me, "sm")}<textarea class="input" placeholder="Write a helpful reply…" style="min-height:80px"></textarea></div>
          <div class="row between" style="margin-top:10px">
            <span class="xs muted">${icon("shield-alert", 14)} Please don't include confidential pastoral, safeguarding or personal financial details.</span>
            <button class="btn btn-primary btn-sm">Post reply</button>
          </div>
        </div>
      </div>
      <aside class="rail">
        <div class="card">
          <h3>About this question</h3>
          <dl class="kv"><dt>Community</dt><dd>Parish Finance</dd><dt>Topic</dt><dd>Giving & Gift Aid</dd><dt>Role</dt><dd>Finance committee</dd><dt>Parish size</dt><dd>Medium (300–700)</dd></dl>
        </div>
        <div class="card">
          <h3>Related discussions</h3>
          ${["Gift Aid on online donations — HMRC guidance", "Standing orders vs. envelope scheme", "Choosing a card terminal provider"].map((t) => `<div class="list-item small"><span>${icon("message-square", 16)}</span><a href="#/post/1">${t}</a></div>`).join("")}
        </div>
      </aside>
    </div>`);
  }

  /* ---------- Resource library ---------- */
  function library() {
    const card = (r, i) => `
      <a class="card res-card" href="#/resource/${i}" style="text-decoration:none;color:inherit">
        <div class="row between"><div class="file-ico ${r.cls}">${r.type}</div>${r.verified ? `<span class="chip gold">${icon("award", 13)}Recommended</span>` : ""}</div>
        <h3 style="font-family:var(--font-sans);font-size:1.02rem;margin:4px 0 0">${r.title}</h3>
        <div class="row wrap"><span class="chip plain">${r.ministry}</span><span class="chip plain">${r.size} parish</span></div>
        <div class="row small" style="margin-top:auto">${stars(r.rating)}<b>${r.rating}</b><span class="muted">(${r.reviews})</span></div>
        <div class="row between xs muted"><span>by ${r.author}</span><span>${icon("download", 13)} ${r.downloads}</span></div>
      </a>`;
    const group = (title, items) => `<div class="group"><div style="font-weight:700;margin-bottom:6px">${title}</div>${items.map((x, i) => `<label class="check"><input type="checkbox" ${i === 0 && title === "Ministry" ? "checked" : ""}/>${x}</label>`).join("")}</div>`;
    return shell("library", `
    <div class="page lib">
      <aside class="card filter-panel">
        <h3>Filter resources</h3>
        ${group("Ministry", ["Finance", "Administration", "Catechesis", "OCIA", "Youth", "Safeguarding", "Outreach"])}
        ${group("Type", ["Templates", "Spreadsheets", "Guides", "Presentations", "Training"])}
        ${group("Parish size", ["Small (< 300)", "Medium (300–700)", "Large (700+)", "Multi-parish"])}
        ${group("Audience", ["Clergy", "Staff", "Volunteers", "Families"])}
      </aside>
      <div>
        ${pagehead("Shared knowledge", "Resource Library", "Templates, programmes and materials shared and rated by parish teams.", `<button class="btn btn-primary" data-modal="upload">${icon("upload", 18)}Upload resource</button>`)}
        <label class="search" style="max-width:none;margin-bottom:16px">${icon("search", 18)}<input placeholder="Search 3,400+ resources, e.g. 'budget template small parish'" /></label>
        <div class="row wrap" style="margin-bottom:18px">
          ${["Most helpful", "Newest", "Most downloaded", "Saved by me"].map((t, i) => `<button class="chip ${i === 0 ? "on" : "plain"}" data-chipgroup="lib">${t}</button>`).join("")}
        </div>
        <div class="grid-3">${D.resources.map(card).join("")}</div>
      </div>
    </div>`);
  }

  function resource(i) {
    const r = D.resources[+i] || D.resources[0];
    return shell("library", `
    <div class="page">
      <div class="stack">
        <a href="#/library" class="small">${icon("arrow-left", 15)} Back to library</a>
        <div class="card">
          <div class="row" style="align-items:flex-start;gap:18px">
            <div class="file-ico ${r.cls}" style="width:64px;height:76px;font-size:.9rem">${r.type}</div>
            <div style="flex:1">
              <div class="row wrap" style="margin-bottom:6px"><span class="chip plain">${r.ministry}</span><span class="chip plain">${r.size} parish</span>${r.verified ? `<span class="chip gold">${icon("award", 13)}Recommended</span>` : ""}</div>
              <h1 style="font-size:1.8rem">${r.title}</h1>
              <div class="row small">${stars(r.rating)}<b>${r.rating}</b><span class="muted">${r.reviews} reviews · ${r.downloads} downloads · Updated Sep 2026</span></div>
            </div>
          </div>
          <div class="row wrap" style="margin-top:18px">
            <button class="btn btn-primary">${icon("download", 18)}Download (184 KB)</button>
            <button class="btn btn-outline" data-toggle="on">${icon("bookmark", 18)}Save</button>
            <button class="btn btn-outline">${icon("share-2", 18)}Share</button>
            <button class="btn btn-ghost" data-modal="report">${icon("flag", 18)}Report</button>
          </div>
          <div class="divider"></div>
          <h3>About this resource</h3>
          <p>A complete annual budget workbook used by over 200 parishes. Includes income forecasting (offertory, Gift Aid, hall hire, legacies), expenditure by category, diocesan levy calculation and a one-page summary for the finance committee and parish priest.</p>
          <dl class="kv"><dt>Intended audience</dt><dd>Finance committees, parish priests, administrators</dd><dt>Licence</dt><dd>Free to use and adapt within the network</dd><dt>Owner</dt><dd>${r.author} · Our Lady of Lourdes, York</dd><dt>Moderation</dt><dd><span class="chip green">${icon("shield-check", 13)}Virus-scanned & reviewed</span></dd></dl>
        </div>
        <div class="card">
          <div class="card-head"><h3>Reviews & feedback</h3><button class="btn btn-outline btn-sm">Write a review</button></div>
          ${[[0, 5, "Saved us hours. The diocesan levy tab alone is worth it."], [1, 5, "Adapted it for our three-parish grouping easily."], [3, 4, "Excellent. Would love a version for smaller parishes with no paid staff."]]
            .map(([w, s, t]) => `<div class="list-item">${avatar(D.people[w], "sm")}<div><div class="row"><b>${D.people[w].name}</b>${stars(s)}</div><p class="small" style="margin:4px 0 0">${t}</p></div></div>`).join("")}
        </div>
      </div>
      <aside class="rail">
        <div class="card"><h3>Shared by</h3>${personRow(D.people[2], "Message")}</div>
        <div class="card"><h3>Related resources</h3>${D.resources.slice(1, 4).map((x, j) => `<div class="list-item"><div class="file-ico ${x.cls}" style="width:36px;height:42px">${x.type}</div><div><a class="small" style="font-weight:600" href="#/resource/${j + 1}">${x.title}</a><div class="xs muted">${x.rating} ★</div></div></div>`).join("")}</div>
      </aside>
    </div>`);
  }

  /* ---------- Discover ---------- */
  function discover() {
    const personCard = (p) => `
      <div class="card" style="text-align:center">
        <div style="display:flex;justify-content:center">${avatar(p, "lg")}</div>
        <div style="font-weight:700;margin-top:10px">${p.name} ${verified()}</div>
        <div class="small muted">${p.role}</div>
        <div class="xs muted">${p.parish} · ${p.diocese}</div>
        <div class="row wrap" style="justify-content:center;margin:10px 0">${p.mentor ? `<span class="chip gold">${icon("graduation-cap", 13)}Mentor</span>` : ""}${p.diocesan ? `<span class="chip">${icon("landmark", 13)}Diocesan</span>` : ""}${p.tags.map((t) => `<span class="chip plain">${t}</span>`).join("")}</div>
        <div class="row" style="justify-content:center"><button class="btn btn-primary btn-sm">${icon("user-plus", 15)}Connect</button><button class="btn btn-outline btn-sm">${icon("message-circle", 15)}Message</button></div>
      </div>`;
    const parishes = [
      ["St. Joseph's", "Salford", "Diocese of Salford", "620 Mass-goers · 12 members", "a2"],
      ["Holy Family", "Croydon", "Archdiocese of Southwark", "1,100 Mass-goers · 18 members", "a3"],
      ["Our Lady of Lourdes", "York", "Diocese of Middlesbrough", "380 Mass-goers · 7 members", "a4"],
    ];
    return shell("discover", `
    <div class="page wide">
      ${pagehead("Networking", "Discover members & parishes", "Find similar parishes, experienced mentors and colleagues across dioceses.")}
      <div class="card" style="margin-bottom:20px">
        <div class="grid-4">
          <div><label class="lbl">Diocese</label><select class="input"><option>All dioceses</option><option>Diocese of Leeds</option></select></div>
          <div><label class="lbl">Role</label><select class="input"><option>Any role</option><option>Priest</option><option>Administrator</option></select></div>
          <div><label class="lbl">Ministry</label><select class="input"><option>Any ministry</option><option>Finance</option><option>OCIA</option></select></div>
          <div><label class="lbl">Parish size</label><select class="input"><option>Any size</option><option>Similar to mine (300–700)</option></select></div>
        </div>
        <div class="row wrap" style="margin-top:14px">
          <label class="check"><input type="checkbox" checked />Open to mentoring</label>
          <label class="check" style="margin-left:14px"><input type="checkbox" />Within 25 miles</label>
          <label class="check" style="margin-left:14px"><input type="checkbox" />Rural parishes</label>
        </div>
      </div>
      <div class="tabs"><button class="on">People (1,248)</button><button>Parishes (412)</button><button>Mentors (96)</button><button>Dioceses (22)</button></div>
      <div class="grid-3">${D.people.map(personCard).join("")}</div>
      <h2 style="margin-top:36px">Parishes like yours</h2>
      <div class="grid-3">
        ${parishes.map(([n, t, d, s, c]) => `<a href="#/parish" class="card row" style="text-decoration:none;color:inherit"><div class="avatar sq lg ${c}">${icon("church", 28)}</div><div><div style="font-weight:700">${n}, ${t} ${verified()}</div><div class="small muted">${d}</div><div class="xs muted">${s}</div></div></a>`).join("")}
      </div>
    </div>`);
  }

  /* ---------- Messages ---------- */
  function messages() {
    const t = D.threads;
    const active = D.people[t[0].who];
    return shell("messages", `
    <div class="page wide" style="padding-bottom:28px">
      <div class="card flush msg-shell">
        <div class="msg-list">
          <div style="padding:16px 18px;border-bottom:1px solid var(--line)" class="row between"><h2 style="margin:0">Messages</h2><button class="icon-btn" aria-label="New message">${icon("pen-square", 18)}</button></div>
          <div style="padding:12px 18px"><label class="search" style="max-width:none">${icon("search", 16)}<input placeholder="Search messages" /></label></div>
          ${t.map((x, i) => { const p = D.people[x.who]; return `
            <div class="msg-thread-item ${i === 0 ? "on" : ""}">
              ${avatar(p)}
              <div style="flex:1;min-width:0">
                <div class="row between"><b class="small">${p.name}</b><span class="xs muted">${x.time}</span></div>
                <div class="xs muted">${p.role}</div>
                <div class="preview">${x.preview}</div>
              </div>
              ${x.unread ? `<span class="chip" style="background:var(--navy-700);color:#fff;border:0;padding:0 8px;height:22px">${x.unread}</span>` : ""}
            </div>`; }).join("")}
        </div>
        <div class="msg-pane">
          <div class="msg-pane-head">${avatar(active)}<div style="flex:1"><div><b>${active.name}</b> ${verified()}</div><div class="xs muted">${active.role} · ${active.parish}</div></div><button class="btn btn-ghost btn-sm">${icon("user", 16)}Profile</button><button class="btn btn-ghost btn-sm" data-modal="report" aria-label="Report">${icon("flag", 16)}</button></div>
          <div class="msg-body">
            <div class="notice blue small" style="align-self:center;max-width:520px">${icon("lock", 16)}<div>Messages are private between verified members. Please don't share confidential pastoral, safeguarding or personal data here.</div></div>
            <div class="bubble them">Good morning Father! I saw your question in Parish Administration about volunteer rotas.<div class="time">09:58</div></div>
            <div class="bubble them">We moved 120 volunteers onto one spreadsheet last year — it also flags when safeguarding training is due.<div class="time">09:59</div></div>
            <div class="bubble me">That would be a real help, Margaret. Our current system is three paper lists and a lot of goodwill!<div class="time">10:31</div></div>
            <div class="bubble them">Thank you Father — I'll send the rota template over now.<div class="time">10:42</div></div>
            <div class="attachment" style="align-self:flex-start;max-width:72%;background:#fff"><div class="file-ico f-xls">XLS</div><div><div style="font-weight:600">Volunteer-Rota-Template.xlsx</div><div class="xs muted">184 KB</div></div><button class="btn btn-outline btn-sm">${icon("download", 15)}</button></div>
          </div>
          <div class="msg-compose">
            <button class="icon-btn" aria-label="Attach">${icon("paperclip", 18)}</button>
            <input class="input" placeholder="Write a message…" style="border-radius:999px" />
            <button class="btn btn-primary">${icon("send", 17)}Send</button>
          </div>
        </div>
      </div>
    </div>`);
  }

  /* ---------- Notifications ---------- */
  function notifications() {
    return shell("notifications", `
    <div class="page">
      <div>
        ${pagehead("Stay up to date", "Notifications", "", `<button class="btn btn-ghost btn-sm">${icon("check-check", 16)}Mark all as read</button><a href="#/settings" class="btn btn-outline btn-sm">${icon("settings", 16)}Preferences</a>`)}
        <div class="row wrap" style="margin-bottom:16px">${["All", "Messages", "Replies", "Resources", "Diocese", "Connections"].map((t, i) => `<button class="chip ${i === 0 ? "on" : "plain"}" data-chipgroup="notif">${t}</button>`).join("")}</div>
        <div class="card flush">
          ${D.notifications.map((n) => `
            <div class="list-item" style="padding:16px 20px;${n.unread ? "background:var(--navy-50)" : ""}">
              <div class="avatar ${n.color}">${icon(n.icon, 20)}</div>
              <div style="flex:1"><div>${n.text}</div><div class="small muted">${n.sub}</div></div>
              <div class="xs muted" style="white-space:nowrap">${n.time}</div>
              ${n.unread ? `<span style="width:10px;height:10px;border-radius:50%;background:var(--gold-500);margin-top:6px;flex-shrink:0"></span>` : ""}
            </div>`).join("")}
        </div>
      </div>
      <aside class="rail">
        <div class="card">
          <h3>Daily digest</h3>
          <p class="small muted">Prefer fewer notifications? Get one email each morning with what matters to you.</p>
          <div class="setting-row"><span>Daily email digest</span><label class="toggle"><input type="checkbox" checked /><span></span></label></div>
        </div>
      </aside>
    </div>`);
  }

  /* ---------- Member profile ---------- */
  function profile() {
    const me = D.me;
    return shell("profile", `
    <div class="page">
      <div class="stack">
        <div class="card flush">
          <div class="cover"><div class="cover-pattern"></div></div>
          <div class="profile-head">
            ${avatar(me, "xl")}
            <div class="row between wrap" style="margin-top:12px;align-items:flex-start">
              <div>
                <h1 style="margin:0">${me.name} ${verified()}</h1>
                <div style="font-weight:600">${me.role}</div>
                <div class="muted small">${me.parish} · ${me.diocese} · Ordained 2004</div>
                <div class="row wrap" style="margin-top:10px"><span class="chip gold">${icon("badge-check", 13)}Verified clergy</span><span class="chip gold">${icon("graduation-cap", 13)}Open to mentoring</span><span class="chip plain">Member since 2025</span></div>
              </div>
              <div class="row"><a href="#/settings" class="btn btn-outline">${icon("pencil", 16)}Edit profile</a></div>
            </div>
            <div class="grid-4" style="margin-top:20px">
              <div class="stat"><b>184</b><span class="xs muted">Connections</span></div>
              <div class="stat"><b>42</b><span class="xs muted">Answers</span></div>
              <div class="stat"><b>128</b><span class="xs muted">Marked helpful</span></div>
              <div class="stat"><b>9</b><span class="xs muted">Resources shared</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>About</h3>
          <p>Parish priest of St. Mary's, Harrogate, a parish of around 520 Mass-goers with a primary school. Previously assistant priest in Bradford. Particular interest in parish renewal, adult faith formation and supporting smaller rural Mass centres.</p>
          <h3 style="margin-top:16px">Areas of experience</h3>
          <div class="row wrap">${["Parish renewal", "Multi-parish leadership", "OCIA", "School governance", "Building projects", "Stewardship"].map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        </div>
        <div class="card">
          <h3>Recent activity</h3>
          <div class="list-item">${icon("check-circle-2", 18)}<div class="small">Answer marked helpful in <b>Parish Leadership</b>: "Running a parish consultation for a new Mass schedule"</div></div>
          <div class="list-item">${icon("upload", 18)}<div class="small">Shared <b>Parish Renewal Weekend — Planning Pack</b> in the Resource Library</div></div>
          <div class="list-item">${icon("message-square", 18)}<div class="small">Started a discussion in <b>Priests</b>: "Sustaining weekday Masses across three churches"</div></div>
        </div>
      </div>
      <aside class="rail">
        <a href="#/parish" class="card row" style="text-decoration:none;color:inherit"><div class="avatar sq lg a1">${icon("church", 28)}</div><div><div class="xs muted">Parish</div><b>St. Mary's, Harrogate</b><div class="xs muted">14 team members</div></div></a>
        <div class="card"><h3>Communities</h3>${D.communities.filter((c) => c.joined).map((c) => `<div class="list-item"><div class="comm-icon ${c.cls}" style="width:36px;height:36px;border-radius:10px">${icon(c.icon, 18)}</div><a href="#/community/${c.id}" style="font-weight:600;align-self:center">${c.name}</a></div>`).join("")}</div>
        <div class="card"><h3>Privacy</h3><p class="small muted" style="margin:0">${icon("eye", 14)} Your profile is visible to <b>verified members only</b>. Email and phone are hidden. <a href="#/settings">Change</a></p></div>
      </aside>
    </div>`);
  }

  /* ---------- Parish profile + team management ---------- */
  function parish() {
    const team = [
      [D.me, "Parish Priest", "Parish admin", "Active"],
      [D.people[0], "Parish Administrator", "Parish admin", "Active"],
      [D.people[2], "Finance Committee Chair", "Member", "Active"],
      [D.people[3], "OCIA Coordinator", "Member", "Active"],
      [{ name: "Anne Kowalski", initials: "AK", color: "a5" }, "Catechist", "Member", "Pending verification"],
      [{ name: "Peter Doyle", initials: "PD", color: "a6" }, "Youth Leader", "—", "Invitation sent"],
    ];
    return shell("parish", `
    <div class="page">
      <div class="stack">
        <div class="card flush">
          <div class="cover"><div class="cover-pattern"></div></div>
          <div class="profile-head">
            <div class="avatar xl sq a1" style="border-radius:24px">${icon("church", 48)}</div>
            <div class="row between wrap" style="margin-top:12px;align-items:flex-start">
              <div>
                <h1 style="margin:0">St. Mary's Catholic Church, Harrogate ${verified()}</h1>
                <div class="muted">Diocese of Leeds · Harrogate Deanery</div>
                <div class="row wrap" style="margin-top:10px"><span class="chip gold">${icon("badge-check", 13)}Verified parish</span><span class="chip plain">Medium parish · ~520 Mass-goers</span><span class="chip plain">Town centre</span><span class="chip plain">Primary school</span></div>
              </div>
              <div class="row"><button class="btn btn-outline">${icon("pencil", 16)}Edit</button><button class="btn btn-primary" data-modal="invite">${icon("user-plus", 16)}Invite team member</button></div>
            </div>
          </div>
        </div>
        <div class="tabs" style="margin:0"><button class="on">Team & access</button><button>About</button><button>Activity</button><button>Shared resources</button></div>
        <div class="card">
          <div class="card-head"><h3>Parish team (6)</h3><span class="small muted">Parish admins can invite, approve and remove members</span></div>
          <table class="table">
            <thead><tr><th>Member</th><th class="hide-sm">Role</th><th>Permissions</th><th class="hide-sm">Status</th><th></th></tr></thead>
            <tbody>
              ${team.map(([p, r, perm, s]) => `<tr>
                <td><div class="row">${avatar(p, "sm")}<div><b class="small">${p.name}</b><div class="xs muted">${r}</div></div></div></td>
                <td class="hide-sm small">${r}</td>
                <td><span class="chip ${perm === "Parish admin" ? "" : "plain"}">${perm}</span></td>
                <td class="hide-sm"><span class="chip ${s === "Active" ? "green" : "gold"}">${s}</span></td>
                <td>${s === "Pending verification" ? `<button class="btn btn-primary btn-sm">Approve</button>` : `<button class="btn btn-ghost btn-sm" aria-label="More">${icon("more-horizontal", 18)}</button>`}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <aside class="rail">
        <div class="card">
          <h3>Parish details</h3>
          <dl class="kv" style="grid-template-columns:90px 1fr">
            <dt>Address</dt><dd>Station Parade, Harrogate HG1 1TX</dd>
            <dt>Phone</dt><dd>01423 000 000</dd>
            <dt>Email</dt><dd>office@stmarysharrogate.org.uk</dd>
            <dt>Masses</dt><dd>Sat 6pm · Sun 9am, 11am</dd>
          </dl>
        </div>
        <div class="card gold">
          <h3>${icon("users", 18)} Parish-funded memberships</h3>
          <p class="small muted" style="margin:0">Coming soon: let your parish pay for team members' memberships from one invoice. Everyone still gets the same features.</p>
        </div>
      </aside>
    </div>`);
  }

  /* ---------- Diocesan space ---------- */
  function diocese() {
    return shell("diocese", `
    <div class="page">
      <div class="stack">
        <div class="card navy">
          <div class="row between wrap">
            <div class="row"><div class="avatar lg sq" style="background:var(--gold-500);color:var(--navy-900)">${icon("landmark", 32)}</div><div><div class="eyebrow" style="color:var(--gold-500)">Diocesan space</div><h1 style="margin:0;color:#fff">Diocese of Leeds</h1><div class="small" style="color:#b8c5de">82 parishes · 516 members · 4 verified diocesan administrators</div></div></div>
            <button class="btn btn-gold" data-modal="compose">${icon("megaphone", 17)}New announcement</button>
          </div>
        </div>
        <div class="grid-3">
          <div class="card"><div class="eyebrow">Training</div><h3>3 upcoming events</h3><a href="#" class="small">View calendar →</a></div>
          <div class="card"><div class="eyebrow">Resources</div><h3>148 diocesan documents</h3><a href="#/library" class="small">Browse →</a></div>
          <div class="card"><div class="eyebrow">Initiatives</div><h3>Synodal pathway 2026</h3><a href="#" class="small">Join project →</a></div>
        </div>
        <div class="tabs" style="margin:0"><button class="on">Announcements</button><button>Training & events</button><button>Parishes</button><button>Deaneries</button><button>Cross-diocese</button></div>
        ${postCard(D.posts[2])}
        <div class="card">
          <div class="post-meta">${avatar(D.people[4])}<div><div><span class="who">Diocesan Finance Office</span> ${verified()}</div><div class="role">Diocese of Leeds · Official</div></div><span class="chip gold post-type">${icon("megaphone", 13)}Announcement</span></div>
          <div class="post-body"><h3>Parish accounts deadline and new reporting template</h3><p class="muted" style="margin:0">Parish annual accounts for 2025–26 are due by 30 November. A new simplified template is now in the diocesan resource folder.</p></div>
          <div class="row"><span class="chip">Audience: Finance committees, Parish priests</span></div>
        </div>
      </div>
      <aside class="rail">
        <div class="card">
          <h3>Deaneries</h3>
          ${["Harrogate", "Leeds Central", "Bradford", "Halifax", "Huddersfield"].map((d, i) => `<div class="list-item"><span>${icon("map-pin", 16)}</span><div style="flex:1">${d}</div><span class="xs muted">${[11, 18, 16, 12, 14][i]} parishes</span></div>`).join("")}
        </div>
        <div class="card"><h3>Diocesan administrators</h3>${personRow(D.people[4], "Message")}</div>
      </aside>
    </div>`);
  }

  /* ---------- Settings (subscription, privacy, security) ---------- */
  function settings() {
    const toggle = (label, sub, on) => `<div class="setting-row"><div><div style="font-weight:600">${label}</div>${sub ? `<div class="small muted">${sub}</div>` : ""}</div><label class="toggle"><input type="checkbox" ${on ? "checked" : ""}/><span></span></label></div>`;
    return shell("settings", `
    <div class="page wide" style="max-width:920px">
      ${pagehead("Account", "Settings", "")}
      <div class="tabs"><button class="on">Membership & billing</button><button>Privacy</button><button>Notifications</button><button>Security</button><button>Accessibility</button></div>
      <div class="stack">
        <div class="card">
          <div class="row between wrap">
            <div><div class="eyebrow">Your membership</div><h2 style="margin:0">Standard Membership</h2><div class="muted">£80 per year · Renews 9 October 2027</div></div>
            <span class="chip green">${icon("check-circle-2", 14)}Active</span>
          </div>
          <div class="divider"></div>
          <div class="grid-3">
            <div><div class="xs muted">Payment method</div><div class="row">${icon("credit-card", 18)}<b>Visa •••• 4242</b></div></div>
            <div><div class="xs muted">Next payment</div><b>£80.00 on 9 Oct 2027</b></div>
            <div><div class="xs muted">Billing email</div><b class="small">t.whitfield@stmarys…</b></div>
          </div>
          <div class="row wrap" style="margin-top:18px">
            <button class="btn btn-outline btn-sm">Update payment method</button>
            <button class="btn btn-outline btn-sm">Switch to monthly</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--burgundy-600)" data-modal="cancel">Cancel membership</button>
          </div>
        </div>
        <div class="notice red">${icon("alert-triangle", 18)}<div><b>Example: payment failure state.</b> We couldn't take your renewal payment. Please update your card within 7 days to keep access — your content and connections are safe. <a href="#" style="color:inherit;font-weight:700">Update card</a></div></div>
        <div class="card">
          <h3>Invoices</h3>
          <table class="table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th></th></tr></thead><tbody>
            <tr><td>9 Oct 2026</td><td>Standard Membership — annual</td><td>£80.00</td><td><a href="#">${icon("download", 15)} PDF</a></td></tr>
            <tr><td>9 Oct 2025</td><td>Standard Membership — annual</td><td>£80.00</td><td><a href="#">${icon("download", 15)} PDF</a></td></tr>
          </tbody></table>
        </div>
        <div class="card">
          <h3>Privacy</h3>
          ${toggle("Profile visible to all verified members", "Turn off to show your profile only to your connections and parish team", true)}
          ${toggle("Allow direct messages from any verified member", "Otherwise only connections can message you", true)}
          ${toggle("Show me in mentor search", "", true)}
          ${toggle("Show my email address on my profile", "", false)}
        </div>
        <div class="card">
          <h3>Security</h3>
          ${toggle("Two-step verification", "Authenticator app or SMS code at sign-in", true)}
          <div class="setting-row"><div><div style="font-weight:600">Your data</div><div class="small muted">Download or delete your data (UK GDPR)</div></div><div class="row"><button class="btn btn-outline btn-sm">Export</button><button class="btn btn-ghost btn-sm" style="color:var(--burgundy-600)">Delete account</button></div></div>
        </div>
        <div class="card">
          <h3>Accessibility</h3>
          <div class="setting-row"><div><div style="font-weight:600">Larger text</div><div class="small muted">Increase text size across the app</div></div><label class="toggle"><input type="checkbox" id="largeText" ${document.body.classList.contains("large-text") ? "checked" : ""}/><span></span></label></div>
          ${toggle("Reduce motion", "", false)}
        </div>
      </div>
    </div>`);
  }

  /* ---------- Moderation / admin ---------- */
  function admin() {
    const reports = [
      ["Possible confidential pastoral detail", "Reply in Priests", "Auto-flagged: names + health info", "High", "red"],
      ["Spam / advertising", "Post in Parish Finance", "Reported by 3 members", "Medium", "gold"],
      ["Copyrighted material", "Resource: 'Confirmation course slides'", "Reported by 1 member", "Low", "plain"],
    ];
    return shell("admin", `
    <div class="page wide">
      ${pagehead("Administration", "Moderation & verification", "Review reports, approve members and keep the network safe.")}
      <div class="grid-4" style="margin-bottom:20px">
        ${[["flag", "Open reports", "7"], ["user-check", "Pending verifications", "23"], ["building-2", "Parish applications", "4"], ["shield-alert", "Auto-flagged content", "2"]].map(([i, l, n]) => `<div class="card"><div class="row between"><span class="muted small">${l}</span>${icon(i, 18)}</div><div class="serif" style="font-size:2.2rem;font-weight:700;color:var(--navy-900)">${n}</div></div>`).join("")}
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>Content reports</h3><a href="#" class="small">View all</a></div>
          ${reports.map(([t, w, s, p, c]) => `<div class="list-item"><span class="chip ${c}">${p}</span><div style="flex:1"><b class="small">${t}</b><div class="xs muted">${w} · ${s}</div></div><div class="row"><button class="btn btn-outline btn-sm">Review</button></div></div>`).join("")}
        </div>
        <div class="card">
          <div class="card-head"><h3>Verification queue</h3><a href="#" class="small">View all</a></div>
          ${[[D.people[5], "Parish email confirmed"], [{ name: "Anne Kowalski", initials: "AK", color: "a5", role: "Catechist" }, "Confirmed by parish admin"], [{ name: "Fr. Liam Carroll", initials: "LC", color: "a2", role: "Assistant Priest" }, "Celebret uploaded"]]
            .map(([p, m]) => `<div class="list-item">${avatar(p, "sm")}<div style="flex:1"><b class="small">${p.name}</b><div class="xs muted">${p.role} · ${m}</div></div><button class="btn btn-primary btn-sm">Approve</button><button class="btn btn-ghost btn-sm" aria-label="Reject">${icon("x", 16)}</button></div>`).join("")}
        </div>
      </div>
    </div>`);
  }

  /* ---------- Design system ---------- */
  function design() {
    const sw = [["Marian Navy", "#1f3f73"], ["Deep Navy", "#0f2140"], ["Liturgical Gold", "#c19a3d"], ["Ivory", "#faf7f1"], ["Burgundy", "#8a1f2b"], ["Ordinary Green", "#2f7a4f"]];
    return shell("design", `
    <div class="page wide">
      ${pagehead("Style guide", "Design system", "Professional, welcoming, trustworthy and distinctly Catholic — without feeling dated.")}
      <div class="stack">
        <div class="card"><h3>Colour</h3><p class="small muted">Navy conveys trust and Marian tradition; gold is used sparingly for verification, highlights and calls to action. Liturgical green and burgundy carry status meaning.</p>
          <div class="grid-3">${sw.map(([n, h]) => `<div class="swatch"><div class="c" style="background:${h}"></div><div class="t"><b>${n}</b><div class="muted">${h}</div></div></div>`).join("")}</div></div>
        <div class="card"><h3>Typography</h3>
          <h1>Cormorant Garamond — headings</h1>
          <p style="font-size:1.1rem">Inter — body text at 16px minimum (18px with "Larger text"), line height 1.55 for comfortable reading.</p>
          <p class="eyebrow">Eyebrow label</p></div>
        <div class="card"><h3>Buttons & chips</h3>
          <div class="row wrap"><button class="btn btn-primary">Primary</button><button class="btn btn-gold">Gold CTA</button><button class="btn btn-outline">Outline</button><button class="btn btn-ghost">Ghost</button><button class="btn btn-danger">Danger</button></div>
          <div class="row wrap" style="margin-top:12px"><span class="chip">Default</span><span class="chip gold">${icon("badge-check", 13)}Verified</span><span class="chip green">Helpful</span><span class="chip red">High priority</span><span class="chip plain">#Tag</span></div></div>
        <div class="card"><h3>Accessibility principles</h3>
          <ul class="ticks">${["Minimum 44×44px touch targets for all controls", "WCAG 2.2 AA contrast on all text", "Visible gold focus ring for keyboard users", "Icons always paired with text labels in navigation", "Optional larger text mode for older clergy and volunteers", "Plain-English microcopy; no networking jargon"].map((t) => `<li>${icon("check", 20)}${t}</li>`).join("")}</ul></div>
      </div>
    </div>`);
  }

  /* ---------------- Modals ---------------- */
  const MODALS = {
    compose: () => `
      <h2>Create a post</h2>
      <div class="row wrap" style="margin-bottom:14px">${["Question", "Discussion", "Resource", "Announcement"].map((t, i) => `<button class="chip ${i === 0 ? "on" : "plain"}" data-chipgroup="ptype">${t}</button>`).join("")}</div>
      <div class="field"><label class="lbl">Title</label><input class="input" placeholder="e.g. How do you recruit new readers and welcomers?" /></div>
      <div class="field"><label class="lbl">Details</label><textarea class="input" placeholder="Share context so others can help…"></textarea></div>
      <div class="grid-2"><div class="field"><label class="lbl">Post in</label><select class="input"><option>Parish Administration</option><option>Parish Finance</option><option>Diocese of Leeds</option></select></div><div class="field"><label class="lbl">Topic tags</label><input class="input" placeholder="Volunteers, Liturgy" /></div></div>
      <div class="notice">${icon("shield-alert", 18)}<div><b>Before you post:</b> do not include names or details of parishioners, pastoral or safeguarding matters, or personal financial information.</div></div>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-close>Post</button></div>`,
    upload: () => `
      <h2>Share a resource</h2>
      <div style="border:2px dashed var(--ink-300);border-radius:14px;padding:30px;text-align:center;margin-bottom:16px">${icon("upload-cloud", 36)}<p style="margin:8px 0 0"><b>Drag a file here</b> or <a href="#">browse</a></p><p class="xs muted" style="margin:0">PDF, Word, Excel, PowerPoint · up to 50 MB</p></div>
      <div class="field"><label class="lbl">Title</label><input class="input" /></div>
      <div class="grid-2"><div class="field"><label class="lbl">Ministry</label><select class="input"><option>Finance</option></select></div><div class="field"><label class="lbl">Parish size</label><select class="input"><option>Any size</option></select></div></div>
      <div class="field"><label class="lbl">Who can see this?</label><select class="input"><option>All verified members</option><option>My diocese only</option><option>My parish team only</option></select></div>
      <label class="check"><input type="checkbox" />I confirm this file contains no personal or confidential data and I have the right to share it</label>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-close>Submit for review</button></div>`,
    report: () => `
      <h2>Report content</h2><p class="muted">Reports are confidential and reviewed by moderators within 24 hours.</p>
      ${["Contains confidential or personal information", "Safeguarding concern", "Inappropriate or uncharitable", "Spam or advertising", "Copyright"].map((t, i) => `<button class="role-opt ${i === 0 ? "on" : ""}" data-radio="rep" style="width:100%;margin-bottom:8px">${t}</button>`).join("")}
      <div class="notice red small" style="margin-top:8px">${icon("phone", 16)}<div>If someone is at risk, contact your diocesan safeguarding office or emergency services immediately.</div></div>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" data-close>Send report</button></div>`,
    invite: () => `
      <h2>Invite to your parish team</h2>
      <div class="field"><label class="lbl">Email addresses</label><textarea class="input" placeholder="One per line"></textarea></div>
      <div class="field"><label class="lbl">Role in parish</label><select class="input"><option>Catechist</option><option>Parish Administrator</option></select></div>
      <div class="field"><label class="lbl">Permissions</label><select class="input"><option>Member</option><option>Parish admin — can invite & approve</option></select></div>
      <p class="small muted">Invitees confirm their identity and start their own membership. Your invitation counts as parish verification.</p>
      <div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-close>Send invitations</button></div>`,
    group: () => `
      <h2>Create a private group</h2>
      <div class="field"><label class="lbl">Group name</label><input class="input" placeholder="e.g. Harrogate Deanery Finance Leads" /></div>
      <div class="field"><label class="lbl">Purpose</label><textarea class="input"></textarea></div>
      <div class="field"><label class="lbl">Who can join?</label><select class="input"><option>Invite only</option><option>Members of my diocese (on request)</option><option>Members of my parish</option></select></div>
      <div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-close>Create group</button></div>`,
    cancel: () => `
      <h2>Cancel your membership?</h2>
      <p>You'll keep full access until <b>9 October 2027</b>. After that, your profile is hidden but your content and connections are kept for 12 months in case you return.</p>
      <div class="field"><label class="lbl">Would you tell us why? (optional)</label><select class="input"><option>Choose a reason</option><option>Too expensive</option><option>Not using it enough</option><option>Moving role</option></select></div>
      <div class="row" style="justify-content:flex-end"><button class="btn btn-primary" data-close>Keep membership</button><button class="btn btn-outline" data-close style="color:var(--burgundy-600)">Cancel membership</button></div>`,
  };

  function openModal(name) {
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(15,33,64,.5);display:grid;place-items:center;z-index:200;padding:16px";
    wrap.innerHTML = `<div class="card" role="dialog" aria-modal="true" style="width:100%;max-width:580px;max-height:90vh;overflow:auto;padding:28px;box-shadow:var(--shadow-lg)">${MODALS[name]()}</div>`;
    wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest("[data-close]")) wrap.remove(); });
    document.body.appendChild(wrap);
    lucide.createIcons();
  }

  /* ---------------- Router ---------------- */
  const ROUTES = {
    welcome, join, feed, communities, community, post, library, resource,
    discover, messages, notifications, profile, parish, diocese, settings, admin, design,
  };

  function render() {
    const [name, arg] = (location.hash.replace(/^#\/?/, "") || "welcome").split("/");
    const fn = ROUTES[name] || welcome;
    root.innerHTML = fn(arg);
    lucide.createIcons();
    (document.body.classList.contains("phone-frame") ? root : window).scrollTo(0, 0);
    document.title = `${name.charAt(0).toUpperCase() + name.slice(1)} · Parish Network`;
  }

  /* ---------------- Interactions ---------------- */
  document.addEventListener("click", (e) => {
    const modal = e.target.closest("[data-modal]");
    if (modal) { e.preventDefault(); openModal(modal.dataset.modal); return; }

    const chip = e.target.closest("[data-chipgroup]");
    if (chip) {
      chip.parentElement.querySelectorAll(`[data-chipgroup="${chip.dataset.chipgroup}"]`).forEach((c) => { c.classList.remove("on"); c.classList.add("plain"); });
      chip.classList.add("on"); chip.classList.remove("plain");
    }

    const radio = e.target.closest("[data-radio]");
    if (radio) {
      document.querySelectorAll(`[data-radio="${radio.dataset.radio}"]`).forEach((r) => r.classList.remove("on"));
      radio.classList.add("on");
    }

    const tog = e.target.closest("[data-toggle]");
    if (tog) tog.classList.toggle(tog.dataset.toggle);

    const tab = e.target.closest(".tabs button");
    if (tab) { tab.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("on")); tab.classList.add("on"); }

    const pv = e.target.closest("[data-preview]");
    if (pv) {
      document.querySelectorAll("[data-preview]").forEach((b) => b.classList.toggle("on", b === pv));
      document.body.classList.toggle("phone-frame", pv.dataset.preview === "phone");
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "largeText") document.body.classList.toggle("large-text", e.target.checked);
  });

  window.addEventListener("hashchange", render);
  render();
})();
