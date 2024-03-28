# Redirect bypass Medium

Just a simple Chrome extension to bypass Medium's redirect whenever open a Medium link.

## Features

You can use [Medium](https://medium.com/) or any medium list as normal. This extension will trigger only when you choose a particular article to read.

## Implementation Notes

File `background.js`:
- function `requestHandler()` is the main function to handle the request.
- function `chrome.tabs.onUpdated.addListener()` is called whenever go back to previous page.

## Running this extension

1. Download the ZIP file from [Releases](https://github.com/quanduongduc/redirect-bypass-medium/tags) and extract it.
2. In Chrome, open the extensions page, enable developer mode and click "Load unpacked" to select the extracted folder.
3. Enjoy!
