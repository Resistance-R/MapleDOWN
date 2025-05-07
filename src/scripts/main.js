import { InitialAction, AddPage, RemovePage } from './pages.js'
import { HandleOverflowRecursively } from './overflow.js'

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