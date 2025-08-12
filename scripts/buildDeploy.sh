cd ..
npx rimraf .next
npm run build
mkdir .next/standalone/.next/static
cp -r .next/static/* .next/standalone/.next/static
mkdir .next/standalone/public
cp -r public/* .next/standalone/public
zip -r nextjs-app.zip .next/standalone/*