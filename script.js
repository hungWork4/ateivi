/* ============================================
   💖 Date Invitation Website — Script
   ============================================ */

(function () {
  'use strict';

  // ── Constants ──
  const TOTAL_STEPS = 11;
  const STORAGE_KEY = 'dateInvitation_data';
  const TYPING_SPEED = 60;
  const TYPING_TEXT = '💌 Em có muốn dành một buổi hẹn thật đặc biệt cùng anh không?';
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTW2_wJSz2ARVAwPl51wYp-mMYx8FYCMENYI2IIKaqWpV7_iiKOT33SXjJ9ZlFu3qJ/exec'; // Paste your Google Apps Script URL here after deploying

  const PLACE_DATA = {
    cafe: { emoji: '☕', name: 'Cafe' },
    bakery: { emoji: '🍰', name: 'Bakery' },
    milktea: { emoji: '🧋', name: 'Milk Tea' },
    sushi: { emoji: '🍣', name: 'Sushi' },
    pizza: { emoji: '🍕', name: 'Pizza' },
    hotpot: { emoji: '🍲', name: 'Hotpot' },
    bbq: { emoji: '🥩', name: 'BBQ' },
    cinema: { emoji: '🎬', name: 'Cinema' },
    bowling: { emoji: '🎳', name: 'Bowling' },
    karaoke: { emoji: '🎤', name: 'Karaoke' },
    picnic: { emoji: '🏞️', name: 'Picnic' },
    beach: { emoji: '🌊', name: 'Beach' },
    park: { emoji: '🌳', name: 'Park' },
    museum: { emoji: '🏛️', name: 'Museum' },
    aquarium: { emoji: '🐟', name: 'Aquarium' },
    bookstore: { emoji: '📚', name: 'Bookstore' },
    workshop: { emoji: '🎨', name: 'Workshop' },
    mall: { emoji: '🛍️', name: 'Shopping Mall' },
    rooftop: { emoji: '🌃', name: 'Rooftop' },
    roadtrip: { emoji: '🚗', name: 'Road Trip' },
    camping: { emoji: '🏕️', name: 'Camping' },
    surprise: { emoji: '✨', name: 'Tùy ý' },
  };

  const PREFERENCE_OPTIONS = [
    { key: 'really_want', emoji: '❤️', label: 'Really Want' },
    { key: 'want_to_try', emoji: '⭐', label: 'Want To Try' },
    { key: 'long_time_wish', emoji: '🔥', label: 'Long Time Wish' },
    { key: 'optional', emoji: '😊', label: 'Optional' },
  ];

  const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

  // ── State ──
  const state = {
    currentStep: 0, // 0 = hero
    formData: {
      name: '',
      dateMode: 'calendar', // 'calendar' or 'weekdays'
      dates: [],            // Selected calendar dates
      weekdays: [],         // Selected weekdays
      timePeriods: [],     // multi-select
      pickupLocation: '',
      selectedPlaces: [],
      customPlaces: [],
      priorityOrder: [],
      placePreferences: {},
      placeReasons: {},
      isSurprise: false,
      playlist: [],
      playlistOther: '',
      favoriteFood: '',
      hobbies: '',
      vibes: [],
      notToDo: '',
      message: '',
      confirmed: false,
    },
    isDarkMode: false,
    isMusicPlaying: false,
    sortableInstance: null,
    customPlaceCounter: 0,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
  };

  // ── DOM References ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    heroSection: $('#heroSection'),
    typingText: $('#typingText'),
    heroSubtitle: $('#heroSubtitle'),
    startBtn: $('#startBtn'),
    formContainer: $('#formContainer'),
    progressSection: $('#progressSection'),
    progressLabel: $('#progressLabel'),
    progressFill: $('#progressFill'),
    themeToggle: $('#themeToggle'),
    musicToggle: $('#musicToggle'),
    bgMusic: $('#bgMusic'),
    particles: $('#particles'),
    // Step 3
    timeOptions: $('#timeOptions'),
    // Step 2 date
    dateModeOptions: $('#dateModeOptions'),
    calendarSection: $('#calendarSection'),
    weekdaysSection: $('#weekdaysSection'),
    calendarMonthYear: $('#calendarMonthYear'),
    calendarDays: $('#calendarDays'),
    prevMonthBtn: $('#prevMonthBtn'),
    nextMonthBtn: $('#nextMonthBtn'),
    selectedDatesPreview: $('#selectedDatesPreview'),
    weekdayChips: $('#weekdayChips'),
    // Step 5
    placeGrid: $('#placeGrid'),
    addCustomPlace: $('#addCustomPlace'),
    customPlacesList: $('#customPlacesList'),
    prioritySection: $('#prioritySection'),
    priorityList: $('#priorityList'),
    surpriseMsg: $('#surpriseMsg'),
    // Step 7 Music
    playlistChips: $('#playlistChips'),
    // Step 9 Vibe
    vibeChips: $('#vibeChips'),
    // Step 11 Message
    confirmCheckbox: $('#confirmCheckbox'),
    confirmBox: $('#confirmBox'),
    submitBtn: $('#submitBtn'),
    errorSubmit: $('#errorSubmit'),
    // Screens
    successScreen: $('#successScreen'),
    summaryScreen: $('#summaryScreen'),
    viewAnswersBtn: $('#viewAnswersBtn'),
    editAgainBtn: $('#editAgainBtn'),
    exportBtn: $('#exportBtn'),
    bearContainer: $('#bearContainer'),
  };

  // ── Initialize ──
  function init() {
    // Clear old localStorage structure if it has old date format to avoid crashes
    checkAndCleanLocalStorage();
    restoreFromStorage();
    initTheme();
    initParticles();
    initTypingAnimation();
    initEventListeners();
    initScrollReveal();
    renderCalendar();
  }

  // ── Theme ──
  function initTheme() {
    const saved = localStorage.getItem('dateInvitation_theme');
    if (saved === 'dark') {
      state.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
      dom.themeToggle.textContent = '☀️';
    }
  }

  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    if (state.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      dom.themeToggle.textContent = '☀️';
      localStorage.setItem('dateInvitation_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      dom.themeToggle.textContent = '🌙';
      localStorage.setItem('dateInvitation_theme', 'light');
    }
  }

  // ── Music ──
  function toggleMusic() {
    if (state.isMusicPlaying) {
      dom.bgMusic.pause();
      dom.musicToggle.textContent = '🎵';
      state.isMusicPlaying = false;
    } else {
      dom.bgMusic.play().catch(() => { });
      dom.musicToggle.textContent = '🔊';
      state.isMusicPlaying = true;
    }
  }

  // ── Typing Animation ──
  function initTypingAnimation() {
    let i = 0;
    const type = () => {
      if (i <= TYPING_TEXT.length) {
        dom.typingText.textContent = TYPING_TEXT.substring(0, i);
        i++;
        setTimeout(type, TYPING_SPEED);
      } else {
        // Show subtitle and button after typing done
        setTimeout(() => {
          dom.heroSubtitle.classList.add('visible');
          setTimeout(() => {
            dom.startBtn.classList.add('visible');
          }, 300);
        }, 200);
      }
    };
    setTimeout(type, 500);
  }

  // ── Particles (Sparkles, Petals) ──
  function initParticles() {
    // Sparkles
    for (let i = 0; i < 15; i++) {
      createSparkle(i);
    }
    // Petals
    for (let i = 0; i < 8; i++) {
      createPetal(i);
    }
  }

  function createSparkle(delay) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = (delay * 0.5 + Math.random() * 2) + 's';
    sparkle.style.animationDuration = (2 + Math.random() * 3) + 's';
    const size = 3 + Math.random() * 5;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    dom.particles.appendChild(sparkle);
  }

  function createPetal(delay) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDelay = (delay * 3 + Math.random() * 5) + 's';
    petal.style.animationDuration = (8 + Math.random() * 8) + 's';
    const size = 8 + Math.random() * 8;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.opacity = 0;
    const colors = ['#ffb3d1', '#ffd6e7', '#c9b1f0', '#ffd1a8'];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    dom.particles.appendChild(petal);
  }

  // ── Event Listeners ──
  function initEventListeners() {
    // Theme & Music
    dom.themeToggle.addEventListener('click', toggleTheme);
    dom.musicToggle.addEventListener('click', toggleMusic);

    // Start Button
    dom.startBtn.addEventListener('click', (e) => {
      createRipple(e, dom.startBtn);
      startForm();
    });

    // Nav Buttons
    document.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('[data-next]');
      const prevBtn = e.target.closest('[data-prev]');
      if (nextBtn) {
        const nextStep = parseInt(nextBtn.dataset.next);
        if (validateStep(state.currentStep)) {
          goToStep(nextStep);
        }
      }
      if (prevBtn) {
        goToStep(parseInt(prevBtn.dataset.prev));
      }
    });

    // Step 3: Time period (multi-select)
    dom.timeOptions.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card');
      if (!card) return;
      const val = card.dataset.value;

      card.classList.toggle('selected');
      const isSelected = card.classList.contains('selected');
      card.setAttribute('aria-pressed', String(isSelected));

      if (isSelected) {
        if (!state.formData.timePeriods.includes(val)) {
          state.formData.timePeriods.push(val);
        }
      } else {
        state.formData.timePeriods = state.formData.timePeriods.filter(t => t !== val);
      }

      clearError('errorTime');
      saveToStorage();
    });

    // Step 2: Date mode toggle
    dom.dateModeOptions.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card');
      if (!card) return;
      dom.dateModeOptions.querySelectorAll('.option-card').forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      state.formData.dateMode = card.dataset.value;

      if (card.dataset.value === 'calendar') {
        dom.calendarSection.style.display = '';
        dom.weekdaysSection.style.display = 'none';
      } else {
        dom.calendarSection.style.display = 'none';
        dom.weekdaysSection.style.display = '';
      }
      clearError('errorDate');
      saveToStorage();
    });

    // Step 2: Calendar Navigation
    dom.prevMonthBtn.addEventListener('click', () => {
      state.currentMonth--;
      if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear--;
      }
      renderCalendar();
    });

    dom.nextMonthBtn.addEventListener('click', () => {
      state.currentMonth++;
      if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear++;
      }
      renderCalendar();
    });

    // Step 2: Calendar Day Click
    dom.calendarDays.addEventListener('click', (e) => {
      const dayEl = e.target.closest('.calendar-day:not(.disabled):not(.empty)');
      if (!dayEl) return;

      const dateStr = dayEl.dataset.date;
      const index = state.formData.dates.indexOf(dateStr);
      if (index === -1) {
        state.formData.dates.push(dateStr);
        dayEl.classList.add('selected');
        dayEl.setAttribute('aria-pressed', 'true');
      } else {
        state.formData.dates.splice(index, 1);
        dayEl.classList.remove('selected');
        dayEl.setAttribute('aria-pressed', 'false');
      }

      updateDatesPreview();
      clearError('errorDate');
      saveToStorage();
    });

    // Step 2: Weekday Chips Click
    dom.weekdayChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      chip.classList.toggle('selected');
      const isSelected = chip.classList.contains('selected');
      chip.setAttribute('aria-pressed', String(isSelected));
      const val = chip.dataset.value;

      if (isSelected) {
        if (!state.formData.weekdays.includes(val)) {
          state.formData.weekdays.push(val);
        }
      } else {
        state.formData.weekdays = state.formData.weekdays.filter(w => w !== val);
      }

      clearError('errorDate');
      saveToStorage();
    });

    // Step 5: Places
    dom.placeGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.place-card');
      if (!card) return;
      const place = card.dataset.place;

      if (place === 'surprise') {
        handleSurprise(card);
        return;
      }

      // If surprise was selected, deselect it
      if (state.formData.isSurprise) {
        state.formData.isSurprise = false;
        const surpriseCard = dom.placeGrid.querySelector('[data-place="surprise"]');
        if (surpriseCard) {
          surpriseCard.classList.remove('selected');
          surpriseCard.setAttribute('aria-pressed', 'false');
        }
        dom.surpriseMsg.classList.remove('active');
      }

      card.classList.toggle('selected');
      const isSelected = card.classList.contains('selected');
      card.setAttribute('aria-pressed', String(isSelected));

      if (isSelected) {
        state.formData.selectedPlaces.push(place);
      } else {
        state.formData.selectedPlaces = state.formData.selectedPlaces.filter(p => p !== place);
      }

      clearError('errorPlaces');
      updatePriorityList();
      saveToStorage();
    });

    // Keyboard support for cards
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.option-card, .place-card, .chip');
        if (card) {
          e.preventDefault();
          card.click();
        }
        const checkbox = e.target.closest('.confirm-checkbox');
        if (checkbox) {
          e.preventDefault();
          checkbox.click();
        }
      }
    });

    // Step 9: Vibe chips
    dom.vibeChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chip.classList.toggle('selected');
      const isSelected = chip.classList.contains('selected');
      chip.setAttribute('aria-pressed', String(isSelected));
      const val = chip.dataset.value;
      if (isSelected) {
        if (!state.formData.vibes.includes(val)) {
          state.formData.vibes.push(val);
        }
      } else {
        state.formData.vibes = state.formData.vibes.filter(v => v !== val);
      }
      saveToStorage();
    });

    // Step 7: Playlist chips
    dom.playlistChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chip.classList.toggle('selected');
      const isSelected = chip.classList.contains('selected');
      chip.setAttribute('aria-pressed', String(isSelected));
      const val = chip.dataset.value;
      if (isSelected) {
        state.formData.playlist.push(val);
      } else {
        state.formData.playlist = state.formData.playlist.filter(v => v !== val);
      }
      saveToStorage();
    });

    // Step 11: Confirmation
    dom.confirmCheckbox.addEventListener('click', () => {
      state.formData.confirmed = !state.formData.confirmed;
      dom.confirmCheckbox.classList.toggle('checked', state.formData.confirmed);
      dom.confirmCheckbox.setAttribute('aria-checked', String(state.formData.confirmed));
      dom.confirmBox.textContent = state.formData.confirmed ? '✓' : '';
      clearError('errorConfirm');
      saveToStorage();
    });

    // Submit
    dom.submitBtn.addEventListener('click', (e) => {
      createRipple(e, dom.submitBtn);
      handleSubmit();
    });

    // Success screen buttons
    dom.viewAnswersBtn.addEventListener('click', showSummary);
    dom.editAgainBtn.addEventListener('click', editAgain);
    dom.exportBtn.addEventListener('click', exportJSON);

    // Form inputs auto-save (debounced)
    const inputs = ['inputName', 'inputPickup', 'inputPlaylistOther', 'inputFood', 'inputHobbies', 'inputNotDo', 'inputMessage'];
    inputs.forEach(id => {
      const el = $(`#${id}`);
      if (el) {
        el.addEventListener('input', debounce(() => {
          const key = {
            inputName: 'name',
            inputPickup: 'pickupLocation',
            inputPlaylistOther: 'playlistOther',
            inputFood: 'favoriteFood',
            inputHobbies: 'hobbies',
            inputNotDo: 'notToDo',
            inputMessage: 'message',
          }[id];
          if (key) {
            state.formData[key] = el.value;
            saveToStorage();
          }
        }, 300));
      }
    });

    // Custom Places
    dom.addCustomPlace.addEventListener('click', addCustomPlaceEntry);
  }

  // ── Ripple Effect ──
  function createRipple(e, btn) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  // ── Form Navigation ──
  function startForm() {
    dom.heroSection.style.display = 'none';
    dom.formContainer.classList.add('active');
    dom.progressSection.classList.add('active');
    goToStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToStep(step) {
    // Hide all steps
    $$('.form-step').forEach(s => s.classList.remove('active'));

    // Show target step
    const target = $(`#step${step}`);
    if (target) {
      target.classList.add('active');
      state.currentStep = step;
      updateProgress();
      saveToStorage();

      // Scroll to top of form
      window.scrollTo({ top: dom.progressSection.offsetTop - 10, behavior: 'smooth' });
    }
  }

  function updateProgress() {
    const pct = (state.currentStep / TOTAL_STEPS) * 100;
    dom.progressFill.style.width = pct + '%';
    dom.progressLabel.textContent = `Question ${state.currentStep} / ${TOTAL_STEPS}`;
    dom.progressSection.setAttribute('aria-valuenow', state.currentStep);
  }

  // ── Validation ──
  function validateStep(step) {
    switch (step) {
      case 1:
        if (!$('#inputName').value.trim()) {
          showError('inputName', 'errorName');
          return false;
        }
        state.formData.name = $('#inputName').value.trim();
        return true;

      case 2:
        if (state.formData.dateMode === 'calendar') {
          if (state.formData.dates.length === 0) {
            showErrorGroup('calendarSection', 'errorDate');
            return false;
          }
        } else {
          if (state.formData.weekdays.length === 0) {
            showErrorGroup('weekdaysSection', 'errorDate');
            return false;
          }
        }
        return true;

      case 3:
        if (state.formData.timePeriods.length === 0) {
          showErrorGroup('timeOptions', 'errorTime');
          return false;
        }
        return true;

      case 4:
        if (!$('#inputPickup').value.trim()) {
          showError('inputPickup', 'errorPickup');
          return false;
        }
        state.formData.pickupLocation = $('#inputPickup').value.trim();
        return true;

      case 5:
        if (state.formData.selectedPlaces.length === 0 && state.formData.customPlaces.length === 0 && !state.formData.isSurprise) {
          showErrorGroup('placeGrid', 'errorPlaces');
          return false;
        }
        return true;

      case 6:
        return true;

      case 11:
        // Confirmation is validated on submit
        return true;

      default:
        return true;
    }
  }

  function showError(inputId, errorId) {
    if (inputId) {
      const input = $(`#${inputId}`);
      input.classList.add('error');
      input.addEventListener('input', () => {
        input.classList.remove('error');
        clearError(errorId);
      }, { once: true });
    }
    const error = $(`#${errorId}`);
    if (error) error.classList.add('visible');
  }

  function showErrorGroup(groupId, errorId) {
    const group = $(`#${groupId}`);
    if (group) group.classList.add('error');
    const error = $(`#${errorId}`);
    if (error) error.classList.add('visible');
    setTimeout(() => {
      if (group) group.classList.remove('error');
    }, 600);
  }

  function clearError(errorId) {
    const error = $(`#${errorId}`);
    if (error) error.classList.remove('visible');
  }

  // ── Surprise Option ──
  function handleSurprise(card) {
    if (state.formData.isSurprise) {
      // Deselect surprise
      state.formData.isSurprise = false;
      card.classList.remove('selected');
      card.setAttribute('aria-pressed', 'false');
      dom.surpriseMsg.classList.remove('active');
      dom.prioritySection.classList.toggle('active', state.formData.selectedPlaces.length > 0);
    } else {
      // Select surprise — deselect all others
      state.formData.isSurprise = true;
      state.formData.selectedPlaces = [];

      dom.placeGrid.querySelectorAll('.place-card').forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');

      dom.prioritySection.classList.remove('active');
      dom.surpriseMsg.classList.add('active');
    }
    clearError('errorPlaces');
    saveToStorage();
  }

  // ── Priority List ──
  function updatePriorityList() {
    const allPlaces = [...state.formData.selectedPlaces];

    // Add custom places
    state.formData.customPlaces.forEach(cp => {
      allPlaces.push('custom_' + cp.id);
    });

    if (allPlaces.length === 0 || state.formData.isSurprise) {
      dom.prioritySection.classList.remove('active');
      return;
    }

    dom.prioritySection.classList.add('active');

    // Maintain existing order where possible
    const existingOrder = state.formData.priorityOrder.filter(p => allPlaces.includes(p));
    const newPlaces = allPlaces.filter(p => !existingOrder.includes(p));
    state.formData.priorityOrder = [...existingOrder, ...newPlaces];

    renderPriorityList();
  }

  function renderPriorityList() {
    dom.priorityList.innerHTML = '';

    state.formData.priorityOrder.forEach((placeKey, index) => {
      const li = document.createElement('li');
      li.className = 'priority-item';
      li.dataset.place = placeKey;

      let emoji, name;
      if (placeKey.startsWith('custom_')) {
        const cp = state.formData.customPlaces.find(c => 'custom_' + c.id === placeKey);
        emoji = '📍';
        name = cp ? cp.name : 'Custom Place';
      } else {
        const data = PLACE_DATA[placeKey];
        emoji = data ? data.emoji : '📍';
        name = data ? data.name : placeKey;
      }

      const rankEmoji = RANK_EMOJIS[index] || `#${index + 1}`;

      li.innerHTML = `
        <span class="priority-item__rank">${rankEmoji}</span>
        <span class="priority-item__emoji">${emoji}</span>
        <span class="priority-item__name">${name}</span>
        <div class="preference-tags" data-place="${placeKey}">
          ${PREFERENCE_OPTIONS.map(opt =>
        `<span class="preference-tag ${state.formData.placePreferences[placeKey] === opt.key ? 'active' : ''}" data-pref="${opt.key}">${opt.emoji} ${opt.label}</span>`
      ).join('')}
        </div>
        <span class="priority-item__drag">⠿</span>
      `;

      dom.priorityList.appendChild(li);
    });

    // Add preference tag click handlers
    dom.priorityList.querySelectorAll('.preference-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = tag.closest('.preference-tags');
        const placeKey = container.dataset.place;
        const pref = tag.dataset.pref;

        container.querySelectorAll('.preference-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        state.formData.placePreferences[placeKey] = pref;
        saveToStorage();
      });
    });

    // Init Sortable
    if (state.sortableInstance) {
      state.sortableInstance.destroy();
    }

    if (typeof Sortable !== 'undefined') {
      state.sortableInstance = Sortable.create(dom.priorityList, {
        animation: 300,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.priority-item__drag',
        onEnd: () => {
          // Update priority order
          const items = dom.priorityList.querySelectorAll('.priority-item');
          state.formData.priorityOrder = Array.from(items).map(item => item.dataset.place);

          // Update rank emojis
          items.forEach((item, i) => {
            const rankEl = item.querySelector('.priority-item__rank');
            rankEl.textContent = RANK_EMOJIS[i] || `#${i + 1}`;
          });

          saveToStorage();
        }
      });
    }
  }

  // ── Custom Places ──
  function addCustomPlaceEntry() {
    state.customPlaceCounter++;
    const id = state.customPlaceCounter;

    const item = document.createElement('div');
    item.className = 'custom-place-item';
    item.dataset.customId = id;
    item.innerHTML = `
      <button class="remove-btn" aria-label="Remove custom place" data-remove="${id}">✕</button>
      <input type="text" class="form-input" placeholder="Place Name" data-field="name" data-id="${id}" aria-label="Custom place name">
      <input type="text" class="form-input" placeholder="Address (optional)" data-field="address" data-id="${id}" aria-label="Custom place address">
      <input type="text" class="form-input" placeholder="Reason — Vì sao em muốn đến đây?" data-field="reason" data-id="${id}" aria-label="Reason">
    `;

    dom.customPlacesList.appendChild(item);

    // Add to state
    state.formData.customPlaces.push({ id, name: '', address: '', reason: '' });

    // Event: remove
    item.querySelector('.remove-btn').addEventListener('click', () => {
      state.formData.customPlaces = state.formData.customPlaces.filter(cp => cp.id !== id);
      state.formData.priorityOrder = state.formData.priorityOrder.filter(p => p !== 'custom_' + id);
      item.remove();
      updatePriorityList();
      saveToStorage();
    });

    // Event: input changes
    item.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', debounce(() => {
        const cp = state.formData.customPlaces.find(c => c.id === id);
        if (cp) {
          cp[input.dataset.field] = input.value;
          if (input.dataset.field === 'name') {
            updatePriorityList();
          }
          saveToStorage();
        }
      }, 300));
    });

    updatePriorityList();
    clearError('errorPlaces');
    saveToStorage();
  }

  // ── Calendar Rendering ──
  function renderCalendar() {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    dom.calendarMonthYear.textContent = `${monthNames[state.currentMonth]}, ${state.currentYear}`;

    // Clear days
    dom.calendarDays.innerHTML = '';

    // First day of month (0-6 starting from Sunday)
    const firstDayIndex = new Date(state.currentYear, state.currentMonth, 1).getDay();
    // Map Sun(0) to index 6, Mon(1) to index 0, Tue(2) to index 1, etc.
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Days in current month
    const totalDays = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();

    // Today date string (YYYY-MM-DD)
    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

    // Render empty spaces for offset
    for (let i = 0; i < startOffset; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      dom.calendarDays.appendChild(emptyDiv);
    }

    // Render days
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      dayDiv.textContent = day;

      const dayDate = new Date(state.currentYear, state.currentMonth, day);
      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      dayDiv.dataset.date = dateStr;

      // Check if disabled (past dates)
      if (dateStr < todayStr) {
        dayDiv.classList.add('disabled');
      } else {
        // Check if selected
        if (state.formData.dates.includes(dateStr)) {
          dayDiv.classList.add('selected');
          dayDiv.setAttribute('aria-pressed', 'true');
        }
      }

      dom.calendarDays.appendChild(dayDiv);
    }

    updateDatesPreview();
  }

  function updateDatesPreview() {
    if (!dom.selectedDatesPreview) return;
    if (state.formData.dates.length === 0) {
      dom.selectedDatesPreview.textContent = 'Chưa chọn ngày nào';
      return;
    }

    // Sort selected dates
    const sorted = [...state.formData.dates].sort();
    const formatted = sorted.map(d => {
      const parts = d.split('-');
      return `${parts[2]}/${parts[1]}`;
    });

    dom.selectedDatesPreview.textContent = 'Đã chọn: ' + formatted.join(', ');
  }

  function checkAndCleanLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // If localStorage has the old date structure or references to budget/outfit, clear it!
        if (data && data.formData && (data.formData.hasOwnProperty('budget') || data.formData.hasOwnProperty('outfit') || !data.formData.hasOwnProperty('vibes'))) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // ── Submit ──
  function handleSubmit() {
    // Final validation
    if (!state.formData.confirmed) {
      showError(null, 'errorConfirm');
      dom.confirmCheckbox.classList.add('error');
      dom.confirmCheckbox.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        dom.confirmCheckbox.style.animation = '';
        dom.confirmCheckbox.classList.remove('error');
      }, 600);
      return;
    }

    // Collect remaining fields
    state.formData.playlistOther = $('#inputPlaylistOther').value;
    state.formData.favoriteFood = $('#inputFood').value;
    state.formData.hobbies = $('#inputHobbies').value;
    state.formData.notToDo = $('#inputNotDo').value;
    state.formData.message = $('#inputMessage').value;

    saveToStorage();

    // Format fields for Google Sheets submission (human-readable string formats)
    const d = state.formData;

    // 1. Format dates/weekdays
    let dateDisplay = '—';
    if (d.dateMode === 'calendar' && d.dates.length > 0) {
      dateDisplay = d.dates.map(dt =>
        new Date(dt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      ).join(', ');
    } else if (d.dateMode === 'weekdays' && d.weekdays.length > 0) {
      const translateMap = {
        Mon: 'Thứ 2',
        Tue: 'Thứ 3',
        Wed: 'Thứ 4',
        Thu: 'Thứ 5',
        Fri: 'Thứ 6',
        Sat: 'Thứ 7',
        Sun: 'Chủ Nhật'
      };
      dateDisplay = 'Các thứ rảnh hàng tuần: ' + d.weekdays.map(w => translateMap[w] || w).join(', ');
    }

    // 2. Format time periods
    const timePeriodLabels = {
      morning: '🌅 Buổi sáng',
      afternoon: '☀️ Buổi trưa',
      evening: '🌇 Buổi chiều',
      night: '🌙 Buổi tối',
    };
    const timeDisplay = d.timePeriods.map(t => timePeriodLabels[t]).filter(Boolean).join(', ') || '—';

    // 3. Format places with drag-drop priority and preference tags
    const placesText = d.isSurprise
      ? '✨ Surprise Me — I trust you ❤️'
      : d.priorityOrder.map((p, i) => {
        const emoji = RANK_EMOJIS[i] || `#${i + 1}`;
        let name;
        if (p.startsWith('custom_')) {
          const cp = d.customPlaces.find(c => 'custom_' + c.id === p);
          name = cp ? cp.name : 'Custom';
        } else {
          name = PLACE_DATA[p] ? `${PLACE_DATA[p].emoji} ${PLACE_DATA[p].name}` : p;
        }
        const pref = d.placePreferences[p];
        const prefLabel = pref ? PREFERENCE_OPTIONS.find(o => o.key === pref) : null;
        return `${emoji} ${name}${prefLabel ? ` — ${prefLabel.emoji} ${prefLabel.label}` : ''}`;
      }).join('\n');

    // 4. Format playlist
    const playlistText = [
      ...d.playlist.map(p => {
        const labels = { taylor: '🎤 Taylor Swift', iu: '🌸 IU', lofi: '🎧 Lofi', usuk: '🇺🇸 US-UK', kpop: '💜 Kpop' };
        return labels[p] || p;
      }),
      ...(d.playlistOther ? [d.playlistOther] : [])
    ].join(', ') || '—';

    // 5. Format vibes
    const vibeLabels = {
      romantic: '💖 Lãng mạn',
      cozy: '🕯️ Ấm cúng, yên tĩnh',
      active: '🎮 Sôi động, náo nhiệt',
      nature: '🌳 Gần gũi thiên nhiên',
      surprise: '🎁 Bất ngờ',
    };
    const vibeDisplay = d.vibes.map(v => vibeLabels[v] || v).join(', ') || '—';

    // Build final payload
    const payload = {
      name: d.name,
      dates: dateDisplay,
      timePeriods: timeDisplay,
      pickupLocation: d.pickupLocation || '—',
      places: placesText,
      favoriteFood: d.favoriteFood || '—',
      playlist: playlistText,
      hobbies: d.hobbies || '—',
      vibes: vibeDisplay,
      notToDo: d.notToDo || '—',
      message: d.message || '—'
    };

    // Hide previous error if any
    if (dom.errorSubmit) {
      dom.errorSubmit.classList.remove('visible');
    }

    // Fallback if URL is not configured
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL is not set. Falling back to local success mode.');
      showSuccess();
      return;
    }

    // Set loading state on button
    setSubmitButtonLoading(true);

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // standard workaround for Google Web App CORS & redirect constraints
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(payload)
    })
      .then(() => {
        setSubmitButtonLoading(false);
        showSuccess();
      })
      .catch(err => {
        console.error('Error submitting form to Google Sheets:', err);
        setSubmitButtonLoading(false);
        if (dom.errorSubmit) {
          dom.errorSubmit.classList.add('visible');
        }
      });
  }

  function setSubmitButtonLoading(isLoading) {
    if (isLoading) {
      dom.submitBtn.classList.add('loading');
      dom.submitBtn.disabled = true;
      dom.submitBtn.dataset.originalText = dom.submitBtn.textContent;
      dom.submitBtn.textContent = '💖 Đang gửi đi...';
    } else {
      dom.submitBtn.classList.remove('loading');
      dom.submitBtn.disabled = false;
      if (dom.submitBtn.dataset.originalText) {
        dom.submitBtn.textContent = dom.submitBtn.dataset.originalText;
      }
    }
  }

  // ── Success Screen ──
  function showSuccess() {
    dom.formContainer.classList.remove('active');
    dom.progressSection.classList.remove('active');
    dom.successScreen.classList.add('active');

    // Confetti
    if (typeof confetti === 'function') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff4d94', '#ffb3d1', '#c9b1f0', '#ffd1a8', '#ff80b5'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff4d94', '#ffb3d1', '#c9b1f0', '#ffd1a8', '#ff80b5'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }


  // ── Summary ──
  function showSummary() {
    dom.successScreen.classList.remove('active');
    dom.summaryScreen.classList.add('active');

    const timePeriodLabels = {
      morning: '🌅 Buổi sáng',
      afternoon: '☀️ Buổi trưa',
      evening: '🌇 Buổi chiều',
      night: '🌙 Buổi tối',
    };

    const vibeLabels = {
      romantic: '💖 Lãng mạn',
      cozy: '🕯️ Ấm cúng, yên tĩnh',
      active: '🎮 Sôi động, náo nhiệt',
      nature: '🌳 Gần gũi thiên nhiên',
      surprise: '🎁 Bất ngờ',
    };

    const d = state.formData;

    // Format dates for display
    let dateDisplay = '—';
    if (d.dateMode === 'calendar' && d.dates.length > 0) {
      dateDisplay = d.dates.map(dt =>
        new Date(dt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      ).join('<br>');
    } else if (d.dateMode === 'weekdays' && d.weekdays.length > 0) {
      const translateMap = {
        Mon: 'Thứ 2',
        Tue: 'Thứ 3',
        Wed: 'Thứ 4',
        Thu: 'Thứ 5',
        Fri: 'Thứ 6',
        Sat: 'Thứ 7',
        Sun: 'Chủ Nhật'
      };
      dateDisplay = 'Các thứ rảnh hàng tuần: ' + d.weekdays.map(w => translateMap[w] || w).join(', ');
    }

    // Format time periods
    const timeDisplay = d.timePeriods.map(t => timePeriodLabels[t]).filter(Boolean).join(', ') || '—';

    const placesText = d.isSurprise
      ? '✨ Surprise Me — I trust you ❤️'
      : d.priorityOrder.map((p, i) => {
        const emoji = RANK_EMOJIS[i] || `#${i + 1}`;
        let name;
        if (p.startsWith('custom_')) {
          const cp = d.customPlaces.find(c => 'custom_' + c.id === p);
          name = cp ? cp.name : 'Custom';
        } else {
          name = PLACE_DATA[p] ? `${PLACE_DATA[p].emoji} ${PLACE_DATA[p].name}` : p;
        }
        const pref = d.placePreferences[p];
        const prefLabel = pref ? PREFERENCE_OPTIONS.find(o => o.key === pref) : null;
        return `${emoji} ${name}${prefLabel ? ` — ${prefLabel.emoji} ${prefLabel.label}` : ''}`;
      }).join('<br>');

    const playlistText = [
      ...d.playlist.map(p => {
        const labels = { taylor: '🎤 Taylor Swift', iu: '🌸 IU', lofi: '🎧 Lofi', usuk: '🇺🇸 US-UK', kpop: '💜 Kpop' };
        return labels[p] || p;
      }),
      ...(d.playlistOther ? [d.playlistOther] : [])
    ].join(', ') || '—';

    const vibeDisplay = d.vibes.map(v => vibeLabels[v] || v).join(', ') || '—';

    const items = [
      { label: '💕 Tên', value: d.name },
      { label: '📅 Ngày hẹn', value: dateDisplay },
      { label: '🕐 Khoảng thời gian', value: timeDisplay },
      { label: '📍 Địa điểm đón', value: d.pickupLocation || '—' },
      { label: '🗺️ Gợi ý địa điểm', value: placesText },
      { label: '🍽️ Gu ăn uống', value: d.favoriteFood || '—' },
      { label: '🎵 Playlist', value: playlistText },
      { label: '🎨 Sở thích lúc rảnh', value: d.hobbies || '—' },
      { label: '🌌 Không gian date', value: vibeDisplay },
      { label: '🚫 Không nên làm', value: d.notToDo || '—' },
      { label: '💌 Lời nhắn', value: d.message || '—' },
    ];

    dom.summaryScreen.innerHTML = `
      <div class="glass-card">
        <h2 class="section-title">📋 Tổng hợp câu trả lời</h2>
        ${items.map(item => `
          <div class="summary-card">
            <div class="summary-card__label">${item.label}</div>
            <div class="summary-card__value">${item.value}</div>
          </div>
        `).join('')}
        <div class="nav-buttons" style="margin-top: var(--space-xl);">
          <button class="btn btn--secondary" id="backToSuccessBtn">← Quay lại</button>
          <button class="btn btn--primary" id="exportFromSummaryBtn">📥 Export JSON</button>
        </div>
      </div>
    `;

    // Event listeners for summary buttons
    $('#backToSuccessBtn').addEventListener('click', () => {
      dom.summaryScreen.classList.remove('active');
      dom.successScreen.classList.add('active');
    });
    $('#exportFromSummaryBtn').addEventListener('click', exportJSON);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Edit Again ──
  function editAgain() {
    dom.successScreen.classList.remove('active');
    dom.summaryScreen.classList.remove('active');
    dom.formContainer.classList.add('active');
    dom.progressSection.classList.add('active');
    goToStep(1);
  }

  // ── Export JSON ──
  function exportJSON() {
    const data = JSON.stringify(state.formData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `date-invitation-${state.formData.name || 'data'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Local Storage ──
  function saveToStorage() {
    try {
      const data = {
        formData: state.formData,
        currentStep: state.currentStep,
        customPlaceCounter: state.customPlaceCounter,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Storage full or unavailable
    }
  }

  function restoreFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);
      if (!data || !data.formData) return;

      Object.assign(state.formData, data.formData);
      state.customPlaceCounter = data.customPlaceCounter || 0;

      // Restore form values
      if (state.formData.name) $('#inputName').value = state.formData.name;
      if (state.formData.pickupLocation) $('#inputPickup').value = state.formData.pickupLocation;
      if (state.formData.playlistOther) $('#inputPlaylistOther').value = state.formData.playlistOther;
      if (state.formData.favoriteFood) $('#inputFood').value = state.formData.favoriteFood;
      if (state.formData.hobbies) $('#inputHobbies').value = state.formData.hobbies;
      if (state.formData.notToDo) $('#inputNotDo').value = state.formData.notToDo;
      if (state.formData.message) $('#inputMessage').value = state.formData.message;

      // Restore date mode
      if (state.formData.dateMode === 'weekdays') {
        const weekdaysCard = dom.dateModeOptions.querySelector('[data-value="weekdays"]');
        const calendarCard = dom.dateModeOptions.querySelector('[data-value="calendar"]');
        if (weekdaysCard) { weekdaysCard.classList.add('selected'); weekdaysCard.setAttribute('aria-pressed', 'true'); }
        if (calendarCard) { calendarCard.classList.remove('selected'); calendarCard.setAttribute('aria-pressed', 'false'); }
        dom.calendarSection.style.display = 'none';
        dom.weekdaysSection.style.display = '';

        // Restore weekday chips selection
        if (state.formData.weekdays && state.formData.weekdays.length > 0) {
          state.formData.weekdays.forEach(val => {
            const chip = dom.weekdayChips.querySelector(`[data-value="${val}"]`);
            if (chip) {
              chip.classList.add('selected');
              chip.setAttribute('aria-pressed', 'true');
            }
          });
        }
      } else {
        // calendar mode is default
        // renderCalendar() will check state.formData.dates and apply selected classes automatically
      }

      // Restore time periods (multi-select)
      if (state.formData.timePeriods && state.formData.timePeriods.length > 0) {
        state.formData.timePeriods.forEach(val => {
          const card = dom.timeOptions.querySelector(`[data-value="${val}"]`);
          if (card) {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
          }
        });
      }

      // Restore selected places
      state.formData.selectedPlaces.forEach(place => {
        const card = dom.placeGrid.querySelector(`[data-place="${place}"]`);
        if (card) {
          card.classList.add('selected');
          card.setAttribute('aria-pressed', 'true');
        }
      });

      // Restore surprise
      if (state.formData.isSurprise) {
        const surpriseCard = dom.placeGrid.querySelector('[data-place="surprise"]');
        if (surpriseCard) {
          surpriseCard.classList.add('selected');
          surpriseCard.setAttribute('aria-pressed', 'true');
        }
        dom.surpriseMsg.classList.add('active');
      }

      // Restore custom places
      state.formData.customPlaces.forEach(cp => {
        const item = document.createElement('div');
        item.className = 'custom-place-item';
        item.dataset.customId = cp.id;
        item.innerHTML = `
          <button class="remove-btn" aria-label="Remove custom place" data-remove="${cp.id}">✕</button>
          <input type="text" class="form-input" placeholder="Place Name" data-field="name" data-id="${cp.id}" value="${escapeHtml(cp.name)}" aria-label="Custom place name">
          <input type="text" class="form-input" placeholder="Address (optional)" data-field="address" data-id="${cp.id}" value="${escapeHtml(cp.address || '')}" aria-label="Custom place address">
          <input type="text" class="form-input" placeholder="Reason" data-field="reason" data-id="${cp.id}" value="${escapeHtml(cp.reason || '')}" aria-label="Reason">
        `;
        dom.customPlacesList.appendChild(item);

        item.querySelector('.remove-btn').addEventListener('click', () => {
          state.formData.customPlaces = state.formData.customPlaces.filter(c => c.id !== cp.id);
          state.formData.priorityOrder = state.formData.priorityOrder.filter(p => p !== 'custom_' + cp.id);
          item.remove();
          updatePriorityList();
          saveToStorage();
        });

        item.querySelectorAll('.form-input').forEach(input => {
          input.addEventListener('input', debounce(() => {
            const c = state.formData.customPlaces.find(x => x.id === cp.id);
            if (c) {
              c[input.dataset.field] = input.value;
              if (input.dataset.field === 'name') updatePriorityList();
              saveToStorage();
            }
          }, 300));
        });
      });

      // Restore playlist
      state.formData.playlist.forEach(val => {
        const chip = dom.playlistChips.querySelector(`[data-value="${val}"]`);
        if (chip) {
          chip.classList.add('selected');
          chip.setAttribute('aria-pressed', 'true');
        }
      });

      // Restore vibes
      if (state.formData.vibes && state.formData.vibes.length > 0) {
        state.formData.vibes.forEach(val => {
          const chip = dom.vibeChips.querySelector(`[data-value="${val}"]`);
          if (chip) {
            chip.classList.add('selected');
            chip.setAttribute('aria-pressed', 'true');
          }
        });
      }

      // Restore confirmation
      if (state.formData.confirmed) {
        dom.confirmCheckbox.classList.add('checked');
        dom.confirmCheckbox.setAttribute('aria-checked', 'true');
        dom.confirmBox.textContent = '✓';
      }

      // Restore priority list
      if (!state.formData.isSurprise && (state.formData.selectedPlaces.length > 0 || state.formData.customPlaces.length > 0)) {
        updatePriorityList();
      }

    } catch (e) {
      // Corrupted data
    }
  }

  // ── Scroll Reveal ──
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  // ── Utilities ──
  function formatVND(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Start ──
  document.addEventListener('DOMContentLoaded', init);
})();
