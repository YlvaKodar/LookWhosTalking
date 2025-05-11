# Look Who's Talking

A web-based meeting timer tool that helps track and analyze speaking time distribution by gender in meetings and group conversations.

## Overview

"Look Who's Talking" allows users to keep track of how time is distributed between genders in mixed-gender conversation. It provides a visualization of speaking patterns based on gender. The purpose is to help organizations identify potential gender-based participation imbalances.
Please note that this tool is just meant to provide users with a simple overvue visualization of speaking patterns. It does not claim to offer ultra precise timing or statistics and it is not designed to nudge anyone to better meeting manners.

This is a (some what rushed) **prototype version** shared for testing and feedback. When evaluated, it will serve as the modell for a Java/Kotlin application availible for smartphones. Hopefully.
It is on one hand a commissioned project, but it is also an experiment and a learning opportunity.

## Features

- **Meeting Setup**: Configure meeting information and participant demographics
- **Real-time Tracking**: Track speaking time by gender with simple button presses
- **Pop-out Timer**: Simple detachable timer window for easier tracking on the side
- **Statistical Analysis**: Automatic calculation of speaking time distribution
- **Visual Reports**: See meeting data through clear charts and statistics

## How to Use

1. **Start a New Meeting**:
   - Click "New Meeting" from the start screen
   - Enter meeting name, date, and number of participants by gender
   - Click "Start Meeting"

2. **Track Speaking Time**:
   - Click the corresponding gender button every time someone starts talking (click the same button if a new person of the same gender starts talking)
   - Use "Pause" when there's silence or a break
   - Use "Pop Out Timer" for a separate timer window

3. **End the Meeting**:
   - Click "End Meeting" when the meeting concludes
   - View statistics about the speaking time distribution

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses Chart.js for data visualization
- Data is stored locally in the browser (localStorage)
- Deployed on GitHub Pages
- No server-side components or data collection

## Known Limitations

- Data is stored in browser localStorage and may be lost if:
  - Browser storage is cleared
  - Private/incognito mode is used
  - Storage limits are reached
- If data storage issues occur, try using a different browser
- "Pop Out Timer" may be blocked by popup blockers
- "Pop Out Timer" will not automatically stay on top of other windows or applications
- There is as yet no functions for groups whith participants of unknown gender.
- There is as yet no tool for getting statiatics downloaded or emailed. 

Oh, and also:
- The app is in severe need of some deep styling.
- The code is in severe need of some deep cleaning.
- There are, as of now, some structural issues, and designe patterns and utils are not fully implemented.
- There are lots of things I should have done differently. But that's learning for ya. 

## Roadmap

Features planned for future releases:
- Email or PDF export of meeting statistics
- Data persistence across sessions
- Historical data and trends across multiple meetings
- Mobile app version in Java/Kotlin

## Acknowledgments

- Originally inspired by the GenderTimer and other tools no longer availible.
- Built as a portfolio project for Java development studies.
