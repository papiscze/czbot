// --- KONSTANTY PRO API A STRÁNKOVÁNÍ ---
const API_URL = 'https://rs422cznas.myds.me:5038/logs'; 
const RECORDS_PER_PAGE = 20; 

// DOM Elementy
const warnsTableBody = document.querySelector('#warnsTable tbody');
const pageStatusSpan = document.getElementById('pageStatus');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const searchInput = document.getElementById('searchInput');
const searchCountInfo = document.getElementById('searchCount');

// NOVÉ: DOM Elementy pro tlačítka (ID musí souhlasit s HTML)
const refreshBtn = document.getElementById('refreshBtn'); 
const crossBanFilterBtn = document.getElementById('crossBanFilterBtn'); 

// Stav aplikace
let allRecords = []; 
let filteredRecords = []; 
let currentPage = 1;
let showCrossBans = true; // NOVÉ: true = zobrazit i CrossBany (výchozí stav)


/**
 * 🛠️ Pomocná funkce pro získání parametru 'user' nebo 'search' z URL.
 */
function getQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    // Hledáme 'user' nebo 'search'
    return urlParams.get('user') || urlParams.get('search'); 
}

/**
 * 🛠️ Pomocná funkce pro formátování data
 * @param {string} timestamp - Timestamp z API (ISO formát).
 * @returns {string} Čitelné datum a čas.
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('cs-CZ', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    }) || 'Neznámé datum';
}

/**
 * 🛠️ Pomocná funkce pro získání CSS třídy pro odznak akce.
 * (Přidán case pro 'crossban')
 * @param {string} action - Typ akce (ban, warn, kick, mute, unban, atd.).
 * @returns {string} CSS třída.
 */
function getActionClass(action) {
    switch (action ? action.toLowerCase() : 'default') {
        case 'ban':
        case 'tempban':
            return 'action-ban';
        case 'warn':
            return 'action-warn';
        case 'kick':
            return 'action-kick';
        case 'mute':
        case 'tempmute':
            return 'action-mute';
        case 'crossban': // NOVÉ
            return 'action-crossban';
        default:
            return 'action-default';
    }
}

/**
 * 🛠️ NOVÉ: Aplikuje lokální CrossBan filtr na sadu záznamů.
 */
function applyCrossBanFilter(records) {
    if (showCrossBans) {
        crossBanFilterBtn.textContent = 'Skrýt CrossBany';
        crossBanFilterBtn.classList.remove('active-filter');
        return records;
    } else {
        crossBanFilterBtn.textContent = 'Zobrazit CrossBany';
        crossBanFilterBtn.classList.add('active-filter');
        // Filtruje záznamy, kde akce NENÍ 'CrossBan'
        return records.filter(record => 
            record.action && record.action.toLowerCase() !== 'crossban'
        );
    }
}

/**
 * 1. Generuje HTML řádek pro jeden záznam.
 */
function createTableRow(record) {
    const actionClass = getActionClass(record.action);
    const actionDisplay = (record.action || 'Default').toUpperCase();

    let reasonText = record.reason || 'Důvod nezadán';
    if (record.duration) {
        reasonText += ` (Trvání: ${record.duration})`;
    }
    
    const userName = record.user_name || 'Neznámý uživatel';
    const moderatorName = record.moderator_name || 'Systém';
    const guildName = record.guild_name || 'Neznámý server';

    return `
        <tr>
            <td data-label="Datum">${formatDate(record.timestamp)}</td>
            <td data-label="Uživatel">${userName}</td>
            <td data-label="Akce"><span class="action-badge ${actionClass}">${actionDisplay}</span></td>
            <td data-label="Důvod">${reasonText}</td>
            <td data-label="Moderátor">${moderatorName}</td>
            <td data-label="Server">${guildName}</td>
        </tr>
    `;
}

/**
 * 2. Vykreslí aktuální stránku tabulky.
 */
function renderTable(records, page) {
    warnsTableBody.innerHTML = ''; 
    
    if (records.length === 0) {
        warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row">Nebyly nalezeny žádné záznamy.</td></tr>`;
        updatePaginationControls(0, page);
        return;
    }

    const start = (page - 1) * RECORDS_PER_PAGE;
    const end = start + RECORDS_PER_PAGE;
    const recordsOnPage = records.slice(start, end);

    let html = '';
    recordsOnPage.forEach(record => {
        html += createTableRow(record);
    });
    
    warnsTableBody.innerHTML = html;
    updatePaginationControls(records.length, page);
}

/**
 * 3. Aktualizuje stav ovládacích prvků stránkování.
 */
