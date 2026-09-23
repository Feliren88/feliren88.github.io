# Local-development shim. Not loaded by GitHub Pages, and not part of the site.
#
# Ruby 3.2 deleted the object taint API. liquid 4.0.3 still calls it on every
# rendered variable and inside its `escape` filter. That version is pinned
# exactly by the `github-pages` gem (223 -> jekyll 3.9.0), and GitHub Pages
# builds this site with that same pin, so the gem cannot be upgraded without
# also moving the deploy off the GitHub Pages builder.
#
# Restoring the methods as no-ops makes `jekyll build` run on a current Ruby.
# Taint tracking was a no-op in Ruby 2.7+ anyway, so nothing is being weakened.
# Loaded via RUBYOPT by the Makefile; see `make build`.
unless Object.new.respond_to?(:tainted?)
  class Object
    def tainted?;   false end
    def untrusted?; false end
    def taint;      self  end
    def untaint;    self  end
    def trust;      self  end
    def untrust;    self  end
  end
end
