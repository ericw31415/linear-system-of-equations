function areEqsValid(eqs) {
  for (const eq of eqs) {
    if (eq.search(/^-?\d*[a-zA-Z]([+-]-?\d*[a-zA-Z])*=-?\d+$/) === -1)
      return false;
  }
  return true;
}

function parseEqs(eqs) {
  let unknowns = [];
  for (const eq of eqs) {
    for (const c of eq) {
      if ("a" <= c && c <= "z" || "A" <= c && c <= "Z")
        unknowns.push(c);
    }
  }
  unknowns = [...new Set(unknowns)];

  let coeffs = new Matrix(unknowns.length, unknowns.length);
  let result = new Matrix(unknowns.length);
  for (let i = 0; i < eqs.length; i++) {
    for (let j = 0; j < unknowns.length; j++) {
      const match = eqs[i].match(new RegExp(`-?\\d*(?=${unknowns[j]})`));
      if (match === null)
        coeffs[i][j] = 0;
      else if (match[0] === "")
        coeffs[i][j] = 1;
      else if (match[0] === "-")
        coeffs[i][j] = -1;
      else
        coeffs[i][j] = parseInt(match[0]);
    }
    result[i][0] = parseInt(eqs[i].match(new RegExp("(?<==)-?\\d+"))[0]);
  }
  return {coeffs: coeffs, result: result, unknowns: unknowns};
}

function updateResult(str) {
  document.querySelector("#result").innerHTML = str;
}

function addEq() {
  const eqBox = document.createElement("input");
  eqBox.type = "text";
  eqBox.value = "x = 0";

  const delEqButton = document.createElement("button");
  delEqButton.appendChild(document.createTextNode("-"));
  delEqButton.addEventListener("click", e => {
    delEq(e.target);
  });

  const br = document.createElement("br");

  document.body.insertBefore(br, document.querySelector("#add-eq"));
  document.body.insertBefore(delEqButton, br);
  document.body.insertBefore(eqBox, delEqButton);
}

function delEq(element) {
  document.body.removeChild(element.previousSibling);
  document.body.removeChild(element.nextSibling);
  document.body.removeChild(element);
}

function calculate() {
  const eqs = [...document.querySelectorAll("input")].map(eq => {
    return eq.value.replace(/ /g, "");
  });

  if (!areEqsValid(eqs)) {
    updateResult("Invalid input.");
    return;
  }
  const eqMatrices = parseEqs(eqs);

  // Cramer's rule
  const detEqs = Matrix.det(eqMatrices.coeffs);
  const ret = {};
  for (let i = 0; i < eqMatrices.coeffs.cols; i++) {
    const eqsReplaced = eqMatrices.coeffs.copy();
    for (let j = 0; j < eqMatrices.coeffs.rows; j++)
      eqsReplaced[j][i] = eqMatrices.result[j][0];
    ret[eqMatrices.unknowns[i]] = Matrix.det(eqsReplaced) / detEqs;
  }
  const outText=[];
  for (const [key, val] of Object.entries(ret))
    outText.push(key + " = " + val);
  updateResult(outText.join("\n"));
}

window.addEventListener("DOMContentLoaded", main);
function main() {
  document.querySelector("#add-eq").addEventListener("click", addEq);
  document.querySelector("#calculate").addEventListener("click", calculate);
}
