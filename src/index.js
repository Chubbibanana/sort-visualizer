let renderArray1;
let renderArray2;
// give for value of input array-length
let length;
var svg1 = d3
  .select(".svgs")
  .append("svg")
  .attr("height", "200")
  .attr("width", "400")
  .attr("fill", "#222222");
var svg2 = d3
  .select(".svgs")
  .append("svg")
  .attr("height", "200")
  .attr("width", "400")
  .attr("fill", "#222222");

let selected1 = [];
let selected2 = [];

let current1;
let current2;

// add comparisons

// BUTTONS
document.getElementById("array-gen").addEventListener("click", function() {
    length = document.getElementById("array-length").value;
    setup();
});

document.getElementById("array-sort").addEventListener("click", function () {
  const sort1 = document.getElementById("sort-1").value;
  const sort2 = document.getElementById("sort-2").value;
  switch (sort1) {
    case "bubble":
      bubble(renderArray1, 1);
      break;
    case "insertion":
      insertion(renderArray1, 1);
      break;
    case "merge":
      mergeSort(renderArray1, 1);
      break;
    case "quick":
      quickSort(renderArray1, 0, length - 1, 1);
      break;
    case "selection":
      selection(renderArray1, 1);
      break;
  };
  switch (sort2) {
    case "bubble":
      bubble(renderArray2, 2);
      break;
    case "insertion":
      insertion(renderArray2, 2);
      break;
    case "merge":
      mergeSort(renderArray2, 2);
      break;
    case "quick":
      quickSort(renderArray2, 0, length - 1, 1);
      break;
    case "selection":
      selection(renderArray2, 2);
      break;
  }
})

function setup() {
    // prepare for draw

    length = length || 30;
    selected1 = [];
    selected2 = [];
    current1 = null;
    current2 = null;
    renderArray1 = [];
    renderArray2 = [];
  for (let i = 0; i < length; i++) {
    let num = Math.floor(Math.random() * 99 + 1);
    renderArray1.push(num);
    renderArray2.push(num);
  }
}

function draw() {
    // reset 
    svg1.selectAll("*").remove();
    svg2.selectAll("*").remove();

  svg1
    .selectAll("rect")
    .data(renderArray1)
    .enter()
    .append("rect")
    .attr("fill", function (d, i) {
        return current1 === i
          ? "#EF0096"
          : selected1.includes(i)
          ? "#009FFA"
          : "#777777";
    })
    .attr("height", function (d, i) {
        return d * 2;
    })
    .attr("width", `${200 / length}`)
    .attr("x", function (d, i) {
        return 400 / length * (i) + 100 / length;
    })
    .attr("y", function (d, i) {
        return 200 - (d * 2);
    });

  svg2
    .selectAll("rect")
    .data(renderArray2)
    .enter()
    .append("rect")
    .attr("fill", function (d, i) {
      return current2 === i
        ? "#EF0096"
        : selected2.includes(i)
        ? "#009FFA"
        : "#777777";
    })
    .attr("height", function (d, i) {
      return d * 2;
    })
    .attr("width", `${200 / length}`)
    .attr("x", function (d, i) {
      return (400 / length) * i + 100 / length;
    })
    .attr("y", function (d, i) {
      return 200 - d * 2;
    });
}

// bubble

async function bubble(arr, type) {
  let sorted = false;
  let timeout = document.getElementById("sort-speed").value
  while (!sorted) {
    sorted = true;
    selected1 = [];
    selected2 = [];
    for (let i = 0; i < arr.length - 1; i++) {
      switch(type) {
        case 1:
          selected1.push(i);
          break
        case 2:
          selected2.push(i);
      }
        if (arr[i + 1] < arr[i]) {
            // swap
            switch(type) {
              case 1:
                current1 = i + 1;
                break
              case 2:
                current2 = i + 1;
                break;
            }
          // selected2.push(i);
            [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
            
            sorted = false;
            await sleep(1000/(10 * timeout));
      }
    }
  }
  return arr;
}

// insertion

async function insertion(arr, type) {
let timeout = document.getElementById("sort-speed").value;
  for (let i = 1; i < arr.length; i++) {
    selected = [];
    let j;
    let temp = arr[i]; // will mutate so need to assign to var
    for (j = i - 1; j >= 0 && arr[j] > temp; j--) {
      current = null;
      arr[j + 1] = arr[j];
      selected.push(j + 1);
      current = j + 1;
      await sleep(1000/(10 * timeout));
    }
    arr[j + 1] = temp;
  }

  return arr;
}

// merge 
// needed bottom up iterative implementation
// credit to https://blog.benoitvallon.com/sorting-algorithms-in-javascript/the-merge-sort-algorithm/

async function mergeSort(array, type) {
  var step = 1;
  while (step < array.length) {
    var left = 0;
    while (left + step < array.length) {
      await merge(array, left, step);
      left += step * 2;
    }
    step *= 2;
  }
  return array;
}

async function merge(array, left, step, type) {
  let timeout = document.getElementById("sort-speed").value;
  var right = left + step;
  var end = Math.min(left + step * 2 - 1, array.length - 1);
  var leftMoving = left;
  var rightMoving = right;
  var temp = [];
  selected = [];
  for (var i = left; i <= end; i++) {
    selected.push(i);
    current = i;
    if (
      (array[leftMoving] <= array[rightMoving] || rightMoving > end) &&
      leftMoving < right
    ) {
      temp[i] = array[leftMoving];
      leftMoving++;
    } else {
      temp[i] = array[rightMoving];
      rightMoving++;
    }
    // await sleep(1000 / (10 * timeout));
  }

  for (var j = left; j <= end; j++) {
    selected.push(j);
    current = j;
    array[j] = temp[j];
    await sleep(1000 / (10 * timeout));
  }
}

// quicksort 

async function quickSort(arr, start = 0, end = arr.length - 1, type) {
  if (start >= end) {
    return;
  }

  let idx = await partition(arr, start, end);

  await quickSort(arr, start, idx - 1);
  await quickSort(arr, idx + 1, end);
  return arr;
}

async function partition(arr, start, end, type) {
    let timeout = document.getElementById("sort-speed").value;
  // last element as pivot
  const pivot = arr[end];
  let pivotIdx = start;
  selected = [];
  for (let i = start; i < end; i++) {
    if (arr[i] < pivot) {
      // swap elements
      [arr[i], arr[pivotIdx]] = [arr[pivotIdx], arr[i]];
    //   selected = Array.from(new Array(pivotIdx - i + 1));
        selected.push(i, pivotIdx);
        current = i;
      // move to next ele
        pivotIdx++;
        await sleep(1000 / (10 * timeout));
    }
  }
  
  // pivot value in middle
  [arr[pivotIdx], arr[end]] = [arr[end], arr[pivotIdx]];
  await sleep(1000 / (10 * timeout));
  return pivotIdx;
}

// selection

async function selection(arr, type) {
  // find minimum, put at beginning. reverse bubblesort
  let timeout = document.getElementById("sort-speed").value;
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    selected = [];
    current = null;
    for (let j = i + 1; j < arr.length; j++) {
        selected.push(j);
        await sleep(1000/(10 * timeout));
        if (arr[j] < arr[min]) {
          min = j;
          current = j;
          await sleep(1000/(10 * timeout));
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];

    }
  }
  return arr;
}


// credit to user Dan Dascalescu https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




