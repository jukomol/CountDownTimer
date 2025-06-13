# ⏳ WORK-MODE Timer

 A web-based productivity timer designed to help you **focus deeply on your work**. Visualize time pressure with an animated **Grim Reaper** marching toward your deadline and keep track of your daily goals using the built-in task manager.

> Use this app in fullscreen browser mode during your work/study sessions for distraction-free productivity.

Live: https://jukomol.github.io/CountDownTimer/

![image](https://github.com/user-attachments/assets/13dbdd7c-8d17-42d0-9fcc-abef9c8191a5)



## 🔧 Features

* 🕐 **Multi-unit Countdown**: Track Days, Hours, Minutes, and Seconds.
* 💀 **SVG Grim Reaper**: Animates across the screen to visualize approaching deadlines.
* 🔁 **Pause, Resume, Reset**: Full control over countdown behavior.
* 🌑 **Dark Mode**: Toggle between light and dark themes.
* ✅ **Task Manager**:

  * Add/remove daily tasks.
  * Checkbox to mark completion.
  * Fade effect for completed items.
  * LocalStorage persistence.
  * Export completed/uncompleted task report (`.txt`).

---

## 📂 Project Structure

```bash
├── index.html        # Main HTML structure
├── style.css         # CSS for layout, animation, and responsive design
├── script.js         # Core logic: timer, reaper animation, tasks
├── assets/           # SVG images, sounds (optional)
└── README.md         # Project documentation
```

---

## 🚀 Getting Started

### 🔨 Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jukomol/CountDownTimer
   cd CountDownTimer
   ```

2. Open `index.html` in your browser.

> No build tools or dependencies required — pure HTML, CSS, and JS (with optional jQuery).

---

## 📦 Deployment

You can deploy this easily with GitHub Pages:

```bash
# Inside your repo
git add .
git commit -m "Deploy"
git push origin main
```

Then go to **Repo Settings > Pages** and choose the root of the `main` branch.

---

## 📜 License

[MIT License](LICENSE)

Feel free to fork, use, and modify for personal or commercial use.

---

## 🙏 Acknowledgments

* This app is an extension of https://github.com/alkhalidsardar/Deadline-loading-bar
* Thanks to Al Khalid



