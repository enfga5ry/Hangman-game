const letters = "abcdefghijklmnopqrstuvwxyz";
let lettersArray = Array.from(letters);

// console.log(lettersArray);

//select elements
let lettersContainer = document.querySelector(".letters");
let categoryToBeChosen = document.querySelector(".game-info .category span");

//generate letters
lettersArray.forEach((letter) => {
  let span = document.createElement("span");
  //create letter text node
  let theLetter = document.createTextNode(letter);

  span.appendChild(theLetter);
  span.className = "letter-box";
  lettersContainer.appendChild(span);
});

let myRequest = new XMLHttpRequest();
myRequest.open("GET", "../data.json");
myRequest.send();
myRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let words = JSON.parse(this.responseText);
    // console.log(words);

    let allKeys = Object.keys(words);

    // console.log(allKeys);

    let randomPropNumber = Math.floor(Math.random() * allKeys.length);
    // console.log(randomPropNumber);
    let randomPropName = allKeys[randomPropNumber];
    // console.log(words[randomPropName]);
    let randomPropValue = words[randomPropName];

    let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
    // console.log(randomPropValue);
    // console.log(randomValueNumber);
    // console.log(randomPropValue[randomValueNumber]);
    let randomValueText = randomPropValue[randomValueNumber];

    ////
    // show category chosen
    categoryToBeChosen.innerHTML = randomPropName;
    ////

    // select letters guess element
    let lettersGuessContainer = document.querySelector(".letters-guess");

    // convert chosen word to array
    let lettersAndSpace = Array.from(randomValueText.toLowerCase());
    // console.log(lettersAndSpace);

    lettersAndSpace.forEach((letter) => {
      let emptySpan = document.createElement("span");
      //if letter is space
      if (letter == " ") {
        emptySpan.className = "has-space";
      }

      lettersGuessContainer.appendChild(emptySpan);
    });

    // select all letters places
    let guessSpans = document.querySelectorAll(".letters-guess span");
    // set wrong attempts
    let wrongAttempts = 0;
    //select draw elements
    let theDraw = document.querySelector(".hangman-draw");
    //handle clicking on letters
    document.addEventListener("click", (e) => {
      //set the chose status
      let theStatus = false;

      if (e.target.className === "letter-box") {
        e.target.classList.add("clicked");

        //get clickedletter
        let theClickedLetter = e.target.innerHTML.toLowerCase();
        // console.log(theClickedLetter);
        // console.log(lettersAndSpace);

        lettersAndSpace.forEach((wordLetter, letterIndex) => {
          if (theClickedLetter == wordLetter) {
            theStatus = true;

            guessSpans[letterIndex].innerHTML = theClickedLetter;
          }
        });

        // console.log(theStatus);
        if (theStatus !== true) {
          wrongAttempts++;
          theDraw.classList.add(`wrong-${wrongAttempts}`);
          // console.log(wrongAttempts);

          //play fail sound
          document.getElementById("fail").play();
          if (wrongAttempts == 8) {
            endGame();

            lettersContainer.classList.add("finished");
          }
        } else {
          let ans =[];
          for(let i=0;i < randomValueText.length;i++) {
            ans.push(guessSpans[i].innerHTML);
            if(guessSpans[i].classList.contains("has-space")) {
              ans.push(" ");
            }
          }
          // console.log(ans.join(""));
          if (ans.join("") == randomValueText) {
            congratulations();

            lettersContainer.classList.add("finished");
          }

          document.getElementById("success").play();
        }
      }
    });

    //end game function

    function endGame() {
      let div = document.createElement("div");
      let divText = document.createTextNode(
        `Game Over The Word Is ${randomValueText}`
      );
      div.appendChild(divText);

      div.className = "popup";

      document.body.appendChild(div);
    }
    function congratulations() {
      let winDiv = document.createElement("div");
      let winDivText = document.createTextNode(`Congratulations You Win`);
      winDiv.appendChild(winDivText);

      winDiv.className = "winner";
      document.body.appendChild(winDiv);
    }
  }
};



