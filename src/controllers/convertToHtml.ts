import { Request, Response } from 'express';
import { setConfig, toHtml } from '../lib/index'

export const ConvertToHtml = async (request: Request, response: Response) => {
  try {
    console.log(request)
    const { json, config } = request.body

    if (!json) {
      return response.status(400).json({ error: 'Missing JSON data' })
    }

    // Apply custom config if provided
    if (config) {
      setConfig(config)
    }

    // Convert to HTML
    const htmlContent = toHtml(json)

    return response.status(200).json({ 
      html: htmlContent
    })
  } catch (error) {
    console.error('Error converting to HTML:', error)
    return response.status(500).json({ 
      error: 'Failed to convert JSON to HTML',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
};
