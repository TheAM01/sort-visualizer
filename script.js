// parameters

const barsParent = document.getElementById("bars-parent");
let barsSorted = [];
let barsAmount = 20;
let speedMultiplier = 51;
let bars = [];

let statusText = document.getElementById("status-text");
let statusIcon = document.getElementById("status-icon");

// slider for speed
const slider = document.getElementById("speed-multiplier");
slider.addEventListener("input", () => {
    speedMultiplier = parseInt(slider.value);
    document.getElementById("multiplier-value").innerText = speedMultiplier+"X";
});



// initialization of barsSorted and bars
for (let i = 0; i < barsAmount; i++) {

    let bar = element("div", "bar", {style: `height: ${(i+1)*(100/barsAmount)}%; width: calc(${100/barsAmount}% - 2px);`});

    bars.push(bar);
    barsSorted.push(bar);

}


// rendering initial bars
renderBars(bars);

function changeBars() {
    let bqt = parseInt(document.getElementById("bars-qty").value);
    barsSorted = [];
    bars = [];

    for (let i = 0; i < bqt; i++) {

        let bar = element("div", "bar", {style: `height: ${(i+1)*(100/bqt)}%; width: calc(${100/bqt}% - 2px);`});
    
        bars.push(bar);
        barsSorted.push(bar);
    
    }
    renderBars(bars);
}


// SORT FUNCTIONS

// skibidi shuffles the bars
async function shuffleBars() {

    statusText.innerText = "Shuffling..."
    addClass([statusIcon], "comparing")

    let currentIndex = bars.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        addClass([bars[currentIndex], bars[randomIndex]], "swapping");
        await sleep(1.5*speedMultiplier);

        [ bars[currentIndex], bars[randomIndex] ] = [ bars[randomIndex], bars[currentIndex] ];

        barsParent.innerHTML = "";
        bars.forEach(bar => barsParent.appendChild(bar));

        await sleep(1*speedMultiplier);
        removeClass([bars[currentIndex], bars[randomIndex]], "swapping");
    }

    statusText.innerText = "Shuffled ✅"
    removeClass([statusIcon], "comparing")
}


// checks if collection is sorted or not
async function isSorted(array, visually=false) {
    for (let i = 0; i < array.length - 1; i++) {
        if (getHeight(array[i]) > getHeight(array[i + 1])) {
            return false;
        }
    }

    if (visually) {
        for (let bar of array) {
            bar.classList.add("sorted");
        }
        await sleep(5*speedMultiplier);
        for (let bar of array) {
            bar.classList.remove("sorted");
        }
    }

    return true;
}


// bubble sort with visual effects
async function visualBubbleSort(array=bars, container=barsParent) {

    statusText.innerText = "Checking if already sort...";
    addClass([statusIcon], "comparing")


    if (await isSorted(array, true)) {
        statusText.innerText = "Bars are already sorted";
        removeClass([statusIcon], "comparing");
        addClass([statusIcon], "selected");
        
        setTimeout(() => {
            removeClass([statusIcon], "selected");
            statusText.innerText = "Ready to sort"
        }, 3*1000);

        return;
    };

    statusText.innerText = "Bubble sorting...";


    let n = array.length;

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n - i - 1; j++) {

            addClass([array[j], array[j + 1]], "comparing");
            await sleep(1*speedMultiplier);

            if (getHeight(array[j]) > getHeight(array[j + 1])) {

                addClass([array[j], array[j + 1]], "selected");
                await sleep(1*speedMultiplier);

                swapInDOM(array, j, j + 1, container);

                await sleep(1*speedMultiplier);
                removeClass([array[j], array[j + 1]], "selected");

            }

            removeClass([array[j], array[j + 1]], "comparing");

        }

        array[n - i - 1].classList.add("sorted");

    }

    await sleep(100*speedMultiplier+1000);
    removeClass(bars, "sorted");

    statusText.innerText = "Bubble sorted ✅"
    removeClass([statusIcon], "comparing")

}


// selection sort with visual effects
async function visualSelectionSort(array=bars, container=barsParent) {

    statusText.innerText = "Selection sorting..."
    addClass([statusIcon], "comparing")


    if (await isSorted(array, true)) {
        statusText.innerText = "Bars are already sorted";
        removeClass([statusIcon], "comparing");
        addClass([statusIcon], "selected");

        setTimeout(() => {
            removeClass([statusIcon], "selected");
            statusText.innerText = "Ready to sort"
        }, 3*1000);

        return;
    };

    let n = array.length;

    for (let i = 0; i < n; i++) {
        let minIndex = i;
        addClass([array[i]], "selected");

        for (let j = i + 1; j < n; j++) {
            
            addClass([array[j]], "comparing");
            await sleep(1*speedMultiplier);
            if (getHeight(array[j]) < getHeight(array[minIndex])) {
                minIndex = j;
            }
            removeClass([array[j]], "comparing");
        }

        if (minIndex !== i) {
            addClass([array[minIndex]], "selected");
            await sleep(150);
            swapInDOM(array, i, minIndex, container);
            await sleep(150);
            removeClass([array[minIndex]], "selected");
        }

        removeClass([array[i]], "selected");
        array[i].classList.add("sorted");
    }
    await sleep(100*speedMultiplier+1000)
    removeClass(array, "sorted")

    statusText.innerText = "Selection sorted ✅"
    removeClass([statusIcon], "comparing")

}

