# Look Who's Talking

A web-based meeting timer tool that helps track and analyze speaking time distribution by gender in meetings and group conversations.

## Overview

"Look Who's Talking" allows users to keep track of how time is distributed between genders in mixed-gender conversation. It provides a visualization of speaking patterns based on gender. The purpose is to help organizations identify potential gender-based participation imbalances.
Please note that this tool is just meant to provide users with a simple overview visualization of speaking patterns. It does not claim to offer ultra precise timing or statistics and it is not designed to nudge anyone to better meeting manners.

This is a (some what rushed) **prototype version** shared for testing and feedback. The end goal is a PWA with backend in Java (Spring Boot); the PWA will have login functionality and capacity to save and organize meeting statistics in groups, analyse changes in meeting behaviour over time etc.

It is on one hand a commissioned project, but it is also an experiment and a learning opportunity.

## Features

- **Meeting Setup**: Configure meeting information, participant demographics and colour scheme.
- **Real-time Tracking**: Track speaking time by gender with simple button presses.
- **Pop out Timer Tool**: Simple detachable timer window for easier tracking on the side.
- **Statistical Analysis**: Automatic calculation of speaking time distribution.
- **Visual Reports**: See meeting data through clear charts and statistics.
- **PDF download**: Save the stats by downloading them as a PDF.

## How to Use

1. **Start a New Meeting**:
   - Click "New Meeting" from the start screen.
   - Enter meeting name, date, and number of participants by gender; choose a colour scheme.
   - Click "Start Meeting".

2. **Track Speaking Time**:
   - Click the corresponding gender button every time someone starts talking (click the same button if a new person of the same gender starts talking).
   - Use "Pause" when there's a silence or a break.
   - Use the popout timer tool for a separate timer window.

3. **End the Meeting**:
   - Click "End Meeting" when the meeting concludes.
   - View statistics about the speaking time distribution.
   - Click "Download as PDF" to download the info as a PDF.


## Technical Details

- Built with vanilla JavaScript, HTML, and CSS.
- Uses Chart.js for data visualization.
- Data is stored locally in the browser (localStorage).
- Deployed on GitHub Pages.
- No server-side components or data collection.

## Known Limitations

- Data is stored in browser localStorage and may be lost if:
  - Browser storage is cleared
  - Private/incognito mode is used
  - Storage limits are reached
- If data storage issues occur, try using a different browser
- Pop out timer may be blocked by popup blockers
- Pop out timer will not automatically stay on top of other windows or applications
- There is as yet no functions for groups with participants of unknown gender.

Oh, and also:
- The app is in severe need of some deep styling.
- The code is in severe need of some deep cleaning.
- There are, as of now, some structural issues, and design patterns and utils are not fully implemented.
- There are lots of things I should have done differently. But that's learning for ya. 

## Roadmap

Features planned for future releases:
- Data persistence across sessions
- Historical data and trends across multiple meetings
- PWA app version in Java/Kotlin

## Acknowledgments

- Originally inspired by the GenderTimer and other tools no longer available.
- Built as a portfolio project for Java development studies.

