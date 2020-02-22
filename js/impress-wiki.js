"use strict";

let params = new URLSearchParams(location.search);
const defaults = {
  'user': 'ggstuart',
  'repo': 'impress-wiki',
  'file': 'Home'
}

for (const property in defaults) {
  if(!params.has(property)) {
    params.set(property, defaults[property])
  }
}

const root = `https://raw.githubusercontent.com/wiki/${params.get("user")}/${params.get("repo")}`
const url = `${root}/${params.get("file")}.md`;
const slides = document.querySelector("#impress");

function init() {
  fetch(url).then(function(response) {
    return response.text();
  }).then(loadMultiple).then(function(mds) {
    for(let md of mds) {
      const div = markdownSection(md);
      slides.appendChild(div);
    }
    let event = new Event('MarkdownPrepared');
    window.dispatchEvent(event);
  }).catch(function(err) {
    console.log("Fetch Error: ", err);
  });
}

async function loadMultiple(text) {
  const pattern = /=====wiki-links=====/i
  let links;
  [text, links] = text.split(pattern);
  if(links) {
    links = links.trim().split("\n");
  } else {
    links = [];
  }
  const promises = links.map(loadFile);
  return Promise.all([text].concat(promises));
}

function loadFile(name) {
  return fetch(`${root}/${name}.md`).then(function(response) {
    return response.text();
  }).then(function(text) {
    return text;
  }).catch(function(err) {
    console.log("Fetch Error: ", err);
  });
}

function markdownSection(text) {
  const div = document.createElement("div");
  div.classList.add('step');
  div.classList.add('markdown');
  div.setAttribute("data-rel-x", "1200");
  div.setAttribute("data-rel-y", "0");
  div.textContent = text;
  return div;
}

init();
