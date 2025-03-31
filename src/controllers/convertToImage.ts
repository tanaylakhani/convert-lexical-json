import { Request, Response } from 'express';
import { setConfig } from '../lib/index'

export const ConvertToImage = async (request: Request, response: Response) => {
  try {
    const { json, config } = request.body

    if (!json) {
      return response.status(400).json({ error: 'Missing JSON data' })
    }

    // Apply custom config if provided
    if (config) {
      setConfig(config)
    }
    return response.status(200).json({ 
      image_url: "htmlContent"
    })
  } catch (error) {
    const msg = 'Internal server error:';
    console.error(msg, error);
    return response.status(500).json({ error: msg, success: false });
  }
};
