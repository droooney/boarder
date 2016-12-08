import { D, Block, makeRoute } from 'dwayne';
import template from './index.pug';
import { usersFetch } from '../../fetchers';

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

  beforeLeaveRoute() {
    this.reset();
  }

  reset() {
    D(this).assign({
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

  submit = (e) => {
    e.preventDefault();

    const {
      login,
      email,
      password
    } = this;
    const errors = this.form.validate();

    this.attemptedToSubmit = true;

    if (!errors) {
      const data = {
        login,
        email,
        password
      };

      this.submitting = true;

      usersFetch
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
    }
  };
}

const wrap = Register
  .wrap(makeRoute());

Block.register('Register', wrap);
