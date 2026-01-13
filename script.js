/**
 * 1. タイプの定義
 */
const types = [
    { id: "grass", name: "🌿くさ" }, { id: "fire", name: "🔥ほのお" }, { id: "water", name: "💧みず" },
    { id: "electric", name: "⚡でんき" }, { id: "normal", name: "⚪ノーマル" }, { id: "ice", name: "❄️こおり" },
    { id: "fighting", name: "👊かくとう" }, { id: "poison", name: "☠️どく" }, { id: "ground", name: "⛰️じめん" },
    { id: "flying", name: "🕊️ひこう" }, { id: "psychic", name: "🔮エスパー" }, { id: "bug", name: "🐞むし" },
    { id: "rock", name: "💎いわ" }, { id: "ghost", name: "👻ゴースト" }, { id: "dragon", name: "🐲ドラゴン" },
    { id: "dark", name: "🌙あく" }, { id: "steel", name: "⚙️はがね" }, { id: "fairy", name: "✨フェアリー" }
];

/**
 * 2. データの合体
 */
const pokemonData = [
    ...gen1Data.map(p => ({ ...p, region: "カントー地方", gen: "第1世代" })),
    ...gen2Data.map(p => ({ ...p, region: "ジョウト地方", gen: "第2世代" })),
    ...gen3Data.map(p => ({ ...p, region: "ホウエン地方", gen: "第3世代" })),
    ...gen4Data.map(p => ({ ...p, region: "シンオウ地方", gen: "第4世代" })),
    ...gen5Data.map(p => ({ ...p, region: "イッシュ地方", gen: "第5世代" })),
    ...gen6Data.map(p => ({ ...p, region: "カロス地方", gen: "第6世代" })),
    ...gen7Data.map(p => ({ ...p, region: "アローラ地方", gen: "第7世代" })),
    ...gen8Data.map(p => ({ ...p, region: "ガラル・ヒスイ地方", gen: "第8世代" })),
    ...gen9Data.map(p => ({ ...p, region: "パルデア地方", gen: "第9世代" }))
];

// --- 「今の状態」を管理する変数 ---
let currentTypeId = 'all';
let currentSortOrder = 'asc'; // 'asc': 古い順, 'desc': 最新順

/**
 * 3. アプリの起動処理
 */
function init() {
    const typeButtonsDiv = document.getElementById('typeButtons');
    
    types.forEach(t => {
        const btn = document.createElement('button');
        btn.className = `type-btn ${t.id}`;
        btn.innerText = t.name;
        btn.onclick = () => filterByType(t.id);
        typeButtonsDiv.appendChild(btn);
    });
    
    // ソートボタンのクリックイベントを設定
    document.getElementById('sortAsc').onclick = () => changeSort('asc');
    document.getElementById('sortDesc').onclick = () => changeSort('desc');

    updateView(); // 最初の表示
}

/**
 * 【重要】表示を更新する中心的な関数
 */
function updateView() {
    let filtered = pokemonData;

    // 1. タイプで絞り込む
    if (currentTypeId !== 'all') {
        filtered = filtered.filter(p => p.types.includes(currentTypeId));
    }

    // 2. 名前検索で絞り込む（もし入力があれば）
    const query = hiraToKana(document.getElementById('searchInput').value);
    if (query) {
        filtered = filtered.filter(p => p.name.includes(query));
    }

    // 3. 並び替える
    filtered.sort((a, b) => {
        return currentSortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    });

    render(filtered);
}

function render(data) {
    const listDiv = document.getElementById('pokemonList');
    listDiv.innerHTML = ''; 
    
    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        card.innerHTML = `<img src="${imgUrl}" alt="${p.name}" loading="lazy"><p>${p.name}</p>`;
        card.onclick = () => showDetail(p, imgUrl);
        listDiv.appendChild(card);
    });
}

function filterByType(typeId) {
    currentTypeId = typeId;
    // ボタンのactive表示を切り替える
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    // 「ぜんぶ」ボタンか、生成されたタイプボタンかを探してactiveを付与
    const activeBtn = document.querySelector(`.type-btn.${typeId}`);
    if(activeBtn) activeBtn.classList.add('active');

    updateView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function searchName() {
    updateView(); // 検索時もupdateViewを呼ぶ
}

function changeSort(order) {
    currentSortOrder = order;
    // ソートボタンの見た目を切り替え
    document.getElementById('sortAsc').classList.toggle('active', order === 'asc');
    document.getElementById('sortDesc').classList.toggle('active', order === 'desc');
    updateView();
}

function hiraToKana(str) { 
    return str.replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60)); 
}

/**
 * 詳細表示（モーダル）や閉じる処理は変更なし
 */
function showDetail(pokemon, img) {
    const infoText = `${pokemon.gen}（${pokemon.region}） No.${String(pokemon.id).padStart(4, '0')}`;
    document.getElementById('modalInfo').innerText = infoText;
    document.getElementById('modalName').innerText = pokemon.name;
    document.getElementById('modalImg').src = img;
    const modalTypesDiv = document.getElementById('modalTypes');
    modalTypesDiv.innerHTML = ''; 
    pokemon.types.forEach(typeId => {
        const typeInfo = types.find(t => t.id === typeId);
        const typeSpan = document.createElement('span');
        typeSpan.className = `type-btn ${typeId}`; 
        typeSpan.innerText = typeInfo ? typeInfo.name : typeId;
        modalTypesDiv.appendChild(typeSpan);
    });
    const googleElt = document.getElementById('googleLink');
    if (googleElt) googleElt.href = `https://www.google.com/search?q=${encodeURIComponent(pokemon.name + " アニポケ 登場回")}`;
    const wikiElt = document.getElementById('wikiLink');
    if (wikiElt) wikiElt.href = `https://wiki.ポケモン.com/wiki/${encodeURIComponent(pokemon.name)}#アニメにおける${encodeURIComponent(pokemon.name)}`;
    const ytElt = document.getElementById('youtubeLink');
    if (ytElt) ytElt.href = `https://www.youtube.com/results?search_query=アニポケ+${encodeURIComponent(pokemon.name)}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

init();