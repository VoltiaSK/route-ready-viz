
# Fleet Electrification Visualization

A visualization tool for analyzing fleet electrification readiness.

## Setup and Development

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Run development server
npm run dev
```

### Building the Project
```bash
# Build for production
npm run build
```

## Generating Fleet Data

To generate the template JSON file with 150 vehicles:

```bash
# Run the data generation script
npx ts-node src/utils/generateTemplateJSON.ts
```

This will create a file at `public/fleetData.json` containing simulated vehicle data.

## Deployment to Vercel

### Setup

1. Push your repository to GitHub
2. Visit [vercel.com](https://vercel.com) and log in
3. Click "New Project" and import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

## Embedding in Webflow

### Method 1: Web Component (Recommended)

1. After deployment, your Web Component will be available at:
   ```
   https://your-vercel-domain.com/fleet-visualization.js
   ```

2. In Webflow, add a new "Embed" element where you want the visualization
3. Insert this code:

   ```html
   <script src="https://your-vercel-domain.com/fleet-visualization.js"></script>
   <fleet-visualization style="width: 100%; height: 800px;"></fleet-visualization>
   ```

4. To use custom JSON data:

   ```html
   <script src="https://your-vercel-domain.com/fleet-visualization.js"></script>
   <fleet-visualization data-url="https://example.com/your-vehicle-data.json" style="width: 100%; height: 800px;"></fleet-visualization>
   ```

### Method 2: iframe Embed

If you prefer using an iframe:

```html
<iframe src="https://your-vercel-domain.com" width="100%" height="800" frameborder="0" scrolling="no"></iframe>
```

With custom data:

```html
<iframe src="https://your-vercel-domain.com?dataUrl=https://example.com/your-vehicle-data.json" width="100%" height="800" frameborder="0" scrolling="no"></iframe>
```

## JSON Data Format

Your data should follow this format:

```json
{
  "data": [
    {
      "depot": "SK",
      "lorry": "7M73322",
      "average_distance": 142,
      "minimum_distance": 28,
      "maximum_distance": 376,
      "median_distance": 120,
      "min_95_perc": 30,
      "max_95_perc": 230,
      "average_highway_distance": 85,
      "median_highway": 72
    }
    // More vehicle entries...
  ]
}
```
