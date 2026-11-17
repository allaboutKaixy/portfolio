/**
 * MD KAIF - PORTFOLIO INTERACTION ENGINE
 * Growth Strategy, Interactive Data Visualizations, Simulator & Analytics
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Set Current Year in Footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 1. THEME SWITCHER (Dark / Light Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlEl = document.documentElement;
  const bodyEl = document.body;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem("mk_theme") || "dark";
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = bodyEl.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    bodyEl.setAttribute("data-theme", theme);
    if (theme === "light") {
      htmlEl.classList.remove("dark");
    } else {
      htmlEl.classList.add("dark");
    }
    localStorage.setItem("mk_theme", theme);
    updateChartsTheme(theme);
    if (window.lucide) lucide.createIcons();
  }

  // ==========================================
  // 2. MOBILE NAVIGATION MENU
  // ==========================================
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when clicking any nav link
    const mobileLinks = mobileMenu.querySelectorAll("a, button");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // ==========================================
  // 3. COPY TO CLIPBOARD UTILITY
  // ==========================================
  const copyTriggers = document.querySelectorAll(".copy-trigger");
  copyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const textToCopy = trigger.getAttribute("data-copy") || trigger.innerText.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = trigger.innerHTML;
        trigger.innerHTML = `<span class="text-emerald-400 font-bold">✓ Copied!</span>`;
        setTimeout(() => {
          trigger.innerHTML = originalHtml;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      });
    });
  });

  // ==========================================
  // 4. ANIMATED NUMBER COUNTERS
  // ==========================================
  const counters = document.querySelectorAll(".counter");
  const speed = 250;

  const countUp = (entry, observer) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const targetVal = +target.getAttribute("data-target");
      const isMillions = targetVal >= 1000000;
      let count = 0;
      const increment = targetVal / speed;

      const updateCount = () => {
        count += increment;
        if (count < targetVal) {
          if (isMillions) {
            target.innerText = (count / 1000000).toFixed(1) + "M";
          } else {
            target.innerText = Math.ceil(count);
          }
          requestAnimationFrame(updateCount);
        } else {
          if (isMillions) {
            target.innerText = (targetVal / 1000000).toFixed(1) + "M";
          } else {
            target.innerText = targetVal;
          }
        }
      };
      updateCount();
      observer.unobserve(target);
    }
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => countUp(entry, observer));
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // ==========================================
  // 5. CHART.JS VISUALIZATIONS
  // ==========================================
  let heroSparklineChart = null;
  let viralReachChart = null;
  let teslaKpiChart = null;

  function initCharts() {
    const isDark = (bodyEl.getAttribute("data-theme") || "dark") === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94a3b8" : "#64748b";

    // 1. Hero Mini Sparkline
    const sparkCanvas = document.getElementById("heroSparkline");
    if (sparkCanvas && window.Chart) {
      const ctx = sparkCanvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 80);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");

      heroSparklineChart = new Chart(sparkCanvas, {
        type: "line",
        data: {
          labels: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"],
          datasets: [
            {
              data: [12000, 45000, 180000, 520000, 1150000, 1800000, 2240000],
              borderColor: "#10b981",
              borderWidth: 2.5,
              tension: 0.45,
              fill: true,
              backgroundColor: gradient,
              pointRadius: 0,
              pointHoverRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        },
      });
    }

    // 2. Viral Reach Growth Chart (@ham-se-hamdan)
    const viralCanvas = document.getElementById("viralReachChart");
    if (viralCanvas && window.Chart) {
      const ctx = viralCanvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.45)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.01)");

      viralReachChart = new Chart(viralCanvas, {
        type: "line",
        data: {
          labels: [
            "Day 2", "Day 5", "Day 8", "Day 11", "Day 14", 
            "Day 17", "Day 20", "Day 23", "Day 26", "Day 29", "Day 30"
          ],
          datasets: [
            {
              label: "Cumulative Views / Reach",
              data: [
                15000, 52000, 130000, 290000, 680000, 
                1050000, 1420000, 1780000, 2040000, 2190000, 2240000
              ],
              borderColor: "#10b981",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              backgroundColor: gradient,
              pointBackgroundColor: "#10b981",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 1.5,
              pointRadius: 4,
              pointHoverRadius: 7,
            },
            {
              label: "Daily Reach Spike",
              data: [
                7000, 18000, 35000, 75000, 180000, 
                150000, 140000, 120000, 95000, 70000, 50000
              ],
              type: "bar",
              backgroundColor: isDark ? "rgba(56, 189, 248, 0.35)" : "rgba(2, 132, 199, 0.35)",
              borderRadius: 6,
              yAxisID: "yDaily",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              labels: { color: textColor, font: { family: "JetBrains Mono", size: 11 } },
            },
            tooltip: {
              backgroundColor: isDark ? "#111622" : "#ffffff",
              titleColor: isDark ? "#f8fafc" : "#0f172a",
              bodyColor: isDark ? "#cbd5e1" : "#334155",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  return ` ${context.dataset.label}: ${context.raw.toLocaleString()} views`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: "JetBrains Mono", size: 10 } },
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: "JetBrains Mono", size: 10 },
                callback: (val) => `${(val / 1000000).toFixed(1)}M`,
              },
            },
            yDaily: {
              position: "right",
              display: false,
              grid: { display: false },
            },
          },
        },
      });
    }

    // 3. Tesla D2C KPI Radar / Comparison
    const teslaCanvas = document.getElementById("teslaKpiChart");
    if (teslaCanvas && window.Chart) {
      teslaKpiChart = new Chart(teslaCanvas, {
        type: "radar",
        data: {
          labels: [
            "Margin Shield (24%)",
            "Ticket Reduction (-30%)",
            "NPS Advocacy (50+)",
            "Referral Uplift (+15%)",
            "Value Add ($9.2K)",
            "Detractor Drop (-25%)",
          ],
          datasets: [
            {
              label: "Baseline / Legacy Model",
              data: [50, 45, 55, 40, 45, 40],
              borderColor: isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.5)",
              backgroundColor: "rgba(148, 163, 184, 0.1)",
              borderWidth: 1.5,
              pointRadius: 2,
            },
            {
              label: "Kaif D2C Strategy Target",
              data: [95, 90, 92, 88, 96, 85],
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.25)",
              borderWidth: 2.5,
              pointBackgroundColor: "#38bdf8",
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textColor, font: { family: "JetBrains Mono", size: 10 } },
            },
          },
          scales: {
            r: {
              grid: { color: gridColor },
              angleLines: { color: gridColor },
              pointLabels: {
                color: textColor,
                font: { family: "JetBrains Mono", size: 9 },
              },
              ticks: { display: false, max: 100 },
            },
          },
        },
      });
    }
  }

  function updateChartsTheme(theme) {
    const isDark = theme === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#94a3b8" : "#64748b";

    [viralReachChart, teslaKpiChart].forEach((chart) => {
      if (!chart) return;
      if (chart.options.scales.x) {
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.y.ticks.color = textColor;
      }
      if (chart.options.scales.r) {
        chart.options.scales.r.grid.color = gridColor;
        chart.options.scales.r.angleLines.color = gridColor;
        chart.options.scales.r.pointLabels.color = textColor;
      }
      if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      chart.update();
    });
  }

  // Initialize charts
  setTimeout(initCharts, 200);

  // ==========================================
  // 6. INTERACTIVE GROWTH SIMULATOR (D2C & ROI)
  // ==========================================
  const trafficSlider = document.getElementById("trafficSlider");
  const conversionSlider = document.getElementById("conversionSlider");
  const aovSlider = document.getElementById("aovSlider");
  const referralSlider = document.getElementById("referralSlider");

  const trafficValue = document.getElementById("trafficValue");
  const conversionValue = document.getElementById("conversionValue");
  const aovValue = document.getElementById("aovValue");
  const referralValue = document.getElementById("referralValue");

  const baseRevenueOutput = document.getElementById("baseRevenueOutput");
  const projectedRevenueOutput = document.getElementById("projectedRevenueOutput");
  const netGainOutput = document.getElementById("netGainOutput");
  const supportSavingOutput = document.getElementById("supportSavingOutput");
  const resetSimulatorBtn = document.getElementById("resetSimulatorBtn");

  function calculateSimulator() {
    if (!trafficSlider || !conversionSlider || !aovSlider || !referralSlider) return;

    const traffic = parseInt(trafficSlider.value, 10);
    const cr = parseFloat(conversionSlider.value);
    const aov = parseInt(aovSlider.value, 10);
    const referral = parseInt(referralSlider.value, 10);

    // Update label displays
    trafficValue.textContent = traffic.toLocaleString();
    conversionValue.textContent = cr.toFixed(1) + "%";
    aovValue.textContent = "$" + aov.toLocaleString();
    referralValue.textContent = `+${referral}% ${referral === 15 ? "(Kaif's Target)" : ""}`;

    // Math models
    const baselineOrders = Math.round(traffic * (cr / 100));
    const baseRevenue = baselineOrders * aov;

    const referralOrders = Math.round(baselineOrders * (referral / 100));
    const projectedRevenue = (baselineOrders + referralOrders) * aov;
    const monthlyNetGain = projectedRevenue - baseRevenue;
    const annualNetGain = monthlyNetGain * 12;

    // Support ticket savings (30% reduction from Tesla Model X methodology)
    const estTickets = Math.round(baselineOrders * 0.35);
    const estSavings = Math.round(estTickets * 0.3 * 25); // $25 cost per service ticket

    // Output formatting
    baseRevenueOutput.textContent = "$" + baseRevenue.toLocaleString();
    projectedRevenueOutput.textContent = "$" + projectedRevenue.toLocaleString();
    netGainOutput.textContent = `+$${annualNetGain.toLocaleString()}/yr`;
    supportSavingOutput.textContent = `$${(estSavings * 12).toLocaleString()} Saved/yr`;
  }

  [trafficSlider, conversionSlider, aovSlider, referralSlider].forEach((slider) => {
    if (slider) {
      slider.addEventListener("input", calculateSimulator);
    }
  });

  if (resetSimulatorBtn) {
    resetSimulatorBtn.addEventListener("click", () => {
      trafficSlider.value = 25000;
      conversionSlider.value = 1.8;
      aovSlider.value = 1200;
      referralSlider.value = 15;
      calculateSimulator();
    });
  }

  // Run initial calculation
  calculateSimulator();

  // ==========================================
  // 7. INTERACTIVE SEO CHECKLIST SIMULATOR
  // ==========================================
  const seoCheckboxes = document.querySelectorAll(".seo-checkbox");
  const auditScoreBadge = document.getElementById("auditScoreBadge");
  const auditProgressBar = document.getElementById("auditProgressBar");
  const auditVerdictText = document.getElementById("auditVerdictText");
  const celebrateAuditBtn = document.getElementById("celebrateAuditBtn");

  function calculateAuditScore() {
    if (!auditScoreBadge || !auditProgressBar) return;

    let score = 0;
    seoCheckboxes.forEach((cb) => {
      if (cb.checked) {
        score += parseInt(cb.getAttribute("data-points") || 20, 10);
      }
    });

    auditScoreBadge.textContent = `${score}/100`;
    auditProgressBar.style.width = `${score}%`;

    if (score === 100) {
      auditScoreBadge.className = "text-lg font-mono font-bold text-emerald-400";
      auditVerdictText.textContent = "Excellent: Ready for SERP Dominance";
      auditVerdictText.className = "text-emerald-400 font-bold";
      auditProgressBar.className = "h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300";
    } else if (score >= 60) {
      auditScoreBadge.className = "text-lg font-mono font-bold text-amber-400";
      auditVerdictText.textContent = "Moderate Gaps: Crawl Leaks Detected";
      auditVerdictText.className = "text-amber-400 font-bold";
      auditProgressBar.className = "h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300";
    } else {
      auditScoreBadge.className = "text-lg font-mono font-bold text-rose-400";
      auditVerdictText.textContent = "Critical: Search Engines Unable to Index";
      auditVerdictText.className = "text-rose-400 font-bold";
      auditProgressBar.className = "h-full bg-gradient-to-r from-rose-500 to-red-400 transition-all duration-300";
    }
  }

  seoCheckboxes.forEach((cb) => {
    cb.addEventListener("change", calculateAuditScore);
  });

  if (celebrateAuditBtn) {
    celebrateAuditBtn.addEventListener("click", () => {
      seoCheckboxes.forEach((cb) => (cb.checked = true));
      calculateAuditScore();
      if (window.confetti) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#38bdf8", "#f59e0b"],
        });
      }
    });
  }

  // ==========================================
  // 8. PROJECT FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.classList.add("animate-fade-in");
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================
  // 9. CASE STUDY DETAILED MODAL DATA
  // ==========================================
  const caseStudyData = {
    tesla: {
      tag: "D2C Growth & Journey Architecture",
      title: "Tesla Model X – Direct-to-Consumer Strategy",
      subtitle: "January 2026 • High-Margin Automotive Funnel & Retention Blueprint",
      content: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <strong>Strategic Mandate:</strong> Formulate an end-to-end Direct-to-Consumer growth model for the Model X that preserves 24% operating margins against competitive EV compression while boosting post-purchase advocacy.
          </div>

          <h5 class="font-serif font-bold text-foreground text-base">1. Customer Segmentation & Competitor Differentiation</h5>
          <p class="text-xs text-muted leading-relaxed">
            Analyzed affluent luxury SUV buyer cohorts (HNW tech executives, growing families, performance purists). Mapped direct pricing models and vehicle custom packages against competitor EV flagships, establishing differentiated software-unlocked luxury tiers to safeguard a target <strong>24% margin protection</strong>.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">2. Digital Sales & Virtual Configurator Optimization</h5>
          <p class="text-xs text-muted leading-relaxed">
            Re-architected the online ordering experience by replacing static specs with an interactive 3D virtual configurator. By introducing digital delivery scheduling, personalized welcome video sequences, and pre-delivery vehicle feature tutorials, the framework projected a <strong>30% reduction in service-related tickets</strong> during the first 90 days of ownership.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">3. Retention, Advocacy & Unit Contribution Modeling</h5>
          <p class="text-xs text-muted leading-relaxed">
            Engineered an owner referral flywheel targeting an <strong>NPS of 50+</strong>, a <strong>25% reduction in customer detractor ratings</strong>, and a <strong>15% increase in organic customer referrals</strong>. Financially modeled direct-sales distribution channels, generating an estimated <strong>$9,200 additional margin contribution per vehicle</strong> through custom accessories, FSD attach rates, and streamlined direct delivery operations.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-center text-xs">
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Margin Guard</span>
              <strong class="text-emerald-400 text-sm">24%</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Ticket Reduction</span>
              <strong class="text-cyan-400 text-sm">-30%</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Target NPS</span>
              <strong class="text-purple-400 text-sm">50+</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Unit Contribution</span>
              <strong class="text-emerald-400 text-sm">+$9,200</strong>
            </div>
          </div>
        </div>
      `,
    },
    hamdan: {
      tag: "Social Media & Viral Engineering",
      title: "@ham-se-hamdan Instagram Campaign",
      subtitle: "Oct 2026 – Nov 2026 • 2.2M+ Reach Generated within 25–30 Days",
      content: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono">
            <strong>Campaign Objective:</strong> Maximize organic audience engagement, follower conversion, and brand visibility on Instagram for @ham-se-hamdan under tight sprint constraints.
          </div>

          <h5 class="font-serif font-bold text-foreground text-base">1. Content Framework & Hook Architecture</h5>
          <p class="text-xs text-muted leading-relaxed">
            Conducted rapid iterative testing on video hooks across the first 3 seconds of short-form reels. Combined high-contrast visual cues, emotional narrative questions, and trending audio waveforms to elevate retention past the critical 80% completion threshold required for Instagram Explore distribution.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">2. Algorithmic Cadence & Social Optimization</h5>
          <p class="text-xs text-muted leading-relaxed">
            Established a disciplined daily publishing rhythm synchronized with audience activity heatmaps. Engineered interactive story polls, pinned high-value discussion prompts in comment sections, and cross-collaborated with relevant niche creators to amplify referral loops.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">3. Deliverables & Quantified Impact</h5>
          <p class="text-xs text-muted leading-relaxed">
            Exceeded initial growth projections by delivering over <strong>2.2M+ cumulative organic impressions</strong> within 25 to 30 days. Successfully transformed the @ham-se-hamdan channel into a recognized cultural conversation hub with zero paid advertising expense.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 font-mono text-center text-xs">
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Total Organic Reach</span>
              <strong class="text-pink-400 text-sm">2,200,000+</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Sprint Timeline</span>
              <strong class="text-emerald-400 text-sm">25–30 Days</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Paid Ad Budget</span>
              <strong class="text-cyan-400 text-sm">$0 (100% Organic)</strong>
            </div>
          </div>
        </div>
      `,
    },
    seo: {
      tag: "Technical SEO & E-Commerce Scaling",
      title: "100+ Enterprise SEO Audits & 50+ Product Optimization",
      subtitle: "December 2025 • Crawl Efficiency, Search Intent Alignment & Indexation",
      content: `
        <div class="space-y-5">
          <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <strong>Diagnostic Scope:</strong> Complete technical crawl audits for over 100 domains, combined with granular on-page and semantic keyword optimization for 50+ commercial products.
          </div>

          <h5 class="font-serif font-bold text-foreground text-base">1. 100+ Website Diagnostic Audits</h5>
          <p class="text-xs text-muted leading-relaxed">
            Identified and remediated critical technical barriers: orphan URLs, duplicate pagination, canonical misconfigurations, redirect loops (301/302), and robots.txt crawling leaks. Evaluated Core Web Vitals to eliminate Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) issues.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">2. 50+ Product Catalog Optimization</h5>
          <p class="text-xs text-muted leading-relaxed">
            Conducted in-depth keyword gap research for 50+ products. Re-wrote product titles, meta descriptions, and header hierarchies aligned with high-converting buyer search intent. Standardized descriptive image ALT tags and structured Schema.org JSON-LD data (Product, Offers, Reviews) to secure rich snippets on SERPs.
          </p>

          <h5 class="font-serif font-bold text-foreground text-base">3. Structural & Mobile Refactoring</h5>
          <p class="text-xs text-muted leading-relaxed">
            Optimized URL taxonomy, implemented internal contextual linking silos, and verified strict mobile-first viewport responsiveness, ensuring full crawlability by Googlebot and maximizing organic search rankings.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-center text-xs">
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Sites Audited</span>
              <strong class="text-blue-400 text-sm">100+ Websites</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Products Scaled</span>
              <strong class="text-emerald-400 text-sm">50+ Products</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Crawl Efficiency</span>
              <strong class="text-cyan-400 text-sm">+92%</strong>
            </div>
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <span class="text-slate-400 block text-[10px]">Mobile Pass</span>
              <strong class="text-purple-400 text-sm">100%</strong>
            </div>
          </div>
        </div>
      `,
    },
  };

  const caseStudyModal = document.getElementById("caseStudyModal");
  const csModalTag = document.getElementById("csModalTag");
  const csModalTitle = document.getElementById("csModalTitle");
  const csModalSubtitle = document.getElementById("csModalSubtitle");
  const csModalBody = document.getElementById("csModalBody");
  const closeCaseStudyModalBtn = document.getElementById("closeCaseStudyModalBtn");
  const csModalCloseFooterBtn = document.getElementById("csModalCloseFooterBtn");

  document.querySelectorAll(".open-case-study").forEach((btn) => {
    btn.addEventListener("click", () => {
      const projKey = btn.getAttribute("data-project");
      const data = caseStudyData[projKey];
      if (data && caseStudyModal) {
        csModalTag.textContent = data.tag;
        csModalTitle.textContent = data.title;
        csModalSubtitle.textContent = data.subtitle;
        csModalBody.innerHTML = data.content;
        caseStudyModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeCaseStudy = () => {
    if (caseStudyModal) {
      caseStudyModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  if (closeCaseStudyModalBtn) closeCaseStudyModalBtn.addEventListener("click", closeCaseStudy);
  if (csModalCloseFooterBtn) csModalCloseFooterBtn.addEventListener("click", closeCaseStudy);

  if (caseStudyModal) {
    caseStudyModal.addEventListener("click", (e) => {
      if (e.target === caseStudyModal) closeCaseStudy();
    });
  }

  // ==========================================
  // 10. RESUME VIEW & NATIVE PRINT MODAL
  // ==========================================
  const resumeModal = document.getElementById("resumeModal");
  const openResumeModalBtn = document.getElementById("openResumeModalBtn");
  const openResumeModalMobileBtn = document.getElementById("openResumeModalMobileBtn");
  const heroResumeBtn = document.getElementById("heroResumeBtn");
  const closeResumeModalBtn = document.getElementById("closeResumeModalBtn");
  const printResumeBtn = document.getElementById("printResumeBtn");

  const openResume = () => {
    if (resumeModal) {
      resumeModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      if (window.lucide) lucide.createIcons();
    }
  };

  const closeResume = () => {
    if (resumeModal) {
      resumeModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  };

  if (openResumeModalBtn) openResumeModalBtn.addEventListener("click", openResume);
  if (openResumeModalMobileBtn) openResumeModalMobileBtn.addEventListener("click", openResume);
  if (heroResumeBtn) heroResumeBtn.addEventListener("click", openResume);
  document.querySelectorAll(".view-resume-trigger").forEach((btn) => btn.addEventListener("click", openResume));

  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener("click", closeResume);
  if (resumeModal) {
    resumeModal.addEventListener("click", (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // ==========================================
  // 11. CONTACT FORM HANDLING
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showFeedback("Please complete all required fields.", "error");
        return;
      }

      // Generate mailto link as fallback/direct trigger
      const mailtoLink = `mailto:raunaquekaif@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry - ${subject}] from ${name}`
      )}&body=${encodeURIComponent(
        `Sender Name: ${name}\nEmail: ${email}\nInquiry Type: ${subject}\n\nMessage:\n${message}`
      )}`;

      // Show success celebration
      showFeedback(`Thank you, ${name}! Opening email client to send message to MD Kaif...`, "success");

      if (window.confetti) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 800);
    });
  }

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.classList.remove("hidden", "bg-emerald-500/20", "text-emerald-400", "bg-rose-500/20", "text-rose-400");
    if (type === "success") {
      formFeedback.classList.add("bg-emerald-500/20", "text-emerald-400", "border", "border-emerald-500/30");
    } else {
      formFeedback.classList.add("bg-rose-500/20", "text-rose-400", "border", "border-rose-500/30");
    }
    formFeedback.textContent = msg;
  }

  // ==========================================
  // 12. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

