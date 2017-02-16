import { Block, makeRoute } from 'dwayne';
import template from './index.pug';

class Home extends Block {
  static template = template();
  static routerOptions = {
    name: 'home',
    path: '/'
  };

  beforeLoadRoute() {
    setTimeout(() => {
      this.title.text(this.i18n.t('titles.home'));
    }, 0);
  }
}

Block.block('Home', Home.wrap(
  makeRoute()
));
