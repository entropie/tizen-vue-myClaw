#!/bin/env ruby


file = ARGV.shift

require "nokogiri"
require "uri"

#base_uri = URI('./')


doc = Nokogiri::HTML(File.readlines(file).join)

base = Nokogiri::XML::Node.new("base", doc)
base["href"] = "http://wecoso.org/~mit/stuff/myClaw/"

doc.at_css("head").prepend_child base

File.open(file, "w+"){|fp| fp.puts(doc.to_html)}
