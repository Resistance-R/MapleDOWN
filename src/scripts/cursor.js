/* remember and restore cursor */

function InsertCursorMarker() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) //if user does NOT select anything
    {
        return;
    }

    const range = selection.getRangeAt(0);
    const marker = document.createElement("span");

    //define `marker`
    marker.id = "cursor-marker";
    marker.style.display = "inline-block"
    marker.style.width = '0';
    marker.style.height = "1em";
    marker.style.pointerEvents = "none";
    marker.setAttribute("data-marker", "true");

    //insert
    range.insertNode(marker);
}

function RestoreCursorToMarker() {
    const marker = document.getElementById("cursor-marker");

    if (!marker) {
        return;
    }

    const range = document.createRange();
    const selection = window.getSelection();

    range.setStartAfter(marker);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    marker.scrollIntoView({ behavior: "smooth", block: "center" }); //smooth scroll the page that cursor is

    //remove marker
    marker.remove();
}

/* move cursor */

function MoveCursorToPage(page_div, cursor_forward) //cursorForward: bool; ture is forward, and false is backward
{
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(page_div);
    range.collapse(cursor_forward); //move starting point of 'range' (move cursor to forward or backward)
    selection.removeAllRanges();
    selection.addRange(range);
}

export { InsertCursorMarker, RestoreCursorToMarker, MoveCursorToPage };