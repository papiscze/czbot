// --- KONSTANTY PRO API A STRÁNKOVÁNÍ ---
// !!! TOTO JE VAŠE API URL !!!
const API_URL = 'https://rs422cznas.myds.me:5038/logs'; 
const RECORDS_PER_PAGE = 20; // Kolik záznamů zobrazit na jedné stránce

// DOM Elementy
const warnsTableBody = document.querySelector('#warnsTable tbody');
const pageStatusSpan = document.getElementById('pageStatus');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const searchInput = document.getElementById('searchInput');
const searchCountInfo = document.getElementById('searchCount');

// Stav aplikace
let allRecords = []; // Uloží všechna načtená data
let filteredRecords = []; // Uloží záznamy po vyhledávání
let currentPage = 1;

/**
 * 🛠️ Pomocná funkce pro formátování data
 * @param {string} timestamp - Timestamp z API (ISO formát).
 * @returns {string} Čitelné datum a čas.
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    // Přidáno "|| 'Neznámé datum'" pro případ chyby
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
        default:
            return 'action-default';
    }
}

/**
 * 1. Generuje HTML řádek pro jeden záznam.
 */
function createTableRow(record) {
    const actionClass = getActionClass(record.action);
    const actionDisplay = (record.action || 'Default').toUpperCase();

    // Sestavení sloupce Důvod (přidání duration, pokud existuje)
    let reasonText = record.reason || 'Důvod nezadán';
    if (record.duration) {
        reasonText += ` (Trvání: ${record.duration})`;
    }
    
    // Zajištění, že všechny hodnoty jsou stringy, pokud by byly null
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
    searchCountInfo.textContent = `Načteno posledních ${totalRecords} záznamů z API.`;
    
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
 * 5. Filtruje záznamy na základě textu v poli pro vyhledávání.
 */
function filterRecords() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2 && allRecords.length > 0) {
        // Při krátkém dotazu, pokud už máme data, zobrazíme vše
        filteredRecords = allRecords;
        searchCountInfo.textContent = `Celkem nalezeno ${allRecords.length} záznamů.`;
    } else if (allRecords.length > 0) {
        filteredRecords = allRecords.filter(record => 
            (record.user_name && record.user_name.toLowerCase().includes(query)) ||
            (record.moderator_name && record.moderator_name.toLowerCase().includes(query)) ||
            (record.user_id && String(record.user_id).includes(query)) ||
            (record.moderator_id && String(record.moderator_id).includes(query)) ||
            (record.reason && record.reason.toLowerCase().includes(query)) ||
            (record.guild_name && record.guild_name.toLowerCase().includes(query))
        );
    } else {
        // Žádná data k filtrování
        filteredRecords = [];
        searchCountInfo.textContent = `Zadejte vyhledávací dotaz pro zobrazení záznamů.`;
    }
    
    // Po filtrování se vždy vrátíme na první stránku
    goToPage(1);
}

/**
 * 6. Načte data z API.
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
            // Při chybném HTTP kódu (4xx, 5xx) zobrazí chybu
            throw new Error(`Chyba HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            console.log("Data loaded successfully. Total records:", data.length); 
            // Seřadit data od nejnovějšího po nejstarší (podle timestamp)
            allRecords = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            filteredRecords = allRecords;
            
            // Inicializace zobrazení
            goToPage(1);
        } else {
            throw new Error("API vrátilo neočekávaný formát dat (nebylo pole).");
        }
        
    } catch (error) {
        // Zobrazí chybovou zprávu přímo na stránce
        console.error("Fatal API Fetch Error:", error);
        let errorMsg = error.message;

        // Kontrola, zda se jedná o nejpravděpodobnější chybu CORS/protokol
        if (errorMsg.includes("Failed to fetch") || errorMsg.includes("TypeError: Failed to fetch")) {
             errorMsg = "Nepodařilo se připojit k API. Pravděpodobně jde o chybu CORS nebo HTTPS/HTTP protokolu. Zkontrolujte prosím Konzoli (F12) v prohlížeči pro detaily.";
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

// Vyhledávání
searchInput.addEventListener('input', filterRecords);

// Načíst data při spuštění stránky
document.addEventListener('DOMContentLoaded', loadData);