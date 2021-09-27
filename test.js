function decode(str) {
    return Buffer.from(str, "base64").toString("utf8");
}

function encode(str){
    return Buffer.from(str, "utf8").toString("base64");
  }


  console.log(encode("adasa"), decode("YWRhc2E"))
  console.log(encode("Badasas"), decode("QmFkYXNhcw"))
  console.log(encode("Nadasa"))