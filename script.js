let select = document.querySelectorAll("select"),
  showCurrentTime = document.querySelector(".show-time"),
  setAlarmBtn = document.querySelector(".set-alarm-btn"),
  popUpDialog = document.querySelector(".pop-up-msg"),
  cardBox = document.querySelector(".inner-box"),
  deleteAllBtn = document.querySelector(".delete-alarm-btn"),
  stopAlarmBtn = document.querySelector(".stop-alarm-btn"),
  alarmCards = document.querySelectorAll(".alarm-card"),
  alarmArr, k, al,
  audioElem = new Audio("ringtone.mp3");

showAlarms();

// Appending options in select
for (let i = 12; i >= 1; i--) {
  if (i < 10) {
    i = `0${i}`;
  }
  select[0].firstElementChild.insertAdjacentHTML(
    "afterend",
    `<option value="${i}">${i}</option>`
  );
}

for (let i = 59; i >= 0; i--) {
  if (i < 10) {
    i = `0${i}`;
  }
  select[1].firstElementChild.insertAdjacentHTML(
    "afterend",
    `<option value="${i}">${i}</option>`
  );
}

for (let i = 1; i >= 0; i--) {
  let val = i === 0 ? "AM" : "PM";
  select[2].firstElementChild.insertAdjacentHTML(
    "afterend",
    `<option value="${val}">${val}</option>`
  );
}

// Shows the current time
setInterval(() => {
  let currentDate = new Date(),
    h = currentDate.getHours(),
    m = currentDate.getMinutes(),
    s = currentDate.getSeconds(),
    ap = "AM";

  if (h >= 12) {
    h = h - 12;
    ap = "PM";
  }

  h = h == 0 ? 12 - h : h;

  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  showCurrentTime.innerText = `${h}:${m}:${s} ${ap}`;

  if (localStorage.getItem("alarm")) {
    alarmArr = JSON.parse(localStorage.getItem("alarm"));
    k = 0;
    for (let i = 0; i < alarmArr.length; i++) {
      if (`${h}:${m} ${ap}` === alarmArr[i]) {
        al = k;
        audioElem.play();
        audioElem.loop = true;
        setAlarmBtn.classList.add("hide");
        stopAlarmBtn.classList.remove("hide");
        document.querySelector(`#d-${i}`).classList.add("hide");
        document.querySelector(`#d-${i}`).parentElement.parentElement.classList.add("running-alarm");
        deleteAllBtn.classList.add("hide");
      }
      k++;
    }
  }
}, 1000);

function stopAlarm() {
  audioElem.pause();
  alarmArr.splice(al, 1);
  localStorage.setItem("alarm", JSON.stringify(alarmArr));
  showAlarms();
  setAlarmBtn.classList.remove("hide");
  stopAlarmBtn.classList.add("hide");
  deleteAllBtn.classList.remove("hide");

  if (localStorage.getItem("alarm") === "[]") {
    deleteAllBtn.classList.add("hide");
    localStorage.removeItem("alarm");
  }
}

// Adds Alarm to local storage
function addAlarmTime() {
  let time = `${select[0].value}:${select[1].value} ${select[2].value}`,
    arArr;
  if (
    time.includes("Hour") ||
    time.includes("Minute") ||
    time.includes("AM/PM")
  ) {
    return alert("Please enter a valid time!!");
  } else {
    if (!localStorage.getItem("alarm")) {
      arArr = [];
    } else {
      arArr = JSON.parse(localStorage.getItem("alarm"));
    }

    if (arArr.includes(time)) {
      clearTimeout(popup);
      return alert(`You have already set the alarm with time : ${time} !!`);
    }

    arArr.push(time);
    localStorage.setItem("alarm", JSON.stringify(arArr));
    showPopUp(`Alarm added successfully : ${time} 😊`);
    showAlarms();
  }
}

// delete all alarms
function deleteAllAlarms() {
  let confirmDelete = confirm("Do you really want to delete all the alarms?");
  if (confirmDelete) {
    localStorage.removeItem("alarm");
    showAlarms();
    deleteAllBtn.classList.add("hide");
    showPopUp("Successfully deleted all the alarms 😎");
  }
}

// show the alarms
function showAlarms() {
  let arArr, ihtml;
  if (!localStorage.getItem("alarm")) {
    arArr = [];
  } else {
    deleteAllBtn.classList.remove("hide");
    arArr = JSON.parse(localStorage.getItem("alarm"));
    for (index in arArr) {
      ihtml += `
      <div class="alarm-card glass-effect">
        <h3>${arArr[index]}</h3>
        <div class="img">
          <img src="delete.png" id="d-${index}" onclick="deleteAlarm(this.id)" alt="delete-img" />
        </div>
      </div>`;
    }
  }
  cardBox.innerHTML = ihtml;
  cardBox.firstChild.remove();
}

// Delete a alarm
function deleteAlarm(id) {
  id = Number.parseInt(id.split("d-")[1]);
  let arr = JSON.parse(localStorage.getItem("alarm"));
  arr.splice(id, 1);
  localStorage.setItem("alarm", JSON.stringify(arr));

  if (localStorage.getItem("alarm") === "[]") {
    localStorage.removeItem("alarm");
    deleteAllBtn.classList.add("hide");
  }
  showAlarms();
  showPopUp("Deleted alarm successfully 😪");
}

// handles the popup
function popup() {
  if (!popUpDialog.classList.contains("hide")) {
    popUpDialog.classList.add("hide");
  }
}

function showPopUp(msg) {
  popUpDialog.classList.remove("hide");
  popUpDialog.firstElementChild.innerText = msg;
  setTimeout(popup, 2500);
}

function deletePopUp() {
  popUpDialog.classList.add("hide");
}
