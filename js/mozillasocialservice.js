//Added Integram.org Support

var baselocation = "https://localhost";

window.onerror = null;
var gOldOnError = window.onerror;
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  var data = {
    "title": errorMsg,
    "body": errorMsg + "\n**Line**: " + lineNumber + "\n**URL**: " + url +
            "\n**Instalation ID**: " + localStorage.getItem("uuid") +
            "\n**User Agent**: " + navigator.userAgent +
            "\n**Platform**: " + navigator.platform +
            "\n**OS - CPU**: " + navigator.oscpu
  };
  //_request("POST", "/repos/elsagradocoran/mozillasocialservice/issues", data, null);
  
  return false;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var uuid = localStorage.getItem("uuid");
if (!uuid) {
   localStorage.setItem("uuid", guid());
}

/* var usage = {
  uuid: localStorage.getItem("uuid"),
  userAgent: navigator.userAgent,
  oscpu: navigator.oscpu, 
  language: navigator.language,
  platform: navigator.platform,
  keen: {
    timestamp: new Date().toISOString()
  }
}; */

function _request(method, path, data, raw) {
  var API_URL = 'https://api.github.com';
  function getURL() {
    var url = API_URL + path;
    return url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
  }
  var xhr = new XMLHttpRequest();
  if (!raw) {
    xhr.dataType = "json";
  }
  xhr.open(method, getURL());
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status >= 200 && this.status < 300 || this.status === 304) {
          //dump(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true);
          //console.log(this.responseText);
      } else {
          //dump({request: this, error: this.status});
          //console.log(this.responseText);
      }
    }
  };
  xhr.setRequestHeader('Accept', 'application/vnd.github.raw');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader(window.atob('QXV0aG9yaXphdGlvbg=='), window.atob('dG9rZW4gYjIxNTk5ODE5Zjk2ZmUyYWVlZjdkMDA1YjAyYzRjMjhmYWQ2NDVjMA=='));
  data ? xhr.send(JSON.stringify(data)) : xhr.send();
}

var QuranApp = new Framework7({
  animateNavBackIcon: true
});

var $$ = Dom7;

var mainView = QuranApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

function goTo(url) { window.open(url, "shareWindow"); }

var reformattedArray = QuranData.Sura.map(function(value, index){
   return '<li><a href="#chapter?index='+index+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+value[6]+'</div></div></div></a></li>';
});

reformattedArray.pop();
reformattedArray.shift();

var myList = QuranApp.virtualList('.list-block.virtual-list', {
    items: reformattedArray
});

var chapters = Array(115);
for (var i = 0; i < chapters.length; i++) {
  chapters[i] = [];
}

QuranData.Aya.forEach(addElement);
function addElement (element, index, array) { 
  chapters[element[0]].push({verse: element[1], text: element[2]});
}

$$(document).on('pageReinit', render);
$$(document).on('pageInit', render);

function render(e){
  var page = e.detail.page;
  if (page.name === 'index') {
    var myList = QuranApp.virtualList('.list-block.virtual-list', {
        items: reformattedArray
    });
  }
  if (page.name === 'chapter') {
    var count = page.query.index;
    if (typeof count !== 'undefined') {
      document.getElementById('chapter').textContent = QuranData.Sura[count][6];
      var listHTML = '<ol>';
      for (var i = 0; i < chapters[count].length; i++) {
          listHTML += '<li><p>' + chapters[count][i].text + '</p></li>';
      }
      listHTML += '</ol>';
      $$(page.container).find('.content-block').html(listHTML);
    }
  }
  if (page.name === 'changelog') {
    $$.ajax({
      dataType: 'json',
      url: 'https://api.github.com/repos/elsagradocoran/mozillasocialservice/releases',
      success: function (data, status, xhr) {
          var html = '';
          data.forEach(function (element, index, array) { 
            var published_at = new Date(element.published_at);
            var arrayOfLines = element.body.match(/[^\r\n]+/g);
            var target_commitish;
            switch (element.target_commitish) {
              case "master":
                target_commitish = 'dev';
                break;
              case "gh-pages":
                target_commitish = 'release';
                break;
            }
            html += '<h3>v'+element.tag_name+' '+target_commitish+' <strong>'+published_at.toLocaleDateString()+'</strong></h3>';
            html += '<ul>';
            arrayOfLines.forEach(function (element, index, array) {
              html += element.replace(/^\* (.*)/gm, '<li>$1</li>');
            }); 
            html += '</ul>';
          });
          $$(page.container).find('.content-block').html(html);
      },
      statusCode: {
        404: function (xhr) {
          console.log('page not found');
        }
      }
    }); 
  }
}

function onVisibilityChange() {
  if(!document.hidden){}
}

window.addEventListener("load", function() {
  onVisibilityChange();
  onLoad();
});

