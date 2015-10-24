# cam.hackerspace.sg 2.0

Previous script
[source](https://github.com/kaihendry/Praze/tree/cam.hackerspace.sg) was embarrassingly
engineered by myself. It was **pulling** snapshots from the Rpi camera
triggered by a URL which presents all sorts of challenges in itself since it's
difficult to address the Rpi from the Internet since IPv6 doesn't exist yet.

Now we **push** camera snapshots to Amazon S3 with a [cam.timer](cam/cam.timer) which
[uploads](cam/s3snapshot.sh) to:

	https://s3-us-west-2.amazonaws.com/hsgcamice/$(date +%Y-%m-%d)/$(date +%s).webp

Also for clients that do not support WebP image, a lower resolution JPEG file is uploaded to:

* <https://s3-ap-southeast-1.amazonaws.com/cam.hackerspace.sg/lastfetched.jpg>

We do not archive the JPEG since it's low resolution and not as space efficient
as the WebP format.

# Static Web slideshow

After trying <https://github.com/rgrp/s3-bucket-listing> & writing
<https://github.com/kaihendry/s3listing>, I realised you can make a Web
interface to an S3 bucket if you carefully use prefixes. The prefixes in our
case our YYYY-MM-DD.

# Backup of old camera snapshots

Singapore region of S3 does not support
[Glacier](https://aws.amazon.com/glacier/). So previous archives have been
moved to `s3://hsgcamice`, where they are stored in Glacier after 2 months.

<https://s3-us-west-2.amazonaws.com/hsgcamice/>