function updatePaginationControls(totalRecords, page) {
    const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);
    
    pageStatusSpan.textContent = `Strana ${totalRecords > 0 ? page : 0} z ${totalPages}`;
    searchCountInfo.textContent = `Zobrazeno ${totalRecords} záznamů.`; // Úprava textu
    
    prevPageBtn.classList.toggle('disabled-btn', page <= 1);
    prevPageBtn.disabled = page <= 1;

    nextPageBtn.classList.toggle('disabled-btn', page >= totalPages);
    nextPageBtn.disabled = page >= totalPages;

    if (totalRecords === 0) {
        nextPageBtn.classList.add('disabled-btn');
        prevPageBtn.classList.add('disabled-btn');
    }
}

/**
 * 4. Přejde na určenou stránku a vykreslí tabulku.
 */
function goToPage(newPage) {
    const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable(filteredRecords, currentPage);
    } else if (newPage === 1 && totalPages === 0) {
        currentPage = 1;
        renderTable(filteredRecords, currentPage);
    }
}

/**
 * 5. ÚPRAVA: Filtruje záznamy na základě textu v poli a stavu CrossBan filtru.
 */
function filterRecords() {
    const query = searchInput.value.toLowerCase().trim();
    let tempRecords = [...allRecords]; 
    
    // KROK 1: Textové hledání
    if (query.length > 0) {
        tempRecords = tempRecords.filter(record => 
            (record.user_name && record.user_name.toLowerCase().includes(query)) ||
            (record.moderator_name && record.moderator_name.toLowerCase().includes(query)) ||
            (record.user_id && String(record.user_id).includes(query)) ||
            (record.moderator_id && String(record.moderator_id).includes(query)) ||
            (record.reason && record.reason.toLowerCase().includes(query)) ||
            (record.guild_name && record.guild_name.toLowerCase().includes(query))
        );
    }
    
    // KROK 2: Aplikace CrossBan filtru
    filteredRecords = applyCrossBanFilter(tempRecords);
    
    // Po filtrování se vždy vrátíme na první stránku
    goToPage(1);
}

/**
 * 6. ÚPRAVA: Načte data z API a inicializuje hledání z URL.
 */
async function loadData() {
    console.log("STARTING API FETCH from:", API_URL); 

    // Reset UI na stav načítání
    warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row">Načítání dat... Prosím čekejte.</td></tr>`;
    searchCountInfo.textContent = `Načítání dat...`;
    updatePaginationControls(0, 1);

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Chyba HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            console.log("Data loaded successfully. Total records:", data.length); 
            // Seřadit data od nejnovějšího po nejstarší (podle timestamp)
            allRecords = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // NOVÝ KROK 1: Kontrola URL a nastavení do inputu
            const initialSearch = getQueryParam();
            if (initialSearch) {
                searchInput.value = initialSearch;
            }

            // NOVÝ KROK 2: Spuštění filtrování (zohlední hledání z URL/inputu)
            filterRecords(); 
            
        } else {
            throw new Error("API vrátilo neočekávaný formát dat (nebylo pole).");
        }
        
    } catch (error) {
        console.error("Fatal API Fetch Error:", error);
        let errorMsg = error.message;

        if (errorMsg.includes("Failed to fetch") || errorMsg.includes("TypeError: Failed to fetch")) {
             errorMsg = "Nepodařilo se připojit k API. Pravděpodobně jde o chybu CORS nebo HTTPS/HTTP protokolu.";
        }
        
        warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row status-err-text">CHYBA PŘI NAČÍTÁNÍ: ${errorMsg}</td></tr>`;
        searchCountInfo.textContent = `Chyba při načítání dat.`;
        updatePaginationControls(0, 1);
    }
}

// --- NASLUCHAČE UDÁLOSTÍ ---

// Stránkování
prevPageBtn.addEventListener('click', () => {
    if (!prevPageBtn.disabled) {
        goToPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (!nextPageBtn.disabled) {
        goToPage(currentPage + 1);
    }
});

// Vyhledávání (spustí filterRecords, který zohlední CrossBan)
searchInput.addEventListener('input', filterRecords);

// NOVÉ: CrossBan filtr
crossBanFilterBtn.addEventListener('click', () => {
    showCrossBans = !showCrossBans; // Přepnutí stavu
    filterRecords();               // Spuštění filtru
});

// NOVÉ: Refresh
refreshBtn.addEventListener('click', loadData);

// Načíst data při spuštění stránky
document.addEventListener('DOMContentLoaded', loadData);