import {Router} from 'express';
import AuthController from '../controllers/auth.controller';
import {Routes} from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import ValidationMiddleware from '../middlewares/validation.middleware';
import {AuthSignupDto} from '../dtos/auth.signup.dto';
import {AuthSigninDto} from '../dtos/auth.signin.dto';
import {AuthForgotDto} from '../dtos/auth.forgot.dto';
import {AuthActivateTokenEmailDto} from '../dtos/auth.activate.token.email.dto';
import {AuthSendActivateEmailDto} from '../dtos/auth.send.activate.email.dto';
import {AuthSendActivatePhoneDto} from '../dtos/auth.send.activate.phone.dto';
import {AuthResetPasswordEmailDto} from '../dtos/auth.reset.password.email.dto';
import {AuthResetPasswordPhoneDto} from '../dtos/auth.reset.password.phone.dto';
import {AuthActivateTokenPhoneDto} from '../dtos/auth.activate.token.phone.dto';
import isSignInMiddleware from '../middlewares/is.sign.in.middleware';

export default class AuthRoute implements Routes {
  public pathNested = '/api/auth';
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // const createLimiter = rateLimit({
    //   windowMs: 60 * 60 * 1000, // 1 hour window
    //   max: 5, // start blocking after 5 requests
    //   message: i18n.t('middleWear.throttle'),
    // });

    this.router.post(`${this.pathNested}/signin`, isSignInMiddleware, ValidationMiddleware(AuthSigninDto, 'body'), this.controller.signIn);
    this.router.post(`${this.pathNested}/refresh`, authMiddleware, this.controller.refresh);
    this.router.post(`${this.pathNested}/signup`, isSignInMiddleware, ValidationMiddleware(AuthSignupDto, 'body'), this.controller.signUp);
    this.router.post(
      `${this.pathNested}/activate-account-email`,
      isSignInMiddleware,
      ValidationMiddleware(AuthActivateTokenEmailDto, 'body'),
      this.controller.activationViaEmail,
    );
    this.router.post(
      `${this.pathNested}/send-activate-email`,
      isSignInMiddleware,
      ValidationMiddleware(AuthSendActivateEmailDto, 'body'),
      this.controller.sendActivateCodeViaEmail,
    );
    this.router.post(
      `${this.pathNested}/activate-account-sms`,
      isSignInMiddleware,
      ValidationMiddleware(AuthActivateTokenPhoneDto, 'body'),
      this.controller.activationViaSms,
    );
    this.router.post(
      `${this.pathNested}/send-activate-sms`,
      isSignInMiddleware,
      ValidationMiddleware(AuthSendActivatePhoneDto, 'body'),
      this.controller.sendActivateCodeViaSms,
    );

    this.router.post(`${this.pathNested}/forgot`, isSignInMiddleware, ValidationMiddleware(AuthForgotDto, 'body'), this.controller.forgot);
    this.router.post(
      `${this.pathNested}/reset-password-email`,
      isSignInMiddleware,
      ValidationMiddleware(AuthResetPasswordEmailDto, 'body'),
      this.controller.resetPasswordViaEmail,
    );
    this.router.post(
      `${this.pathNested}/reset-password-sms`,
      isSignInMiddleware,
      ValidationMiddleware(AuthResetPasswordPhoneDto, 'body'),
      this.controller.resetPasswordViaSms,
    );
  }
}
