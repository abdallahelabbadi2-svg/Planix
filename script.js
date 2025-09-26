// ترجمة النصوص
const translations = {
    "ar": {
        "goal-title": "حدد هدفك الأسبوعي",
        "select-goal": "اختر هدفك",
        "goal-plan-placeholder": "كيف ستصل إلى هدفك؟",
        "schedule-title": "الجدول الزمني للأسبوع",
        "saturday": "السبت",
        "sunday": "الأحد",
        "monday": "الإثنين",
        "tuesday": "الثلاثاء",
        "wednesday": "الأربعاء",
        "thursday": "الخميس",
        "friday": "الجمعة",
        "pomodoro-title": "مؤقت بومودورو",
        "start": "ابدأ",
        "pause": "أوقف مؤقتاً",
        "reset": "إعادة تعيين",
        "current-task": "المهمة الحالية",
        "no-task-selected": "لا توجد مهمة محددة",
        "progress-title": "تقدمك الأسبوعي",
        "completed-tasks": "المهام المكتملة",
        "total-tasks": "إجمالي المهام",
        "completion-rate": "نسبة الإنجاز",
        "footer-text": "© 2023 Planix. جميع الحقوق محفوظة.",
        "add-task": "إضافة مهمة جديدة",
        "task-name": "اسم المهمة",
        "task-time": "الوقت المتوقع (بالدقائق)",
        "task-day": "اليوم",
        "save-task": "حفظ المهمة",
        "study": "الدراسة",
        "work": "العمل",
        "fitness": "اللياقة",
        "hobby": "هواية",
        "other": "أخرى"
    },
    "en": {
        "goal-title": "Set Your Weekly Goal",
        "select-goal": "Select Your Goal",
        "goal-plan-placeholder": "How will you reach your goal?",
        "schedule-title": "Weekly Schedule",
        "saturday": "Saturday",
        "sunday": "Sunday",
        "monday": "Monday",
        "tuesday": "Tuesday",
        "wednesday": "Wednesday",
        "thursday": "Thursday",
        "friday": "Friday",
        "pomodoro-title": "Pomodoro Timer",
        "start": "Start",
        "pause": "Pause",
        "reset": "Reset",
        "current-task": "Current Task",
        "no-task-selected": "No Task Selected",
        "progress-title": "Your Weekly Progress",
        "completed-tasks": "Completed Tasks",
        "total-tasks": "Total Tasks",
        "completion-rate": "Completion Rate",
        "footer-text": "© 2023 Planix. All Rights Reserved.",
        "add-task": "Add New Task",
        "task-name": "Task Name",
        "task-time": "Estimated Time (minutes)",
        "task-day": "Day",
        "save-task": "Save Task",
        "study": "Study",
        "work": "Work",
        "fitness": "Fitness",
        "hobby": "Hobby",
        "other": "Other"
    }
};

// المتغيرات العامة
let currentLang = "ar";
let pomodoroTimer = null;
let pomodoroMinutes = 25;
let pomodoroSeconds = 0;
let currentTask = null;
let tasks = {
    saturday: [],
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};
let progressChart = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل المهام من التخزين المحلي
    loadTasksFromStorage();

    // عرض المهام المحملة
    renderAllTasks();

    // تحديث إحصائيات التقدم
    updateProgressStats();

    // إنشاء رسم بياني للتقدم
    createProgressChart();

    // إعداد مستمعي الأحداث
    setupEventListeners();

    // تطبيق الترجمة
    applyTranslation(currentLang);
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // أزرار تبديل اللغة
    document.getElementById('lang-ar').addEventListener('click', () => switchLanguage('ar'));
    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));

    // أزرار إضافة المهام
    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            openTaskModal(day);
        });
    });

    // نموذج إضافة المهمة
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });

    // زر إغلاق النافذة المنبثقة
    document.querySelector('.close-btn').addEventListener('click', closeTaskModal);

    // النقر خارج النافذة المنبثقة لإغلاقها
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('task-modal');
        if (e.target === modal) {
            closeTaskModal();
        }
    });

    // أزرار التحكم في مؤقت بومودورو
    document.getElementById('pomodoro-start').addEventListener('click', startPomodoro);
    document.getElementById('pomodoro-pause').addEventListener('click', pausePomodoro);
    document.getElementById('pomodoro-reset').addEventListener('click', resetPomodoro);
}

// تبديل اللغة
function switchLanguage(lang) {
    currentLang = lang;

    // تحديث الأزرار النشطة
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');

    // تحديث اتجاه الصفحة
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // تطبيق الترجمة
    applyTranslation(lang);

    // حفظ اللغة في التخزين المحلي
    localStorage.setItem('planix_lang', lang);
}

