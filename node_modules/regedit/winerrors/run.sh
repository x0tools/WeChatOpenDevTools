#!/bin/sh
node parseErrors.js > parsed.json
node generateErrorDeclaration.js > generatedErrorObjects.js
node generateErrorsJS.js > ../errors1.js
rm ../errors.js
mv ../errors1.js ../errors.js