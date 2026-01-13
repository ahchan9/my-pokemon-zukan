/**
 * 1. タイプの定義
 * 画面上の検索ボタンとモーダル内の属性チップに使用します。
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
 * 2. データの合体と「地方・世代ラベル」の自動付与
 * 各ファイルから読み込んだデータに、自動で情報を付け足します。
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

/**
 * 3. アプリの起動処理
 */
function init() {
    const typeButtonsDiv = document.getElementById('typeButtons');
    
    // タイプ選択ボタンを自動生成
    types.forEach(t => {
        const btn = document.createElement('button');
        btn.className = `type-btn ${t.id}`;
        btn.innerText = t.name;
        btn.onclick = () => filterByType(t.id);
        typeButtonsDiv.appendChild(btn);
    });
    
    // 全ポケモンを表示
    render(pokemonData);
}

/**
 * 4. ポケモンをカード形式で表示
 */
function render(data) {
    const listDiv = document.getElementById('pokemonList');
    listDiv.innerHTML = ''; 
    
    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        // 図鑑番号に基づいて公式の画像を取得
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        
        card.innerHTML = `
            <img src="${imgUrl}" alt="${p.name}" loading="lazy">
            <p>${p.name}</p>
        `;
        
        // クリック時に詳細を表示（ポケモンデータそのものを渡す）
        card.onclick = () => showDetail(p, imgUrl);
        
        listDiv.appendChild(card);
    });
}

/**
 * 5. タイプによる絞り込み
 */
function filterByType(typeId) {
    document.getElementById('searchInput').value = '';
    
    if (typeId === 'all') {
        render(pokemonData);
    } else {
        const filtered = pokemonData.filter(p => p.types.includes(typeId));
        render(filtered);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 6. 名前検索（ひらがな→カタカナ変換対応）
 */
function searchName() {
    const query = hiraToKana(document.getElementById('searchInput').value);
    const filtered = pokemonData.filter(p => p.name.includes(query));
    render(filtered);
}

function hiraToKana(str) { 
    return str.replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60)); 
}

/**
 * 7. 詳細（モーダル）を表示
 */
function showDetail(pokemon, img) {
    // 世代と地方の情報を表示
    const infoText = `${pokemon.gen}（${pokemon.region}） No.${String(pokemon.id).padStart(4, '0')}`;
    document.getElementById('modalInfo').innerText = infoText;
    
    document.getElementById('modalName').innerText = pokemon.name;
    document.getElementById('modalImg').src = img;

    // 属性チップの表示
    const modalTypesDiv = document.getElementById('modalTypes');
    modalTypesDiv.innerHTML = ''; 
    
    pokemon.types.forEach(typeId => {
        const typeInfo = types.find(t => t.id === typeId);
        const typeSpan = document.createElement('span');
        typeSpan.className = `type-btn ${typeId}`; 
        typeSpan.innerText = typeInfo ? typeInfo.name : typeId;
        modalTypesDiv.appendChild(typeSpan);
    });

    // Google検索リンクの設定
    // 「ポケモン」という言葉をセットで検索するようにすると、より正確な結果が出ます
    const googleElt = document.getElementById('googleLink');
    if (googleElt) {
        googleElt.href = `https://www.google.com/search?q=${encodeURIComponent(pokemon.name + " アニポケ 登場回")}`;
    }

    // WikiとYouTubeのリンク（既存のコード）
    const wikiElt = document.getElementById('wikiLink');
    if (wikiElt) wikiElt.href = `https://wiki.ポケモン.com/wiki/${encodeURIComponent(pokemon.name)}#アニメにおける${encodeURIComponent(pokemon.name)}`;

    const ytElt = document.getElementById('youtubeLink');
    if (ytElt) ytElt.href = `https://www.youtube.com/results?search_query=アニポケ+${encodeURIComponent(pokemon.name)}`;

    // モーダルを表示
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

/**
 * 8. モーダルを閉じる
 */
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// アプリ起動！
init();