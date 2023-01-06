function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (error) {}

    throw new Error("Could not create HTTP request object.");
}

function loadSectionForBody(url) {
    var request = makeHttpObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function() {
    if (request.readyState == 4)
        var contents = request.responseText;
        var a = document.getElementById("mainBody");
        a.innerHTML = contents;
    };
}

function loadAboutSection() {
    loadSectionForBody("./html/aboutSection.html");
}

function loadWorkSection() {
    loadSectionForBody("./html/workSection.html");
}

function loadInfoSection() {
    loadSectionForBody("./html/infoSection.html");
}

function loadContactSection() {
    loadSectionForBody("./html/contactSection.html");
}

function testClick() {
    var request = makeHttpObject();
    request.open("GET", "./html/test.html", true);
    request.send(null);
    request.onreadystatechange = function() {
    if (request.readyState == 4)
        var contents = request.responseText;
        var a = document.getElementById("mainBody");
        a.innerHTML = contents;
    };
}