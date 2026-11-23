// Skitta Lite op de Lumia: achtergrondtaak (elk kwartier, zie de webapp: lumiaSession in skitta/public/lite/app.js).
// Kijkt of er nieuwe berichten zijn en geeft daar een Windows-melding van. Het token zet de webapp in localSettings.
(function () {
  'use strict';
  var values = Windows.Storage.ApplicationData.current.localSettings.values;
  var finished = false;
  function done() {
    if (finished) return;
    finished = true;
    close();
  }
  try {
    Windows.UI.WebUI.WebUIBackgroundTaskInstance.current.addEventListener('canceled', done);
  } catch (e) {}

  var token = values.lookup('token');
  if (!token) return done();

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function preview(last) {
    if (!last) return 'Nieuw bericht';
    if (last.e) return 'Nieuw bericht';
    if (last.k === 'photo') {
      var t = '';
      try { t = JSON.parse(last.b || '{}').t; } catch (e) {}
      return t === 'video' ? 'Video' : t === 'voice' ? 'Spraakbericht' : t === 'file' ? 'Bestand' : 'Foto';
    }
    if (last.k === 'call') return 'Gemiste oproep';
    return last.b || 'Nieuw bericht';
  }
  function toast(chat, n) {
    var N = Windows.UI.Notifications;
    var doc = new Windows.Data.Xml.Dom.XmlDocument();
    var text = n > 1 ? n + ' nieuwe berichten' : preview(chat.last);
    doc.loadXml('<toast launch="c' + chat.id + '"><visual><binding template="ToastGeneric"><text>' + esc(chat.user.name) +
      '</text><text>' + esc(text) + '</text></binding></visual></toast>');
    var t = new N.ToastNotification(doc);
    try { t.tag = 'c' + chat.id; } catch (e) {}
    N.ToastNotificationManager.createToastNotifier().show(t);
  }

  var x = new XMLHttpRequest();
  x.open('GET', 'https://skittalite.timvanbergen.nl/api/lite/chats', true);
  x.setRequestHeader('Authorization', 'Bearer ' + token);
  x.timeout = 20000;
  x.onload = function () {
    try {
      if (x.status !== 200) return done();
      var r = JSON.parse(x.responseText);
      var seen = {};
      try { seen = JSON.parse(values.lookup('seen') || '{}'); } catch (e) {}
      for (var i = 0; i < r.chats.length; i++) {
        var c = r.chats[i];
        var lastId = c.last ? c.last.id : 0;
        if (c.unread > 0 && lastId > (seen[c.id] || 0) && c.last && c.last.u !== r.me.id) toast(c, c.unread);
        seen[c.id] = lastId;
      }
      values.insert('seen', JSON.stringify(seen));
    } catch (e) {}
    done();
  };
  x.onerror = done;
  x.ontimeout = done;
  x.send();
})();
