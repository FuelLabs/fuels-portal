export STORYBOOK_DIST=${STORYBOOK_DIST:=./dist/storybook}

pnpx storybook build -o $STORYBOOK_DIST
