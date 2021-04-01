import { wordsAPI, solveAPI, wikitionaryAPI } from './api.js';
import { Expand } from './expand.js';

export function factorial(n){
  let answer = 1;
  if (n == 0 || n == 1){
    return answer;
  }else{
    for(var i = n; i >= 1; i--){
      answer = answer * i;
    }
    return answer;
  }  
}

export function getPermutations(letters) {
  // C(n, k)= n!/[k!( n-k)!]
  let promises = [];
  const n = letters.length;
  let permutationCount = 0;
  let permutationStrings = [];
  for (let k = 3; k <= n; k++) {
    const C = factorial(n)/(factorial(k)*factorial(n-k));
    permutationStrings.push([`${C}*${k}!`, `C(${n}, ${k})*${k}!`])
    permutationCount += C*factorial(k);
  }
  
  const formatter = new Intl.NumberFormat('en-US');
  const permutationsContainer = document.getElementById("permutations");
  permutationsContainer.innerHTML = /*html*/`
    <div>${permutationStrings.map(x => x[1]).join(" + ")}</div>
    <div>${permutationStrings.map(x => x[0]).join(" + ")}</div>
    <div>${formatter.format(permutationCount) + " permutations"}</div>
  `;
  return promises;
}

export function parseWikitionary(html) {
  // 
  const parser = new DOMParser();
  html = html.split("IPA<sup>(key)</sup>: ").join("");
  const doc = parser.parseFromString(html, "text/html");
  // doc.querySelectorAll("h2").forEach(e => console.log(e.innerHTML))
  Array.from(doc.querySelectorAll("*")).forEach(e => {
    if (e.innerText.trim() === "") {
      e.remove()
    }
  })
  let enSection = false;
  const filtered = Array.from(doc.getRootNode().body.childNodes).filter(el => {
    if (el.tagName === "H2") {
      enSection = el.innerText === "English";
    }
    return enSection && el.innerText !== ""
  })
  return filtered
}

export function main() {
  const solveForm = document.getElementById("solveForm");
  const resultsDiv = document.getElementById("results");
  const lettersInput = document.getElementById("lettersInput");
  const progressIndicator = document.getElementById("progressIndicatorResults");
  const wordContainer = document.getElementById("wordContainer");
  solveForm.onsubmit = (e) => {
    e.preventDefault();
    resultsDiv.innerHTML = ""
    resultsDiv.style.opacity = 0;
    progressIndicator.style.opacity = 1;
    const letters = lettersInput.value.trim();
    getPermutations(letters.split(""));
    solveAPI(letters).then(r => {
      progressIndicator.style.opacity = 0;
      resultsDiv.style.opacity = 1;
      const results = r.solution.filter(x => x.length > 2);
      Promise.all(results.map(word => wordsAPI(word))).then(res => res.map(r => {
        if (r.results) {
          return r;
        }
        else return null;
      })).then(l => l.filter(x => x)).then(l => l.filter((value, index, self) => {
        return self.map(x => x.word).indexOf(value.word) === index;
      })).then(l => l.filter(x => x.word.length > 2)).then(filtered => {
        resultsDiv.innerHTML = filtered.map((f, i) => /*html*/`<div index="${i}" title="${f.results[0].definition}" class="active">${f.word}</div>`).join("");
        document.querySelectorAll("#results > *").forEach(x => x.onclick = (el) => {
          document.querySelectorAll("#results > *").forEach(a => a.classList.remove("selected"));
          x.classList.add("selected");
          const idx = parseInt(x.getAttribute("index"));
          const f = filtered[idx];
          const word = x.innerHTML;
          wordContainer.innerHTML = /*html*/`
            <h2>${f.syllables.list.join("·")}</h2>
          `;
          wikitionaryAPI(word).then(r => {
            if (r.query.pages) {
              const html = Object.values(r.query.pages)[0].extract;
              var tmp = document.createElement("div");
              parseWikitionary(html).forEach(n => tmp.appendChild(n))
              Expand("expandContainer", {
                open: false,
                children: tmp.innerHTML,
                header: /*html*/`
                  <h2>${word} - wikitionary</h2>
                `
              })
            }
          });
        })
      });
    })
  }
}

main()