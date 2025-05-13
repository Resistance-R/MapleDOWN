/* manage text overflow */

import { InsertCursorMarker, RestoreCursorToMarker } from './cursor.js'
import { CreateAndAppendPage } from './pages.js';

/* about text overflowing */
/* 생각
    1. 중간에 텍스트가 삽입되었는데, 텍스트가 페이지에서 넘치면
        -> 넘친 텍스트가 다음 페이지로 옮겨가기 (done)
    2. 중간에 텍스트가 제거되었는데, 텍스트가 이전 페이지로 돌아 갈 수 있으면
        -> 텍스트가 이전 페이지로 돌아가기
            -> 텍스트가 이전 페이지로 돌아갔는데, 페이지에 어떠한 텍스트도 없으면 페이지 삭제 */

function SplitTextByHeight(page_div)
{
    InsertCursorMarker();

    const marker_element = document.getElementById("cursor-marker");
    if (!marker_element) {
        console.warn("No cursor marker found. Aborting split.");
        return "";
    }

    //step 1: copy all
    const full_clone = page_div.cloneNode(true);

    //step 2: finding the state with the most childNodes with binary search
    const original_nodes = Array.from(full_clone.childNodes);
    let low = 0;
    let high = original_nodes.length;
    let best_index = -1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        page_div.innerHTML = ""; //initialize
        for (let i = 0; i < mid; i++) {
            page_div.appendChild(original_nodes[i].cloneNode(true));
        }

        if (page_div.scrollHeight <= page_div.clientHeight + 1) {
            best_index = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    //step 3: making up complete page
    page_div.innerHTML = "";
    for (let i = 0; i < best_index; i++) {
        page_div.appendChild(original_nodes[i].cloneNode(true));
    }

    RestoreCursorToMarker();

    //Step 4: split overflow text
    let overflow_text = "";
    for (let i = best_index; i < original_nodes.length; i++) {
        const wrapper = document.createElement("div");
        wrapper.appendChild(original_nodes[i].cloneNode(true));
        overflow_text += wrapper.innerHTML;
    }

    return overflow_text;
}

function HandleOverflowRecursively(page_div, depth = 0) {

    if (depth > 20) //defense against infinite recursive calls
    {
        console.warn("Too much overflow recursion. Aborting to prevent crash.");
        return;
    }

    if (page_div.scrollHeight <= page_div.clientHeight) {
        return; //recursuve function ends here
    }

    const overflow_text = SplitTextByHeight(page_div);

    let next_page = page_div.nextElementSibling;

    if (!next_page) {
        next_page = CreateAndAppendPage();
    }

    if (!overflow_text || overflow_text.trim() === "") //defense against infinite recursive calls
    {
        return;
    }

    //edit overflowed text on forward of next page
    next_page.innerHTML = overflow_text + next_page.innerHTML;

    //inspecting next page is overflowed
    HandleOverflowRecursively(next_page, depth + 1);
}

function HandlePasting()
{
    /**
     * [WARN!] this function performs an undo on paste to preserve the document formatting.
     * code `document.execCommand("undo");` undo the DOM automatically.
     * 
     * this is currently the simplest and most reliable way to work, but `execCommand()' is deprecated.
     * so, that is likely to be removed from browsers in the future.
     */
    
    InsertCursorMarker()

    setTimeout(() => {
        document.execCommand("undo");
        HandleOverflowRecursively(page_div);
    }, 20);

    RestoreCursorToMarker()
}

export { SplitTextByHeight, HandleOverflowRecursively, HandlePasting };