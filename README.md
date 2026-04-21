🏆 Dynamic Knockout Bracket App (React Native)

A fully dynamic and interactive knockout tournament bracket generator built using React Native. This application allows users to create tournament brackets of variable sizes, assign teams, and automatically resolve matches with visual animations and progression logic.

🚀 Features
🎯 Core Functionality
Accepts dynamic number of teams (N = 2^k)
Generates a binary tree knockout structure
Supports flexible team assignment (no strict order)
🧩 Team Selection System
Scrollable dropdown with:
Team name
Team logo
Prevents duplicate selections
Replace / remove team functionality
Dynamically updates available team pool
⚙️ Auto-Resolve Engine
Uses local score dataset to determine winners
Automatically:
Resolves all matches
Propagates winners to next rounds
Recomputes bracket on updates
🥇 Match Flow Logic
Winners advance through rounds automatically
Semi-final winners → Final match
Semi-final losers → 3rd place match
Fully automated tournament resolution
🎨 Visual Indicators
🟢 Winner path → Green line
🔴 Loser path → Red line
Clear visual representation of match progression
✨ Animations
Smooth line drawing animations
Node highlight on winner selection
Progressive match resolution effect
📱 Responsive Design
Mobile-first (9:16 layout)
Scrollable bracket (vertical + horizontal)
Scales for:
4 teams
8 teams
16 teams
32+ teams
🛠️ Tech Stack
React Native (Expo)
React Hooks (useState, useEffect)
react-native-svg (for bracket lines)
react-native-reanimated / Animated API (for animations)
🧠 Core Concepts Used
Binary Tree (Bracket Structure)
State Management & Propagation
Graph Rendering
Lazy Evaluation (Auto-resolve flow)
Dynamic UI Scaling
📂 Project Structure (Suggested)
/components
  ├── Bracket.js
  ├── MatchNode.js
  ├── TeamDropdown.js
  ├── ConnectorLines.js

/utils
  ├── generateBracket.js
  ├── resolveBracket.js

/data
  ├── teams.js
  ├── teamScores.js

/screens
  ├── HomeScreen.js
⚙️ How It Works
1. Bracket Generation
User inputs number of teams
App validates power of 2
Generates a complete binary tree
2. Team Assignment
User assigns teams to leaf nodes
Dropdown dynamically filters selected teams
3. Auto Resolve

On clicking Auto-Resolve:

Validate all leaf nodes are filled
Traverse matches bottom-up
Compute winners using score data
Propagate winners to next rounds
Generate:
Final winner
3rd place winner
4. Visualization
Animated lines show progression
Winners and losers visually differentiated
📌 Constraints
Number of teams must be power of 2
No duplicate team selection
Matches resolve only when both teams exist
