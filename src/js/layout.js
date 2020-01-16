
const $ = require('jquery')
const popper = require('popper.js')
const bootstrap = require('bootstrap')
const swiper = require('swiper')

//plugins globais
window.$ = $;
window.swiper = swiper;

new swiper.default('.menu-slider',{
    slidesPerView: 1,
});