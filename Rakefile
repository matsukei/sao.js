# coding: utf-8
require 'pathname'

ROOT = Pathname.pwd

desc 'Show the All-TestRunner in Firefox(Win) or Safari(Mac).'
task :test do
  runner = ROOT.join('all_tests.html')

  case RbConfig::CONFIG['target_os']
  # Windows
  when /mswin|mingw|cygwin/
    `firefox -url #{runner}`
  # MacOS
  when /darwin/
    `open -a safari #{runner}`
  else
    puts "Please open #{runner} in your Safari or Firefox."
  end
end

desc 'Run closurebuilder.py to compile. You need a java and python runtime in your enviromnet.'
task :compile do
  builder = ROOT.join('closure-library', 'closure', 'bin', 'build', 
                      'closurebuilder.py')
  cmd = "python #{builder}".tap do |c|
    c << " --root=\"#{ROOT.join('closure-library')}\""
    c << " --root=\"#{ROOT.join('sao')}\""
    c << " --namespace=\"sao\""
    c << " --output_mode=compiled"
    c << " --compiler_jar=\"#{ROOT.join('closure-compiler', 'compiler.jar')}\""
    c << " --compiler_flags=\"--compilation_level=ADVANCED_OPTIMIZATIONS\""
    c << " --compiler_flags=\"--warning_level=VERBOSE\""
    c << " --compiler_flags=\"--output_wrapper=(function(){%output%})()\""
    c << " > sao.js"
  end
  
  puts '--------'
  puts "Run: #{cmd}"
  puts '--------'

  system cmd
end