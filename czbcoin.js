// ── Config ────────────────────────────────────────────────────────────────────
var PRAGUE_TZ  = 'Europe/Prague';
var PRED_STEPS = 8;      // predikčních kroků
var LOOKBACK   = 10;     // posledních bodů pro analýzu trendu

// Zrcadlí konstanty z economy_hpserver.py
var BASE_PRICE           = 10000;
var PRICE_SOFT_CEILING   = 30000;
var PRICE_FLOOR          = 100;
var LOW_PRICE_THRESHOLD  = 3000;
var LOW_PRICE_STREAK_LIM = 2;

// ── Střední faktory per typ eventu (průměr z reálných rozsahů MARKET_EVENTS) ──
// bull:          průměr rozsahů ~+25 %  → 0.25
// bear:          průměr rozsahů ~-20 %  → -0.20  (opravená asymetrie)
// neutral:       ±2 %                   → 0.0
// wild:          ±60 % oboustranně      → 0.0 (znaménko řeší hod)
// special_bull:  +65 %                  → 0.65
// special_bear:  -55 %                  → -0.55
// crash:         -100 %                 → -1.0
var EVENT_FACTORS = {
    bull:          0.25,
    bear:         -0.20,
    neutral:       0.00,
    wild:          0.60,   // absolutní hodnota, znaménko rozhodne hod
    special_bull:  0.65,
    special_bear: -0.55,
    crash:        -1.00
};

// ── Dynamické váhy — zrcadlí _pick_market_event(price) z bota ─────────────────
// Vrátí {bull, bear, neutral, wild, special_bull, special_bear, crash} váhy
// pro danou cenu, včetně recovery boostu.
function getMarketWeights(price, lowStreak) {
    var bull_w, bear_w;
    if      (price < 1000)                       { bull_w = 60; bear_w = 10; }
    else if (price < 2000)                       { bull_w = 52; bear_w = 14; }
    else if (price < 5000)                       { bull_w = 42; bear_w = 20; }
    else if (price < 10000)                      { bull_w = 33; bear_w = 27; }
    else if (price < 20000)                      { bull_w = 27; bear_w = 33; }
    else if (price < PRICE_SOFT_CEILING)         { bull_w = 20; bear_w = 42; }
    else if (price < 45000)                      { bull_w = 14; bear_w = 58; }
    else if (price < 60000)                      { bull_w =  8; bear_w = 68; }
    else                                         { bull_w =  4; bear_w = 75; }

    // Recovery boost — identický s botem
    if (price < LOW_PRICE_THRESHOLD && lowStreak >= LOW_PRICE_STREAK_LIM) {
        var boost = Math.min(25, lowStreak * 5);
        bull_w += boost;
        bear_w  = Math.max(5, bear_w - Math.floor(boost / 2));
    }

    return {
        bull:         bull_w,
        bear:         bear_w,
        neutral:      14,
        wild:          6,
        special_bull:  5,
        special_bear:  5,
        crash:         1
    };
}

// ── Volatility cap — zrcadlí _price_volatility_cap(price) z bota ─────────────
function getVolatilityCap(price) {
    if      (price < 1000)  return 0.90;
    else if (price < 3000)  return 0.70;
    else if (price < 8000)  return 0.50;
    else if (price < 20000) return 0.35;
    else if (price < 50000) return 0.22;
    else                    return 0.12;
}

var WEIGHT_KEYS = ['bull','bear','neutral','wild','special_bull','special_bear','crash'];

// ── State ─────────────────────────────────────────────────────────────────────
var myChart         = null;
var fullHistory     = [];
var currentPrice    = 0;
var currentFiltered = [];
var currentFilter   = 0;
var showPrediction  = true;
var PRED_SEED       = Date.now();

