let btn = document.querySelector("#viz");
let stopBtn = document.querySelector("#stop");
let speedSlider = document.querySelector("#speed");

// Algorithm Title
let algTitle = document.querySelector("#sortType");

// ALGORITHM BUTTONS
let bubbleButton = document.getElementById("bubbleBtn");
let mergeButton = document.getElementById("mergeBtn");
let quickButton = document.getElementById("quickBtn");

// MAIN GRAPH DIV
let graph = document.querySelector(".inner");

// Global Stop Variable
let stop = false;

let curr = [];

// Global Active Alg Object
let activeAlg = {
  bubble: false,
  merge: false,
  quick: false,
};

// Initialize Active Algorithm to bubble
activateSort("bubble");
algTitle.innerHTML = "Bubble Sort";
bubbleButton.style.boxShadow = "0px 0px 20px 1px rgba(255, 96, 184, 0.8)";

// Make Each Alg button change the state of the active Alg object
bubbleButton.addEventListener("click", () => {
  activateSort("bubble");
  algTitle.innerHTML = bubbleButton.textContent;
  changeColor(bubbleButton, mergeButton, quickButton);
});

mergeButton.addEventListener("click", () => {
  activateSort("merge");
  algTitle.innerHTML = mergeButton.textContent;
  changeColor(mergeButton, bubbleButton, quickButton);
});

quickButton.addEventListener("click", () => {
  activateSort("quick");
  algTitle.innerHTML = quickButton.textContent;
  changeColor(quickButton, mergeButton, bubbleButton);
});

// STOP VISUALIZATION
stopBtn.addEventListener("click", () => {
  stop = true;
});

// START VISUALIZATION
btn.addEventListener("click", () => {
  stop = false;
  let numEls = document.querySelector("#choose").value;

  let bubbleDelayTimes = {
    "30": 25,
    "20": 60,
    "15": 75,
  };

  let mergeDelayTimes = {
    "30": 220,
    "20": 250,
    "15": 300,
  };

  let quickDelayTimes = {
    "30": 400,
    "20": 450,
    "15": 500,
  };

  let speed = speedSlider.value;
  let array = generateArray();

  let delay;
  let iterator;

  if (activeAlg["bubble"]) {
    delay = bubbleDelayTimes[`${numEls}`] / speed;
    iterator = bubbleSort(array);
  } else if (activeAlg["merge"]) {
    delay = mergeDelayTimes[`${numEls}`] / speed;
    iterator = mergeSort(array);
  } else if (activeAlg["quick"]) {
    curr = [];
    delay = quickDelayTimes[`${numEls}`] / speed;
    current = quickSort(array, 0, array.length - 1);
    iterator = quick(curr);
  }

  draw(array); // Initial draw before starting animation

  let intervalId = setInterval(() => {
    let next = iterator.next(); // pull from yield
    if (!next.done) {
      draw(next.value);
    } else {
      clearInterval(intervalId);
      document
        .querySelectorAll(".bar")
        .forEach((bar) => (bar.style.backgroundColor = "#41d6ff"));
    }
  }, delay);
});

// Function to change the global active algorithm object
function activateSort(alg) {
  activeAlg = {
    bubble: false,
    merge: false,
    quick: false,
  };
  activeAlg[alg] = true;
}

// Function to change button colors when picked
function changeColor(btn1, btn2, btn3) {
  btn1.style.boxShadow = "0px 0px 20px 1px rgba(255, 96, 184, 0.8)";
  btn2.style.boxShadow = "";
  btn3.style.boxShadow = "";
}

// --- DRAW FUNCTION ---
function draw(array) {
  graph.innerHTML = ''; // Clear previous content

  array.forEach((value) => {
    let bar = document.createElement("div");
    let val = document.createElement("h1");
    val.textContent = value;
    val.className = "arr-val";
    bar.className = "bar";
    bar.appendChild(val);
    bar.style.height = `${20 + value * 3}px`;
    bar.style.width = `${Math.round(350 / array.length)}px`;
    graph.appendChild(bar);
  });
}

// --- GENERATE RANDOM ARRAY ---
function generateArray() {
  let numEls = document.querySelector("#choose").value;
  let newArr = [];
  for (let i = 0; i < numEls; i++) {
    let foundUnique = false;
    while (foundUnique !== true) {
      let randNum = Math.round(Math.random() * 98) + 1;
      if (!newArr.includes(randNum)) {
        newArr.push(randNum);
        foundUnique = true;
      }
    }
  }

  if (isSorted(newArr)) {
    newArr = [];
    generateArray(numEls);
  }

  return newArr;
}

// --- HELPER TO SEE IF ARRAY IS CORRECTLY SORTED ---
function isSorted(newArr) {
  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i] > newArr[i + 1]) {
      return false;
    }
  }
  return true;
}

// --- BUBBLE SORT ---
function* bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
      yield array;
      if (stop) {
        return;
      }
    }
  }
}

// --- MERGE SORT ---
// Merge Sort Helper
function merge(A, temp, start, middle, last) {
  let k = start,
    i = start,
    j = middle + 1;

  while (i <= middle && j <= last) {
    if (A[i] < A[j]) {
      temp[k++] = A[i++];
    } else {
      temp[k++] = A[j++];
    }
  }

  while (i < A.length && i <= middle) {
    temp[k++] = A[i++];
  }

  for (i = start; i <= last; i++) {
    A[i] = temp[i];
  }
}

// Merge Sort Generator
function* mergeSort(A) {
  let low = 0,
    high = A.length - 1;

  let temp = A.slice();

  for (let m = 1; m <= high - low; m = 2 * m) {
    for (let i = low; i < high; i += 2 * m) {
      let start = i,
        mid = i + m - 1,
        last = Math.min(i + 2 * m - 1, high);

      merge(A, temp, start, mid, last);
      yield A;
      if (stop) {
        return;
      }
    }
  }
}

// --- QUICK SORT ---
function quickSort(arr, left, right) {
    var len = arr.length,
      pivot,
      partitionIndex;
  
    if (left < right) {
      pivot = right;
      partitionIndex = partition(arr, pivot, left, right);
  
      //sort left and right
      curr.push(arr.slice());
      quickSort(arr, left, partitionIndex - 1);
      quickSort(arr, partitionIndex + 1, right);
    }
  
    return arr;
  }
  
  function partition(arr, pivot, left, right) {
    var pivotValue = arr[pivot],
      partitionIndex = left;
  
    for (var i = left; i < right; i++) {
      if (arr[i] < pivotValue) {
        swap(arr, i, partitionIndex);
        partitionIndex++;
      }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
  }
  
  function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  function* quick(arr) {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i];
      if (stop == true) {
        return;
      }
    }
  }
