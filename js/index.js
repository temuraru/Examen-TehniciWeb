"use strict";
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('init.js');

    window.addEventListener('resize', resizeContainer, true);
    resizeContainer();

}

function resizeContainer() {
    console.log('resizeContainer.js');
    let tasksHeight = getContainerInnerHeight();

    let tasksContainer = document.querySelector('.tasks');
    tasksContainer.style.height = tasksHeight + 'px';

    let tasks = document.querySelectorAll('.task');
    let taskHeight = Math.floor((tasksHeight - 1) / tasks.length);
    console.log('tasksHeight: ', tasksHeight);
    console.log('taskHeight: ', taskHeight);
    for(let i=0; i < tasks.length; i++) {
        tasks[i].style.height = taskHeight + 'px';
        let taskFontSize = Math.min(36, Math.max(14, Math.floor(taskHeight / 2)));
        tasks[i].style.fontSize = taskFontSize + 'px';
        tasks[i].style.lineHeight = taskHeight + 'px';
        tasks[i].className = (i % 2 === 1 ? 'task odd' : 'task');
    }
}