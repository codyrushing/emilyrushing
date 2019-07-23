require('viewport-units-buggyfill').init();
import WebFont from 'webfontloader';
import App from './app';

WebFont.load({
  google: {
    families: ['Playfair Display', 'Roboto:400,400i,700']
  }
});

const app = new App();
