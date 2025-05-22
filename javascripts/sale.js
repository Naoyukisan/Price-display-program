const priceElement = document.getElementById("product");
const numberElement = document.getElementById("number");
//下のfunction add()で格納されたオブジェクトが配列内に積みあがる。
let purchases = [];

// 「追加」ボタンを押したときに実行される関数
function add() {
  // ユーザーが選んだ商品の値段（文字列）と数量（文字列）を取得
  // 選択された商品のIDを取得し、productsから価格を参照する
  const productId = priceElement.value;
  const price = products[productId].price;
  const number = numberElement.value;

  // 入力された値段と数量を数値に変換して、1つの購入データ（オブジェクト）としてまとめる
  let purchase = {
    price: parseInt(price),
    number: parseInt(number),
  };

  // 同じ商品がすでに追加されているかどうかをチェックするための変数
  let newPurchase = true;  //--1

  // すでに購入履歴に同じ値段の商品があるかを1つずつチェック
  purchases.forEach((item) => {  //--2
    if (item.price === purchase.price) {
      // 同じ商品が見つかったら、新規ではないとマークする
      newPurchase = false;
    }
  });

  // 購入履歴がまだ空か、同じ商品がなかった場合はそのまま追加する
  if (purchases.length < 1 || newPurchase) {  //--3
    purchases.push(purchase); // 新しい商品として追加
  } else {
    // すでに同じ商品がある場合は、数量を加算するだけにする
    for (let i = 0; i < purchases.length; i++) {
      if (purchases[i].price === purchase.price) {
        purchases[i].number += purchase.number; // 数量を上乗せ
      }
    }
  }

  // 現時点の購入履歴と小計をポップアップで表示
  window.alert(`${display()}\n小計${subtotal()}円`);

  // 入力フォームをリセット（初期状態に戻す）
  priceElement.value = "";
  numberElement.value = "";
}


// 現時点での購入履歴の内容を文字列としてまとめて返す関数。
// 例：「500円が2点\n700円が1点」のような形式で表示される。
function display() {
  return purchases.map(purchase => {
    // 商品名を取得
    let productName = "";
    for (const key in products) {
      if (products[key].price === purchase.price) {
        productName = products[key].name;
        break;
      }
    }
    // 「商品名（価格円）が数量点」の形式で文字列を作成
    return `${productName}（${purchase.price}円）が${purchase.number}点`;
  }).join("\n");
}

function display() {
  const productId = priceElement.value;
  return purchases.map(purchase => {
    // 各 purchase（購入データ）から「○○円が○点」の文字列を作る
    return `${products[productId].name}（${purchase.price}円）が${purchase.number}点`
  })
  // 各商品の文字列を改行で結合して1つの文章にする
  .join("\n");
}


// 購入された商品の小計金額を計算して返す関数。
// 価格 × 数量 をすべて合計して、「小計○○円」に使われる。
function subtotal() {
  return purchases.reduce((prev, purchase) => {
    // 今までの合計（prev）に、今回の商品（価格 × 数量）を加算
    return prev + purchase.price * purchase.number
  }, 0); // 最初の合計値は 0
}

//合計ボタンを押下したときの処理
function calc() {
  //変数sumに関数subtotal()を代入
  const sum = subtotal();
  const postage = calcPostageFromPurchase(sum);
  //まず、変数indexに0を格納して、購入した商品の数(purchases.length)になるまで、
  //購入した商品の数までなのにindex < purchases.lengthが「<」である理由：
  ///例えば2回選択した場合、 配列のインデックスは0,1の2つになり、purchases.lengthは2になる。
  ///indexに0を格納したため、インデックス0,インデックス1まで処理してインデックス2は処理しないで終了できる。
  window.alert(`小計は${sum}円、送料は${postage}円です。合計は${sum + postage}円です`);
  //purchasesの配列と、priceElement.valueと numberElement.valueを空にする。
  purchases = [];
  priceElement.value = "";
  numberElement.value = "";
}

//合計値が0円、もしくは合計値が3000円以上なら送料0円。
function calcPostageFromPurchase(sum) {
  // 条件分岐とreturn
  if (sum == 0 || sum >= 3000) {
    //0を返す
    return 0;
    //もし2000円より安ければ送料500円。
  } else if (sum < 2000) {
    return 500;
    //もし2000円以上なら送料250円。
  } else {
    return 250;
  }
}

//商品マスタを作成。定数productsに各IDごとのオブジェクトを格納する。
const products = {
  1: { name: "オリジナルブレンド200g", price: 500 },
  2: { name: "オリジナルブレンド500g", price: 900 },
  3: { name: "スペシャルブレンド200g", price: 700 },
  4: { name: "スペシャルブレンド500g", price: 1200 }
};