// تطبيق الترجمة
function applyTranslation(lang) {
    // تحديث النصوص
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // تحديث العناصر النائبة
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // تحديث خيارات القائمة المنسدلة
    const goalSelect = document.getElementById('goal-select');
    goalSelect.options[0].textContent = translations[lang]['select-goal'];
    goalSelect.options[1].textContent = translations[lang]['study'];
    goalSelect.options[2].textContent = translations[lang]['work'];
    goalSelect.options[3].textContent = translations[lang]['fitness'];
    goalSelect.options[4].textContent = translations[lang]['hobby'];
    goalSelect.options[5].textContent = translations[lang]['other'];
}

// فتح نافذة إضافة مهمة
function openTaskModal(day) {
    document.getElementById('task-modal').style.display = 'flex';
    document.getElementById('task-day').value = day;
    document.getElementById('task-name').value = '';
    document.getElementById('task-time').value = '25';
}

// إغلاق نافذة إضافة مهمة
function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// حفظ مهمة جديدة
function saveTask() {
    const taskName = document.getElementById('task-name').value;
    const taskTime = parseInt(document.getElementById('task-time').value);
    const taskDay = document.getElementById('task-day').value;

    if (taskName && taskTime && taskDay) {
        const newTask = {
            id: Date.now(),
            name: taskName,
            time: taskTime,
            completed: false
        };

        tasks[taskDay].push(newTask);
        saveTasksToStorage();
        renderTasks(taskDay);
        updateProgressStats();
        closeTaskModal();
    }
}

