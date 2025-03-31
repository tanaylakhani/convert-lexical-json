# Lexical JSON Converter API

A serverless API built for Vercel that converts Lexical JSON to HTML, plain text, and images. Perfect for adding Google Docs/Drive-like experiences to your application.

## API Endpoints

### 1. Convert to HTML

```
POST /api/convert-to-html
```

Converts Lexical JSON to HTML.

#### Request Body

```json
{
  "json": {
    "root": {
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1,
      "children": [...]
    }
  },
  "config": {
    "h1": {
      "style": {
        "fontSize": "20px",
        "fontWeight": "bold"
      },
      "class": "heading-large"
    },
    "h2": {
      "style": {
        "fontSize": "18px"
      }
    }
  }
}
```

- `json`: The Lexical JSON content (required)
- `config`: Optional styling configuration for HTML elements

#### Response

```json
{
  "html": "<h1 class=\"heading-large\" style=\"font-size: 20px; font-weight: bold;\">Title</h1><p>Content...</p>"
}
```

### 2. Convert to Image

```
POST /api/convert-to-image
```

Converts Lexical JSON to an image (PNG or JPEG).

#### Request Body

```json
{
  "json": {
    "root": {
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1,
      "children": [...]
    }
  },
  "config": {
    "h1": {
      "style": {
        "fontSize": "24px",
        "color": "#333"
      }
    }
  },
  "options": {
    "width": 800,
    "height": 600,
    "format": "png",
    "quality": 90,
    "scale": 2,
    "customCss": "body { background-color: #f9f9f9; }"
  }
}
```

- `json`: The Lexical JSON content (required)
- `config`: Optional styling configuration
- `options`: Image generation options
  - `width`: Image width in pixels (default: 800)
  - `height`: Initial image height in pixels (auto-adjusts to content)
  - `format`: "png" or "jpeg" (default: "png")
  - `quality`: JPEG quality (1-100, default: 90)
  - `scale`: Device scale factor for better resolution (default: 2)
  - `customCss`: Additional CSS styles

#### Response

The API returns the image directly with appropriate content type headers.

### 3. Convert to Plain Text

```
POST /api/convert-to-text
```

Converts Lexical JSON to plain text.

#### Request Body

```json
{
  "json": {
    "root": {
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1,
      "children": [...]
    }
  },
  "options": {
    "chordsTonality": -2
  }
}
```

- `json`: The Lexical JSON content (required)
- `options`: Optional conversion options (e.g., for chord transposition)

#### Response

```json
{
  "text": "Title\n\nContent paragraph..."
}
```

## Usage with Google Docs/Drive-like Experience

To implement a Google Docs/Drive-like experience:

1. Use the `/api/convert-to-html` endpoint to render the document content in your app
2. Use the `/api/convert-to-image` endpoint to:
   - Generate thumbnails for documents in a file browser view
   - Create preview images for social sharing
   - Provide document snapshots for users without editing permissions

## Deployment

### Prerequisites

- Node.js 16+
- Vercel account

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment to Vercel

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## Example Usage (Frontend)

```javascript
// Convert Lexical JSON to HTML
async function getHtml(lexicalJson) {
  const response = await fetch('https://your-api.vercel.app/api/convert-to-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: lexicalJson })
  });
  
  const data = await response.json();
  return data.html;
}

// Generate document image (e.g., for thumbnails)
function getThumbnailUrl(lexicalJson, width = 200) {
  const apiUrl = 'https://your-api.vercel.app/api/convert-to-image';
  const params = new URLSearchParams({
    width: width,
    format: 'jpeg',
    quality: 80
  });
  
  // For direct image usage in <img> tags
  return `${apiUrl}?${params.toString()}`;
}

// Display document in <img> tag (thumbnail view)
document.getElementById('thumbnail').src = getThumbnailUrl(lexicalJson);
```