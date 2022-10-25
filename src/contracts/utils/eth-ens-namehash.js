import { keccak_256 as sha3 } from "js-sha3";

import * as uts46 from "idna-uts46-hx";

function namehash(inputName) {
  // Reject empty names:
  var node = "";
  var i;
  for (i = 0; i < 32; i++) {
    node += "00";
  }

  _name = normalize(inputName);

  if (_name) {
    var labels = _name.split(".");

    for (i = labels.length - 1; i >= 0; i--) {
      var labelSha = sha3(labels[i]);
      node = sha3(new Buffer(node + labelSha, "hex"));
    }
  }

  return "0x" + node;
}

function normalize(name) {
  return name
    ? uts46.toUnicode(name, {
        useStd3ASCII: true,
        transitional: false,
      })
    : name;
}

export { namehash as hash, normalize };
