/* manage text overflow */

import { InsertCursorMarker, RestoreCursorToMarker } from './cursor.js'
import { CreateAndAppendPage } from './pages.js';

/* about text overflowing */
/* 생각
    1. 중간에 텍스트가 삽입되었는데, 텍스트가 페이지에서 넘치면
        -> 넘친 텍스트가 다음 페이지로 옮겨가기 <- 이거 하다가 커서가 위로 올라가는 문제 발견. 해결 요함.
                                            (아마도 커서 위치 기억하면 될 것 같긴 한데)

    2. 중간에 텍스트가 제거되었는데, 텍스트가 이전 페이지로 돌아 갈 수 있으면
        -> 텍스트가 이전 페이지로 돌아가기
            -> 텍스트가 이전 페이지로 돌아갔는데, 페이지에 어떠한 텍스트도 없으면 페이지 삭제 */

/* The principe of memorize cursor position:
    1. get user's cursor position
    2. insert the HTML tag: `<span id="cursor-marker">` at that position
    3. modify HTML
    4. find tag: `<span>`
    5. remove tag: `<span>` */

function SplitTextByHeight(page_div) {
    InsertCursorMarker();

    //save full HTML include `marker`
    const original_text = page_div.innerHTML;

    const marker_element = document.getElementById("cursor-marker");
    const marker_html = marker_element?.outerHTML || "";
    const marker_start = original_text.indexOf(marker_html);


    if (marker_start === -1) {
        console.warn("marker not found! fallback to original behavior.");
        return "";
    }

    //set range for binary search
    let low = marker_start + marker_html.length;;
    let high = original_text.length;

    //value for the best cut point
    let best_fit = '';

    let last_valid_mid = -1;

    //binary search: search the best point that able to include text
    while (low <= high) {
        const mid = Math.floor((low + high) / 2); //calculate middle point
        page_div.innerHTML = original_text.slice(0, mid); //cut to length of `mid` and try to add on the page

        //not overflowed(== able to try more text)
        if (page_div.scrollHeight <= page_div.clientHeight) {
            best_fit = original_text.slice(0, mid); //text save
            last_valid_mid = mid;
            low = mid + 1;
        }

        //overflowed
        else {
            high = mid - 1; //too long; try shorter
        }
    }

    //calculate overflowed text(== from backward of `best_fit` to end of text)
    const overflow_text = original_text.slice(best_fit.length);

    if (
        last_valid_mid === -1 ||
        overflow_text.trim() === "" ||
        overflow_text.length > original_text.length * 0.95 // 95% 이상 그대로?
    ) {
        console.warn("Split failed or ineffective; skipping overflow handling");
        return "";
    }

    //remain cut text in current page
    page_div.innerHTML = best_fit;

    RestoreCursorToMarker();

    // return overflowed text -> to use to move next page
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

export { SplitTextByHeight, HandleOverflowRecursively };