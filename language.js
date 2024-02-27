function setLanguage(language) {

    let langButtonId;
    langButtonId = document.getElementById("langselect").getElementsByTagName("button")
    if (language == 0) {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "left";
    }
      langButtonId[0].classList.add("active");
      langButtonId[1].classList.remove("active");
  
    }
    else {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "right";
    }
      langButtonId[1].classList.add("active");
      langButtonId[0].classList.remove("active");
  
    }
  }