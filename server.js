const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");

const wordsAlpha = fs.readFileSync("words_alpha.txt").toString().split(/\r|\n/).filter(x => x);

function getContentType(filePath) {
  const extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".wav":
      contentType = "audio/wav";
      break;
  }
  return contentType;
}

function solver(letters) {
  const solution = []
  wordsAlpha.forEach(word => {
    exploded = word.split("")
    letters.forEach(l => {
      if (exploded.includes(l))
        exploded.splice(exploded.indexOf(l), 1)
    })
    if (exploded.length === 0) {
      solution.push(word)
    }
  })
  return solution;
}

const server = http.createServer((req, res) => {
  req.on("error", (err) => {
    console.error(err);
    res.statusCode = 400;
    res.end("400: Bad Request");
    return;
  });

  console.log("[request] " + req.url);

  const filePath = "./" + req.url;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const parsed = url.parse(req.url, true);
      if (parsed.pathname === "/api/query" && req.method === "GET") {
        const word = parsed.query.word;
        const exists = wordsAlpha.includes(word);
        res.setHeader('Content-Type', "application/json");
        res.end(JSON.stringify({
          word,
          exists
        }))
      }
      else if (parsed.pathname === "/api/solve" && req.method === "GET") {
        const letters = parsed.query.letters;
        const solution = solver(letters.split(""));
        res.setHeader('Content-Type', "application/json");
        res.end(JSON.stringify({
          letters,
          solution
        }))
      } 
      else {
        res.statusCode = 404;
        res.end("404: File Not Found");
      }
    } else {
      // NOTE: The file name could be parsed to determine the
      // appropriate data type to return. This is just a quick
      // example.
      const contentType = getContentType(filePath);
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
});

server.listen(80, () => {
  console.log("Server listening on port 80");
});
