import { defineNuxtPlugin } from '#app';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import 'summernote/dist/summernote-bs4.min.css';
import 'summernote/dist/summernote-bs4.min.js';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    window.$ = window.jQuery = jQuery;
  }
});