// ── Seeded RNG (mulberry32) ───────────────────────────────────────────────────
function seededRand(s) {
    var t = (s + 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// ── Timezone helpers ──────────────────────────────────────────────────────────
function parseUTC(isoStr) {
    return new Date(isoStr.endsWith('Z') ? isoStr : isoStr + 'Z');
}

function pragueparts(isoStr) {
    var d     = parseUTC(isoStr);
    var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: PRAGUE_TZ,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(d);
    var p = {};
    parts.forEach(function(x) { p[x.type] = x.value; });
    return p;
}

function labelShort(isoStr) {
    var p = pragueparts(isoStr);
    return p.day + '.' + p.month + '. ' + p.hour + ':' + p.minute;
}

function labelFull(isoStr) {
    var p = pragueparts(isoStr);
    return p.day + '.' + p.month + '.' + p.year + '  ' + p.hour + ':' + p.minute;
}

function fmtPrice(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Historická analýza ────────────────────────────────────────────────────────
// Vrátí průměrnou relativní změnu a std. dev. z posledních N cen.
function analyzeHistory(prices) {
    if (prices.length < 2) return { meanChange: 0, stdDev: 0.03 };
    var changes = [];
    for (var i = 1; i < prices.length; i++) {
        if (prices[i - 1] > 0) changes.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    if (!changes.length) return { meanChange: 0, stdDev: 0.03 };

    var mean = 0;
    for (var j = 0; j < changes.length; j++) mean += changes[j];
    mean /= changes.length;

    var variance = 0;
    for (var k = 0; k < changes.length; k++) variance += (changes[k] - mean) * (changes[k] - mean);
    variance /= changes.length;

    return {
        meanChange: mean,
        stdDev: Math.max(0.005, Math.min(Math.sqrt(variance), 0.25))
    };
}

// ── Váhovaný výběr eventu (simuluje _pick_market_event s dynamickými váhami) ───
function pickEvent(seed, price, lowStreak) {
    var weights   = getMarketWeights(price, lowStreak || 0);
    var totalW    = 0;
    for (var i = 0; i < WEIGHT_KEYS.length; i++) totalW += weights[WEIGHT_KEYS[i]];
    var r   = seededRand(seed) * totalW;
    var cum = 0;
    for (var i = 0; i < WEIGHT_KEYS.length; i++) {
        cum += weights[WEIGHT_KEYS[i]];
        if (r <= cum) return WEIGHT_KEYS[i];
    }
    return 'neutral';
}

// ── Generátor predikce ────────────────────────────────────────────────────────
// Zrcadlí logiku z economy_hpserver.py:
// 1. Analyzuj posledních LOOKBACK bodů → historický trend + stdDev
// 2. Odhadni low_price_streak z historických dat
// 3. Pro každý krok: dynamické váhy dle aktuální ceny (mean reversion + soft ceiling)
//    → výběr eventu → eventFactor → volatility cap → aplikace na cenu
// 4. Mean reversion nudge (zrcadlí denní drift z bota)
// 5. Wild/special/crash ignorují cap — záměrně extrémní
// Výsledek[0] = basePrice — spojovací bod na konec reálné křivky
function generatePrediction(basePrice, historyData) {
    var recent = historyData.slice(-LOOKBACK).map(function(r) { return r.price; });
    var stats  = analyzeHistory(recent);

    // Odhadni low_price_streak z historických dat
    var lowStreak = 0;
    for (var si = recent.length - 1; si >= 0; si--) {
        if (recent[si] < LOW_PRICE_THRESHOLD) lowStreak++;
        else break;
    }

    var seed  = PRED_SEED;
    var pts   = [basePrice];
    var price = basePrice;

    for (var i = 0; i < PRED_STEPS; i++) {
        seed += 7;

        // Výběr eventu s dynamickými váhami pro aktuální cenu v tomto kroku
        var eventType   = pickEvent(seed, price, lowStreak);
        var eventFactor = EVENT_FACTORS[eventType];

        // Wild: znaménko rozhodne další hod
        if (eventType === 'wild') {
            seed += 3;
            if (seededRand(seed) < 0.5) eventFactor = -eventFactor;
        }

        var change;
        if (eventType === 'crash') {
            // Crash: dramatický propad s minimálním šumem
            var noise = (seededRand(seed + 1) * 2 - 1) * 0.05;
            change = eventFactor + noise;
        } else {
            // Kombinace historického trendu (40%) + event faktoru (40%) + mean reversion nudge (20%)
            var reversionNudge = (BASE_PRICE / Math.max(price, PRICE_FLOOR) - 1.0) * 0.04;
            var noise          = (seededRand(seed + 1) * 2 - 1) * stats.stdDev;
            var rawChange      = stats.meanChange * 0.40 + eventFactor * 0.40 + reversionNudge * 0.20 + noise;

            // Volatility cap — wild/special ignorují, ostatní jsou omezeny
            if (eventType === 'wild' || eventType === 'special_bull' || eventType === 'special_bear') {
                change = rawChange;
            } else {
                var cap = getVolatilityCap(price);
                change  = Math.max(-cap, Math.min(cap, rawChange));
            }
        }

        price = Math.max(PRICE_FLOOR, Math.round(price * (1 + change)));

        // Aktualizuj streak pro příští krok
        if (price < LOW_PRICE_THRESHOLD) lowStreak++;
        else lowStreak = 0;

        pts.push(price);
    }
    return pts;
}

// Časové labely pro predikční kroky (interval odhadnut z reálných dat)
function buildPredictionLabels(data) {
    var lastMs     = parseUTC(data[data.length - 1].recorded_at).getTime();
    var intervalMs = 2 * 3600000;
    if (data.length >= 2) {
        var n    = Math.min(5, data.length);
        var span = parseUTC(data[data.length - 1].recorded_at).getTime()
                 - parseUTC(data[data.length - n].recorded_at).getTime();
        intervalMs = Math.max(30 * 60000, Math.round(span / (n - 1)));
    }
    var labels = [];
    for (var i = 1; i <= PRED_STEPS; i++) {
        labels.push(new Date(lastMs + i * intervalMs).toISOString().slice(0, 19));
    }
    return labels;
}

// ── Toggle predikce ───────────────────────────────────────────────────────────
function togglePrediction() {
    showPrediction = !showPrediction;
    var btn = document.getElementById('btn-pred');
    btn.innerHTML = showPrediction ? '&#x1F52E; ON' : '&#x1F52E; OFF';
    if (showPrediction) btn.classList.add('active');
    else btn.classList.remove('active');
    if (currentFiltered.length) buildChart(currentFiltered);
}

// ── Ticker (vždy posledních 24h) ──────────────────────────────────────────────
function buildTicker(history) {
    if (!history.length) return;
    var lastTs   = parseUTC(history[history.length - 1].recorded_at);
    var cutoff24 = new Date(lastTs.getTime() - 24 * 3600000);
    var src      = history.filter(function(r) { return parseUTC(r.recorded_at) >= cutoff24; });
    if (!src.length) src = history;

    var items = [];
    for (var i = 0; i < src.length; i++) {
        var r    = src[i];
        var prev = i > 0 ? src[i - 1] : null;
        var chg  = prev ? ((r.price - prev.price) / prev.price * 100).toFixed(2) : null;
        var pp   = pragueparts(r.recorded_at);
        items.push({ date: pp.day + '.' + pp.month + '.', time: pp.hour + ':' + pp.minute, price: fmtPrice(r.price), chg: chg });
    }

    function render() {
        return items.map(function(it) {
            var cls     = it.chg === null ? '' : (parseFloat(it.chg) >= 0 ? 'up' : 'dn');
            var sign    = it.chg === null ? '' : (parseFloat(it.chg) >= 0 ? '+' : '');
            var chgHtml = it.chg !== null ? '<span class="chg ' + cls + '">' + sign + it.chg + '%</span>' : '';
            return '<span class="ticker-item">'
                 + '<span class="sym">' + it.date + ' ' + it.time + '</span>'
                 + '<span class="val">' + it.price + '</span>'
                 + chgHtml + '</span>';
        }).join('');
    }
    document.getElementById('tickerInner').innerHTML = render() + render();
}

// ── Stat cards ────────────────────────────────────────────────────────────────
function updateStats(data) {
    if (!data.length) return;
    var prices = data.map(function(r) { return r.price; });
    var max = Math.max.apply(null, prices);
    var min = Math.min.apply(null, prices);
    var avg = Math.round(prices.reduce(function(a,b){return a+b;},0) / prices.length);
    document.getElementById('statATH').textContent     = fmtPrice(max);
    document.getElementById('statATHDate').textContent = labelShort(data[prices.indexOf(max)].recorded_at);
    document.getElementById('statATL').textContent     = fmtPrice(min);
    document.getElementById('statATLDate').textContent = labelShort(data[prices.indexOf(min)].recorded_at);
    document.getElementById('statAvg').textContent     = fmtPrice(avg);
    document.getElementById('statVol').textContent     = fmtPrice(max - min);
    document.getElementById('statCount').textContent   = data.length + ' pts';
}

// ── Header ────────────────────────────────────────────────────────────────────
function updateHeader(data) {
    document.getElementById('priceMain').textContent =
        fmtPrice(currentPrice || (data.length ? data[data.length - 1].price : 0));
    if (data.length >= 2) {
        var first = data[0].price, last = data[data.length - 1].price;
        var diff  = last - first;
        var pct   = ((diff / first) * 100).toFixed(2);
        var badge = document.getElementById('priceBadge');
        badge.textContent = (diff >= 0 ? '\u25B2 +' : '\u25BC ') + pct + '%  PERIOD';
        badge.className   = 'price-badge ' + (diff >= 0 ? 'up' : 'down');
    }
}

// ── Chart ─────────────────────────────────────────────────────────────────────
function buildChart(data) {
    var ctx    = document.getElementById('tradingChart').getContext('2d');
    var prices = data.map(function(r) { return r.price; });

    // Predikce vychází vždy z current_price (živá hodnota z API)
    var predValues = generatePrediction(currentPrice || prices[prices.length - 1], data);
    var predLabels = buildPredictionLabels(data);

    // allLabels: historické ISO + predikční ISO
    var allLabels = data.map(function(r) { return r.recorded_at; }).concat(predLabels);

    // histData: reálné ceny + null výplň pro predikční část
    var histData = prices.concat(new Array(PRED_STEPS).fill(null));

    // predData: (data.length-1) × null + predValues
    // predValues[0] = basePrice → sdílí pozici [data.length-1] jako spojovací bod
    // Délka: (data.length-1) + (PRED_STEPS+1) = data.length + PRED_STEPS = allLabels.length ✓
    var predData = new Array(data.length - 1).fill(null).concat(predValues);

    // Y osa zahrnuje i predikci → žádné ořezání
    var allForY  = prices.concat(showPrediction ? predValues : []);
    var yMin     = Math.min.apply(null, allForY);
    var yMax     = Math.max.apply(null, allForY);
    var yPad     = Math.max((yMax - yMin) * 0.1, yMax * 0.05);
    var yAxisMin = Math.max(0, Math.floor((yMin - yPad) / 100) * 100);
    var yAxisMax = Math.ceil((yMax + yPad) / 100) * 100;

    // Gradienty
    var grad = ctx.createLinearGradient(0, 0, 0, 420);
    grad.addColorStop(0,   'rgba(0,229,160,0.18)');
    grad.addColorStop(0.6, 'rgba(0,229,160,0.04)');
    grad.addColorStop(1,   'rgba(0,229,160,0)');

    var baseForPred = currentPrice || prices[prices.length - 1];
    var predUp      = predValues[predValues.length - 1] >= baseForPred;
    var predColor   = predUp ? 'rgba(0,229,160,0.75)' : 'rgba(255,77,106,0.75)';
    var predFill    = predUp ? 'rgba(0,229,160,0.07)'  : 'rgba(255,77,106,0.07)';

    var datasets = [{
        label: 'Price',
        data:  histData,
        fill:  true,
        backgroundColor: grad,
        borderWidth: 2,
        tension: 0.35,
        spanGaps: false,
        segment: {
            borderColor: function(c) {
                return c.p1.parsed.y >= c.p0.parsed.y ? '#00e5a0' : '#ff4d6a';
            }
        },
        pointRadius: function(c) { return c.dataIndex < data.length ? 3 : 0; },
        pointHoverRadius: function(c) { return c.dataIndex < data.length ? 7 : 0; },
        pointBackgroundColor: function(c) {
            var i = c.dataIndex;
            if (i >= data.length) return 'transparent';
            if (i === 0) return '#00e5a0';
            return data[i].price >= data[i - 1].price ? '#00e5a0' : '#ff4d6a';
        },
        pointBorderColor: '#080c12',
        pointBorderWidth: 1.5
    }];

    if (showPrediction) {
        datasets.push({
            label: 'AI Prediction',
            data:  predData,
            fill:  true,
            backgroundColor: predFill,
            borderColor: predColor,
            borderWidth: 1.5,
            borderDash: [6, 4],
            tension: 0.4,
            spanGaps: false,
            pointRadius: function(c) {
                var i = c.dataIndex;
                if (c.raw === null) return 0;
                if (i === data.length - 1) return 0; // spojovací bod — skryt pod reálným markerem
                return i >= data.length ? 2.5 : 0;
            },
            pointHoverRadius: function(c) {
                return (c.dataIndex >= data.length && c.raw !== null) ? 5 : 0;
            },
            pointBackgroundColor: predColor,
            pointBorderColor: '#080c12',
            pointBorderWidth: 1
        });
    }

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true, position: 'top', align: 'end',
                labels: {
                    color: '#4b5e78',
                    font: { family: "'Space Mono', monospace", size: 10 },
                    boxWidth: 20, boxHeight: 2, padding: 16,
                    filter: function(item) { return item.text === 'AI Prediction'; }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#0d1320',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 14,
                titleColor: '#6b7e96',
                bodyColor: '#e2e8f0',
                titleFont: { family: "'Space Mono', monospace", size: 10 },
                bodyFont:  { family: "'Space Mono', monospace", size: 13, weight: '700' },
                displayColors: true,
                callbacks: {
                    title: function(items) {
                        return labelFull(allLabels[items[0].dataIndex]);
                    },
                    label: function(item) {
                        var idx    = item.dataIndex;
                        var val    = item.raw;
                        if (val === null) return null;
                        var isPred = idx >= data.length;
                        if (isPred) {
                            var base = currentPrice || prices[prices.length - 1];
                            var d2   = val - base;
                            var pct2 = ((d2 / base) * 100).toFixed(2);
                            return '\uD83D\uDD2E  ' + fmtPrice(val) + ' CZCoin  ('
                                + (d2 >= 0 ? '+' : '') + pct2 + '%)';
                        }
                        var p    = data[idx].price;
                        var prev = idx > 0 ? data[idx - 1].price : p;
                        var d1   = p - prev;
                        var pct1 = prev !== 0 ? ((d1 / prev) * 100).toFixed(2) : '0.00';
                        return [fmtPrice(p) + ' CZCoin', (d1 >= 0 ? '\u25B2 +' : '\u25BC ') + pct1 + '%'];
                    },
                    labelColor: function(item) {
                        var idx = item.dataIndex, val = item.raw;
                        if (val === null) return { borderColor: 'transparent', backgroundColor: 'transparent' };
                        if (idx >= data.length) return { borderColor: predColor, backgroundColor: predColor };
                        var prev = idx > 0 ? data[idx - 1].price : val;
                        var up   = val >= prev;
                        return { borderColor: up ? '#00e5a0' : '#ff4d6a', backgroundColor: up ? '#00e5a0' : '#ff4d6a' };
                    }
                }
            }
        },
        scales: {
            y: {
                position: 'right',
                min: yAxisMin, max: yAxisMax,
                grid:  { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                ticks: { color: '#4b5e78', font: { family: "'Space Mono', monospace", size: 10 }, callback: function(v) { return fmtPrice(v); }, maxTicksLimit: 7 },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#4b5e78',
                    font:  { family: "'Space Mono', monospace", size: 10 },
                    maxRotation: 0, autoSkip: true, maxTicksLimit: 9,
                    callback: function(val, index) {
                        var lbl  = allLabels[index];
                        if (!lbl) return '';
                        var prev   = index > 0 ? allLabels[index - 1] : null;
                        var pp     = pragueparts(lbl);
                        var hhmm   = pp.hour + ':' + pp.minute;
                        var newDay = !prev || lbl.slice(0, 10) !== prev.slice(0, 10);
                        var base   = newDay ? (pp.day + '.' + pp.month + '  ' + hhmm) : hhmm;
                        return index >= data.length ? base + ' ?' : base;
                    }
                },
                border: { display: false }
            }
        }
    };

    if (myChart) {
        myChart.data    = { labels: allLabels, datasets: datasets };
        myChart.options = options;
        myChart.update('none');
    } else {
        myChart = new Chart(ctx, { type: 'line', data: { labels: allLabels, datasets: datasets }, options: options });
    }
}

// ── Filter ────────────────────────────────────────────────────────────────────
function applyFilter(hours) {
    currentFilter = hours;
    document.querySelectorAll('.range-btn').forEach(function(b) { b.classList.remove('active'); });
    if (hours === 0) {
        document.getElementById('btn-0').classList.add('active');
        currentFiltered = fullHistory.slice();
    } else {
        var btn = document.getElementById('btn-' + hours);
        if (btn) btn.classList.add('active');
        if (!fullHistory.length) { currentFiltered = []; return; }
        var lastTs = parseUTC(fullHistory[fullHistory.length - 1].recorded_at);
        var cutoff = new Date(lastTs.getTime() - hours * 3600000);
        currentFiltered = fullHistory.filter(function(r) { return parseUTC(r.recorded_at) >= cutoff; });
    }
    if (!currentFiltered.length) return;
    updateHeader(currentFiltered);
    updateStats(currentFiltered);
    buildChart(currentFiltered);
    document.getElementById('chartLoading').classList.add('hidden');
}

// ── Load ──────────────────────────────────────────────────────────────────────
async function loadData() {
    try {
        var resp = await fetch('https://rs422cznas.myds.me:7784/api/economy/price');
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        var json = await resp.json();
        fullHistory  = json.history || [];
        currentPrice = json.current_price || 0;
        var now = new Intl.DateTimeFormat('en-GB', {
            timeZone: PRAGUE_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date());
        document.getElementById('lastUpdated').textContent = 'UPDATED ' + now + ' CET';
        buildTicker(fullHistory);
        applyFilter(currentFilter);
    } catch (err) {
        console.error(err);
        document.getElementById('errorBar').textContent = '\u26A0  Failed to load market data: ' + err.message;
        document.getElementById('errorBar').style.display = 'block';
        document.getElementById('chartLoading').classList.add('hidden');
    }
}

window.onload = function() { loadData(); };
