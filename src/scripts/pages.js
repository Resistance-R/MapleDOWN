class Page
{
    constructor()
    {
        const page_count = CountPages();

        this.id = "page" + (page_count + 1);
        this.className = "page";
        this.contentEditable = true;
    }

    createElement() {
        const page_div = document.createElement("div");
        page_div.id = this.id;
        page_div.className = this.className;
        page_div.contentEditable = this.contentEditable;

        return page_div;
    }
}

function ModifyPageID()
{
    const pages_area = document.getElementById("pages-area");
    const pages = pages_area.getElementsByClassName("page");
    for(var i = 0; i < pages.length; i++)
    {
        pages[i].id = "page" + (i + 1);
    }
}

function MoveCursorToPage(pageDiv, cursorForward) //cursorForward: bool; ture is forward, and false is backward
{
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(pageDiv);
    range.collapse(cursorForward); //move starting point of 'range' (move cursor to forward or backward)
    selection.removeAllRanges();
    selection.addRange(range);
}

function CountPages() //function for returning total pages number
{
    const pages_area = document.getElementById("pages-area");
    let page_counter = pages_area.childElementCount;

    return page_counter;
}

function InitialAction() //function for case when 0 page
{
    if (CountPages() === 0) {
        const first_page = new Page();
        const first_page_element = first_page.createElement();

        document.getElementById("pages-area").appendChild(first_page_element);

        MoveCursorToPage(first_page_element, true);
    }

}

function AddPage() //function for adding page when page overflowed
{
    //inspecting overflow "pages-area" evey inputs
    document.getElementById("pages-area").addEventListener("input", (event) => {
        const curtent_page = event.target;
        
        //if overflow, add one page
        if (curtent_page.scrollHeight > curtent_page.clientHeight)
        {
            const new_page = new Page();
            const new_page_element = new_page.createElement();

            document.getElementById("pages-area").appendChild(new_page_element); //add page

            MoveCursorToPage(new_page_element, true);
        }
    });
}

function RemovePage() //function for removing page when push 'backspace' to empty that
{
    
    document.addEventListener("keydown", (event) => {
        let keycode = event.key;
        
        if (keycode === "Backspace")
        {
            const focused_page = document.activeElement;

            if (focused_page.classList.contains('page'))
            {
                if (focused_page.innerText.trim() === '') //check the content is empty
                { 
                    const prev_page = focused_page.previousElementSibling;
                    focused_page.remove();

                    if (CountPages() === 0)
                    {
                        InitialAction();
                    }

                    else
                    {
                        ModifyPageID();
                        MoveCursorToPage(prev_page, false);
                    }
                }
            }
        }
    });
}

window.onload = function() {
    InitialAction();
    AddPage();
    RemovePage();
};