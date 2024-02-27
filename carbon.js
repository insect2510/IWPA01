// Globale Variablen definieren
let sortIcon = "bi bi-caret-up-fill";
let tableHead = ["Company", "Country", "Emission", "Ratio in %"], searchFor = tableHead[0];
let htmlFilter, htmlTabletotalEmission, myArr, tableLenght, filterButtonId;
let iconStyleInit = "";
let dir = [1, 0, 0], column = 0, preColumn = 0, hasFilter = true, preYear = 0, preFilter = 0, totalEmission = 0;
let errorHandle = 0;
let dataAvailable = [1, 0, 0, 0];

loadData();

// JSON Daten für die Tabelle laden
async function loadData() {
  // Prüfung ob beim Laden und Erzeugen des HTML der Tabellendaten ein Fehler auftritt
  try {
    // Datei mit Daten laden und parsen
    const response = await fetch("carbonData.json");
    const myObj = await response.json();
    // Funktion onlyText zum löschen von Sonderzeichen aufrufen
    myArr = await onlyText(myObj);
    // Funktion isEmissionNumber zur Prüfung ob Emission eine Zahl ist aufrufen
    emissionNotValid = isEmissionNumber(myArr);
    // Wenn Emission keine Zahl ist, Hinweis ins DOM schreiben und Hauptnavigation ausblenden
    if (emissionNotValid === 1) {
      document.getElementById("jsTableDom").innerHTML = "<p>Wrong data format. Please try again later.</p>";
      document.getElementById("hauptnavigation").style.display = "none"
      return
    }
    // Wenn Emission eine Zahl ist, Gesamtemission berechnen und HTML für Tabelle und Filter schreiben
    else {
      myArrLenght = myArr.length;
      getTotalEmission(myArr);
      writeHtmlTable(myArr)
      writeHtmlFilterSearch();
      writeHtmlFilterButtons();
      return myArr;
    }
  }
  // Bei Auftreten eines Fehlers, Meldung in das DOM schreiben und Hauptnavigation ausblenden
  catch (error) {
    document.getElementById("jsTableDom").innerHTML = "<p class='text-grey'>Error loading data. Please try again later.</p>"
    document.getElementById("hauptnavigation").style.display = "none"
    return
  }
}

// Sonderzeichnen aus den Datenfelder company und country entfernen damit kein Code aus den geladenen Daten eingeschleußt werden kann
function onlyText(myObj) {
  for (i = 0; i < myObj.length; i++) {
    myObj[i].company = myObj[i].company.replace(/(<|>|!|§|$|%)/g, "");
    myObj[i].country = myObj[i].country.replace(/(<|>|!|§|$|%)/g, "");
  }
  return myObj
}

// prüfen ob die Werte für die Emission jeder company eine Zahl ist
function isEmissionNumber(myArr) {
  let emissionNotValid;
  i = 0;
  while (i < myArr.length) {
    if (isNaN(myArr[i].emission)) {
      emissionNotValid = 1;
      break;
    }
    else {
      emissionNotValid = 0;
      myArr[i].emission = myArr[i].emission.toFixed(2);
      i++;
    }
  }
  return emissionNotValid
}

// HTML für Tabellenfilter erzeugen
function writeHtmlFilterSearch() {
  // erzeugt HTML Suchfeld im Filter
  htmlFilter = "<input style='' class='col-12 my-2' type='text' id='myFilterInput' onkeyup='myFilter(" + column + ")' placeholder='Search for a " + searchFor + "' title='Type in a " + searchFor + "'>";
  document.getElementById("myFilterSearch").innerHTML = htmlFilter;
}
// erzeugt HTML für die Buttons des Filterkriteriums
function writeHtmlFilterButtons() {
  htmlFilter = "";
  htmlFilter += "<button type='button' class='filterbutton active py-2 my-2 g-1' onclick='changeFilterButton(0)'>" + tableHead[0];
  htmlFilter += "</button>";
  htmlFilter += "<button type='button' class='filterbutton py-2 my-2 g-1' onclick='changeFilterButton(1)'>" + tableHead[1];
  htmlFilter += "</button>";
  document.getElementById("myFilterButtons").innerHTML = htmlFilter;
  filterButtonId = document.getElementById("myFilterButtons").getElementsByTagName("button");
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
    htmlTable += "'><div class='d-inline-flex flex-column flex-md-row'><div class='align-self-center py-md-2'>" + tableHead[x].toUpperCase();
    htmlTable += "</div><div><button type='button' id='sortBtn" + x + "' class='ms-0 ms-md-2 px-2 py-1 my-md-2 border-0 rounded-1 sortbutton' ";
    htmlTable += "onclick='sortTable(" + (x) + ")' style = '" + iconStyleInit + "'>";
    htmlTable += "<span class='bi " + sortIcon + " aria-hidden='true'></span></button></div></th>";
  }
  htmlTable += "<th class='px-2 px-md-4 py-2 py-md-3 text-end align-top align-md-middle w-25'><div>" + tableHead[3].toUpperCase() + "</div></div></th>";
  htmlTable += "</tr>";
  // Array auslesen und Tabellenfelder erzeugen
  for (x = 0; x < myArr.length; x++) {
    htmlTable += "<tr><td class='px-2 px-md-4 py-3 w-25 tabletext'>" + myArr[x].company + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25 tabletext'>" + myArr[x].country + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 text-end w-25 tabletext'>" + myArr[x].emission + "</td>";
    //Anteil einer company an der gesamten Emission berechnen und mit 2 Stellen nach Komma umwandeln
    ratioEmission = (myArr[x].emission / totalEmission * 100).toFixed(2);
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25 text-end tabletext'>" + ratioEmission + "</td></tr>";
  }
  // Zeile für keine Einträge vorhanden erzeugen und ausblenden
  htmlTable += "<tr style='display: none'><td class='p-3'><em>No data found.</em></td><td class='p-3'> </td><td class='p-3'> </td><td class='p-3'> </td></tr>";
  // Tabelle schließen
  htmlTable += "</table>";
  htmlTable += "<p id='measurement'>The value for carbon emission are measured in Gigatons. In 2023 we have tracked " + myArr.length + " companies with ";
  htmlTable += "a total emission of " + totalEmission + " Gigatons CO2.</p>";

  // erzeugtes HTML im DOM aktuallisieren
  document.getElementById("jsTableDom").innerHTML = htmlTable;
};

