"use strict";
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('init.js');

    window.addEventListener('resize', resizeContainer, true);
    resizeContainer();

}

function resizeContainer() {
    console.log('resizeContainer.js');
    let containerHeight = getContainerInnerHeight();

    let container = document.querySelector('.pingContainer');
    container.style.height = containerHeight + 'px';

    console.log('containerHeight: ', containerHeight);

}