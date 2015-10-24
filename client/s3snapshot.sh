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
	echo "Failed, file too small (probably too dark or transfer error)"
	rm $webp
	exit
fi
if s3cmd put --storage-class=STANDARD_IA -P -m image/webp $webp $bucket/$today/$fn
then
    rm $webp
    echo $today/$fn > $dir/latest.txt
    s3cmd put -rr -P $dir/latest.txt $bucket/latest.txt
fi
