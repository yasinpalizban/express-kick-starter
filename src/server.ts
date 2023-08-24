import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@/routes/auth.route';
import validateEnv from '@/utils/validateEnv';
import UserRoute from '@/routes/user.route';
import ProfileRoute from '@/routes/profile.route';
import SettingRoute from '@/routes/setting.route';
import GroupRoute from '@/routes/group.route';
import PermissionGroupRoute from '@/routes/permission.group.route';
import PermissionUserRoute from '@/routes/permission.user.route';
import PermissionRoute from '@/routes/permission.route';
import OverViewRoute from '@/routes/over.view.route';
import HomeRoute from '@/routes/homeRoute';
import GraphRoute from '@/routes/graph.route';
validateEnv();

const app = new App([
  new HomeRoute(),
  new UserRoute(),
  new AuthRoute(),
  new GroupRoute(),
  new PermissionRoute(),
  new PermissionGroupRoute(),
  new PermissionUserRoute(),
  new ProfileRoute(),
  new SettingRoute(),
  new GroupRoute(),
  new OverViewRoute(),
  new GraphRoute(),

]);

app.listen();
