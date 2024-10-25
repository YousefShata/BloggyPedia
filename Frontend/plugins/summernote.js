import { defineNuxtPlugin } from '#app';
// import 'popper.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// import 'summernote/dist/summernote-bs4.min.css';
// import 'summernote/dist/summernote-bs4.min.js';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const jQuery = require('jquery');  // Lazy-load jQuery
    require('popper.js');
    require('bootstrap/dist/css/bootstrap.min.css');
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    require('summernote/dist/summernote-bs4.min.css');
    require('summernote/dist/summernote-bs4.min.js');

    window.$ = window.jQuery = jQuery;
  }
});
