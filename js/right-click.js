(function() {

    "use strict";

    ///////////////////////////////////////
    ///////////////////////////////////////
    //
    // H E L P E R    F U N C T I O N S
    //
    ///////////////////////////////////////
    ///////////////////////////////////////

    /**
     * Some helper functions here.
     */
    function clickInsideElement( e, className ) {
        var el = e.srcElement || e.target;

        if ( el.classList.contains(className) ) {
            return el;
        } else {
            while ( el = el.parentNode ) {
                if ( el.classList && el.classList.contains(className) ) {
                    return el;
                }
            }
        }

        return false;
    }

    function getPosition(e) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    function positionMenu(e) {
        clickCoords = getPosition(e);
        clickCoordsX = clickCoords.x;
        clickCoordsY = clickCoords.y;

        menuWidth = menu.offsetWidth + 4;
        menuHeight = menu.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ( (windowWidth - clickCoordsX) < menuWidth ) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ( (windowHeight - clickCoordsY) < menuHeight ) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

    ///////////////////////////////////////
    ///////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    ///////////////////////////////////////
    ///////////////////////////////////////

    /**
     * Variables.
     */
    var contextMenuClassName = "context-menu";
    var contextMenuLinkClassName = "context-menu__link";
    var contextMenuActive = "context-menu--active";

    var taskItemClassName = "task";
    var taskItemInContext;

    var clickCoords;
    var clickCoordsX;
    var clickCoordsY;

    var menu = document.querySelector("#context-menu");
    var menuState = 0;
    var menuWidth;
    var menuHeight;

    var windowWidth;
    var windowHeight;

    /**
     * Initialise our application's code.
     */
    function init() {
        contextListener();
        clickListener();
        keyupListener();
        menuActionsListener();
        handleThemes();
        resizeListener();
    }

    function handleThemes() {
        let themeSelector = document.getElementById('themeSelector');
        let changeTheme = function() {
            let selectedOption = themeSelector.options[themeSelector.selectedIndex].value; // 'theme2';
            document.getElementById('context-menu').className = contextMenuClassName + ' ' + contextMenuClassName + '_' + selectedOption;
        };

        themeSelector.addEventListener('change', changeTheme);
    }

    function resizeListener() {
        window.onresize = function(e) {
            toggleMenuOff();
        };
    }

    /**
     * Listens for contextmenu events.
     */
    function contextListener() {
        document.addEventListener( "contextmenu", function(e) {
            taskItemInContext = clickInsideElement( e, taskItemClassName );

            if ( taskItemInContext ) {
                e.preventDefault();
                toggleMenuOn();
                positionMenu(e);
            } else {
                taskItemInContext = null;
                toggleMenuOff();
            }
        });
    }

    /**
     * Listens for click events.
     */
    function clickListener() {
        document.addEventListener( "click", function(e) {
            var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

            if ( clickeElIsLink ) {
                e.preventDefault();
                menuItemListener( clickeElIsLink );
            } else {
                var button = e.which || e.button;
                if ( button === 1 ) {
                    toggleMenuOff();
                }
            }
        });
    }

    /**
     * Listens for keyup events.
     */
    function keyupListener() {
        window.onkeyup = function(e) {
            if ( e.keyCode === 27 ) {
                toggleMenuOff();
            }
        }
    }

    /**
     * Listens for menuActions events.
     */
    function menuActionsListener() {
        let icons = document.querySelectorAll('.menuAction');
        for(let i = 0; i < icons.length; i++) {
            let icon = icons[i];
            icon.addEventListener('click', function(event) {
                let targetElement = findAncestor(event.target, 'task');
                let action = icon.getAttribute('data-action');
                handleMenuOptions(targetElement, action);
            })
        }
    }

    /**
     * Turns the custom context menu on.
     */
    function toggleMenuOn() {
        if ( menuState !== 1 ) {
            menuState = 1;
            menu.classList.add( contextMenuActive );
        }
    }

    function toggleMenuOff() {
        if ( menuState !== 0 ) {
            menuState = 0;
            menu.classList.remove( contextMenuActive );
        }
    }

    function handleMenuOptions(targetElement, action) {

        switch(action) {
            case 'view':
                let src = targetElement.querySelector("a").getAttribute('href');
                window.location.href = src;
                break;
            case 'edit':
                let textNode = targetElement.querySelector(".label").firstChild;
                let newLabel = prompt("Introduceti noul nume:");
                textNode.nodeValue = newLabel;
                break;
            case 'delete':
                let parent = targetElement.parentNode;
                parent.removeChild(targetElement);
                break;
        }
    }

    function menuItemListener( link ) {
        let action = link.getAttribute("data-action");
        let taskId = taskItemInContext.getAttribute("data-id");
        let targetElement = document.querySelectorAll("[data-id='"+taskId+"']")[0];
        handleMenuOptions(targetElement, action);
        toggleMenuOff();
    }

    function iconsListener( ) {
        let action = link.getAttribute("data-action");
        let taskId = taskItemInContext.getAttribute("data-id");
        let targetElement = document.querySelectorAll("[data-id='"+taskId+"']")[0];
        handleMenuOptions(targetElement, action);
        toggleMenuOff();
    }

    /**
     * Run the app.
     */
    init();

})();