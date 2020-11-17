#Note: 代码提交脚本。每次提交可自动更新版本号，不用再手动修改

url1=\.\/pcweb\/pages\/index.html
url2=\.\/static\/js\/app.json

version=`sed -n 16p $url1`
 
# version_number=${version:0-2:1}
# version_number=`expr match "$version" "(\.[0-9]+\')"`
version_number=`echo $version | sed "s/.*\.\([0-9]*\).*/\1/g"`
version_number=$((10#${version_number}+1))
sed -i "16s/.*/    window.webVer = '0.0.$version_number';/" $url1
sed -i "1s/.*/{\"version\": \"0.0.$version_number\"}/" $url2

 

git add .
read -p "本次提交信息: " description
git commit -m $description
git pull
git push

echo '--代码提交结束--'