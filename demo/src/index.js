import elem from './r-elem';
import panel from './panel.js';
import pushColorButtons from './push-color-buttons';
import typeLetters from './type-letters';
import mirrorInput from './mirror-input';
import todoList from './todo-list';
import githubUsers from './github-users';
import filesAndFolders from './files-and-folders';
import imoji from './imoji';

elem(document.head)
  .child(
    elem('style')
      .set(e => e.innerHTML =
        `@keyframes fade-in {0% {opacity: 0;} 100% { opacity: 1; }}
        @keyframes down-and-left {0% {opacity: 0; transform: scale(6, 6);} 10% { opacity: 1; transform: scale(1, 1);} 100% { transform: translateX(-50%); }}
        button { border: 1px solid #888; border-radius:4px; outline: none; background:white; height: 1.5rem; } 
        button:active:not([disabled]){transform:translate(2px, 2px)}
        button:disabled { color: #999; }
        fieldset { margin-bottom: 2rem;}`
      )
  );

elem(document.body)
  .set(e => e.style.cssText = 'font-family:sans-serif;color:#444')
  .child(

    panel('Mirror input')
      .bodyChild(
        mirrorInput()),

    panel('Type letters')
      .bodyChild(
        typeLetters()),

    panel('Todo list')
      .bodyChild(
        todoList()),

    panel('Push color buttons')
      .bodyChild(
        pushColorButtons()),

    panel('Github users')
      .bodyChild(
        githubUsers()),

    panel('Files & Folders')
      .bodyChild(
        filesAndFolders()),

    imoji()
  );