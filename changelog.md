# changelog of cogprotolab development

- **Jan, 2022**
    - initial commit
    - UX update
    - left-top pane: added predefined scripts
    - removed cmd-delay time. Php telnet script now waits for `guile>` prompt to appear,
    then returns the output. Interfacing command prompt works faster now.
    - support for prompts other than `guile>`
    - along scripts editing, added predefined and visualization scripts creating, renaming,
    deleting, and saving to disk without a need for running an external editor. Just be sure
    to adjust file access privileges for the `scripts` folder.
    
- **Feb, 2022**
    - changing "GET" to "POST" AJAX method - supporting saving bigger scripts
    - more reasonable memory usage
    - maximize/restore buttons on editors
