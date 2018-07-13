#!/usr/bin/env bash

node build/build.js

tizen=/home/mit/tizen-studio/tools/ide/bin/tizen
sdb=/home/mit/tizen-studio/tools/sdb
cd tizen
rm myCV.wgt .manifest.tmp author-signature.xml signature1.xml #doesn't seem to work without some cleanup here
$tizen clean
$tizen build-web # build a web project
$tizen package -t wgt -s my # package the widget using my signature stored elsewhere
$tizen install -n myCV.wgt # install the widget on emulator attached to sdb
$tizen run -p uk1A2bnAIo  # run the app (has this name for now?)
# $sdb dlog ConsoleMessage:V # watch console output for javascript logs


