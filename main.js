let sSims = [];
let isSimulationRunning = false;
let intervalId;
let simSpeed = 100;
let month = 0;
let year = 0;
let nameList = [];

let births = 0;
let deaths = 0;

let probabilityOfBirth = 0.8;
let childrenLimit = 3;

let initialPopulation; // Define the number of SSims
let minInitialAge = 20; // Minimum age
let maxInitialAge = 45; // Maximum age

async function importNames() {
  try {
    const response = await fetch("names.json"); // Replace 'names.json' with your JSON file path
    nameList = await response.json();
    console.log("Names loaded.");
  } catch (error) {
    console.error("Error fetching names:", error);
  }
}
importNames();

//SSim array

async function getRandomName() {
  // Ensure nameList is populated before generating a random name
  while (nameList.length === 0) {
    console.log("Waiting for names to load...");
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
  }

  return nameList[Math.floor(Math.random() * nameList.length)];
}

function getRandomSex() {
  let randomSex = Math.round(Math.random()); //0 is male 1 is female
  return randomSex;
}

function birthSSim() {
  return {
    name: getRandomName(),
    age: 0,
    sex: getRandomSex(),
    noOfChildren: 0,
    noOfChildrenDesired: Math.round(Math.random() * childrenLimit),
  };
}

//Simulation code

function startSimulation() {
  const millisecondsPerTick = 1000 / simSpeed;

  tick();

  intervalId = setInterval(tick, millisecondsPerTick);
}

//Main tick function

function tick() {
  year = Math.round(month / 12);
  console.log("Year: ", year, " Month: ", month);
  month++;

  // Iterate through the sSims array using a traditional for loop
  for (let i = sSims.length - 1; i >= 0; i--) {
    const sSim = sSims[i];

    // Age the simulated human by 0.0833333333333333
    sSim.age += 0.0833333333333333;

    // Check if the simulated human has reached 100 years (1200 months)
    if (sSim.age >= 85) {
      // Remove the simulated human from the array if age is 85 years (1200 months)
      sSims.splice(i, 1);
      deaths++;
    }

    // Check if the simulated ssim has reached 18 years (216 months)
    if (sSim.age >= 18 && sSim.age <= 60 && sSim.sex === 1) {
      // Only females have a chance at having a baby
      if (sSim.noOfChildrenDesired > sSim.noOfChildren) {
        // If the desired number of children is greater than the current number of children
        if (Math.random() < probabilityOfBirth) {
          // Add another ssim to the array with a random name and age 0
          sSims.push(birthSSim());
          sSim.noOfChildren++;
          births++;
        }
      }
    }
  }

  //   console.log(
  //     sSims,
  //     "Population: ",
  //     sSims.length,
  //     " Deaths: ",
  //     deaths,
  //     " Births: ",
  //     births
  //   );
  updateDisplay();
}

//Pause/play simulation

function pauseSimulation() {
  clearInterval(intervalId);
}

function toggleSimulation() {
  if (isSimulationRunning) {
    pauseSimulation();
    isSimulationRunning = false;
  } else {
    startSimulation();
    isSimulationRunning = true;
  }
}

//Inputs

// Function to update the 'Initial population' variable
function updateInitialPop() {
  const popInitInput = parseInt(
    document.getElementById("initialPopulation").value
  );

  // Check if the input is a valid number
  if (!isNaN(popInitInput)) {
    initialPopulation = popInitInput; // Update the 'Initial population' variable with the new value
    sSims = Array.from({ length: initialPopulation }, () => ({
      name: getRandomName(),
      age:
        Math.round(Math.random() * (maxInitialAge - minInitialAge)) +
        minInitialAge,
      sex: getRandomSex(),
      noOfChildren: 0,
      noOfChildrenDesired: Math.round(Math.random() * childrenLimit),
    }));
    toggleSimulation();
  } else {
    // Notify the user of an invalid input
    alert("Please enter a valid number");
  }
}

// Display the statistics in HTML

let popDisplay = document.getElementById("current-population");
let birthsDisplay = document.getElementById("current-births");
let deathsDisplay = document.getElementById("current-deaths");

let yearDisplay = document.getElementById("years-elapsed");
let monthDisplay = document.getElementById("months-elapsed");

function updateDisplay() {
  popDisplay.value = sSims.length;
  birthsDisplay.value = births;
  deathsDisplay.value = deaths;

  yearDisplay.value = year;
  monthDisplay.value = month;
}
