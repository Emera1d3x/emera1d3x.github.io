document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove' , (e) => {
        cursor.style.left = (e.clientX)  + 'px';
        cursor.style.top = (e.clientY) + 'px';
    });
    const aboutMe = document.querySelector('.aboutMe');
    aboutMe.addEventListener('mouseover', () => {
        cursor.style.backgroundColor = '#006a43';
    });
    aboutMe.addEventListener('mouseout', () => {
        cursor.style.backgroundColor = 'rgba(248, 236, 101, 0.721)';
    });  
    
    const leaves = document.querySelector(".leaves");
    document.addEventListener("mousemove",function(e){
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left - rect.width / 2;
        let y = e.clientY - rect.top - rect.height / 2;
        leaves.style.transform = `rotateX(${-y / 50}deg) rotateY(${x / 30}deg)`;
    });
});