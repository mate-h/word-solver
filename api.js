export function guid() {
  return Math.random().toString(36).substr(2, 9)
}

export function solveAPI(word) {
  return fetch(`http://localhost/api/solve?letters=${word}`)
    .then(r => r.json())
}

export function wordsAPI(word) {
  return fetch(`https://cors-proxy.mateh.workers.dev/?https://www.wordsapi.com/mashape/words/${word}?when=2021-03-31T03:11:16.531Z&encrypted=8cfdb18be722909be99007bfec58bfb8aeb12b0935fc96b8`)
    .then(r => r.json())
}

export function wikitionaryAPI(word) {
  // https://en.wiktionary.org/w/api.php?action=query&prop=extracts&titles=reen&format=json
  return fetch(`https://cors-proxy.mateh.workers.dev/?https://en.wiktionary.org/w/api.php?action=query&prop=extracts&titles=${word}&format=json`)
    .then(r => r.json())
}