// عرض المهام ليوم معين
function renderTasks(day) {
    const container = document.getElementById(`${day}-tasks`);
    container.innerHTML = '';

    tasks[day].forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <button class="task-delete" data-id="${task.id}" data-day="${day}">×</button>
            <div class="task-name">${task.name}</div>
            <div class="task-time">${task.time} ${currentLang === 'ar' ? 'دقيقة' : 'minutes'}</div>
        `;

        // عند النقر على المهمة
        taskElement.addEventListener('click', function(e) {
            // إذا تم النقر على زر الحذف، لا تفعل شيئًا
            if (e.target.classList.contains('task-delete')) {
                return;
            }

            // تحديد المهمة الحالية لمؤقت بومودورو
            currentTask = {
                id: task.id,
                name: task.name,
                time: task.time,
                day: day
            };

            // تحديث واجهة المستخدم
            document.getElementById('current-task-name').textContent = task.name;

            // إعادة تعيين المؤقت
            resetPomodoro();
            pomodoroMinutes = task.time;
            updatePomodoroDisplay();
        });

        // عند النقر على زر الحذف
        taskElement.querySelector('.task-delete').addEventListener('click', function() {
            const taskId = parseInt(this.getAttribute('data-id'));
            const taskDay = this.getAttribute('data-day');
            deleteTask(taskId, taskDay);
        });

        container.appendChild(taskElement);
    });
}

// عرض جميع المهام
function renderAllTasks() {
    Object.keys(tasks).forEach(day => {
        renderTasks(day);
    });
}

// حذف مهمة
function deleteTask(taskId, day) {
    tasks[day] = tasks[day].filter(task => task.id !== taskId);
    saveTasksToStorage();
    renderTasks(day);
    updateProgressStats();

    // إذا كانت المهمة المحذوفة هي المهمة الحالية، قم بإلغائها
    if (currentTask && currentTask.id === taskId) {
        currentTask = null;
        document.getElementById('current-task-name').textContent = 
            translations[currentLang]['no-task-selected'];
    }
}

// بدء مؤقت بومودورو
function startPomodoro() {
    if (!currentTask) {
        alert(currentLang === 'ar' ? 'الرجاء تحديد مهمة أولاً' : 'Please select a task first');
        return;
    }

    if (pomodoroTimer) return;

    pomodoroTimer = setInterval(() => {
        if (pomodoroSeconds === 0) {
            if (pomodoroMinutes === 0) {
                // انتهى الوقت
                pausePomodoro();
                completeCurrentTask();
                alert(currentLang === 'ar' ? 'انتهى وقت المهمة!' : 'Task time is up!');
                return;
            }
            pomodoroMinutes--;
            pomodoroSeconds = 59;
        } else {
            pomodoroSeconds--;
        }

        updatePomodoroDisplay();
    }, 1000);
}

// إيقاف مؤقت بومودورو مؤقتاً
function pausePomodoro() {
    if (pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
    }
}

// إعادة تعيين مؤقت بومودورو
function resetPomodoro() {
    pausePomodoro();
    if (currentTask) {
        pomodoroMinutes = currentTask.time;
    } else {
        pomodoroMinutes = 25;
    }
    pomodoroSeconds = 0;
    updatePomodoroDisplay();
}

// تحديث عرض مؤقت بومودورو
function updatePomodoroDisplay() {
    document.getElementById('minutes').textContent = pomodoroMinutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = pomodoroSeconds.toString().padStart(2, '0');
}

// إكمال المهمة الحالية
function completeCurrentTask() {
    if (!currentTask) return;

    // تحديث حالة المهمة
    const taskIndex = tasks[currentTask.day].findIndex(task => task.id === currentTask.id);
    if (taskIndex !== -1) {
        tasks[currentTask.day][taskIndex].completed = true;
        saveTasksToStorage();
        renderTasks(currentTask.day);
        updateProgressStats();
    }

    // إعادة تعيين المهمة الحالية
    currentTask = null;
    document.getElementById('current-task-name').textContent = 
        translations[currentLang]['no-task-selected'];

    // إعادة تعيين المؤقت
    resetPomodoro();
}

// تحديث إحصائيات التقدم
function updateProgressStats() {
    let completedCount = 0;
    let totalCount = 0;

    Object.values(tasks).forEach(dayTasks => {
        dayTasks.forEach(task => {
            totalCount++;
            if (task.completed) {
                completedCount++;
            }
        });
    });

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;

    // تحديث الرسم البياني
    if (progressChart) {
        updateProgressChart();
    }
}

// إنشاء الرسم البياني للتقدم
function createProgressChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');

    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                translations[currentLang]['saturday'],
                translations[currentLang]['sunday'],
                translations[currentLang]['monday'],
                translations[currentLang]['tuesday'],
                translations[currentLang]['wednesday'],
                translations[currentLang]['thursday'],
                translations[currentLang]['friday']
            ],
            datasets: [{
                label: translations[currentLang]['completed-tasks'],
                data: getCompletedTasksByDay(),
                backgroundColor: 'rgba(74, 111, 165, 0.6)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
            }, {
                label: translations[currentLang]['total-tasks'],
                data: getTotalTasksByDay(),
                backgroundColor: 'rgba(108, 117, 125, 0.3)',
                borderColor: 'rgba(108, 117, 125, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// تحديث الرسم البياني للتقدم
function updateProgressChart() {
    if (!progressChart) return;

    progressChart.data.labels = [
        translations[currentLang]['saturday'],
        translations[currentLang]['sunday'],
        translations[currentLang]['monday'],
        translations[currentLang]['tuesday'],
        translations[currentLang]['wednesday'],
        translations[currentLang]['thursday'],
        translations[currentLang]['friday']
    ];

    progressChart.data.datasets[0].label = translations[currentLang]['completed-tasks'];
    progressChart.data.datasets[0].data = getCompletedTasksByDay();
    progressChart.data.datasets[1].label = translations[currentLang]['total-tasks'];
    progressChart.data.datasets[1].data = getTotalTasksByDay();

    progressChart.update();
}

// الحصول على عدد المهام المكتملة لكل يوم
function getCompletedTasksByDay() {
    return [
        tasks.saturday.filter(task => task.completed).length,
        tasks.sunday.filter(task => task.completed).length,
        tasks.monday.filter(task => task.completed).length,
        tasks.tuesday.filter(task => task.completed).length,
        tasks.wednesday.filter(task => task.completed).length,
        tasks.thursday.filter(task => task.completed).length,
        tasks.friday.filter(task => task.completed).length
    ];
}

// الحصول على إجمالي عدد المهام لكل يوم
function getTotalTasksByDay() {
    return [
        tasks.saturday.length,
        tasks.sunday.length,
        tasks.monday.length,
        tasks.tuesday.length,
        tasks.wednesday.length,
        tasks.thursday.length,
        tasks.friday.length
    ];
}

// حفظ المهام في التخزين المحلي
function saveTasksToStorage() {
    localStorage.setItem('planix_tasks', JSON.stringify(tasks));
}

// تحميل المهام من التخزين المحلي
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('planix_tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    const savedLang = localStorage.getItem('planix_lang');
    if (savedLang) {
        currentLang = savedLang;
        document.querySelectorAll('.language-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${currentLang}`).classList.add('active');
        document.documentElement.setAttribute('lang', currentLang);
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    }
}
