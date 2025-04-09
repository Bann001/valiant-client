#!/bin/sh

# Recreate config file
rm -rf /usr/share/nginx/html/env.js
touch /usr/share/nginx/html/env.js

# Add assignment 
echo "window.env = {" >> /usr/share/nginx/html/env.js

# Read each line in .env file
# Each line represents key=value pairs
if [ -f .env ]; then
  while read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [ "${line:0:1}" = "#" ] || [ -z "$line" ]; then
      continue
    fi
    
    # Split env variables by character `=`
    if printf '%s\n' "$line" | grep -q -e '='; then
      varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
      varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
    fi

    # Read value of current variable if exists as Environment variable
    value=$(eval echo \$$varname)
    # Otherwise use value from .env file
    [ -z "$value" ] && value=${varvalue}
    
    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >> /usr/share/nginx/html/env.js
  done < .env
fi

# Add all environment variables that start with REACT_APP_
for envvar in $(printenv | grep -E '^REACT_APP_'); do
  key=$(echo "$envvar" | sed -e 's/=.*//')
  value=$(eval echo \$$key)
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env.js
done

# Add API_URL from environment variable or use default
API_URL=${API_URL:-"http://localhost:5000/api"}
echo "  API_URL: \"$API_URL\"," >> /usr/share/nginx/html/env.js

echo "};" >> /usr/share/nginx/html/env.js

# Set correct permissions
chmod 644 /usr/share/nginx/html/env.js