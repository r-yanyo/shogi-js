function loadingImages() {
  pieces = [
    document.getElementById("empty"),
    document.getElementById("fu"),
    document.getElementById("kyou"),
    document.getElementById("kei"),
    document.getElementById("gin"),
    document.getElementById("hisya"),
    document.getElementById("kaku"),
    document.getElementById("kin"),
    document.getElementById("ou"),
    document.getElementById("to"),
    document.getElementById("nkyou"),
    document.getElementById("nkei"),
    document.getElementById("ngin"),
    document.getElementById("ryu"),
    document.getElementById("uma"),
    document.getElementById("kin"),
    document.getElementById("ou"),
    document.getElementById("e_fu"),
    document.getElementById("e_kyou"),
    document.getElementById("e_kei"),
    document.getElementById("e_gin"),
    document.getElementById("e_hisya"),
    document.getElementById("e_kaku"),
    document.getElementById("e_kin"),
    document.getElementById("e_ou"),
    document.getElementById("e_to"),
    document.getElementById("e_nkyou"),
    document.getElementById("e_nkei"),
    document.getElementById("e_ngin"),
    document.getElementById("e_ryu"),
    document.getElementById("e_uma"),
    document.getElementById("e_kin"),
    document.getElementById("e_ou")
  ];

  senteCapture = [
    document.getElementById("empty"),
    document.getElementById("fu"),
    document.getElementById("kyou"),
    document.getElementById("kei"),
    document.getElementById("gin"),
    document.getElementById("hisya"),
    document.getElementById("kaku"),
    document.getElementById("kin")
  ];

  goteCapture = [
    document.getElementById("empty"),
    document.getElementById("e_fu"),
    document.getElementById("e_kyou"),
    document.getElementById("e_kei"),
    document.getElementById("e_gin"),
    document.getElementById("e_hisya"),
    document.getElementById("e_kaku"),
    document.getElementById("e_kin")
  ];

  attack_cell = document.getElementById("move");
  selected_cell = document.getElementById("selected");

  for (var i = 0; i <= 1; i++) {
    capture[i] = [];
    for (var j = 0; j <= 7; j++) {
      capture[i][j] = 0;
    }
  }
}

window.onload = function() {
  selectFlag = 0;
  phase = 0;
  appendMessageField();
  menu();
};
