let cards_map = [];
let dictionary = {};
let choice1 = "";
let choice2 = "";
let score = 0;
let turns = 0;
const scorediv = document.getElementById("score");
const turnsdiv = document.getElementById("turns");
const resetbtn = document.getElementById("resetbtn");
const div = document.getElementById("stage");
const getwords = async (num) => {
  let words = await fetch(
    "https://random-word-api.herokuapp.com/word?number=200"
  )
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      return data;
    });

  let chosen_words = [];

  for (let i = 0; i < words.length; i++) {
    if (chosen_words.length >= num) {
      break;
    }
    let def = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + words[i]
    )
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        if (
          !data.title &&
          data[0].meanings[0].definitions[0].definition.length <= 200
        ) {
          return {
            has_definition: true,
            word: data[0].word,
            definition: data[0].meanings[0].definitions[0].definition
          };
        } else {
          return {
            has_definition: false
          };
        }
      });
    if (def.has_definition) {
      chosen_words.push({
        word: def.word,
        definition: def.definition
      });
    }
  }

  createpuzzle(chosen_words);
};

const createpuzzle = (wordslist) => {
  let allcards = [];

  for (let d = 0; d < wordslist.length; d++) {
    dictionary[wordslist[d].word] = wordslist[d].definition;
    allcards.push(wordslist[d].word);
    allcards.push(wordslist[d].definition);
  }

  allcards.sort(() => (Math.random() > 0.5 ? 1 : -1));

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  for (let i = 0; i < 3; i++) {
    let r = {};
    let row = document.createElement("div");
    row.classList.add("row");
    div.appendChild(row);
    for (let c = 0; c < 4; c++) {
      let card = document.createElement("div");
      card.classList.add("card");
      r[allcards[c + i * 4]] = card;
      card.addEventListener("click", () => {
        if (card.innerText === "") {
          if (choice1 === "") {
            card.classList.add('content')
            choice1 = allcards[c + i * 4];
            card.innerText = allcards[c + i * 4];
          } else if (choice2 === ""){
            card.classList.add('content')
            choice2 = allcards[c + i * 4];
            card.innerText = allcards[c + i * 4];

            const abc = () => {
              if (cards_map != []) {
                if (dictionary[choice1] === choice2 || dictionary[choice2] === choice1) {
                  score += 1;
                } else {
                  for (let b = 0; b < 3; b++) {
                    if (cards_map[b][choice1]) {
                      cards_map[b][choice1].innerText = "";
                     cards_map[b][choice1] .classList.remove('content')
                    }
                    if (cards_map[b][choice2]) {
                      cards_map[b][choice2].innerText = "";
                       cards_map[b][choice2] .classList.remove('content')
                    }
                  }
                }

                choice2 = "";
                choice1 = "";
                turns += 1;
                turnsdiv.innerText = 'Turns: ' + turns;
                scorediv.innerText = 'Score: ' + score;

                if (score === 6) {
                  alert('Congrats on beating the game!')
                  if (confirm('Would you like to play again?')) {
                  endgame()  
                  }
                }
              }
            };
            
            setTimeout(abc,2000)
          }
        }
      });
      row.appendChild(card);
    }
    cards_map.push(r);
  }
};

const endgame = () => {
  choice2 = "";
  choice1 = "";
  turns = 0;
  score = 0;
  turnsdiv.innerText = 'Turns: ' + turns;
  scorediv.innerText = 'Score: ' + score;
  cards_map = [];
  dictionary = {};
  getwords(6);
}

getwords(6);

resetbtn.addEventListener("click", endgame)