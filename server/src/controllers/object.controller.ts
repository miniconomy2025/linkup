import { Request, Response, NextFunction } from 'express';

export const ObjectController = {
  getImageById: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

    postImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.file); // The uploaded file info and buffer
            console.log(req.body.caption); // The caption text
            
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // You can now access the file buffer with req.file.buffer
            // and the caption with req.body.caption

            // Process file or save it, then send response
            res.json({ message: 'File received' });
        } catch (error) {
            next(error);
        }
    },
  
  getVideoById: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

    postVideo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.file); // The uploaded file info and buffer
            console.log(req.body.caption); // The caption text
            
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // You can now access the file buffer with req.file.buffer
            // and the caption with req.body.caption

            // Process file or save it, then send response
            res.json({ message: 'File received' });
        } catch (error) {
            next(error);
        }
    },
}; 