async function visualHeapSort(array = bars, container = barsParent) {
    statusText.innerText = "Heap sorting...";
    addClass([statusIcon], "comparing");

    if (await isSorted(array, true)) {
        statusText.innerText = "Bars are already sorted";
        removeClass([statusIcon], "comparing");
        addClass([statusIcon], "selected");

        setTimeout(() => {
            removeClass([statusIcon], "selected");
            statusText.innerText = "Ready to sort";
        }, 3 * 1000);

        return;
    }

    let n = array.length;

    // heapify function
    async function heapify(n, i) {
        let largest = i;
        let l = 2 * i + 1; // Left child
        let r = 2 * i + 2; // Right child

        // Ensure indices are within bounds before proceeding
        if (l < n) addClass([array[l]], "comparing");
        if (r < n) addClass([array[r]], "comparing");

        await sleep(1.5*speedMultiplier);

        // Compare left child
        if (l < n && getHeight(array[l]) > getHeight(array[largest])) {
            largest = l;
        }

        // Compare right child
        if (r < n && getHeight(array[r]) > getHeight(array[largest])) {
            largest = r;
        }

        // If largest is not the current node, swap them and recurse
        if (largest !== i) {
            addClass([array[i], array[largest]], "selected");
            await sleep(1.5*speedMultiplier);
            swapInDOM(array, i, largest, container);
            await sleep(1.5*speedMultiplier);
            removeClass([array[i], array[largest]], "selected");
            await heapify(n, largest);
        }

        // Remove classes from children after comparison
        if (l < n) removeClass([array[l]], "comparing");
        if (r < n) removeClass([array[r]], "comparing");
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        addClass([array[0], array[i]], "selected");
        await sleep(1.5*speedMultiplier);
        swapInDOM(array, 0, i, container);
        removeClass([array[0], array[i]], "selected");
        array[i].classList.add("sorted");
        await heapify(i, 0);
    }

    array[0].classList.add("sorted");
    
    statusText.innerText = "Heap sorted ✅";
    removeClass([statusIcon], "comparing");
    
    await sleep(100*speedMultiplier+1000)
    removeClass(bars, "comparing")
    removeClass(bars, "sorted")
}

async function visualInsertionSort(array = bars, container = barsParent) {
    statusText.innerText = "Insertion sorting...";
    addClass([statusIcon], "comparing");

    // Step 1: Clear all color classes
    removeClass(array, "selected");
    removeClass(array, "comparing");
    removeClass(array, "sorted");

    if (await isSorted(array, true)) {
        statusText.innerText = "Bars are already sorted";
        removeClass([statusIcon], "comparing");
        addClass([statusIcon], "selected");

        setTimeout(() => {
            removeClass([statusIcon], "selected");
            statusText.innerText = "Ready to sort";
        }, 3 * 1000);

        return;
    }

    let n = array.length;

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        // Highlight key as red (selected)
        addClass([key], "selected");

        // Mark the left portion as yellow (comparing)
        for (let k = 0; k < i; k++) {
            addClass([array[k]], "comparing");
        }

        await sleep(2*speedMultiplier);

        while (j >= 0 && getHeight(array[j]) > getHeight(key)) {
            // Swap visually and in array
            swapInDOM(array, j + 1, j, container);

            await sleep(2*speedMultiplier);
            j--;
        }

        // Remove all temp classes
        removeClass(array, "selected");
        removeClass(array, "comparing");
    }

    // Finally, mark all bars as sorted (green)
    addClass(array, "sorted");

    await sleep(100*speedMultiplier+1000);
    removeClass(array, "sorted")

    statusText.innerText = "Insertion sorted ✅";
    removeClass([statusIcon], "comparing");
}





// HELPER FUNCTIONS

// function that renders bars for initialization and reset
async function renderBars(barCollection) {

    bars = barCollection;
    barsParent.innerHTML = "";

    for (let i = 0; i < barCollection.length; i++) {
        barsParent.appendChild(barCollection[i]);
        await sleep(0.5 * speedMultiplier);
    }
    
}


// returns heights in pixels of a certain element
function getHeight(bar) {
    return parseInt(bar.style.height);
}


// adds a certain className
function addClass(items, className) {
    items.forEach(bar => bar.classList.add(className));
}


// renmoves a certain className
function removeClass(items, className) {
    items.forEach(bar => bar.classList.remove(className));
}


// swaps 2 bars of provided array in DOM within provided container
function swapInDOM(array, i, j, container) {
    [array[i], array[j]] = [array[j], array[i]];
    container.innerHTML = "";
    array.forEach(bar => container.appendChild(bar));
}


// sleeps, waits, adds a delay for provided miliseconds
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// creates an HTML DOM Element
function element(name, className, attributes, innerText) {

	const element = document.createElement(name);
	element.setAttribute("class", className);

	if (attributes) {

		Object.keys(attributes).forEach(attr => {
			element.setAttribute(attr, attributes[attr]);
		});

	}

	if (!!innerText) {
		element.innerText = innerText;
	}

	return element;

}

// EXTRA


// dsa project