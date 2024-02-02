// Globale Variablen definieren
let arrowCss = ["bi bi-sort-alpha-down", "bi bi-sort-alpha-up-alt", "bi bi-sort-numeric-down", "bi bi-sort-numeric-up-alt"];
let arrow = [arrowCss[0], arrowCss[0], arrowCss[2]];
let btnActiveCss = "btn btn-success", btnInactiveCss = "btn btn-light";
let buttonColor = [btnInactiveCss, btnInactiveCss, btnInactiveCss];
let filterButtonColor = [btnActiveCss, btnInactiveCss];
let dir = 0, column = 0, totalEmission, myArr, myArrLenght, ratioText, ratioNumber, tableLenght;
let tableHead = ["Company", "Country", "Emission", "Ratio in %"];
let searchFor = tableHead[0];

writeHtmlFilter();

try {
  loadData();

} catch (error) {
  document.getElementById("jsTableDom").innerHTML = "Error loading data. Please try again later. A"

}

// JSON Daten für die Tabelle laden
async function loadData() {
  try {
    const response = await fetch("carbonData.json");
    const myObj = await response.json();
    myArr = await onlyText(myObj);
    emissionNotValid = isEmissionNumber(myArr);
    if (emissionNotValid === 1) {
      document.getElementById("jsTableDom").innerHTML = "Wrong data format. Please try again later."
      return myArr
    }
    else {
      //auslesen der Tabellenköpfe aus dem 1. Json Objekt
      //tableHead[0] = myArr[0].unternehmen;
      //tableHead[1] = myArr[0].land;
      //tableHead[2] = myArr[0].verbrauch;
      // 1. Objekt aus dem Arry löschen und alle anderen Objekte nach vorn schieben
      //myArr.shift();
      myArrLenght = myArr.length;
      getTotalEmission(myArr);
      writeHtmlTable(myArr)
      return myArr;
    }
  }

  catch (error) {
    document.getElementById("jsTableDom").innerText = "Error loading data. Please try again later.";
  }
}

// Sonderzeichnen aus den Array Textdaten entfernen damit kein Code aus den geladenen Daten eingeschleußt werden kann
function onlyText(myObj) {
  for (i = 0; i < myObj.length; i++) {
    myObj[i].unternehmen = myObj[i].unternehmen.replace(/(<|>|!|§|$|%)/g, "");
    myObj[i].land = myObj[i].land.replace(/(<|>|!|§|$|%)/g, "");

  }
  return myObj
}

// prüfen ob die Werte für die Emission jedes Unternehmens eine Zahl ist
function isEmissionNumber(myArr) {
  let emissionNotValid;
  i = 0;
  while (i < myArr.length) {

    if (isNaN(myArr[i].verbrauch)) {
      emissionNotValid = 1;
      break;
    }
    else {
      emissionNotValid = 0;
      i++;
    }
  }
  return emissionNotValid
}



// HTML für Filter erzeugen
function writeHtmlFilter() {
  let text1 = "";
  // erzeugt Filter Button
  text1 += "<input class='me-3 p-2 mb-3' type='text' id='myFilter' onkeyup='myFilter(" + column + ")' placeholder='Search for " + searchFor + "'...' title='Type in a " + searchFor + "'>";
  text1 += "<div class='btn-group me-3'>";
  for (h = 0; h < (tableHead.length - 2); h++) {
    text1 += "<button type='button' class='" + filterButtonColor[h] + "' onclick='changeFilterButton(" + h + ")'>" + tableHead[h];
    text1 += "</button>";
  }
  text1 += "</div>";
  document.getElementById("jsFilter").innerHTML = text1;
}

// HTML für Tabelle aus Array erzeugen
function writeHtmlTable(myArr) {
  let x = 0;
  let text2 = "";

  // Tabelle anlegen
  text2 += "<table class='table table-hover table-light' id='javaTable'>";
  text2 += "<tr class='table-dark'>";

  // Tabellenkopf erzeugen
  for (x = 0; x < tableHead.length - 1; x++) {
    text2 += "<th class='px-2 py-3 align-top w-25";
    if (x == 2) {
      text2 += " text-end";
    };
    text2 += "'>" + tableHead[x];
    text2 += "<button type='button' class='" + buttonColor[x] + " ms-2 px-2' onclick='mySort(myArr, " + (x + 1) + ")'>";
    text2 += "<span class='" + arrow[x] + " aria-hidden='true'></span></button></th>";
  }
  text2 += "<th class='px-2 text-end align-middle'><div>" + tableHead[3] + "</div></th>";
  text2 += "</tr>";

  // Array auslesen und Tabellenfelder erzeugen
  for (x = 0; x < myArr.length; x++) {
    text2 += "<tr><td class='px-2 py-3 w-25'>" + myArr[x].unternehmen + "</td>"
    text2 += "<td class='px-2 py-3 w-25'>" + myArr[x].land + "</td>"
    text2 += "<td class='px-2 py-3 text-end w-25'>" + myArr[x].verbrauch + "</td>";
    //Anteil eines Landes an der gesamten Emission berechnen und als Text mit 2 Stellen nach Komma umwandeln
    ratioText = (myArr[x].verbrauch / totalEmission * 100).toFixed(2);
    text2 += "<td class='px-2 py-3 text-end w-25'>" + ratioText + "</td></tr>";

  }

  // Zeile für keine Einträge vorhanden erzeugen und ausblenden
  text2 += "<tr style='display: none'><td class='p-3'><em>no entries</em></td><td class='p-3'> </td><td class='p-3'> </td><td class='p-3'> </td></tr>";
  // Tabelle schließen
  text2 += "</table>";
  // erzeugtes HTML im DOM aktuallisieren
  document.getElementById("jsTableDom").innerHTML = text2;
};

