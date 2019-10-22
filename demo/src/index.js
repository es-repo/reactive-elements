import elem from './r-elem';
import panel from './panel.js';

import mirrorInput from './mirror-input';
import mirrorInputSourceCode from '!!raw-loader!./mirror-input.js';

import typeLetters from './type-letters';
import typeLettersSourceCode from '!!raw-loader!./type-letters.js';

import todoList from './todo-list';
import todoListSourceCode from '!!raw-loader!./todo-list.js';

import pushColorButtons from './push-color-buttons';
import pushColorButtonsSourceCode from '!!raw-loader!./push-color-buttons.js';

import githubUsers from './github-users';
import githubUsersSourceCode from '!!raw-loader!./github-users.js';

import filesAndFolders from './files-and-folders';
import filesAndFoldersSourceCode from '!!raw-loader!./files-and-folders.js';

import imoji from './imoji';

import 'highlight.js/styles/dracula.css';
import codeHighlighter from 'highlight.js';
codeHighlighter.configure({ languages: ['js'] });

elem(document.head)
  .child(
    elem('style')
      .set(e => e.innerHTML =
        `@keyframes fade-in {0% {opacity: 0;} 100% { opacity: 1; }}
        @keyframes down-and-left {0% {opacity: 0; transform: scale(6, 6);} 10% { opacity: 1; transform: scale(1, 1);} 100% { transform: translateX(-50%); }}
        button { border: 1px solid #888; border-radius:4px; outline: none; background:white; height: 1.5rem; } 
        button:active:not([disabled]){transform:translate(2px, 2px)}
        button:disabled { color: #999; }
        fieldset { margin-bottom: 2rem;}
        h2 {margin:1rem;}`
      )
  );

elem(document.body)
  .set(e => e.style.cssText = 'font-family:sans-serif;color:#444')
  .child(

    panel('Mirror input', mirrorInputSourceCode)
      .bodyChild(
        mirrorInput()),

    panel('Type letters', typeLettersSourceCode)
      .bodyChild(
        typeLetters()),

    panel('Todo list', todoListSourceCode)
      .bodyChild(
        todoList()),

    panel('Push color buttons', pushColorButtonsSourceCode)
      .bodyChild(
        pushColorButtons()),

    panel('Github users', githubUsersSourceCode)
      .bodyChild(
        githubUsers()),

    panel('Files & Folders', filesAndFoldersSourceCode)
      .bodyChild(
        filesAndFolders()),

    imoji()
  );