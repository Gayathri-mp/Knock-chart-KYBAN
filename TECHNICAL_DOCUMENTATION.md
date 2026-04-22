# Technical Documentation: Knockout Tournament Bracket

## 🚀 Overview
The **Knockout Tournament Bracket** is a high-performance React Native (Expo) application designed to generate, manage, and visualize single-elimination tournament structures. It features a modern "Cosmic Dark" aesthetic and precise mathematical positioning for its bracket visualization.

---

## 🛠 Tech Stack
*   **Core Framework**: [Expo](https://expo.dev/) (React Native for Web/Mobile)
*   **Styling**: React Native `StyleSheet` (Vanilla CSS-in-JS)
*   **Graphics**: `react-native-svg` (used for the "elbow" bracket connectors)
*   **Icons**: `lucide-react-native`
*   **Animations**: Built-in React Native `Animated` API (used in the Victory Podium)
*   **Deployment**: Vercel (Configured with `vercel.json` for SPA routing)

---

## 🧩 The Problem & Challenge
Building a tournament bracket is technically challenging due to:
1.  **Dynamic Scaling**: The layout must change drastically depending on whether there are 4, 8, 16, or 32 teams.
2.  **Alignment**: Traditional Flexbox or Grid systems fail to align the "elbow" lines between matches across different rounds.
3.  **State Cascading**: If a winner is changed in Round 1, every subsequent match in that branch must be reset or updated automatically.

---

## 💡 The Solution: Mathematical Positioning
Unlike standard web layouts, this project uses an **Absolute Coordinate System**. Every node's $(X, Y)$ position is calculated using specific constants:

*   **Pitch**: The vertical distance between match pairs in a specific round.
*   **Column Gap**: The horizontal distance between tournament rounds.
*   **Origin Calculation**: A unified `(PAD_X, PAD_Y)` origin ensures that the SVG lines and the UI buttons always overlap perfectly.

### Key Logic in `BracketView.tsx`:
```typescript
const pitch = (r: number) => Math.pow(2, r) * (PAIR_H + ROW_GAP);
const colLeft = (r: number) => r * (NODE_W + COL_GAP);
```

---

## 🧠 Complex Functions Implementation

### 1. Bracket Generation (`generateBracket`)
Located in `src/lib/tournament.ts`, this function creates a `MatchMap`. 
*   **How it works**: It splits the tournament into a "Left" and "Right" half. It generates nodes for each round and assigns a `nextMatchId` to each node, forming a tree-like data structure that eventually converges at the "Grand Final".

### 2. Cascading Resolution (`resolveBracket`)
This is the "engine" of the tournament.
*   **Implementation**: It performs a bottom-up traversal of the match map. It checks for winners in Round 0 and "propogates" them to the next match. 
*   **Recursion**: It uses a `resetDownstream` function to ensure that if a user changes their mind about a winner in an early round, all future matches currently assigned to that team are cleared to prevent illegal tournament states.

### 3. SVG Elbow Connectors
To create the professional "bracket lines," we calculate three points for every connection:
1.  **Start**: The right edge of the current match.
2.  **Mid-way**: A vertical line that drops or rises to meet the next round's height.
3.  **End**: The left edge of the next match.

---

## 🏆 Functional Features
*   **Manual Selection**: Users can click any slot to assign a team.
*   **Winner Propagation**: Clicking the "Swords" icon between teams moves the winner to the next round.
*   **3rd Place Match**: Automatically maps the losers of the Semi-Finals into a separate Bronze medal match.
*   **Victory Podium**: A specialized modal that calculates 1st, 2nd, and 3rd place rankings upon tournament completion and displays them with a custom animation sequence.

---

## 🏗 Project Structure
*   `/src/lib`: Core tournament logic and TypeScript interfaces.
*   `/src/hooks`: `useTournament.ts` - The primary state controller.
*   `/src/components`: UI components (BracketView, MatchNode, VictoryModal).
*   `/App.tsx`: Main entry point handling navigation between Setup and Bracket views.
