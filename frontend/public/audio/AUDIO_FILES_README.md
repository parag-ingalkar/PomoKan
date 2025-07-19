# Audio Files for PomoKan

This directory contains audio files used for timer notifications in PomoKan.

## Current Files

- `soft-bells-495.mp3` - Gentle, calming bell sounds (already included)

## Required Files (Placeholders Created)

The following files need to be replaced with actual audio files:

### 1. gentle-chime.mp3

- **Description**: Peaceful chime notification sound
- **Format**: MP3
- **Duration**: 2-5 seconds recommended
- **Style**: Soft, melodic chime that's not jarring

### 2. digital-beep.mp3

- **Description**: Clear digital notification sound
- **Format**: MP3
- **Duration**: 1-3 seconds recommended
- **Style**: Clean, modern digital beep sound

## How to Add Audio Files

1. Replace the placeholder text files with actual MP3 audio files
2. Keep the same filenames: `gentle-chime.mp3` and `digital-beep.mp3`
3. Ensure the files are in MP3 format for browser compatibility
4. Test the audio playback in the settings page

## Audio Selection

Users can select their preferred audio in the Settings page:

1. Click on the user avatar in the navbar
2. Select "Settings" from the dropdown menu
3. Choose from the three audio options
4. Preview each audio before selecting
5. The selected audio will play 3 times when any timer completes

## Technical Notes

- Audio files are preloaded for instant playback
- The selected audio preference is saved in localStorage
- Audio loops 3 times when timer completes
- Fallback handling for audio playback failures
