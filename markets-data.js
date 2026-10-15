/**
 * Skedee — market catalogue (single source of truth)
 *
 * Loaded by index.html (homepage grid) and market.html (generic detail page).
 * Kept as a plain JS file rather than fetch('markets.json') so the site still
 * works when opened straight off disk (file://) with no server.
 *
 * Fields
 *   id       unique. Numeric ids mark a market that has its own page in
 *            markets/. Slug ids mark a market that has NO dedicated page yet
 *            and is served by market.html?id=<slug>.
 *   cat      must match a filter registered on index.html:
 *            football | sports | music | entertainment | politics |
 *            commodities | finance | weather | misc
 *   link     'markets/NNNNNN.html' for a dedicated page, else
 *            'market.html?id=<slug>'
 *   closes   optional ISO datetime. Present only where a real closing time is
 *            known; used by the "Closing Soon" sort, which ignores nulls.
 */

window.SKEDII_MARKETS = [

  // ── FOOTBALL ──────────────────────────────────────────────────────────────
  { id:'pl_everton_chelsea_20261017', cat:'football', emoji:'⚽', catLabel:'FOOTBALL · PREMIER LEAGUE', title:'Will Everton beat Chelsea?', badge:'upcoming', yes:0.35, vol:'₦0', change:'Locks Oct 17 · 12:30PM WAT', dir:'flat', link:'market.html?id=pl_everton_chelsea_20261017', closes:'2026-10-17T12:30:00+01:00', t1:'🔵', t1n:'Everton', t2:'🔵', t2n:'Chelsea', score:'VS', isMatch:true },
  { id:'pl_fulham_hull_20261017', cat:'football', emoji:'⚽', catLabel:'FOOTBALL · PREMIER LEAGUE', title:'Will Fulham beat Hull?', badge:'upcoming', yes:0.56, vol:'₦0', change:'Locks Oct 17 · 3:00PM WAT', dir:'flat', link:'market.html?id=pl_fulham_hull_20261017', closes:'2026-10-17T15:00:00+01:00', t1:'⚫', t1n:'Fulham', t2:'🟠', t2n:'Hull', score:'VS', isMatch:true },
  { id:'pl_man_city_ipswich_20261017', cat:'football', emoji:'⚽', catLabel:'FOOTBALL · PREMIER LEAGUE', title:'Will Man City beat Ipswich Town?', badge:'upcoming', yes:0.76, vol:'₦0', change:'Locks Oct 17 · 3:00PM WAT', dir:'flat', link:'market.html?id=pl_man_city_ipswich_20261017', closes:'2026-10-17T15:00:00+01:00', t1:'🔵', t1n:'Man City', t2:'🔵', t2n:'Ipswich Town', score:'VS', isMatch:true },
  { id:'pl_brentford_liverpool_20261017', cat:'football', emoji:'⚽', catLabel:'FOOTBALL · PREMIER LEAGUE', title:'Will Brentford beat Liverpool?', badge:'upcoming', yes:0.30, vol:'₦0', change:'Locks Oct 17 · 3:00PM WAT', dir:'flat', link:'market.html?id=pl_brentford_liverpool_20261017', closes:'2026-10-17T15:00:00+01:00', t1:'🔴', t1n:'Brentford', t2:'🔴', t2n:'Liverpool', score:'VS', isMatch:true },
  { id:10000048, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Ivory Coast vs Ecuador — Group E', badge:'upcoming', yes:0.40, vol:'₦48.2M', change:'Jun 15 · 1AM WAT', dir:'up', link:'markets/10000048.html', closes:'2026-06-15T00:00' },
  { id:10000049, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Sweden vs Tunisia — Group F', badge:'upcoming', yes:0.52, vol:'₦36.8M', change:'Jun 15 · 4AM WAT', dir:'up', link:'markets/10000049.html', closes:'2026-06-15T03:00' },
  { id:10000050, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Spain vs Cabo Verde — Group H (FT 0–0)', badge:'resolved', yes:0.00, vol:'₦98.4M', change:'SETTLED', dir:'flat', link:'markets/10000050.html' },
  { id:10000051, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Belgium vs Egypt — Group G', badge:'resolved', yes:1.00, vol:'₦64.2M', change:'✓ FT 2–0', dir:'up', link:'markets/10000051.html' },
  { id:10000052, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Saudi Arabia vs Uruguay — Group H', badge:'upcoming', yes:0.48, vol:'₦44.6M', change:'Jun 15 · 11PM WAT', dir:'up', link:'markets/10000052.html', closes:'2026-06-15T22:00' },
  { id:10000053, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'France vs Senegal — Group I (FT 3–1)', badge:'resolved', yes:1.00, vol:'₦112.8M', change:'SETTLED', dir:'flat', link:'markets/10000053.html' },
  { id:10000054, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Iraq vs Norway — Group I', badge:'resolved', yes:1.00, vol:'₦88.6M', change:'✓ FT 1–2', dir:'up', link:'markets/10000054.html' },
  { id:10000055, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Portugal vs DR Congo — Group K', badge:'resolved', yes:1.00, vol:'₦96.4M', change:'✓ FT 2–0', dir:'up', link:'markets/10000055.html' },
  { id:10000056, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'England vs Croatia — Group L', badge:'upcoming', yes:0.58, vol:'₦104.2M', change:'Jun 17 · 9PM WAT', dir:'up', link:'markets/10000056.html', closes:'2026-06-17T20:00' },
  { id:10000041, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Korea Republic vs Czech Republic — World Cup Group F', badge:'resolved', yes:0.40, vol:'₦18.4M', change:'SETTLED', dir:'flat', link:'markets/10000041.html' },
  { id:10000042, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Canada vs Bosnia and Herzegovina — World Cup Group C', badge:'resolved', yes:0.44, vol:'₦21.2M', change:'SETTLED', dir:'flat', link:'markets/10000042.html' },
  { id:10000043, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'USA vs Paraguay — World Cup Group D (FT 4–1)', badge:'resolved', yes:1.00, vol:'₦52.4M', change:'SETTLED', dir:'flat', link:'markets/10000043.html' },
  { id:10000044, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Qatar vs Switzerland — World Cup Group B (FT 1–1)', badge:'resolved', yes:0.00, vol:'₦18.6M', change:'SETTLED', dir:'flat', link:'markets/10000044.html' },
  { id:10000045, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Brazil vs Morocco — World Cup Group E (FT 1–1)', badge:'resolved', yes:0.00, vol:'₦84.2M', change:'SETTLED', dir:'flat', link:'markets/10000045.html' },
  { id:10000046, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Germany vs Curaçao — Group E (FT 7–1)', badge:'resolved', yes:1.00, vol:'₦124.6M', change:'SETTLED', dir:'flat', link:'markets/10000046.html' },
  { id:10000047, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Netherlands vs Japan — Group F', badge:'upcoming', yes:0.62, vol:'₦82.4M', change:'Jun 14 · 10PM WAT', dir:'up', link:'markets/10000047.html', closes:'2026-06-14T21:00' },
  { id:10000033, cat:'football', emoji:'🏆', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'2026 FIFA World Cup Winner', badge:'hot', yes:0.17, vol:'₦350M', change:'+3%', dir:'up', link:'markets/10000033.html' },
  { id:10000014, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · PREMIER LEAGUE', title:'Man City vs Aston Villa', badge:'resolved', yes:0.65, vol:'₦38M', change:'✓ FT 1–2', dir:'up', link:'markets/10000014.html' },
  { id:10000029, cat:'football', emoji:'🏆', catLabel:'FOOTBALL · CHAMPIONS LEAGUE', title:'PSG vs Arsenal — UCL Final', badge:'resolved', yes:0.52, vol:'₦89M', change:'✓ FT 1–1 (PEN)', dir:'flat', link:'markets/10000029.html' },
  { id:10000040, cat:'football', emoji:'⚽', catLabel:'FOOTBALL · FIFA WORLD CUP', title:'Mexico vs South Africa — Group A', badge:'resolved', yes:1.00, vol:'₦42.6M', change:'SETTLED', dir:'flat', link:'markets/10000040.html' },
  { id:'laliga_barca', cat:'football', emoji:'⚽', catLabel:'FOOTBALL · LA LIGA', title:'Barcelona to Win La Liga 2025/26', badge:'resolved', yes:1.00, vol:'₦52.8M', change:'YES ✓', dir:'up', link:'market.html?id=laliga_barca' },

  // ── WEATHER ───────────────────────────────────────────────────────────────
  { id:10000024, cat:'weather', emoji:'🌊', catLabel:'WEATHER · LAGOS', title:'Will Lagos Experience Major Flooding Before July?', badge:'hot', yes:0.67, vol:'₦34.6M', change:'+14%', dir:'up', link:'markets/10000024.html', isCommodity:true },
  { id:10000025, cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'When Will It Rain in Lagos Today?', badge:'live', yes:0.58, vol:'₦12.4M', change:'+4%', dir:'up', link:'markets/10000025.html' },
  { id:'wx_abj_today', cat:'weather', emoji:'🌤️', catLabel:'WEATHER · ABUJA', title:'Will it rain in Abuja today?', badge:'hot', yes:0.44, vol:'₦6.1M', change:'+3%', dir:'up', link:'market.html?id=wx_abj_today' },
  { id:10000031, cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'Will it Rain in Lagos this Weekend? — May 30–31', badge:'resolved', yes:0.88, vol:'₦11.4M', change:'SETTLED', dir:'flat', link:'markets/10000031.html' },
  { id:10000032, cat:'weather', emoji:'🌧️', catLabel:'WEATHER · ABUJA', title:'Will it Rain in Abuja this Weekend? — May 30–31', badge:'resolved', yes:0.34, vol:'₦8.2M', change:'SETTLED', dir:'flat', link:'markets/10000032.html' },
  { id:'wx_lag_jun7',  cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'Will it Rain in Lagos this Weekend? — Jun 7–8',  badge:'live',    yes:0.79, vol:'₦6.8M', change:'+8%', dir:'up',   link:'market.html?id=wx_lag_jun7', closes:'2026-06-08T23:59' },
  { id:'wx_abj_jun7',  cat:'weather', emoji:'🌧️', catLabel:'WEATHER · ABUJA', title:'Will it Rain in Abuja this Weekend? — Jun 7–8',  badge:'live',    yes:0.55, vol:'₦4.1M', change:'+3%', dir:'up',   link:'market.html?id=wx_abj_jun7', closes:'2026-06-08T23:59' },
  { id:'wx_lag_jun14', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'Will it Rain in Lagos this Weekend? — Jun 14–15', badge:'new', yes:0.82, vol:'₦5.1M', change:'+0%', dir:'flat', link:'market.html?id=wx_lag_jun14', closes:'2026-06-15T23:59' },
  { id:'wx_abj_jun14', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · ABUJA', title:'Will it Rain in Abuja this Weekend? — Jun 14–15', badge:'new', yes:0.61, vol:'₦3.2M', change:'+0%', dir:'flat', link:'market.html?id=wx_abj_jun14', closes:'2026-06-15T23:59' },
  { id:'wx_lag_jun21', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'Will it Rain in Lagos this Weekend? — Jun 21–22', badge:'new', yes:0.85, vol:'₦3.8M', change:'+0%', dir:'flat', link:'market.html?id=wx_lag_jun21', closes:'2026-06-22T23:59' },
  { id:'wx_abj_jun21', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · ABUJA', title:'Will it Rain in Abuja this Weekend? — Jun 21–22', badge:'new', yes:0.64, vol:'₦2.4M', change:'+0%', dir:'flat', link:'market.html?id=wx_abj_jun21', closes:'2026-06-22T23:59' },
  { id:'wx_lag_jun28', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · LAGOS', title:'Will it Rain in Lagos this Weekend? — Jun 28–29', badge:'new', yes:0.87, vol:'₦3.1M', change:'+0%', dir:'flat', link:'market.html?id=wx_lag_jun28', closes:'2026-06-29T23:59' },
  { id:'wx_abj_jun28', cat:'weather', emoji:'🌧️', catLabel:'WEATHER · ABUJA', title:'Will it Rain in Abuja this Weekend? — Jun 28–29', badge:'new', yes:0.66, vol:'₦1.9M', change:'+0%', dir:'flat', link:'market.html?id=wx_abj_jun28', closes:'2026-06-29T23:59' },

  // ── MUSIC ─────────────────────────────────────────────────────────────────
  { id:10000026, cat:'music', emoji:'🎵', catLabel:'MUSIC · NAIJA', title:'Who Will Drop a Studio Album in 2026?', badge:'hot', yes:0.71, vol:'₦114.2M', change:'+22%', dir:'up', link:'markets/10000026.html' },
  { id:10000030, cat:'music', emoji:'🎵', catLabel:'MUSIC · NAIJA', title:'Who Releases a New Song in June? — Naija', badge:'resolved', yes:0.62, vol:'₦18.4M', change:'SETTLED', dir:'flat', link:'markets/10000030.html' },
  { id:'music_newsong_jun', cat:'music', emoji:'🎵', catLabel:'MUSIC · NAIJA', title:'Who Drops a New Song in June? — Naija', badge:'new', yes:0.71, vol:'₦9.2M', change:'+2%', dir:'up', link:'market.html?id=music_newsong_jun' },

  // ── ENTERTAINMENT ─────────────────────────────────────────────────────────
  { id:10000004, cat:'entertainment', emoji:'🎬', catLabel:'ENTERTAINMENT · BBNaija', title:'When Will BBNaija S11 Auditions Begin?', badge:'resolved', yes:1.00, vol:'₦28.4M', change:'SETTLED', dir:'flat', link:'markets/10000004.html' },
  { id:'ent_funke_film', cat:'entertainment', emoji:'🎬', catLabel:'ENTERTAINMENT · FILM', title:"Will Funke Akindele's new film hit ₦1bn?", badge:'hot', yes:0.52, vol:'₦14.6M', change:'+3%', dir:'up', link:'market.html?id=ent_funke_film' },

  // ── POLITICS ──────────────────────────────────────────────────────────────
  { id:10000005, cat:'politics', emoji:'⚖️', catLabel:'POLITICS · WORLD BANK', title:'Will the $1.25bn World Bank Loan be Approved?', badge:'resolved', yes:0.74, vol:'₦61.4M', change:'SETTLED', dir:'flat', link:'markets/10000005.html' },
  { id:11, cat:'politics', emoji:'⚖️', catLabel:'POLITICS · WORLD BANK', title:'Will the $1.45bn loan to Nigeria be approved?', badge:'hot', yes:0.74, no:0.26, vol:'₦61.4M', change:'+8%', dir:'up', link:'market.html?id=pol_worldbank_loan' },
  { id:13, cat:'politics', emoji:'⚖️', catLabel:'POLITICS', title:'Will Tinubu sign the tax reform bill before July?', badge:'hot', yes:0.54, no:0.46, vol:'₦22M', change:'+6%', dir:'up', link:'market.html?id=pol_tinubu_tax' },
  { id:14, cat:'politics', emoji:'⚖️', catLabel:'POLITICS', title:'Will Obi run for President in 2027?', badge:'new', yes:0.62, no:0.38, vol:'₦47.1M', change:'+5%', dir:'up', link:'market.html?id=pol_obi_2027' },

  // ── COMMODITIES ───────────────────────────────────────────────────────────
  { id:10000007, cat:'commodities', emoji:'⛽', catLabel:'COMMODITIES · FUEL', title:'Will fuel hit ₦1,400 before July?', badge:'hot', yes:0.62, vol:'₦38M', change:'+9%', dir:'up', link:'markets/10000007.html' },
  { id:10000035, cat:'commodities', emoji:'🛢️', catLabel:'COMMODITIES · CRUDE OIL', title:'Will Crude Oil Hit $100/Barrel Before July?', badge:'hot', yes:0.18, vol:'₦14.3M', change:'+2%', dir:'up', link:'markets/10000035.html', isCommodity:true },
  { id:16, cat:'commodities', emoji:'⛽', catLabel:'COMMODITIES', title:'Will petrol pump price exceed ₦1,200/litre by July?', badge:'new', yes:0.55, no:0.45, vol:'₦22.4M', change:'+6%', dir:'up', link:'market.html?id=com_petrol_1200', isCommodity:true },
  { id:17, cat:'commodities', emoji:'🌾', catLabel:'COMMODITIES', title:'Will a 50kg bag of rice exceed ₦120,000 by August?', badge:'new', yes:0.38, no:0.62, vol:'₦18.7M', change:'+2%', dir:'up', link:'market.html?id=com_rice_120k', isCommodity:true },
  { id:18, cat:'commodities', emoji:'🫘', catLabel:'COMMODITIES', title:'Will beans price rise above ₦90,000 per bag in Q3?', badge:'new', yes:0.44, no:0.56, vol:'₦12.3M', change:'+1%', dir:'up', link:'market.html?id=com_beans_90k', isCommodity:true },
  { id:19, cat:'commodities', emoji:'🥚', catLabel:'COMMODITIES', title:'Will a crate of eggs exceed ₦3,500 before September?', badge:'new', yes:0.61, no:0.39, vol:'₦9.8M', change:'+3%', dir:'up', link:'market.html?id=com_eggs_3500', isCommodity:true },
  { id:20, cat:'commodities', emoji:'🍌', catLabel:'COMMODITIES', title:'Will plantain prices drop below ₦800/bunch by August?', badge:'new', yes:0.29, no:0.71, vol:'₦7.1M', change:'-2%', dir:'down', link:'market.html?id=com_plantain_800', isCommodity:true },
  { id:21, cat:'commodities', emoji:'🌽', catLabel:'COMMODITIES', title:'Will food inflation fall below 30% by end of 2026?', badge:'new', yes:0.33, no:0.67, vol:'₦16.4M', change:'+1%', dir:'up', link:'market.html?id=com_food_infl', isCommodity:true },

  // ── FINANCE ───────────────────────────────────────────────────────────────
  { id:10000008, cat:'finance', emoji:'🪙', catLabel:'FINANCE · FOREX', title:'Will Naira/Dollar Hit ₦1,500 Before June?', badge:'resolved', yes:1.00, vol:'₦44M', change:'YES ✓', dir:'flat', link:'markets/10000008.html' },
  { id:'fin_dollar_1700', cat:'finance', emoji:'💱', catLabel:'FINANCE · FOREX', title:'Dollar hits ₦1,700 before August', badge:'new', yes:0.44, vol:'₦31M', change:'+2%', dir:'up', link:'market.html?id=fin_dollar_1700', isCommodity:true },
  { id:22, cat:'finance', emoji:'🪙', catLabel:'FINANCE · FOREX', title:'Will Naira/Dollar hit ₦1,800 before year end?', badge:'hot', yes:0.48, no:0.52, vol:'₦88.3M', change:'+4%', dir:'up', link:'market.html?id=fin_dollar_1800', isCommodity:true },
  { id:23, cat:'finance', emoji:'📈', catLabel:'FINANCE · CBN', title:'Will CBN cut interest rates at June MPC meeting?', badge:'new', yes:0.31, no:0.69, vol:'₦29.5M', change:'+4%', dir:'up', link:'market.html?id=fin_cbn_mpc', isCommodity:true },
  { id:10000037, cat:'finance', emoji:'💵', catLabel:'FINANCE · FOREX', title:'Will Dollar to Naira hit ₦2,000 this year?', badge:'live', yes:0.38, no:0.62, vol:'₦52.1M', change:'+9%', dir:'up', link:'markets/10000037.html', closes:'2026-12-31T23:59', isCommodity:true },
  { id:10000039, cat:'finance', emoji:'💱', catLabel:'FINANCE · FOREX · MULTI', title:'What will Naira/Dollar Rate be?', badge:'live', yes:0.16, vol:'₦14.3M', change:'● LIVE', dir:'flat', link:'markets/10000039.html', isCommodity:true },

  // ── SPORTS ────────────────────────────────────────────────────────────────
  { id:10000034, cat:'sports', emoji:'🏀', catLabel:'BASKETBALL · NBA', title:'New York Knicks vs San Antonio Spurs', badge:'upcoming', yes:0.65, vol:'₦7.2M', change:'+0%', dir:'up', link:'markets/10000034.html' },
  { id:10000038, cat:'sports', emoji:'🏀', catLabel:'BASKETBALL · NBA', title:'Who Will Win the 2026 NBA Championship?', badge:'hot', yes:0.68, vol:'₦28.4M', change:'+6%', dir:'up', link:'markets/10000038.html' },
  { id:24, cat:'sports', emoji:'🏀', catLabel:'BASKETBALL', title:'Will the Lakers win the NBA Championship 2026?', badge:'hot', yes:0.18, no:0.82, vol:'₦22.8M', change:'-2%', dir:'down', link:'market.html?id=spo_lakers' },
  { id:25, cat:'sports', emoji:'🎾', catLabel:'TENNIS', title:'Will Djokovic win Wimbledon 2026?', badge:'new', yes:0.34, no:0.66, vol:'₦15.2M', change:'+1%', dir:'up', link:'market.html?id=spo_djokovic' },

  // ── MISCELLANEOUS ─────────────────────────────────────────────────────────
  { id:10000027, cat:'misc', emoji:'⚡', catLabel:'ENERGY · LAGOS', title:'Will NEPA Bring Light Tonight?', badge:'live', yes:0.47, vol:'₦8.7M', change:'+2%', dir:'up', link:'markets/10000027.html' },
  { id:10000036, cat:'misc', emoji:'🌍', catLabel:'MISC · DEMOGRAPHICS', title:"Will Nigeria's Population Hit 250M This Year?", badge:'hot', yes:0.13, vol:'₦8.4M', change:'+1%', dir:'up', link:'markets/10000036.html' },

];
