# CogProtoLab

*CogProtoLab* is in-browser AtomSpace visualizer and a telnet scripting interface to CogServer.

![](media/ssh-800-cogprotolab.png)

## about the application

OpenCog comes with command line tools for exchanging data with AtomSpace. *CogProtoLab* is built on top of this tool chain by teaming up AtomSpace command prompt with a novel AtomSpace visualizer.

## why cogprotolab?

Newcomers to OpenCog may face a dificulty of working with command line which are most of OpenCog tools based on. And like command line isn't intimidating enough, the essence of symbolic artificial intelligence is by itself such a complex matter that its complexity may cause additional confusion. In a hope of easing comprehension of OpenCog symbolic segment to newbies, *CogProtoLab* tries to visually represent OpenCog AtomSpace internal states, so it is immediately visible how specific commands affect AtomSpace contents. Different hypergraph-rewriting strategies may then be visually traced in a process of communicating to CogServer while learning about OpenCog internals. Following a minimalistic design philosophy, *CogProtoLab* user interface tries to appear as simple as it can, shifting user focus from learning how to interact with *CogProtoLab* to learning the real design of OpenCog AtomSpace.

## short instructions

The application is consisted of two panes. Left pane contains telnet configuration parameters, and some utility controls to corroborate input command prompt for communicating to CogServer. Input command prompt tries to simulate standard REPL scheme interface to CogServer. Multiline input is obtained by holding `shift` while hitting `enter`. Standard pasting from clipboard should also work fine. History of previously entered commands is accessed by pressing up and down arrows. Entered command is sent to CogServer on hitting `enter` on its own. Output of the command is then brought back and displayed in the prompt interface. At the same time, right pane visualizer is updated to reflect the current visualisation query to AtomSpace. Please refer to built in application instructions for info about navigating visualizer (the bottom-right questionmark).

## how does it work

*CogProtoLab* left pane command prompt internally uses a php telnet connection for exchanging information with CogServer. Upon sending each prompt input, while its output is being captured and displayed as text, a hidden telnet query command from the current contents of `visualisation script` text area is being sent to CogServer. Its output is then captured by *CogProtoLab* and visually displayed in the right pane.

### installing

Prerequisites:
- CogServer
- Appache HTTP Server
- PHP 7.4.3

After installing prerequisites, there is no build procedure, just clone this package to a folder of your choice anywhere under the HTTP server home folder. It is possible to have multiple instances of *CogProtoLab* in multiple folders simultaneously.

### running

As a first step, we have to run `cogserver` from the OS command prompt where a HTTP server resides, then to open `index.html` from the package root in a web browser over the HTTP server, possibly to adjust telnet connection defaults, and we are ready to start interacting with AtomSpace in *CogProtoLab*.

To modify predefined scripts and visualisation commands, we can edit, create, or delete files in folders `dir-scripts/` and `dir-visuals/`, respectively. Contents of these folders are automatically loaded into the web page upon loading or refreshing it. We can also edit (but not create or delete) these files directly in the browser, although the changes will not be permanently saved.

To adjust some parameters like predefined telnet configuration, font sizes, colors, shadows, ..., edit files `init-ctrl.js` for the left application pane, and `init-fract.js` for the right application pane. These init files are allocating relevant JSON objects, and should be self-descriptive on their own.

### test drive

After opening *CogProtoLab* application in web browser, one can perform a simple test to track changing contents of AtomSpace. Copy and paste the following code to *CogProtoLab* command prompt in four steps:

1.

    ;Boilerplate code for loading the opencog modules
    (use-modules (ice-9 readline))
    (activate-readline)
    (add-to-load-path ".")
    (use-modules (opencog))
    (use-modules (opencog exec))

2.

    ;Some relationships
    (MemberLink (Concept "Sun") (Concept "Has mass"))
    (MemberLink (Concept "Moon") (Concept "Has mass"))
    (MemberLink (Concept "Earth") (Concept "Has mass"))

3.

    ;Graph rewriting declarations
    (define make-conclusions
        (Bind
            ;Declare the variables [optional]
            (Variable "$object")
            ;Declare the pattern used to ground the variables
            (MemberLink
                (Variable "$object")
                (Concept "Has mass"))
            
            ;If a match is found for the pattern then we want
            ;to add the following hypergraph at the Atomspace
            (MemberLink
                (Variable "$object")
                (Concept "Has gravity"))))

4.

    ;Trigger graph rewriting
    (cog-execute! make-conclusions)

Successively  entering the above commands to *CogProtoLab* command prompt should give a basic insight in tracing incremental AtomSpace inhabitation. For more examples, please refer to [AtomSpace demo examples](https://github.com/opencog/atomspace/tree/master/examples/atomspace) and [official OpenCog documentation](https://wiki.opencog.org/w/The_Open_Cognition_Project).

## known issues

- The time available for long running processes depends on AJAX call default timeout.
- Output of processes is not streamed while they run, yet it is returned after processes end.
- Because of cacheing, the application is very memory hungry. Count on capability of holding less than a thousand of visualized ovals per gigybyte of RAM. This may pose a problem with larger datasets.

## licensing information

This package, like the most of OpenCog packages, is licensed under [AGPL-3.0 license](LICENSE).
