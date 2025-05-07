/* about adding/removing pages */

import { MoveCursorToPage } from './cursor.js'

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
    const pages = document.getElementById("pages-area").getElementsByClassName("page");
    for(var i = 0; i < pages.length; i++)
    {
        pages[i].id = "page" + (i + 1);
    }
}

function CountPages() //function for returning total pages number
{
    let page_counter = document.getElementById("pages-area").childElementCount;

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

function CreateAndAppendPage()
{
    const new_page = new Page();
    const new_page_element = new_page.createElement();
    document.getElementById("pages-area").appendChild(new_page_element);
    return new_page_element;
}

function AddPage() //function for adding page when page overflowed
{
    //inspecting overflow "pages-area" evey inputs
        document.getElementById("pages-area").addEventListener("input", (event) => {
            const curtent_page = event.target;
        
            //if overflow, add one page
            if (curtent_page.scrollHeight > curtent_page.clientHeight)
            {
                const new_page_element = CreateAndAppendPage();

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
                if (focused_page.innerHTML.trim() === '') //check the content is empty
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

export { AddPage, RemovePage, InitialAction, CreateAndAppendPage };