function myFilter(column) {

  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myFilter");

  filter = input.value.toUpperCase();
  table = document.getElementById("javaTable");
  tr = table.getElementsByTagName("tr");
  tableLenght = myArr.length;
  for (i = 0; i < tr.length - 1; i++) {
    td = tr[i].getElementsByTagName("td")[column];
    if (td) {
      txtValue = td.textContent || td.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        tableLenght++;
      } else {
        tr[i].style.display = "none";
        tableLenght--;
      }
    }
  }
  if (tableLenght == 0) {
    tr[myArr.length + 1].style.display = "";
  }
  else {
    tr[myArr.length + 1].style.display = "none";
  }
}

function changeFilterButton(button) {
  if (button == 0) {
    filterButtonColor[0] = btnActiveCss;
    filterButtonColor[1] = btnInactiveCss;
    searchFor = tableHead[0];
    column = 0;
    writeHtmlFilter();
    //writeHtmlTable(myArr);
  }
  else {
    filterButtonColor[0] = btnInactiveCss;
    filterButtonColor[1] = btnActiveCss;
    searchFor = tableHead[1];
    column = 1;
    writeHtmlFilter();
    //writeHtmlTable(myArr);
  }
}

// Gesamt Emission aller Unternehmen berechnen
function getTotalEmission() {
  totalEmission = 0;
  for (x = 0; x < myArr.length; x++) {
    totalEmission = totalEmission + Number(myArr[x].verbrauch);
  }
  return totalEmission;
}

// Array sortieren
function mySort(myArr2, spalte) {

  if (dir == 0 && spalte == 1) {
    dir = !dir;
    arrow[0] = arrowCss[0];
    buttonColor = [btnActiveCss, btnInactiveCss, btnInactiveCss];
    myArr2.sort(function (a, b) {
      let x = a.unternehmen.toLowerCase();
      let y = b.unternehmen.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  else if (dir == 1 && spalte == 1) {
    arrow[0] = arrowCss[1];
    dir = !dir;
    buttonColor = [btnActiveCss, btnInactiveCss, btnInactiveCss];
    myArr.sort(function (a, b) {
      let x = a.unternehmen.toLowerCase();
      let y = b.unternehmen.toLowerCase();
      if (x < y) { return 1; }
      if (x > y) { return -1; }
      return 0;
    });
  }

  else if (dir == 0 && spalte == 2) {
    arrow[1] = arrowCss[0];
    dir = !dir;
    buttonColor = [btnInactiveCss, btnActiveCss, btnInactiveCss];
    myArr2.sort(function (a, b) {
      let x = a.land.toLowerCase();
      let y = b.land.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  else if (dir == 1 && spalte == 2) {
    arrow[1] = arrowCss[1];
    dir = !dir;
    buttonColor = [btnInactiveCss, btnActiveCss, btnInactiveCss];
    myArr2.sort(function (a, b) {
      let x = a.land.toLowerCase();
      let y = b.land.toLowerCase();
      if (x < y) { return 1; }
      if (x > y) { return -1; }
      return 0;
    });
  }

  else if (dir == 0 && spalte == 3) {
    arrow[2] = arrowCss[2];
    dir = !dir;
    buttonColor = [btnInactiveCss, btnInactiveCss, btnActiveCss];
    myArr2.sort(function (a, b) {
      let x = Number(a.verbrauch);
      let y = Number(b.verbrauch);
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  else if (dir == 1 && spalte == 3) {
    arrow[2] = arrowCss[3];
    dir = !dir;
    buttonColor = [btnInactiveCss, btnInactiveCss, btnActiveCss];
    myArr2.sort(function (a, b) {
      let x = Number(a.verbrauch);
      let y = Number(b.verbrauch);
      if (x < y) { return 1; }
      if (x > y) { return -1; }
      return 0;
    });
  };

  writeHtmlTable(myArr2);
  return myArr2;
}