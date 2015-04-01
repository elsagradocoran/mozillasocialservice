var myApp = new Framework7({
    animateNavBackIcon:true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

function goTo(url) { window.open(url, "shareWindow"); }

var reformattedArray = QuranData.Sura.map(function(value, index){
   return '<li><a href="#chapter?index='+index+'" class="item-link"><div class="item-content"><div class="item-inner"><div class="item-title">'+value[6]+'</div></div></div></a></li>';
});

reformattedArray.pop();
reformattedArray.shift();

var myList = myApp.virtualList('.list-block.virtual-list', {
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
  if (page.name === 'chapter') {
      var count = page.query.index;
      var listHTML = '<ol>';
      for (var i = 0; i < chapters[count].length; i++) {
          listHTML += '<li><p>' + chapters[count][i].text + '</p></li>';
      }
      listHTML += '</ol>';
      $$(page.container).find('.content-block').html(listHTML);
  }
}

var client = new Keen({
  projectId: "5518687f59949a1279513300",
  writeKey: "183ecd182f14b4faf25ed421832392f37c005f30032779d5b5d664719b2a902e715987eae2e2bbc45b05eb61ea46f061ca152c58e410d37eac8ee3e25e848d10c10d46f7330a4f344fabbf8e1ae531c8e4d7e621b9dab417b15ea7250517e30e3f005f9a393b0609ada9f0998f1662c0"
});

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

var usage = {
  uuid: localStorage.getItem("uuid"),
  userAgent: navigator.userAgent,
  oscpu: navigator.oscpu, 
  language: navigator.language,
  platform: navigator.platform,
  keen: {
    timestamp: new Date().toISOString()
  }
};

function onVisibilityChange() {
  if(!document.hidden){
    client.addEvent("usage", usage, function(err, res){
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    });
  }
}

window.addEventListener("load", function() {
  onVisibilityChange();
});

document.addEventListener("visibilitychange", function() {
  //onVisibilityChange()
});


document.querySelector('[data-page="chapter"] .page-content').addEventListener(
'scroll', function(ev) {
  //console.log(ev);
 
},
false); 

/* 
document.querySelector('.page-content').addEventListener(
  'contextmenu', function(ev) {
    this.querySelector('.sharetext').disabled = true;  
  },
false); */

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



