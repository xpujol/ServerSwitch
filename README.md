ServerSwitch
============

A chrome plugin to switch a URL between servers

Installation
------------

As this isn't in the Chrome Plugins store, you'll need to add it to Chrome manually. This isn't hard though. 

As of Chrome Version 19.0.1084.52 on Mac OSX 10.7.3 and a few versions of Chrome on Windows 7 it goes like this:

- Click the spanner icon
- Click the "Settings" option
- On the left hand menu, select "Extensions"
- Ensure "Developer Mode" is selected
- Click "Load unpcked extension option"
- Navigate to the folder where you unzipped ServerSwitch and press the "Select" button

that's it, it should appear in the toolbar at the top next to the Omnibox. 
Whenever you pull down changes or update the code yourself you'll need to click the "Reload" link in the extension settings.

Chrome is always changing, so these guidelines may well fall out of date quickly, 
but Google never move the settings that far from where they were before.

Usage
-----

To use the plugin you'll need to populate the server list. This is stored in localStorage in your browser.
Click the ServerSwitch icon, type in a server name and click "Add Server" - e.g. mysite.co.uk
Then navigate to a URL, for example http://dev.mysite.co.uk?foo=bar, then click the ServerSwitch icon, click on "mysite.co.uk" and you'll be taken to "http://mysite.co.uk?foo=bar

Updates
-------

The plugin is currently very ugly, I plan on making it a little bit nicer to look at, and maybe added some other features to handle subdomains in the future.

Credits
-------

The icon for server switch is from the Silk Icon pack available here: http://www.famfamfam.com/lab/icons/silk/