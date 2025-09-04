const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

function defaultFn() {
  const defaultFood = "chicken";
  searchFn(defaultFood);
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const userIn = document.getElementById("searchInput").value.trim();
  if (userIn !== "") {
    searchFn(userIn);
  } else {
    alert("Please enter a recipe name.");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("show-recipe-btn")) {
    const rId = event.target.getAttribute("data-id");
    modalFn(rId);
  }
  if (event.target.id === "closeBtn") {
    closeModalFn();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalFn();
  }
});

document.getElementById("recipeModal").addEventListener("click", (e) => {
  if (e.target.id === "recipeModal" || e.target.classList.contains("modal-overlay")) {
    closeModalFn();
  }
});

async function searchFn(query) {
  try {
    const url = `${apiUrl}${query}`;
    const res = await fetch(url);
    const tmp = await res.json();

    if (tmp.meals) {
      showRecpsFn(tmp.meals);
    } else {
      noRecFn();
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

function showRecpsFn(r) {
  const rCont = document.getElementById("recipeContainer");
  rCont.innerHTML = "";

  r.slice(0, 20).forEach((recipe) => {
    const c = document.createElement("article");
    c.className =
      "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1";
    c.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-40 object-cover ">
      <div class="p-1 text-left">
        <h3 class="text-lg font-bold text-gray-800 mb-2">${recipe.strMeal}</h3>
        <p class="text-sm text-gray-500 mb-1"><strong>Area:</strong> ${recipe.strArea}</p>
        <p class="text-sm text-gray-500 mb-3"><strong>Category:</strong> ${recipe.strCategory}</p>
        <button class="show-recipe-btn px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-pink-600 transition" 
                data-id="${recipe.idMeal}">
          Show Recipe
        </button>
      </div>
    `;
    rCont.appendChild(c);
  });

  if (r.length === 1) {
    rCont.firstChild.style.margin = "auto";
  }
}

function noRecFn() {
  const rCont = document.getElementById("recipeContainer");
  rCont.innerHTML = `<p class="text-red-600 font-semibold">No recipes found. Try another search!</p>`;
}

async function modalFn(recipeId) {
  const mData = document.getElementById("modalContent");
  mData.innerHTML = "";

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const data = await res.json();
    const rep = data.meals[0];

    mData.innerHTML = `
<div class="w-full max-h-[100vh] overflow-y-auto m-2 p-2">
  <h2 class="text-2xl font-bold mb-1">${rep.strMeal}</h2>
  <h3 class="text-lg font-semibold mb-4">Instructions:</h3>
  <p class="text-gray-700 leading-relaxed">${formatFn(rep.strInstructions)}</p>
  <button id="closeBtn" class="px-3 py-1 bg-orange-500 text-white text-sm rounded-2xl hover:bg-pink-600 transition">
      Close
  </button>
</div>`;

    document.getElementById("recipeModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
}
function formatFn(instructions) {
  // return instructions
  // .split("\r\n") 
  // .filter((instruction) => instruction.trim() !== "") 
  // .join("<br>");
  if (typeof instructions !== "string") return "";

  const steps = instructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return `<ol class="list-decimal pl-5 space-y-1">${steps
    .map((step) => `<li>${step}</li>`)
    .join("")}</ol>`;
}

function closeModalFn() {
  document.getElementById("recipeModal").classList.add("hidden");
}

defaultFn();
