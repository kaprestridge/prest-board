# This is a basic cribbage board, built as a test of some current free LLM tools capacities
My goal was to create as much of the app as the Product Manager, not reading or editing the code manually.
A lot of the boiler-plate was done well by Claude, but as soon as there was a bug, I had to point out and debug manually.
The crib board also took many iterations and some manual intervention to get right, but that wasn't surprising as svg paths are tricky with any tools.
Overall the tool picked a reletively sensible stack when given a brief, and did a decent job at a first path.
It fell over when debugging, with svgs and the App.js file got quite large quickly. I can see many places for improvement but am overall pretty happy for a very simple application with no production requirements.

Built with React + Vite template

## Running the Project

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed.
- Install Yarn if not already installed:
  `npm install -g yarn`

### Installation
Install dependencies:
`yarn install`
### Development
Start the development server:
`yarn dev`
This will start the app in development mode. By default, it runs on http://localhost:5173/ (or another port if configured).