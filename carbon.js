// Globale Variablen definieren
let sortIcon = "bi bi-caret-up-fill";
let totalEmission, myArr, tableLenght;
let tableHead = ["Company", "Country", "Emission", "Ratio in %"], searchFor = tableHead[0];
let htmlFilter, htmlTable;
let iconStyleInit = "";
let dir = [1, 0, 0], column = 0, preColumn = 0, preYear = 0, preFilter = 0;

try {
  loadData();

} catch (error) {
  document.getElementById("jsTableDom").innerHTML = "Error loading data. Please try again later. A"


}

writeHtmlFilterSearch();
writeHtmlFilterButtons();


// JSON Daten für die Tabelle laden
async function loadData() {
  // Prüfung ob beim Laden und Schreiben der Tabellendaten ein Fehler auftritt
  try {
    const response = await fetch("carbonData.json");
    const myObj = await response.json();
    // Funktion onlyText zum löschen von Sonderzeichen aufrufen
    myArr = await onlyText(myObj);
    // Funktion isEmissionNumber zur Prüfung ob Emission eine Zahl ist aufrufen
    emissionNotValid = isEmissionNumber(myArr);
    // Wenn Emission keine Zahl ist, Hinweis ins DOM schreiben
    if (emissionNotValid === 1) {
      document.getElementById("jsTableDom").innerHTML = "Wrong data format. Please try again later."
      return myArr
    }
    // Wenn Emission eine Zahl ist, Gesamtemission berechnen und HTML für Tabelle schreiben
    else {
      myArrLenght = myArr.length;
      getTotalEmission(myArr);
      writeHtmlTable(myArr)
      return myArr;
    }
  }
  // Bei Auftreten eines Fehlers, Meldung ins DOM schreiben.
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

// HTML für Tabellenfilter erzeugen
function writeHtmlFilterSearch() {
  // erzeugt HTML Suchfeld
  htmlFilter = "<input style='' class='col-12 my-2' type='text' id='myFilterInput' onkeyup='myFilter(" + column + ")' placeholder='Search for a " + searchFor + "' title='Type in a " + searchFor + "'>";
  document.getElementById("myFilterSearch").innerHTML = htmlFilter;
}
// erzeugt HTML
function writeHtmlFilterButtons() {
  htmlFilter = "";
  htmlFilter += "<button type='button' class='filterbutton active py-2 my-2 g-1' onclick='changeFilterButton(0)'>" + tableHead[0];
  htmlFilter += "<button type='button' class='filterbutton py-2 my-2 g-1' onclick='changeFilterButton(1)'>" + tableHead[1];
  htmlFilter += "</button>";

  document.getElementById("myFilterButtons").innerHTML = htmlFilter;
}

// HTML für Tabelle aus Array erzeugen
function writeHtmlTable(myArr) {

  let x = 0;

  // Tabelle anlegen
  htmlTable = "<table class='table table-hover table-bordered table-light' id='javaTable'>";
  htmlTable += "<tr class='table-dark'>";

  // Tabellenkopf erzeugen
  for (x = 0; x < tableHead.length - 1; x++) {
    htmlTable += "<th class='px-1 px-md-4 py-2 py-md-1 align-top w-25 tabletext";
    if (x == 2) {
      htmlTable += " text-end";
    };
    htmlTable += "'><div class='d-inline-flex flex-column flex-md-row'><div class='align-self-center py-md-2'>" + tableHead[x].toUpperCase()
    htmlTable += "</div><div><button type='button' id='sortBtn" + x + "' class='ms-0 ms-md-2 px-2 py-1 my-md-2 border-0 rounded-1 sortbutton' ";
    htmlTable += "onclick='sortTable(" + (x) + ")' style = '" + iconStyleInit + "'>";
    htmlTable += "<span class='bi " + sortIcon + " aria-hidden='true'></span></button></div></th>";
  }
  htmlTable += "<th class='px-2 px-md-4 py-2 py-md-3 text-end align-top align-md-middle w-25'><div>" + tableHead[3].toUpperCase() + "</div></div></th>";
  htmlTable += "</tr>";
  // Array auslesen und Tabellenfelder erzeugen
  for (x = 0; x < myArr.length; x++) {
    htmlTable += "<tr><td class='px-2 px-md-4 py-3 w-25 tabletext'>" + myArr[x].unternehmen + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25 tabletext'>" + myArr[x].land + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 text-end w-25 tabletext'>" + myArr[x].verbrauch + "</td>";
    //Anteil eines Landes an der gesamten Emission berechnen und mit 2 Stellen nach Komma umwandeln
    ratioEmission = (myArr[x].verbrauch / totalEmission * 100).toFixed(2);
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25 text-end tabletext'>" + ratioEmission + "</td></tr>";
  }
  // Zeile für keine Einträge vorhanden erzeugen und ausblenden
  htmlTable += "<tr style='display: none'><td class='p-3'><em>No data found.</em></td><td class='p-3'> </td><td class='p-3'> </td><td class='p-3'> </td></tr>";
  // Tabelle schließen
  htmlTable += "</table>";
  // erzeugtes HTML im DOM aktuallisieren
  document.getElementById("jsTableDom").innerHTML = htmlTable;
};

// Tabelle filter
function myFilter(column) {

  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myFilterInput");
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

// Filter Buttons umschalten
function changeFilterButton(filterButton) {
  let filterButtonId;
  filterButtonId = document.getElementById("myFilterButtons").getElementsByTagName("button");

  if (filterButton == 0) {
    filterButtonId[0].classList.add("active")
    filterButtonId[1].classList.remove("active")
    searchFor = tableHead[0];
    column = 0;
    writeHtmlFilterSearch();
    writeHtmlTable(myArr);
  }
  else {
    filterButtonId[1].classList.add("active")
    filterButtonId[0].classList.remove("active")
    searchFor = tableHead[1];
    column = 1;
    writeHtmlFilterSearch();
    writeHtmlTable(myArr);
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

// Tabelle sortieren nach Auswahl der Spalte in der Variable Column
function sortTable(column) {
  var table, rows, switching, i, x, y, shouldSwitch;

  // Prüfung ob die aktuell geklickte Spalte mit der zuvor geklickten Spalte gleich ist
  if (preColumn == column) {
    //wenn ja, Sortierrichtung der Spalte invertieren
    dir[column] = !dir[column]
  }
  // Aktive Klasse vom zuvor gekkickten Button entfernen
  document.getElementById(("sortBtn" + preColumn)).classList.remove("active");
  // Aktive Klasse zum aktuell geklickten Button hinzufügen
  document.getElementById(("sortBtn" + column)).classList.add("active");
  // aktuelle Spallte speichern.
  preColumn = column;
  // Referenz auf Tabelle im DOM setzen
  table = document.getElementById("javaTable");
  switching = true;

  // Icon je nach Sortierrichtung rotieren.
  if (dir[column] == 0) {
    document.getElementById(("sortBtn" + column)).style.rotate = "0deg";
  }
  else {
    document.getElementById(("sortBtn" + column)).style.rotate = "180deg";
  }

  //Loop der so lange läuft bis keine Zeilen mehr getauscht werden
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    // Loop durch alle Tabellenzeilen, außer der ersten (Header) und der letzten (No Data)
    for (i = 1; i < (rows.length - 2); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      // Referenz auf die Tabellenzelle der aktuellen Zeile sowie der folgenden Zeile
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      //Spalten Company und Country als String aufsteigend
      if (dir[column] == 0 && column < 2 && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
      //Spalten Company und Country als String absteigend
      else if (dir[column] == 1 && column < 2 && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
      //Spalte Emissionswert als Zahl aufsteigend
      else if (dir[column] == 0 && column == 2 && Number(x.innerHTML) > Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
      //Spalte Emissionswert als Zahl absteigend
      else if (dir[column] == 1 && column == 2 && Number(x.innerHTML) < Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function changeYear(year) {
  yearBtn = document.getElementById("hauptnavigation");
  yearBtn = yearBtn.getElementsByTagName("button");
  yearBtn[preYear].classList.remove("active")
  yearBtn[year].classList.add("active")
  preYear = year;
  return year;


}
// Tabelle filtern
function noData(year) {

  changeYear(year);

  var table, tr, td, i;

  table = document.getElementById("javaTable");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length - 1; i++) {
    tr[i].style.display = "none";
  }

  tr[tr.length - 1].style.display = "";

}
function hasData(year) {

  changeYear(year);


  var table, tr, td, i;

  table = document.getElementById("javaTable");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length - 1; i++) {
    tr[i].style.display = "";
  }

  tr[tr.length - 1].style.display = "none";

}