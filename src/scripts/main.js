import { InitialAction, AddPage, RemovePage } from './pages.js'
import { HandleOverflowRecursively, HandlePasting } from './overflow.js'

const pages_area = document.getElementById("pages-area");

window.onload = function () {
        InitialAction();
        AddPage();
        RemovePage();
    };

pages_area.addEventListener("input", (event) => {
    const current_page = event.target;
    HandleOverflowRecursively(current_page);
});

pages_area.addEventListener("paste", (event) =>{
    HandlePasting();
});