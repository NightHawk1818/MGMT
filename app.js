/* =====================================================================
   EduCore LMS — app.js
   Full single-page application logic
   ===================================================================== */

const STORAGE_KEY = 'educore_v2';

// ── Default seed data ──────────────────────────────────────────────────
const SEED = {
  users: [
    { id:'u1', name:'Dr. Sarah Johnson', email:'sarah@edu.com', password:'edu123', role:'educator', avatar:'SJ', bio:'Computer Science & Mathematics Professor' },
    { id:'u2', name:'Alex Chen',         email:'alex@student.com', password:'stu123', role:'student', avatar:'AC', year:3, avatarColor:'#3b82f6' },
    { id:'u3', name:'Maya Patel',         email:'maya@student.com', password:'stu123', role:'student', avatar:'MP', year:2, avatarColor:'#7c3aed' },
    { id:'u4', name:'Jordan Lee',         email:'jordan@student.com',password:'stu123', role:'student', avatar:'JL', year:4, avatarColor:'#10b981' },
    { id:'u5', name:'Priya Sharma',       email:'priya@student.com', password:'stu123', role:'student', avatar:'PS', year:1, avatarColor:'#f59e0b' },
  ],
  courses: [
    { id:'c1', title:'Introduction to Computer Science', code:'CS101', description:'Fundamentals of programming, algorithms, and computational thinking.', educatorId:'u1', color:'#3b82f6', credits:3, schedule:'MWF 9:00–10:00 AM', category:'Computer Science', enrolled:['u2','u3','u4','u5'], room:'Tech Hall 201' },
    { id:'c2', title:'Calculus II',                      code:'MATH201',description:'Integration techniques, series, and multivariable calculus.',         educatorId:'u1', color:'#7c3aed', credits:4, schedule:'TTh 11:00 AM–1:00 PM',category:'Mathematics',       enrolled:['u2','u3','u4'],        room:'Math Bldg 105'  },
    { id:'c3', title:'Technical Writing',                code:'ENG110', description:'Professional communication strategies for technical audiences.',       educatorId:'u1', color:'#10b981', credits:2, schedule:'MWF 2:00–3:00 PM',  category:'English',            enrolled:['u2','u5'],             room:'Liberal Arts 302'},
  ],
  assignments: [
    { id:'a1', courseId:'c1', title:'Python Basics Quiz',          description:'Variables, data types, loops, and functions.',        dueDate:'2024-03-15', maxGrade:100, submissions:[
        { studentId:'u2', content:'Completed all exercises with full test coverage.',   grade:88,  feedback:'Great work! Minor issues with edge cases.', gradedAt:'2024-03-16' },
        { studentId:'u3', content:'Submitted solutions for all problems.',             grade:75,  feedback:'Needs more work on loops. Resubmit optional.', gradedAt:'2024-03-16' },
        { studentId:'u4', content:'Optimised solutions with detailed docstrings.',     grade:97,  feedback:'Outstanding! Perfect score on functions.', gradedAt:'2024-03-16' },
        { studentId:'u5', content:'Basic solutions completed.',                        grade:null, feedback:'', gradedAt:null },
    ]},
    { id:'a2', courseId:'c1', title:'Data Structures Project',     description:'Implement a linked list, stack, and binary search tree in Python.', dueDate:'2024-04-01', maxGrade:100, submissions:[
        { studentId:'u2', content:'Full implementation with unit tests.',              grade:93,  feedback:'Excellent work!', gradedAt:'2024-04-02' },
        { studentId:'u4', content:'All data structures with time-complexity analysis.',grade:100, feedback:'Perfect!', gradedAt:'2024-04-02' },
    ]},
    { id:'a3', courseId:'c2', title:'Integration Problem Set',     description:'Solve 20 integration problems using various techniques.', dueDate:'2024-03-20', maxGrade:100, submissions:[
        { studentId:'u2', content:'All 20 problems solved with working.',              grade:85,  feedback:'Good understanding. Watch sign errors.', gradedAt:'2024-03-21' },
        { studentId:'u3', content:'18/20 problems completed.',                         grade:70,  feedback:'Partial credit on 2 problems.', gradedAt:'2024-03-21' },
        { studentId:'u4', content:'Perfect solutions with alternative methods shown.', grade:100, feedback:'Excellent!', gradedAt:'2024-03-21' },
    ]},
    { id:'a4', courseId:'c3', title:'Technical Report Draft',      description:'Write a 5-page technical report on a computing topic of your choice.', dueDate:'2024-03-25', maxGrade:100, submissions:[
        { studentId:'u2', content:'Report on AI in Healthcare – 5 pages.',             grade:null, feedback:'', gradedAt:null },
    ]},
    { id:'a5', courseId:'c1', title:'Algorithms Mid-Term',         description:'Sorting, searching, and Big-O notation.', dueDate:'2024-04-15', maxGrade:100, submissions:[] },
    { id:'a6', courseId:'c2', title:'Series Convergence Homework', description:'Determine convergence for 15 series.', dueDate:'2024-04-10', maxGrade:100, submissions:[] },
  ],
  announcements: [
    { id:'an1', courseId:'c1', educatorId:'u1', title:'Midterm Exam Scheduled', content:'The midterm will be held on April 10th in Tech Hall 201. Please review chapters 1–8 and practice all lab exercises.', date:'2024-03-10', important:true },
    { id:'an2', courseId:'c2', educatorId:'u1', title:'Office Hours Updated', content:'Office hours this week move to Thursday 3–5 PM. Normal schedule resumes next week.', date:'2024-03-12', important:false },
    { id:'an3', courseId:'c1', educatorId:'u1', title:'Extra Lab Session Added', content:'An additional lab session has been scheduled for Friday at 4 PM in the computer lab. Attendance is optional but highly recommended.', date:'2024-03-08', important:false },
    { id:'an4', courseId:'c3', educatorId:'u1', title:'Guest Lecture this Friday', content:'We have a guest lecturer from TechCorp joining us this Friday. Please read their paper linked on the portal.', date:'2024-03-14', important:true },
  ],
  notes: [
    { id:'n1', studentId:'u2', courseId:'c1', content:'Remember: binary search trees – left < root < right. In-order traversal gives sorted output!', color:'#fef3c7', createdAt:'2024-03-01' },
    { id:'n2', studentId:'u2', courseId:'c2', content:'Integration by parts: ∫u dv = uv − ∫v du\nChoose u = LIATE (Log, Inverse trig, Algebraic, Trig, Exponential)', color:'#dbeafe', createdAt:'2024-03-05' },
    { id:'n3', studentId:'u3', courseId:'c1', content:'Common Big-O complexities:\nO(1) < O(log n) < O(n) < O(n log n) < O(n²)', color:'#dcfce7', createdAt:'2024-03-02' },
  ],
  messages: [
    { id:'m1', fromId:'u2', toId:'u1', courseId:'c1', subject:'Question about Data Structures Project', content:"Hi Dr. Johnson, I have a question about the data structures project. Can I use recursion in my binary tree implementation, or should I use an iterative approach?", timestamp:'2024-03-14T10:00:00', read:true, threadId:'t1' },
    { id:'m2', fromId:'u1', toId:'u2', courseId:'c1', subject:'Re: Question about Data Structures Project', content:"Hi Alex! Both approaches are acceptable. Recursive implementations are often more elegant for trees, but make sure to discuss the trade-offs in your write-up. Good luck!", timestamp:'2024-03-14T11:30:00', read:true, threadId:'t1' },
    { id:'m3', fromId:'u3', toId:'u1', courseId:'c2', subject:'Integration techniques help', content:"Professor, I'm struggling with integration by partial fractions. Could you point me to some additional resources?", timestamp:'2024-03-15T09:00:00', read:false, threadId:'t2' },
  ],
  enrollmentRequests: [],
  timetable: [
    { id:'tt1', courseId:'c1', day:'Mon', startHour:'09:00', endHour:'10:00', room:'Tech Hall 201' },
    { id:'tt2', courseId:'c1', day:'Wed', startHour:'09:00', endHour:'10:00', room:'Tech Hall 201' },
    { id:'tt3', courseId:'c1', day:'Fri', startHour:'09:00', endHour:'10:00', room:'Tech Hall 201' },
    { id:'tt4', courseId:'c2', day:'Tue', startHour:'11:00', endHour:'13:00', room:'Math Bldg 105' },
    { id:'tt5', courseId:'c2', day:'Thu', startHour:'11:00', endHour:'13:00', room:'Math Bldg 105' },
    { id:'tt6', courseId:'c3', day:'Mon', startHour:'14:00', endHour:'15:00', room:'Liberal Arts 302' },
    { id:'tt7', courseId:'c3', day:'Wed', startHour:'14:00', endHour:'15:00', room:'Liberal Arts 302' },
    { id:'tt8', courseId:'c3', day:'Fri', startHour:'14:00', endHour:'15:00', room:'Liberal Arts 302' },
  ],
  notifications: [
    { id:'nt1', userId:'u2', type:'grade',        message:'Python Basics Quiz graded: 88/100',         read:false, timestamp:'2024-03-16T09:00:00' },
    { id:'nt2', userId:'u2', type:'announcement',  message:'New announcement in CS101: Midterm Exam',   read:false, timestamp:'2024-03-10T08:00:00' },
    { id:'nt3', userId:'u2', type:'message',       message:'Dr. Johnson replied to your message',        read:true,  timestamp:'2024-03-14T11:30:00' },
    { id:'nt4', userId:'u3', type:'grade',         message:'Integration Problem Set graded: 70/100',    read:false, timestamp:'2024-03-21T10:00:00' },
    { id:'nt5', userId:'u4', type:'grade',         message:'Python Basics Quiz graded: 97/100',         read:false, timestamp:'2024-03-16T09:05:00' },
    { id:'nt1b',userId:'u1', type:'assignment',    message:'Alex Chen submitted Technical Report Draft',read:false, timestamp:'2024-03-20T14:00:00' },
  ],
};

