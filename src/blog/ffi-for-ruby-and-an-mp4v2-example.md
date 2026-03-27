---
title: "FFI for Ruby and an mp4v2 Example"
date: 2012-11-04
description: Using the FFI gem to call libmp4v2 from Ruby directly, eliminating the need for a C++ subprocess.
tags:
  - ruby
  - ffi
  - mp4
  - coding
---

Previously on the blog, I automated chapter insertion around commercials but had to call out to a small C++ application to add chapters using libmp4v2.

I discovered FFI (foreign function interface), a Ruby gem described as "a ruby extension for programmatically loading dynamic libraries, binding functions within them, and calling those functions from Ruby code."

The gem intelligently detects the Ruby VM flavor and platform, working correctly whether using JRuby or Windows without requiring changes.

For adding chapters to mp4/m4v files, five functions are needed: `MP4Modify`, `MP4AddChapterTextTrack`, `MP4AddChapter`, `MP4Close`, and `MP4Optimize`. Since most of these have default C preprocessor arguments, I wrap the FFI bindings in Ruby methods that provide sensible defaults.

```ruby
module Mp4v2
  extend FFI::Library

  ffi_lib ['libmp4v2']

  typedef :pointer, :MP4FileHandle
  typedef :uint32, :MP4TrackId
  typedef :uint64, :MP4Duration

  MP4_INVALID_FILE_HANDLE = nil

  attach_function(:c_mp4_modify, :MP4Modify, [:string, :uint32, :uint32],
                  :MP4FileHandle)
  def Mp4v2.mp4_modify(filename, verbosity = 0)
    c_mp4_modify(filename, verbosity, 0)
  end

  attach_function(:c_mp4_optimize, :MP4Optimize, [:string, :string, :uint32],
                  :bool)
  def Mp4v2.mp4_optimize(filename, new_filename = nil, verbosity = 0)
    c_mp4_optimize(filename, new_filename, verbosity)
  end

  attach_function(:c_mp4_add_chapter_text_track, :MP4AddChapterTextTrack,
                  [:MP4FileHandle, :MP4TrackId, :uint32], :MP4TrackId)
  def Mp4v2.mp4_add_chapter_text_track(h_file, ref_track_id, timescale = 0)
    c_mp4_add_chapter_text_track(h_file, ref_track_id, timescale)
  end

  attach_function(:c_mp4_add_chapter, :MP4AddChapter,
                  [:MP4FileHandle, :MP4TrackId, :MP4Duration, :string], :void)
  def Mp4v2.mp4_add_chapter(h_file, chapter_track_id, chapter_duration,
                            chapter_title = nil)
    c_mp4_add_chapter(h_file, chapter_track_id, chapter_duration, chapter_title)
  end

  attach_function :mp4_close, :MP4Close, [:MP4FileHandle], :void
end
```

And usage:

```ruby
FILENAME = '/Path/to/some/file.m4v'
m4vfile = Mp4v2::mp4_modify(FILENAME)
chapter_track = Mp4v2::mp4_add_chapter_text_track(m4vfile, 1, 1)

Mp4v2::mp4_add_chapter(m4vfile, chapter_track, 10)
Mp4v2::mp4_add_chapter(m4vfile, chapter_track, 10)

Mp4v2::mp4_close(m4vfile)

if Mp4v2::mp4_optimize(FILENAME)
  puts "SUCCESS"
else
  puts "Boo!"
end
```

Using FFI allows all the work to be done in Ruby, eliminating system calls to launch external C++ programs, which simplifies future installations.
