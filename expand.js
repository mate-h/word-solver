import { guid } from "./api.js";

const id = guid();
export default function render(props) {
  let { open, children, header } = props;
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    const h = el.querySelector(".header").clientHeight;
    el.style["--h"] = h;
    document.querySelector(`#${id} > .header`).onclick = () => {
      Expand({...props, open: !open})
    }
  })
  const tooltip = open ? "Collapse" : "Expand";
  return /*html*/`
    <style>
      #${id} {
        height: var(--h);
        overflow: hidden;
      }
      #${id}.open {
        height: auto;
      }
      #${id} > .children {
        display: none;
        opacity: 0;
        transition: opacity 75ms linear;
      }
      #${id}.open > .children {
        opacity: 1;
        display: block;
      }
      #${id} > .header {
        height: auto;
        position: relative;
      }
      #${id} > .header::after {
        content: "";
        position: absolute;
        right: 0.5rem;
        top: 0.675rem;
        width: 1rem;
        height: 1rem;
        opacity: 0.54;
        background-repeat: no-repeat;
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="5.479 -47.588 38.113 21.936" xmlns="http://www.w3.org/2000/svg"><path d="M24.557-25.652c.372 0 .723-.072 1.052-.215.33-.143.638-.365.924-.666l16.328-16.715a2.4 2.4 0 00.73-1.762c0-.487-.11-.924-.332-1.31a2.51 2.51 0 00-2.202-1.268c-.702 0-1.318.258-1.848.774L23.504-30.68h2.084L9.86-46.814c-.53-.516-1.146-.774-1.847-.774-.473 0-.9.115-1.279.344-.38.23-.684.537-.913.924-.229.386-.344.823-.344 1.31 0 .344.061.663.183.956.122.294.304.57.548.828l16.328 16.693c.602.587 1.275.88 2.02.88z"/></svg>');
      }
      #${id}.open > .header::after {
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="5.479 -49.199 38.113 21.957" xmlns="http://www.w3.org/2000/svg"><path d="M6.209-31.582l16.328-16.715c.573-.601 1.246-.902 2.02-.902.372.014.723.097 1.052.247.33.15.638.369.924.655l16.328 16.715c.487.473.73 1.067.73 1.783 0 .473-.11.903-.332 1.29a2.51 2.51 0 01-2.202 1.267c-.73 0-1.347-.258-1.848-.774L23.504-44.129h2.084L9.86-28.016c-.487.516-1.103.774-1.847.774-.473 0-.9-.115-1.279-.344a2.624 2.624 0 01-.913-.924 2.481 2.481 0 01-.344-1.289c0-.344.061-.67.183-.977a2.21 2.21 0 01.548-.806z"/></svg>');
      }
    </style>
    <div id="${id}" class="${open ? "open" : ""}">
      <div title="${tooltip}" class="active header">
        ${header || ""}
      </div>
      <div class="children">
        ${children}
      </div>
    </div>
  `;
}

export function Expand(id, props) {
  const el = document.getElementById(id)
  el.innerHTML = render(props)
}