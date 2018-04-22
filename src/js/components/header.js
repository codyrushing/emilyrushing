export default function(){
  var navIsOpen = false;
  document.querySelectorAll("header .nav-toggle")[0].addEventListener("click", function(e){
    e.preventDefault();
    if(!navIsOpen) window.scrollTo(0,0);
    document.body.classList.toggle("nav-open");
    navIsOpen = !navIsOpen;
  })
}
