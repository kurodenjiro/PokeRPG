@echo off
"C:\Program Files (x86)\Java\jdk1.7.0_21\jre\bin\java.exe" -jar compiler.jar --warning_level QUIET --js pokerpg.client.js --js_output_file pokerpg.client.tmp.js
del pokerpg.client.js
ren pokerpg.client.tmp.js pokerpg.client.js
pause