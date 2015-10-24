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
						var size = contents[i].getElementsByTagName('Size')[0].textContent;
						images.push( { src: "https://s3-ap-southeast-1.amazonaws.com/cam.hackerspace.sg/" + src, size: size} );
					}
					// TODO sort oldest images are last
					that.set({ images: images });
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
		var dateToday = new Date().toISOString().slice(0,10);
		// this.s3select(dateToday);

		// start with the first image
		this.goto( 0 );
	}
});


var slideshow = new Slideshow({
	el: container,
	// Have to images: {} to stop goto func freaking
	data: { date: "2015-07-09", images: {} }
});

slideshow.observe('date', slideshow.s3select);
