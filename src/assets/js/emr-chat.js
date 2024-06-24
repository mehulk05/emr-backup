var chatSVG = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 171 171" style="fill:#000000;margin-top: 10px;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,171.99777v-171.99777h171.99777v171.99777z" fill="none"></path><g fill="#ffffff"><path d="M10.6875,26.71875v85.5h21.375v27.21973l8.68359,-7.01367l25.21582,-20.20605h51.60059v-85.5zM21.375,37.40625h85.5v64.125h-44.58691l-1.50293,1.16895l-18.03516,14.36133v-15.53027h-21.375zM128.25,48.09375v10.6875h21.375v64.125h-21.375v15.53027l-19.53809,-15.53027h-40.07812l-13.35937,10.6875h49.76367l33.89941,27.21973v-27.21973h21.375v-85.5z"></path></g></g></svg>';
var closeSVG = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 171 171" style=" fill:#000000;margin-top: 10px;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,171.99777v-171.99777h171.99777v171.99777z" fill="none"></path><g fill="#ffffff"><path d="M30.78,13.68c-9.40335,0 -17.1,7.69665 -17.1,17.1v109.44c0,9.40334 7.69665,17.1 17.1,17.1h109.44c9.40334,0 17.1,-7.69666 17.1,-17.1v-109.44c0,-9.40335 -7.69666,-17.1 -17.1,-17.1zM30.78,20.52h109.44c5.70622,0 10.26,4.55379 10.26,10.26v109.44c0,5.70622 -4.55378,10.26 -10.26,10.26h-109.44c-5.70621,0 -10.26,-4.55378 -10.26,-10.26v-109.44c0,-5.70621 4.55379,-10.26 10.26,-10.26zM57.13805,52.30195l-4.83609,4.83609l28.36195,28.36195l-28.36195,28.36195l4.83609,4.83609l28.36195,-28.36195l28.36195,28.36195l4.83609,-4.83609l-28.36195,-28.36195l28.36195,-28.36195l-4.83609,-4.83609l-28.36195,28.36195z"></path></g></g></svg>';

let backgroundColor = "rgb(0, 59, 111)"
let chatbotCss = `
#emr-chat{
    max-width:100%
}
@media screen and (max-width:400px) {
    #emr-chat{
        max-width:100%;
        width:350px !important;
    }
}
@media screen and (max-width:340px) {
    #emr-chat{
        max-width:100%;
        width:320px !important;
    }
}
`


function loadForm() {
    jQuery('<style>').text(chatbotCss).appendTo(document.head);
    let bid, fid
    jQuery(function() {

        var variables = getUrlVars();
        bid = variables['bid'];
        fid = variables['lpid'];
        console.log("bid is ", bid, "lid", fid)
        if (bid && fid) {
            if (!JSON.parse(localStorage.getItem("api/public/landingpage/id"))) {
                jQuery.ajax({
                    url: getApiUrl() + "/api/public/landingpage/" + fid,
                    method: 'GET',
                    headers: {
                        'X-TenantID': '' + bid
                    },
                    success: function(data, textStatus) {
                        loadQUestionarieData(data)
                    },
                    error: function(error) {
                        loadEmrChatWindow();
                    }
                });
            } else {
                let data = JSON.parse(localStorage.getItem("api/public/landingpage/id"))
                loadQUestionarieData(data)

            }

        } else {
            jQuery.ajax({
                url: getApiUrl() + "/api/public/v1/questionnaire",
                method: 'GET',
                headers: {
                    'X-TenantID': '' + bid
                },

                success: function(data, textStatus) {
                    if (data.buttonBackgroundColor) {
                        backgroundColor = data.buttonBackgroundColor
                    }

                    loadEmrChatWindow();
                },
                error: function(error) {
                    console.log("err", error)
                    loadEmrChatWindow();
                }
            });
        }

    });


}

