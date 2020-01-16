
const $ = require('jquery')
const popper = require('popper.js')
const bootstrap = require('bootstrap')
const swiper = require('swiper')

//plugins globais
window.$ = $;
window.swiper = swiper;

//dropdowns criados by joy integrados com os do bts4 
$('.dropdown.dropdown-scale-wrap').on('show.bs.dropdown', function(e){
    $(this).children('.dropdown-scale').addClass('active');
})
$('.dropdown.dropdown-scale-wrap').on('hidden.bs.dropdown', function(e){
    $(this).children('.dropdown-scale').removeClass('active');
})

new swiper.default('.menu-slider',{
    slidesPerView: 1,
});