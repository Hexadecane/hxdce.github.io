function makeHTTPObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (error) {}

    throw new Error("Could not create HTTP request object.");
}


function loadSectionForBody(url) {
    let request = makeHTTPObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var contents = request.responseText;
            var a = document.getElementById("mainBody");
            a.innerHTML = contents;
        }
    };
}


function setActiveNavButton(buttonID) {
    // Remove the navActive class from the current active nav button.
    let navButtons = document.getElementsByClassName("navButton");
    for (let i of navButtons) {
        if (i.classList.contains("navActive")) {
            i.classList.remove("navActive");
        }
    }
    // Replace it with the newly selected one.
    document.getElementById(buttonID).classList.add("navActive");
}


function loadSection(url, buttonID) {
    loadSectionForBody(url);
    setActiveNavButton(buttonID);
}


let f;
function loadEntryForWorkSection(category, index) {
    if (index < 0) {  // Basic error checking.
        console.warn('Invalid work section index!');
        return;
    }
    let url;
    switch (category) {
        case 'graphicDesign':
            url = './html/workSectionEntries/graphicDesign.html';
            break;
        case '2DArt':
            url = './html/workSectionEntries/2DArt.html';
            break;
        case '3DArt':
            url = './html/workSectionEntries/3DArt.html';
            break;
        case 'gameDev':
            url = './html/workSectionEntries/gameDev.html';
            break;
        case 'softwareDev':
            url = './html/workSectionEntries/softwareDev.html';
            break;
        default:
            console.warn('Invalid work section category!');
            return;
    }
    // This code below works similarly to the "loadSectionForBody" function.
    let request = makeHTTPObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var contents = request.responseText;
            if (contents.length <= 0) {
                console.warn('Contents failed to load, or HTML file was empty!');
                return;
            }
            contents = contents.split('<split>');
            console.log(contents);
            if (index > contents.length - 1) {  // Index is greater than contents length...
                console.warn('Invalid work section index!');
                return;
            }
            var target = document.getElementById('workContents');
            f = contents;
            target.outerHTML = contents[index];
        }
    };
}
// Short alias for the function above:
let loadWSE = (category, index) => loadEntryForWorkSection(category, index);


function workSectionAdvanceImageSlide(direction) {
    let images = document.getElementById("workProjectCurrImage");
    let newIndex = 0;
    let imageCt = images.children.length;

    for (let i = 0; i < imageCt; i++) {
        let curr = images.children[i];
        if (curr.className === 'workProjectImageActive') {
            if (direction) {
                newIndex = (i >= imageCt - 1) ? 0 : i + 1;
            }
            else {
                newIndex = (i < 1) ? imageCt - 1 : i - 1;
            }
            curr.className = 'workProjectImageInactive';
        }
    }
    images.children[newIndex].className = 'workProjectImageActive';
    workSectionSetActiveImageDot(newIndex);
}


function workSectionSetActiveImageDot(index) {
    let dots = document.getElementById("workProjectImageDotArray");
    if ((index < 0) || (index >= dots.children.length)) {
        console.warn("Invalid dot index for work section image dots!");
        return;
    }
    let s = 'workProjectImageDotActive';
    for (let i of dots.children) {
        if (i.id == s) {
            i.id = '';
        }
    }
    dots.children[index].id = s;
}