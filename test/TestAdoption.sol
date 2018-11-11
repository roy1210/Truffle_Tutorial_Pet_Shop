pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

  contract TestAdoption {
    //The address of the adoption contract to be tested
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    //The id of the pet that will be used for testing
    uint expectedPetId = 8;
    //The expected owner of adopted pet is this contract
    address expectedAdopter = this;

    // Testing the adopt() function
    function testUserCanAdoptPet() public {
      uint returnedId = adoption.adopt(expectedPetId);

      Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByPetId() public {
      address adopter = adoption.adopters(expectedPetId);

      Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
}

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() public{
      // Store adopters in memory rather than contract's storage
      address[16] memory adopters = adoption.getAdopters();

      Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
  }

//注意：最初の2つのインポートは、truffleディレクトリではなく、グローバルなTruffleファイルを参照しています。自分のtest/ディレクトリの中のtruffleディレクトリの中を見る必要はありません。

//- Assert.sol：テストで使用するさまざまなアサーションを提供します。テストにおいて、アサーションは、テストが合格/不合格かを判断するために、値が等しい、等しくない、空である、などをチェックします。

//- DeployedAddresses.sol：テストを実行すると、Truffleはテスト対象のコントラクトの新しいインスタンスをブロックチェーンに展開します。このスマートコントラクトは、デプロイされたコントラクトのアドレスを取得します。

//- Adoption.sol：私たちがテストしたいスマートコントラクトの本体。

// 7行目のAdoption adoptionはつまりAdoption Contractのadoption(テストように定義する変数)のことだと思う。。。

//Assert.equal()に、実際の値、期待値、（テストに失敗した場合にコンソールに出力される）失敗メッセージを設定します。

//TestAdoptionコントラクトがトランザクションを送信するので、期待値をthis(契約全体のアドレスを取得する契約全体の変数)に設定します。その上で、上記のように取得したアドレスと期待値が等しいことをアサーションします。

//adoptersの前に書かれたmemoryは、メモリ属性を意味します。 メモリ属性は、コントラクトのストレージに保存するのではなく、メモリに一時的に値を格納するようSolinityに指示するものです。

//スマートコントラクトはBlockChain上に展開したら戻せないので、テストをしっかりすることが非常に大切です。
