import _ from 'lodash';
import { Block, makeRoute } from 'dwayne';
import Promise from 'el-promise';
import template from './index.pug';

let currentFetchIfUserConfirmed = Promise.resolve();

class Register extends Block {
  static template = template();
  static routerOptions = {
    name: 'register',
    parent: 'auth',
    path: '/register'
  };

  constructor(opts) {
    super(opts);

    this.reset();
  }

  beforeLoadRoute() {
    setTimeout(() => {
      this.title.text(this.i18n.t('titles.register'));
    }, 0);
  }

  beforeLeaveRoute() {
    this.reset();
  }

  reset() {
    _.assign(this, {
      attemptedToSubmit: false,
      submitting: false,
      registerSuccess: false,
      login: '',
      email: '',
      password: '',
      passwordRepeat: '',
      loginError: null,
      emailError: null,
      passwordError: null
    });
  }

  sendOneMoreConfirmation = () => {
    currentFetchIfUserConfirmed.abort();

    currentFetchIfUserConfirmed = this.globals.usersFetch
      .sendOneMore({
        query: {
          email: this.email
        }
      });
    currentFetchIfUserConfirmed.catch(() => {});
  };

  submit = (e) => {
    e.preventDefault();

    this.attemptedToSubmit = true;

    if (this.form.validate()) {
      return;
    }

    const {
      login,
      email,
      password
    } = this;

    const data = {
      login,
      email,
      password
    };

    this.submitting = true;

    this.globals.usersFetch
      .register({ data })
      .then(({ json }) => {
        const { errors } = json;

        if (!errors) {
          this.registerSuccess = true;

          return;
        }

        this.loginError = errors.login;
        this.emailError = errors.email;
        this.passwordError = errors.password;
      })
      .finally(() => {
        this.submitting = false;
      });
  };
}

Block.block('Register', Register.wrap(
  makeRoute()
));
