function setLanguage(language) {

    let buttonId;
    buttonId = document.getElementById("langselect").getElementsByTagName("button")
    if (language == 0) {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "left";
    }
      buttonId[0].classList.add("active");
      buttonId[1].classList.remove("active");
  
    }
    else {
        if (document.getElementById("hauptnavigation")) {
      document.getElementById("hauptnavigation").style.float = "right";
    }
      buttonId[1].classList.add("active");
      buttonId[0].classList.remove("active");
  
    }
  }