//Selectors
const inputTitle = document.querySelector(".builder__input-title");
const inputPriority = document.querySelector(".builder__input-priority");
const button = document.querySelector(".builder__add-btn");
const toggle = document.querySelector(".builder__toggle");
let title;
let priority = false;
let index = 0;

//Event listeners
inputTitle.oninput = handleInputText;
inputPriority.oninput = handleInputPriority;
button.addEventListener("click", addNewItem);
toggle.addEventListener("click", showModal);

//Functions
function handleInputText(e) {
    title = e.target.value;

    if (e.target.value.length > 0) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

function handleInputPriority(e) {
    priority = e.target.checked;
}

function sorter(a, b) {
    if (a.dataset.time < b.dataset.time) return -1;
    if (a.dataset.time > b.dataset.time) return 1;
    return 0;
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

function showModal() {
    if (isHidden(document.querySelector('.builder'))) {
        document.querySelector('.builder').style.display = "block"
    }
}

function updateCounters() {
    let notDoneList = document.querySelector("#not-done");
    let notDoneCounter = document.querySelector("#not-done .list__counter");
    let notDoneSlot = document.querySelector("#not-done .list__items-slot");
    let notDoneArray = notDoneSlot.getElementsByClassName("item");
    let notDoneCount = notDoneArray.length;
    console.log(notDoneCount);
    notDoneCounter.textContent = notDoneCount;
    if (notDoneCount > 0) {
        notDoneList.classList.remove("list--is-empty");
    } else {
        notDoneList.classList.add("list--is-empty");
    }

    
    let doneList = document.querySelector("#done");
    let doneCounter = document.querySelector("#done .list__counter");
    let doneSlot = document.querySelector("#done .list__items-slot");
    let doneArray = doneSlot.getElementsByClassName("item");
    let doneCount = doneArray.length;
    console.log(doneCount);
    doneCounter.textContent = doneCount;
    if (doneCount > 0) {
        doneList.classList.remove("list--is-empty");
    } else {
        doneList.classList.add("list--is-empty");
    }

    let recapDone = document.querySelector(".recap-counter__done");
    let recapTotal = document.querySelector(".recap-counter__total");
    recapDone.textContent = doneCount;
    recapTotal.textContent = parseInt(doneCount) + parseInt(notDoneCount);
}

function resetBuilder() {
    inputTitle.value = "";
    inputPriority.checked = false;
    priority = false;
    button.disabled = true;
}

function sortAndAppend(slotTarget, newItem) {
    let itemsCollection = slotTarget.getElementsByClassName("item");
    let itemsArray = [];
    let highPriority = [];
    let lowPriority = [];

    for (var i = 0; i < itemsCollection.length; ++i) {
        itemsArray.push(itemsCollection[i]);
    }

    itemsArray.push(newItem);
    itemsArray.forEach((element) => {
        if (element.dataset.priority === "true") {
            highPriority.push(element);
        } else {
            lowPriority.push(element);
        }
    });

    highPriority = highPriority.sort(sorter);
    lowPriority = lowPriority.sort(sorter);
    itemsArray = highPriority.concat(lowPriority);

    for (var i = 0; i < itemsArray.length; ++i) {
        slotTarget.append(itemsArray[i]);
    }
}

function changeList(e) {
    let newItem = e.target.closest(".item");
    let slotTarget;

    if (e.target.checked) {
        slotTarget = document.querySelector("#done .list__items-slot");
        sortAndAppend(slotTarget, newItem);
    } else {
        slotTarget = document.querySelector("#not-done .list__items-slot");
        sortAndAppend(slotTarget, newItem);
    }

    updateCounters();
}

function addNewItem() {
    let date = new Date();
    let listTarget = document.querySelector("#not-done");
    let slotTarget = listTarget.querySelector(".list__items-slot");
    let template = document.querySelector("#item-template");
    let newItem = template.content.cloneNode(true);
    index = index + 1;
    newItem.querySelector(".item").setAttribute("data-time", date.getTime());
    newItem.querySelector(".item").setAttribute("data-priority", priority);
    newItem.querySelector("input").setAttribute("id", "item__" + index);
    newItem.querySelector("label").setAttribute("for", "item__" + index);
    newItem.querySelector("label").textContent = title;

    //Add listeners
    newItem.querySelector("input").oninput = changeList;
    newItem
        .querySelector(".item__remove-btn")
        .addEventListener("click", removeItem);

    newItem = newItem.querySelector(".item");
    sortAndAppend(slotTarget, newItem);

    listTarget.classList.remove("list--is-empty");

    updateCounters();
    resetBuilder();
}

function removeItem(e) {
    let itemTarget = e.target.closest(".item");
    itemTarget.remove();
    index = index - 1;

    updateCounters();
}
