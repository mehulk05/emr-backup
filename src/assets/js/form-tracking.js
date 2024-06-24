var url = "http://localhost:4200/assets/js/form-tracking.js"
var prodUrl = "https://prod-app.growth99.com/assets/js/form-tracking.js"
var devUrl = "https://dev-app.growthemr.com/assets/js/form-tracking.js"

setTimeout(() => {

    loadTrackingScript()
    /* ------------------------- production url checkk ------------------------ */
    if (document.querySelectorAll('script[src="' + prodUrl + '"]').length > 0) {
        if (document.querySelectorAll('script[src="' + prodUrl + '"]').length <= 1) {
            console.log("now only one script is remaining")
        } else {
            let el = document.querySelectorAll('script[src="' + prodUrl + '"]')
            if (el.length > 1) {
                for (let i = 0; i < el.length - 1; i++) {
                    el[i].remove()
                }
            }
            console.log("length of script", el.length)
        }
    }
    /* ------------------------------ dev url check ----------------------------- */
    else if (document.querySelectorAll('script[src="' + devUrl + '"]').length > 0) {
        if (document.querySelectorAll('script[src="' + devUrl + '"]').length <= 1) {
            console.log("now only one script is remaining")
        } else {
            let el = document.querySelectorAll('script[src="' + devUrl + '"]')
            if (el.length > 1) {
                for (let i = 0; i < el.length - 1; i++) {
                    el[i].remove()
                }
            }
            console.log("length of script", el.length)
        }
    }
    /* ----------------------------- local env check ---------------------------- */
    else if (document.querySelectorAll('script[src="' + url + '"]').length > 0) {
        if (document.querySelectorAll('script[src="' + url + '"]').length <= 1) {
            console.log("now only one script is remaining")
        } else {
            let el = document.querySelectorAll('script[src="' + url + '"]')
            if (el.length > 1) {
                for (let i = 0; i < el.length - 1; i++) {
                    el[i].remove()
                }
            }
            console.log("length of script", el.length)
        }
    }

    handleIframeSrc()

}, 1500)


function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function handleIframeSrc() {
    var iframes = document.querySelectorAll('iframe');

    var messageData = {
        originUrl: getCookie("OriginallandingURL"),
        trackOrigin: true
    };
    var messageDataString = JSON.stringify(messageData); // Convert object to JSON string
    console.log("cookie from tracking js", messageData);

    console.log(iframes);

    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var iframeSrc = iframe.getAttribute('src');

        if (iframeSrc) {
            // Extract base URL without query parameters
            var baseURL = iframeSrc.split('?')[0];
            if (baseURL.includes('growth99.com') || baseURL.includes('growthemr.com') || baseURL.includes("localhost")) {
                console.log('inside, cookie is sent to url', this.src);
                try {
                    iframe.contentWindow?.postMessage(messageDataString, baseURL);
                } catch (error) {
                    console.error('Failed to post message to iframe:', error);
                }
            }
        }
    }
}


// Function to poll for the cookie and execute handleIframeSrc when the cookie is available
function pollForCookieAndHandleIframeSrc() {
    var cookieCheckInterval = setInterval(() => {
        var originUrl = getCookie("OriginallandingURL");
        if (originUrl) {
            clearInterval(cookieCheckInterval); // Stop polling once the cookie is found
            handleIframeSrc(); // Call the function to handle iframe src
        }
    }, 3000); // Check every 3000 milliseconds
}

// Start polling for the cookie
pollForCookieAndHandleIframeSrc();


function loadTrackingScript() {
    console.log("ready!");
    let currentPageUrl = window.location.href
    setTimeout(() => {
        var iFrames = document.getElementsByTagName('iframe');
        for (let i = 0; i < iFrames.length; i++) {
            let iframeString = iFrames[i].getAttribute('src')
            console.log("url", iframeString)
            if (iframeString && (iframeString.indexOf("/form.html") >= 0 ||
                iframeString.indexOf("/composer.html") >= 0 ||
                iframeString.indexOf("/website.html") >= 0 ||
                iframeString.indexOf("/landingpage.html") >= 0)) {
                console.log("sending event", currentPageUrl)
                iFrames[i].contentWindow.postMessage(currentPageUrl, iframeString);
            }
        }

    }, 9000)
}

document.addEventListener('click', function(event) {
    console.log(event.target.tagName);
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.tagName === 'SPAN') {
        handleUserInteraction();
    }
});

// Set up the MutationObserver
const observer = new MutationObserver(handleMutations);

// Function to start observing the DOM
function startObserving() {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Function to stop observing the DOM
function stopObserving() {
    observer.disconnect();
}

// Function to handle user interaction and start observing
function handleUserInteraction() {
    startObserving();
    // Stop observing after a certain period of inactivity (e.g., 5 seconds)
    setTimeout(stopObserving, 5000);
}

// MutationObserver callback function
function handleMutations(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    postMessageToIframe(node);
                }
                // Check if added nodes contain iframes
                if (node.querySelectorAll) {
                    const iframes = node.querySelectorAll('iframe');
                    iframes.forEach(iframe => postMessageToIframe(iframe));
                }
            });
        }
    }
}

// Function to send postMessage to newly added iframes
function postMessageToIframe(iframe) {
    var messageData = {
        originUrl: getCookie("OriginallandingURL"),
        trackOrigin: true
    };
    var messageDataString = JSON.stringify(messageData);
    console.log("cookie from tracking js", messageData);

    var iframeSrc = iframe.getAttribute('src');
    if (iframeSrc) {
        var baseURL = iframeSrc.split('?')[0];
        if (baseURL.includes('growth99.com') || baseURL.includes('growthemr.com') || baseURL.includes("localhost")) {
            iframe.addEventListener('load', function() {
                console.log('inside, cookie is sent to url', this.src);
                try {
                    this.contentWindow.postMessage(messageDataString, baseURL);
                } catch (error) {
                    console.error('Failed to post message to iframe:', error);
                }
            });

            // If the iframe is already loaded, post message immediately
            if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
                try {
                    iframe.contentWindow.postMessage(messageDataString, baseURL);
                } catch (error) {
                    console.error('Failed to post message to iframe:', error);
                }
            }
        }
    }
}