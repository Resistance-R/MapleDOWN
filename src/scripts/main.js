import { InitialAction, RemovePage } from './pages.js'
import { HandleOverflowRecursively, HandlePasting } from './overflow.js'
import { RemoveDiv } from './keyboard.js';

const pages_area = document.getElementById("pages-area");

window.onload = function () {
        InitialAction();
        RemovePage();
    };

pages_area.addEventListener("input", (event) => {
    const current_page = event.target;
    HandleOverflowRecursively(current_page);
});

pages_area.addEventListener("paste", (event) =>{
    HandlePasting();
});

pages_area.addEventListener("keydown", (event) => {
    const current_page = event.target;

    if (event.key === "Enter") {
        RemoveDiv(event);

        setTimeout(() => {
            HandleOverflowRecursively(current_page);
        }, 10);
    }
});