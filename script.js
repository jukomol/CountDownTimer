/* ================================================================
   script.js
   ----------------------------------------------------------------
   - SVG “deadline” character animation (arm speeds up, reaper moves)
   - Masked headline effect over “Deadline …” text
   - 24 h digital clock in the header
   - Dark‑mode toggle 🌙/☀️
   - Multi‑unit countdown (days / hours / minutes) that also slides
     the red rectangle #progress-time-fill exactly in sync
   ================================================================*/

var $ = jQuery;

let total = 0;
let remaining = 0;
let initialSet = 0;
let paused = false;
let pausedAt = 0;
let timerId = null;
// Task management variables
const addBtn = document.getElementById('addTaskBtn');
const clearBtn = document.getElementById('clearTasksBtn');
const exportBtn = document.getElementById('exportTasksBtn');




/* ---------- CONFIG ------------------------------------------------*/
const SVG_WIDTH          = 586;   // width of the red rect in your SVG
const ARM_ID             = '#designer-arm-grop'; // (spelling matches SVG)
const ANIMATION_CYCLE    = 20;    // seconds per “deadline” character loop

/* ==================================================================
   1) CHARACTER / TEXT FX (runs once DOM is ready)
   =================================================================*/
$(document).ready(function () {

  /* — set CSS‑keyframe speed for the reaper tool & flames group — */
  $('#death-group').css({ 'animation-duration': ANIMATION_CYCLE + 's' });

  /* — pulse the designer’s arm faster as the (fake) deadline nears — */
  function deadlineAnimation() {
    $(ARM_ID).css({ 'animation-duration': '1.5s' });
    setTimeout(() => $(ARM_ID).css({ 'animation-duration': '1s'  }),  4000);
    setTimeout(() => $(ARM_ID).css({ 'animation-duration': '0.7s'}),  8000);
    setTimeout(() => $(ARM_ID).css({ 'animation-duration': '0.3s'}), 12000);
    setTimeout(() => $(ARM_ID).css({ 'animation-duration': '0.2s'}), 15000);
  }

  /* — duplicate the “Deadline for …” label inside two sliding masks — */
  function wireDeadlineText() {
    const $el  = $('.deadline-days');
    const html = `
      <div class="mask-red"><div class="inner">${$el.html()}</div></div>
      <div class="mask-white"><div class="inner">${$el.html()}</div></div>`;
    $el.html(html);
  }

  wireDeadlineText();
  deadlineAnimation();
  setInterval(deadlineAnimation, ANIMATION_CYCLE * 1000);   // repeat loop
});


/* ==================================================================
   2) LIVE DIGITAL CLOCK (24‑hour, updates every second)
   =================================================================*/
function tickClock() {
  const now = new Date();
  document.getElementById('clock-now').textContent =
    now.toLocaleTimeString('en-US', { hour12: false });
}
setInterval(tickClock, 1000);
tickClock();   // initial paint


/* ==================================================================
   3) DARK‑MODE TOGGLE
   =================================================================*/
