// --- NOVÁ FUNKCE pro načtení serverů z API ---

function createServerItem(server) {
    const item = document.createElement('div');
    item.className = 'server-item';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'server-icon';

    // ➡️ ZMĚNA ZDE: Používáme server.icon_url (podtržítko)
    if (server.icon_url && server.icon_url.startsWith('http')) { 
        const img = document.createElement('img');
        // ➡️ ZMĚNA ZDE: Používáme server.icon_url (podtržítko)
        img.src = server.icon_url; 
        img.alt = server.name;
        iconDiv.appendChild(img);
    } else {
        // Zobrazí první dvě písmena jména serveru, pokud chybí ikona
        iconDiv.textContent = server.name.substring(0, 2).toUpperCase(); 
        iconDiv.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'; 
    }

    const nameSpan = document.createElement('span');
    nameSpan.className = 'server-name';
    nameSpan.textContent = server.name;

    item.appendChild(iconDiv);
    item.appendChild(nameSpan);
    return item;
}

async function loadServers() {
    const track = document.getElementById('serverCarouselTrack');
    const trackWrapper = document.getElementById('carouselTrackWrapper');

    track.innerHTML = ''; // Vyčistíme předchozí obsah

    try {
        // POZOR: Předpokládá se, že API endpoint pro servery je na '/servers/'
        const res = await fetch('https://rs422cznas.myds.me:5038/servers'); 
        
        if (!res.ok) {
            throw new Error(`API odpovědělo s chybovým stavem ${res.status}`);
        }

        const servers = await res.json();

        if (servers.length === 0) {
            trackWrapper.innerHTML = '<span class="server-error">Seznam serverů je prázdný.</span>';
            return;
        }

        // Vložíme seznam 2x pro efekt nekonečné smyčky
        for (let i = 0; i < 2; i++) {
            servers.forEach(server => {
                track.appendChild(createServerItem(server));
            });
        }

    } catch (e) {
        console.error("Chyba při načítání serverů z API:", e);
        // Zobrazíme chybovou hlášku, pokud načítání selhalo
        trackWrapper.innerHTML = '<span class="server-error">API chyba: Nepodařilo se načíst servery.</span>';
    }
}


// --- Spuštění po načtení DOM ---

document.addEventListener('DOMContentLoaded', () => {
    // Statické statistiky
    loadStats();
    setInterval(loadStats, 30000);
    
    // Server carousel
    loadServers();
    // Rotující seznam není třeba aktualizovat tak často
});