// ── Helper: avatar background colour from initials ────────────────────
const AVATAR_COLORS = ['#3b82f6','#7c3aed','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899'];
function avatarColor(str) {
  let h = 0; for (let c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ════════════════════════════════════════════════════════════════════════
const App = {
  state: {
    user: null,
    theme: 'dark',
    section: 'dashboard',
    activeMessageThread: null,
    coursesFilter: 'all',
  },

  // ── Storage ──────────────────────────────────────────────────────────
  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = JSON.parse(JSON.stringify(SEED));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const data = JSON.parse(raw);
    // Ensure all required collections exist (guards against stale/partial data)
    const collections = ['users','courses','assignments','announcements','notes','messages','notifications','enrollmentRequests','timetable'];
    let changed = false;
    collections.forEach(key => {
      if (!Array.isArray(data[key])) { data[key] = JSON.parse(JSON.stringify(SEED[key])); changed = true; }
    });
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  },
  save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); },

  // ── Boot ─────────────────────────────────────────────────────────────
  init() {
    // Ensure data exists
    this.load();

    // Restore theme
    const savedTheme = localStorage.getItem('educore_theme') || 'dark';
    this.state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeUI();

    // Check logged-in
    const savedUser = localStorage.getItem('educore_session');
    if (savedUser) {
      const db = this.load();
      const u = db.users.find(x => x.id === savedUser);
      if (u) { this.state.user = u; this.showApp(); return; }
    }
    this.showAuth();
    this.bindAuth();
  },

  // ── Auth ─────────────────────────────────────────────────────────────
  showAuth() {
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  },
  showApp() {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    this.buildSidebar();
    this.updateTopbar();
    this.updateNotifBadge();
    this.navigate(this.state.section);
    this.bindApp();
  },

  bindAuth() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset.tab;
        document.getElementById('login-form').classList.toggle('hidden', which !== 'login');
        document.getElementById('signup-form').classList.toggle('hidden', which !== 'signup');
        document.getElementById('login-error').classList.add('hidden');
        document.getElementById('signup-error').classList.add('hidden');
      });
    });

    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-password').value;
      const db = this.load();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
      if (!user) {
        const err = document.getElementById('login-error');
        err.textContent = '❌ Invalid email or password.';
        err.classList.remove('hidden');
        return;
      }
      this.state.user = user;
      localStorage.setItem('educore_session', user.id);
      this.showApp();
    });

    document.getElementById('signup-form').addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const pass  = document.getElementById('signup-password').value;
      const role  = document.querySelector('input[name="signup-role"]:checked').value;
      const err   = document.getElementById('signup-error');
      err.classList.add('hidden');
      if (!name || !email || !pass) { err.textContent='❌ All fields required.'; err.classList.remove('hidden'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent='❌ Please enter a valid email address.'; err.classList.remove('hidden'); return; }
      if (pass.length < 6) { err.textContent='❌ Password must be at least 6 characters.'; err.classList.remove('hidden'); return; }
      const db = this.load();
      if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        err.textContent='❌ Email already registered. Try signing in instead.'; err.classList.remove('hidden'); return;
      }
      const initials = name.split(' ').filter(Boolean).map(w=>w[0]).join('').toUpperCase().slice(0,2);
      const newUser = {
        id: 'u' + Date.now(),
        name, email, password: pass, role,
        avatar: initials,
        avatarColor: avatarColor(name),
        year: 1,
        bio: role === 'educator' ? 'Educator' : 'Student'
      };
      db.users.push(newUser);
      this.save(db);
      this.state.user = newUser;
      localStorage.setItem('educore_session', newUser.id);
      this.showApp();
      this.toast('Welcome to EduCore, ' + name.split(' ')[0] + '! 🎉', 'success');
    });
  },

  logout() {
    localStorage.removeItem('educore_session');
    this.state.user = null;
    this.state.section = 'dashboard';
    this.state.activeMessageThread = null;
    this._appBound = false;
    document.getElementById('profile-dropdown').classList.remove('open');
    this.showAuth();
  },

  // ── Sidebar ───────────────────────────────────────────────────────────
  buildSidebar() {
    const u = this.state.user;
    const avEl = document.getElementById('sb-avatar');
    avEl.textContent = u.avatar;
    avEl.style.background = u.avatarColor || avatarColor(u.name);
    avEl.style.color = 'white';
    document.getElementById('sb-name').textContent = u.name;
    const rb = document.getElementById('sb-role-badge');
    rb.textContent = u.role === 'educator' ? '👩‍🏫 Educator' : '🎓 Student';
    rb.className = 'sb-user-role ' + (u.role === 'educator' ? 'role-educator' : 'role-student');

    const nav = document.getElementById('sb-nav');
    const items = u.role === 'educator' ? [
      { section:'dashboard',      icon:'🏠', label:'Dashboard' },
      { section:'manage-courses', icon:'📚', label:'Manage Courses' },
      { section:'assignments',    icon:'📝', label:'Assignments' },
      { section:'announcements',  icon:'📢', label:'Announcements' },
      { section:'messages',       icon:'✉️',  label:'Messages', badge: this.unreadMessageCount() },
      { section:'timetable',      icon:'📅', label:'Timetable' },
      { section:'progress',       icon:'📊', label:'Progress Tracker' },
    ] : [
      { section:'dashboard',     icon:'🏠', label:'Dashboard' },
      { section:'courses',       icon:'📚', label:'My Courses' },
      { section:'assignments',   icon:'📝', label:'Assignments' },
      { section:'grades',        icon:'🏆', label:'My Grades' },
      { section:'leaderboard',   icon:'🥇', label:'Leaderboard' },
      { section:'notes',         icon:'📓', label:'My Notes' },
      { section:'timetable',     icon:'📅', label:'Timetable' },
      { section:'announcements', icon:'📢', label:'Announcements' },
      { section:'messages',      icon:'✉️',  label:'Messages', badge: this.unreadMessageCount() },
      { section:'progress',      icon:'📊', label:'Progress' },
    ];

    nav.innerHTML = items.map(it => `
      <div class="nav-item ${this.state.section === it.section ? 'active':''}" data-section="${it.section}">
        <span class="nav-icon">${it.icon}</span>
        <span>${it.label}</span>
        ${it.badge ? `<span class="nav-badge">${it.badge}</span>` : ''}
      </div>
    `).join('');
  },

  unreadMessageCount() {
    const db = this.load(); const uid = this.state.user.id;
    return db.messages.filter(m => m.toId === uid && !m.read).length;
  },

  // ── Topbar ─────────────────────────────────────────────────────────────
  updateTopbar() {
    const u = this.state.user;
    const color = u.avatarColor || avatarColor(u.name);
    const av = document.getElementById('tb-avatar');
    av.textContent = u.avatar;
    av.style.background = color;
    av.style.color = 'white';
    document.getElementById('tb-name').textContent = u.name.split(' ')[0];
    // Populate dropdown
    const pdAv = document.getElementById('pd-avatar');
    if (pdAv) {
      pdAv.textContent = u.avatar;
      pdAv.style.background = color;
      pdAv.style.color = 'white';
    }
    const pdName = document.getElementById('pd-name');
    const pdRole = document.getElementById('pd-role');
    const pdEmail = document.getElementById('pd-email');
    if (pdName) pdName.textContent = u.name;
    if (pdRole) pdRole.textContent = u.role;
    if (pdEmail) pdEmail.textContent = u.email;
  },

  // ── App event bindings ────────────────────────────────────────────────
  bindApp() {
    if (this._appBound) return;
    this._appBound = true;

    // Sidebar nav delegation
    document.getElementById('sb-nav').addEventListener('click', e => {
      const item = e.target.closest('.nav-item');
      if (item) this.navigate(item.dataset.section);
    });

    // Logout (sidebar)
    document.getElementById('logout-btn').addEventListener('click', () => this.logout());

    // Profile dropdown toggle
    document.getElementById('tb-profile-btn').addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('profile-dropdown').classList.toggle('open');
    });

    // Logout from profile dropdown
    document.getElementById('pd-logout-btn').addEventListener('click', () => this.logout());

    // Hamburger
    document.getElementById('hamburger-btn').addEventListener('click', () => this.openSidebar());
    document.getElementById('sb-close-btn').addEventListener('click', () => this.closeSidebar());
    document.getElementById('sb-overlay').addEventListener('click', () => this.closeSidebar());

    // Theme toggle
    document.getElementById('theme-toggle-btn').addEventListener('click', () => this.toggleTheme());

    // Notifications
    document.getElementById('notif-btn').addEventListener('click', e => {
      e.stopPropagation();
      const drop = document.getElementById('notif-drop');
      drop.classList.toggle('hidden');
      if (!drop.classList.contains('hidden')) this.renderNotifications();
    });
    document.getElementById('mark-read-btn').addEventListener('click', () => this.markAllRead());
    document.addEventListener('click', e => {
      if (!document.getElementById('notif-wrap').contains(e.target))
        document.getElementById('notif-drop').classList.add('hidden');
      if (!document.querySelector('.tb-search-wrap').contains(e.target))
        document.getElementById('search-overlay').classList.add('hidden');
      if (!document.getElementById('tb-profile-btn').contains(e.target))
        document.getElementById('profile-dropdown').classList.remove('open');
    });

    // Global search
    const si = document.getElementById('global-search');
    si.addEventListener('input', () => {
      const q = si.value.trim();
      if (q.length < 2) { document.getElementById('search-overlay').classList.add('hidden'); return; }
      this.doSearch(q);
    });
    si.addEventListener('focus', () => {
      if (si.value.trim().length >= 2) document.getElementById('search-overlay').classList.remove('hidden');
    });

    // Modal close
    document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-bg').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-bg')) this.closeModal();
    });
  },

  openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sb-overlay').classList.add('active');
  },
  closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sb-overlay').classList.remove('active');
  },

  // ── Navigation ────────────────────────────────────────────────────────
  navigate(section) {
    this.state.section = section;
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + section);
    if (target) target.classList.add('active');

    // Update sidebar active
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.section === section);
    });

    this.closeSidebar();
    document.getElementById('search-overlay').classList.add('hidden');

    // Render the section
    const renders = {
      'dashboard':      () => this.renderDashboard(),
      'courses':        () => this.renderCourses(),
      'manage-courses': () => this.renderManageCourses(),
      'assignments':    () => this.renderAssignments(),
      'grades':         () => this.renderGrades(),
      'leaderboard':    () => this.renderLeaderboard(),
      'notes':          () => this.renderNotes(),
      'timetable':      () => this.renderTimetable(),
      'announcements':  () => this.renderAnnouncements(),
      'messages':       () => this.renderMessages(),
      'progress':       () => this.renderProgress(),
    };
    if (renders[section]) renders[section]();
  },

  // ── Theme ─────────────────────────────────────────────────────────────
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    localStorage.setItem('educore_theme', this.state.theme);
    this.updateThemeUI();
  },
  updateThemeUI() {
    const dark = this.state.theme === 'dark';
    const icon  = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon)  icon.textContent  = dark ? '🌙' : '☀️';
    if (label) label.textContent = dark ? 'Dark Mode' : 'Light Mode';
  },

  // ── Notifications ─────────────────────────────────────────────────────
  updateNotifBadge() {
    const db = this.load(); const uid = this.state.user.id;
    const count = db.notifications.filter(n => n.userId === uid && !n.read).length;
    const badge = document.getElementById('notif-badge');
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  },
  renderNotifications() {
    const db = this.load(); const uid = this.state.user.id;
    const notes = db.notifications.filter(n => n.userId === uid).sort((a,b) => b.timestamp.localeCompare(a.timestamp));
    const list = document.getElementById('notif-list');
    if (!notes.length) { list.innerHTML = `<div class="notif-empty">🔕 All caught up!</div>`; return; }
    list.innerHTML = notes.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        ${n.read ? '' : '<div class="notif-dot"></div>'}
        <div class="notif-item-text">
          <div>${n.message}</div>
          <div class="notif-time">${this.timeAgo(n.timestamp)}</div>
        </div>
      </div>`).join('');
    list.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', () => {
        const db2 = this.load();
        const n = db2.notifications.find(x => x.id === el.dataset.id);
        if (n) { n.read = true; this.save(db2); this.renderNotifications(); this.updateNotifBadge(); }
      });
    });
  },
  markAllRead() {
    const db = this.load(); const uid = this.state.user.id;
    db.notifications.filter(n => n.userId === uid).forEach(n => n.read = true);
    this.save(db);
    this.renderNotifications();
    this.updateNotifBadge();
  },
  addNotification(userId, type, message) {
    const db = this.load();
    db.notifications.push({ id:'nt'+Date.now(), userId, type, message, read:false, timestamp:new Date().toISOString() });
    this.save(db);
    if (userId === this.state.user.id) this.updateNotifBadge();
  },

  // ── Search ─────────────────────────────────────────────────────────────
  doSearch(q) {
    const db = this.load(); const uid = this.state.user.id; const role = this.state.user.role;
    q = q.toLowerCase();
    const results = { courses:[], assignments:[], notes:[], announcements:[] };

    const myCourseIds = role === 'student'
      ? db.courses.filter(c => c.enrolled.includes(uid)).map(c => c.id)
      : db.courses.filter(c => c.educatorId === uid).map(c => c.id);

    db.courses.filter(c => myCourseIds.includes(c.id) && (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)))
      .forEach(c => results.courses.push(c));

    db.assignments.filter(a => myCourseIds.includes(a.courseId) && (a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)))
      .forEach(a => results.assignments.push(a));

    if (role === 'student') {
      db.notes.filter(n => n.studentId === uid && n.content.toLowerCase().includes(q))
        .forEach(n => results.notes.push(n));
    }

    db.announcements.filter(a => myCourseIds.includes(a.courseId) && (a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)))
      .forEach(a => results.announcements.push(a));

    const overlay = document.getElementById('search-overlay');
    const res = document.getElementById('search-results');
    const total = Object.values(results).reduce((s,r) => s+r.length, 0);
    if (!total) { res.innerHTML = `<div class="search-no-results">🔍 No results for "<strong>${q}</strong>"</div>`; overlay.classList.remove('hidden'); return; }

    let html = '';
    if (results.courses.length) {
      html += `<div class="search-group"><div class="search-group-title">Courses</div>`;
      results.courses.forEach(c => {
        html += `<div class="search-result-item" onclick="App.navigate('${this.state.user.role==='educator'?'manage-courses':'courses'}')">
          <span class="search-result-icon">📚</span>
          <div class="search-result-text"><div class="name">${c.title}</div><div class="sub">${c.code} · ${c.category}</div></div>
        </div>`;
      });
      html += '</div>';
    }
    if (results.assignments.length) {
      html += `<div class="search-group"><div class="search-group-title">Assignments</div>`;
      results.assignments.forEach(a => {
        const c = db.courses.find(x => x.id === a.courseId);
        html += `<div class="search-result-item" onclick="App.navigate('assignments')">
          <span class="search-result-icon">📝</span>
          <div class="search-result-text"><div class="name">${a.title}</div><div class="sub">${c ? c.code : ''} · Due ${this.fmtDate(a.dueDate)}</div></div>
        </div>`;
      });
      html += '</div>';
    }
    if (results.notes.length) {
      html += `<div class="search-group"><div class="search-group-title">Notes</div>`;
      results.notes.forEach(n => {
        const c = db.courses.find(x => x.id === n.courseId);
        html += `<div class="search-result-item" onclick="App.navigate('notes')">
          <span class="search-result-icon">📓</span>
          <div class="search-result-text"><div class="name">${n.content.slice(0,60)}…</div><div class="sub">${c ? c.title : ''}</div></div>
        </div>`;
      });
      html += '</div>';
    }
    if (results.announcements.length) {
      html += `<div class="search-group"><div class="search-group-title">Announcements</div>`;
      results.announcements.forEach(a => {
        html += `<div class="search-result-item" onclick="App.navigate('announcements')">
          <span class="search-result-icon">📢</span>
          <div class="search-result-text"><div class="name">${a.title}</div><div class="sub">${this.fmtDate(a.date)}</div></div>
        </div>`;
      });
      html += '</div>';
    }
    res.innerHTML = html;
    overlay.classList.remove('hidden');
  },

  // ══ DASHBOARD ══════════════════════════════════════════════════════════
  renderDashboard() {
    const db = this.load(); const u = this.state.user; const sec = document.getElementById('sec-dashboard');
    if (u.role === 'educator') this.renderEducatorDashboard(db, u, sec);
    else this.renderStudentDashboard(db, u, sec);
  },

  renderStudentDashboard(db, u, sec) {
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const myAssignments = db.assignments.filter(a => myCourses.some(c => c.id === a.courseId));
    const pending = myAssignments.filter(a => !a.submissions.find(s => s.studentId === u.id));
    const cgpa = this.calcCGPA(db, u.id);

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Welcome back, ${u.name.split(' ')[0]}! 👋</h1>
        <p class="sec-subtitle">${this.today()}</p></div>
      </div>
      <div class="stats-grid">
        <div class="stat-card blue"><div class="stat-icon">📚</div><div class="stat-value">${myCourses.length}</div><div class="stat-label">Enrolled Courses</div></div>
        <div class="stat-card violet"><div class="stat-icon">📝</div><div class="stat-value">${pending.length}</div><div class="stat-label">Pending Assignments</div></div>
        <div class="stat-card green"><div class="stat-icon">⭐</div><div class="stat-value">${cgpa.toFixed(2)}</div><div class="stat-label">Current CGPA</div></div>
        <div class="stat-card orange"><div class="stat-icon">📓</div><div class="stat-value">${db.notes.filter(n=>n.studentId===u.id).length}</div><div class="stat-label">My Notes</div></div>
      </div>
      <div class="dash-grid">
        <div class="card">
          <div class="card-header"><h3 class="card-title">📅 Upcoming Assignments</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('assignments')">View All</button></div>
          <div>${myAssignments.filter(a => !a.submissions.find(s=>s.studentId===u.id)).slice(0,4).map(a => {
            const c = db.courses.find(x=>x.id===a.courseId);
            return `<div class="activity-item">
              <div class="activity-icon" style="background:${c.color}22;color:${c.color}">📝</div>
              <div class="activity-text"><div class="activity-title">${a.title}</div><div class="activity-sub">${c.code} · Due ${this.fmtDate(a.dueDate)}</div></div>
              <span class="badge ${this.isOverdue(a.dueDate) ? 'badge-red' : 'badge-orange'}">${this.isOverdue(a.dueDate) ? 'Overdue':'Due soon'}</span>
            </div>`;
          }).join('') || '<p style="color:var(--text3);font-size:14px;padding:8px 0">🎉 All caught up!</p>'}</div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">📢 Announcements</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('announcements')">View All</button></div>
          ${db.announcements.filter(a => myCourses.some(c=>c.id===a.courseId)).slice(0,3).map(a => {
            const c = db.courses.find(x=>x.id===a.courseId);
            return `<div class="activity-item">
              <div class="activity-icon" style="background:${c.color}22;color:${c.color}">${a.important?'⚠️':'📢'}</div>
              <div class="activity-text"><div class="activity-title">${a.title}</div><div class="activity-sub">${c.code} · ${this.fmtDate(a.date)}</div></div>
            </div>`;
          }).join('') || '<p style="color:var(--text3);font-size:14px;padding:8px 0">No announcements.</p>'}
        </div>
        <div class="card dash-full">
          <div class="card-header"><h3 class="card-title">📚 My Courses</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('courses')">View All</button></div>
          <div class="courses-grid">
            ${myCourses.map(c => this.courseCardHTML(c, db)).join('')}
          </div>
        </div>
      </div>`;
  },

  renderEducatorDashboard(db, u, sec) {
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    const allAssignments = db.assignments.filter(a => myCourses.some(c => c.id === a.courseId));
    const pendingGrade = allAssignments.reduce((n,a) => n + a.submissions.filter(s => s.grade === null).length, 0);
    const totalStudents = [...new Set(myCourses.flatMap(c => c.enrolled))].length;
    const pendingEnrollments = (db.enrollmentRequests||[]).filter(r => myCourses.some(c=>c.id===r.courseId) && r.status==='pending').length;

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Educator Dashboard 👩‍🏫</h1><p class="sec-subtitle">${this.today()}</p></div>
        <button class="btn btn-primary" onclick="App.openAddCourseModal()">+ New Course</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card blue"><div class="stat-icon">📚</div><div class="stat-value">${myCourses.length}</div><div class="stat-label">Active Courses</div></div>
        <div class="stat-card green"><div class="stat-icon">🎓</div><div class="stat-value">${totalStudents}</div><div class="stat-label">Total Students</div></div>
        <div class="stat-card orange"><div class="stat-icon">📝</div><div class="stat-value">${pendingGrade}</div><div class="stat-label">Ungraded Submissions</div></div>
        <div class="stat-card ${pendingEnrollments>0?'red':'violet'}" style="cursor:${pendingEnrollments>0?'pointer':'default'}" onclick="${pendingEnrollments>0?'App.navigate(\'manage-courses\')':''}"><div class="stat-icon">📥</div><div class="stat-value">${pendingEnrollments}</div><div class="stat-label">Enrollment Requests</div></div>
      </div>
      <div class="dash-grid">
        <div class="card">
          <div class="card-header"><h3 class="card-title">⏳ Needs Grading</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('assignments')">Grade Now</button></div>
          ${allAssignments.filter(a=>a.submissions.some(s=>s.grade===null)).slice(0,4).map(a=>{
            const c = db.courses.find(x=>x.id===a.courseId);
            const ungraded = a.submissions.filter(s=>s.grade===null).length;
            return `<div class="activity-item">
              <div class="activity-icon" style="background:${c.color}22;color:${c.color}">📝</div>
              <div class="activity-text"><div class="activity-title">${a.title}</div><div class="activity-sub">${c.code}</div></div>
              <span class="badge badge-orange">${ungraded} pending</span>
            </div>`;
          }).join('') || '<p style="color:var(--text3);font-size:14px;padding:8px 0">✅ All submissions graded!</p>'}
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">📥 Enrollment Requests</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('manage-courses')">View Courses</button></div>
          ${(db.enrollmentRequests||[]).filter(r=>myCourses.some(c=>c.id===r.courseId)&&r.status==='pending').slice(0,4).map(r=>{
            const student = db.users.find(x=>x.id===r.studentId);
            const course = db.courses.find(x=>x.id===r.courseId);
            return `<div class="activity-item">
              <div class="avatar-sm" style="background:${student?.avatarColor||avatarColor(student?.name||'')};color:white;font-size:12px;">${student?.avatar||'?'}</div>
              <div class="activity-text"><div class="activity-title">${student?.name||'Unknown'}</div><div class="activity-sub">${course?.code||''} · ${this.timeAgo(r.createdAt)}</div></div>
              <div style="display:flex;gap:6px">
                <button class="btn btn-primary btn-xs" onclick="App.approveEnrollment('${r.id}')">✅</button>
                <button class="btn btn-danger btn-xs" onclick="App.rejectEnrollment('${r.id}')">❌</button>
              </div>
            </div>`;
          }).join('') || '<p style="color:var(--text3);font-size:14px;padding:8px 0">No pending requests.</p>'}
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">✉️ Recent Messages</h3><button class="btn btn-ghost btn-sm" onclick="App.navigate('messages')">View All</button></div>
          ${db.messages.filter(m=>m.toId===u.id).slice(0,3).map(m=>{
            const sender = db.users.find(x=>x.id===m.fromId);
            return `<div class="activity-item">
              <div class="avatar-sm" style="background:${sender?.avatarColor||avatarColor(sender?.name||'')};color:white;font-size:12px;">${sender?.avatar||'?'}</div>
              <div class="activity-text"><div class="activity-title">${m.subject}</div><div class="activity-sub">${sender?.name||'Unknown'}</div></div>
              ${m.read?'':'<span class="badge badge-blue">New</span>'}
            </div>`;
          }).join('') || '<p style="color:var(--text3);font-size:14px;padding:8px 0">No messages yet.</p>'}
        </div>
        <div class="card dash-full">
          <div class="card-header"><h3 class="card-title">📚 Your Courses</h3><button class="btn btn-primary btn-sm" onclick="App.openAddCourseModal()">+ Add</button></div>
          <div class="courses-grid">${myCourses.map(c=>this.courseCardHTML(c,db,true)).join('') || `<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No courses yet</h3><p>Click + New Course to get started.</p></div>`}</div>
        </div>
      </div>`;
  },

  courseCardHTML(c, db, isEducator=false) {
    const pendingReqs = isEducator ? (db.enrollmentRequests||[]).filter(r => r.courseId === c.id && r.status === 'pending').length : 0;
    return `<div class="course-card" onclick="App.navigate('${isEducator?'manage-courses':'courses'}')">
      <div class="course-banner" style="background:${c.color}"></div>
      <div class="course-body">
        <div class="course-code">${c.code}</div>
        <div class="course-title">${c.title}</div>
        <div class="course-desc">${c.description}</div>
        <div class="course-meta">
          <span class="badge badge-blue">${c.credits} credits</span>
          <span class="badge badge-gray">${c.category}</span>
        </div>
        <div class="course-footer">
          <span class="course-enrolled">👥 ${c.enrolled.length} enrolled</span>
          ${isEducator ? `<div class="course-actions">
            ${pendingReqs > 0 ? `<button class="btn btn-warning btn-xs" onclick="event.stopPropagation();App.openEnrollmentRequestsModal('${c.id}')">📥 ${pendingReqs} Request${pendingReqs>1?'s':''}</button>` : ''}
            <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();App.openEditCourseModal('${c.id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-xs" onclick="event.stopPropagation();App.deleteCourse('${c.id}')">🗑️</button>
          </div>` : `<span class="badge badge-green">Enrolled ✓</span>`}
        </div>
      </div>
    </div>`;
  },

  // ══ COURSES (Student) ══════════════════════════════════════════════════
  renderCourses() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const browseCourses = db.courses.filter(c => !c.enrolled.includes(u.id));
    const sec = document.getElementById('sec-courses');
    sec.innerHTML =
      '<div class="sec-header"><div><h1 class="sec-title">My Courses</h1><p class="sec-subtitle">You\'re enrolled in ' + myCourses.length + ' course' + (myCourses.length!==1?'s':'') + '</p></div></div>' +
      (myCourses.length
        ? '<div class="courses-grid">' + myCourses.map(c => this.fullCourseCard(c, db, u)).join('') + '</div>'
        : '<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No courses enrolled</h3><p>Browse available courses below and request to join.</p></div>') +
      (browseCourses.length ? '<div class="sec-header" style="margin-top:32px"><div><h2 class="sec-title" style="font-size:20px">🔍 Browse Available Courses</h2><p class="sec-subtitle">' + browseCourses.length + ' course' + (browseCourses.length!==1?'s':'') + ' available to join</p></div></div><div class="courses-grid">' + browseCourses.map(c => this.browseableCourseCard(c, db, u)).join('') + '</div>' : '');
  },

  browseableCourseCard(c, db, u) {
    const educator = db.users.find(x => x.id === c.educatorId);
    const reqs = db.enrollmentRequests || [];
    const existing = reqs.find(r => r.courseId === c.id && r.studentId === u.id);
    let actionBtn = '';
    if (existing && existing.status === 'pending') {
      actionBtn = '<button class="btn btn-ghost btn-sm" disabled style="cursor:default;opacity:.7">⏳ Request Pending</button>';
    } else if (existing && existing.status === 'rejected') {
      actionBtn = '<button class="btn btn-ghost btn-sm" disabled style="cursor:default;opacity:.7;color:var(--danger)">❌ Request Declined</button>';
    } else {
      actionBtn = '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();App.requestEnrollment(\'' + c.id + '\')">+ Request to Enroll</button>';
    }
    return '<div class="course-card" style="cursor:default;opacity:.95"><div class="course-banner" style="background:' + c.color + '"></div><div class="course-body"><div class="course-code">' + c.code + '</div><div class="course-title">' + c.title + '</div><div class="course-desc">' + c.description + '</div><div class="course-meta"><span class="badge badge-blue">' + c.credits + ' credits</span><span class="badge badge-gray">' + c.category + '</span><span class="badge badge-purple">🕐 ' + c.schedule + '</span></div><div class="course-footer" style="margin-top:10px;justify-content:space-between;align-items:center"><span style="font-size:12px;color:var(--text2)">👩‍🏫 ' + (educator?.name||'Unknown') + '</span>' + actionBtn + '</div></div></div>';
  },

  requestEnrollment(courseId) {
    const db = this.load(); const u = this.state.user;
    if (!db.enrollmentRequests) db.enrollmentRequests = [];
    const already = db.enrollmentRequests.find(r => r.courseId === courseId && r.studentId === u.id && r.status === 'pending');
    if (already) { this.toast('You already have a pending request for this course.', 'info'); return; }
    const course = db.courses.find(c => c.id === courseId);
    if (!course) return;
    const req = { id: 'er' + Date.now(), courseId, studentId: u.id, status: 'pending', createdAt: new Date().toISOString() };
    db.enrollmentRequests.push(req);
    this.save(db);
    this.addNotification(course.educatorId, 'enrollment', '📥 ' + u.name + ' requested to join ' + course.code);
    this.toast('Enrollment request sent! Waiting for teacher approval. 📩', 'success');
    this.navigate('courses');
  },

  fullCourseCard(c, db, u) {
    const assigns = db.assignments.filter(a => a.courseId === c.id);
    const graded = assigns.filter(a => a.submissions.find(s => s.studentId===u.id && s.grade!==null));
    const avg = graded.length ? Math.round(graded.reduce((s,a) => s + a.submissions.find(x=>x.studentId===u.id).grade, 0) / graded.length) : null;
    const pct = graded.length ? Math.round((graded.length / Math.max(assigns.length,1)) * 100) : 0;
    const educator = db.users.find(x => x.id === c.educatorId);
    return `<div class="course-card" style="cursor:default">
      <div class="course-banner" style="background:${c.color}"></div>
      <div class="course-body">
        <div class="course-code">${c.code}</div>
        <div class="course-title">${c.title}</div>
        <div class="course-desc">${c.description}</div>
        <div class="course-meta">
          <span class="badge badge-blue">${c.credits} credits</span>
          <span class="badge badge-gray">${c.category}</span>
          <span class="badge badge-purple">🕐 ${c.schedule}</span>
        </div>
        ${avg !== null ? `<div style="margin:10px 0 4px;font-size:12px;color:var(--text2)">Average grade: <strong style="color:${c.color}">${avg}%</strong></div>` : ''}
        <div class="grade-bar-bg" style="margin:6px 0 10px"><div class="grade-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
        <div class="course-footer">
          <span style="font-size:12px;color:var(--text2)">👩‍🏫 ${educator?.name||'Unknown'}</span>
          <span style="font-size:12px;color:var(--text2)">📍 ${c.room}</span>
        </div>
      </div>
    </div>`;
  },

  // ══ MANAGE COURSES (Educator) ══════════════════════════════════════════
  renderManageCourses() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    const sec = document.getElementById('sec-manage-courses');
    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Manage Courses</h1><p class="sec-subtitle">${myCourses.length} course${myCourses.length!==1?'s':''}</p></div>
        <button class="btn btn-primary" onclick="App.openAddCourseModal()">+ New Course</button>
      </div>
      ${myCourses.length ? `<div class="courses-grid">${myCourses.map(c => this.courseCardHTML(c,db,true)).join('')}</div>`
        : `<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No courses yet</h3><p>Create your first course to get started.</p></div>`}`;
  },

  openEnrollmentRequestsModal(courseId) {
    const db = this.load();
    const course = db.courses.find(c => c.id === courseId);
    if (!course) return;
    const pending = (db.enrollmentRequests || []).filter(r => r.courseId === courseId && r.status === 'pending');
    if (!pending.length) { this.toast('No pending enrollment requests.', 'info'); return; }
    const rows = pending.map(r => {
      const student = db.users.find(u => u.id === r.studentId);
      const color = student && student.avatarColor ? student.avatarColor : '#6b7280';
      const name = student ? student.name : 'Unknown';
      const email = student ? student.email : '';
      const initials = student ? student.avatar : '?';
      return '<div class="activity-item" style="padding:12px 0;border-bottom:1px solid var(--border)">'
        + '<div class="avatar-sm" style="background:' + color + ';color:white;font-size:12px;flex-shrink:0">' + initials + '</div>'
        + '<div class="activity-text" style="flex:1">'
        + '<div class="activity-title">' + name + '</div>'
        + '<div class="activity-sub">' + email + '</div>'
        + '<div class="activity-sub" style="margin-top:2px">Requested ' + this.timeAgo(r.createdAt) + '</div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;flex-shrink:0">'
        + '<button class="btn btn-primary btn-sm" onclick="App.approveEnrollment(\'' + r.id + '\')">✅ Approve</button>'
        + '<button class="btn btn-danger btn-sm" onclick="App.rejectEnrollment(\'' + r.id + '\')">❌ Decline</button>'
        + '</div></div>';
    }).join('');
    this.openModal('📥 Enrollment Requests — ' + course.code,
      '<p style="color:var(--text2);font-size:13px;margin-bottom:16px">' + pending.length + ' student' + (pending.length!==1?'s':'') + ' want' + (pending.length===1?'s':'') + ' to join <strong>' + course.title + '</strong></p>' + rows
    );
  },

  approveEnrollment(requestId) {
    const db = this.load();
    const req = (db.enrollmentRequests || []).find(r => r.id === requestId);
    if (!req) return;
    req.status = 'approved';
    const course = db.courses.find(c => c.id === req.courseId);
    if (course && !course.enrolled.includes(req.studentId)) course.enrolled.push(req.studentId);
    this.save(db);
    const student = db.users.find(u => u.id === req.studentId);
    this.addNotification(req.studentId, 'enrollment', '🎉 Your request to join ' + (course ? course.code : 'a course') + ' was approved!');
    this.toast((student ? student.name : 'Student') + ' approved and enrolled! ✅', 'success');
    const remaining = (this.load().enrollmentRequests || []).filter(r => r.courseId === req.courseId && r.status === 'pending');
    if (remaining.length) this.openEnrollmentRequestsModal(req.courseId);
    else { this.closeModal(); this.navigate('manage-courses'); }
  },

  rejectEnrollment(requestId) {
    const db = this.load();
    const req = (db.enrollmentRequests || []).find(r => r.id === requestId);
    if (!req) return;
    req.status = 'rejected';
    this.save(db);
    const student = db.users.find(u => u.id === req.studentId);
    const course = db.courses.find(c => c.id === req.courseId);
    this.addNotification(req.studentId, 'enrollment', '❌ Your request to join ' + (course ? course.code : 'a course') + ' was declined.');
    this.toast((student ? student.name : 'Student') + "'s request declined.", 'info');
    const remaining = (this.load().enrollmentRequests || []).filter(r => r.courseId === req.courseId && r.status === 'pending');
    if (remaining.length) this.openEnrollmentRequestsModal(req.courseId);
    else { this.closeModal(); this.navigate('manage-courses'); }
  },

  openAddCourseModal() {
    const db = this.load();
    this.openModal('Add New Course', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Course Title</label><input id="ci-title" class="form-input" placeholder="e.g. Introduction to Python"></div>
        <div class="form-group"><label class="form-label">Course Code</label><input id="ci-code" class="form-input" placeholder="e.g. CS101"></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label><textarea id="ci-desc" class="form-input" placeholder="Brief course description…"></textarea></div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Credits</label>
          <select id="ci-credits" class="form-input">
            <option value="1">1 Credit</option><option value="2">2 Credits</option>
            <option value="3" selected>3 Credits</option><option value="4">4 Credits</option><option value="5">5 Credits</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Category</label>
          <select id="ci-category" class="form-input">
            ${['Computer Science','Mathematics','English','Science','History','Business','Arts','Other'].map(c=>`<option>${c}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Schedule</label><input id="ci-schedule" class="form-input" placeholder="e.g. MWF 9:00–10:00 AM"></div>
      <div class="form-group"><label class="form-label">Room</label><input id="ci-room" class="form-input" placeholder="e.g. Tech Hall 201"></div>
      <div class="form-group"><label class="form-label">Course Color</label>
        <div class="color-picker-wrap"><input type="color" id="ci-color" value="#3b82f6"><span id="ci-color-label" style="font-size:13px;color:var(--text2)">#3b82f6</span></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveCourse()">Create Course</button>
      </div>
    `);
    document.getElementById('ci-color').addEventListener('input', e => {
      document.getElementById('ci-color-label').textContent = e.target.value;
    });
  },

  openEditCourseModal(courseId) {
    const db = this.load(); const c = db.courses.find(x => x.id === courseId);
    if (!c) return;
    this.openModal('Edit Course', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Course Title</label><input id="ci-title" class="form-input" value="${c.title}"></div>
        <div class="form-group"><label class="form-label">Course Code</label><input id="ci-code" class="form-input" value="${c.code}"></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label><textarea id="ci-desc" class="form-input">${c.description}</textarea></div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Credits</label>
          <select id="ci-credits" class="form-input">
            ${[1,2,3,4,5].map(n=>`<option value="${n}" ${c.credits==n?'selected':''}>${n} Credit${n>1?'s':''}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Category</label>
          <select id="ci-category" class="form-input">
            ${['Computer Science','Mathematics','English','Science','History','Business','Arts','Other'].map(cat=>`<option ${c.category===cat?'selected':''}>${cat}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Schedule</label><input id="ci-schedule" class="form-input" value="${c.schedule}"></div>
      <div class="form-group"><label class="form-label">Room</label><input id="ci-room" class="form-input" value="${c.room||''}"></div>
      <div class="form-group"><label class="form-label">Course Color</label>
        <div class="color-picker-wrap"><input type="color" id="ci-color" value="${c.color}"><span id="ci-color-label" style="font-size:13px;color:var(--text2)">${c.color}</span></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveCourse('${courseId}')">Save Changes</button>
      </div>
    `);
    document.getElementById('ci-color').addEventListener('input', e => {
      document.getElementById('ci-color-label').textContent = e.target.value;
    });
  },

  saveCourse(courseId) {
    const title    = (document.getElementById('ci-title')?.value||'').trim();
    const code     = (document.getElementById('ci-code')?.value||'').trim();
    const desc     = (document.getElementById('ci-desc')?.value||'').trim();
    const credits  = parseInt(document.getElementById('ci-credits')?.value||3);
    const category = document.getElementById('ci-category')?.value||'Other';
    const schedule = (document.getElementById('ci-schedule')?.value||'').trim();
    const room     = (document.getElementById('ci-room')?.value||'').trim();
    const color    = document.getElementById('ci-color')?.value||'#3b82f6';
    if (!title || !code) { this.toast('Course title and code are required.','error'); return; }
    const db = this.load();
    if (courseId) {
      const c = db.courses.find(x => x.id === courseId);
      if (c) Object.assign(c, { title, code, description:desc, credits, category, schedule, room, color });
    } else {
      db.courses.push({ id:'c'+Date.now(), title, code, description:desc, educatorId:this.state.user.id, color, credits, schedule, category, enrolled:[], room });
    }
    this.save(db);
    this.closeModal();
    this.toast(courseId ? 'Course updated!' : 'Course created!', 'success');
    this.navigate(this.state.section);
  },

  deleteCourse(courseId) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    const db = this.load();
    db.courses = db.courses.filter(c => c.id !== courseId);
    db.assignments = db.assignments.filter(a => a.courseId !== courseId);
    db.announcements = db.announcements.filter(a => a.courseId !== courseId);
    this.save(db);
    this.toast('Course deleted.', 'info');
    this.navigate(this.state.section);
  },

  // ══ ASSIGNMENTS ════════════════════════════════════════════════════════
  renderAssignments() {
    const db = this.load(); const u = this.state.user;
    const sec = document.getElementById('sec-assignments');
    if (u.role === 'educator') this.renderEducatorAssignments(db, u, sec);
    else this.renderStudentAssignments(db, u, sec);
  },

  renderStudentAssignments(db, u, sec) {
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const assigns = db.assignments.filter(a => myCourses.some(c => c.id === a.courseId));
    const tabs = ['all','pending','submitted','graded'];
    let filter = this.state.assignFilter || 'all';

    const filtered = assigns.filter(a => {
      const sub = a.submissions.find(s => s.studentId === u.id);
      if (filter === 'pending')   return !sub;
      if (filter === 'submitted') return sub && sub.grade === null;
      if (filter === 'graded')    return sub && sub.grade !== null;
      return true;
    });

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Assignments</h1><p class="sec-subtitle">${assigns.length} total assignments</p></div>
        <div class="tab-bar">
          ${tabs.map(t=>`<button class="tab ${filter===t?'active':''}" onclick="App.state.assignFilter='${t}';App.renderAssignments()">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}
        </div>
      </div>
      <div class="assignments-list">
        ${filtered.length ? filtered.map(a => {
          const c = db.courses.find(x => x.id === a.courseId);
          const sub = a.submissions.find(s => s.studentId === u.id);
          const overdue = this.isOverdue(a.dueDate) && !sub;
          return `<div class="assign-card">
            <div class="assign-header">
              <div>
                <div class="assign-title">${a.title}</div>
                <div class="assign-course" style="color:${c?.color}">${c?.code} — ${c?.title}</div>
              </div>
              ${sub && sub.grade !== null ? `<span class="badge badge-blue">${sub.grade}/${a.maxGrade}</span>` : ''}
            </div>
            <div class="assign-desc">${a.description}</div>
            <div class="assign-meta">
              <span class="assign-meta-item">📅 Due: ${this.fmtDate(a.dueDate)}</span>
              <span class="assign-meta-item">📊 Max: ${a.maxGrade} pts</span>
              ${sub && sub.grade !== null ? `<span class="assign-meta-item">🎯 Letter: <strong>${this.letterGrade(sub.grade/a.maxGrade*100)}</strong></span>` : ''}
            </div>
            ${sub && sub.feedback ? `<div style="background:var(--bg3);border-radius:6px;padding:8px 12px;font-size:13px;color:var(--text2);margin-bottom:8px"><strong>Feedback:</strong> ${sub.feedback}</div>` : ''}
            <div class="assign-footer">
              ${!sub
                ? `<span class="status-pill ${overdue?'status-overdue':'status-pending'}">${overdue?'⚠️ Overdue':'⏳ Not submitted'}</span>
                   <button class="btn btn-primary btn-sm" onclick="App.openSubmitModal('${a.id}')">📤 Submit</button>`
                : sub.grade === null
                  ? `<span class="status-pill status-submitted">✅ Submitted — awaiting grade</span>`
                  : `<span class="status-pill status-graded">🏅 Graded: ${sub.grade}/${a.maxGrade}</span>`
              }
            </div>
          </div>`;
        }).join('') : `<div class="empty-state"><div class="empty-state-icon">📝</div><h3>No ${filter} assignments</h3><p>Nothing to show here.</p></div>`}
      </div>`;
  },

  renderEducatorAssignments(db, u, sec) {
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    const assigns = db.assignments.filter(a => myCourses.some(c => c.id === a.courseId));

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Assignment Management</h1><p class="sec-subtitle">Review and grade student submissions</p></div>
        <button class="btn btn-primary" onclick="App.openAddAssignmentModal()">+ New Assignment</button>
      </div>
      ${assigns.map(a => {
        const c = db.courses.find(x => x.id === a.courseId);
        const ungraded = a.submissions.filter(s => s.grade === null).length;
        return `<div class="card" style="margin-bottom:20px">
          <div class="card-header">
            <div>
              <div style="font-size:16px;font-weight:700">${a.title}</div>
              <div style="font-size:13px;color:var(--text2)">${c?.code} · ${c?.title} · Due ${this.fmtDate(a.dueDate)}</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              ${ungraded ? `<span class="badge badge-orange">${ungraded} ungraded</span>` : '<span class="badge badge-green">All graded</span>'}
              <button class="btn btn-danger btn-xs" onclick="App.deleteAssignment('${a.id}')">🗑️</button>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Student</th><th>Submitted</th><th>Grade</th><th>Feedback</th><th>Action</th></tr></thead>
              <tbody>
                ${c?.enrolled.map(sid => {
                  const st = db.users.find(x => x.id === sid);
                  const sub = a.submissions.find(s => s.studentId === sid);
                  return `<tr>
                    <td><div style="display:flex;align-items:center;gap:8px">
                      <div class="avatar-sm" style="background:${st?.avatarColor||avatarColor(st?.name||'')};color:white;font-size:11px">${st?.avatar||'?'}</div>
                      ${st?.name||'Unknown'}
                    </div></td>
                    <td>${sub ? `<span class="status-pill status-submitted">✅ Yes</span>` : '<span class="status-pill status-pending">⏳ No</span>'}</td>
                    <td>${sub ? (sub.grade !== null ? `<strong class="graded">${sub.grade}/${a.maxGrade}</strong>` : '<span class="ungraded">—</span>') : '—'}</td>
                    <td style="max-width:180px;font-size:13px;color:var(--text2)">${sub?.feedback||'—'}</td>
                    <td>${sub ? `<button class="btn btn-primary btn-xs" onclick="App.openGradeModal('${a.id}','${sid}')">${sub.grade!==null?'✏️ Edit':'⭐ Grade'}</button>` : '<span style="color:var(--text3);font-size:13px">—</span>'}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
      }).join('') || `<div class="empty-state"><div class="empty-state-icon">📝</div><h3>No assignments yet</h3><p>Create assignments to track student progress.</p></div>`}`;
  },

  openSubmitModal(assignId) {
    const db = this.load(); const a = db.assignments.find(x => x.id === assignId);
    const c = db.courses.find(x => x.id === a?.courseId);
    this.openModal(`Submit: ${a?.title}`, `
      <div style="margin-bottom:12px;padding:12px;background:var(--bg3);border-radius:8px;font-size:13px;color:var(--text2)">
        <strong>Course:</strong> ${c?.code} · ${c?.title}<br>
        <strong>Due:</strong> ${this.fmtDate(a?.dueDate)} · <strong>Max:</strong> ${a?.maxGrade} pts
      </div>
      <div class="form-group"><label class="form-label">Your Submission</label>
        <textarea id="sub-content" class="form-input" style="min-height:120px" placeholder="Describe your work, paste links, or write your answers here…"></textarea>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.submitAssignment('${assignId}')">📤 Submit</button>
      </div>`);
  },

  submitAssignment(assignId) {
    const content = (document.getElementById('sub-content')?.value||'').trim();
    if (!content) { this.toast('Please write your submission first.','error'); return; }
    const db = this.load(); const uid = this.state.user.id;
    const a = db.assignments.find(x => x.id === assignId);
    if (!a) return;
    const existing = a.submissions.findIndex(s => s.studentId === uid);
    const sub = { studentId:uid, content, grade:null, feedback:'', gradedAt:null };
    if (existing >= 0) a.submissions[existing] = sub;
    else a.submissions.push(sub);
    this.save(db);
    const course = db.courses.find(x => x.id === a.courseId);
    this.addNotification(course?.educatorId, 'assignment', `${this.state.user.name} submitted "${a.title}"`);
    this.closeModal();
    this.toast('Assignment submitted!','success');
    this.renderAssignments();
  },

  openGradeModal(assignId, studentId) {
    const db = this.load();
    const a = db.assignments.find(x => x.id === assignId);
    const sub = a?.submissions.find(s => s.studentId === studentId);
    const st = db.users.find(x => x.id === studentId);
    this.openModal(`Grade: ${st?.name}`, `
      <div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:12px;font-size:13px;color:var(--text2)">
        <strong>Submission:</strong><br>${sub?.content||'No content'}
      </div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Grade (max ${a?.maxGrade})</label>
          <input type="number" id="grade-val" class="form-input" min="0" max="${a?.maxGrade}" value="${sub?.grade??''}">
        </div>
      </div>
      <div class="form-group"><label class="form-label">Feedback</label>
        <textarea id="grade-feedback" class="form-input" placeholder="Constructive feedback…">${sub?.feedback||''}</textarea>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveGrade('${assignId}','${studentId}')">💾 Save Grade</button>
      </div>`);
  },

  saveGrade(assignId, studentId) {
    const gradeVal = parseFloat(document.getElementById('grade-val')?.value);
    const feedback = (document.getElementById('grade-feedback')?.value||'').trim();
    const db = this.load();
    const a = db.assignments.find(x => x.id === assignId);
    if (!a) return;
    if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > a.maxGrade) {
      this.toast(`Grade must be 0–${a.maxGrade}.`, 'error'); return;
    }
    const sub = a.submissions.find(s => s.studentId === studentId);
    if (!sub) return;
    sub.grade = gradeVal; sub.feedback = feedback; sub.gradedAt = new Date().toISOString();
    this.save(db);
    this.addNotification(studentId, 'grade', `"${a.title}" graded: ${gradeVal}/${a.maxGrade}`);
    this.closeModal();
    this.toast('Grade saved!','success');
    this.renderAssignments();
  },

  openAddAssignmentModal() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    if (!myCourses.length) { this.toast('Create a course first.','error'); return; }
    this.openModal('New Assignment', `
      <div class="form-group"><label class="form-label">Course</label>
        <select id="na-course" class="form-input">${myCourses.map(c=>`<option value="${c.id}">${c.code} — ${c.title}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Title</label><input id="na-title" class="form-input" placeholder="Assignment title"></div>
      <div class="form-group"><label class="form-label">Description</label><textarea id="na-desc" class="form-input" placeholder="Instructions…"></textarea></div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Due Date</label><input type="date" id="na-due" class="form-input"></div>
        <div class="form-group"><label class="form-label">Max Grade</label><input type="number" id="na-max" class="form-input" value="100" min="1"></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveNewAssignment()">Create</button>
      </div>`);
  },

  saveNewAssignment() {
    const courseId = document.getElementById('na-course')?.value;
    const title    = (document.getElementById('na-title')?.value||'').trim();
    const desc     = (document.getElementById('na-desc')?.value||'').trim();
    const due      = document.getElementById('na-due')?.value;
    const maxGrade = parseInt(document.getElementById('na-max')?.value||100);
    if (!title || !due) { this.toast('Title and due date are required.','error'); return; }
    const db = this.load();
    db.assignments.push({ id:'a'+Date.now(), courseId, title, description:desc, dueDate:due, maxGrade, submissions:[] });
    this.save(db);
    this.closeModal();
    this.toast('Assignment created!','success');
    this.renderAssignments();
  },

  deleteAssignment(assignId) {
    if (!confirm('Delete this assignment?')) return;
    const db = this.load();
    db.assignments = db.assignments.filter(a => a.id !== assignId);
    this.save(db);
    this.toast('Assignment deleted.','info');
    this.renderAssignments();
  },

  // ══ GRADES ════════════════════════════════════════════════════════════
  renderGrades() {
    const db = this.load(); const u = this.state.user;
    const sec = document.getElementById('sec-grades');
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const cgpa = this.calcCGPA(db, u.id);

    const courseGrades = myCourses.map(c => {
      const assigns = db.assignments.filter(a => a.courseId === c.id);
      const graded  = assigns.filter(a => a.submissions.find(s => s.studentId===u.id && s.grade!==null));
      const avg = graded.length ? graded.reduce((s,a) => s + a.submissions.find(x=>x.studentId===u.id).grade / a.maxGrade * 100, 0) / graded.length : null;
      return { course:c, avg, assigns, graded };
    });

    sec.innerHTML = `
      <div class="sec-header"><div><h1 class="sec-title">My Grades</h1><p class="sec-subtitle">Academic performance overview</p></div></div>
      <div class="grades-summary">
        <div class="gpa-display" style="grid-column:span 2">
          <div class="gpa-label">Cumulative GPA</div>
          <div class="gpa-value">${cgpa.toFixed(2)}</div>
          <div class="gpa-sub">Based on all graded assignments</div>
        </div>
        <div class="stat-card green"><div class="stat-icon">✅</div><div class="stat-value">${courseGrades.reduce((s,cg)=>s+cg.graded.length,0)}</div><div class="stat-label">Graded Assignments</div></div>
        <div class="stat-card orange"><div class="stat-icon">⏳</div><div class="stat-value">${courseGrades.reduce((s,cg)=>s+(cg.assigns.length-cg.graded.length),0)}</div><div class="stat-label">Pending Grade</div></div>
      </div>
      <div>
        ${courseGrades.map(({course:c, avg, assigns, graded}) => {
          const letter = avg !== null ? this.letterGrade(avg) : 'N/A';
          const letterClass = avg !== null ? 'letter-'+letter.replace('+','').replace('-','') : 'letter-N';
          const pct = avg !== null ? avg : 0;
          return `<div class="course-grade-row">
            <div class="course-grade-color" style="background:${c.color}"></div>
            <div class="course-grade-info">
              <div class="course-grade-title">${c.title}</div>
              <div class="course-grade-code">${c.code} · ${c.credits} credits · ${graded.length}/${assigns.length} graded</div>
            </div>
            <div class="course-grade-bar-wrap">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:4px">
                <span>${avg !== null ? avg.toFixed(1)+'%' : 'No grades yet'}</span>
                <span>${pct.toFixed(0)}%</span>
              </div>
              <div class="grade-bar-bg"><div class="grade-bar-fill" style="width:${pct}%;background:${c.color}"></div></div>
              ${graded.length > 0 ? `<div style="margin-top:10px">${graded.map(a => {
                const sub = a.submissions.find(s => s.studentId===u.id);
                const pctA = sub.grade / a.maxGrade * 100;
                return `<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:2px">
                  <span>${a.title}</span>
                  <span style="font-weight:700;color:${pctA>=80?'var(--success-l)':pctA>=60?'var(--warning-l)':'var(--danger-l)'}">${sub.grade}/${a.maxGrade}</span>
                </div>`;
              }).join('')}</div>` : ''}
            </div>
            <div class="${letterClass} letter-grade">${letter}</div>
          </div>`;
        }).join('') || `<div class="empty-state"><div class="empty-state-icon">🏆</div><h3>No grades yet</h3></div>`}
      </div>`;
  },

  calcCGPA(db, userId) {
    const myCourses = db.courses.filter(c => c.enrolled.includes(userId));
    const allGraded = [];
    myCourses.forEach(c => {
      db.assignments.filter(a => a.courseId === c.id).forEach(a => {
        const sub = a.submissions.find(s => s.studentId === userId && s.grade !== null);
        if (sub) allGraded.push(sub.grade / a.maxGrade * 100);
      });
    });
    if (!allGraded.length) return 0;
    const avg = allGraded.reduce((a,b)=>a+b,0) / allGraded.length;
    return avg / 100 * 4;
  },

  letterGrade(pct) {
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 67) return 'D+';
    if (pct >= 60) return 'D';
    return 'F';
  },

  // ══ LEADERBOARD ════════════════════════════════════════════════════════
  renderLeaderboard() {
    const db = this.load();
    const students = db.users.filter(u => u.role === 'student').map(u => ({
      ...u, cgpa: this.calcCGPA(db, u.id)
    })).sort((a,b) => b.cgpa - a.cgpa);

    const medals = ['🥇','🥈','🥉'];
    const rankClasses = ['rank-1','rank-2','rank-3'];
    const sec = document.getElementById('sec-leaderboard');

    sec.innerHTML = `
      <div class="sec-header"><div><h1 class="sec-title">Leaderboard 🏆</h1><p class="sec-subtitle">Ranked by cumulative GPA</p></div></div>
      <div class="leaderboard-wrap">
        ${students.length >= 3 ? `<div class="podium-row">
          ${[1,0,2].map(i => students[i] ? `<div class="podium-card ${rankClasses[i]}">
            <span class="podium-medal">${medals[i]}</span>
            <div class="avatar-md" style="background:${students[i].avatarColor||avatarColor(students[i].name)};color:white;margin:0 auto 8px">${students[i].avatar}</div>
            <div class="podium-name">${students[i].name}</div>
            <div style="font-size:12px;color:var(--text2);margin:2px 0 8px">Year ${students[i].year||1}</div>
            <div class="podium-cgpa">${students[i].cgpa.toFixed(2)}</div>
          </div>` : '').join('')}
        </div>` : ''}
        <div class="lb-table-card">
          ${students.map((s,i) => {
            const pct = (s.cgpa / 4) * 100;
            const isMe = s.id === this.state.user.id;
            return `<div class="lb-row" style="${isMe?'background:rgba(59,130,246,0.06);':''}">
              <div class="lb-rank">${i < 3 ? medals[i] : '#'+(i+1)}</div>
              <div class="avatar-sm" style="background:${s.avatarColor||avatarColor(s.name)};color:white;font-size:11px">${s.avatar}</div>
              <div class="lb-name-wrap">
                <div class="lb-name">${s.name}${isMe?' <span style="font-size:11px;color:var(--accent-l)">(You)</span>':''}</div>
                <div class="lb-year">Year ${s.year||1}</div>
              </div>
              <div class="lb-bar">
                <div class="grade-bar-bg"><div class="grade-bar-fill" style="width:${pct}%;background:${i===0?'var(--gold)':i===1?'var(--silver)':i===2?'var(--bronze)':'var(--accent)'}"></div></div>
              </div>
              <div class="lb-cgpa">${s.cgpa.toFixed(2)}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  },

  // ══ NOTES ═════════════════════════════════════════════════════════════
  renderNotes() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const myNotes = db.notes.filter(n => n.studentId === u.id);
    const sec = document.getElementById('sec-notes');
    const NOTE_COLORS = ['#fef3c7','#dbeafe','#dcfce7','#fce7f3','#f3e8ff','#fef9c3','#ffedd5'];

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">My Notes 📓</h1><p class="sec-subtitle">${myNotes.length} note${myNotes.length!==1?'s':''}</p></div>
        <button class="btn btn-primary" onclick="App.openAddNoteModal()">+ New Note</button>
      </div>
      ${myNotes.length ? `<div class="notes-grid">
        ${myNotes.map(n => {
          const c = db.courses.find(x => x.id === n.courseId);
          return `<div class="note-card" style="background:${n.color};border-color:${n.color}">
            <div class="note-course">${c?.code||'General'}</div>
            <div class="note-content">${this.escHtml(n.content)}</div>
            <div class="note-footer">
              <span class="note-date">${this.fmtDate(n.createdAt.split('T')[0])}</span>
              <span class="note-delete" onclick="App.deleteNote('${n.id}')">🗑️</span>
            </div>
          </div>`;
        }).join('')}
      </div>` : `<div class="empty-state"><div class="empty-state-icon">📓</div><h3>No notes yet</h3><p>Add notes to keep track of important information.</p></div>`}`;
  },

  openAddNoteModal() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const NOTE_COLORS = ['#fef3c7','#dbeafe','#dcfce7','#fce7f3','#f3e8ff'];
    this.openModal('New Note', `
      <div class="form-group"><label class="form-label">Course</label>
        <select id="note-course" class="form-input">
          ${myCourses.map(c=>`<option value="${c.id}">${c.code} — ${c.title}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Note Content</label>
        <textarea id="note-content" class="form-input" style="min-height:100px" placeholder="Write your note…"></textarea>
      </div>
      <div class="form-group"><label class="form-label">Color</label>
        <div style="display:flex;gap:8px">
          ${NOTE_COLORS.map((col,i)=>`<label style="cursor:pointer">
            <input type="radio" name="note-color" value="${col}" ${i===0?'checked':''} style="display:none">
            <div class="note-color-swatch" style="width:28px;height:28px;border-radius:50%;background:${col};border:2px solid transparent;transition:border-color 0.15s" onclick="document.querySelectorAll('.note-color-swatch').forEach(s=>s.style.borderColor='transparent');this.style.borderColor='#000'"></div>
          </label>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveNote()">Save Note</button>
      </div>`);
  },

  saveNote() {
    const courseId = document.getElementById('note-course')?.value;
    const content  = (document.getElementById('note-content')?.value||'').trim();
    const colorEl  = document.querySelector('input[name="note-color"]:checked');
    const color    = colorEl ? colorEl.value : '#fef3c7';
    if (!content) { this.toast('Note content is required.','error'); return; }
    const db = this.load();
    db.notes.push({ id:'n'+Date.now(), studentId:this.state.user.id, courseId, content, color, createdAt:new Date().toISOString() });
    this.save(db);
    this.closeModal();
    this.toast('Note saved!','success');
    this.renderNotes();
  },

  deleteNote(noteId) {
    const db = this.load();
    db.notes = db.notes.filter(n => n.id !== noteId);
    this.save(db);
    this.toast('Note deleted.','info');
    this.renderNotes();
  },

  // ══ TIMETABLE ══════════════════════════════════════════════════════════
  renderTimetable() {
    const db = this.load(); const u = this.state.user;
    const isEdu = u.role === 'educator';
    if (isEdu) this.renderEducatorTimetable(db, u);
    else this.renderStudentTimetable(db, u);
  },

  DAYS: ['Mon','Tue','Wed','Thu','Fri'],
  HOURS: ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'],

  renderStudentTimetable(db, u) {
    const sec = document.getElementById('sec-timetable');
    const myCourses = db.courses.filter(c => c.enrolled.includes(u.id));
    const myEntries = (db.timetable||[]).filter(t => myCourses.some(c => c.id === t.courseId));

    const grid = {};
    myEntries.forEach(t => { grid[t.day + '-' + t.startHour] = t; });

    sec.innerHTML =
      '<div class="sec-header"><div><h1 class="sec-title">Weekly Timetable 📅</h1><p class="sec-subtitle">Your weekly class schedule</p></div></div>' +
      (myCourses.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📅</div><h3>No classes scheduled</h3><p>Enroll in courses to see your timetable.</p></div>' :
      '<div class="timetable-wrap">' + this.buildTimetableGridHTML(grid, db, false) + '</div>' +
      '<div class="tt-legend">' + myCourses.map(c =>
        '<div class="tt-legend-item"><div class="tt-legend-dot" style="background:' + c.color + '"></div><strong>' + c.code + '</strong> — ' + c.title + '</div>'
      ).join('') + '</div>');
  },

  renderEducatorTimetable(db, u) {
    const sec = document.getElementById('sec-timetable');
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    const myEntries = (db.timetable||[]).filter(t => myCourses.some(c => c.id === t.courseId));

    const grid = {};
    myEntries.forEach(t => { grid[t.day + '-' + t.startHour] = t; });

    // Count total unique students across all courses
    const allStudentIds = [...new Set(myCourses.flatMap(c => c.enrolled))];

    sec.innerHTML =
      '<div class="sec-header"><div><h1 class="sec-title">Timetable Manager 📅</h1><p class="sec-subtitle">' + myEntries.length + ' scheduled slot' + (myEntries.length!==1?'s':'') + ' across ' + myCourses.length + ' course' + (myCourses.length!==1?'s':'') + '</p></div>' +
      '<button class="btn btn-primary" onclick="App.openAddSlotModal()">+ Add Slot</button></div>' +

      (myCourses.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">📅</div><h3>No courses yet</h3><p>Create a course first, then schedule timetable slots.</p></div>' :

      '<div class="tt-layout">' +
        '<div class="tt-main">' +
          '<div class="timetable-wrap">' + this.buildTimetableGridHTML(grid, db, true) + '</div>' +
          '<div class="tt-legend">' + myCourses.map(c =>
            '<div class="tt-legend-item"><div class="tt-legend-dot" style="background:' + c.color + '"></div><strong>' + c.code + '</strong> — ' + c.title + '</div>'
          ).join('') + '</div>' +
        '</div>' +

        '<div class="tt-sidebar-panel">' +
          '<div class="tt-panel-head">👥 Enrolled Students <span class="badge badge-blue">' + allStudentIds.length + '</span></div>' +
          (allStudentIds.length === 0 ?
            '<p style="color:var(--text3);font-size:13px;padding:12px 0">No students enrolled in any course yet.</p>' :
            '<div class="tt-student-list">' +
              allStudentIds.map(sid => {
                const student = db.users.find(u2 => u2.id === sid);
                if (!student) return '';
                const studentCourses = myCourses.filter(c => c.enrolled.includes(sid));
                return '<div class="tt-student-row">' +
                  '<div class="avatar-sm" style="background:' + (student.avatarColor||avatarColor(student.name)) + ';color:white;font-size:11px;flex-shrink:0">' + student.avatar + '</div>' +
                  '<div style="flex:1;min-width:0">' +
                    '<div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + student.name + '</div>' +
                    '<div style="font-size:11px;color:var(--text3);margin-top:2px">' + studentCourses.map(c => '<span class="badge badge-gray" style="font-size:10px;padding:1px 6px;margin-right:3px">' + c.code + '</span>').join('') + '</div>' +
                  '</div>' +
                '</div>';
              }).join('') +
            '</div>') +
        '</div>' +
      '</div>');
  },

  buildTimetableGridHTML(grid, db, isEdu) {
    const days = this.DAYS;
    const hours = this.HOURS;
    let html = '<div class="timetable-grid">';
    // Header row
    html += '<div class="tt-cell tt-header"></div>';
    days.forEach(d => { html += '<div class="tt-cell tt-header">' + d + '</div>'; });
    // Body rows
    hours.forEach(h => {
      html += '<div class="tt-cell tt-time">' + this.fmt12h(h) + '</div>';
      days.forEach(d => {
        const key = d + '-' + h;
        const entry = grid[key];
        if (entry) {
          const course = db.courses.find(c => c.id === entry.courseId);
          if (course) {
            const enrolled = course.enrolled.length;
            html += '<div class="tt-cell">' +
              '<div class="tt-class" style="background:' + course.color + '22;border-left:3px solid ' + course.color + '" ' +
                (isEdu ? 'onclick="App.openEditSlotModal(\'' + entry.id + '\')" style="background:' + course.color + '22;border-left:3px solid ' + course.color + ';cursor:pointer"' : '') + '>' +
              '<div class="tt-class-title">' + course.code + '</div>' +
              '<div class="tt-class-room">' + (entry.room||course.room||'') + '</div>' +
              '<div class="tt-class-time" style="font-size:10px;opacity:.7;margin-top:2px">' + this.fmt12h(entry.startHour) + '–' + this.fmt12h(entry.endHour) + '</div>' +
              (isEdu ? '<div style="font-size:10px;opacity:.6;margin-top:1px">👥 ' + enrolled + '</div>' : '') +
              '</div>' +
            '</div>';
          } else {
            html += '<div class="tt-cell"></div>';
          }
        } else if (isEdu) {
          html += '<div class="tt-cell tt-empty-slot" onclick="App.openAddSlotModal(\'' + d + '\',\'' + h + '\')" title="Add class here">+</div>';
        } else {
          html += '<div class="tt-cell"></div>';
        }
      });
    });
    html += '</div>';
    return html;
  },

  openAddSlotModal(day, hour) {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    if (!myCourses.length) { this.toast('Create a course first before scheduling.', 'error'); return; }
    const dayOptions = this.DAYS.map(d => '<option value="' + d + '"' + (d===day?' selected':'') + '>' + d + '</option>').join('');
    const hourOptions = this.HOURS.map(h => '<option value="' + h + '"' + (h===hour?' selected':'') + '>' + this.fmt12h(h) + '</option>').join('');
    const endHours = this.HOURS.slice(1).concat(['18:00']);
    const defaultEnd = hour ? (this.HOURS[this.HOURS.indexOf(hour)+1] || '18:00') : '10:00';
    const endOptions = endHours.map(h => '<option value="' + h + '"' + (h===defaultEnd?' selected':'') + '>' + this.fmt12h(h) + '</option>').join('');
    const courseOptions = myCourses.map(c => '<option value="' + c.id + '">' + c.code + ' — ' + c.title + '</option>').join('');
    this.openModal('📅 Add Timetable Slot', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Course</label><select id="ts-course" class="form-input">${courseOptions}</select></div>
        <div class="form-group"><label class="form-label">Day</label><select id="ts-day" class="form-input">${dayOptions}</select></div>
      </div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Start Time</label><select id="ts-start" class="form-input">${hourOptions}</select></div>
        <div class="form-group"><label class="form-label">End Time</label><select id="ts-end" class="form-input">${endOptions}</select></div>
      </div>
      <div class="form-group"><label class="form-label">Room (optional override)</label><input id="ts-room" class="form-input" placeholder="e.g. Tech Hall 201"></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveSlot()">Add Slot</button>
      </div>`);
  },

  openEditSlotModal(slotId) {
    const db = this.load(); const u = this.state.user;
    const slot = (db.timetable||[]).find(t => t.id === slotId);
    if (!slot) return;
    const myCourses = db.courses.filter(c => c.educatorId === u.id);
    const dayOptions = this.DAYS.map(d => '<option value="' + d + '"' + (d===slot.day?' selected':'') + '>' + d + '</option>').join('');
    const hourOptions = this.HOURS.map(h => '<option value="' + h + '"' + (h===slot.startHour?' selected':'') + '>' + this.fmt12h(h) + '</option>').join('');
    const endHours = this.HOURS.slice(1).concat(['18:00']);
    const endOptions = endHours.map(h => '<option value="' + h + '"' + (h===slot.endHour?' selected':'') + '>' + this.fmt12h(h) + '</option>').join('');
    const courseOptions = myCourses.map(c => '<option value="' + c.id + '"' + (c.id===slot.courseId?' selected':'') + '>' + c.code + ' — ' + c.title + '</option>').join('');

    // Show enrolled students for this slot's course
    const course = db.courses.find(c => c.id === slot.courseId);
    const studentList = course && course.enrolled.length
      ? course.enrolled.map(sid => {
          const s = db.users.find(u2 => u2.id === sid);
          return s ? '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">'
            + '<div class="avatar-sm" style="background:' + (s.avatarColor||'#6b7280') + ';color:white;font-size:11px;width:26px;height:26px;min-width:26px">' + s.avatar + '</div>'
            + '<div><div style="font-size:13px;font-weight:600">' + s.name + '</div><div style="font-size:11px;color:var(--text3)">' + s.email + '</div></div>'
            + '</div>' : '';
        }).join('')
      : '<p style="font-size:13px;color:var(--text3);padding:6px 0">No students enrolled yet.</p>';

    this.openModal('✏️ Edit Timetable Slot', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Course</label><select id="ts-course" class="form-input">${courseOptions}</select></div>
        <div class="form-group"><label class="form-label">Day</label><select id="ts-day" class="form-input">${dayOptions}</select></div>
      </div>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Start Time</label><select id="ts-start" class="form-input">${hourOptions}</select></div>
        <div class="form-group"><label class="form-label">End Time</label><select id="ts-end" class="form-input">${endOptions}</select></div>
      </div>
      <div class="form-group"><label class="form-label">Room</label><input id="ts-room" class="form-input" value="${slot.room||''}" placeholder="e.g. Tech Hall 201"></div>
      <div class="form-group">
        <label class="form-label">👥 Enrolled Students (${course?.enrolled?.length||0})</label>
        <div style="max-height:160px;overflow-y:auto;background:var(--bg2);border-radius:8px;padding:6px 10px">${studentList}</div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-danger" onclick="App.deleteSlot('${slotId}')">🗑️ Delete Slot</button>
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveSlot('${slotId}')">Save Changes</button>
      </div>`);
  },

  saveSlot(slotId) {
    const courseId = document.getElementById('ts-course')?.value;
    const day      = document.getElementById('ts-day')?.value;
    const startHour= document.getElementById('ts-start')?.value;
    const endHour  = document.getElementById('ts-end')?.value;
    const room     = (document.getElementById('ts-room')?.value||'').trim();
    if (!courseId || !day || !startHour || !endHour) { this.toast('Please fill all fields.','error'); return; }
    if (startHour >= endHour) { this.toast('End time must be after start time.','error'); return; }
    const db = this.load();
    if (!db.timetable) db.timetable = [];
    if (slotId) {
      const slot = db.timetable.find(t => t.id === slotId);
      if (slot) Object.assign(slot, { courseId, day, startHour, endHour, room });
      this.toast('Slot updated! 📅', 'success');
    } else {
      // Check for conflict
      const conflict = db.timetable.find(t => t.day===day && t.startHour===startHour && t.courseId===courseId);
      if (conflict) { this.toast('A slot for this course already exists at that time.','error'); return; }
      db.timetable.push({ id:'tt'+Date.now(), courseId, day, startHour, endHour, room });
      this.toast('Slot added! 📅', 'success');
    }
    this.save(db);
    this.closeModal();
    this.navigate('timetable');
  },

  deleteSlot(slotId) {
    if (!confirm('Remove this timetable slot?')) return;
    const db = this.load();
    db.timetable = (db.timetable||[]).filter(t => t.id !== slotId);
    this.save(db);
    this.toast('Slot removed.', 'info');
    this.closeModal();
    this.navigate('timetable');
  },

  fmt12h(h24) {
    const [h] = h24.split(':');
    const n = parseInt(h);
    const ampm = n >= 12 ? 'PM' : 'AM';
    const h12 = n % 12 || 12;
    return h12 + ':00 ' + ampm;
  },

    // ══ ANNOUNCEMENTS ══════════════════════════════════════════════════════
  renderAnnouncements() {
    const db = this.load(); const u = this.state.user;
    const isEdu = u.role === 'educator';
    const relevantCourseIds = isEdu
      ? db.courses.filter(c=>c.educatorId===u.id).map(c=>c.id)
      : db.courses.filter(c=>c.enrolled.includes(u.id)).map(c=>c.id);
    const anns = db.announcements.filter(a => relevantCourseIds.includes(a.courseId))
      .sort((a,b) => b.date.localeCompare(a.date));
    const sec = document.getElementById('sec-announcements');

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Announcements 📢</h1><p class="sec-subtitle">${anns.length} announcement${anns.length!==1?'s':''}</p></div>
        ${isEdu ? `<button class="btn btn-primary" onclick="App.openPostAnnouncementModal()">+ Post Announcement</button>` : ''}
      </div>
      ${anns.length ? `<div class="ann-list">
        ${anns.map(a => {
          const c = db.courses.find(x=>x.id===a.courseId);
          return `<div class="ann-card ${a.important?'important':''}">
            <div class="ann-header">
              <div>
                <div class="ann-title">${a.title}</div>
                <div class="ann-meta">📅 ${this.fmtDate(a.date)} · <span style="color:${c?.color}">${c?.code||''}</span></div>
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                ${a.important ? '<span class="badge badge-orange">⚠️ Important</span>' : ''}
                ${isEdu ? `<button class="btn btn-danger btn-xs" onclick="App.deleteAnnouncement('${a.id}')">🗑️</button>` : ''}
              </div>
            </div>
            <div class="ann-body">${this.escHtml(a.content)}</div>
          </div>`;
        }).join('')}
      </div>` : `<div class="empty-state"><div class="empty-state-icon">📢</div><h3>No announcements yet</h3><p>${isEdu?'Post an announcement for your students.':'Check back later.'}</p></div>`}`;
  },

  openPostAnnouncementModal() {
    const db = this.load(); const u = this.state.user;
    const myCourses = db.courses.filter(c=>c.educatorId===u.id);
    if (!myCourses.length) { this.toast('Create a course first.','error'); return; }
    this.openModal('Post Announcement', `
      <div class="form-group"><label class="form-label">Course</label>
        <select id="ann-course" class="form-input">${myCourses.map(c=>`<option value="${c.id}">${c.code} — ${c.title}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Title</label><input id="ann-title" class="form-input" placeholder="Announcement title"></div>
      <div class="form-group"><label class="form-label">Content</label><textarea id="ann-content" class="form-input" style="min-height:100px" placeholder="Write your announcement…"></textarea></div>
      <div class="form-group" style="flex-direction:row;align-items:center;gap:8px">
        <input type="checkbox" id="ann-important" style="width:16px;height:16px;cursor:pointer">
        <label for="ann-important" style="cursor:pointer;font-size:14px">Mark as important</label>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.postAnnouncement()">📢 Post</button>
      </div>`);
  },

  postAnnouncement() {
    const courseId   = document.getElementById('ann-course')?.value;
    const title      = (document.getElementById('ann-title')?.value||'').trim();
    const content    = (document.getElementById('ann-content')?.value||'').trim();
    const important  = document.getElementById('ann-important')?.checked || false;
    if (!title || !content) { this.toast('Title and content required.','error'); return; }
    const db = this.load();
    const ann = { id:'an'+Date.now(), courseId, educatorId:this.state.user.id, title, content, date:new Date().toISOString().split('T')[0], important };
    db.announcements.push(ann);
    // Notify enrolled students
    const course = db.courses.find(c=>c.id===courseId);
    course?.enrolled.forEach(sid => this.addNotification(sid, 'announcement', `New announcement in ${course.code}: ${title}`));
    this.save(db);
    this.closeModal();
    this.toast('Announcement posted!','success');
    this.renderAnnouncements();
  },

  deleteAnnouncement(annId) {
    if (!confirm('Delete this announcement?')) return;
    const db = this.load();
    db.announcements = db.announcements.filter(a => a.id !== annId);
    this.save(db);
    this.toast('Announcement deleted.','info');
    this.renderAnnouncements();
  },

  // ══ MESSAGES ══════════════════════════════════════════════════════════
  renderMessages() {
    const db = this.load(); const u = this.state.user;
    const sec = document.getElementById('sec-messages');

    // Get unique threads involving user
    const allMsgs = db.messages.filter(m => m.fromId === u.id || m.toId === u.id);
    const threadMap = {};
    allMsgs.forEach(m => {
      if (!threadMap[m.threadId] || m.timestamp > threadMap[m.threadId].timestamp)
        threadMap[m.threadId] = m;
    });
    const threads = Object.values(threadMap).sort((a,b) => b.timestamp.localeCompare(a.timestamp));

    sec.innerHTML = `
      <div class="sec-header">
        <div><h1 class="sec-title">Messages ✉️</h1></div>
        ${u.role === 'student' ? `<button class="btn btn-primary" onclick="App.openComposeModal()">✏️ Compose</button>` : ''}
      </div>
      <div class="messages-layout">
        <div class="msg-sidebar">
          <div class="msg-sidebar-header"><strong>Conversations</strong><span class="badge badge-blue">${threads.length}</span></div>
          <div class="msg-list" id="msg-thread-list">
            ${threads.length ? threads.map(m => {
              const other = db.users.find(x => x.id === (m.fromId===u.id?m.toId:m.fromId));
              const unread = db.messages.filter(x=>x.threadId===m.threadId && x.toId===u.id && !x.read).length;
              return `<div class="msg-thread-item ${this.state.activeMessageThread===m.threadId?'active':''} ${unread?'unread':''}" data-thread="${m.threadId}" onclick="App.openThread('${m.threadId}')">
                <div class="avatar-sm" style="background:${other?.avatarColor||avatarColor(other?.name||'')};color:white;font-size:11px">${other?.avatar||'?'}</div>
                <div class="msg-thread-info">
                  <div class="msg-thread-subject">${m.subject}</div>
                  <div class="msg-thread-preview">${m.content.slice(0,50)}…</div>
                  <div class="msg-thread-time">${this.timeAgo(m.timestamp)}</div>
                </div>
                ${unread ? `<span class="badge badge-blue">${unread}</span>` : ''}
              </div>`;
            }).join('') : '<div style="padding:24px;text-align:center;color:var(--text3);font-size:14px">No conversations yet.</div>'}
          </div>
        </div>
        <div class="msg-content-area" id="msg-content-area">
          <div class="msg-empty">
            <span style="font-size:40px">✉️</span>
            <p>${threads.length ? 'Select a conversation.' : 'No messages yet.'}</p>
            ${u.role==='student'?`<button class="btn btn-primary btn-sm" onclick="App.openComposeModal()">✏️ Start conversation</button>`:''}
          </div>
        </div>
      </div>`;

    if (this.state.activeMessageThread) this.openThread(this.state.activeMessageThread);
  },

  openThread(threadId) {
    const db = this.load(); const u = this.state.user;
    // Security: ensure current user is a participant in this thread
    const isParticipant = db.messages.some(m => m.threadId === threadId && (m.fromId === u.id || m.toId === u.id));
    if (!isParticipant) return;
    this.state.activeMessageThread = threadId;
    const msgs = db.messages.filter(m => m.threadId === threadId).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
    const firstMsg = msgs[0];
    const other = db.users.find(x => x.id === (firstMsg.fromId===u.id ? firstMsg.toId : firstMsg.fromId));
    // Mark as read
    msgs.filter(m => m.toId===u.id && !m.read).forEach(m => m.read=true);
    this.save(db);
    this.buildSidebar(); this.updateNotifBadge();

    const area = document.getElementById('msg-content-area');
    if (!area) return;
    area.innerHTML = `
      <div class="msg-content-header">
        <div class="msg-content-title">${firstMsg?.subject}</div>
        <div style="font-size:13px;color:var(--text2)">with ${other?.name||'Unknown'} — <span style="color:var(--text3)">${msgs.length} message${msgs.length!==1?'s':''}</span></div>
      </div>
      <div class="msg-bubble-list" id="bubble-list">
        ${msgs.map(m => {
          const mine = m.fromId === u.id;
          const sender = db.users.find(x=>x.id===m.fromId);
          return `<div>
            ${!mine?`<div style="font-size:11px;color:var(--text3);margin-bottom:3px">${sender?.name}</div>`:''}
            <div class="msg-bubble ${mine?'mine':'theirs'}">${this.escHtml(m.content)}</div>
            <div class="msg-bubble-time" style="text-align:${mine?'right':'left'}">${this.timeAgo(m.timestamp)}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="msg-compose">
        <textarea id="msg-reply" placeholder="Write a reply…"></textarea>
        <button class="btn btn-primary" onclick="App.sendReply('${threadId}')">Send</button>
      </div>`;

    // Scroll to bottom
    const bl = document.getElementById('bubble-list');
    if (bl) bl.scrollTop = bl.scrollHeight;

    // Update active thread in sidebar
    document.querySelectorAll('.msg-thread-item').forEach(el => {
      el.classList.toggle('active', el.dataset.thread === threadId);
    });

    // Enter key to send
    const ta = document.getElementById('msg-reply');
    if (ta) ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendReply(threadId); }
    });
  },

  sendReply(threadId) {
    const content = (document.getElementById('msg-reply')?.value||'').trim();
    if (!content) return;
    const db = this.load(); const u = this.state.user;
    const prevMsg = db.messages.filter(m=>m.threadId===threadId).pop();
    const toId = prevMsg ? (prevMsg.fromId===u.id ? prevMsg.toId : prevMsg.fromId) : null;
    if (!toId) return;

    const newMsg = {
      id:'m'+Date.now(), fromId:u.id, toId,
      courseId: prevMsg.courseId, subject:'Re: '+(prevMsg.subject.startsWith('Re: ')?prevMsg.subject.slice(4):prevMsg.subject),
      content, timestamp:new Date().toISOString(), read:false, threadId
    };
    db.messages.push(newMsg);

    // Auto-reply if educator is recipient and sender is student
    const recipient = db.users.find(x=>x.id===toId);
    if (recipient?.role==='educator') {
      this.addNotification(toId, 'message', `${u.name} replied in "${prevMsg.subject}"`);
    }

    // Auto-reply from educator
    if (u.role==='student') {
      setTimeout(() => {
        const db2 = this.load();
        const replies = [
          "Thanks for reaching out! I'll get back to you shortly.",
          "Good question! Please check the course materials first, then feel free to ask in office hours.",
          "I've noted your concern and will address it soon.",
          "Thank you for your message. I'll review it and respond within 24 hours.",
        ];
        const autoReply = {
          id:'m'+Date.now()+'r', fromId:toId, toId:u.id,
          courseId:prevMsg.courseId, subject:'Re: '+prevMsg.subject,
          content:replies[Math.floor(Math.random()*replies.length)],
          timestamp:new Date(Date.now()+30000).toISOString(), read:false, threadId
        };
        db2.messages.push(autoReply);
        this.save(db2);
        this.addNotification(u.id, 'message', `${recipient?.name||'Educator'} replied to your message`);
        if (this.state.section==='messages' && this.state.activeMessageThread===threadId) this.openThread(threadId);
      }, 2500);
    }

    this.save(db);
    document.getElementById('msg-reply').value = '';
    this.openThread(threadId);
  },

  openComposeModal() {
    const db = this.load(); const u = this.state.user;
    const educators = db.users.filter(x=>x.role==='educator');
    const myCourses = db.courses.filter(c=>c.enrolled.includes(u.id));
    this.openModal('New Message', `
      <div class="form-group"><label class="form-label">To</label>
        <select id="comp-to" class="form-input">${educators.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Course</label>
        <select id="comp-course" class="form-input">${myCourses.map(c=>`<option value="${c.id}">${c.code} — ${c.title}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Subject</label><input id="comp-subject" class="form-input" placeholder="Your subject…"></div>
      <div class="form-group"><label class="form-label">Message</label><textarea id="comp-content" class="form-input" style="min-height:100px" placeholder="Write your message…"></textarea></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.sendNewMessage()">Send ✉️</button>
      </div>`);
  },

  sendNewMessage() {
    const toId     = document.getElementById('comp-to')?.value;
    const courseId = document.getElementById('comp-course')?.value;
    const subject  = (document.getElementById('comp-subject')?.value||'').trim();
    const content  = (document.getElementById('comp-content')?.value||'').trim();
    if (!subject || !content) { this.toast('Subject and message required.','error'); return; }
    const db = this.load();
    const threadId = 't'+Date.now();
    const msg = { id:'m'+Date.now(), fromId:this.state.user.id, toId, courseId, subject, content, timestamp:new Date().toISOString(), read:false, threadId };
    db.messages.push(msg);
    this.save(db);
    this.addNotification(toId, 'message', `New message from ${this.state.user.name}: "${subject}"`);
    this.state.activeMessageThread = threadId;
    this.closeModal();
    this.toast('Message sent!','success');
    this.navigate('messages');
  },

  // ══ PROGRESS ══════════════════════════════════════════════════════════
  renderProgress() {
    const db = this.load(); const u = this.state.user;
    const isEdu = u.role === 'educator';
    const sec = document.getElementById('sec-progress');

    if (isEdu) {
      const myCourses = db.courses.filter(c=>c.educatorId===u.id);
      sec.innerHTML = `
        <div class="sec-header"><div><h1 class="sec-title">Progress Tracker 📊</h1><p class="sec-subtitle">Student performance overview</p></div></div>
        <div class="progress-grid">
          ${myCourses.map(c => {
            const assigns = db.assignments.filter(a=>a.courseId===c.id);
            const allGrades = assigns.flatMap(a=>a.submissions.filter(s=>s.grade!==null).map(s=>s.grade/a.maxGrade*100));
            const avg = allGrades.length ? allGrades.reduce((a,b)=>a+b,0)/allGrades.length : 0;
            const submissionRate = assigns.length && c.enrolled.length
              ? assigns.reduce((s,a)=>s+a.submissions.length,0) / (assigns.length*c.enrolled.length) * 100
              : 0;
            return this.progressCardHTML(c, avg, submissionRate, assigns);
          }).join('') || '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>No courses yet</h3></div>'}
        </div>`;
    } else {
      const myCourses = db.courses.filter(c=>c.enrolled.includes(u.id));
      sec.innerHTML = `
        <div class="sec-header"><div><h1 class="sec-title">My Progress 📊</h1><p class="sec-subtitle">Track your performance in each course</p></div></div>
        <div class="progress-grid">
          ${myCourses.map(c => {
            const assigns = db.assignments.filter(a=>a.courseId===c.id);
            const graded  = assigns.filter(a=>a.submissions.find(s=>s.studentId===u.id&&s.grade!==null));
            const avg = graded.length ? graded.reduce((s,a)=>s+a.submissions.find(x=>x.studentId===u.id).grade/a.maxGrade*100,0)/graded.length : 0;
            const submitRate = assigns.length ? assigns.filter(a=>a.submissions.find(s=>s.studentId===u.id)).length/assigns.length*100 : 0;
            return this.progressCardHTML(c, avg, submitRate, assigns, u.id);
          }).join('') || '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>No courses enrolled</h3></div>'}
        </div>`;
    }
  },

  progressCardHTML(course, avg, submissionRate, assigns, userId) {
    const r = 44; const circ = 2*Math.PI*r;
    const offset = circ * (1 - avg/100);
    const assignData = assigns.slice(0,4);

    return `<div class="progress-card">
      <div style="font-weight:700;font-size:15px;margin-bottom:2px">${course.code}</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:8px">${course.title}</div>
      <div class="progress-ring-wrap">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle class="progress-ring-bg" cx="50" cy="50" r="${r}" fill="none" stroke="${course.color}" stroke-width="8"/>
          <circle class="progress-ring-fill" cx="50" cy="50" r="${r}" fill="none" stroke="${course.color}" stroke-width="8"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round"
            style="transform-origin:50px 50px;transform:rotate(-90deg);transition:stroke-dashoffset 1s ease"/>
        </svg>
        <div class="progress-pct" style="color:${course.color}">${Math.round(avg)}%</div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px">Avg Grade · Submission Rate: ${Math.round(submissionRate)}%</div>
      <div class="progress-bars">
        ${assignData.map(a => {
          const sub = userId ? a.submissions.find(s=>s.studentId===userId) : null;
          const pct = userId ? (sub?.grade!=null?sub.grade/a.maxGrade*100:0) : (a.submissions.filter(s=>s.grade!==null).length ? a.submissions.filter(s=>s.grade!==null).reduce((s,x)=>s+x.grade/a.maxGrade*100,0)/a.submissions.filter(s=>s.grade!==null).length : 0);
          return `<div class="pb-row">
            <span class="pb-label" title="${a.title}">${a.title}</span>
            <div class="pb-bar-bg"><div class="pb-bar-fill" style="width:${pct}%;background:${course.color}"></div></div>
            <span class="pb-val" style="color:${course.color}">${Math.round(pct)}%</span>
          </div>`;
        }).join('')}
        ${assigns.length === 0 ? '<p style="font-size:12px;color:var(--text3)">No assignments yet</p>' : ''}
      </div>
    </div>`;
  },

  // ══ MODAL ══════════════════════════════════════════════════════════════
  openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-bg').classList.remove('hidden');
    document.getElementById('modal-box').scrollTop = 0;
  },
  closeModal() {
    document.getElementById('modal-bg').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
  },

  // ══ TOAST ══════════════════════════════════════════════════════════════
  toast(msg, type='info') {
    const el = document.getElementById('toast');
    document.getElementById('toast-text').textContent = msg;
    el.className = `toast ${type}`;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), 3200);
  },

  // ══ UTILITIES ══════════════════════════════════════════════════════════
  fmtDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr+'T00:00:00');
      return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    } catch(e) { return dateStr; }
  },
  today() {
    return new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  },
  timeAgo(ts) {
    if (!ts) return '';
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff/60)+'m ago';
    if (diff < 86400) return Math.floor(diff/3600)+'h ago';
    if (diff < 604800) return Math.floor(diff/86400)+'d ago';
    return this.fmtDate(ts.split('T')[0]);
  },
  isOverdue(dueDate) {
    return new Date(dueDate+'T23:59:59') < new Date();
  },
  escHtml(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  },
};

// ── Start ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