const toggleBtn = document.getElementById('darkToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});


/* ==================================================================
   4) COUNTDOWN + PROGRESS BAR (single source of truth)
   =================================================================*/
const redRect   = document.getElementById('progress-time-fill');
const countOut  = document.getElementById('countDown');
const daysLabel = document.querySelector('.deadline-days .day');

const z = n => String(n).padStart(2, '0');

const pct = 1 - remaining / total;
const shift = -SVG_WIDTH + SVG_WIDTH * pct; // red rect motion

function renderCountdown() {
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  countOut.textContent = `${z(d)} DAYS | ${z(h)} HRS | ${z(m)} MINS | ${z(s)} SECS`;
  if (daysLabel) daysLabel.textContent = d;

  const pct = 1 - remaining / total;
  const shift = -SVG_WIDTH + SVG_WIDTH * pct;
  redRect.setAttribute('x', shift);

  // Move Reaper smoothly
  const reaperX = pct * SVG_WIDTH+25; // 0.5 for centering
  const reaperGroup = document.getElementById('death-group');
  if (reaperGroup) {
    reaperGroup.style.transform = `translateX(${reaperX}px)`;
  }
}



/* ---- one‑second heartbeat ----------------------------------------*/
function tick() {
  if (remaining <= 0) {
    clearInterval(timerId);
    timerId = null;
    remaining = 0;
    renderCountdown();
    document.exitFullscreen();
    alert('Time is up!');
    document.getElementById('deadline').classList.add('paused');
    return;
  }
  remaining--;
  renderCountdown();
  if (remaining <= total * 0.1) {
    // Speed up the designer’s arm as the deadline nears
    $(ARM_ID).css({ 'animation-duration': '0.2s' });
  }
}

/* ---- user hits ⏱️ Start -----------------------------------------*/
document.getElementById('startBtn').addEventListener('click', () => {
  const d = +document.getElementById('days').value    || 0;
  const h = +document.getElementById('hours').value   || 0;
  const m = +document.getElementById('minutes').value || 0;
  const s = +document.getElementById('seconds').value || 0;

  total = remaining = d * 86400 + h * 3600 + m * 60 + s;
  initialSet = total;

  if (total <= 0) {
    alert('Enter a valid duration!');
    return;
  }

  document.getElementById('deadline').classList.remove('paused');

  // Fullscreen
  const docElm = document.documentElement;
  if (docElm.requestFullscreen) docElm.requestFullscreen();

  redRect.setAttribute('x', -SVG_WIDTH);
  renderCountdown();

  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
});

/* ---- user hits ⏸️ Pause ------------------------------------------*/
document.getElementById('pauseBtn').addEventListener('click', () => {
  if (timerId) {
    pausedAt = remaining;
    clearInterval(timerId);
    timerId = null;
    paused = true;
    console.log("Timer paused at:", pausedAt);
  }
});

/* ---- user hits ⏸️ Resume -----------------------------------------*/
document.getElementById('resumeBtn').addEventListener('click', () => {
  if (!timerId && paused && remaining > 0) {
    timerId = setInterval(tick, 1000);
    paused = false;

    // Re-enter fullscreen if supported
    const docElm = document.documentElement;
    if (!document.fullscreenElement && docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }

    console.log("Resuming from:", remaining, "seconds left");
  }
});
/* ---- user hits ⏹️ Reset ------------------------------------------*/
document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  remaining = 0;
  total = 0;
  paused = false;
  initialSet = 0;

  // Reset input fields
  document.getElementById('days').value = 0;
  document.getElementById('hours').value = 0;
  document.getElementById('minutes').value = 0;
  document.getElementById('seconds').value = 0;

  // Reset countdown text
  countOut.textContent = `00 DAYS | 00 HRS | 00 MINS | 00 SECS `;
  if (daysLabel) daysLabel.textContent = 0;

  // Reset red progress bar
  redRect.setAttribute('x', -SVG_WIDTH);

  // Reset Reaper position
  const reaperGroup = document.getElementById('death-group');
  if (reaperGroup) {
    reaperGroup.style.transition = 'none';
    reaperGroup.style.transform = 'translateX(100px)';
    void reaperGroup.offsetWidth;
    reaperGroup.style.transition = 'transform 1s linear';
  }

  // Reset designer arm animation
  const arm = document.getElementById('designer-arm-grop');
  if (arm) {
    arm.style.animation = 'none';
    void arm.offsetWidth;
    arm.style.animation = '';
  }

  // Pause any SVG animations
  document.getElementById('deadline').classList.add('paused');

  // Exit fullscreen if active
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  console.log("Timer and SVG animations fully reset.");
});



/* ---- TASK ADD --------------------------------*/
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load saved tasks on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  saved.forEach(task => addTask(task.text, task.done));
});

// Handle Add button click
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  addTask(taskText, false);
  taskInput.value = '';
  saveTasks();
});

// Create and display task
function addTask(text, done) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;

  const label = document.createElement('label');
  label.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.className = 'delete-btn';

  li.classList.toggle('completed', done);

  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Save current task list to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('label').textContent;
    const done = li.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text, done });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks
clearBtn.addEventListener('click', () => {
  if (confirm("Clear all tasks?")) {
    localStorage.removeItem('tasks');
    taskList.innerHTML = '';
  }
});

// Export completed tasks
exportBtn.addEventListener('click', () => {
  const completed = [];
  const uncompleted = [];

  taskList.querySelectorAll('li').forEach(li => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const label = li.querySelector('label').textContent;

    if (checkbox.checked) {
      completed.push(label);
    } else {
      uncompleted.push(label);
    }
  });

  if (completed.length === 0 && uncompleted.length === 0) {
    alert("No tasks to export.");
    return;
  }

  // Format the report
  let content = `--- Completed Tasks ---\n`;
  content += completed.length ? completed.join('\n') : '(None)';
  content += `\n\n--- Uncompleted Tasks ---\n`;
  content += uncompleted.length ? uncompleted.join('\n') : '(None)';

  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);

  // File naming: YYYY-MM-DD_HH-MM-SS.txt
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const fileName = `${dateStr}_${timeStr}.txt`;

  a.download = fileName;
  a.click();
});

