#!/bin/bash
bucket=s3://cam.hackerspace.sg
today=$(date -I)
umask 002
/opt/vc/bin/raspistill -vf -hf -n -o /tmp/still.jpg
dir=/root/out
test -d $dir || mkdir -p $dir
fn=$(date +%s).webp
webp=$dir/$fn
cwebp -quiet /tmp/still.jpg -o $webp
if test $(stat -c %s "$webp") -lt 60000
then
	echo "Failed, file too small (probably too dark)"
	rm $webp
	exit
fi
if s3cmd put --storage-class=STANDARD_IA -P -m image/webp $webp $bucket/$today/$fn
then
	mv -f $webp $dir/latest.webp
	s3cmd put -rr --add-header="Cache-Control:max-age=3600" -P $dir/latest.webp $bucket
	convert -resize 1024x768 /tmp/still.jpg $dir/latest.jpg
	s3cmd put -rr --add-header="Cache-Control:max-age=3600" -P $dir/latest.jpg $bucket
fi
