var dateToday = new Date().toISOString().slice(0,10);

var Slideshow = Ractive.extend({
	template: '#template',

	// method for changing the currently displayed image
	goto: function ( imageNum ) {
		var images = this.get( 'images' );

		// Make sure the image number is between 0...
		while ( imageNum < 0 ) {
			imageNum += images.length;
		}

		// ...and the maximum
		imageNum %= images.length;

		// Then, update the view
		this.set({
			image: images[ imageNum ],
			current: imageNum,
			total: images.length
		});
	},

	s3select: function(dateprefix) {
		var that = this;
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					contents = httpRequest.responseXML.getElementsByTagName('Contents');
					// console.log(contents);
					var images = [];
					for (i=0; i < contents.length; i++) {
						var src = contents[i].getElementsByTagName('Key')[0].textContent;
						var d = new Date(src.split('/').reverse()[0].slice(0,-5)*1000);
						var size = contents[i].getElementsByTagName('Size')[0].textContent;
						images.push( { src: "https://s3-ap-southeast-1.amazonaws.com/cam.hackerspace.sg/" + src, date: d, size: size} );
					}
					// Newest images come first
					that.set({ images: images.reverse() });
					that.goto( 0 );
				}
			}
		};
		httpRequest.open('GET', "https://s3-ap-southeast-1.amazonaws.com/cam.hackerspace.sg/?prefix=" + dateprefix);
		httpRequest.send();
	},

	// initialisation code
	oninit: function ( options ) {

		// Select images from today
		// this.s3select(dateToday);

		// start with the first image
		this.goto( 0 );
	}
});


var slideshow = new Slideshow({
	el: container,
	// TODO: Have to images: {} to stop goto func freaking (is there something better?)
	data: { date: dateToday, images: {} }
});

slideshow.observe('date', slideshow.s3select);

this.addEventListener("keydown", handleKeydown, false);

function handleKeydown(e) {
		var c = slideshow.get("current");
		if (e.keyCode == 37) {
			//console.log("prev", c - 1);
			slideshow.goto(c - 1);
		}
		if (e.keyCode == 39) {
			//console.log("next", c + 1);
			slideshow.goto(c + 1);
		}
	}


