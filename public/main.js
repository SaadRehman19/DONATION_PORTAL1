//Initialize and add the map
function initMap() {
    //your location s
    const loc = {
        lat: 24.860735,
        lng: 67.001137
    };
    //centered map on location 
    const map = new google.maps.Map(document.querySelector('.map'), {
        zoom: 14,
        center: loc
    });
    //the marker
    const marker = new google.maps.Marker({ position: loc, map: map });
}

//sticky menu background
window.addEventListener('scroll', function() {
    if (window.scrollY > 150) {
        document.querySelector('#navbar').style.opacity = 0.9;
    } else {
        document.querySelector('#navbar').style.opacity = 1;
    }
});
//Smooth srolling
$('#navbar a,.btn').on('click', function(event) {
    if (this.hash !== '') {
        event.preventDefault();
        const hash = this.hash;
        $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            },
            800);

    }
});