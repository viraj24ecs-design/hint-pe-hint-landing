# Image Reveal Game - Setup Guide

## 🎮 Game Mechanics

### How The Game Works
This is a **progressive image reveal game** where buttons disappear **forever** as you answer correctly:

- **10 Rounds Total**: Round 1 through Round 10
- **1 Correct Answer Per Round**: Each round has exactly ONE button that's correct
- **Persistent Button State**: Buttons that are answered correctly disappear PERMANENTLY
  - Round 1: 10 buttons (if answered correctly, Button 1 disappears)
  - Round 2: 9 buttons (Button 1 is gone forever)
  - Round 3: 8 buttons (Buttons 1-2 are gone forever)
  - ...
  - Round 10: 1 button left (if all previous answers were correct)

### Scoring System
- **Correct Answer**: +60 Charity Coins ✅
  - Button turns green
  - Pops and disappears forever after 0.5s
  - That part of the image is revealed permanently
  - Game moves to next round
  
- **Wrong Answer**: -20 Charity Coins ❌
  - Button turns red
  - Button stays visible (does NOT pop)
  - You can try other buttons in the same round
  - Wrong buttons stay covering the image

### Image Reveal
- **Single Image**: The same image is used across all 10 rounds
- **Progressive Reveal**: As you answer correctly, more of the image is revealed
- **Perfect Score**: If you get all 10 correct, 100% of the image is revealed (90% by round 10, final 10% in round 10)
- **With Mistakes**: Wrong buttons stay and keep that part of the image hidden forever

## 📝 Editing Game Content

### Step 1: Update Hints
Open `src/pages/TrialBookGame.tsx` and find the `GAME_DATA` object:

```typescript
const GAME_DATA = {
  imagePath: "/images/game-image.jpg", // Single image for entire game
  rounds: [
    {
      roundNumber: 1,
      hint: "This is hint for round 1. Edit this text to your actual hint.",
      correctButtonId: 0, // Button 1 (ID 0) is correct in round 1
    },
    {
      roundNumber: 2,
      hint: "This is hint for round 2. Edit this text to your actual hint.",
      correctButtonId: 1, // Button 2 (ID 1) is correct in round 2
    },
    // ... rounds 3-10
  ],
};
```

**What to edit:**
- Change the `hint` text for each round
- Change `correctButtonId` to specify which button is correct (0-9)
  - Round 1 should have correctButtonId: 0 (Button 1)
  - Round 2 should have correctButtonId: 1 (Button 2)
  - And so on...

### Step 2: Update Button Text
Find the `ALL_BUTTONS` array:

```typescript
const ALL_BUTTONS = [
  { id: 0, text: "Answer 1" },  // Button 1
  { id: 1, text: "Answer 2" },  // Button 2
  { id: 2, text: "Answer 3" },  // Button 3
  { id: 3, text: "Answer 4" },  // Button 4
  { id: 4, text: "Answer 5" },  // Button 5
  { id: 5, text: "Answer 6" },  // Button 6
  { id: 6, text: "Answer 7" },  // Button 7
  { id: 7, text: "Answer 8" },  // Button 8
  { id: 8, text: "Answer 9" },  // Button 9
  { id: 9, text: "Answer 10" }, // Button 10
];
```

**Change the text** to your actual answer options.

### Step 3: Add Your Image
│  [4]  │  [5]    │
├───────┼─────────┤
│  [6]  │  [7]    │
├───────┼─────────┤
│  [8]  │  [9]    │
└──────────────────┘
```

Left column: Buttons 0, 2, 4, 6, 8
Right column: Buttons 1, 3, 5, 7, 9

## Example: Complete Round Setup

1. Create a folder: `/public/images/`
2. Add your image:
   - **Single Image**: `game-image.jpg` (or any name you like)
   - **Aspect Ratio**: 2:3 (portrait orientation)
   - **Recommended Resolution**: 1024x1536px (or any 2:3 ratio: 800x1200px, 600x900px, etc.)
   - **Format**: JPG or PNG
   - **Quality**: High resolution for better visibility

3. Update the image path in `GAME_DATA`:
   ```typescript
   const GAME_DATA = {
     imagePath: "/images/game-image.jpg", // <-- CHANGE THIS to your image name
     rounds: [ ... ]
   };
   ```

## Button Grid Layout
The 10 buttons are arranged as follows (2 columns x 5 rows):
```
┌──────────────────┐
│  [0]  │  [1]    │  ← Button 1, Button 2
├───────┼─────────┤
│  [2]  │  [3]    │  ← Button 3, Button 4
├───────┼─────────┤
│  [4]  │  [5]    │  ← Button 5, Button 6
├───────┼─────────┤
│  [6]  │  [7]    │  ← Button 7, Button 8
├───────┼─────────┤
│  [8]  │  [9]    │  ← Button 9, Button 10
└──────────────────┘
```

## Example Game Flow

**Round 1**: 10 buttons visible
- Player clicks Button 5 (wrong) → turns red, -20 coins, stays visible
- Player clicks Button 1 (correct) → turns green, +60 coins, pops and disappears

**Round 2**: 9 buttons visible (Button 1 is gone forever)
- Hint for Button 2 appears
- Player clicks Button 2 (correct) → pops, disappears forever

**Round 3**: 8 buttons visible (Buttons 1-2 are gone)
- And so on...

**Round 10**: If perfect score, only 1 button left (Button 10)
- Player gets final answer correct → entire image revealed!

**With Mistakes**: If player got some wrong, those buttons never popped and still cover parts of the image

## Tips

1. **Single Quality Image**: Choose one high-quality 2:3 aspect ratio image for the entire game
2. **Keep Button Text Short**: Max 2-3 words for best display on mobile
3. **Sequential Hints**: Make each hint progressively reveal the image theme
4. **Testing**: Test on mobile devices to ensure text is readable and buttons are clickable
5. **Sharp Corners**: The game uses no rounded corners - buttons fit perfectly with no gaps revealing the image
6. **Strategy**: Players must balance risk/reward - wrong answers cost coins AND prevent image reveal

## Scoring System
- **Correct Answer**: +60 Charity Coins
- **Wrong Answer**: -20 Charity Coins
- **Perfect Game**: 600 coins (10 correct answers)
- Progress automatically saved after each round

## File Locations
- **Game Logic**: `src/pages/TrialBookGame.tsx`
- **Images**: `/public/images/`
- **This Guide**: `/IMAGE_REVEAL_GAME_GUIDE.md`
