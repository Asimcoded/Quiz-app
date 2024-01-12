const root = document.querySelector(":root");
const darkLightToggle = document.getElementById("darkLightToggle");
const headerElement = document.querySelector("header");
const mainElement = document.querySelector("main");
const container = createAndAppendElement(mainElement, "div", "container");
const totalQuestion = 10;
let questionCount = 0;
let correctAnswer = "", correctScore = 0;

const homePageHTML = `<div class="title-box"><h1>Welcome to the</h1><h1 class="title">Knowledge Quiz</h1><p>Pick up the category</p></div><ul class="category"><li data-category="food_and_drink"><img src="asset/food_and_drink.svg" alt=""><span>Food and Drink</span></li><li data-category="science"><img src="asset/science.svg" alt=""><span>Science</span></li><li data-category="general_knowledge"><img src="asset/general_knowledge.svg" alt=""><span>General Knowledge</span></li><li data-category="sport_and_leisure"><img src="asset/sport_and_leisure.svg" alt=""><span>Sports</span></li><li data-category=""><img src="asset/random-icon.svg" alt=""><span>Random</span></li></ul>`;
container.innerHTML = homePageHTML;

const questionArea = createAndAppendElement(container, "div", "title-box");
const optionList = createAndAppendElement(container, "ul", "optionBox");
const checkBtn = createAndAppendElement(optionList, "button", "btn", "Submit");
const reAgain = createAndAppendElement(optionList, "button", "btn", "Play again");

const catogaryList = document.querySelector(".category");
let category;

catogaryList.addEventListener("click", (e) => {
    category = (e.srcElement.localName === 'li') ? e.target.getAttribute('data-category') : e.target.parentElement.getAttribute("data-category");
    getData(category);
});

async function getData(category) {
    const apiUrl = "https://the-trivia-api.com/v2/questions?limit=1&";
    const response = await fetch((category === '') ? apiUrl : apiUrl + "categories=" + category);
    const data = await response.json();
    displayQuestionAndOptions(data);
    updateCategoryHeader(data[0].category);
}

function updateCategoryHeader(categoryName) {
    const imgCat = createAndAppendElement(headerElement, "img", "", "", "asset/" + (categoryName === '' ? "random-icon" : categoryName) + ".svg");
    const categoryHeader = createAndAppendElement(headerElement, "div", "category-title");
    const span = createAndAppendElement(categoryHeader, "span", "", "", categoryName.charAt(0).toUpperCase() + categoryName.slice(1));
}

function createAndAppendElement(parent, elementType, className = "", textContent = "", src = "") {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = textContent;
    element.src = src;
    parent.appendChild(element);
    return element;
}

function eventListener() {
    checkBtn.addEventListener("click", checkAnswer);
    reAgain.addEventListener("click", () => window.location.reload());
}

eventListener();

function displayQuestionAndOptions(arr) {
    checkBtn.disabled = false;
    const question = arr[0].question.text;
    questionArea.innerHTML = `<p>Question ${questionCount + 1} out of 10</p><h1>${question}</h1>`;
    
    correctAnswer = arr[0].correctAnswer;
    const incorrectAnswer = arr[0].incorrectAnswers;
    const optionsList = [...incorrectAnswer, correctAnswer];
    optionsList.sort(() => Math.random() - 0.5);
    
    optionList.innerHTML = optionsList.map((element, index) => `<li><span class="index">${index + 1}</span><span class="option">${element}</span></li>`);
    
    optionList.appendChild(checkBtn);
    container.innerHTML = "";
    container.append(questionArea, optionList);
    selectOption();
}

function selectOption() {
    optionList.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            optionList.querySelector(".selected")?.classList.remove("selected");
            option.classList.add("selected");
        });
    });
}

function checkAnswer() {
    checkBtn.disabled = true;
    const text = createAndAppendElement(optionList, "p", "error", "Please select an option");
    
    if (!optionList.querySelector(".selected")) {
        checkBtn.disabled = false;
    } else {
        const selectedAnswer = optionList.querySelector(".selected .option").textContent;
        if (selectedAnswer == correctAnswer) {
            correctScore++;
        }
        checkCount();
    }
}

function endScreen() {
    headerElement.removeChild(headerElement.lastChild);
    questionArea.innerHTML = `<h1>Quiz completed</h1><h1 class="title">Your score is .....</h1>`;
    
    const scoreArea = createAndAppendElement(container, "div", "score-area");
    const scoreBox = createAndAppendElement(scoreArea, "div", "score-box");
    const scoreH1 = createAndAppendElement(scoreBox, "h1", "", correctScore);
    const scoreP = createAndAppendElement(scoreBox, "p", "", "out of 10");
    
    scoreArea.appendChild(reAgain);
    container.innerHTML = "";
    container.append(questionArea, scoreArea);
}

function checkCount() {
    questionCount++;
    if (questionCount !== totalQuestion) {
        getData(category);
    } else {
        endScreen();
    }
}
