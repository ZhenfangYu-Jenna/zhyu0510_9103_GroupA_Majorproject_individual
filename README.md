# zhyu0510_Zhenfang_Yu_9103_tut03_GroupA_FinalIndividualWork
## Interaction Guide
This sketch responds to both audio and mouse interactions.
Interaction via pressing the spacebar to play music:
- First press: Music starts, all circles begin “breathing” in time with the sound.
- Second press: Music pauses.
- Press the spacebar again to resume the loop.

Music is controlled by mouse movement:
Vertical mouse movement (Y-axis): Controls volume in real-time. Music is louder at the top of the screen and quieter at the bottom.
Horizontal mouse movement (X-axis): Controls stereo panning. When the mouse is on the left, sound shifts to the left channel; on the right, sound shifts to the right channel.

# Personal Design Details
## Driving Mechanism:
This animation is driven by the music's overall amplitude and volume level using p5.Amplitude.
Each ring is surrounded by three concentric halos.
The size of the halos is controlled by the real-time amplitude of the playing sound. When the music intensifies, the halos expand more noticeably; when the music softens, the halos contract closer to the core ring. The inner geometry of the rings themselves remains relatively stable, allowing viewers to observe the structural design amidst the dynamic surrounding glow.

## Inspiration

Conceptually, this sketch extends my interest in audiovisual synesthesia:
The halo's diffusion with music draws inspiration from Dope Sound artist's work on Behance—a radiating effect from the center outward.
[Link text](https://www.behance.net/gallery/87240561/Dope-Sound)
For the sound code, I found inspiration in the Week 11 course materials.


## Differences from the Group Project

Graphics evolved from simple falling diffusion to rhythmic contraction and expansion synchronized with music. The original single-layer halo was restructured into three layers for heightened diffusion impact.
Separated motion layers were intentionally distinct:
- Two distinct rings interacting with sound
- Constant falling motion independent of audio

Interactive sound control via mouse was added, offering viewers direct engagement with the piece.

## Tools & Learning
Building upon the group project foundation, my primary musical implementations included:
1. Loading and looping audio files using loadSound and song.loop()
2. Measuring amplitude with p5.Amplitude() and getLevel()
3. Real-time volume and pan control using song.setVolume() and song.pan().
Whenever I needed specific behaviors—such as mapping mouse movements to sound parameters or creating responsive halos—I consulted the p5.js website for reference and adapted the code to my own visual system.
