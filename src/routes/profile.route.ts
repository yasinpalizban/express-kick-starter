import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import ProfileController from '../controllers/profile.controller';
import { ProfileDto } from '../dtos/profile.dto';
import multer from 'multer';
import { sharedConfig } from '../configs/shared.config';
import { multerFileFilter, multerRandomFileName } from '../utils/multerRandomFileName';

export default class ProfileRoute implements Routes {
  public path = '/api/profile';
  public router = Router();
  public controller = new ProfileController();
  private maxSize = 4 * 1000 * 1000;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const storage = multer.diskStorage({
      destination: sharedConfig.appRoot + sharedConfig.profileDirectory,
      filename: multerRandomFileName,
    });

    const upload = multer({ storage: storage, fileFilter: multerFileFilter, limits: { fileSize: this.maxSize } });
    this.router.get(`${this.path}`, authMiddleware, this.controller.index);
    this.router.post(`${this.path}`, authMiddleware, upload.single('image'), validationMiddleware(ProfileDto, 'body'), this.controller.create);
  }
}
