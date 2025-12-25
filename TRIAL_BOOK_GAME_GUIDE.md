# Trial Book Game - How to Edit

## Location
File: `src/pages/TrialBookGame.tsx`

## What to Edit

### 1. Game Data (Lines 9-120)

Look for the `GAME_DATA` constant at the top of the file. This contains all the game content.

### 2. Edit Hints for Each Round

```typescript
{
  roundNumber: 1,
  hints: [
    "Your first hint here",      // Hint 1
    "Your second hint here",      // Hint 2
    "Your third hint here",       // Hint 3
  ],
  correctAnswerIndex: 0,  // Which box (0-11) has the correct answer
}
```

**Example:**
```typescript
{
  roundNumber: 1,
  hints: [
    "This person was born in India",
    "He led India to independence",
    "Known as the Father of the Nation",
  ],
  correctAnswerIndex: 5,  // If "Mahatma Gandhi" is in box 6 (index 5)
}
```

### 3. Edit Answer Boxes (12 total)

```typescript
answers: [
  "Answer 1",   // Index 0 - Used in Round 1
  "Answer 2",   // Index 1 - Used in Round 2
  "Answer 3",   // Index 2 - Used in Round 3
  "Answer 4",   // Index 3 - Used in Round 4
  "Answer 5",   // Index 4 - Used in Round 5
  "Answer 6",   // Index 5 - Used in Round 6
  "Answer 7",   // Index 6 - Used in Round 7
  "Answer 8",   // Index 7 - Used in Round 8
  "Answer 9",   // Index 8 - Used in Round 9
  "Answer 10",  // Index 9 - Used in Round 10
  "Decoy 1",    // Index 10 - Wrong answer (decoy)
  "Decoy 2",    // Index 11 - Wrong answer (decoy)
]
```

### 4. Set Correct Answer Index

For each round, set `correctAnswerIndex` to match where the correct answer is in the answers array.

**Important:** Index starts at 0!
- Box 1 = Index 0
- Box 2 = Index 1
- Box 3 = Index 2
- ...
- Box 12 = Index 11

## Example Complete Round

```typescript
// In rounds array
{
  roundNumber: 1,
  hints: [
    "He painted the Mona Lisa",
    "Italian Renaissance artist",
    "Also known for The Last Supper",
  ],
  correctAnswerIndex: 7,  // Leonardo da Vinci is at index 7
}

// In answers array
answers: [
  "Pablo Picasso",
  "Vincent van Gogh",
  "Michelangelo",
  "Rembrandt",
  "Claude Monet",
  "Salvador Dali",
  "Frida Kahlo",
  "Leonardo da Vinci",  // Index 7 - Correct answer for Round 1
  "Andy Warhol",
  "Banksy",
  "Bob Ross",          // Decoy 1
  "M.F. Husain",       // Decoy 2
]
```

## Game Mechanics (Already Implemented)

✅ **Scoring System:**
- Correct on Hint 1: +60 coins (Wrong: -30 coins)
- Correct on Hint 2: +40 coins (Wrong: -20 coins)
- Correct on Hint 3: +20 coins (Wrong: -20 coins)
- Reveal Answer: 0 coins

✅ **Progress Tracking:**
- Each round completion = 10% progress
- Progress saved to database
- 10 rounds = 100% completion

✅ **Visual Feedback:**
- Correct answer: Green highlight
- Wrong answer: Red highlight on selected, Green on correct
- Auto-advance after 7 seconds

✅ **Coins Protection:**
- Coins cannot go below 0
- System automatically adjusts deductions

## Tips

1. **Keep hints progressively easier:**
   - Hint 1: Hardest/Most vague
   - Hint 2: Medium difficulty
   - Hint 3: Easiest/Most obvious

2. **Make decoys believable:**
   - Decoys should be related to the topic
   - Don't make them obviously wrong

3. **Test each round:**
   - Make sure correctAnswerIndex matches the right box
   - Verify hints make sense together

4. **Answer box layout:**
   ```
   Box 1  Box 2  Box 3
   Box 4  Box 5  Box 6
   Box 7  Box 8  Box 9
   Box 10 Box 11 Box 12
   ```

## Quick Edit Checklist

- [ ] Edit all 10 rounds with your hints
- [ ] Edit all 12 answer boxes with your answers
- [ ] Set correctAnswerIndex for each round (0-9 for real answers, avoid 10-11 for decoys)
- [ ] Verify hints make sense and get progressively easier
- [ ] Check that decoys are believable but wrong
- [ ] Test the game!

---

**Ready to play!** Just edit the text and you're good to go! 🎮
