function setLanguage(language) {

    let langId;
    langId = document.getElementById("langselect").getElementsByTagName("button")
    if (language == 0) {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "left";
    }
      langId[0].classList.add("active");
      langId[1].classList.remove("active");
  
    }
    else {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "right";
    }
      langId[1].classList.add("active");
      langId[0].classList.remove("active");
  
    }
  }