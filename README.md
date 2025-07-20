# 🤖 Jak funguje náš Discord Bot? (Co dělá v pozadí)

Tento dokument vám ukáže, co se děje "pod pokličkou" našeho Discord bota. Nemusíte být programátor, abyste pochopili, jak bot funguje a proč dělá to, co dělá!

---

## Jak přidat našeho bota na váš server?

Abyste mohli našeho bota používat na svém Discord serveru, musíte ho nejprve pozvat. Je to jednoduché:

* **Pozvěte bota na server**: K pozvání bota na váš server použijte [pozvánka](https://discord.com/oauth2/authorize?client_id=902877191086420008).
    * Klikněte na odkaz.
    * Vyberte server, na který chcete bota přidat.
    * Potvrďte oprávnění, která bot potřebuje k fungování (například posílání zpráv, čtení historie chatu atd.). Nebojte, žádná citlivá data nesbíráme.

---

## Jak zobrazit všechny příkazy a mít je pro svůj profil?

Pro plné využití všech příkazů a jejich zobrazení přímo v Discordu, doporučujeme **ověřit bota pro váš profil**. Tím se vám zpřístupní všechny `/slash` příkazy a budou se vám lépe používat:

1.  **Klikněte na bota**: V seznamu členů na Discordu najděte našeho bota a klikněte na něj.
2.  **Přidejte aplikaci**: V okně, které se objeví, klikněte na tlačítko "**Přidat aplikaci**" (nebo podobný text).
3.  **Přidat do mých aplikací**: Následně vyberte možnost "**Přidat do mých aplikací**".

Po tomto kroku by se vám měly automaticky zobrazovat všechny dostupné `/slash` příkazy, když začnete psát `/` do chatu.

---

## 0. Nastavení kanálu pro oznámení (Aktualizace a údržba)

Náš bot může automaticky posílat oznámení o **aktualizacích** a **plánované údržbě** do speciálního kanálu na vašem serveru. Abyste tyto důležité zprávy dostávali, je potřeba tento kanál nastavit pomocí jednoho příkazu:

* **Příkaz `/modchannel`**: Moderátoři (uživatelé s oprávněním "Spravovat zprávy") mohou použít tento příkaz k určení, do kterého kanálu má bot posílat oznámení.
    * Napište do chatu `/modchannel` a vyberte kanál, který chcete pro oznámení použít. Příklad: `/modchannel #oznameni-bota`
    * Po nastavení bude bot automaticky odesílat zprávy o nových funkcích nebo plánovaných odstávkách do tohoto kanálu.

---

## 1. Co dělá bot hned po spuštění? (Start bota)

Když se náš bot zapne a připojí k Discordu, děje se pár důležitých věcí:

* **Rozumí všemu, co se děje**: Náš bot je navržen tak, aby si všímal téměř všeho, co se na serveru děje – kdo se připojí, kdo odejde, jaké se posílají zprávy, nebo kdo se připojí do hlasového kanálu. Díky tomu může plnit všechny své funkce.
* **Rozumí příkazům**: Všechny příkazy, které bot umí (začínají na `/`), se "nahlásí" Discordu, aby je viděl každý uživatel.
* **Zapne všechny své funkce**: Bot má mnoho různých částí (nazýváme je **"moduly"** nebo **"Cogy"**), které se starají o specifické věci – například modul pro moderování, modul pro RSS novinky, nebo modul pro uvítání nových členů. Po spuštění se všechny tyto moduly zapnou a jsou připraveny k použití.
* **Nastaví si hodinky**: Aby bot vždy věděl, kolik je hodin a mohl správně fungovat s připomenutími, narozeninami nebo plánovanými zprávami, používá čas pro **Českou republiku**.
* **Sleduje chyby**: Pokud by se něco pokazilo, bot si to poznamená a pošle informaci vývojářům, abychom mohli chybu co nejdříve opravit.

---

## 2. Bot si vše pamatuje (Používá databázi)

Náš bot si pamatuje spoustu informací, aby mohl fungovat, i když se restartuje. Všechna důležitá data ukládá do speciálního "deníku", kterému říkáme **databáze MySQL**.

**Vše má zaznamenané**: Databáze si pamatuje například:

* **Kdo koho a proč ztlumil, varoval nebo vykopl/zabanoval**: Pro přehled a historii moderátorských zásahů.
* **Kde posílat zpětnou vazbu a návrhy**: Aby se vaše nápady dostaly na správné místo.
* **Jaké novinky sledovat přes RSS**: Aby vám neunikly žádné důležité zprávy z vašich oblíbených webů.
* **Jaké role dát novým členům automaticky**: Pro usnadnění onboarding procesu.
* **Texty uvítacích a odchodových zpráv**: Pro osobní přivítání a rozloučení.
* **Vaše připomenutí**: Aby na nic nezapomněl a připomněl vám to včas.
* **Úroveň a XP členů**: Pro zábavný systém odměn.
* **Pravidla pro zakázaná slova**: Pro automatické hlídání chatu.
* A mnoho dalšího!

---

## 3. Bot slyší, reaguje a pracuje sám (Události a úkoly)

Náš bot je neustále ve střehu a reaguje na různé situace na Discordu, a také má své vlastní "automatické úkoly".

* **Reaguje na zprávy**: Když někdo pošle zprávu, bot ji "přečte". Může:
    * Zjistit, jestli zpráva neobsahuje zakázaná slova.
    * (WIP) Dát vám XP body za aktivitu (pokud je systém úrovní zapnutý).
    * Reagovat na jednoduchá slova (jako "marco" -> "Polo!").
    * Zpracovat vaše `/slash` příkazy.
    * Provádět **automatický překlad**, pokud je kanál takto nastaven.
* **Vítá a loučí se**: Když se nový člen připojí, bot ho přivítá. Když někdo odejde, bot se rozloučí. Může mu také automaticky přidělit role.
* **(WIP) Hlídá hlasové kanály**: Sleduje, kdo se připojí a odejde z hlasových kanálů, a umí například vytvářet dočasné hlasové kanály, které se samy smažou, když v nich nikdo není.
* **Posílá soukromé zprávy**: Pokud je někdo potrestán (umlčen, vykopnut, zabanován, varován), bot se mu pokusí poslat soukromou zprávu s informací o tom, co se stalo a proč.

**Automatické úkoly (běží samy)**: Bot má naplánované věci, které dělá automaticky v pravidelných intervalech, aniž byste ho museli žádat:

* **Kontroluje RSS novinky**: Pravidelně zjišťuje, zda na sledovaných webech nejsou nové články nebo zprávy, a pokud ano, pošle je do správného kanálu.
* **Posílá připomenutí**: V určený čas vám pošle připomenutí, které jste si nastavili.

---

## 4. Bot má i svou webovou stránku (Pro přehled)

Náš bot má malou vestavěnou webovou stránku, která slouží pro přehled moderátorských akcí vůči uživatelům.

* **Stránka s varováními**: Na adrese `http://128.140.111.93:5038/warns` si můžete prohlédnout veškeré záznamy o moderátorských akcích (kdo byl varován, umlčen, vykopnut nebo zabanován a proč). Toto je užitečné pro přehled, ale přístup k ní je zabezpečen.

---

## 5. Jak bot ví, kdo je moderátor?

Bot má speciální "kontrolu" pro moderátorské příkazy:

* Bot považuje za moderátora každého, kdo má na Discord serveru oprávnění s názvem **"Spravovat zprávy"**. Pokud tedy chcete používat moderátorské příkazy bota, ujistěte se, že vaše role na serveru toto oprávnění má!

---

## 6. Kde získám podporu?

Bot má speciální discord server, kde se můžete dozvědět o novinkách, oznamovat chyby nebo posílat náměty na vylepšení:

* Odkaz k připojení [zde na tomto odkazu](https://discord.gg/hk6PdtVxbm).

---
Doufáme, že vám tento přehled pomohl lépe pochopit, jak náš Discord bot funguje v zákulisí! Pokud máte jakékoli dotazy, neváhejte se zeptat.
