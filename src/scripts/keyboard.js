function RemoveDiv(page_event)
{
    /**
     * code to prevent `div` tag creation.
     */

    page_event.preventDefault();

    const br = document.createElement("br");
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(br);

    range.setStartAfter(br);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
}

export { RemoveDiv };