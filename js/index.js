// Global variable for what index in the work section we're in. 
// Resets whenever a new section is selected.
let workSectionIndex = 0;

function makeHTTPObject() {
    try {
        return new XMLHttpRequest();
    }
    catch (error) {

    }
    try {
        return new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (error) {

    }
    try {
        return new ActiveXObject('Microsoft.XMLHTTP');
    }
    catch (error) {

    }

    throw new Error('Could not create HTTP request object.');
}


function loadSectionForBody(url) {
    let request = makeHTTPObject();
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var contents = request.responseText;
            var a = document.getElementById('mainBody');
            a.innerHTML = contents;
        }
    };
}


function setActiveNavButton(buttonID) {
    // Remove the navActive class from the current active nav button.
    let navButtons = document.getElementsByClassName('navButton');
    for (let i of navButtons) {
        if (i.classList.contains('navActive')) {
            i.classList.remove('navActive');
        }
    }
    // Replace it with the newly selected one.
    document.getElementById(buttonID).classList.add('navActive');
}


function loadSection(url, buttonID) {
    loadSectionForBody(url);
    setActiveNavButton(buttonID);
}


function setActiveWorkNavButton(buttonIndex) {
    if (buttonIndex < 0) {
        console.warn('Invalid index for setActiveWorkNavButton!');
    }
    // Remove the navActive class from the current active nav button.
    let navListElements = document.getElementById('workNavList').children;
    let navButtons = [];
    for (let i of navListElements) {
        if (i.nodeName == 'BUTTON') {
            navButtons.push(i);
        }
    }
    if (buttonIndex > navButtons.length - 1) {
        console.warn('Invalid index for setActiveWorkNavButton!');
    }
    for (let i of navButtons) {
        if (i.classList.contains('workNavActive')) {
            i.classList.remove('workNavActive');
        }
    }
    // Replace it with the newly selected one.
    navButtons[buttonIndex].classList.add('workNavActive');
}


function fetchWorkSectionCategoryURL(category) {
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
            return "error";
    }
    return url;
}


function fetchWorkSectionCategoryNavIndex(c) {
    let categories = ['graphicDesign', '2DArt', '3DArt', 'gameDev', 'softwareDev'];
    return categories.indexOf(c);
}


function loadEntryForWorkSection(category, nextIndex) {
    if (!nextIndex && workSectionIndex == 0) {  // Basic error checking.
        console.warn('Invalid work section index!');
        return;
    }
    let url = fetchWorkSectionCategoryURL(category);

    // This code below works similarly to the 'loadSectionForBody' function.
    let request = makeHTTPObject();
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var contents = request.responseText;
            if (contents.length <= 0) {
                console.warn('Contents failed to load, or HTML file was empty!');
                return;
            }
            contents = contents.split('<split>');
            //console.log(contents);
            if (workSectionIndex == contents.length - 1 && nextIndex) {
                // Index would be greater than contents length...
                console.warn('Invalid work section index!');
                return;
            }
            var target = document.getElementById('workContents');
            f = contents;
            // Increment or decrement workSectionIndex:
            workSectionIndex = (nextIndex) ? workSectionIndex + 1 : workSectionIndex - 1;

            // Replace #workContents with the content at the new work section index:
            target.outerHTML = contents[workSectionIndex];

            // Set the active work nav button after this:
            let activeWorkNavButton = fetchWorkSectionCategoryNavIndex(category);
            setActiveWorkNavButton(activeWorkNavButton);
        }
    };
}
// Short alias for the function above:
let loadWSE = (category, nextIndex) => loadEntryForWorkSection(category, nextIndex);
// Used by category nav buttons:
let loadWSEDefault = (category) => {
    workSectionIndex = -1;
    loadEntryForWorkSection(category, true);
}


// Used by overview buttons:
function loadProjectInWorkSection(category, index) {
    // Functions similarly to loadEntryForWorkSection, but for a specific project at a specific index.
    workSectionIndex = index;
    if (workSectionIndex < 0) {  // Basic error checking.
        console.warn('Invalid work section index!');
        return;
    }
    let url = fetchWorkSectionCategoryURL(category);

    // This code below works similarly to the 'loadSectionForBody' function.
    let request = makeHTTPObject();
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var contents = request.responseText;
            if (contents.length <= 0) {
                console.warn('Contents failed to load, or HTML file was empty!');
                return;
            }
            contents = contents.split('<split>');
            //console.log(contents);
            if (workSectionIndex > contents.length - 1) {
                // Index would be greater than contents length...
                console.warn('Invalid work section index!');
                return;
            }
            var target = document.getElementById('workContents');
            f = contents;

            // Replace #workContents with the content at the new work section index:
            target.outerHTML = contents[workSectionIndex];
            
            // Set the active work nav button after this:
            let activeWorkNavButton = fetchWorkSectionCategoryNavIndex(category);
            setActiveWorkNavButton(activeWorkNavButton);
        }
    };
}


function workSectionAdvanceImageSlide(direction) {
    // For advancing to the next image in the image slideshow/carousel.
    let images = document.getElementById('workProjectCurrImage');
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
    let dots = document.getElementById('workProjectImageDotArray');
    if ((index < 0) || (index >= dots.children.length)) {
        console.warn('Invalid dot index for work section image dots!');
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