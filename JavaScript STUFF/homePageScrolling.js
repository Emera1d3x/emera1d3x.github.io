const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=> {
        console.log(entry);
        if (entry.isIntersecting){
            entry.target.classList.add('fadingIn');
        } else {
            entry.target.classList.remove('fadingIn');
        }
    });
});

const hiddenElements = document.querySelectorAll('.fadeIn');
hiddenElements.forEach((el)=>observer.observe(el));