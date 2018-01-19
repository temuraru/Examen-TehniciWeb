"use strict";
document.addEventListener('DOMContentLoaded', init);

function init() {
    window.addEventListener('resize', resizeContainer, true);
    resizeContainer();
}

function resizeContainer() {
    let tasksHeight = getContainerInnerHeight();
    let tasksWidth = getContainerInnerWidth();

    let tasksContainer = document.querySelector('.tasks');
    tasksContainer.style.height = tasksHeight + 'px';

    let tasks = document.querySelectorAll('.task');
    let taskHeight = Math.floor((tasksHeight - 1) / tasks.length);
    for(let i=0; i < tasks.length; i++) {
        tasks[i].style.height = taskHeight + 'px';
        tasks[i].style.fontSize = 3 + (tasksWidth > tasksHeight ? 'vw' : 'vh');
        tasks[i].className = (i % 2 === 1 ? 'task odd' : 'task');
    }
}