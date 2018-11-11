App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

//initWeb3: async function.. まず、すでにアクティブなWeb3インスタンスがあるかどうかを確認します。（EthereumブラウザのMistや、MetaMask拡張機能を備えたChromeなどのブラウザでは、独自のweb3インスタンスが使用されます）。既存のweb3インスタンスが存在する場合、そのプロバイダを取得してWeb3オブジェクトを作成します。既存のweb3インスタンスが存在しない場合は、ローカルプロバイダに基づいてweb3オブジェクトを作成します。（この代替は開発環境では問題ありませんが、安全ではなく、本番環境には適していません）。

//initContract: function... まず、スマートコントラクト用のアーティファクトファイルを取得します。アーティファクトは、デプロイされたアドレスやアプリケーションバイナリインターフェイス（ABI）など、契約に関する情報です。ABIは、変数、関数、およびそれらのパラメータを含むコントラクトとの対話方法を定義するJavaScriptオブジェクトです。

//「markAdopted()」関数は、コントラクトの関数である「getAdopters()」を呼び出します。「getAdopters()」関数は採用されているペットと採用者のアドレスを返すものです。つまりここでは、すでに採用されたペットのボタンを「Success」と表示させて、ボタンを押してもトランザクションができなようにしています。

//Handling the adopt() Function:  web3を使用してユーザーのアカウントを取得します。 エラーチェック後のコールバックでは、最初のアカウントを選択します。そこから、上記のようにデプロイされたコントラクトを取得し、そのインスタンスをadoptionInstanceに格納します。今度は、コールの代わりにトランザクションを送信します。取引には「差出人」アドレスが必要で、取引に関連してコストがかかります。この費用は、Etherで支払われ、gas(ガス)と呼ばれます。このガスとは、計算を実行し、および/またはスマートコントラクトでデータを記憶するための料金です。私たちは、ペットのIDと、先にaccountで格納したアカウントアドレスを含むオブジェクトの両方を使用してadopt()関数を実行するトランザクションを送信します 。トランザクションを送信した結果がトランザクションオブジェクトです。エラーがなければ、markAdopted()関数を呼び出してUIを新しく格納されたデータと同期させます。
