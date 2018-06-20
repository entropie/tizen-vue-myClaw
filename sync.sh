#!/usr/bin/env bash
npm run build
cp tizen/index.html tizen/index.html.bak
ruby basehref.rb tizen/index.html
ssh hive "rm -rf ~/public_html/stuff/myClaw"
scp -r tizen hive:public_html/stuff/myClaw
mv tizen/index.html.bak tizen/index.html
