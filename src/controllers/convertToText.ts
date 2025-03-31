import { Request, Response } from 'express';
import { toView } from '../lib/index'

export const ConvertToText = async (request: Request, response: Response) => {
  try {
    const { json, options } = request.body

    if (!json) {
      return response.status(400).json({ error: 'Missing JSON data' })
    }

    // Convert to plain text view
    const textContent = toView(json, options)

    return response.status(200).json({ 
      text: textContent 
    })
  } catch (error) {
    console.error('Error converting to text:', error)
    return response.status(500).json({ 
      error: 'Failed to convert JSON to text',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
};
