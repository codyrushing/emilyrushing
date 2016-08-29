export default function(){
  document.querySelectorAll("header .nav-toggle")[0].addEventListener("click", function(e){
    e.preventDefault();
    document.body.classList.toggle("nav-open");
  })
}