function loadQUestionarieData(data) {
    if (data.buttonBackgroundColor) {
        backgroundColor = data.buttonBackgroundColor
    } else {
        // let bgColor = sessionStorage.getItem("optionalBgColor")
        // let color = sessionStorage.getItem("optionForegroundColor")

        var bgColor = jQuery('.btn-fixed').css("background-color");
        var color = jQuery('.btn-fixed').css("color");
        sessionStorage.setItem("optionalBgColor", bgColor)
        sessionStorage.setItem("optionForegroundColor", color)
        chatSVG = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 171 171" style="fill:#000000;margin-top: 10px;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,171.99777v-171.99777h171.99777v171.99777z" fill="none"></path><g fill="' + color + '"><path d="M10.6875,26.71875v85.5h21.375v27.21973l8.68359,-7.01367l25.21582,-20.20605h51.60059v-85.5zM21.375,37.40625h85.5v64.125h-44.58691l-1.50293,1.16895l-18.03516,14.36133v-15.53027h-21.375zM128.25,48.09375v10.6875h21.375v64.125h-21.375v15.53027l-19.53809,-15.53027h-40.07812l-13.35937,10.6875h49.76367l33.89941,27.21973v-27.21973h21.375v-85.5z"></path></g></g></svg>';
        closeSVG = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 171 171" style=" fill:#000000;margin-top: 10px;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,171.99777v-171.99777h171.99777v171.99777z" fill="none"></path><g fill="' + color + '"><path d="M30.78,13.68c-9.40335,0 -17.1,7.69665 -17.1,17.1v109.44c0,9.40334 7.69665,17.1 17.1,17.1h109.44c9.40334,0 17.1,-7.69666 17.1,-17.1v-109.44c0,-9.40335 -7.69666,-17.1 -17.1,-17.1zM30.78,20.52h109.44c5.70622,0 10.26,4.55379 10.26,10.26v109.44c0,5.70622 -4.55378,10.26 -10.26,10.26h-109.44c-5.70621,0 -10.26,-4.55378 -10.26,-10.26v-109.44c0,-5.70621 4.55379,-10.26 10.26,-10.26zM57.13805,52.30195l-4.83609,4.83609l28.36195,28.36195l-28.36195,28.36195l4.83609,4.83609l28.36195,-28.36195l28.36195,28.36195l4.83609,-4.83609l-28.36195,-28.36195l28.36195,-28.36195l-4.83609,-4.83609l-28.36195,28.36195z"></path></g></g></svg>';

        backgroundColor = bgColor
    }
    loadEmrChatWindow(bgColor, color);
}

function getUrlVars() {
    var vars = [],
        hash;

    var hashforBid
    var element = document.getElementById("emr-chat-div");
    let url = element.getAttribute("data-url");
    hashforBid = url.split("/business/")

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    let bid = ""


    for (var i = 1; i < hashforBid.length; i++) {
        bid = hashforBid[i].split('/')[0];
    }

    vars = { bid: bid, lpid: vars['lpid'] }
    return vars;

}

function loadEmrChatWindow(bgColor, color) {
    var element = document.getElementById("emr-chat-div");
    let url = element.getAttribute("data-url");
    console.log(url)
    if (bgColor && color) {
        url = url + "&color=" + color + "&bg=" + bgColor
    }

    console.log(url, bgColor, color)
    element.innerHTML = '<div id="emr-chat" style="position: relative; right: -10px; bottom: 0px; width: 400px; font-size: 12px; transition: all 0.7s ease-in-out;; line-height: 22px; opacity: 0;height:0">' +
        '<iframe src="' + url + '" style="height:515px;     border-radius: 31px !important;width: 100%; border: 0"></iframe>' +
        '</div>' +
        '<a id="emr-prime" class="fab is-float is-visible" onClick="toggleEmrChat()"' +
        'style="display: block; width: 56px; height: 56px; border-radius: 50%; position:absolute;right:0em;bottom: 0px;' +
        'text-align: center; color: #f0f0f0; margin: 25px auto 0; z-index: 998 ;transition: all 0.5s ease-in-out;; ' +
        'overflow: hidden;  cursor: pointer; ' + 'background:' + backgroundColor + '!important' + '">' +
        chatSVG +
        '</a>';
}

function toggleEmrChat() {
    isopen = false
    console.log("trrrrrrr")
    if (jQuery("#emr-chat").hasClass("emr-is-visible")) {
        jQuery(".btn-vertical button").css("opacity", 1)
    } else {
        console.log("true")
        jQuery(".btn-vertical button").css("opacity", 0)


    }
    var element = document.getElementById("emr-chat");
    var isVisible = false;
    for (var i = 0; i < element.classList.length; i++) {
        if (element.classList[i] == "emr-is-visible") {
            isVisible = true;
        }
    }

    var primeElement = document.getElementById("emr-prime");

    if (isVisible) {
        element.classList.remove("emr-is-visible");
        element.style.opacity = "0";
        primeElement.innerHTML = chatSVG;
        primeElement.classList.add("openedChat")
        element.style.height = "0"
        primeElement.style.top = "unset"

    } else {
        element.classList.add("emr-is-visible");
        element.style.opacity = "1";
        element.style.height = "auto"
        primeElement.innerHTML = closeSVG;
        primeElement.classList.remove("openedChat")
        primeElement.style.top = "-20px"
    }
}

function getApiUrl() {
    var hostname = window.location.hostname;
    if (hostname.includes("prod-app.growth99.com")) {
        return "https://api.growth99.com";
    } else if (hostname.includes("dev-app.growthemr.com")) {
        return "https://api.growthemr.com";
    } else if (hostname.includes("localhost")) {
        return "https://api.growthemr.com";
        // return "http://localhost:8080";
    } else {
        return "https://api.growth99.com";
    }
}

loadForm();