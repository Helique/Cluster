target="../config/credentials"
if [ ! -d "$target" ]; then
   mkdir "$target"
fi
cp -r ../config/credential_templates/* "$target"
