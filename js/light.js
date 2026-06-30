(function () {
  /*Firebase Realtime Database*/
  var FIREBASE_URL = 'https://light-state-17fb5-default-rtdb.firebaseio.com';
  var STATE_PATH   = '/light/online.json';

  /* 注入灯泡 HTML */
  var blog = document.getElementById('blog_name');
  if (!blog) return;

  var html =
    '<div class="light-section">' +
      '<div class="light-bulb-wrap">' +
        '<div class="light-glow" id="light-glow"></div>' +
        '<svg class="light-bulb-svg" viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<radialGradient id="bulb-off" cx="42%" cy="38%" r="55%">' +
              '<stop offset="0%" stop-color="#bbb"/>' +
              '<stop offset="55%" stop-color="#919191"/>' +
              '<stop offset="100%" stop-color="#6e6e6e"/>' +
            '</radialGradient>' +
            '<radialGradient id="bulb-on" cx="42%" cy="38%" r="55%">' +
              '<stop offset="0%" stop-color="#fffef2"/>' +
              '<stop offset="20%" stop-color="#fff3c0"/>' +
              '<stop offset="50%" stop-color="#ffe080"/>' +
              '<stop offset="80%" stop-color="#f0b830"/>' +
              '<stop offset="100%" stop-color="#d49818"/>' +
            '</radialGradient>' +
          '</defs>' +
          '<path id="light-bulb-rim" d="M 129 0 L 129 156 M 131 0 L 131 156" fill="none" stroke="#3a3a3a" stroke-width="2" stroke-linecap="round"/>' +
          '<ellipse cx="130" cy="182" rx="22" ry="4.5" fill="#3a3a3a" stroke="none"/>' +
          '<rect x="108" y="182" width="44" height="22" rx="5" fill="#3a3a3a" stroke="none"/>' +
          '<ellipse cx="130" cy="163" rx="9" ry="2.5" fill="#3a3a3a"/>' +
          '<ellipse cx="130" cy="172" rx="13" ry="2.5" fill="#3a3a3a"/>' +
          '<ellipse cx="130" cy="180" rx="17" ry="2.5" fill="#3a3a3a"/>' +
          '<path id="light-bulb-glass" d="M 110 206 C 108 216, 109 222, 109 222 C 102 244, 73 276, 72 304 C 70 334, 93 358, 130 358 C 167 358, 190 334, 188 304 C 186 276, 158 244, 151 222 C 151 216, 152 206, 150 206 Z" fill="url(#bulb-off)" stroke="#888" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<div class="light-toggle-wrap" id="light-toggle">' +
        '<div class="light-track" id="light-track"></div>' +
        '<div class="light-state-text" id="light-text">关</div>' +
        '<div class="light-knob" id="light-knob"></div>' +
      '</div>' +
    '</div>';

  blog.insertAdjacentHTML('beforeend', html);

  /* ---- DOM 引用 ---- */
  var toggle = document.getElementById('light-toggle');
  if (!toggle) return;

  var track = document.getElementById('light-track');
  var text  = document.getElementById('light-text');
  var glow  = document.getElementById('light-glow');
  var glass = document.getElementById('light-bulb-glass');

  var STORAGE_KEY = 'light-switch-state';
  var isOnline = false;

  /* ---- 从 Firebase 读取远程状态 ---- */
  function fetchRemoteState() {
    return fetch(FIREBASE_URL + STATE_PATH + '?t=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) { return !!data; })
      .catch(function () { return null; });
  }

  /* ---- 推送状态到 Firebase ---- */
  function pushRemoteState(online) {
    return fetch(FIREBASE_URL + STATE_PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(online)
    }).catch(function () { /* 静默失败，本地已生效 */ });
  }

  //应用状态到 UI
  function applyState(online) {
    if (online) {
      track.style.background = 'linear-gradient(90deg, #c4a838, #d4b850)';
      text.textContent = '开';
      text.style.color = '#222';
      toggle.classList.add('is-online');
      glow.style.opacity = '0.85';
      glass.setAttribute('fill',   'url(#bulb-on)');
      glass.setAttribute('stroke', '#e8b830');
    } else {
      track.style.background = '#cccccc';
      text.textContent = '关';
      text.style.color = '#444';
      toggle.classList.remove('is-online');
      glow.style.opacity = '0';
      glass.setAttribute('fill',   'url(#bulb-off)');
      glass.setAttribute('stroke', '#888888');
    }
  }

  //保存本地，推送远程 
  function syncState(online) {
    isOnline = online;
    try {
      localStorage.setItem(STORAGE_KEY, online ? 'online' : 'offline');
    } catch (e) { /* silent */ }
    applyState(online);
    pushRemoteState(online);
  }

  //初始化
  fetchRemoteState().then(function (remote) {
    if (remote !== null) {
      syncState(remote);
    } else {
      try {
        isOnline = localStorage.getItem(STORAGE_KEY) === 'online';
      } catch (e) {
        isOnline = false;
      }
      applyState(isOnline);
    }
  });

  //点击切换
  toggle.addEventListener('click', function () {
    syncState(!isOnline);
  });

})();