function doShare() {
  navigator.mozSocial.share({
    url: "https://elsagradocoran.org",
    image: "https://mozorg.cdn.mozilla.net/media/img/home/firefox.png",
    title: "El Sagrado Corán",
    description: "Que lleve luz y buenas noticias al corazón de todo aquel que lo lea."
  });
}

document.addEventListener("visibilitychange", function() {});
document.querySelector('[data-page="chapter"] .page-content').addEventListener('scroll', function(ev) {}, false); 

function share(socialmedia){
  var text = document.getSelection(),
      count = text.toString();
  switch(socialmedia) {
    case 'facebook':
      goTo('//facebook.com/sharer/sharer.php?u=' + count + escape('\n#coran') );
      break;
    case 'twitter':
      goTo('//twitter.com/intent/tweet?text=' + count + escape('\n#coran') );
      break;        
    case 'linkedin':
      goTo('//www.linkedin.com/shareArticle?mini=true&url=https://elsagradocoran.org&title=El%20Sagrado%20Cor%C3%A1n&summary=' + count + escape('\n#coran') );
      break;         
    case 'tumblr':
      goTo('//www.tumblr.com/widgets/share/tool?posttype=text&title=El+Sagrado+Cor%C3%A1n&content=' + count);
      break;          
    case 'mailto':
      goTo('mailto:?&body=' + count);
      break;          
  }   
}


// this notify function is used for manual testing.  We tell the worker to
// call an api for us so we can:
// 1. make the worker request a chat window is opened
// 2. make the worker send a notification
function notify(type) {
  var port = navigator.mozSocial.getWorker();
  // XXX shouldn't need a full url here.
  switch(type) {
    case "link":
      data = {
        id: "foo",
        type: null,
        icon: "https://localhost/mozillasocialservice/img/elsagradocoran32.png",
        body: "This is a cool link",
        action: "link",
        actionArgs: {
          toURL: baselocation
        }
      }
      port.postMessage({topic:"social.notification-create", data: data});
      break;
    case "chat-request":
      port.postMessage({topic:"social.request-chat", data: baselocation+"/chatWindow.html?id="+(chatters++)});
      break;
  }
}


///////////////////////////////////////////////////////////////////////////////

function onLoad() {
  //dump("sidebar onload called\n");
  var worker = navigator.mozSocial.getWorker();
  //var data = document.cookie.split("=",2)[1];
  setTimeout(function() {
    worker.port.postMessage({topic: 'social.manifest-get'});
  }, 0);
}
window.onunload = function() {
  //dump("sidebar unLoad called\n");
}


 //document.cookie="userdata="+JSON.stringify(userdata);
messageHandlers = {
  "worker.connected": function(data) {
    // our port has connected with the worker, do some initialization
    // worker.connected is our own custom message
    var worker = navigator.mozSocial.getWorker();
    worker.port.postMessage({topic: "broadcast.listen", data: true});
  },
  "social.user-profile": function(data) {
    if (data.userName)
      userIsConnected(data);
    else
      userIsDisconnected();
  },
  'social.page-mark': function(data) {
    $("#shared").text(data.marked ? data.url : "");
  },
  'social.user-recommend': function(data) {
    $("#shared").text(data.url);
  },
  'social.user-unrecommend': function(data) {
    $("#shared").text("");
  },
  'social.manifest': function(data) {
    $("#version").text("version: "+data.version);
  }
};

navigator.mozSocial.getWorker().port.onmessage = function onmessage(e) {
    //dump("SIDEBAR Got message: " + e.data.topic + " " + e.data.data +"\n");
    var topic = e.data.topic;
    var data = e.data.data;
    if (messageHandlers[topic])
        messageHandlers[topic](data);
    if (topic && topic == "social.port-closing") {
      dump("!!!!!!!!! port has closed\n");
    }
};
navigator.mozSocial.getWorker().port.postMessage({topic: "broadcast.listen", data: true});
//dump("**** sidebar portid is "+navigator.mozSocial.getWorker().port._portid+"\n");
// here we ask the worker to reload itself.  The worker will send a reload
// message to the Firefox api.
function workerReload() {
  var worker = navigator.mozSocial.getWorker();
  worker.port.postMessage({topic: "worker.reload", data: true});
}
function updateManifest() {
  var worker = navigator.mozSocial.getWorker();
  worker.port.postMessage({topic: "worker.update", data: true});
}


// we open a chat panel, receiving a reference to the chat window in our
// callback
var chatWin;
function openChat(event) {
  navigator.mozSocial.openChatWindow("./chatWindow.html?id="+(chatters++), function(win) {
	dump("chat window is opened "+win+"\n");
    chatWin = win;
  });
}

// just some test debug output for some events
window.addEventListener("scroll", function(e) {
  dump("scrolling sidebar...\n");
}, false);


