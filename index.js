window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

// DOM variables
const fieldsets = document.getElementsByTagName("fieldset");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const generatePdfBtn = document.getElementById("generate-pdf");
const techList = document.getElementsByClassName("tech");
const techRatingList = document.getElementsByClassName("rating");
const marksCanvas = document.getElementById("marksChart");
const canvas = document.createElement("canvas");

const fieldsetsLength = fieldsets.length;
// Declare default fieldset Index and show first form
let fieldsetIndex = 0;
showFieldset(fieldsetIndex);

function showFieldset(n) {
  if (n == 0) {
    prevBtn.className = "hide";
  } else {
    prevBtn.classList.remove("hide");
  }

  if (n === fieldsetsLength - 1) {
    generatePdfBtn.className = "show";
    nextBtn.classList.add("hide");
  } else {
    nextBtn.classList.remove("hide");
    generatePdfBtn.className = "hide";
  }

  fieldsets[n].className = "show";
}

function buttonClick(n) {
  fieldsets[fieldsetIndex].className = "hide";
  fieldsetIndex = fieldsetIndex + n;
  showFieldset(fieldsetIndex);
}

prevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  buttonClick(-1);
});
nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  buttonClick(1);
});

generatePdfBtn.addEventListener("click", (e) => {
  e.preventDefault();
  canvastoImage();
});

function canvastoImage() {
  let technologies = [];
  let technologiesObjList = [];

  Array.from(techList).forEach((el, i) => {
    let obj = {};
    obj[el.value] = techRatingList[i].value;
    technologies.push(el.value);
    technologiesObjList.push(obj);
  });
  const marksData = {
    labels: technologies,
    datasets: [
      {
        label: "Technology Proficiency",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
        data: [
          technologiesObjList[0][technologies[0]],
          technologiesObjList[1][technologies[1]],
          technologiesObjList[2][technologies[2]],
        ],
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
  const chart = new Chart(marksCanvas.getContext("2d"), {
    type: "bar",
    data: marksData,
    options: {
      animation: {
        onComplete: function () {
          let imgURL = chart.toBase64Image();
          generatePdf(imgURL);
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 2,
          },
        },
      },
    },
  });
}
function generatePdf(url) {
  // User details
  const name = document.getElementById("name").value;
  const address = document.getElementById("Address").value;
  const email = document.getElementById("Email").value;
  const githubUrl = document.getElementById("Github").value;
  const phoneNumber = document.getElementById("Number").value;
  const personalStatement = document.getElementById("Personal-statement").value;
  const jobSearch = document.getElementById("looking-for").value;

  // Experience
  const company = document.getElementById("Company").value;
  const postion = document.getElementById("Position").value;
  const startDate = document.getElementById("Start-date").value;
  const endDate = document.getElementById("end-date").value;
  const jobSummary = document.getElementById("Summary").value;

  let doc = new jsPDF();

  doc.setFillColor("#96BBD8");
  doc.rect(0, 0, 75, 1000, "F");
  doc.setFont("normal", "normal", "bold");
  doc.setTextColor("white");
  doc.setFontSize(18);
  doc.text(name, 10, 15);
  doc.setFontSize(13);
  doc.setFont("normal", "normal", "normal");
  doc.text("Github: " + githubUrl, 10, 26);
  doc.text(phoneNumber, 10, 32);
  doc.text(email, 10, 38);
  doc.text(address, 10, 44);

  doc.setFont("normal", "normal", "bold");
  doc.text("Personal Statement", 10, 60);
  const splitPersonalStatement = doc.splitTextToSize(personalStatement, 65);
  doc.setFont("normal", "normal", "normal");
  doc.text(splitPersonalStatement, 10, 70);
  const personalStatementDimensions = doc.getTextDimensions(
    splitPersonalStatement
  );

  doc.setFont("normal", "normal", "bold");
  doc.text("why hire me?", 10, Math.ceil(personalStatementDimensions.h) + 80);
  doc.setFont("normal", "normal", "normal");
  const splitJobSearch = doc.splitTextToSize(jobSearch, 65);
  doc.text(splitJobSearch, 10, Math.ceil(personalStatementDimensions.h) + 90);

  // Experience section
  doc.setTextColor("black");
  doc.setFontSize(17);
  doc.text("Work Experience", 80, 30);

  doc.setFontSize(9);
  doc.setFont("normal", "normal", "bold");
  doc.text(startDate, 160, 40);
  doc.text(endDate, 177, 40);

  doc.setFontSize(12);
  doc.setFont("normal", "normal", "normal");

  doc.text(company, 80, 40);
  doc.text(postion, 80, 47);
  let splitSummary = doc.splitTextToSize(jobSummary, 120);
  doc.text(splitSummary, 80, 55);

  // Technologies section
  doc.setTextColor("black");
  doc.setFontSize(17);
  const summaryDimensions = doc.getTextDimensions(splitSummary);
  doc.text("Technologies", 80, Math.ceil(summaryDimensions.h) + 70);
  const technologyDimensions = doc.getTextDimensions("Technologies");
  doc.addImage(
    url,
    "JPEG",
    80,
    Math.ceil(technologyDimensions.h) + 100,
    120,
    100
  );

  window.open(doc.output("bloburl"));
}
