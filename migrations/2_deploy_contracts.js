var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};

//自動生成されている1_initial_migration.jsと同じく、これは、Migrations.solコントラクトを展開し、その後のスマートコントラクトの移行を監視し、二重契約が起きないようにハンドルします。