// Tabelle filter
function myFilter(column) {
  if (hasFilter) {
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
}

// Filter Buttons umschalten
function changeFilterButton(filterButton) {

  if (filterButton == 0) {
    filterButtonId[0].classList.add("active")
    filterButtonId[1].classList.remove("active")
    searchFor = tableHead[0];
    column = 0;
  }
  else if (filterButton == 1) {

    filterButtonId[1].classList.add("active")
    filterButtonId[0].classList.remove("active")
    searchFor = tableHead[1];
    column = 1;
  }
  writeHtmlFilterSearch();
  if (hasFilter) {
    writeHtmlTable(myArr);
  }
}

// Gesamt Emission aller company berechnen
function getTotalEmission() {
  for (x = 0; x < myArr.length; x++) {
    totalEmission = totalEmission + Number(myArr[x].emission);

    ;
  }
  totalEmission = totalEmission.toFixed(2);
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
  // Aktive Klasse zum aktuell geklickten Button hinzufügen
  document.getElementById(("sortBtn" + preColumn)).classList.remove("active");
  document.getElementById(("sortBtn" + column)).classList.add("active");

  // aktuelle Spallte speichern.
  preColumn = column;

  // Icon je nach Sortierrichtung rotieren.
  if (dir[column] == 0) {
    document.getElementById(("sortBtn" + column)).style.rotate = "0deg";
  }
  else {
    document.getElementById(("sortBtn" + column)).style.rotate = "180deg";
  }

  // Referenz auf Tabelle im DOM setzen
  table = document.getElementById("javaTable");
  switching = true;
  //Loop der so lange läuft bis keine Zeilen mehr getauscht werden
  while (switching) {
    switching = false;
    rows = table.rows;
    // Loop durch alle Tabellenzeilen, außer der ersten (Header) und der letzten (No Data)
    for (i = 1; i < (rows.length - 2); i++) {
      //start mit dem Defaultwert kein Tausch
      shouldSwitch = false;
      // Referenz auf die Tabellenzelle der aktuellen Zeile sowie der folgenden Zeile
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      //Spalten Company und Country als String aufsteigend vergleichen und wenn ja dann Tausch marieren
      if (dir[column] == 0 && column < 2 && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
      //Spalten Company und Country als String absteigend vergleichen und wenn ja dann Tausch marieren
      else if (dir[column] == 1 && column < 2 && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
      //Spalte Emissionswert als Zahl aufsteigend vergleichen und wenn ja dann Tausch marieren
      else if (dir[column] == 0 && column == 2 && Number(x.innerHTML) > Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
      //Spalte Emissionswert als Zahl absteigend vergleichen und wenn ja dann Tausch marieren
      else if (dir[column] == 1 && column == 2 && Number(x.innerHTML) < Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      //Wenn ein Tausch markiert wurde, Tausch durchführen und markieren, dass ein Tausch durchgeführt wurde
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

// hat Daten für das Jahr
function hasData(year) {
  changeYear(year);
  var table, tr, td, i;
  table = document.getElementById("javaTable");
  tr = table.getElementsByTagName("tr");
  if (dataAvailable[year]) {
    for (i = 1; i < tr.length - 1; i++) {
      tr[i].style.display = "";
    }
    tr[tr.length - 1].style.display = "none";
    document.getElementById("measurement").style.display = "";
    hasFilter = true;
    myFilter(column);
  }
  else {
    for (i = 1; i < tr.length - 1; i++) {
      tr[i].style.display = "none";
    }
    tr[tr.length - 1].style.display = "";
    document.getElementById("measurement").style.display = "none";
    hasFilter = false;
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
