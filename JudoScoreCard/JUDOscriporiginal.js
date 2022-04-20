var lastelement = "blueippon";
var currentfontsize = "15";
var mainClockRunning = 0;
var globalOsaekomiClockRunning = 0;
var centralClockRunning = false;
var osaeClockRunning = false;
var wazari_2_ippon = 1;
var mainSeconds = 0;
var mainMinutes = 4;
var globalOsaeSeconds = 0;
var defaultmatch = "4:00";
var defaultMainSeconds = 0;
var defaultMainMinutes = 4;
var isGoldenScore = false;
var OsaeKomiAutoScore = ;
var OsaeKomiMaxTime = 20;
var OsaeKomiWazariTime = 10;
var OsaeKomiYukoTime = 5;
var goldenScoreTimeSecs = 30000;
var limitGoldenScoreDuration = 0;
var double_digit = 0;
var ijf_2017_rules = 1;
var colourscheme = 0;
var traditional = 0;
var bell_enabled = true;
var mac = null;
var whitepenalty_click = 0;
var bluepenalty_click = 0;
var localdb = false;
var preferred_bell = 0;

function is_explorer() {
  var s = navigator.appVersion;
  var pattern = /MSIE/i;
  var b = pattern.test(s);
  return b;
}

function hajime_matte() {
  if (document.getElementById("hajimeswitch").innerHTML == "Hajime") {
    centralClockRunning = true;
    document.getElementById("hajimeswitch").innerHTML = "Matte";
    bell_enabled = true;
    if (document.getElementById("goldenscore").innerHTML != "Gs") {
      document.getElementById("goldenscore").innerHTML = "&nbsp;";
    }
    if (
      document.getElementById("globalfreezeswitch").innerHTML == "Yoshi" &&
      document.getElementById("globalholddownswitch").innerHTML == "Toketa"
    ) {
      document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
      osaeClockRunning = true;
    }
    if (document.getElementById("globalholddownswitch").innerHTML == "Toketa") {
      document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
    }
    document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
  } else {
    bell_enabled = false;
    centralClockRunning = false;
    document.getElementById("hajimeswitch").innerHTML = "Hajime";
  }
}
function gotoclockoptions() {
  if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
    hajime_matte();
  }
  window.location = "#default_matchtimes";
}
function parse_seconds(s) {
  var a = s.split(":");
  var count = a.length;
  var minutes = 0;
  var seconds = 0;
  var answer = 0;
  if (count > 1) {
    minutes = parseInt(a[0]);
    seconds = parseInt(a[1]);
  } else {
    seconds = parseInt(s);
  }
  answer = minutes * 60 + seconds;
  return answer;
}
function paint_mainclock(secs) {
  var tmins = 0;
  var tsecs = 0;
  var tsecsStr = "";
  var bldstr = "";
  if (secs > 59) {
    tmins = Math.floor(secs / 60);
    tsecs = secs % 60;
  } else {
    tmins = 0;
    tsecs = secs;
  }
  if (tsecs < 10) {
    tsecsStr = "0" + tsecs.toString();
  } else {
    tsecsStr = tsecs.toString();
  }
  bldstr = tmins.toString() + ":" + tsecsStr;
  document.getElementById("mainclock").innerHTML = bldstr;
}
function masterstopwatch() {
  var clockreading = document.getElementById("mainclock").innerHTML;
  var osaereading = document.getElementById("globalosaekomi").innerHTML;
  var centralClockSeconds = parse_seconds(clockreading.toString());
  var osaeClockSeconds = parse_seconds(osaereading);
  var tempMinutes = 0;
  var tempSeconds = centralClockSeconds;
  if (centralClockRunning) {
    if (!isGoldenScore) {
      centralClockSeconds--;
    } else {
      centralClockSeconds++;
    }
    if (centralClockSeconds < 1) {
      centralClockSeconds = 0;
    }
    if (centralClockSeconds > 3599) {
      centralClockSeconds = 3600;
    }
    paint_mainclock(centralClockSeconds);
    if (centralClockSeconds < 1) {
      document.getElementById("goldenscore").innerHTML = "!";
      if (!osaeClockRunning) {
        ring_bell();
      }
    }
  }
  if (osaeClockRunning && centralClockRunning) {
    osaeClockSeconds++;
    if (OsaeKomiAutoScore > 0) {
      if (osaeClockSeconds == OsaeKomiYukoTime) {
        if (
          document.getElementById("globalosaekomitoriwhite").innerHTML == "Tori"
        ) {
          changescore("whiteyuko", 1);
        }
        if (
          document.getElementById("globalosaekomitoriblue").innerHTML == "Tori"
        ) {
          changescore("blueyuko", 1);
        }
      }
      if (osaeClockSeconds == OsaeKomiWazariTime) {
        if (
          document.getElementById("globalosaekomitoriwhite").innerHTML == "Tori"
        ) {
          changescore("whitewazari", 1);
        }
        if (
          document.getElementById("globalosaekomitoriblue").innerHTML == "Tori"
        ) {
          changescore("bluewazari", 1);
        }
      }
      if (osaeClockSeconds == OsaeKomiMaxTime) {
        if (
          document.getElementById("globalosaekomitoriwhite").innerHTML == "Tori"
        ) {
          changescore("whiteippon", 1);
        }
        if (
          document.getElementById("globalosaekomitoriblue").innerHTML == "Tori"
        ) {
          changescore("blueippon", 1);
        }
      }
    }
    if (osaeClockSeconds < 1) {
      osaeClockSeconds = 0;
    }
    if (osaeClockSeconds > OsaeKomiMaxTime) {
      ring_bell();
      centralClockRunning = false;
      osaeClockRunning = false;
      document.getElementById("goldenscore").innerHTML = "!";
      hajime_matte();
      osaeClockSeconds = OsaeKomiMaxTime;
    }
    document.getElementById("globalosaekomi").innerHTML =
      osaeClockSeconds.toString();
  }
  if (isGoldenScore) {
    if (limitGoldenScoreDuration) {
      if (centralClockSeconds >= goldenScoreTimeSecs) {
        ring_bell();
        centralClockRunning = false;
      }
    }
  }
  mac = window.setTimeout(masterstopwatch, 1000);
}
function resetOsae(whichcolour) {
  osaeClockRunning = false;
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  resettoriprompt();
}
function globalholddown() {
  var defaultstartvalue = 0;
  if (document.getElementById("globalholddownswitch").innerHTML == "Osaekomi") {
    document.getElementById("globalosaekomi").innerHTML = "0";
    document.getElementById("globalholddownswitch").innerHTML = "Toketa";
    osaeClockRunning = true;
    centralClockRunning = true;
  } else {
    document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
    osaeClockRunning = false;
  }
}
function globalfreeze() {
  if (document.getElementById("globalfreezeswitch").innerHTML == "Sonomama") {
    document.getElementById("globalfreezeswitch").innerHTML = "Yoshi";
    document.getElementById("hajimeswitch").innerHTML = "Hajime";
    centralClockRunning = false;
    osaeClockRunning = false;
  } else {
    centralClockRunning = true;
    document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
    document.getElementById("hajimeswitch").innerHTML = "Matte";
    if (document.getElementById("globalholddownswitch").innerHTML == "Toketa") {
      osaeClockRunning = true;
    }
  }
}
function nominateosaetori(whichplayer) {
  document.getElementById("globalosaekomitoriprompt").style.display = "none";
  if (whichplayer == 0) {
    document.getElementById("globalosaekomitoriblue").style.width = "15%";
    document.getElementById("globalosaekomitoriwhite").style.width = "84%";
    document.getElementById("globalosaekomitoriblue").innerHTML = "";
    document.getElementById("globalosaekomitoriwhite").innerHTML = "Tori";
  }
  if (whichplayer == 1) {
    document.getElementById("globalosaekomitoriwhite").style.width = "15%";
    document.getElementById("globalosaekomitoriblue").style.width = "84%";
    document.getElementById("globalosaekomitoriblue").innerHTML = "Tori";
    document.getElementById("globalosaekomitoriwhite").innerHTML = "";
  }
}
function resettoriprompt() {
  document.getElementById("globalosaekomitoriblue").style.width = "15%";
  document.getElementById("globalosaekomitoriwhite").style.width = "15%";
  document.getElementById("globalosaekomitoriblue").innerHTML = "";
  document.getElementById("globalosaekomitoriwhite").innerHTML = "";
  document.getElementById("globalosaekomitoriprompt").style.display = "block";
}
function changescore(divid, updown) {
  var currentscore;
  var currentscorestr;
  currentscore = Number(document.getElementById(divid).innerHTML);
  if (updown == 1) {
    currentscore++;
  } else {
    currentscore--;
  }
  if (currentscore < 0) {
    currentscore = 0;
  }
  if (currentscore > 99) {
    currentscore = 99;
  }
  currentscorestr = currentscore.toString();
  if (double_digit == 1) {
    if (divid == "whitewazari" || divid == "bluewazari") {
      if (currentscore < 10) {
        currentscorestr = "0" + currentscorestr;
      }
      document.getElementById(divid).innerHTML = currentscorestr;
    } else {
      document.getElementById(divid).innerHTML = currentscore;
    }
  } else {
    document.getElementById(divid).innerHTML = currentscore;
  }
  lastelement = divid;
  if (
    document.getElementById("goldenscore").innerHTML == "Gs" &&
    centralClockRunning &&
    updown == 1
  ) {
  }
  if (centralClockRunning) {
    if (
      (divid == "blueippon" || divid == "whiteippon") &&
      document.getElementById("goldenscore").innerHTML != "Gs" &&
      updown == 1
    ) {
    }
  }
  if (wazari_2_ippon && (divid == "bluewazari" || divid == "whitewazari")) {
    if (divid == "bluewazari") {
      if (currentscore == 2) {
        changescore("blueippon", 1);
        if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
          hajime_matte();
        }
      }
    } /// if blue
    if (divid == "whitewazari") {
      if (currentscore == 2) {
        changescore("whiteippon", 1);
        if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
          hajime_matte();
        }
      }
    } /// if blue
  }
}
function changepenalty(divid, updown) {
  var oldpenalty;
  var newpenalty;
  oldpenalty = Number(document.getElementById(divid).innerHTML);
  newpenalty = oldpenalty;
  if (updown == 1) {
    newpenalty++;
  } else {
    newpenalty--;
  }
  if (newpenalty < 0) {
    newpenalty = 0;
  }
  if (newpenalty > 4) {
    newpenalty = 4;
  }
  document.getElementById(divid).innerHTML = newpenalty;
  if (newpenalty > 3) {
    document.getElementById(divid).style.backgroundColor = "#ff0000";
    document.getElementById(divid).style.color = "#000000";
    if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
      hajime_matte();
    }
  } else {
    document.getElementById(divid).style.backgroundColor = "#ffff00";
    document.getElementById(divid).style.color = "#ff0000";
  }
}
function resetGoldScore() {
  isGoldenScore = true;
  var tempmatchstr = "0:00";
  centralClockRunning = false;
  osaeClockRunning = false;
  document.getElementById("goldenscore").innerHTML = "Gs";
  document.getElementById("mainclock").innerHTML = tempmatchstr;
  document.getElementById("hajimeswitch").innerHTML = "Hajime";
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  resettoriprompt();
  bell_enabled = true;
}
function setdefaultmatch(clocklabel, mins, secs) {
  var j = 0;
  defaultMainMinutes = mins;
  defaultMainSeconds = secs;
  defaultmatch = clocklabel;
  for (j = 1; j <= 5; j++) {
    document.getElementById("min_" + String(j)).style.background.color =
      "#004400";
  }
  document.getElementById("min_" + String(mins)).style.background.color =
    "#003300";
  if (limitGoldenScoreDuration) {
    goldenScoreTimeSecs = Math.round(
      (defaultMainMinutes * 60 + defaultMainSeconds) / 2
    );
  } else {
    goldenScoreTimeSecs = 30000;
  }
  resetAll();
}
function resetAll() {
  centralClockRunning = false;
  osaeClockRunning = false;
  isGoldenScore = false;
  document.getElementById("goldenscore").innerHTML = "&nbsp;";
  document.getElementById("mainclock").innerHTML = defaultmatch;
  document.getElementById("hajimeswitch").innerHTML = "Hajime";
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  document.getElementById("blueippon").innerHTML = "0";
  document.getElementById("blueyuko").innerHTML = "0";
  document.getElementById("whiteippon").innerHTML = "0";
  if (double_digit == 1) {
    document.getElementById("whitewazari").innerHTML = "00";
    document.getElementById("bluewazari").innerHTML = "00";
  } else {
    document.getElementById("whitewazari").innerHTML = "0";
    document.getElementById("bluewazari").innerHTML = "0";
  }
  document.getElementById("whiteyuko").innerHTML = "0";
  document.getElementById("bluepenalty").innerHTML = "0";
  document.getElementById("whitepenalty").innerHTML = "0";
  document.getElementById("bluepenalty").style.backgroundColor = "#ffff00";
  document.getElementById("bluepenalty").style.color = "#ff0000";
  document.getElementById("whitepenalty").style.backgroundColor = "#ffff00";
  document.getElementById("whitepenalty").style.color = "#ff0000";
  changematch(1);
  document.getElementById("whitehand1").style.opacity = 0.2;
  document.getElementById("whitehand2").style.opacity = 0.2;
  document.getElementById("bluehand1").style.opacity = 0.2;
  document.getElementById("bluehand2").style.opacity = 0.2;
  adjustscreen();
  bell_enabled = true;
  disableSpacekey();
  resettoriprompt();
}
function changemat(updown) {
  var s = document.getElementById("matnum").innerHTML;
  s = s.substr(4);
  var i = Number(s);
  if (updown == 1) {
    i++;
  } else {
    i--;
  }
  if (i < 1) {
    i = 1;
  }
  if (i > 12) {
    i = 12;
  }
  document.getElementById("matnum").innerHTML = "Mat " + String(i);
  document.getElementById("matnum_pref").innerHTML = "Mat " + String(i);
}
function changematch(updown) {
  var s = document.getElementById("matchnum").innerHTML;
  s = s.substr(5);
  var i = Number(s);
  if (updown == 1) {
    i++;
  } else {
    i--;
  }
  if (i < 1) {
    i = 1;
  }
  if (i > 900) {
    i = 900;
  }
  document.getElementById("matchnum").innerHTML = "Bout " + String(i);
}
function legGrab(elid) {
  var legcolor = "#ffaadd";
  var nonlegcolor = "#ffff00";
  if (elid == "bluepenalty") {
    if (bluepenalty_click == 0) {
      bluepenalty_click = 1;
      document.getElementById(elid).style.backgroundColor = legcolor;
      changepenalty("bluepenalty", 1);
    } else {
      bluepenalty_click = 0;
      document.getElementById(elid).style.backgroundColor = nonlegcolor;
    }
  } else {
    if (whitepenalty_click == 0) {
      whitepenalty_click = 1;
      document.getElementById(elid).style.backgroundColor = legcolor;
      changepenalty("whitepenalty", 1);
    } else {
      whitepenalty_click = 0;
      document.getElementById(elid).style.backgroundColor = nonlegcolor;
    }
  }
}
function changeHand(elid) {
  var opacity = document.getElementById(elid).style.opacity;
  if (opacity < 0.5) {
    document.getElementById(elid).style.opacity = 1.0;
    if (elid == "whitehand1" || elid == "whitehand2") {
      changepenalty("whitepenalty", 1);
    }
    if (elid == "bluehand1" || elid == "bluehand2") {
      changepenalty("bluepenalty", 1);
    }
  } else {
    document.getElementById(elid).style.opacity = 0.2;
    if (elid == "whitehand1" || elid == "whitehand2") {
      changepenalty("whitepenalty", 0);
    }
    if (elid == "bluehand1" || elid == "bluehand2") {
      changepenalty("bluepenalty", 0);
    }
  }
}
function manage_golden_score(elid) {
  var limitgs = document.getElementById(elid).value;
  if (limitgs < 1000) {
    limitGoldenScoreDuration = true;
    goldenScoreTimeSecs = Math.round(
      (defaultMainMinutes * 60 + defaultMainSeconds) / 2
    );
  } else {
    limitGoldenScoreDuration = false;
    goldenScoreTimeSecs = 30000;
  }
}
function toggle_to_traditional() {
  if (!traditional) {
    var table = document.getElementById("pagetop");
    var firstRow = table.rows[1];
    var secondRow = table.rows[2];
    firstRow.parentNode.insertBefore(secondRow, firstRow);
  }
  traditional = true;
  document.getElementById("layout2").style.visibility = "visible";
  document.getElementById("layout1").style.visibility = "hidden";
}
function toggle_to_modern() {
  if (traditional) {
    var table = document.getElementById("pagetop");
    var firstRow = table.rows[1];
    var secondRow = table.rows[2];
    firstRow.parentNode.insertBefore(secondRow, firstRow);
  }
  traditional = false;
  document.getElementById("layout1").style.visibility = "visible";
  document.getElementById("layout2").style.visibility = "hidden";
}
function toggle_to_blue() {
  document.getElementById("bluebandcontainer").style.backgroundColor =
    "#3377ff";
  document.getElementById("globalosaekomitoriblue").style.backgroundColor =
    "#3377ff";
  document.getElementById("blueplayername").style.backgroundColor = "#3377ff";
  document.getElementById("modernwrapper").style.backgroundColor = "#3355ff";
  document.getElementById("modernchild").style.backgroundColor = "#ffffff";
  document.getElementById("tradwrapper").style.backgroundColor = "#ffffff";
  document.getElementById("tradchild").style.backgroundColor = "#3355ff";
  document.getElementById("colorscheme1").style.visibility = "visible";
  document.getElementById("colorscheme2").style.visibility = "hidden";
}
function toggle_to_red() {
  document.getElementById("bluebandcontainer").style.backgroundColor =
    "#ff0000";
  document.getElementById("globalosaekomitoriblue").style.backgroundColor =
    "#ff0000";
  document.getElementById("blueplayername").style.backgroundColor = "#ff0000";
  document.getElementById("colorscheme1").style.visibility = "hidden";
  document.getElementById("colorscheme2").style.visibility = "visible";
  document.getElementById("modernwrapper").style.backgroundColor = "#ff0000";
  document.getElementById("modernchild").style.backgroundColor = "#ffffff";
  document.getElementById("tradwrapper").style.backgroundColor = "#ffffff";
  document.getElementById("tradchild").style.backgroundColor = "#ff0000";
}
function toggle_to_hybrid() {}
function update_welcome() {
  document.getElementById("welcome_msg").innerHTML =
    document.getElementById("welcome_input").value;
  window.location = "#pagetop";
  disableSpacekey();
}
function change_msg_colour(newcolour) {
  document.getElementById("welcome_table").style.backgroundColor = newcolour;
}
function setOsaeKomiScoring(selectid, target) {
  var sel = document.getElementById(selectid).value;
  if (target == "a") {
    OsaeKomiAutoScore = sel;
    if (sel != 1) {
      document.getElementById("autoscore_wazari_1").style.visibility = "hidden";
      document.getElementById("autoscore_wazari_2").style.visibility = "hidden";
      document.getElementById("autoscore_yuko_1").style.visibility = "hidden";
      document.getElementById("autoscore_yuko_2").style.visibility = "hidden";
    } else {
      document.getElementById("autoscore_ippon_1").style.visibility = "visible";
      document.getElementById("autoscore_ippon_2").style.visibility = "visible";
      document.getElementById("autoscore_wazari_1").style.visibility =
        "visible";
      document.getElementById("autoscore_wazari_2").style.visibility =
        "visible";
      document.getElementById("autoscore_yuko_1").style.visibility = "visible";
      document.getElementById("autoscore_yuko_2").style.visibility = "visible";
    }
  }
  if (target == "i") {
    OsaeKomiMaxTime = sel;
  }
  if (target == "w") {
    OsaeKomiWazariTime = sel;
  }
  if (target == "y") {
    OsaeKomiYukoTime = sel;
  }
}
function fontsize(updown) {
  var currentsize = Number(currentfontsize);
  if (updown == 1) {
    currentsize = currentsize + 1;
  }
  if (updown == 0) {
    currentsize = currentsize - 1;
  }
  if (updown != 1 && updown != 0) {
    currentsize = updown;
  }
  if (currentsize < 4) {
    currentsize = 4;
  }
  if (currentsize > 200) {
    currentsize = 200;
  }
  currentfontsize = Number(currentsize);
  document.getElementById("scorebody").style.fontSize =
    String(currentsize) + "px";
}
function fontinfo() {
  alert(currentfontsize);
}
function ring_bell() {
  if (bell_enabled) {
    if (preferred_bell == 0) {
      document.getElementById("audiotagbell").play();
    }
    if (preferred_bell == 1) {
      document.getElementById("audiotagbuzzer").play();
    }
    if (preferred_bell == 2) {
      document.getElementById("audiotagsiren").play();
    }
    if (preferred_bell == 3) {
      document.getElementById("audiotagchime").play();
    }
    bell_enabled = false;
  }
}
function force_bell() {
  var old_state = bell_enabled;
  bell_enabled = true;
  ring_bell();
  bell_enabled = old_state;
}
function testbell(whichbell) {
  var old_enabled = bell_enabled;
  var old_preferred = preferred_bell;
  preferred_bell = whichbell;
  bell_enabled = true;
  ring_bell();
  preferred_bell = old_preferred;
  bell_enabled = old_enabled;
}
function selectbell(whichbell) {
  preferred_bell = whichbell;
  var divid = "bar0";
  for (j = 0; j < 4; j++) {
    divid = "bar" + j.toString();
    document.getElementById(divid).style.visibility = "hidden";
  }
  divid = "bar" + whichbell.toString();
  document.getElementById(divid).style.visibility = "visible";
}
function force_main_clock(el1, el2) {
  var s = "";
  s =
    document.getElementById(el1).value +
    ":" +
    document.getElementById(el2).value;
  document.getElementById("mainclock").innerHTML = s;
}
function force_osae_clock(el1) {
  var s = "";
  s = document.getElementById(el1).value;
  document.getElementById("globalosaekomi").innerHTML = s;
}
function adjustscreen() {
  var maxresize = 128;
  var fcounter = 0;
  var tableheight = document.getElementById("pagetop").clientHeight;
  t = document.getElementsByTagName("html");
  var windowheight = t[0].clientHeight;
  while (tableheight > windowheight - 30 && fcounter < maxresize) {
    fcounter++;
    fontsize(0);
    tableheight = document.getElementById("pagetop").clientHeight;
    windowheight = t[0].clientHeight;
  }
  fcounter = 0;
  while (tableheight < windowheight - 20 && fcounter < maxresize) {
    fcounter++;
    fontsize(1);
    tableheight = document.getElementById("pagetop").clientHeight;
    windowheight = t[0].clientHeight;
  }
  fcounter = 0;
}
var spacekeyDisabled = true;
function enableSpacekey() {
  spacekeyDisabled = false;
}
function disableSpacekey() {
  spacekeyDisabled = true;
}
document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (spacekeyDisabled) {
    if (evt.keyCode == 32) {
      hajime_matte();
      return false;
    }
    if (evt.keyCode == 79) {
      globalholddown();
      return false;
    }
    if (evt.keyCode == 84) {
      globalholddown();
      return false;
    }
  }
};
function check_for_traditional() {
  alert("traditional is false");
}
function trimstr(str) {
  var s = str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  s = s.replace("\r", "");
  s = s.replace("\n", "");
  return s;
}
function html5_storage_support() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}
function dbinit() {
  if (!html5_storage_support) {
    localdb = false;
  } else {
    localdb = true;
    var rawnames = localStorage.getItem("allplayers");
    if (rawnames != null) {
      if (rawnames.length < 6) {
        rawnames = "Player 1\nPlayer 2";
      }
    } else {
      rawnames = "Player 1\nPlayer 2";
    }
    document.getElementById("playersnames").value = rawnames;
    updateplayers();
  }
  var show_instruction_host = "www.scorejudo.com";
  var proto = location.hostname;
  if (proto == show_instruction_host) {
    document.getElementById("download_intruct").style.display = "block";
  }
  setOsaeKomiScoring("setOKomiAutoScore", "a");
  adjustscreen();
}
function capitalize(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function mysort(arrayname) {
  var newarray = [];
  var s = "";
  for (j = 0; j < arrayname.length; j++) {
    s = trimstr(arrayname[j]);
    if (s.length > 2) {
      s = s.toLowerCase();
      s = capitalize(s);
      newarray.push(s);
    }
  }
  newarray.sort();
  return newarray;
}
function updateplayers() {
  var data = document.getElementById("playersnames").value;
  var namess = data.split("\n");
  var names = mysort(namess);
  var selects_w = "";
  var selects_b = "";
  var rawnames = "";
  var clickables_w = "";
  var clickables_b = ""; /*
for (j = 0; j < names.length; j++){ if (names[j].length > 2){ selects_w = selects_w + '<option>' + names[j] + '</option>\n'; selects_b = selects_b + '<option>' + names[j] + '</option>\n'; }
}
*/
  selects_w = "";
  selects_b = "";
  for (j = 0; j < names.length; j++) {
    if (names[j].length > 2) {
      rawnames = rawnames + names[j];
      if (j < names.length - 1) {
        rawnames = rawnames + "\r\n";
      }
    }
  }
  var elementw = document.getElementById("whiteplayername");
  while (elementw.firstChild) {
    elementw.removeChild(elementw.firstChild);
  }
  var selectw = document.getElementById("whiteplayername");
  var optionsw = selectw.options;
  for (j = 0; j < names.length; j++) {
    optionsw[j] = new Option(names[j]);
  }
  elementb = document.getElementById("blueplayername");
  while (elementb.firstChild) {
    elementb.removeChild(elementb.firstChild);
  }
  var selectb = document.getElementById("blueplayername");
  var optionsb = selectb.options;
  for (j = 0; j < names.length; j++) {
    optionsb[j] = new Option(names[j], names[j]);
  }
  var editTextarea = document.getElementById("playersnames");
  editTextarea.value = rawnames;
  if (localdb) {
    localStorage.setItem("allplayers", rawnames);
  }
}
function navigate_to(elid) {
  window.location = elid;
  if (elid == "#kanoportrait") {
    startTime();
  }
  if (elid == "#pagetop") {
    disableSpacekey();
  }
}
var kitchenclock = true;
var dayname = [
  "Sunday",
  "Monday",
  "Tueday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var monthname = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function startTime() {
  if (kitchenclock) {
    var today = new Date();
    var str = "";
    var dw = today.getDay();
    var dm = today.getDate();
    var mo = today.getMonth();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkHours(h);
    m = checkTime(m);
    s = checkTime(s);
    str = '<span style="font-size:30%;">' + dayname[dw] + "</span> &nbsp; ";
    str =
      str +
      h +
      ":" +
      m +
      '<span style="font-size:50%;color:#008844;margin-top:-12px;"> :' +
      s +
      "</span>";
    str =
      str +
      ' &nbsp; &nbsp; <span style="font-size:30%;"> ' +
      dm +
      " " +
      monthname[mo] +
      "</span>";
    document.getElementById("clockface").innerHTML = str;
    var t = setTimeout(startTime, 1000);
  }
}
function stopTime() {
  kitchenclock = !kitchenclock;
  startTime();
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function checkHours(h) {
  if (h > 12) {
    h = h - 12;
  }
  return h;
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function clean_blackboard(elid) {
  document.getElementById(elid).value = "";
}
function ruleset(yuko) {
  document.getElementById("ijf-yuko-white").style.display = yuko;
  document.getElementById("ijf-yuko-blue").style.display = yuko;
  if (yuko == "none") {
    ijf_2017_rules = 1;
    document.getElementById("chooserules1").checked = true;
    document.getElementById("chooserules2").checked = false;
  } else {
    ijf_2017_rules = 0;
    document.getElementById("whitehandwrap").style.display = "none";
    document.getElementById("bluehandwrap").style.display = "none";
    document.getElementById("chooserules2").checked = true;
    document.getElementById("chooserules1").checked = false;
  }
}
function doubleDigit(yesno) {
  var currentwazari;
  var currentwazaristr;
  if (yesno == 0) {
    double_digit = 0;
  } else {
    double_digit = 1;
  }
  if (double_digit == 0) {
    currentwazari = Number(document.getElementById("whitewazari").innerHTML);
    document.getElementById("whitewazari").innerHTML = currentwazari.toString();
    currentwazari = Number(document.getElementById("bluewazari").innerHTML);
    document.getElementById("bluewazari").innerHTML = currentwazari.toString();
    document.getElementById("doubledigit1").style.visibility = "hidden";
    document.getElementById("doubledigit2").style.visibility = "visible";
  } else {
    currentwazari = Number(document.getElementById("whitewazari").innerHTML);
    currentwazaristr = currentwazari.toString();
    if (currentwazari < 10) {
      currentwazaristr = "0" + currentwazaristr;
    }
    document.getElementById("whitewazari").innerHTML = currentwazaristr;
    currentwazari = Number(document.getElementById("bluewazari").innerHTML);
    currentwazaristr = currentwazari.toString();
    if (currentwazari < 10) {
      currentwazaristr = "0" + currentwazaristr;
    }
    document.getElementById("bluewazari").innerHTML = currentwazaristr;
    document.getElementById("doubledigit2").style.visibility = "hidden";
    document.getElementById("doubledigit1").style.visibility = "visible";
  }
}
window.onresize = adjustscreen;
