// Globale Variablen definieren
let sortIcon = "bi bi-caret-up-fill";
//let btnActiveCss = "btn-success", btnInactiveCss = "btn-light", filterButtonColor = [btnActiveCss, btnInactiveCss];
let totalEmission, myArr, tableLenght;
let tableHead = ["Company", "Country", "Emission", "Ratio in %"], searchFor = tableHead[0];
let htmlFilter, htmlTable;
let iconBackColor = ["#ededed", "#198754"], iconTextColor = ["#000000", "#fefefe"];
let iconStyleInit = "background-color: " + iconBackColor[0] + "; color: " + iconTextColor[0] + "; rotate: 0deg";
let dir = [1, 0, 0], column = 0, preColumn = 0, preYear = 0, preFilter = 0;

writeHtmlFilter2();
writeHtmlFilterButtons2();

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

// HTML2 für Filter erzeugen
function writeHtmlFilter2() {
  // erzeugt Filter Button
  htmlFilter = "<input style='' class='col-12 p-2 my-2 border-1' type='text' id='myFilterSearch' onkeyup='myFilter(" + column + ")' placeholder='Search for a " + searchFor + "' title='Type in a " + searchFor + "'>";
  document.getElementById("myFilterSearch2").innerHTML = htmlFilter;
}
//
function writeHtmlFilterButtons2() {
  htmlFilter = "";
  //for (h = 0; h < (tableHead.length - 2); h++) {
  //  htmlFilter += "<button type='button' class='btn border-1 rounded-0 py-2 my-2 g-1 " + filterButtonColor[h] + "' onclick='changeFilterButton(" + h + ")'>" + tableHead[h];
  //  htmlFilter += "</button>";
  //}
  htmlFilter += "<button type='button' class='filterbutton active py-2 my-2 g-1' onclick='changeFilterButton2(0)'>" + tableHead[0];
  htmlFilter += "<button type='button' class='filterbutton py-2 my-2 g-1' onclick='changeFilterButton2(1)'>" + tableHead[1];
  htmlFilter += "</button>";

  document.getElementById("myFilterButtons2").innerHTML = htmlFilter;
}

// HTML für Tabelle aus Array erzeugen
function writeHtmlTable(myArr) {

  let x = 0;

  // Tabelle anlegen
  htmlTable = "<table class='table table-hover table-bordered table-light' id='javaTable'>";
  htmlTable += "<tr class='table-dark'>";

  // Tabellenkopf erzeugen
  for (x = 0; x < tableHead.length - 1; x++) {
    htmlTable += "<th class='px-2 px-md-4 py-3 align-top w-25";
    if (x == 2) {
      htmlTable += " text-end";
    };
    htmlTable += "'><div class='d-inline-flex flex-column flex-md-row'><div class='align-self-center py-md-2'>" + tableHead[x].toUpperCase()
    htmlTable += "</div><div><button type='button' id='sortBtn" + x + "' class='ms-0 ms-md-2 px-1 py-0 my-md-2 border-0 rounded-1' onclick='sortTable(" + (x) + ")' style = '" + iconStyleInit + "'>";
    htmlTable += "<span class='bi " + sortIcon + " aria-hidden='true'></span></button></div></th>";
  }
  htmlTable += "<th class='px-2 px-md-4 py-3 py-md-4 text-end align-top align-md-middle w-25'><div>" + tableHead[3].toUpperCase() + "</div></div></th>";
  htmlTable += "</tr>";

  // Array auslesen und Tabellenfelder erzeugen
  for (x = 0; x < myArr.length; x++) {
    htmlTable += "<tr><td class='px-2 px-md-4 py-3 w-25'>" + myArr[x].unternehmen + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25'>" + myArr[x].land + "</td>"
    htmlTable += "<td class='px-2 px-md-4 py-3 text-end w-25'>" + myArr[x].verbrauch + "</td>";
    //Anteil eines Landes an der gesamten Emission berechnen und mit 2 Stellen nach Komma umwandeln
    ratioEmission = (myArr[x].verbrauch / totalEmission * 100).toFixed(2);
    htmlTable += "<td class='px-2 px-md-4 py-3 w-25 text-end'>" + ratioEmission + "</td></tr>";

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
  input = document.getElementById("myFilterSearch");
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
function changeFilterButton2(filterButton) {
  let filterButtonId;
  filterButtonId = document.getElementById("myFilterButtons2").getElementsByTagName("button");

  if (filterButton == 0) {
    filterButtonId[0].classList.add("active")
    filterButtonId[1].classList.remove("active")
    searchFor = tableHead[0];
    column = 0;
    writeHtmlFilter2();
    writeHtmlTable(myArr);
  }
  else {
    filterButtonId[1].classList.add("active")
    filterButtonId[0].classList.remove("active")
    searchFor = tableHead[1];
    column = 1;
    writeHtmlFilter2();
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

// Tabelle sortieren nach Auswahl der Spalte
function sortTable(column) {
  var table, rows, switching, i, x, y, shouldSwitch;

  if (preColumn == column) {
    dir[column] = !dir[column]
  }
  document.getElementById(("sortBtn" + preColumn)).style.backgroundColor = iconBackColor[0];
  document.getElementById(("sortBtn" + preColumn)).style.color = iconTextColor[0];
  document.getElementById(("sortBtn" + column)).style.backgroundColor = iconBackColor[1];
  document.getElementById(("sortBtn" + column)).style.color = iconTextColor[1];

  preColumn = column;

  table = document.getElementById("javaTable");
  switching = true;

  /*Make a loop that will continue until
  no switching has been done:*/
  if (dir[column] == 0) {
    document.getElementById(("sortBtn" + column)).style.rotate = "0deg";
  }
  else {
    document.getElementById(("sortBtn" + column)).style.rotate = "180deg";
  }

  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 2); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];

      //check if the two rows should switch place:
      if (dir[column] == 0 && column < 2 && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;

        break;
      }
      else if (dir[column] == 1 && column < 2 && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;

        break;
      }
      else if (dir[column] == 0 && column == 2 && Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;

        break;
      }
      else if (dir[column] == 1 && column == 2 && Number(x.innerHTML) < Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;

        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }

}

function setLanguage(language) {
  let langId;
  langId = document.getElementById("langselect").getElementsByTagName("button")
  if (language == 0) {
    document.getElementById("hauptnavigation").style = "float: left;";
    langId[0].classList.add("active");
    langId[1].classList.remove("active");

  }
  else {
    document.getElementById("hauptnavigation").style = "float: right;";
    langId[1].classList.add("active");
    langId[0].classList.remove("active");

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
// Tabelle filter
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
function data(year) {

  changeYear(year);


  var table, tr, td, i;

  table = document.getElementById("javaTable");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length - 1; i++) {
    tr[i].style.display = "";
  }

  tr[tr.length - 1].style.display = "none";

}