import _ from 'lodash';
import { Block, makeRoute } from 'dwayne';
import template from './index.pug';
import { TIME_TO_ALERT_AFTER_LOGIN } from '../../constants';
import { errors } from '../../../config/constants.json';

class Login extends Block {
  static template = template();
  static routerOptions = {
    name: 'login',
    parent: 'auth',
    path: '/login'
  };

  constructor(opts) {
    super(opts);

    this.reset();
  }

  beforeLoadRoute() {
    setTimeout(() => {
      this.title.text(this.i18n.t('titles.login'));
    }, 0);
  }

  beforeLeaveRoute() {
    this.reset();
  }

  reset() {
    _.assign(this, {
      submitting: false,
      loginSuccess: false,
      loginError: false,
      login: '',
      password: ''
    });
  }

  submit = (e) => {
    e.preventDefault();

    const {
      login,
      password
    } = this;
    const data = {
      login,
      password
    };

    this.submitting = true;
    this.loginError = false;

    this.globals.usersFetch
      .login({ data })
      .then(({ json: user }) => {
        this.loginSuccess = true;
        this.globals.changeUser(user);

        setTimeout(
          this.globals.addNotConfirmedAlertIfNeeded,
          TIME_TO_ALERT_AFTER_LOGIN
        );
      }, (err) => {
        const message = err.response.data;

        if (message === errors.WRONG_LOGIN_OR_PASSWORD) {
          this.loginError = true;
        } else {
          throw err;
        }
      })
      .finally(() => {
        this.submitting = false;
      });
  };
}

Block.block('Login', Login.wrap(
  makeRoute()
));
