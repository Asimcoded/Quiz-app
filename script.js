const root = document.querySelector(":root")
const darkLightToggle = document.getElementById("darkLightToggle");
darkLightToggle.addEventListener("click", () => {
    if (darkLightToggle.checked) {
        root.style.setProperty('--text', '#fff');
        root.style.setProperty('--bg', '#220135');
        root.style.setProperty('--mixed', '#3d1f58');
        document.getElementById("moon").setAttribute("src", "asset/moon-white.svg");
        document.getElementById("sun").setAttribute("src", "asset/sun-white.svg");
    }
    else {
        root.style.setProperty('--text', '#000');
        root.style.setProperty('--bg', '#fbfaff');
        root.style.setProperty('--mixed', '#fbeeff');
        document.getElementById("moon").setAttribute("src", "asset/moon-black.svg");
        document.getElementById("sun").setAttribute("src", "asset/sun-black.svg");
    }
})
const headerElement = document.querySelector("header");
const mainElement = document.querySelector("main");
const container = document.createElement("div")
const totalQuestion = 10;
let questionCount=0;
let correctAnswer = "",correctScore = 0;
container.className = "container";
const homePageHTML = `<div class="title-box"><h1>Welcome to the</h1><h1 class="title">Knowledge Quiz</h1><p>Pick up the category</p></div><ul class="category"><li data-category="food_and_drink"><img src="asset/food_and_drink.svg" alt=""><span>Food and Drink</span></li><li data-category="science"><img src="asset/science.svg" alt=""><span>Science</span></li><li data-category="general_knowledge"><img src="asset/general_knowledge.svg" alt=""><span>General Knowledge</span></li><li data-category="sport_and_leisure"><img src="asset/sport_and_leisure.svg" alt=""><span>Sports</span></li><li data-category=""><img src="asset/random-icon.svg" alt=""><span>Random</span></li></ul>`;
container.innerHTML = homePageHTML;
mainElement.prepend(container)
const questionArea = document.createElement("div");
questionArea.className = "title-box"
const questionCountDisplay = document.createElement("p");
const questionDisplay = document.createElement("h1");
const titleColor = document.createElement("h1");
titleColor.className = "title";
const optionList = document.createElement("ul");
optionList.className = "optionBox"
const checkBtn = document.createElement("button");
checkBtn.className = "btn";
checkBtn.innerHTML = "Submit"
const reAgain = document.createElement("button");
reAgain.className = "btn";
reAgain.innerHTML = "Play again";

const catogaryList = document.querySelector(".category");
let category;
catogaryList.addEventListener("click", (e) => {
    if (e.srcElement.localName === 'li') {
        category = e.target.getAttribute('data-category');
        getData(category);
    }
    else {
        category = e.target.parentElement.getAttribute("data-category");
        getData(category);
    }
})

async function getData(category) {
    const apiUrl = "https://the-trivia-api.com/v2/questions?limit=1&";
    let response, data;
    let imgCat = document.createElement("img");
    let categoryHeader = document.createElement("div");
    let span = document.createElement("span");
    if (category === '') {
        response = await fetch(apiUrl);
        data = await response.json();
        displayQuestionAndOptions(data)
        headerElement.removeChild(headerElement.lastChild)
        categoryHeader.className = "category-title";
        imgCat.src ="asset/random-icon.svg";
        span.innerHTML = data[0].category.charAt(0).toUpperCase()+data[0].category.slice(1);
        categoryHeader.appendChild(imgCat);
        categoryHeader.appendChild(span);
        headerElement.append(categoryHeader)
    } else {
        response = await fetch(apiUrl + "categories=" + category);
        data = await response.json();
        displayQuestionAndOptions(data);
         headerElement.removeChild(headerElement.lastChild)
        categoryHeader.className = "category-title";
        imgCat.src =`asset/${category}.svg`;
        span.innerHTML = data[0].category.charAt(0).toUpperCase()+data[0].category.slice(1);
        categoryHeader.appendChild(imgCat);
        categoryHeader.appendChild(span);
        headerElement.append(categoryHeader)
    }
}


function eventListener(){
    checkBtn.addEventListener("click",checkAnswer);
    reAgain.addEventListener("click",()=>{
        window.location.reload();
    })
}
eventListener();

function displayQuestionAndOptions(arr) {
    checkBtn.disabled = false;
    let question = arr[0].question.text
    questionCountDisplay.innerHTML = `Question ${questionCount + 1} out of 10`;
    questionDisplay.innerHTML = question;
    questionArea.appendChild(questionCountDisplay)
    questionArea.appendChild(questionDisplay)
    
    correctAnswer = arr[0].correctAnswer;
    let incorrectAnswer  = arr[0].incorrectAnswers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random()*incorrectAnswer.length +1),0,correctAnswer);
    optionList.innerHTML = optionsList.map((element,index)=>`<li><span class="index">${index + 1}</span><span class="option">${element}</span></li>`)
    optionList.appendChild(checkBtn);
    container.innerHTML = ""
    container.appendChild(questionArea)
    container.appendChild(optionList)
    selectOption();
}

function selectOption(){
    optionList.querySelectorAll("li").forEach(option=>{
        option.addEventListener("click",()=>{
            if(optionList.querySelector(".selected")){
                const activeOption = optionList.querySelector(".selected");
                activeOption.classList.remove("selected")
            }
            option.classList.add("selected")
        })
    })
}

function checkAnswer(){
    checkBtn.disabled = true;
    let text = document.createElement("p");
    if(!optionList.querySelector(".selected")){
    
        checkBtn.disabled = false
    }
    else{
        let selectedAnswer = optionList.querySelector(".selected .option").textContent;
        optionList   
        if(selectedAnswer == correctAnswer){
            correctScore++;
        }  
        checkCount();
    }
}

const scoreArea = document.createElement("div");
scoreArea.className = "score-area";
const scoreBox = document.createElement("div");
scoreBox.className = "score-box";
const scoreH1 = document.createElement("h1");
const scoreP = document.createElement("p");
scoreP.innerHTML = "out of 10";
function endScreen(){
    headerElement.removeChild(headerElement.lastChild)
    questionArea.innerHTML = "";
    questionDisplay.innerHTML ="Quiz completed";
    titleColor.innerHTML = "Your score is .....";
    questionArea.appendChild(questionDisplay);
    questionArea.appendChild(titleColor);
    
    scoreH1.innerHTML = correctScore;
    scoreBox.appendChild(scoreH1);
    scoreBox.appendChild(scoreP);
    scoreArea.appendChild(scoreBox)
    scoreArea.appendChild(reAgain);
    container.innerHTML = "";
    container.appendChild(questionArea);
    container.appendChild(scoreArea)

}
function checkCount(){
    questionCount++;
    if(questionCount != totalQuestion){
        getData(category)
    }
    else{
        endScreen();
    }
}