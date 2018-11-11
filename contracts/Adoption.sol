pragma solidity ^0.4.17;

contract Adoption {
  address[16] public adopters;

  //Adopting a pet
  function adopt(uint petID) public returns (uint){
    require(petID >= 0 && petID <= 15);

    adopters[petID] = msg.sender;

    return petID;
  }

  //Retrieving(取り戻す、 回収する) the adopters 配列全体を返す関数を書く。
  function getAdopters() public view returns(address[16]){
    return adopters;
  }
}

//Pragma - ^ means:  それ以上のバージョン

//変数adoptersを定義しました。これはEthereumアドレスの配列です。配列には1つの型が含まれ、固定長または可変長を持つことができます。この場合、タイプはaddressで長さは16です。

//また、adoptersがpublicなことに気づくでしょう。public変数には自動ゲッターメソッドがありますが、配列の場合はキーが必要であり、単一の値しか返しません。後で、UI全体で使用するために配列全体を返す関数を作成します。

//この店にはペット用のスペースが16匹分有り、またすでにペットのデータベースは持っています。Solinityの配列は0からインデックスされるため、ID値は0から15の間である必要があります。IDが範囲内にあることを確認するには、 require()ステートメントを使用します。

//IDが範囲内にある場合は、呼び出しを行ったアドレスをadopters配列に追加します。この機能を呼び出した人、または呼び出したスマートコントラクトのアドレスは、 msg.senderによって示されます。最後に、提供された petId を確認のために返します。

//前述のように、配列ゲッターは与えられたキーから単一の値だけを返します。私たちのUIはすべてのペットの採用状況を更新する必要がありますが、16のAPI呼び出しを行うことは理想的ではありません。だから次のステップは、配列全体を返す関数を書くことです。
