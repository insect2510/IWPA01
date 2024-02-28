function setLanguage(language) {

    let langButtonId;
    langButtonId = document.getElementById("langselect").getElementsByTagName("button")
    if (language == 0) {
        if (document.getElementById("mainnavi")) {
      document.getElementById("mainnavi").style.float = "left";
    }
      langButtonId[0].classList.add("active");
      langButtonId[1].classList.remove("active");
  
    }
    else {
        if (document.getElementById("mainnavi")) {
      document.getElementById("mainnavi").style.float = "right";
    }
      langButtonId[1].classList.add("active");
      langButtonId[0].classList.remove("active");
  
    }
  }