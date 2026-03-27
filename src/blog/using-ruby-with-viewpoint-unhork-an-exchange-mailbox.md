---
title: "Using Ruby with Viewpoint to Unhork an Exchange Mailbox"
date: 2012-10-30
description: How I used the Viewpoint Ruby gem and Exchange Web Services to batch-delete over a million items from a user's Deleted Items folder.
tags:
  - ruby
  - exchange
  - coding
---

_(It's been awhile since I've done a technical post, so I may do that on the next few.)_

Through some craziness we haven't figured out, a user at work managed to get over *pinky to mouth* one million items in their Deleted Items folder in Outlook which is hooked up to our Exchange server. This turned into an interesting problem.

Needless to say, that is a stupid amount of items that Outlook had issues with processing. Telling Outlook to empty the trash would send it out into la-la land as a hung process. I'm thinking it was trying to pull all million items into memory to do a delete on them. I'm sure if we let it sit long enough it may have done something, but it just really didn't like that volume of stuff. Similarly, using another Exchange or IMAP client like Mail.app, Thunderbird, and mutt had similar issues as they needed to retrieve the million headers before they would do anything. Deleting it batches at a time by hand worked, but was slow and required someone to do it by hand which…we can see the issue there.

As is often the case, the solution to the problem could be had by creating a small script to do the pain in the butt stuff for you. Actually, the big reason a script works here is that it could be smart and just snag small batches and work on those. Luckily, a few months back I had played with [Viewpoint](https://github.com/zenchild/Viewpoint), a "ruby client access library for Microsoft Exchange Web Services." Previously, I had used Viewpoint to read mail in a certain folder and generate stats for it, so using it to identify and delete messages would be a snap.

The first go around I was grabbing the messages in a batch and deleting them one by one. That works, but was a bit slow. I figured out how to do something that hasn't been written into Viewpoint yet: a batch delete. That sped up the operation by 4.5 times or so. This still took over a day to run. It also couldn't delete everything. For some reason it seemed to not be able to delete calendar invites. After the script was running entirely, we were left with about 30,000 items left behind, but Outlook could handle wiping the rest of them out if we left it alone for 20 minutes or so.

I've attached the script I threw together in case anyone else runs into the problem and to see how it was done if they want to do something similar with viewpoint.

```ruby
#!/usr/bin/env ruby
require 'rubygems'
require 'optparse'
require 'viewpoint'
require 'base64'

USERNAME = 'your user here'
PASSWORD = 'your base64 encoded password here'

options = {
  :folder => 'Deleted Items',
  :url => 'https://example.com/ews/exchange.asmx'
}
offset = 0

opts = OptionParser.new
opts.on('-f FOLDER', '--folder FOLDER',
        'Read the data from this mail folder. (Default: nagios)') do |f|
  options[:folder] = f
end
opts.on('-o OFFSET', '--offset OFFSET',
        'Start at this offset, rather than the defult of 0.') do |o|
  offset = o.to_i
end
opts.on('-u URL', '--url URL',
        'Use this URL to communicate with the exchange server (default: ' +
        'https://example.com/ews/exchange.asmx)') do |u|
  options[:url] = u
end
opts.on_tail('-h', '--help', 'Show this message') do
  puts opts
  exit
end
opts.parse(ARGV)

Viewpoint::EWS::EWS.endpoint = options[:url]
Viewpoint::EWS::EWS.set_auth(USERNAME, Base64.decode64(PASSWORD))

# Get the trashfolder
trash = Viewpoint::EWS::Folder.get_folder_by_name(options[:folder])

# Returns the error number after doing the delete. Expects an array of ids
def do_delete(ids)
  # I'm not wild about the following code, there's got to be a better way
  # to do this.
  delete_result = Viewpoint::EWS::SOAP::ExchangeWebService.delete_item(
                      ids, 'HardDelete', 'SendToNone')
  error_no = delete_result.soap_response.xpath('//*/@ResponseClass').count do |sr|
    sr.native_element.value == 'Error'
  end
  return error_no
end

# Item shape is always the same
item_shape = { :base_shape => 'IdOnly' }

total_size = 0
while (work_items =
       trash.find_items({:item_shape => item_shape, :indexed_page_item_view => {
                            :max_entries_returned => 500,
                            :base_point => 'Beginning',
                            :offset => offset
                          }
                        })).size != 0 do
  delete_me = work_items.collect { |wi| wi.id }
  error_no = do_delete(delete_me)

  offset += error_no
  good_size = work_items.size - error_no
  total_size += good_size

  time = Time.now
  printf("%02d:%02d:%02d %8d  %3d  %3d\n", time.hour, time.min, time.sec,
         total_size, good_size, error_no)
end
```
